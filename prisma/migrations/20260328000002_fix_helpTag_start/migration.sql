-- Migration: fix_helpTag_start
--
-- helpTag = '시작' 은 온보딩 초기 코드에서 잘못 삽입된 값.
-- 허용값 목록: 위로 | 결심 | 쉼 | 연결 | 실행
-- '시작' → '연결' 로 일괄 수정.
--
-- dt_star_seeds 테이블은 이 repo 스키마에 없으나,
-- 연동 DB에 존재할 경우를 대비해 DO 블록으로 안전하게 처리.

-- 1. dt_journals 수정 (항상 실행)
UPDATE dt_journals
SET "helpTag" = '연결'
WHERE "helpTag" = '시작';

-- 2. dt_star_seeds 수정 (테이블 존재 시에만)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'dt_star_seeds'
  ) THEN
    EXECUTE '
      UPDATE dt_star_seeds
      SET "helpTag" = ''연결''
      WHERE "helpTag" = ''시작''
    ';
  END IF;
END;
$$;
