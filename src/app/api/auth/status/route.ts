import { NextResponse } from "next/server";
import { walletStatus } from "@/lib/onchainos";

export async function GET() {
  const result = await walletStatus();
  return NextResponse.json(result);
}
