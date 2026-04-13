import { NextResponse } from "next/server";
import { walletBalance, walletHistory } from "@/lib/onchainos";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [balRes, histRes] = await Promise.all([
      walletBalance(),
      walletHistory(undefined, "30"),
    ]);

    if (!balRes.ok) {
      return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
    }

    const balData = balRes.data as Record<string, unknown>;
    const histData = histRes.ok ? histRes.data : [];

    return NextResponse.json({
      ok: true,
      data: {
        balance: balData,
        history: histData,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
