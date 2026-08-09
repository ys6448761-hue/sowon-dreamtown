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
import { logCheckinEvent } from "@/lib/utils/checkin-events";
import { runWishartGeneration } from "@/lib/wishart/run-generation";

const NAME_MAX = 50;
const PHONE_MAX = 20;
const WISH_MAX = 200;
const PHOTO_MAX_BYTES = 20 * 1024 * 1024; // 20MB — frontend optimizePhoto() post-compress limit
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
    const existingToken = req.cookies.get(GUEST_TOKEN_COOKIE_NAME)?.value;

    // ── Deduplication guard ──────────────────────────────────────────────────
    // 동일 GuestIdentity에 DtStar가 이미 존재하면 R2 업로드 없이 기존 별을 반환한다.
    // 선택 기준: createdAt DESC 첫 번째 — /api/dt/me/star 와 동일 (DT-MVP-001).
    if (existingToken !== undefined) {
      const tokenHash = hashGuestToken(existingToken);
      const existingIdentity = await prisma.dtGuestIdentity.findUnique({
        where: { tokenHash },
      });
      if (existingIdentity && existingIdentity.expiresAt > new Date()) {
        const existingStar = await prisma.dtStar.findFirst({
          where: { guestIdentityId: existingIdentity.id },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            wishImageStatus: true,
            wishImageUrl: true,
            photoUrl: true,
            _count: { select: { wishes: true } },
          },
        });
        if (existingStar) {
          // AI 완료 상태: 동일 GuestIdentity 아래 신규 별 생성 허용
          // ready / revealed / Phase A 정적 이미지 → fall through to new star creation
          const isAiComplete =
            existingStar.wishImageStatus === "ready" ||
            existingStar.wishImageStatus === "revealed" ||
            existingStar.wishImageUrl?.startsWith("/images/");

          // 실제 재개 가능 조건:
          // 1. AI가 아직 완료되지 않았고 (pending / generating / failed)
          // 2. photoUrl이 있고 (R2 업로드 + DB 트랜잭션이 실제로 완료된 별)
          // 3. DtWish가 존재함 (소원이 실제로 저장된 별)
          // 위 조건 미충족 시 zombie star로 간주 → 신규 별 생성 허용
          const shouldResume =
            !isAiComplete &&
            !!existingStar.photoUrl &&
            existingStar._count.wishes > 0;

          if (shouldResume) {
            await prisma.dtGuestIdentity.update({
              where: { id: existingIdentity.id },
              data: {
                lastUsedAt: new Date(),
                expiresAt: calculateGuestIdentityExpiry(new Date()),
              },
            });
            logCheckinEvent({ event: "checkin_resumed", starId: existingStar.id, requestId });

            const resumeResponse = NextResponse.json({
              success: true,
              starId: existingStar.id,
              isResuming: true,
            });
            resumeResponse.cookies.set(GUEST_TOKEN_COOKIE_NAME, existingToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              path: "/",
              maxAge: GUEST_TOKEN_MAX_AGE_SECONDS,
            });
            return resumeResponse;
          }
          // isComplete → fall through: 기존 identity 재사용, 신규 별 생성
        }
      }
    }

    // ── 신규 별 생성 ─────────────────────────────────────────────────────────
    // starId를 트랜잭션 전에 결정 → R2 object key에 사용
    const newStarId = crypto.randomUUID();
    const fileId = crypto.randomUUID();
    const photoKey = `checkin/${newStarId}/${fileId}.${ext}`;
    const buffer = Buffer.from(await photo.arrayBuffer());

    // R2 업로드: DB 트랜잭션 전에 먼저 실행.
    // DB 실패 시 R2에 고아 객체가 남을 수 있으나 파일럿 규모(20인)에서 수용 가능.
    await uploadToR2(photoKey, buffer, photo.type);
    logCheckinEvent({ event: "portrait_uploaded", requestId });

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

      await tx.dtStar.create({
        data: {
          id: newStarId,
          userId: "anonymous",
          starName: "나의 별",
          visitorName: name,
          photoUrl: photoKey, // R2 object key 저장 (공개 URL 아님)
          phone,
          // wishImageUrl: null (기본값), wishImageStatus: "pending" (기본값)
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
    logCheckinEvent({ event: "checkin_completed", starId, requestId });

    if (process.env.OPENAI_API_KEY) {
      logCheckinEvent({ event: "wish_image_generation_started", starId, requestId });
      void runWishartGeneration(starId, buffer, wish, photo.type);
    } else {
      // API Key 미설정 — pending 고착 방지: 즉시 failed로 전환
      void prisma.dtStar.update({
        where: { id: starId },
        data: { wishImageStatus: "failed" },
      }).catch(() => {});
    }

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
