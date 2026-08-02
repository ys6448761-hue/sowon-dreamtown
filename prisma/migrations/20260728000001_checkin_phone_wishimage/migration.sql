-- CHECKIN-002: Add phone and wish image tracking fields to dt_stars
-- phone: 체크인 시 등록 연락처 (Soft Open MVP — 평문 저장)
-- wishImageUrl: 소원그림 URL (비공개 기본)
-- wishImageStatus: pending | generating | ready | failed | revealed
-- wishImageRevealedAt: null = 비공개, Hamel Reveal 연출에서만 설정

ALTER TABLE "dt_stars" ADD COLUMN "phone" TEXT;
ALTER TABLE "dt_stars" ADD COLUMN "wishImageUrl" TEXT;
ALTER TABLE "dt_stars" ADD COLUMN "wishImageStatus" TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE "dt_stars" ADD COLUMN "wishImageRevealedAt" TIMESTAMP(3);
