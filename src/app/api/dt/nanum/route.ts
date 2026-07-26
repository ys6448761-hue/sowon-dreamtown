/**
 * GET  /api/dt/nanum?starId=xxx  — 나눔 카운트 + 메시지 목록
 * POST /api/dt/nanum             — 공명(resonance) 저장 → 상대 별 DtNanum 생성
 * ⚠️ thanks count는 쿼리 레벨에서 제외 (UI 정책)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const starId = req.nextUrl.searchParams.get("starId");

  if (!starId) {
    return NextResponse.json({ error: "starId required" }, { status: 400 });
  }

  try {
    const [miracleCount, wisdomCount, messages] = await Promise.all([
      prisma.dtNanum.count({ where: { starId, type: "miracle" } }),
      prisma.dtNanum.count({ where: { starId, type: "wisdom" } }),
      prisma.dtNanum.findMany({
        where: { starId },
        orderBy: { createdAt: "desc" },
        take: 20,
        select: { id: true, type: true, message: true, createdAt: true },
      }),
    ]);

    return NextResponse.json({
      counts: {
        miracle: miracleCount,
        wisdom: wisdomCount,
        // thanks: 의도적으로 제외
      },
      messages: messages.map((m) => ({
        id: m.id,
        type: m.type,
        message: m.message,
        createdAt: m.createdAt.toISOString().slice(0, 10),
      })),
    });
  } catch (err) {
    console.error("[dt/nanum] GET error:", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  let body: { starId?: string; type?: string; message?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "invalid JSON" }, { status: 400 }); }

  const { starId, type, message } = body;
  if (!starId || !type || !message) {
    return NextResponse.json({ error: "starId, type, message required" }, { status: 400 });
  }
  if (!["miracle", "wisdom", "thanks"].includes(type)) {
    return NextResponse.json({ error: "type must be miracle | wisdom | thanks" }, { status: 400 });
  }

  try {
    const nanum = await prisma.dtNanum.create({
      data: { id: crypto.randomUUID(), starId, type, message },
    });

    // connection_completed 감지: 동일 starId에 2회 이상 공명한 경우 → DtConnection 생성
    // (여기서 fromStarId는 클라이언트가 제공 — 없으면 skip)
    const fromStarId = req.nextUrl.searchParams.get("fromStarId");
    if (fromStarId && fromStarId !== starId) {
      const prevCount = await prisma.dtNanum.count({
        where: { starId, message: { not: undefined } },
      });
      if (prevCount >= 2) {
        // 이미 connection이 있는지 확인
        const existing = await prisma.dtConnection.findFirst({
          where: { starId: fromStarId, otherStarId: starId },
        });
        if (!existing) {
          await prisma.dtConnection.create({
            data: { id: crypto.randomUUID(), starId: fromStarId, otherStarId: starId },
          });
        }
      }
    }

    return NextResponse.json({ id: nanum.id }, { status: 201 });
  } catch (err) {
    console.error("[dt/nanum] POST error:", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
