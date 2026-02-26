# PR-16 Spec Lock v1 — 나눔 검증/전환/보관 체계

> 2026-02-27 확정 | 범위: 정책/UX/운영룰 | 구현: Phase 2

## 상태(status)

| 상태 | 설명 |
|------|------|
| PENDING | 검토중 (기본값) |
| APPROVED | 공개 |
| REDIRECT | 전환 제안 (톤 미스매치, 악의 없음) |
| REJECTED | 명백한 위반 |
| ARCHIVED | REDIRECT 3일 경과 시 자동 보관 |

## 노출 규칙

- 공개 피드: APPROVED만
- 작성자 본인: 모든 상태 열람 가능

## 구현 단계

- **PR-16A**: status 도입 + PENDING 기본 + "검토중" UX + 본인 프리뷰 + APPROVED 필터
- **PR-16B**: Admin Review (승인/전환/거절) + REDIRECT UX + 공동 편집 v0
- **PR-16C**: 자동 보관 (REDIRECT→ARCHIVED) 크론 + 내 보관함 UX
