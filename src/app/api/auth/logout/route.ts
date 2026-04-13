import { NextResponse } from "next/server";
import { walletLogout } from "@/lib/onchainos";

export async function POST() {
  const result = await walletLogout();
  return NextResponse.json(result);
}
