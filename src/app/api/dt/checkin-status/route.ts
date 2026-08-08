/**
 * GET /api/dt/checkin-status?starId=...
 *
 * 목적: 체크인 진행 상태를 조회하여 자동 라우팅 지원
 * 사용처: /checkin?starId=xxx 진입 시 현재 상태 확인
 *
 * 응답: {
 *   status: 'no_data' | 'photo_missing' | 'wish_missing' | 'ready' | 'revealed',
 *   visitorName: string | null,
 *   wishContent: string | null,
 *   wishImageUrl: string | null,
 *   wishImageStatus: 'pending' | 'generating' | 'ready' | 'failed' | 'revealed',
 *   wishImageRevealedAt: string (ISO) | null
 * }
 *
 * 주의: photoUrl은 개인정보 보호를 위해 응답에서 제외 (Phase A Safety, S4)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serverError, makeRequestId } from "@/lib/apiError";
import { getSignedGetUrl } from "@/lib/r2";

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
        photoUrl: true, // 상태 판단에만 사용 — 응답에 미포함 (S4)
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

    // wishart/ prefix → presigned URL (7일 TTL), 그 외는 정적 경로 그대로 반환
    let resolvedWishImageUrl = star.wishImageUrl;
    if (resolvedWishImageUrl?.startsWith("wishart/")) {
      resolvedWishImageUrl = await getSignedGetUrl(resolvedWishImageUrl, 7 * 24 * 60 * 60);
    }

    return NextResponse.json({
      status,
      visitorName: star.visitorName,
      // photoUrl 제외 — 개인 얼굴 사진 key를 소유 확인 없이 반환하지 않음 (S4)
      wishContent: latestWish?.content ?? null,
      wishImageUrl: resolvedWishImageUrl,
      wishImageStatus: star.wishImageStatus,
      wishImageRevealedAt: star.wishImageRevealedAt?.toISOString() ?? null,
    });
  } catch (err) {
    return serverError("dt/checkin-status GET", err, requestId);
  }
}
