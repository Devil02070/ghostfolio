import { NextResponse } from "next/server";
import { walletBalance } from "@/lib/onchainos";
import { getDecoyHistory, addPrivacySnapshot } from "@/lib/store";

export const dynamic = "force-dynamic";

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((s, v, i) => s + v * (b[i] || 0), 0);
  const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

interface BalToken {
  symbol: string;
  usdValue: string;
  balance: string;
  tokenPrice: string;
  tokenContractAddress: string;
}

export async function GET() {
  try {
    // ── Real holdings (best-effort; decoys alone are enough to build observer view) ──
    const realTokens: Array<{ symbol: string; value: number; allocation: number }> = [];
    let totalUsd = 0;

    const balRes = await walletBalance().catch(() => ({ ok: false, data: null }));
    if (balRes.ok) {
      const data = balRes.data as { details?: Array<{ tokenAssets?: BalToken[] }>; totalValueUsd?: string };
      const details = data.details || [];
      for (const group of details) {
        if (!group.tokenAssets) continue;
        for (const t of group.tokenAssets) {
          const val = parseFloat(t.usdValue || "0");
          if (val < 0.01) continue;
          totalUsd += val;
          realTokens.push({ symbol: t.symbol, value: val, allocation: 0 });
        }
      }
      realTokens.sort((a, b) => b.value - a.value);
      for (const t of realTokens) t.allocation = totalUsd > 0 ? Math.round((t.value / totalUsd) * 100) : 0;
    }

    // ── Observer view: mix (reduced) real tokens with decoy influence ──
    const decoys = getDecoyHistory().filter((d) => d.status === "completed");
    const observerMap = new Map<string, number>();

    for (const t of realTokens) {
      observerMap.set(t.symbol, t.value * 0.8);
    }
    for (const d of decoys) {
      const existing = observerMap.get(d.toToken) || 0;
      observerMap.set(d.toToken, existing + d.amountUsd * 3);
      const fromVal = observerMap.get(d.fromToken) || 0;
      observerMap.set(d.fromToken, Math.max(0, fromVal - d.amountUsd * 2));
    }

    const observerTotal = Array.from(observerMap.values()).reduce((s, v) => s + v, 0);
    const observerTokens = Array.from(observerMap.entries())
      .map(([symbol, value]) => ({
        symbol,
        value: Math.round(value * 100) / 100,
        allocation: observerTotal > 0 ? Math.round((value / observerTotal) * 100) : 0,
      }))
      .sort((a, b) => b.value - a.value)
      .filter((t) => t.allocation > 0);

    // ── Privacy score ──
    const allSymbols = [...new Set([...realTokens.map((t) => t.symbol), ...observerTokens.map((t) => t.symbol)])];
    const realVec = allSymbols.map((s) => realTokens.find((t) => t.symbol === s)?.allocation || 0);
    const obsVec = allSymbols.map((s) => observerTokens.find((t) => t.symbol === s)?.allocation || 0);
    const similarity = cosineSimilarity(realVec, obsVec);
    const privacyScore = realTokens.length === 0 ? (observerTokens.length > 0 ? 100 : 0) : Math.round((1 - similarity) * 100);

    // ── Snapshot ──
    const totalDecoyCost = decoys.reduce((s, d) => s + d.gasCost, 0);
    const today = new Date().toISOString().split("T")[0];
    addPrivacySnapshot({
      date: today,
      score: privacyScore,
      cost: Math.round(totalDecoyCost * 100) / 100,
      watchers: 0,
      tokensTracked: realTokens.length,
    });

    return NextResponse.json({
      ok: true,
      data: {
        realProfile: {
          holdings: realTokens,
          totalValue: Math.round(totalUsd * 100) / 100,
          strategy: inferStrategy(realTokens),
        },
        observedProfile: {
          holdings: observerTokens,
          inferredStrategy: inferStrategy(observerTokens),
        },
        privacyScore,
        similarity: Math.round(similarity * 100),
        decoysDeployed: decoys.length,
        walletAuthenticated: balRes.ok,
        lastAnalyzed: new Date().toISOString(),
      },
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

function inferStrategy(tokens: Array<{ symbol: string; allocation: number }>): string {
  if (tokens.length === 0) return "Empty portfolio";
  const top = tokens[0];
  if (top.allocation > 70) return `${top.symbol}-heavy concentrated`;
  if (top.allocation > 50) return `${top.symbol}-dominant with diversification`;
  if (tokens.length > 5) return "Diversified multi-asset";
  return "Balanced allocation";
}
