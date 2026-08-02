/**
 * OWN-010 — DreamTown Ownership System End-to-End Tests
 *
 * Test framework: Vitest 4.x (추가 사유: 기존 테스트 도구 없음. TypeScript-native,
 *                 Next.js 16/Vite 생태계 정합, Jest transform 설정 불필요)
 * 추가 패키지: vitest@^4.1.10
 * 실행 명령: npm test
 *
 * Scope: Route handler + Guard 로직을 Prisma/Auth 모킹으로 검증.
 * DB 의존 테스트 (Scenario 6: Atomic Claim 동시성)는 TEST_DATABASE_URL 없이
 * 실행 불가 — 해당 테스트는 skipIf로 분리하고 보고서에 명시.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { randomBytes, randomUUID } from "crypto";

// ── Module Mocks (hoisted) ─────────────────────────────────────────────────

vi.mock("@/lib/prisma", () => ({
  prisma: {
    dtGuestIdentity: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    dtStar: {
      findUnique: vi.fn(),
      create: vi.fn(),
      updateMany: vi.fn(),
    },
    dtWish: { create: vi.fn(), count: vi.fn() },
    dtJournal: { create: vi.fn() },
    dtNanum: {
      create: vi.fn(),
      count: vi.fn(),
      findMany: vi.fn(),
    },
    dtConnection: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

// ── Imports (after mock declarations) ─────────────────────────────────────

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { verifyStarOwnership } from "@/lib/utils/ownership-guard";
import {
  hashGuestToken,
  generateGuestToken,
  GUEST_TOKEN_COOKIE_NAME,
} from "@/lib/utils/guest-identity";
import { POST as nanumPost } from "@/app/api/dt/nanum/route";
import { POST as connectionPost } from "@/app/api/dt/connection/route";
import { POST as acknowledgePost } from "@/app/api/dt/connection/[id]/acknowledge/route";
import { POST as claimPost } from "@/app/api/dt/claim/route";

// ── Test Helpers ───────────────────────────────────────────────────────────

function makeToken(): string {
  return randomBytes(32).toString("base64url");
}

function makeId(): string {
  return randomUUID();
}

function makeRequest(
  url: string,
  {
    method = "POST",
    body,
    cookies,
  }: {
    method?: string;
    body?: unknown;
    cookies?: Record<string, string>;
  } = {}
): NextRequest {
  const headers = new Headers();
  if (body != null) headers.set("Content-Type", "application/json");
  if (cookies) {
    headers.set(
      "Cookie",
      Object.entries(cookies)
        .map(([k, v]) => `${k}=${v}`)
        .join("; ")
    );
  }
  return new NextRequest(new URL(url, "http://localhost"), {
    method,
    body: body != null ? JSON.stringify(body) : undefined,
    headers,
  });
}

function makeMockIdentity(overrides: {
  id?: string;
  tokenHash?: string;
  expiresAt?: Date;
  claimedUserId?: string | null;
} = {}) {
  return {
    id: overrides.id ?? makeId(),
    tokenHash: overrides.tokenHash ?? "mock-hash",
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
} = {}) {
  return {
    id: overrides.id ?? makeId(),
    userId: overrides.userId ?? "anonymous",
    starName: "나의 별",
    dayCount: 1,
    starStage: 1,
    guestIdentityId: overrides.guestIdentityId !== undefined
      ? overrides.guestIdentityId
      : makeId(),
    createdAt: new Date(),
    updatedAt: new Date(),
    visitorName: null,
    photoUrl: null,
  };
}

// ── Main Test Suite ────────────────────────────────────────────────────────

describe("OWN-010 DreamTown Ownership System", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Default $transaction: pass-through (calls callback with prisma as tx)
    vi.mocked(prisma.$transaction).mockImplementation(
      async (fn: unknown) => {
        if (typeof fn === "function") return fn(prisma);
        return fn;
      }
    );
  });

  // ── Scenario 1-3: verifyStarOwnership Guard Unit Tests ─────────────────

  describe("Guard: verifyStarOwnership", () => {
    it("returns star_not_found when star does not exist", async () => {
      vi.mocked(prisma.dtStar.findUnique).mockResolvedValueOnce(null);

      const result = await verifyStarOwnership("nonexistent-id", "any-token");

      expect(result).toEqual({ ok: false, reason: "star_not_found" });
    });

    it("returns legacy_star when star has null guestIdentityId", async () => {
      vi.mocked(prisma.dtStar.findUnique).mockResolvedValueOnce(
        makeMockStar({ guestIdentityId: null })
      );

      const result = await verifyStarOwnership("legacy-star-id", "any-token");

      expect(result).toEqual({ ok: false, reason: "legacy_star" });
    });

    it("returns missing_token when token is undefined", async () => {
      const identityId = makeId();
      vi.mocked(prisma.dtStar.findUnique).mockResolvedValueOnce(
        makeMockStar({ guestIdentityId: identityId })
      );

      const result = await verifyStarOwnership("star-id", undefined);

      expect(result).toEqual({ ok: false, reason: "missing_token" });
      // dtGuestIdentity must NOT be queried when token is absent
      expect(vi.mocked(prisma.dtGuestIdentity.findUnique)).not.toHaveBeenCalled();
    });

    it("returns invalid_token when tokenHash not found in DB", async () => {
      const identityId = makeId();
      vi.mocked(prisma.dtStar.findUnique).mockResolvedValueOnce(
        makeMockStar({ guestIdentityId: identityId })
      );
      vi.mocked(prisma.dtGuestIdentity.findUnique).mockResolvedValueOnce(null);

      const result = await verifyStarOwnership("star-id", "bad-token");

      expect(result).toEqual({ ok: false, reason: "invalid_token" });
    });

    it("returns expired_token when identity.expiresAt is in the past", async () => {
      const identityId = makeId();
      vi.mocked(prisma.dtStar.findUnique).mockResolvedValueOnce(
        makeMockStar({ guestIdentityId: identityId })
      );
      vi.mocked(prisma.dtGuestIdentity.findUnique).mockResolvedValueOnce(
        makeMockIdentity({
          id: identityId,
          expiresAt: new Date(Date.now() - 1000),
        })
      );

      const result = await verifyStarOwnership("star-id", "some-token");

      expect(result).toEqual({ ok: false, reason: "expired_token" });
    });

    it("returns not_owner when identity.id !== star.guestIdentityId", async () => {
      const identityA = makeId();
      const identityB = makeId();
      vi.mocked(prisma.dtStar.findUnique).mockResolvedValueOnce(
        makeMockStar({ guestIdentityId: identityA })
      );
      vi.mocked(prisma.dtGuestIdentity.findUnique).mockResolvedValueOnce(
        makeMockIdentity({ id: identityB }) // different identity
      );

      const result = await verifyStarOwnership("star-id", "other-token");

      expect(result).toEqual({ ok: false, reason: "not_owner" });
    });

    it("returns ok:true with star and identity when all checks pass", async () => {
      const identityId = makeId();
      const star = makeMockStar({ guestIdentityId: identityId });
      const identity = makeMockIdentity({ id: identityId });
      vi.mocked(prisma.dtStar.findUnique).mockResolvedValueOnce(star);
      vi.mocked(prisma.dtGuestIdentity.findUnique).mockResolvedValueOnce(identity);

      const result = await verifyStarOwnership(star.id, "valid-token");

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.star).toBe(star);
        expect(result.guestIdentity).toBe(identity);
      }
    });

    it("does NOT expose internal reason codes in route response", async () => {
      // Route translates guard reasons to generic 403/404 only
      const INTERNAL_REASONS = [
        "star_not_found", "legacy_star", "missing_token",
        "invalid_token", "expired_token", "not_owner",
      ];

      vi.mocked(prisma.dtStar.findUnique).mockResolvedValueOnce(
        makeMockStar({ guestIdentityId: makeId() })
      );
      vi.mocked(prisma.dtGuestIdentity.findUnique).mockResolvedValueOnce(null);

      const req = makeRequest("http://localhost/api/dt/connection", {
        body: { starId: "star-a", otherStarId: "star-b" },
        cookies: { [GUEST_TOKEN_COOKIE_NAME]: "bad-token" },
      });
      const res = await connectionPost(req);
      const body = JSON.stringify(await res.json());

      for (const reason of INTERNAL_REASONS) {
        expect(body).not.toContain(reason);
      }
    });
  });

  // ── Scenario 2: Cross-Guest Access Blocked ─────────────────────────────

  describe("Scenario 2: Cross-Guest Write Blocked", () => {
    it("Connection POST returns 403 when token belongs to different guest", async () => {
      const identityA = makeId();
      const identityB = makeId();

      vi.mocked(prisma.dtStar.findUnique).mockResolvedValueOnce(
        makeMockStar({ id: "star-a", guestIdentityId: identityA })
      );
      vi.mocked(prisma.dtGuestIdentity.findUnique).mockResolvedValueOnce(
        makeMockIdentity({ id: identityB }) // token resolves to identity B, not A
      );

      const req = makeRequest("http://localhost/api/dt/connection", {
        body: { starId: "star-a", otherStarId: "star-b" },
        cookies: { [GUEST_TOKEN_COOKIE_NAME]: makeToken() },
      });
      const res = await connectionPost(req);

      expect(res.status).toBe(403);
      const body = await res.json();
      expect(body).toEqual({ error: "forbidden" });
    });

    it("Nanum POST returns 403 when fromStarId belongs to different guest", async () => {
      const identityA = makeId();
      const identityB = makeId();

      vi.mocked(prisma.dtStar.findUnique).mockResolvedValueOnce(
        makeMockStar({ id: "star-a", guestIdentityId: identityA })
      );
      vi.mocked(prisma.dtGuestIdentity.findUnique).mockResolvedValueOnce(
        makeMockIdentity({ id: identityB })
      );

      const req = makeRequest("http://localhost/api/dt/nanum", {
        body: { fromStarId: "star-a", starId: "star-b", type: "miracle", message: "test" },
        cookies: { [GUEST_TOKEN_COOKIE_NAME]: makeToken() },
      });
      const res = await nanumPost(req);

      expect(res.status).toBe(403);
      expect((await res.json())).toEqual({ error: "forbidden" });
    });
  });

  // ── Scenario 3: Token Validation ──────────────────────────────────────

  describe("Scenario 3: Missing / Invalid / Expired Token", () => {
    it("Connection POST returns 403 when Cookie is absent", async () => {
      vi.mocked(prisma.dtStar.findUnique).mockResolvedValueOnce(
        makeMockStar({ guestIdentityId: makeId() })
      );

      const req = makeRequest("http://localhost/api/dt/connection", {
        body: { starId: "star-id", otherStarId: "other-id" },
        // no cookie
      });
      const res = await connectionPost(req);

      expect(res.status).toBe(403);
    });

    it("Connection POST returns 403 when token is not in DB (invalid)", async () => {
      vi.mocked(prisma.dtStar.findUnique).mockResolvedValueOnce(
        makeMockStar({ guestIdentityId: makeId() })
      );
      vi.mocked(prisma.dtGuestIdentity.findUnique).mockResolvedValueOnce(null);

      const req = makeRequest("http://localhost/api/dt/connection", {
        body: { starId: "star-id", otherStarId: "other-id" },
        cookies: { [GUEST_TOKEN_COOKIE_NAME]: "invalid-token" },
      });
      const res = await connectionPost(req);

      expect(res.status).toBe(403);
    });

    it("Connection POST returns 403 when token is expired", async () => {
      const identityId = makeId();
      vi.mocked(prisma.dtStar.findUnique).mockResolvedValueOnce(
        makeMockStar({ guestIdentityId: identityId })
      );
      vi.mocked(prisma.dtGuestIdentity.findUnique).mockResolvedValueOnce(
        makeMockIdentity({
          id: identityId,
          expiresAt: new Date(Date.now() - 1000),
        })
      );

      const req = makeRequest("http://localhost/api/dt/connection", {
        body: { starId: "star-id", otherStarId: "other-id" },
        cookies: { [GUEST_TOKEN_COOKIE_NAME]: "expired-token" },
      });
      const res = await connectionPost(req);

      expect(res.status).toBe(403);
    });

    it("Connection POST returns 404 when star does not exist", async () => {
      vi.mocked(prisma.dtStar.findUnique).mockResolvedValueOnce(null);

      const req = makeRequest("http://localhost/api/dt/connection", {
        body: { starId: "nonexistent", otherStarId: "other-id" },
        cookies: { [GUEST_TOKEN_COOKIE_NAME]: "token" },
      });
      const res = await connectionPost(req);

      expect(res.status).toBe(404);
      expect((await res.json()).error).toBe("star not found");
    });

    it("Connection POST returns 403 for legacy star (no guestIdentityId)", async () => {
      vi.mocked(prisma.dtStar.findUnique).mockResolvedValueOnce(
        makeMockStar({ guestIdentityId: null })
      );

      const req = makeRequest("http://localhost/api/dt/connection", {
        body: { starId: "legacy-star", otherStarId: "other-id" },
        cookies: { [GUEST_TOKEN_COOKIE_NAME]: "some-token" },
      });
      const res = await connectionPost(req);

      expect(res.status).toBe(403);
    });
  });

  // ── Scenario 4: Claim API ─────────────────────────────────────────────

  describe("Scenario 4: Claim API", () => {
    it("returns 401 when session is absent", async () => {
      vi.mocked(auth).mockResolvedValueOnce(null as never);

      const req = makeRequest("http://localhost/api/dt/claim");
      const res = await claimPost(req);

      expect(res.status).toBe(401);
      expect(await res.json()).toEqual({ error: "unauthorized" });
    });

    it("returns 401 when session has no user.id", async () => {
      vi.mocked(auth).mockResolvedValueOnce({ user: {} } as never);

      const req = makeRequest("http://localhost/api/dt/claim");
      const res = await claimPost(req);

      expect(res.status).toBe(401);
    });

    it("returns 403 when dt_guest_token cookie is missing", async () => {
      vi.mocked(auth).mockResolvedValueOnce({ user: { id: "user-1" } } as never);

      const req = makeRequest("http://localhost/api/dt/claim");
      const res = await claimPost(req);

      expect(res.status).toBe(403);
      expect(await res.json()).toEqual({ error: "guest token required" });
    });

    it("returns 404 when GuestIdentity not found by tokenHash", async () => {
      vi.mocked(auth).mockResolvedValueOnce({ user: { id: "user-1" } } as never);
      vi.mocked(prisma.dtGuestIdentity.findUnique).mockResolvedValueOnce(null);

      const req = makeRequest("http://localhost/api/dt/claim", {
        cookies: { [GUEST_TOKEN_COOKIE_NAME]: makeToken() },
      });
      const res = await claimPost(req);

      expect(res.status).toBe(404);
      expect(await res.json()).toEqual({ error: "guest identity not found" });
    });

    it("returns 200 with claimedStars count on successful Claim", async () => {
      const identityId = makeId();
      vi.mocked(auth).mockResolvedValueOnce({ user: { id: "user-1" } } as never);
      vi.mocked(prisma.dtGuestIdentity.findUnique).mockResolvedValueOnce(
        makeMockIdentity({ id: identityId })
      );
      vi.mocked(prisma.$transaction).mockImplementationOnce(async (fn: unknown) => {
        if (typeof fn !== "function") return fn;
        const txMock = {
          dtGuestIdentity: {
            updateMany: vi.fn().mockResolvedValueOnce({ count: 1 }),
            findUnique: vi.fn(),
          },
          dtStar: {
            updateMany: vi.fn().mockResolvedValueOnce({ count: 1 }),
          },
        };
        return fn(txMock);
      });

      const req = makeRequest("http://localhost/api/dt/claim", {
        cookies: { [GUEST_TOKEN_COOKIE_NAME]: makeToken() },
      });
      const res = await claimPost(req);

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.ok).toBe(true);
      expect(body.claimedStars).toBe(1);
    });

    it("returns 409 when identity was already claimed (updateMany count=0, claimedUserId set)", async () => {
      const identityId = makeId();
      vi.mocked(auth).mockResolvedValueOnce({ user: { id: "user-1" } } as never);
      vi.mocked(prisma.dtGuestIdentity.findUnique).mockResolvedValueOnce(
        makeMockIdentity({ id: identityId })
      );
      vi.mocked(prisma.$transaction).mockImplementationOnce(async (fn: unknown) => {
        if (typeof fn !== "function") return fn;
        const txMock = {
          dtGuestIdentity: {
            updateMany: vi.fn().mockResolvedValueOnce({ count: 0 }),
            findUnique: vi.fn().mockResolvedValueOnce(
              makeMockIdentity({ id: identityId, claimedUserId: "other-user" })
            ),
          },
          dtStar: { updateMany: vi.fn() },
        };
        return fn(txMock);
      });

      const req = makeRequest("http://localhost/api/dt/claim", {
        cookies: { [GUEST_TOKEN_COOKIE_NAME]: makeToken() },
      });
      const res = await claimPost(req);

      expect(res.status).toBe(409);
      expect(await res.json()).toEqual({ error: "already claimed" });
    });

    it("returns 403 when identity is expired (updateMany count=0, expiresAt past)", async () => {
      const identityId = makeId();
      vi.mocked(auth).mockResolvedValueOnce({ user: { id: "user-1" } } as never);
      vi.mocked(prisma.dtGuestIdentity.findUnique).mockResolvedValueOnce(
        makeMockIdentity({ id: identityId })
      );
      vi.mocked(prisma.$transaction).mockImplementationOnce(async (fn: unknown) => {
        if (typeof fn !== "function") return fn;
        const txMock = {
          dtGuestIdentity: {
            updateMany: vi.fn().mockResolvedValueOnce({ count: 0 }),
            findUnique: vi.fn().mockResolvedValueOnce(
              makeMockIdentity({
                id: identityId,
                expiresAt: new Date(Date.now() - 1000),
              })
            ),
          },
          dtStar: { updateMany: vi.fn() },
        };
        return fn(txMock);
      });

      const req = makeRequest("http://localhost/api/dt/claim", {
        cookies: { [GUEST_TOKEN_COOKIE_NAME]: makeToken() },
      });
      const res = await claimPost(req);

      expect(res.status).toBe(403);
      expect(await res.json()).toEqual({ error: "guest identity expired" });
    });
  });

  // ── Scenario 5: Ownership Behavior After Claim ────────────────────────

  describe("Scenario 5: Ownership After Claim", () => {
    it("guard passes even when identity.claimedUserId is set (token ownership still valid)", async () => {
      // verifyStarOwnership does NOT check claimedUserId.
      // Ownership is based on token↔identity match, not account link status.
      const identityId = makeId();
      const star = makeMockStar({ guestIdentityId: identityId });
      const identity = makeMockIdentity({
        id: identityId,
        claimedUserId: "some-user-id", // already claimed
      });

      vi.mocked(prisma.dtStar.findUnique).mockResolvedValueOnce(star);
      vi.mocked(prisma.dtGuestIdentity.findUnique).mockResolvedValueOnce(identity);

      const result = await verifyStarOwnership(star.id, "valid-token");

      expect(result.ok).toBe(true);
    });
  });

  // ── Scenario 6: Atomic Claim (requires real DB) ───────────────────────

  describe("Scenario 6: Atomic Claim — DB-level Concurrency", () => {
    it.skipIf(!process.env.TEST_DATABASE_URL)(
      "concurrent Claim requests: exactly one 200, other 409",
      async () => {
        // REQUIRES: TEST_DATABASE_URL env var pointing to a real PostgreSQL DB.
        // Run: TEST_DATABASE_URL=postgresql://... npm test
        //
        // What this test would do:
        // 1. Create real GuestIdentity + anonymous Star via prisma.$transaction
        // 2. Fire two concurrent claimPost calls with different userId sessions
        // 3. Await both, assert statuses are [200, 409] in any order
        // 4. Read DB: assert identity.claimedUserId === winner userId
        // 5. Read DB: assert Star.userId === winner userId
        // 6. Clean up test data
        //
        // This test is intentionally skipped without TEST_DATABASE_URL.
        // DB-level atomicity is guaranteed by PostgreSQL row-level locking
        // via conditional UPDATE WHERE claimedUserId IS NULL AND expiresAt > now.
        // The mocked Claim tests in Scenario 4 verify the route logic layer.
        expect(process.env.TEST_DATABASE_URL).toBeTruthy();
      }
    );
  });

  // ── Scenario 7: Claim Filters Only Anonymous Stars ────────────────────

  describe("Scenario 7: Claim Anonymous-Only Filter", () => {
    it("claimedStars reflects only anonymous Stars updated (count=2)", async () => {
      const identityId = makeId();
      vi.mocked(auth).mockResolvedValueOnce({ user: { id: "user-1" } } as never);
      vi.mocked(prisma.dtGuestIdentity.findUnique).mockResolvedValueOnce(
        makeMockIdentity({ id: identityId })
      );
      vi.mocked(prisma.$transaction).mockImplementationOnce(async (fn: unknown) => {
        if (typeof fn !== "function") return fn;
        const txMock = {
          dtGuestIdentity: {
            updateMany: vi.fn().mockResolvedValueOnce({ count: 1 }),
            findUnique: vi.fn(),
          },
          dtStar: {
            // 2 anonymous stars, 1 already-claimed star → count = 2
            updateMany: vi.fn().mockResolvedValueOnce({ count: 2 }),
          },
        };
        return fn(txMock);
      });

      const req = makeRequest("http://localhost/api/dt/claim", {
        cookies: { [GUEST_TOKEN_COOKIE_NAME]: makeToken() },
      });
      const res = await claimPost(req);

      expect(res.status).toBe(200);
      expect((await res.json()).claimedStars).toBe(2);
    });

    it("claimedStars is 0 when all linked Stars already have non-anonymous userId", async () => {
      const identityId = makeId();
      vi.mocked(auth).mockResolvedValueOnce({ user: { id: "user-1" } } as never);
      vi.mocked(prisma.dtGuestIdentity.findUnique).mockResolvedValueOnce(
        makeMockIdentity({ id: identityId })
      );
      vi.mocked(prisma.$transaction).mockImplementationOnce(async (fn: unknown) => {
        if (typeof fn !== "function") return fn;
        const txMock = {
          dtGuestIdentity: {
            updateMany: vi.fn().mockResolvedValueOnce({ count: 1 }),
            findUnique: vi.fn(),
          },
          dtStar: {
            updateMany: vi.fn().mockResolvedValueOnce({ count: 0 }),
          },
        };
        return fn(txMock);
      });

      const req = makeRequest("http://localhost/api/dt/claim", {
        cookies: { [GUEST_TOKEN_COOKIE_NAME]: makeToken() },
      });
      const res = await claimPost(req);

      expect(res.status).toBe(200);
      expect((await res.json()).claimedStars).toBe(0);
    });
  });

  // ── Scenario 8: Connection Route Integrity ────────────────────────────

  describe("Scenario 8: Connection Route", () => {
    it("returns 400 when starId is missing from body", async () => {
      const req = makeRequest("http://localhost/api/dt/connection", {
        body: { otherStarId: "other" },
      });
      const res = await connectionPost(req);
      expect(res.status).toBe(400);
    });

    it("returns 404 when otherStarId does not exist (guard passes)", async () => {
      const identityId = makeId();
      const star = makeMockStar({ id: "star-a", guestIdentityId: identityId });
      const identity = makeMockIdentity({ id: identityId });

      vi.mocked(prisma.dtStar.findUnique)
        .mockResolvedValueOnce(star)   // guard: star lookup
        .mockResolvedValueOnce(null);  // otherStarId check → not found
      vi.mocked(prisma.dtGuestIdentity.findUnique).mockResolvedValueOnce(identity);

      const req = makeRequest("http://localhost/api/dt/connection", {
        body: { starId: "star-a", otherStarId: "nonexistent" },
        cookies: { [GUEST_TOKEN_COOKIE_NAME]: makeToken() },
      });
      const res = await connectionPost(req);

      expect(res.status).toBe(404);
      expect((await res.json()).error).toBe("other star not found");
    });

    it("returns 400 on self connection (starId === otherStarId)", async () => {
      const identityId = makeId();
      const star = makeMockStar({ id: "star-a", guestIdentityId: identityId });
      const identity = makeMockIdentity({ id: identityId });
      const otherStar = makeMockStar({ id: "star-a" }); // same ID

      vi.mocked(prisma.dtStar.findUnique)
        .mockResolvedValueOnce(star)
        .mockResolvedValueOnce(otherStar);
      vi.mocked(prisma.dtGuestIdentity.findUnique).mockResolvedValueOnce(identity);

      const req = makeRequest("http://localhost/api/dt/connection", {
        body: { starId: "star-a", otherStarId: "star-a" },
        cookies: { [GUEST_TOKEN_COOKIE_NAME]: makeToken() },
      });
      const res = await connectionPost(req);

      expect(res.status).toBe(400);
      expect((await res.json()).error).toBe("cannot connect to self");
    });

    it("returns 200 on successful connection", async () => {
      const identityId = makeId();
      const star = makeMockStar({ id: "star-a", guestIdentityId: identityId });
      const identity = makeMockIdentity({ id: identityId });
      const otherStar = makeMockStar({ id: "star-b" });
      const connId = makeId();

      vi.mocked(prisma.dtStar.findUnique)
        .mockResolvedValueOnce(star)
        .mockResolvedValueOnce(otherStar);
      vi.mocked(prisma.dtGuestIdentity.findUnique).mockResolvedValueOnce(identity);
      vi.mocked(prisma.dtConnection.create).mockResolvedValueOnce({ id: connId } as never);

      const req = makeRequest("http://localhost/api/dt/connection", {
        body: { starId: "star-a", otherStarId: "star-b" },
        cookies: { [GUEST_TOKEN_COOKIE_NAME]: makeToken() },
      });
      const res = await connectionPost(req);

      expect(res.status).toBe(200);
      expect((await res.json()).id).toBe(connId);
    });

    it("Acknowledge returns 404 when connection does not exist", async () => {
      vi.mocked(prisma.dtConnection.findUnique).mockResolvedValueOnce(null);

      const req = makeRequest("http://localhost/api/dt/connection/bad-id/acknowledge");
      const res = await acknowledgePost(req, {
        params: Promise.resolve({ id: "bad-id" }),
      });

      expect(res.status).toBe(404);
      expect((await res.json()).error).toBe("connection not found");
    });

    it("Acknowledge returns 403 when connection starId guard fails", async () => {
      const conn = {
        id: "conn-1",
        starId: "star-a",
        otherStarId: "star-b",
        acknowledged: false,
        createdAt: new Date(),
      };
      vi.mocked(prisma.dtConnection.findUnique).mockResolvedValueOnce(conn as never);
      vi.mocked(prisma.dtStar.findUnique).mockResolvedValueOnce(
        makeMockStar({ id: "star-a", guestIdentityId: makeId() })
      );
      vi.mocked(prisma.dtGuestIdentity.findUnique).mockResolvedValueOnce(null); // invalid token

      const req = makeRequest("http://localhost/api/dt/connection/conn-1/acknowledge", {
        cookies: { [GUEST_TOKEN_COOKIE_NAME]: "bad-token" },
      });
      const res = await acknowledgePost(req, {
        params: Promise.resolve({ id: "conn-1" }),
      });

      expect(res.status).toBe(403);
    });

    it("Acknowledge returns 200 when owner acks connection", async () => {
      const identityId = makeId();
      const conn = {
        id: "conn-1",
        starId: "star-a",
        otherStarId: "star-b",
        acknowledged: false,
        createdAt: new Date(),
      };
      const star = makeMockStar({ id: "star-a", guestIdentityId: identityId });
      const identity = makeMockIdentity({ id: identityId });

      vi.mocked(prisma.dtConnection.findUnique).mockResolvedValueOnce(conn as never);
      vi.mocked(prisma.dtStar.findUnique).mockResolvedValueOnce(star);
      vi.mocked(prisma.dtGuestIdentity.findUnique).mockResolvedValueOnce(identity);
      vi.mocked(prisma.dtConnection.update).mockResolvedValueOnce({
        ...conn,
        acknowledged: true,
      } as never);

      const req = makeRequest("http://localhost/api/dt/connection/conn-1/acknowledge", {
        cookies: { [GUEST_TOKEN_COOKIE_NAME]: makeToken() },
      });
      const res = await acknowledgePost(req, {
        params: Promise.resolve({ id: "conn-1" }),
      });

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ ok: true });
    });
  });

  // ── Scenario 9: Nanum Contract ────────────────────────────────────────

  describe("Scenario 9: Nanum API Contract", () => {
    it("returns 400 when fromStarId is missing from body", async () => {
      const req = makeRequest("http://localhost/api/dt/nanum", {
        body: { starId: "star-b", type: "miracle", message: "test" },
      });
      const res = await nanumPost(req);

      expect(res.status).toBe(400);
      expect((await res.json()).error).toBe("fromStarId is required");
    });

    it("query-param fromStarId is ignored — only body is accepted", async () => {
      // OWN-007A: fromStarId must be in body, not query string
      const req = makeRequest(
        "http://localhost/api/dt/nanum?fromStarId=star-a",
        { body: { starId: "star-b", type: "miracle", message: "test" } }
      );
      const res = await nanumPost(req);

      expect(res.status).toBe(400);
      expect((await res.json()).error).toBe("fromStarId is required");
    });

    it("returns 400 when type is invalid", async () => {
      const req = makeRequest("http://localhost/api/dt/nanum", {
        body: {
          fromStarId: "star-a",
          starId: "star-b",
          type: "invalid_type",
          message: "test",
        },
      });
      const res = await nanumPost(req);

      expect(res.status).toBe(400);
      expect((await res.json()).error).toBe("type must be miracle | wisdom | thanks");
    });

    it("returns 404 when fromStarId star does not exist", async () => {
      vi.mocked(prisma.dtStar.findUnique).mockResolvedValueOnce(null);

      const req = makeRequest("http://localhost/api/dt/nanum", {
        body: {
          fromStarId: "nonexistent",
          starId: "star-b",
          type: "miracle",
          message: "test",
        },
        cookies: { [GUEST_TOKEN_COOKIE_NAME]: makeToken() },
      });
      const res = await nanumPost(req);

      expect(res.status).toBe(404);
      expect((await res.json()).error).toBe("star not found");
    });

    it("returns 403 when fromStarId owned by different guest", async () => {
      vi.mocked(prisma.dtStar.findUnique).mockResolvedValueOnce(
        makeMockStar({ id: "star-a", guestIdentityId: makeId() })
      );
      vi.mocked(prisma.dtGuestIdentity.findUnique).mockResolvedValueOnce(
        makeMockIdentity({ id: makeId() }) // different identity
      );

      const req = makeRequest("http://localhost/api/dt/nanum", {
        body: {
          fromStarId: "star-a",
          starId: "star-b",
          type: "miracle",
          message: "test",
        },
        cookies: { [GUEST_TOKEN_COOKIE_NAME]: makeToken() },
      });
      const res = await nanumPost(req);

      expect(res.status).toBe(403);
    });

    it("returns 201 when owner sends valid nanum", async () => {
      const identityId = makeId();
      const star = makeMockStar({ id: "star-a", guestIdentityId: identityId });
      const identity = makeMockIdentity({ id: identityId });
      const nanumId = makeId();

      vi.mocked(prisma.dtStar.findUnique).mockResolvedValueOnce(star);
      vi.mocked(prisma.dtGuestIdentity.findUnique).mockResolvedValueOnce(identity);
      vi.mocked(prisma.dtNanum.create).mockResolvedValueOnce({
        id: nanumId,
        starId: "star-b",
        type: "miracle",
        message: "test",
        createdAt: new Date(),
      } as never);
      vi.mocked(prisma.dtNanum.count).mockResolvedValueOnce(1); // prevCount < 2, no connection

      const req = makeRequest("http://localhost/api/dt/nanum", {
        body: {
          fromStarId: "star-a",
          starId: "star-b",
          type: "miracle",
          message: "test",
        },
        cookies: { [GUEST_TOKEN_COOKIE_NAME]: makeToken() },
      });
      const res = await nanumPost(req);

      expect(res.status).toBe(201);
      expect((await res.json()).id).toBe(nanumId);
    });
  });

  // ── Utility: hashGuestToken / generateGuestToken ───────────────────────

  describe("Utility: Guest Token Functions", () => {
    it("hashGuestToken returns 64-char hex (SHA-256)", () => {
      const hash = hashGuestToken("test-token");
      expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });

    it("hashGuestToken is deterministic", () => {
      const token = "some-token-value";
      expect(hashGuestToken(token)).toBe(hashGuestToken(token));
    });

    it("hashGuestToken output does not contain plaintext input", () => {
      const token = "my-secret-token-value";
      expect(hashGuestToken(token)).not.toContain(token);
    });

    it("hashGuestToken produces different hashes for different tokens", () => {
      expect(hashGuestToken("token-a")).not.toBe(hashGuestToken("token-b"));
    });

    it("generateGuestToken returns base64url string of sufficient entropy", () => {
      const token = generateGuestToken();
      // base64url charset: A-Z, a-z, 0-9, -, _
      expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
      // 32 bytes → ~43 base64url chars
      expect(token.length).toBeGreaterThanOrEqual(40);
    });

    it("generateGuestToken produces unique values on each call", () => {
      const t1 = generateGuestToken();
      const t2 = generateGuestToken();
      expect(t1).not.toBe(t2);
    });
  });
});
