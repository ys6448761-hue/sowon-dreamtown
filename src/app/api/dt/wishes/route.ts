/**
 * GET  /api/dt/wishes?starId=xxx  — 소원 목록 (current / previous[])
 * POST /api/dt/wishes             — 소원 생성 (star 없으면 함께 생성)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serverError, makeRequestId } from "@/lib/apiError";
import { DAY_ZERO_JOURNAL } from "@/lib/utils/day-zero-journal";
import {
  GUEST_TOKEN_COOKIE_NAME,
  GUEST_TOKEN_MAX_AGE_SECONDS,
  generateGuestToken,
  hashGuestToken,
  calculateGuestIdentityExpiry,
} from "@/lib/utils/guest-identity";
import { verifyStarOwnership } from "@/lib/utils/ownership-guard";

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
    // starId 없으면 새 별 생성 (Option B — 최초 소원 흐름)
    if (!starId) {
      const existingToken = req.cookies.get(GUEST_TOKEN_COOKIE_NAME)?.value;

      // Identity 조회·생성·갱신 + Star/Wish/Journal을 단일 트랜잭션으로 처리 (ISS-001, OWN-002)
      // Identity 분기가 필요해 interactive transaction 사용
      const { newStarId, wish, tokenForCookie } = await prisma.$transaction(async (tx) => {
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

        const newStarId = crypto.randomUUID();
        await tx.dtStar.create({
          data: {
            id: newStarId,
            userId: "anonymous",
            starName: "나의 별",
            dayCount: 1,
            starStage: 1,
            guestIdentityId: identityId,
          },
        });

        const wish = await tx.dtWish.create({
          data: {
            id: crypto.randomUUID(),
            starId: newStarId,
            content: content.trim(),
          },
        });

        await tx.dtJournal.create({
          data: {
            id: crypto.randomUUID(),
            starId: newStarId,
            ...DAY_ZERO_JOURNAL,
          },
        });

        return { newStarId, wish, tokenForCookie };
      });

      // Transaction 성공 후에만 Cookie 설정
      const response = NextResponse.json({
        success: true,
        starId: newStarId,
        wish: {
          id: wish.id,
          content: wish.content,
          createdAt: wish.createdAt.toISOString().slice(0, 10),
        },
      });

      response.cookies.set(GUEST_TOKEN_COOKIE_NAME, tokenForCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: GUEST_TOKEN_MAX_AGE_SECONDS,
      });

      return response;
    }

    // starId 전달 시 소유권 확인 (OWN-005)
    const token = req.cookies.get(GUEST_TOKEN_COOKIE_NAME)?.value;
    const guard = await verifyStarOwnership(starId, token);
    if (!guard.ok) {
      if (guard.reason === "star_not_found") {
        return NextResponse.json({ error: "star not found" }, { status: 404 });
      }
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const wish = await prisma.dtWish.create({
      data: {
        id: crypto.randomUUID(),
        starId,
        content: content.trim(),
      },
    });

    // 첫 소원일 때만 Day 0 항해기록 자동 생성 (중복 방지)
    const wishCount = await prisma.dtWish.count({ where: { starId } });
    if (wishCount === 1) {
      await prisma.dtJournal.create({
        data: {
          id: crypto.randomUUID(),
          starId,
          ...DAY_ZERO_JOURNAL,
        },
      });
    }

    return NextResponse.json({
      success: true,
      starId,
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
