/**
 * GET /api/dt/checkin-status?starId=...
 *
 * 목적: 체크인 진행 상태를 조회하여 자동 라우팅 지원
 * 사용처: /checkin?starId=xxx 진입 시 현재 상태 확인
 *
 * 응답: {
 *   status: 'no_data' | 'photo_missing' | 'wish_missing' | 'ready' | 'revealed',
 *   visitorName: string | null,
 *   photoUrl: string | null,
 *   wishContent: string | null,
 *   wishImageUrl: string | null,
 *   wishImageStatus: 'pending' | 'generating' | 'ready' | 'failed' | 'revealed',
 *   wishImageRevealedAt: string (ISO) | null
 * }
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serverError, makeRequestId } from "@/lib/apiError";

export async function GET(req: NextRequest) {
  const requestId = makeRequestId();
  const starId = req.nextUrl.searchParams.get("starId");

  if (!starId) {
    return NextResponse.json(
      { error: "starId required", request_id: requestId },
      { status: 400 }
    );
  }

  try {
    // DtStar 조회
    const star = await prisma.dtStar.findUnique({
      where: { id: starId },
      select: {
        id: true,
        visitorName: true,
        photoUrl: true,
        wishImageUrl: true,
        wishImageStatus: true,
        wishImageRevealedAt: true,
      },
    });

    if (!star) {
      return NextResponse.json(
        { error: "star not found", request_id: requestId },
        { status: 404 }
      );
    }

    // 가장 최근 소원 조회
    const latestWish = await prisma.dtWish.findFirst({
      where: { starId },
      orderBy: { createdAt: "desc" },
      select: { content: true },
    });

    // 상태 결정
    let status: "no_data" | "photo_missing" | "wish_missing" | "ready" | "revealed";

    if (!star.photoUrl && !latestWish) {
      status = "no_data";
    } else if (!star.photoUrl) {
      status = "photo_missing";
    } else if (!latestWish) {
      status = "wish_missing";
    } else if (star.wishImageRevealedAt) {
      status = "revealed";
    } else {
      status = "ready";
    }

    return NextResponse.json({
      status,
      visitorName: star.visitorName,
      photoUrl: star.photoUrl,
      wishContent: latestWish?.content ?? null,
      wishImageUrl: star.wishImageUrl,
      wishImageStatus: star.wishImageStatus,
      wishImageRevealedAt: star.wishImageRevealedAt?.toISOString() ?? null,
    });
  } catch (err) {
    return serverError("dt/checkin-status GET", err, requestId);
  }
}
