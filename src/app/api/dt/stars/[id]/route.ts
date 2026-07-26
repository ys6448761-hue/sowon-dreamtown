/**
 * GET /api/dt/stars/:id
 * 나의 별 레이어 데이터 — star + currentWish(최신 1개)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const star = await prisma.dtStar.findUnique({ where: { id } });

    if (!star) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    const currentWish = await prisma.dtWish.findFirst({
      where: { starId: id },
      orderBy: { createdAt: "desc" },
      select: { id: true, content: true },
    });

    return NextResponse.json({
      id: star.id,
      starName: star.starName,
      createdAt: star.createdAt.toISOString().slice(0, 10),
      dayCount: star.dayCount,
      starStage: star.starStage,
      currentWish: currentWish ?? null,
    });
  } catch (err) {
    console.error("[dt/stars] GET error:", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
