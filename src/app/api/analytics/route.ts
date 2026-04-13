import { NextResponse } from "next/server";
import { getPrivacyHistory, getDecoyHistory, getSurveillanceData } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const privacyHistory = getPrivacyHistory();
  const decoyHistory = getDecoyHistory();
  const surveillance = getSurveillanceData();

  const completed = decoyHistory.filter((d) => d.status === "completed");
  const totalCost = completed.reduce((s, d) => s + d.gasCost + d.amountUsd, 0);

  // Build daily cost breakdown from decoy history
  const dailyCosts = new Map<string, number>();
  for (const d of completed) {
    const date = new Date(d.timestamp).toISOString().split("T")[0];
    dailyCosts.set(date, (dailyCosts.get(date) || 0) + d.gasCost + d.amountUsd);
  }

  const latestScore = privacyHistory.length > 0 ? privacyHistory[privacyHistory.length - 1].score : 0;
  const firstScore = privacyHistory.length > 0 ? privacyHistory[0].score : 0;
  const scoreGain = latestScore - firstScore;

  return NextResponse.json({
    ok: true,
    data: {
      privacyHistory,
      totalDecoyCost: Math.round(totalCost * 100) / 100,
      totalSwaps: completed.length,
      latestPrivacyScore: latestScore,
      scoreGain,
      costPerPoint: scoreGain > 0 ? Math.round((totalCost / scoreGain) * 100) / 100 : 0,
      dailyCosts: Array.from(dailyCosts.entries()).map(([date, cost]) => ({ date, cost: Math.round(cost * 100) / 100 })),
      surveillance: {
        currentThreat: surveillance?.threatLevel || "unknown",
        watcherCount: surveillance?.watchers?.length || 0,
      },
    },
  });
}
