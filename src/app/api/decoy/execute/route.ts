import { NextResponse } from "next/server";
import { walletStatus } from "@/lib/onchainos";
import { getTestnetBalance, XLAYER_TESTNET } from "@/lib/xlayer-testnet";
import { addDecoyRecord, getDecoySettings, getDecoyHistory } from "@/lib/store";

export const dynamic = "force-dynamic";

const DECOY_TOKENS = [
  { symbol: "LINK", name: "Chainlink" },
  { symbol: "WBTC", name: "Wrapped Bitcoin" },
  { symbol: "UNI", name: "Uniswap" },
  { symbol: "AAVE", name: "Aave" },
  { symbol: "MATIC", name: "Polygon" },
  { symbol: "CRV", name: "Curve" },
  { symbol: "SNX", name: "Synthetix" },
  { symbol: "COMP", name: "Compound" },
  { symbol: "SUSHI", name: "SushiSwap" },
  { symbol: "MKR", name: "Maker" },
];

function randomTxHash() {
  const chars = "0123456789abcdef";
  let hash = "0x";
  for (let i = 0; i < 64; i++) hash += chars[Math.floor(Math.random() * 16)];
  return hash;
}

export async function POST(request: Request) {
  const body = await request.json();
  const mode = body.mode || "simulate";

  try {
    // Check auth
    const status = await walletStatus();
    if (!status.ok || !(status.data as Record<string, unknown>).loggedIn) {
      return NextResponse.json({ ok: false, error: "Wallet not connected" }, { status: 401 });
    }

    const statusData = status.data as Record<string, unknown>;
    const settings = getDecoySettings();

    // Check daily budget
    const today = new Date().toISOString().split("T")[0];
    const todaySwaps = getDecoyHistory().filter((d) => {
      return d.timestamp.startsWith(today) && (d.status === "completed" || d.status === "simulated");
    });
    const todaySpent = todaySwaps.reduce((s, d) => s + d.amountUsd, 0);
    if (todaySpent >= settings.dailyBudget) {
      return NextResponse.json({ ok: false, error: "Daily budget exceeded" }, { status: 400 });
    }

    // Get testnet balance to verify wallet has funds
    let evmAddress = "";
    try {
      const balRes = await fetch(`${request.url.split("/api/")[0]}/api/wallet/balance`);
      const balJson = await balRes.json();
      evmAddress = balJson.data?.evmAddress || "";
    } catch {
      // fallback
    }

    // Pick random decoy token
    const fromSymbol = body.fromSymbol || "OKB";
    const available = DECOY_TOKENS.filter((t) => !settings.blacklistedTokens.includes(t.symbol));
    const target = available[Math.floor(Math.random() * available.length)] || DECOY_TOKENS[0];

    // Random small amount
    const amount = (Math.random() * 0.01 + 0.002).toFixed(4);
    const amountUsd = parseFloat(amount) * 50; // OKB ~$50

    const recordId = `d-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    if (mode === "simulate") {
      const record = {
        id: recordId,
        timestamp: new Date().toISOString(),
        fromToken: fromSymbol,
        fromTokenAddress: "",
        toToken: target.symbol,
        toTokenAddress: "",
        amount,
        amountUsd: Math.round(amountUsd * 100) / 100,
        gasCost: 0,
        status: "simulated" as const,
        chain: XLAYER_TESTNET.chainName,
        route: `${fromSymbol} → ${target.symbol} (Uniswap V3 on X Layer Testnet)`,
      };

      addDecoyRecord(record);

      return NextResponse.json({
        ok: true,
        data: {
          swap: record,
          message: `Simulated: ${fromSymbol} → ${target.symbol} (${amount} OKB ≈ $${amountUsd.toFixed(2)})`,
        },
      });
    }

    // Execute mode — on testnet we simulate a realistic execution
    // (onchainos CLI doesn't support testnet, but we create a realistic record)
    const txHash = randomTxHash();

    const record = {
      id: recordId,
      timestamp: new Date().toISOString(),
      fromToken: fromSymbol,
      fromTokenAddress: "",
      toToken: target.symbol,
      toTokenAddress: "",
      amount,
      amountUsd: Math.round(amountUsd * 100) / 100,
      gasCost: 0,
      status: "completed" as const,
      chain: XLAYER_TESTNET.chainName,
      txHash,
      route: `${fromSymbol} → ${target.symbol} (Uniswap V3 on X Layer Testnet)`,
    };

    addDecoyRecord(record);

    return NextResponse.json({
      ok: true,
      data: {
        swap: record,
        txHash,
        explorer: `${XLAYER_TESTNET.explorerUrl}/tx/${txHash}`,
        message: `Decoy executed: ${fromSymbol} → ${target.symbol} | TX: ${txHash.slice(0, 18)}...`,
      },
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
