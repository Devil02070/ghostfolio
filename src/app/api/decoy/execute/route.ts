import { NextResponse } from "next/server";
import { walletStatus, walletBalance, runOnchainos } from "@/lib/onchainos";
import { addDecoyRecord, getDecoySettings, getDecoyHistory } from "@/lib/store";

export const dynamic = "force-dynamic";

// Real token addresses on X Layer (chainIndex 196)
const XLAYER_TOKENS = [
  { symbol: "USDT", address: "0x779ded0c9e1022225f8e0630b35a9b54be713736", decimals: 6 },
  { symbol: "WETH", address: "0x5a77f1443d16ee5761d310e38b62f77f726bc71c", decimals: 18 },
  { symbol: "WBTC", address: "0xea034fb02eb1808c2cc3adbc15f447b93cbe08e1", decimals: 8 },
  { symbol: "USDC", address: "0x74b7f16337b8972027f6196a17a631ac6de26d22", decimals: 6 },
];

const NATIVE_OKB = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
const XLAYER_EXPLORER = "https://www.okx.com/explorer/xlayer";

export async function POST(request: Request) {
  const body = await request.json();
  const mode = body.mode || "simulate";

  try {
    // Check auth
    const status = await walletStatus();
    if (!status.ok || !(status.data as Record<string, unknown>).loggedIn) {
      return NextResponse.json({ ok: false, error: "Wallet not connected" }, { status: 401 });
    }

    const settings = getDecoySettings();

    // Check daily budget
    const today = new Date().toISOString().split("T")[0];
    const todaySwaps = getDecoyHistory().filter((d) =>
      d.timestamp.startsWith(today) && (d.status === "completed" || d.status === "simulated")
    );
    const todaySpent = todaySwaps.reduce((s, d) => s + d.amountUsd, 0);
    if (todaySpent >= settings.dailyBudget) {
      return NextResponse.json({ ok: false, error: "Daily budget exceeded" }, { status: 400 });
    }

    // Get wallet address and balance
    const balRes = await walletBalance("xlayer");
    const balData = balRes.data as Record<string, unknown>;
    const evmAddress = (balData?.evmAddress as string) || "";

    if (!evmAddress) {
      return NextResponse.json({ ok: false, error: "Could not resolve wallet address" }, { status: 400 });
    }

    // Pick random decoy target token (exclude blacklisted)
    const available = XLAYER_TOKENS.filter((t) => !settings.blacklistedTokens.includes(t.symbol));
    const target = available[Math.floor(Math.random() * available.length)] || XLAYER_TOKENS[0];

    // Use custom or random small amount
    const amount = body.amount || (Math.random() * 0.01 + 0.002).toFixed(6);
    const okbPrice = 82; // approximate
    const amountUsd = parseFloat(amount) * okbPrice;

    const recordId = `d-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const fromToken = body.fromToken || NATIVE_OKB;
    const fromSymbol = body.fromSymbol || "OKB";

    if (mode === "simulate") {
      // Get a real quote for the simulation
      const quoteRes = await runOnchainos([
        "swap", "quote",
        "--from", fromToken,
        "--to", target.address,
        "--readable-amount", amount,
        "--chain", "xlayer",
      ]);

      const quoteData = quoteRes.data as Array<Record<string, unknown>> | null;
      const estimatedGas = quoteData?.[0]?.estimateGasFee || "0";
      const toAmount = quoteData?.[0]?.toTokenAmount || "0";

      const record = {
        id: recordId,
        timestamp: new Date().toISOString(),
        fromToken: fromSymbol,
        fromTokenAddress: fromToken,
        toToken: target.symbol,
        toTokenAddress: target.address,
        amount,
        amountUsd: Math.round(amountUsd * 100) / 100,
        gasCost: 0,
        status: "simulated" as const,
        chain: "X Layer",
        route: `${fromSymbol} → ${target.symbol} (${quoteRes.ok ? "real quote" : "estimated"})`,
      };

      addDecoyRecord(record);

      return NextResponse.json({
        ok: true,
        data: {
          swap: record,
          quote: quoteRes.ok ? { estimatedGas, toAmount, router: quoteData?.[0]?.router } : null,
          message: `Simulated: ${fromSymbol} → ${target.symbol} (${amount} OKB ≈ $${amountUsd.toFixed(2)})`,
        },
      });
    }

    // ── Execute mode — real swap on X Layer mainnet ──
    const record = {
      id: recordId,
      timestamp: new Date().toISOString(),
      fromToken: fromSymbol,
      fromTokenAddress: fromToken,
      toToken: target.symbol,
      toTokenAddress: target.address,
      amount,
      amountUsd: Math.round(amountUsd * 100) / 100,
      gasCost: 0,
      status: "pending" as const,
      chain: "X Layer",
      route: `${fromSymbol} → ${target.symbol} (Uniswap/DEX on X Layer)`,
    };

    addDecoyRecord(record);

    // Execute real swap via onchainos CLI
    const swapRes = await runOnchainos([
      "swap", "execute",
      "--from", fromToken,
      "--to", target.address,
      "--readable-amount", amount,
      "--chain", "xlayer",
      "--wallet", evmAddress,
    ]);

    if (swapRes.ok) {
      const swapData = swapRes.data as Record<string, unknown>;
      const txHash = (swapData?.txHash as string) || (swapData?.transactionHash as string) || "";

      // Update record with real tx hash
      const { updateDecoyRecord } = await import("@/lib/store");
      updateDecoyRecord(recordId, {
        status: "completed",
        txHash: txHash || undefined,
      });

      return NextResponse.json({
        ok: true,
        data: {
          swap: { ...record, status: "completed", txHash },
          txHash,
          explorer: txHash ? `${XLAYER_EXPLORER}/tx/${txHash}` : null,
          message: `Decoy executed on X Layer: ${fromSymbol} → ${target.symbol} | TX: ${txHash ? txHash.slice(0, 18) + "..." : "pending"}`,
          raw: swapData,
        },
      });
    } else {
      // Swap failed — update record
      const { updateDecoyRecord } = await import("@/lib/store");
      updateDecoyRecord(recordId, {
        status: "failed",
        error: swapRes.error || "Swap execution failed",
      });

      return NextResponse.json({
        ok: false,
        error: swapRes.error || "Swap execution failed",
        data: { swap: { ...record, status: "failed" }, raw: swapRes.data },
      });
    }
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
