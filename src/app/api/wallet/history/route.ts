import { NextResponse } from "next/server";
import { walletHistory } from "@/lib/onchainos";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chain = searchParams.get("chain") || undefined;
  const limit = searchParams.get("limit") || "20";
  const result = await walletHistory(chain, limit);
  return NextResponse.json(result);
}
