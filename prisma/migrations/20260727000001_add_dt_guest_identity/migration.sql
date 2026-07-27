-- OWN-001: Guest Identity Schema
-- dt_guest_identities 테이블 생성 + dt_stars nullable FK 추가
-- Migration: 20260727000001_add_dt_guest_identity

-- 1. DtGuestIdentity 테이블 생성
CREATE TABLE "dt_guest_identities" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastUsedAt" TIMESTAMP(3),
    "claimedUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dt_guest_identities_pkey" PRIMARY KEY ("id")
);

-- 2. tokenHash unique constraint
CREATE UNIQUE INDEX "dt_guest_identities_tokenHash_key" ON "dt_guest_identities"("tokenHash");

-- 3. Indexes
CREATE INDEX "dt_guest_identities_claimedUserId_idx" ON "dt_guest_identities"("claimedUserId");
CREATE INDEX "dt_guest_identities_expiresAt_idx" ON "dt_guest_identities"("expiresAt");

-- 4. DtStar에 nullable guestIdentityId 컬럼 추가 (기존 row는 자동으로 NULL)
ALTER TABLE "dt_stars" ADD COLUMN "guestIdentityId" TEXT;

-- 5. DtStar guestIdentityId index
CREATE INDEX "dt_stars_guestIdentityId_idx" ON "dt_stars"("guestIdentityId");

-- 6. DtStar → DtGuestIdentity nullable FK (SET NULL on delete)
ALTER TABLE "dt_stars" ADD CONSTRAINT "dt_stars_guestIdentityId_fkey"
    FOREIGN KEY ("guestIdentityId") REFERENCES "dt_guest_identities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
