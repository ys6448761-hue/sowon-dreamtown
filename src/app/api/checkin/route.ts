/**
 * CHECKIN-001: 안내판 QR 체크인 API
 * POST /api/checkin
 *
 * 입력: multipart/form-data { name, photo, wish }
 * 처리: 정면사진을 public/uploads/checkin에 저장 → DtStar(우주민) + DtWish 생성
 * 산출물: { success, starId }
 */

import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
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

const NAME_MAX = 50;
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
  const rawWish = form.get("wish");
  const photo = form.get("photo");

  const name = typeof rawName === "string" ? sanitizeText(rawName) : "";
  const wish = typeof rawWish === "string" ? sanitizeText(rawWish) : "";

  if (!name || name.length > NAME_MAX) {
    return NextResponse.json(
      { error: "name required (1~50자)", request_id: requestId },
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
    const uploadDir = path.join(process.cwd(), "public", "uploads", "checkin");
    await mkdir(uploadDir, { recursive: true });

    const fileId = crypto.randomUUID();
    const fileName = `${fileId}.${ext}`;
    const filePath = path.join(uploadDir, fileName);
    const buffer = Buffer.from(await photo.arrayBuffer());
    await writeFile(filePath, buffer);
    const photoUrl = `/uploads/checkin/${fileName}`;

    const existingToken = req.cookies.get(GUEST_TOKEN_COOKIE_NAME)?.value;

    let starId: string;
    let tokenForCookie: string;
    try {
      // Identity 조회·생성·갱신 + Star/Wish/Journal을 단일 트랜잭션으로 처리 (ISS-002, OWN-003)
      // Identity 분기가 필요해 interactive transaction 사용
      ({ starId, tokenForCookie } = await prisma.$transaction(async (tx) => {
        const now = new Date();
        let identityId: string;
        let tokenForCookie: string;

        if (existingToken !== undefined) {
          const tokenHash = hashGuestToken(existingToken);
          const existing = await tx.dtGuestIdentity.findUnique({ where: { tokenHash } });

          if (existing && existing.expiresAt > now) {
            // 유효 Identity 재사용 — sliding expiration
            await tx.dtGuestIdentity.update({
              where: { id: existing.id },
              data: { lastUsedAt: now, expiresAt: calculateGuestIdentityExpiry(now) },
            });
            identityId = existing.id;
            tokenForCookie = existingToken;
          } else {
            // Identity 없거나 만료 — 새 Identity 생성
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
          // Cookie 없음 — 새 Identity 생성
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

        const starId = crypto.randomUUID();
        await tx.dtStar.create({
          data: {
            id: starId,
            userId: "anonymous",
            starName: "나의 별",
            visitorName: name,
            photoUrl,
            dayCount: 1,
            starStage: 1,
            guestIdentityId: identityId,
          },
        });

        await tx.dtWish.create({
          data: {
            id: crypto.randomUUID(),
            starId,
            content: wish,
          },
        });

        await tx.dtJournal.create({
          data: {
            id: crypto.randomUUID(),
            starId,
            ...DAY_ZERO_JOURNAL,
          },
        });

        return { starId, tokenForCookie };
      }));
    } catch (dbErr) {
      // DB 실패 보상: 업로드 파일 삭제 (고아 파일 방지)
      try {
        await unlink(filePath);
      } catch (cleanupError) {
        console.error("[CHECKIN] upload_cleanup_failed", {
          requestId,
          filePath,
          cleanupError,
        });
      }
      throw dbErr;
    }

    // Transaction 성공 후에만 Cookie 설정
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
