/**
 * GET  /api/dt/journals?starId=xxx  — 항해기록 목록 (최신순)
 * POST /api/dt/journals             — 항해기록 생성
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ── GET ───────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const starId = req.nextUrl.searchParams.get("starId");

  if (!starId) {
    return NextResponse.json({ error: "starId required" }, { status: 400 });
  }

  try {
    const rows = await prisma.dtJournal.findMany({
      where: { starId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        emotion: true,
        helpTag: true,
        growthLine: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      rows.map((j) => ({
        id: j.id,
        emotion: j.emotion,
        helpTag: j.helpTag,
        growthLine: j.growthLine,
        createdAt: j.createdAt.toISOString().slice(0, 10),
      }))
    );
  } catch (err) {
    console.error("[dt/journals] GET error:", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}

// ── POST ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let body: {
    starId?: string;
    emotion?: string;
    helpTag?: string;
    growthLine?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const { starId, emotion, helpTag, growthLine } = body;

  if (!starId || !emotion || !helpTag || !growthLine) {
    return NextResponse.json(
      { error: "starId, emotion, helpTag, growthLine required" },
      { status: 400 }
    );
  }

  try {
    const star = await prisma.dtStar.findUnique({ where: { id: starId } });
    if (!star) {
      return NextResponse.json({ error: "star not found" }, { status: 404 });
    }

    const journal = await prisma.dtJournal.create({
      data: {
        id: crypto.randomUUID(),
        starId,
        emotion,
        helpTag,
        growthLine,
      },
    });

    return NextResponse.json({
      success: true,
      journal: {
        id: journal.id,
        emotion: journal.emotion,
        helpTag: journal.helpTag,
        growthLine: journal.growthLine,
        createdAt: journal.createdAt.toISOString().slice(0, 10),
      },
    });
  } catch (err) {
    console.error("[dt/journals] POST error:", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
