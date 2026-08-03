-- AlterTable: AIL-109 AI 요약 컬럼 추가
ALTER TABLE "Post"
  ADD COLUMN "summaryText"      TEXT,
  ADD COLUMN "summaryStatus"    TEXT NOT NULL DEFAULT 'NONE',
  ADD COLUMN "summaryUpdatedAt" TIMESTAMP(3),
  ADD COLUMN "contentHash"      TEXT;
