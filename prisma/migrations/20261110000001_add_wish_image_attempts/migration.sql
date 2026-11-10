-- PHX-WISHART-011: AI 소원그림 생성 횟수 추적
-- 최초 생성 1회 + 재시도 최대 2회 = 총 3회 제한
-- 기존 행: DEFAULT 0 (기존 고객 보호 — 재시도 가능 상태로 보존)
ALTER TABLE "dt_stars" ADD COLUMN "wishImageAttempts" INTEGER NOT NULL DEFAULT 0;
