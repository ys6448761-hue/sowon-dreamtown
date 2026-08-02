/**
 * CHECKIN-001 / CHECKIN-002: QR 체크인 API
 * POST /api/checkin
 *
 * 입력: multipart/form-data { name, phone?, photo, wish }
 * 처리:
 *   1. 정면사진 → Cloudflare R2 (private bucket) 업로드
 *   2. GuestIdentity 생성 + DtStar + DtWish + DtJournal 트랜잭션
 *   3. 소원그림 배정 (사전 생성 이미지 pool → starId 결정론적 배정, 비공개)
 * 산출물: { success, starId }
 * 주의: photoUrl 필드에 R2 object key(경로)를 저장. 외부 URL 아님.
 */

import { NextRequest, NextResponse } from "next/server";
import { uploadToR2 } from "@/lib/r2";
import { prisma } from "@/lib/prisma";
import { sanitizeText } from "@/lib/sanitize";
import { serverError, makeRequestId } from "@/lib/apiError";
import { DAY_ZERO_JOURNAL } from "@/lib/utils/day-zero-journal";
import {
  GUEST_TOKEN_COOKIE_NAME,
  GUEST_TOKEN_MAX_AGE_SECONDS,
  generateGuestToken,
  hashGuestToken,
  calculateGuestIdentityExpiry,
} from "@/lib/utils/guest-identity";
import { assignWishImageUrl } from "@/lib/utils/checkin-wish-image";
import { logCheckinEvent } from "@/lib/utils/checkin-events";

const NAME_MAX = 50;
const PHONE_MAX = 20;
const WISH_MAX = 200;
const PHOTO_MAX_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(req: NextRequest) {
  const requestId = makeRequestId();

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "invalid form data", request_id: requestId },
      { status: 400 },
    );
  }

  const rawName = form.get("name");
  const rawPhone = form.get("phone");
  const rawWish = form.get("wish");
  const photo = form.get("photo");

  const name = typeof rawName === "string" ? sanitizeText(rawName) : "";
  const phone =
    typeof rawPhone === "string" && rawPhone.trim().length > 0
      ? sanitizeText(rawPhone.trim())
      : null;
  const wish = typeof rawWish === "string" ? sanitizeText(rawWish) : "";

  if (!name || name.length > NAME_MAX) {
    return NextResponse.json(
      { error: "name required (1~50자)", request_id: requestId },
      { status: 400 },
    );
  }
  if (phone && phone.length > PHONE_MAX) {
    return NextResponse.json(
      { error: "phone too long (max 20자)", request_id: requestId },
      { status: 400 },
    );
  }
  if (!wish || wish.length > WISH_MAX) {
    return NextResponse.json(
      { error: "wish required (1~200자)", request_id: requestId },
      { status: 400 },
    );
  }
  if (!(photo instanceof File) || photo.size === 0) {
    return NextResponse.json(
      { error: "photo required", request_id: requestId },
      { status: 400 },
    );
  }
  if (photo.size > PHOTO_MAX_BYTES) {
    return NextResponse.json(
      { error: "photo too large (max 8MB)", request_id: requestId },
      { status: 400 },
    );
  }
  const ext = ALLOWED_MIME[photo.type];
  if (!ext) {
    return NextResponse.json(
      { error: "unsupported photo type (jpeg/png/webp only)", request_id: requestId },
      { status: 400 },
    );
  }

  try {
    // starId를 트랜잭션 전에 결정 → R2 object key에 사용
    const newStarId = crypto.randomUUID();
    const fileId = crypto.randomUUID();
    const photoKey = `checkin/${newStarId}/${fileId}.${ext}`;
    const buffer = Buffer.from(await photo.arrayBuffer());

    // R2 업로드: DB 트랜잭션 전에 먼저 실행.
    // DB 실패 시 R2에 고아 객체가 남을 수 있으나 파일럿 규모(20인)에서 수용 가능.
    await uploadToR2(photoKey, buffer, photo.type);
    logCheckinEvent({ event: "portrait_uploaded", requestId });

    const existingToken = req.cookies.get(GUEST_TOKEN_COOKIE_NAME)?.value;

    let starId: string;
    let tokenForCookie: string;

    ({ starId, tokenForCookie } = await prisma.$transaction(async (tx) => {
      const now = new Date();
      let identityId: string;
      let tokenForCookie: string;

      if (existingToken !== undefined) {
        const tokenHash = hashGuestToken(existingToken);
        const existing = await tx.dtGuestIdentity.findUnique({ where: { tokenHash } });

        if (existing && existing.expiresAt > now) {
          await tx.dtGuestIdentity.update({
            where: { id: existing.id },
            data: { lastUsedAt: now, expiresAt: calculateGuestIdentityExpiry(now) },
          });
          identityId = existing.id;
          tokenForCookie = existingToken;
        } else {
          const newToken = generateGuestToken();
          const created = await tx.dtGuestIdentity.create({
            data: {
              id: crypto.randomUUID(),
              tokenHash: hashGuestToken(newToken),
              expiresAt: calculateGuestIdentityExpiry(now),
              lastUsedAt: now,
            },
          });
          identityId = created.id;
          tokenForCookie = newToken;
        }
      } else {
        const newToken = generateGuestToken();
        const created = await tx.dtGuestIdentity.create({
          data: {
            id: crypto.randomUUID(),
            tokenHash: hashGuestToken(newToken),
            expiresAt: calculateGuestIdentityExpiry(now),
            lastUsedAt: now,
          },
        });
        identityId = created.id;
        tokenForCookie = newToken;
      }

      const wishImageUrl = assignWishImageUrl(newStarId);

      await tx.dtStar.create({
        data: {
          id: newStarId,
          userId: "anonymous",
          starName: "나의 별",
          visitorName: name,
          photoUrl: photoKey, // R2 object key 저장 (공개 URL 아님)
          phone,
          wishImageUrl,
          wishImageStatus: "ready", // 사전 생성 이미지 즉시 ready — 비공개는 wishImageRevealedAt=null로 보장
          dayCount: 1,
          starStage: 1,
          guestIdentityId: identityId,
        },
      });

      await tx.dtWish.create({
        data: {
          id: crypto.randomUUID(),
          starId: newStarId,
          content: wish,
        },
      });

      await tx.dtJournal.create({
        data: {
          id: crypto.randomUUID(),
          starId: newStarId,
          ...DAY_ZERO_JOURNAL,
        },
      });

      return { starId: newStarId, tokenForCookie };
    }));

    logCheckinEvent({ event: "star_created", starId, requestId });
    logCheckinEvent({ event: "wish_image_generation_started", starId, requestId });
    logCheckinEvent({ event: "wish_image_generation_completed", starId, requestId });
    logCheckinEvent({ event: "checkin_completed", starId, requestId });

    const response = NextResponse.json({ success: true, starId });

    response.cookies.set(GUEST_TOKEN_COOKIE_NAME, tokenForCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: GUEST_TOKEN_MAX_AGE_SECONDS,
    });

    return response;
  } catch (err) {
    return serverError("checkin POST", err, requestId);
  }
}
