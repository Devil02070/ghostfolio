import { NextResponse } from "next/server";
import { walletLogin } from "@/lib/onchainos";

export async function POST(request: Request) {
  const { email } = await request.json();
  if (!email) {
    return NextResponse.json(
      { ok: false, error: "Email is required" },
      { status: 400 }
    );
  }
  const result = await walletLogin(email);
  return NextResponse.json(result);
}
