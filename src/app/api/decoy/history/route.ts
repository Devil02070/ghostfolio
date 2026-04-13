import { NextResponse } from "next/server";
import { getDecoyHistory } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const history = getDecoyHistory();
  const completed = history.filter((d) => d.status === "completed");
  const totalGas = completed.reduce((s, d) => s + d.gasCost, 0);

  return NextResponse.json({
    ok: true,
    data: {
      swaps: history,
      totalSwaps: history.length,
      completedSwaps: completed.length,
      totalGasSpent: Math.round(totalGas * 100) / 100,
      lastSwap: history[0]?.timestamp || null,
    },
  });
}
