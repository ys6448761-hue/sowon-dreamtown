/**
 * POST /api/dt/claim
 * Guest로 생성한 Star를 로그인 User 계정으로 연결(Claim)한다.
 * Cookie의 dt_guest_token → GuestIdentity → 연결된 Star.userId 업데이트
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  GUEST_TOKEN_COOKIE_NAME,
  hashGuestToken,
} from "@/lib/utils/guest-identity";

export async function POST(req: NextRequest) {
  // 1. 로그인 세션 확인 (Runtime 검증 포함 — OWN-008A)
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  // 2. Guest Token Cookie 확인
  const token = req.cookies.get(GUEST_TOKEN_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: "guest token required" }, { status: 403 });
  }

  // 3. GuestIdentity 존재 확인 (identity.id 획득 목적)
  const tokenHash = hashGuestToken(token);
  const identity = await prisma.dtGuestIdentity.findUnique({ where: { tokenHash } });
  if (!identity) {
    return NextResponse.json({ error: "guest identity not found" }, { status: 404 });
  }

  // 4. Atomic Claim Transaction (OWN-008A — Race Condition 차단)
  // 만료·중복 Claim 확인을 Transaction 밖에서 하지 않고
  // 조건부 UPDATE의 WHERE 절로 Atomic하게 처리한다.
  try {
    const result = await prisma.$transaction(async (tx) => {
      const now = new Date();

      // 조건부 UPDATE: claimedUserId IS NULL AND expiresAt > now 인 경우에만 Claim
      // 동시 요청이 와도 하나만 count=1을 얻는다 (DB 레벨 Atomicity)
      const { count: identityCount } = await tx.dtGuestIdentity.updateMany({
        where: {
          id: identity.id,
          claimedUserId: null,
          expiresAt: { gt: now },
        },
        data: { claimedUserId: userId },
      });

      if (identityCount === 0) {
        // 재조회로 실패 원인 판별 (expired vs already claimed)
        const current = await tx.dtGuestIdentity.findUnique({ where: { id: identity.id } });
        if (!current || current.expiresAt <= now) {
          return { error: "guest identity expired", status: 403 } as const;
        }
        return { error: "already claimed", status: 409 } as const;
      }

      // Claim 성공 — Star.userId 업데이트 (userId = "anonymous" 인 Star만)
      const { count: starCount } = await tx.dtStar.updateMany({
        where: {
          guestIdentityId: identity.id,
          userId: "anonymous",
        },
        data: { userId },
      });

      return { claimedStars: starCount };
    });

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({ ok: true, claimedStars: result.claimedStars });
  } catch (err) {
    console.error("[dt/claim] POST error:", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
