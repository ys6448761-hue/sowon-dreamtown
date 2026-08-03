-- Migration: AIL-112 Post 쇼케이스 필드 추가

-- 1. authorId: WISH/FILM 익명 카드를 위해 null 허용
ALTER TABLE "Post" ALTER COLUMN "authorId" DROP NOT NULL;

-- 2. content: WISH/FILM 카드는 텍스트 없음 → 빈 문자열 기본값
ALTER TABLE "Post" ALTER COLUMN "content" SET DEFAULT '';

-- 3. 카드 타입 확장 필드
ALTER TABLE "Post"
  ADD COLUMN IF NOT EXISTS "postType"     TEXT NOT NULL DEFAULT 'TEXT',
  ADD COLUMN IF NOT EXISTS "wishId"       TEXT,
  ADD COLUMN IF NOT EXISTS "thumbnailUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "badgeText"    TEXT,
  ADD COLUMN IF NOT EXISTS "themeCode"    TEXT;

-- 4. 기존 TEXT 포스트 일관성 보장
UPDATE "Post" SET "postType" = 'TEXT' WHERE "postType" IS NULL OR "postType" = '';

-- 5. 인덱스
CREATE INDEX IF NOT EXISTS "Post_postType_status_idx" ON "Post"("postType", "status");
CREATE INDEX IF NOT EXISTS "Post_wishId_idx"           ON "Post"("wishId");

-- 6. wishId별 WISH/FILM 각 1개 보장 (중복 방지)
CREATE UNIQUE INDEX IF NOT EXISTS "Post_wishId_WISH_key"
  ON "Post"("wishId")
  WHERE "postType" = 'WISH' AND "wishId" IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "Post_wishId_FILM_key"
  ON "Post"("wishId")
  WHERE "postType" = 'FILM' AND "wishId" IS NOT NULL;
