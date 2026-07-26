-- DtConnection: 연결 완료 이벤트 테이블
-- Migration: 20260328000001_add_dt_connection

CREATE TABLE "dt_connections" (
    "id" TEXT NOT NULL,
    "starId" TEXT NOT NULL,
    "otherStarId" TEXT NOT NULL,
    "acknowledged" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dt_connections_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "dt_connections_starId_acknowledged_idx"
    ON "dt_connections"("starId", "acknowledged");

ALTER TABLE "dt_connections" ADD CONSTRAINT "dt_connections_starId_fkey"
    FOREIGN KEY ("starId") REFERENCES "dt_stars"("id") ON DELETE CASCADE ON UPDATE CASCADE;
