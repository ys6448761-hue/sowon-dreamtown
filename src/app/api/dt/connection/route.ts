/**
 * GET /api/dt/connection?starId=xxx
 * acknowledged=false 인 연결 1건 반환 (없으면 null)
 *
 * POST /api/dt/connection
 * body: { starId, otherStarId } — connection_completed 이벤트 수신 시 저장
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const starId = req.nextUrl.searchParams.get("starId");
  if (!starId) return NextResponse.json({ error: "starId required" }, { status: 400 });

  try {
    const conn = await prisma.dtConnection.findFirst({
      where: { starId, acknowledged: false },
      orderBy: { createdAt: "asc" },
      select: { id: true, otherStarId: true, createdAt: true },
    });

    return NextResponse.json(conn ?? null);
  } catch (err) {
    console.error("[dt/connection] GET error:", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  let body: { starId?: string; otherStarId?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "invalid JSON" }, { status: 400 }); }

  const { starId, otherStarId } = body;
  if (!starId || !otherStarId) return NextResponse.json({ error: "starId and otherStarId required" }, { status: 400 });

  try {
    const star = await prisma.dtStar.findUnique({ where: { id: starId } });
    if (!star) return NextResponse.json({ error: "star not found" }, { status: 404 });

    const otherStar = await prisma.dtStar.findUnique({ where: { id: otherStarId } });
    if (!otherStar) return NextResponse.json({ error: "other star not found" }, { status: 404 });

    if (starId === otherStarId) return NextResponse.json({ error: "cannot connect to self" }, { status: 400 });

    const conn = await prisma.dtConnection.create({
      data: { id: crypto.randomUUID(), starId, otherStarId },
    });
    return NextResponse.json({ id: conn.id });
  } catch (err) {
    console.error("[dt/connection] POST error:", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
