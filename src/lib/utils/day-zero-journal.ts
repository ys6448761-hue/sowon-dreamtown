/**
 * Day 0 Journal 기본값 — DreamTown 신규 Star 생성 시 자동 생성되는 첫 항해기록.
 *
 * "Day 0"은 개념적 명칭이며 DtJournal 스키마에 day 컬럼은 없다.
 * Prisma data에 직접 spread 가능한 필드(emotion, helpTag, growthLine)만 포함한다.
 *
 * 참조: CAND-DOM-001 §6 BR-J-01, BR-J-03 / PLAN-ENG-001 DT-RF-003
 */

export const DAY_ZERO_JOURNAL = {
  emotion: "믿고 싶어졌어요",
  helpTag: "연결",         // 유효값: 위로|결심|쉼|연결|실행
  growthLine: "조금 가벼워졌어요", // 유효값 3종 중 하나
} as const;
