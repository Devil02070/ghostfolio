import { NextResponse } from "next/server";
import { walletAddresses } from "@/lib/onchainos";

export async function GET() {
  const result = await walletAddresses();
  return NextResponse.json(result);
}
