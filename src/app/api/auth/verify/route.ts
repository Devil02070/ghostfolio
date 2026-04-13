import { NextResponse } from "next/server";
import { walletVerify } from "@/lib/onchainos";

export async function POST(request: Request) {
  const { otp } = await request.json();
  if (!otp) {
    return NextResponse.json(
      { ok: false, error: "OTP code is required" },
      { status: 400 }
    );
  }
  const result = await walletVerify(otp);
  return NextResponse.json(result);
}
