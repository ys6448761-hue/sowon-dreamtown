-- CreateTable: AIL-110 일일 큐레이션 캐시
CREATE TABLE "DailyCuration" (
    "id"            TEXT         NOT NULL,
    "dateKey"       TEXT         NOT NULL,
    "wisdomPostId"  TEXT,
    "miraclePostId" TEXT,
    "wisdomLine"    TEXT,
    "miracleLine"   TEXT,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyCuration_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DailyCuration_dateKey_key" ON "DailyCuration"("dateKey");
