import { prisma } from "@/lib/prisma";
import type { DtStarModel, DtGuestIdentityModel } from "@/generated/prisma/models";
import { hashGuestToken } from "./guest-identity";

export type OwnershipResult =
  | { ok: true; star: DtStarModel; guestIdentity: DtGuestIdentityModel }
  | {
      ok: false;
      reason:
        | "star_not_found"
        | "legacy_star"
        | "missing_token"
        | "invalid_token"
        | "expired_token"
        | "not_owner";
    };

export async function verifyStarOwnership(
  starId: string,
  token?: string,
): Promise<OwnershipResult> {
  // 1. DtStar 조회
  const star = await prisma.dtStar.findUnique({ where: { id: starId } });
  if (!star) {
    return { ok: false, reason: "star_not_found" };
  }

  // 2. Legacy Star (guestIdentityId = NULL) — 자동 허용 없음
  if (star.guestIdentityId === null) {
    return { ok: false, reason: "legacy_star" };
  }

  // 3. Token 존재 확인
  if (!token) {
    return { ok: false, reason: "missing_token" };
  }

  // 4-5. Token → SHA-256 hash → DtGuestIdentity 조회
  const tokenHash = hashGuestToken(token);
  const guestIdentity = await prisma.dtGuestIdentity.findUnique({ where: { tokenHash } });
  if (!guestIdentity) {
    return { ok: false, reason: "invalid_token" };
  }

  // 6. 만료 확인
  if (guestIdentity.expiresAt <= new Date()) {
    return { ok: false, reason: "expired_token" };
  }

  // 7. 소유권 확인 — Identity.id === Star.guestIdentityId
  if (guestIdentity.id !== star.guestIdentityId) {
    return { ok: false, reason: "not_owner" };
  }

  // 8. 검증 통과
  return { ok: true, star, guestIdentity };
}
