-- DreamTown Core Tables (SSOT v1)
-- Migration: 20260327000001_add_dreamtown_tables

CREATE TABLE "dt_stars" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "starName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dayCount" INTEGER NOT NULL DEFAULT 1,
    "starStage" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "dt_stars_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "dt_wishes" (
    "id" TEXT NOT NULL,
    "starId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dt_wishes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "dt_journals" (
    "id" TEXT NOT NULL,
    "starId" TEXT NOT NULL,
    "emotion" TEXT NOT NULL,
    "helpTag" TEXT NOT NULL,
    "growthLine" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dt_journals_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "dt_nanum" (
    "id" TEXT NOT NULL,
    "starId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dt_nanum_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE INDEX "dt_stars_userId_idx" ON "dt_stars"("userId");
CREATE INDEX "dt_wishes_starId_idx" ON "dt_wishes"("starId");
CREATE INDEX "dt_wishes_createdAt_idx" ON "dt_wishes"("createdAt" DESC);
CREATE INDEX "dt_journals_starId_idx" ON "dt_journals"("starId");
CREATE INDEX "dt_journals_createdAt_idx" ON "dt_journals"("createdAt" DESC);
CREATE INDEX "dt_nanum_starId_idx" ON "dt_nanum"("starId");
CREATE INDEX "dt_nanum_type_idx" ON "dt_nanum"("type");
CREATE INDEX "dt_nanum_createdAt_idx" ON "dt_nanum"("createdAt" DESC);

-- Foreign Keys
ALTER TABLE "dt_wishes" ADD CONSTRAINT "dt_wishes_starId_fkey"
    FOREIGN KEY ("starId") REFERENCES "dt_stars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "dt_journals" ADD CONSTRAINT "dt_journals_starId_fkey"
    FOREIGN KEY ("starId") REFERENCES "dt_stars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "dt_nanum" ADD CONSTRAINT "dt_nanum_starId_fkey"
    FOREIGN KEY ("starId") REFERENCES "dt_stars"("id") ON DELETE CASCADE ON UPDATE CASCADE;
