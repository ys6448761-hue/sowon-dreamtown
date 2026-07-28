/**
 * GET /api/dt/me/star
 *
 * 현재 소유자(로그인 User 또는 Guest)의 별과 최소 요약을 반환한다.
 *
 * Identity Resolution (우선순위):
 *   1. 로그인: session.user.id → DtStar.userId
 *   2. Guest:  dt_guest_token Cookie → hashGuestToken → DtGuestIdentity → guestIdentityId
 *
 * Star Selection: createdAt DESC 첫 번째 (DT-MVP-001 임시 규칙)
 *
 * Schema 확인 결과:
 *   - DtStar.updatedAt 없음 → response 제외
 *   - DtNanum.fromStarId 미저장 → nanumCount = DtNanum.starId 기반(수신 건수)
 *   - DtConnection.otherStarId FK 없음 → connectionsCount = source only (단방향)
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  GUEST_TOKEN_COOKIE_NAME,
  hashGuestToken,
} from "@/lib/utils/guest-identity";

// ── Response Types ─────────────────────────────────────────────────────────

type StarSummaryResponse = {
  ok: true;
  star: {
    id: string;
    name: string;
    createdAt: string;
  };
  summary: {
    wishesCount: number;
    journalsCount: number;
    connectionsCount: number;
    nanumCount: number;
  };
};

type ErrorResponse = { error: string };

// ── Type helper: extract Prisma result shape without `any` ─────────────────
// Never called at runtime — used only for ReturnType inference.
function _starQueryShape(id: string) {
  return prisma.dtStar.findFirst({
    where: { userId: id },
    include: {
      _count: {
        select: {
          wishes: true,
          journals: true,
          connections: true,
          nanums: true,
        },
      },
    },
  });
}

type StarWithCount = NonNullable<Awaited<ReturnType<typeof _starQueryShape>>>;

// ── Route Handler ──────────────────────────────────────────────────────────

export async function GET(
  req: NextRequest
): Promise<NextResponse<StarSummaryResponse | ErrorResponse>> {
  const session = await auth();

  // ── Identity Resolution ─────────────────────────────────────────────────
  if (session?.user?.id) {
    return queryAndRespond({ userId: session.user.id });
  }

  // No session — Guest path
  const token = req.cookies.get(GUEST_TOKEN_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const tokenHash = hashGuestToken(token);
  const identity = await prisma.dtGuestIdentity.findUnique({ where: { tokenHash } });
  if (!identity) {
    return NextResponse.json({ error: "invalid guest identity" }, { status: 403 });
  }
  if (identity.expiresAt <= new Date()) {
    return NextResponse.json({ error: "guest identity expired" }, { status: 403 });
  }

  return queryAndRespond({ guestIdentityId: identity.id });
}

// ── Internal helpers ───────────────────────────────────────────────────────

async function queryAndRespond(
  where: { userId: string } | { guestIdentityId: string }
): Promise<NextResponse<StarSummaryResponse | ErrorResponse>> {
  const star = await prisma.dtStar.findFirst({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          wishes: true,
          journals: true,
          connections: true,
          nanums: true,
        },
      },
    },
  });

  return buildResponse(star);
}

function buildResponse(
  star: StarWithCount | null
): NextResponse<StarSummaryResponse | ErrorResponse> {
  if (!star) {
    return NextResponse.json({ error: "star not found" }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    star: {
      id: star.id,
      name: star.starName,
      createdAt: star.createdAt.toISOString(),
    },
    summary: {
      wishesCount: star._count.wishes,
      journalsCount: star._count.journals,
      connectionsCount: star._count.connections,
      nanumCount: star._count.nanums,
    },
  });
}
