/**
 * CHECKIN-001: 안내판 QR 체크인 API
 * POST /api/checkin
 *
 * 입력: multipart/form-data { name, photo, wish }
 * 처리: 정면사진을 public/uploads/checkin에 저장 → DtStar(우주민) + DtWish 생성
 * 산출물: { success, starId }
 */

import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { sanitizeText } from "@/lib/sanitize";
import { serverError, makeRequestId } from "@/lib/apiError";

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
    const buffer = Buffer.from(await photo.arrayBuffer());
    await writeFile(path.join(uploadDir, fileName), buffer);
    const photoUrl = `/uploads/checkin/${fileName}`;

    const star = await prisma.dtStar.create({
      data: {
        id: crypto.randomUUID(),
        userId: "anonymous", // 인증 연결 전 임시값 (dt/wishes와 동일 관례)
        starName: "나의 별",
        visitorName: name,
        photoUrl,
        dayCount: 1,
        starStage: 1,
      },
    });

    await prisma.dtWish.create({
      data: {
        id: crypto.randomUUID(),
        starId: star.id,
        content: wish,
      },
    });

    await prisma.dtJournal.create({
      data: {
        id: crypto.randomUUID(),
        starId: star.id,
        emotion: "믿고 싶어졌어요",
        helpTag: "연결",
        growthLine: "조금 가벼워졌어요",
      },
    });

    return NextResponse.json({ success: true, starId: star.id });
  } catch (err) {
    return serverError("checkin POST", err, requestId);
  }
}
