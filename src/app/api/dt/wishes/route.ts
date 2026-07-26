/**
 * GET  /api/dt/wishes?starId=xxx  — 소원 목록 (current / previous[])
 * POST /api/dt/wishes             — 소원 생성 (star 없으면 함께 생성)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serverError, makeRequestId } from "@/lib/apiError";

// ── GET ───────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const starId = req.nextUrl.searchParams.get("starId");

  if (!starId) {
    return NextResponse.json({ error: "starId required" }, { status: 400 });
  }

  try {
    const rows = await prisma.dtWish.findMany({
      where: { starId },
      orderBy: { createdAt: "desc" },
      select: { id: true, starId: true, content: true, createdAt: true },
    });

    const [head, ...tail] = rows;

    return NextResponse.json({
      current: head
        ? {
            id: head.id,
            starId: head.starId,
            content: head.content,
            createdAt: head.createdAt.toISOString().slice(0, 10),
          }
        : null,
      previous: tail.map((w) => ({
        id: w.id,
        starId: w.starId,
        content: w.content,
        createdAt: w.createdAt.toISOString().slice(0, 10),
      })),
    });
  } catch (err) {
    return serverError("dt/wishes GET", err);
  }
}

// ── POST ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const requestId = makeRequestId();
  let body: { content?: string; starId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON", request_id: requestId }, { status: 400 });
  }

  const { content, starId } = body;

  if (!content || content.trim().length === 0) {
    return NextResponse.json({ error: "content required" }, { status: 400 });
  }
  if (content.trim().length > 200) {
    return NextResponse.json({ error: "content too long" }, { status: 400 });
  }

  try {
    let resolvedStarId = starId;

    // starId 없으면 새 별 생성 (Option B — 최초 소원 흐름)
    if (!resolvedStarId) {
      const newStar = await prisma.dtStar.create({
        data: {
          id: crypto.randomUUID(),
          userId: "anonymous", // 인증 연결 전 임시값
          starName: "나의 별",
          dayCount: 1,
          starStage: 1,
        },
      });
      resolvedStarId = newStar.id;
    } else {
      // starId 전달 시 존재 여부 확인
      const exists = await prisma.dtStar.findUnique({ where: { id: resolvedStarId } });
      if (!exists) {
        return NextResponse.json({ error: "star not found" }, { status: 404 });
      }
    }

    const wish = await prisma.dtWish.create({
      data: {
        id: crypto.randomUUID(),
        starId: resolvedStarId,
        content: content.trim(),
      },
    });

    // 첫 소원일 때만 Day 0 항해기록 자동 생성 (중복 방지)
    const wishCount = await prisma.dtWish.count({ where: { starId: resolvedStarId } });
    if (wishCount === 1) {
      await prisma.dtJournal.create({
        data: {
          id: crypto.randomUUID(),
          starId: resolvedStarId,
          emotion: "믿고 싶어졌어요",
          helpTag: "연결",               // 유효값: 위로|결심|쉼|연결|실행
          growthLine: "조금 가벼워졌어요", // 유효값 3종 중 하나
        },
      });
    }

    return NextResponse.json({
      success: true,
      starId: resolvedStarId,
      wish: {
        id: wish.id,
        content: wish.content,
        createdAt: wish.createdAt.toISOString().slice(0, 10),
      },
    });
  } catch (err) {
    return serverError("dt/wishes POST", err, requestId);
  }
}
