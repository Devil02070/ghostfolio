import { NextResponse } from "next/server";
import { walletBalance, walletStatus } from "@/lib/onchainos";
import { getTestnetBalance } from "@/lib/xlayer-testnet";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chain = searchParams.get("chain") || undefined;

  try {
    // Get wallet status for address
    const status = await walletStatus();
    if (!status.ok || !(status.data as Record<string, unknown>).loggedIn) {
      return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
    }

    // Get mainnet balance (for address info)
    const mainnetResult = await walletBalance(chain);
    const mainnetData = mainnetResult.ok ? mainnetResult.data as Record<string, unknown> : {};
    const evmAddress = mainnetData.evmAddress as string || "";
    const solAddress = mainnetData.solAddress as string || "";

    // Fetch X Layer testnet balance
    let testnetBalance = { balanceOKB: 0, balanceUsd: 0, balanceWei: "0" };
    if (evmAddress) {
      try {
        testnetBalance = await getTestnetBalance(evmAddress);
      } catch {
        // testnet RPC failed, continue with 0
      }
    }

    // Build combined response
    const details = [];

    // Add testnet OKB as a token asset
    if (testnetBalance.balanceOKB > 0) {
      details.push({
        tokenAssets: [{
          chainIndex: "195",
          symbol: "OKB",
          tokenName: "OKB (Testnet)",
          balance: testnetBalance.balanceOKB.toString(),
          usdValue: testnetBalance.balanceUsd.toString(),
          tokenPrice: "50",
          tokenContractAddress: "",
          isNative: true,
          network: "X Layer Testnet",
        }],
      });
    }

    // Also include mainnet tokens if any
    const mainnetDetails = mainnetData.details as Array<Record<string, unknown>> || [];
    for (const group of mainnetDetails) {
      const assets = group.tokenAssets as Array<Record<string, unknown>> || [];
      if (assets.length > 0) {
        details.push({ tokenAssets: assets });
      }
    }

    const totalUsd = testnetBalance.balanceUsd + parseFloat((mainnetData.totalValueUsd as string) || "0");

    return NextResponse.json({
      ok: true,
      data: {
        accountCount: mainnetData.accountCount || 1,
        accountId: mainnetData.accountId || "",
        accountName: mainnetData.accountName || "Account 1",
        evmAddress,
        solAddress,
        totalValueUsd: totalUsd.toFixed(2),
        details,
        testnet: {
          chain: "X Layer Testnet (195)",
          okbBalance: testnetBalance.balanceOKB,
          okbUsd: testnetBalance.balanceUsd,
        },
      },
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
