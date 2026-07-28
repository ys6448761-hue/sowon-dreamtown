/**
 * DT-MVP-001 — GET /api/dt/me/star tests
 *
 * Test Matrix: 11 scenarios (spec § 테스트 Matrix)
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { randomBytes, randomUUID } from "crypto";

// ── Module Mocks ───────────────────────────────────────────────────────────

vi.mock("@/lib/prisma", () => ({
  prisma: {
    dtGuestIdentity: {
      findUnique: vi.fn(),
    },
    dtStar: {
      findFirst: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

// ── Imports (after mocks) ──────────────────────────────────────────────────

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { GUEST_TOKEN_COOKIE_NAME } from "@/lib/utils/guest-identity";
import { GET as meStarGet } from "@/app/api/dt/me/star/route";

// ── Helpers ────────────────────────────────────────────────────────────────

function makeToken(): string {
  return randomBytes(32).toString("base64url");
}

function makeId(): string {
  return randomUUID();
}

function makeRequest(
  cookies?: Record<string, string>
): NextRequest {
  const headers = new Headers();
  if (cookies) {
    headers.set(
      "Cookie",
      Object.entries(cookies)
        .map(([k, v]) => `${k}=${v}`)
        .join("; ")
    );
  }
  return new NextRequest("http://localhost/api/dt/me/star", {
    method: "GET",
    headers,
  });
}

function makeMockIdentity(overrides: {
  id?: string;
  expiresAt?: Date;
  claimedUserId?: string | null;
} = {}) {
  return {
    id: overrides.id ?? makeId(),
    tokenHash: "mock-hash",
    expiresAt: overrides.expiresAt ?? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    lastUsedAt: new Date(),
    claimedUserId: overrides.claimedUserId ?? null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function makeMockStar(overrides: {
  id?: string;
  userId?: string;
  guestIdentityId?: string | null;
  createdAt?: Date;
  wishesCount?: number;
  journalsCount?: number;
  connectionsCount?: number;
  naNumCount?: number;
} = {}) {
  return {
    id: overrides.id ?? makeId(),
    userId: overrides.userId ?? "anonymous",
    starName: "나의 별",
    createdAt: overrides.createdAt ?? new Date("2026-01-01T00:00:00.000Z"),
    dayCount: 1,
    starStage: 1,
    visitorName: null,
    photoUrl: null,
    guestIdentityId: overrides.guestIdentityId !== undefined
      ? overrides.guestIdentityId
      : makeId(),
    _count: {
      wishes: overrides.wishesCount ?? 0,
      journals: overrides.journalsCount ?? 0,
      connections: overrides.connectionsCount ?? 0,
      nanums: overrides.naNumCount ?? 0,
    },
  };
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe("DT-MVP-001 GET /api/dt/me/star", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  // ── Test 1: 세션 없음 + Cookie 없음 → 401 ─────────────────────────────

  it("1. returns 401 when session and cookie are both absent", async () => {
    vi.mocked(auth).mockResolvedValueOnce(null as never);

    const req = makeRequest(); // no cookie
    const res = await meStarGet(req);

    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "unauthorized" });
  });

  // ── Test 2: 잘못된 Guest Token → 403 ──────────────────────────────────

  it("2. returns 403 when guest token is not in DB (invalid)", async () => {
    vi.mocked(auth).mockResolvedValueOnce(null as never);
    vi.mocked(prisma.dtGuestIdentity.findUnique).mockResolvedValueOnce(null);

    const req = makeRequest({ [GUEST_TOKEN_COOKIE_NAME]: "invalid-token" });
    const res = await meStarGet(req);

    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ error: "invalid guest identity" });
  });

  // ── Test 3: 만료 GuestIdentity → 403 ─────────────────────────────────

  it("3. returns 403 when GuestIdentity is expired", async () => {
    vi.mocked(auth).mockResolvedValueOnce(null as never);
    vi.mocked(prisma.dtGuestIdentity.findUnique).mockResolvedValueOnce(
      makeMockIdentity({ expiresAt: new Date(Date.now() - 1000) })
    );

    const req = makeRequest({ [GUEST_TOKEN_COOKIE_NAME]: makeToken() });
    const res = await meStarGet(req);

    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ error: "guest identity expired" });
  });

  // ── Test 4: 유효한 GuestIdentity + Star 없음 → 404 ───────────────────

  it("4. returns 404 when identity is valid but no star exists", async () => {
    vi.mocked(auth).mockResolvedValueOnce(null as never);
    vi.mocked(prisma.dtGuestIdentity.findUnique).mockResolvedValueOnce(
      makeMockIdentity()
    );
    vi.mocked(prisma.dtStar.findFirst).mockResolvedValueOnce(null);

    const req = makeRequest({ [GUEST_TOKEN_COOKIE_NAME]: makeToken() });
    const res = await meStarGet(req);

    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "star not found" });
  });

  // ── Test 5: 유효한 GuestIdentity + anonymous Star → 200 ──────────────

  it("5. returns 200 with star summary for valid guest with anonymous star", async () => {
    const identityId = makeId();
    const starId = makeId();

    vi.mocked(auth).mockResolvedValueOnce(null as never);
    vi.mocked(prisma.dtGuestIdentity.findUnique).mockResolvedValueOnce(
      makeMockIdentity({ id: identityId })
    );
    vi.mocked(prisma.dtStar.findFirst).mockResolvedValueOnce(
      makeMockStar({
        id: starId,
        userId: "anonymous",
        guestIdentityId: identityId,
        wishesCount: 3,
        journalsCount: 2,
        connectionsCount: 1,
        naNumCount: 4,
      })
    );

    const req = makeRequest({ [GUEST_TOKEN_COOKIE_NAME]: makeToken() });
    const res = await meStarGet(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.star.id).toBe(starId);
    expect(body.star.name).toBe("나의 별");
    expect(typeof body.star.createdAt).toBe("string"); // ISO string
    expect(body.summary.wishesCount).toBe(3);
    expect(body.summary.journalsCount).toBe(2);
    expect(body.summary.connectionsCount).toBe(1);
    expect(body.summary.nanumCount).toBe(4);
  });

  // ── Test 6: 로그인 사용자 + 소유 Star → 200 ──────────────────────────

  it("6. returns 200 with star summary for authenticated user", async () => {
    const userId = makeId();
    const starId = makeId();

    vi.mocked(auth).mockResolvedValueOnce({ user: { id: userId } } as never);
    vi.mocked(prisma.dtStar.findFirst).mockResolvedValueOnce(
      makeMockStar({ id: starId, userId, wishesCount: 5 })
    );

    const req = makeRequest();
    const res = await meStarGet(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.star.id).toBe(starId);
    expect(body.summary.wishesCount).toBe(5);
    // GuestIdentity should NOT be queried for logged-in user
    expect(vi.mocked(prisma.dtGuestIdentity.findUnique)).not.toHaveBeenCalled();
  });

  // ── Test 7: 로그인 사용자 + Guest Token 혼재 → User Ownership 우선 ───

  it("7. logged-in user with guest cookie: uses User Ownership, not guest token", async () => {
    const userId = makeId();
    const starId = makeId();

    vi.mocked(auth).mockResolvedValueOnce({ user: { id: userId } } as never);
    vi.mocked(prisma.dtStar.findFirst).mockResolvedValueOnce(
      makeMockStar({ id: starId, userId })
    );

    // Cookie is present but should be ignored
    const req = makeRequest({ [GUEST_TOKEN_COOKIE_NAME]: makeToken() });
    const res = await meStarGet(req);

    expect(res.status).toBe(200);
    // dtGuestIdentity.findUnique must NOT be called
    expect(vi.mocked(prisma.dtGuestIdentity.findUnique)).not.toHaveBeenCalled();
    // dtStar.findFirst must be called with userId, not guestIdentityId
    const findFirstCall = vi.mocked(prisma.dtStar.findFirst).mock.calls[0][0];
    expect(findFirstCall?.where).toEqual({ userId });
  });

  // ── Test 8: 로그인 사용자 + 소유 Star 없음 → 404 (Guest Star 자동 반환 금지) ──

  it("8. returns 404 when logged-in user has no star (no anonymous star fallback)", async () => {
    const userId = makeId();

    vi.mocked(auth).mockResolvedValueOnce({ user: { id: userId } } as never);
    vi.mocked(prisma.dtStar.findFirst).mockResolvedValueOnce(null);

    const req = makeRequest({ [GUEST_TOKEN_COOKIE_NAME]: makeToken() });
    const res = await meStarGet(req);

    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "star not found" });
    // Must NOT attempt guest identity lookup
    expect(vi.mocked(prisma.dtGuestIdentity.findUnique)).not.toHaveBeenCalled();
  });

  // ── Test 9: 여러 Star → createdAt DESC 첫 번째 반환 ──────────────────

  it("9. queries stars ordered by createdAt DESC", async () => {
    const userId = makeId();
    const latestStarId = makeId();

    vi.mocked(auth).mockResolvedValueOnce({ user: { id: userId } } as never);
    vi.mocked(prisma.dtStar.findFirst).mockResolvedValueOnce(
      makeMockStar({ id: latestStarId, userId, createdAt: new Date("2026-07-01T00:00:00.000Z") })
    );

    const req = makeRequest();
    const res = await meStarGet(req);

    expect(res.status).toBe(200);
    expect((await res.json()).star.id).toBe(latestStarId);

    const findFirstCall = vi.mocked(prisma.dtStar.findFirst).mock.calls[0][0];
    expect(findFirstCall?.orderBy).toEqual({ createdAt: "desc" });
  });

  // ── Test 10: Count 검증 ───────────────────────────────────────────────

  it("10. summary counts match _count values from Prisma", async () => {
    const userId = makeId();

    vi.mocked(auth).mockResolvedValueOnce({ user: { id: userId } } as never);
    vi.mocked(prisma.dtStar.findFirst).mockResolvedValueOnce(
      makeMockStar({
        userId,
        wishesCount: 7,
        journalsCount: 14,
        connectionsCount: 3,
        naNumCount: 21,
      })
    );

    const req = makeRequest();
    const res = await meStarGet(req);

    expect(res.status).toBe(200);
    const { summary } = await res.json();
    expect(summary.wishesCount).toBe(7);
    expect(summary.journalsCount).toBe(14);
    expect(summary.connectionsCount).toBe(3);
    expect(summary.nanumCount).toBe(21);
  });

  // ── Test 11: 민감 필드 응답 제외 ──────────────────────────────────────

  it("11. response does not contain sensitive ownership fields", async () => {
    const userId = makeId();

    vi.mocked(auth).mockResolvedValueOnce({ user: { id: userId } } as never);
    vi.mocked(prisma.dtStar.findFirst).mockResolvedValueOnce(
      makeMockStar({ userId, guestIdentityId: makeId() })
    );

    const req = makeRequest();
    const res = await meStarGet(req);

    expect(res.status).toBe(200);
    const body = JSON.stringify(await res.json());

    const FORBIDDEN_FIELDS = [
      "guestIdentityId",
      "tokenHash",
      "claimedUserId",
      "dayCount",
      "starStage",
      "visitorName",
      "photoUrl",
    ];

    for (const field of FORBIDDEN_FIELDS) {
      expect(body).not.toContain(`"${field}"`);
    }
  });

  // ── Additional: createdAt is ISO string, not Date object ─────────────

  it("createdAt is returned as ISO 8601 string", async () => {
    const userId = makeId();
    const fixedDate = new Date("2026-07-15T12:00:00.000Z");

    vi.mocked(auth).mockResolvedValueOnce({ user: { id: userId } } as never);
    vi.mocked(prisma.dtStar.findFirst).mockResolvedValueOnce(
      makeMockStar({ userId, createdAt: fixedDate })
    );

    const req = makeRequest();
    const res = await meStarGet(req);

    const body = await res.json();
    expect(body.star.createdAt).toBe(fixedDate.toISOString());
  });

  // ── Additional: guest query uses guestIdentityId, not userId ─────────

  it("guest star query uses guestIdentityId where clause", async () => {
    const identityId = makeId();

    vi.mocked(auth).mockResolvedValueOnce(null as never);
    vi.mocked(prisma.dtGuestIdentity.findUnique).mockResolvedValueOnce(
      makeMockIdentity({ id: identityId })
    );
    vi.mocked(prisma.dtStar.findFirst).mockResolvedValueOnce(
      makeMockStar({ guestIdentityId: identityId })
    );

    const req = makeRequest({ [GUEST_TOKEN_COOKIE_NAME]: makeToken() });
    await meStarGet(req);

    const findFirstCall = vi.mocked(prisma.dtStar.findFirst).mock.calls[0][0];
    expect(findFirstCall?.where).toEqual({ guestIdentityId: identityId });
    // userId must NOT be in where clause
    expect(findFirstCall?.where).not.toHaveProperty("userId");
  });
});
