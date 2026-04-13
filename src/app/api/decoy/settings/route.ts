import { NextResponse } from "next/server";
import { getDecoySettings, updateDecoySettings } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ ok: true, data: getDecoySettings() });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const updated = updateDecoySettings(body);
  return NextResponse.json({ ok: true, data: updated });
}
