/**
 * POST /api/dt/connection/:id/acknowledge
 * acknowledged = true 로 업데이트 (1회 노출 보장)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await prisma.dtConnection.update({
      where: { id },
      data: { acknowledged: true },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[dt/connection/acknowledge] POST error:", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
