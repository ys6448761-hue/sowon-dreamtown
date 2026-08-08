/**
 * POST /api/dt/wishart/retry
 *
 * 소원그림 생성 실패(failed) 상태에서 재시도.
 * - 소유권 검증 (쿠키 → GuestIdentity)
 * - wishImageStatus === "failed"인 경우에만 허용
 * - OPENAI_API_KEY 없으면 503
 * - pending으로 초기화 후 fire-and-forget 재생성
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serverError, makeRequestId } from "@/lib/apiError";
import { GUEST_TOKEN_COOKIE_NAME, hashGuestToken } from "@/lib/utils/guest-identity";
import { downloadFromR2 } from "@/lib/r2";
import { runWishartGeneration } from "@/lib/wishart/run-generation";

const EXT_TO_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export async function POST(req: NextRequest) {
  const requestId = makeRequestId();

  let body: { starId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON", request_id: requestId }, { status: 400 });
  }

  const { starId } = body;
  if (!starId || typeof starId !== "string") {
    return NextResponse.json({ error: "starId required", request_id: requestId }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "generation unavailable", request_id: requestId },
      { status: 503 },
    );
  }

  const cookieToken = req.cookies.get(GUEST_TOKEN_COOKIE_NAME)?.value;
  if (!cookieToken) {
    return NextResponse.json({ error: "unauthorized", request_id: requestId }, { status: 401 });
  }

  try {
    const tokenHash = hashGuestToken(cookieToken);
    const identity = await prisma.dtGuestIdentity.findUnique({ where: { tokenHash } });
    if (!identity) {
      return NextResponse.json({ error: "unauthorized", request_id: requestId }, { status: 401 });
    }

    const star = await prisma.dtStar.findUnique({
      where: { id: starId },
      select: { id: true, photoUrl: true, wishImageStatus: true, guestIdentityId: true },
    });
    if (!star) {
      return NextResponse.json({ error: "star not found", request_id: requestId }, { status: 404 });
    }
    if (star.guestIdentityId !== identity.id) {
      return NextResponse.json({ error: "forbidden", request_id: requestId }, { status: 403 });
    }
    if (star.wishImageStatus !== "failed") {
      return NextResponse.json(
        { error: "retry only allowed when status is failed", wishImageStatus: star.wishImageStatus, request_id: requestId },
        { status: 409 },
      );
    }
    if (!star.photoUrl) {
      return NextResponse.json({ error: "photo not found", request_id: requestId }, { status: 422 });
    }

    const wish = await prisma.dtWish.findFirst({
      where: { starId },
      orderBy: { createdAt: "desc" },
      select: { content: true },
    });
    if (!wish) {
      return NextResponse.json({ error: "wish not found", request_id: requestId }, { status: 422 });
    }

    const { body: photoBuffer, contentType } = await downloadFromR2(star.photoUrl);

    // extension hint for MIME override (R2 ContentType may be generic)
    const ext = star.photoUrl.split(".").pop()?.toLowerCase() ?? "";
    const mimeType = EXT_TO_MIME[ext] ?? contentType;

    await prisma.dtStar.update({
      where: { id: starId },
      data: { wishImageStatus: "pending" },
    });

    void runWishartGeneration(starId, photoBuffer, wish.content, mimeType);

    return NextResponse.json({ success: true, wishImageStatus: "pending" });
  } catch (err) {
    return serverError("dt/wishart/retry POST", err, requestId);
  }
}
