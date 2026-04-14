import { NextResponse } from "next/server";
import { signalList, walletHistory } from "@/lib/onchainos";
import { getSurveillanceData, saveSurveillanceData } from "@/lib/store";

export const dynamic = "force-dynamic";

const COPY_WINDOW_MS = 48 * 60 * 60 * 1000; // wallets that bought ≤48h after you = potential copiers

interface WatcherAgg {
  address: string;
  copies: number;
  tokens: Set<string>;
  lags: number[];
  firstSeenMs: number;
  lastActivityMs: number;
  tokenSymbols: Set<string>;
}

interface TimelineEvent {
  time: string;
  event: string;
  type: string;
  severity: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const refresh = searchParams.get("refresh") === "true";

  const cached = getSurveillanceData();
  if (cached && !refresh) {
    const age = Date.now() - new Date(cached.lastScanned).getTime();
    if (age < 5 * 60 * 1000) return NextResponse.json({ ok: true, data: cached });
  }

  try {
    const [signalRes, histRes] = await Promise.all([
      signalList("xlayer").catch(() => ({ ok: false, data: null })),
      walletHistory(undefined, "50").catch(() => ({ ok: false, data: null })),
    ]);

    // ── 1. Extract my token trades: { tokenAddress → earliest buy time ms } ──
    const myTokens = new Map<string, { firstTime: number; symbol: string }>();
    const histArray = histRes.ok && Array.isArray(histRes.data) ? histRes.data : [];
    for (const group of histArray) {
      const orders = (group as Record<string, unknown>).orderList;
      if (!Array.isArray(orders)) continue;
      for (const tx of orders) {
        const t = tx as Record<string, string>;
        const addr = (t.tokenAddress || t.tokenContractAddress || "").toLowerCase();
        if (!addr) continue;
        const time = Number(t.txTime || 0);
        if (!time) continue;
        const existing = myTokens.get(addr);
        if (!existing || time < existing.firstTime) {
          myTokens.set(addr, { firstTime: time, symbol: t.coinSymbol || t.symbol || "?" });
        }
      }
    }

    // ── 2. Walk signals, find wallets that bought same token AFTER me within window ──
    const watchers = new Map<string, WatcherAgg>();
    const copyEvents: Array<{
      wallet: string;
      token: string;
      tokenAddr: string;
      lagMs: number;
      signalTime: number;
    }> = [];

    const signals =
      signalRes.ok && Array.isArray(signalRes.data)
        ? (signalRes.data as Array<Record<string, unknown>>)
        : [];

    for (const sig of signals) {
      const token = sig.token as Record<string, string> | undefined;
      const tokenAddr = (token?.tokenAddress || "").toLowerCase();
      if (!tokenAddr || !myTokens.has(tokenAddr)) continue;

      const mine = myTokens.get(tokenAddr)!;
      const signalTime = Number(sig.timestamp || 0);
      if (!signalTime) continue;

      const lagMs = signalTime - mine.firstTime;
      if (lagMs <= 0 || lagMs > COPY_WINDOW_MS) continue; // they must buy AFTER me, within window

      const triggerField = String(sig.triggerWalletAddress || "");
      const wallets = triggerField.split(",").map((w) => w.trim()).filter(Boolean);

      for (const wallet of wallets) {
        const key = wallet.toLowerCase();
        let w = watchers.get(key);
        if (!w) {
          w = {
            address: wallet,
            copies: 0,
            tokens: new Set(),
            lags: [],
            firstSeenMs: signalTime,
            lastActivityMs: signalTime,
            tokenSymbols: new Set(),
          };
          watchers.set(key, w);
        }
        w.copies += 1;
        w.tokens.add(tokenAddr);
        w.tokenSymbols.add(token?.symbol || mine.symbol);
        w.lags.push(lagMs);
        w.firstSeenMs = Math.min(w.firstSeenMs, signalTime);
        w.lastActivityMs = Math.max(w.lastActivityMs, signalTime);

        copyEvents.push({
          wallet,
          token: token?.symbol || mine.symbol,
          tokenAddr,
          lagMs,
          signalTime,
        });
      }
    }

    // ── 3. Classify and score each watcher ──
    const watcherList = Array.from(watchers.values()).map((w) => {
      const avgLagMs = w.lags.reduce((s, x) => s + x, 0) / w.lags.length;
      const avgLagH = avgLagMs / (60 * 60 * 1000);
      const type = avgLagH < 1 ? "bot" : avgLagH < 6 ? "kol" : "whale";
      const label = type === "bot" ? "Bot Copier" : type === "kol" ? "KOL Tracker" : "Whale Watcher";
      const similarity = Math.min(100, w.copies * 20 + w.tokens.size * 15);
      return {
        address: w.address,
        label,
        type,
        similarity,
        lastActivity: new Date(w.lastActivityMs).toISOString(),
        firstSeen: new Date(w.firstSeenMs).toISOString(),
      };
    });
    watcherList.sort((a, b) => b.similarity - a.similarity);

    // ── 4. Build timeline from real copy events (most recent 10) ──
    const timeline: TimelineEvent[] = copyEvents
      .sort((a, b) => b.signalTime - a.signalTime)
      .slice(0, 10)
      .map((e) => {
        const lagH = e.lagMs / (60 * 60 * 1000);
        const severity = lagH < 1 ? "high" : lagH < 6 ? "medium" : "low";
        const short = `${e.wallet.slice(0, 6)}…${e.wallet.slice(-4)}`;
        const lagLabel = lagH < 1 ? `${Math.round(lagH * 60)}m` : `${lagH.toFixed(1)}h`;
        return {
          time: new Date(e.signalTime).toISOString(),
          event: `${short} copied your ${e.token} trade +${lagLabel} later`,
          type: "copy",
          severity,
        };
      });

    // ── 5. Threat level from real data ──
    const highSim = watcherList.filter((w) => w.similarity >= 70).length;
    const mediumSim = watcherList.filter((w) => w.similarity >= 40).length;
    const threatLevel =
      highSim >= 3 ? "critical" : highSim >= 1 ? "high" : mediumSim >= 2 ? "medium" : watcherList.length > 0 ? "low" : "none";
    const exposureScore = Math.min(100, watcherList.length * 10 + highSim * 20 + mediumSim * 5);

    const data = {
      lastScanned: new Date().toISOString(),
      threatLevel,
      exposureScore,
      watchers: watcherList.slice(0, 10),
      timeline,
    };

    saveSurveillanceData(data);
    return NextResponse.json({ ok: true, data });
  } catch (err) {
    if (cached) return NextResponse.json({ ok: true, data: cached });
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
