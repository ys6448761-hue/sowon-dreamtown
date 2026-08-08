/**
 * PATCH /api/dt/wishes/reveal
 *
 * 목적: 소원그림을 공개 처리 (wishImageRevealedAt 설정)
 * 입력: { starId: string }
 * 처리: DtStar.wishImageRevealedAt = NOW()
 *
 * Phase A (Soft Open): 정적 이미지 공개 전용
 * - WishArt 생성 없음
 * - 이미지는 할당된 상태로 존재
 * - 공개 시간 기록만 필요
 *
 * 보안 (S3): dt_guest_token 쿠키 → GuestIdentity → Star 소유 확인 필수
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serverError, makeRequestId } from "@/lib/apiError";
import {
  GUEST_TOKEN_COOKIE_NAME,
  hashGuestToken,
} from "@/lib/utils/guest-identity";
import { getSignedGetUrl } from "@/lib/r2";

export async function PATCH(req: NextRequest) {
  const requestId = makeRequestId();

  let body: { starId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "invalid JSON", request_id: requestId },
      { status: 400 }
    );
  }

  const { starId } = body;

  if (!starId || typeof starId !== "string") {
    return NextResponse.json(
      { error: "starId required", request_id: requestId },
      { status: 400 }
    );
  }

  // 소유권 검증 (S3): 쿠키 → GuestIdentity → star.guestIdentityId 일치 확인
  const cookieToken = req.cookies.get(GUEST_TOKEN_COOKIE_NAME)?.value;
  if (!cookieToken) {
    return NextResponse.json(
      { error: "unauthorized", request_id: requestId },
      { status: 401 }
    );
  }

  try {
    const tokenHash = hashGuestToken(cookieToken);
    const identity = await prisma.dtGuestIdentity.findUnique({ where: { tokenHash } });
    if (!identity) {
      return NextResponse.json(
        { error: "unauthorized", request_id: requestId },
        { status: 401 }
      );
    }

    const star = await prisma.dtStar.findUnique({
      where: { id: starId },
      select: { id: true, wishImageUrl: true, wishImageStatus: true, wishImageRevealedAt: true, guestIdentityId: true },
    });

    if (!star) {
      return NextResponse.json(
        { error: "star not found", request_id: requestId },
        { status: 404 }
      );
    }

    if (star.guestIdentityId !== identity.id) {
      return NextResponse.json(
        { error: "forbidden", request_id: requestId },
        { status: 403 }
      );
    }

    // 이미지가 아직 생성되지 않은 경우 공개 불가
    if (star.wishImageStatus !== "ready") {
      return NextResponse.json(
        { error: "image not ready", wishImageStatus: star.wishImageStatus, request_id: requestId },
        { status: 409 }
      );
    }

    // 이미 공개된 경우
    if (star.wishImageRevealedAt) {
      const alreadyUrl = star.wishImageUrl?.startsWith("wishart/")
        ? await getSignedGetUrl(star.wishImageUrl, 7 * 24 * 60 * 60)
        : star.wishImageUrl;
      return NextResponse.json({
        success: true,
        starId,
        message: "already revealed",
        wishImageUrl: alreadyUrl,
        wishImageRevealedAt: star.wishImageRevealedAt.toISOString(),
      });
    }

    // 공개 처리
    const updated = await prisma.dtStar.update({
      where: { id: starId },
      data: { wishImageRevealedAt: new Date(), wishImageStatus: "revealed" },
      select: {
        id: true,
        wishImageUrl: true,
        wishImageRevealedAt: true,
      },
    });

    const resolvedUrl = updated.wishImageUrl?.startsWith("wishart/")
      ? await getSignedGetUrl(updated.wishImageUrl, 7 * 24 * 60 * 60)
      : updated.wishImageUrl;

    return NextResponse.json({
      success: true,
      starId: updated.id,
      wishImageUrl: resolvedUrl,
      wishImageRevealedAt: updated.wishImageRevealedAt!.toISOString(),
    });
  } catch (err) {
    return serverError("dt/wishes/reveal PATCH", err, requestId);
  }
}
