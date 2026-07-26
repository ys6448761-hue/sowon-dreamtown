-- CHECKIN-001: 안내판 QR 체크인 (우주민 등록 이름 + 정면사진)
-- Migration: 20260726000001_add_dtstar_checkin_fields

ALTER TABLE "dt_stars" ADD COLUMN "visitorName" TEXT;
ALTER TABLE "dt_stars" ADD COLUMN "photoUrl" TEXT;
