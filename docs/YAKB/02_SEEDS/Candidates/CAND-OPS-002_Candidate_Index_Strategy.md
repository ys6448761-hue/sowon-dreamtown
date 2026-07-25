# CAND-OPS-002: Candidate Index Strategy

---

**File Name:** `CAND-OPS-002_Candidate_Index_Strategy.md`
**Category:** Operations / Constitution
**Status:** Idea (per `GOV-001_Governance_Lifecycle.md` §3 — free to revise, no RFC required yet)

---

## Purpose

Candidate 수가 늘어날수록(대표님 표현으로 "100개가 되어도") 관리가 가능하도록,
Candidate 전용 인덱스와 공식 지식 인덱스(`YAKB-INDEX-001`)를 분리하는 원칙을
명문화한다. 이 분리가 없으면 `YAKB-INDEX-001`이 검증되지 않은 아이디어로
오염되거나, Candidate가 인덱스 없이 방치되는 두 가지 실패 모드가 모두 생긴다.

## Background

2026-07-14 세션에서, `CAND-ROUTE-001`과 `CAND-OPS-001`을 생성한 직후 대표님이
"YAKB-INDEX-001은 아직 수정하지 않는다"고 명시적으로 응답하며, 대신 Candidate
전용 인덱스(`docs/YAKB/02_SEEDS/Candidates/INDEX.md`)를 별도로 두자고
제안했다. "Candidate = 실험실, YAKB-INDEX = 박물관"이라는 비유로 설명했다.

## Core Definition

Candidate와 Official Knowledge는 서로 다른 Index를 사용한다 — Candidate는
`docs/YAKB/02_SEEDS/Candidates/INDEX.md`(실험실 인덱스)에서, Approved 이상의
공식 자산은 `YAKB-INDEX-001`(박물관 인덱스)에서 관리된다.

## Principles

1. `YAKB-INDEX-001`은 Approved 이상의 상태(Approved, LOCKED)에 도달한 문서만
   등록한다 — Idea/Draft/Review 상태의 Candidate는 절대 등록하지 않는다.
2. Candidate의 존재·상태·중복 여부는 `Candidates/INDEX.md`에서만 추적한다.
3. Candidate가 Review를 통과해 `99_SSOT/`로 승격되는 시점에만
   `YAKB-INDEX-001`을 갱신하고, 동시에 `Candidates/INDEX.md`에서는 해당
   항목을 "Promoted"로 표시한다(삭제하지 않는다 — 계보 추적용).
4. 실험실(Candidate)에서 검증 중인 것을 박물관(YAKB-INDEX-001)에 미리
   전시하지 않는다.

## Applications

- `docs/YAKB/02_SEEDS/Candidates/INDEX.md` 운영 규칙
- `YAKB-INDEX-001` §8 유지보수 원칙과의 경계 설정(신규 SSOT만 그 표를
  갱신 대상으로 삼는다는 점을 명확히 함)
- Claude Code의 Knowledge Capture 파이프라인 (`CLAUDE.md`) 동작 규칙

## Example

- 좋은 예: Candidate 생성 시 `Candidates/INDEX.md`만 갱신하고,
  `YAKB-INDEX-001`은 그대로 둔다.
- 나쁜 예: Candidate 생성과 동시에 `YAKB-INDEX-001` §3 Level 3 표에 "존재"로
  표시해버린다 (아직 검증되지 않은 것을 공식 자산처럼 보이게 만든다).

## Duplication Check

- `CAND-OPS-001_Knowledge_Operating_System.md`와 취지는 이어지지만(둘 다
  거버넌스 원칙), OPS-001은 "저장소의 정체성"을 선언하고 이 문서는 그 정체성
  아래에서 "인덱스를 어떻게 이중화할 것인가"라는 구체적 운영 규칙을 다룬다 —
  중복이 아니라 하위 원칙 관계.
- `YAKB-INDEX-001` §8, `GOV-001` 어디에도 "Candidate 전용 인덱스" 개념은
  없었다 — 신규 개념 확인.

## Promotion Target

신규 `SSOT-KNOWLEDGE-004` (기존 `SSOT-KNOWLEDGE-001~003`이 Origin 생성 /
Lifecycle / Knowledge Graph를 다루므로 같은 계열) 또는 `GOV-001`의 보강 절
(§9 Audit Checklist에 "Candidate Index 갱신 여부" 항목 추가). 승격 시점에
`CAND-OPS-001`과 함께 검토하는 것을 권장한다.

## Origin

- **Conversation Date:** 2026-07-14
- **Topic:** YAKB-INDEX-001과 Candidate 인덱스의 분리
- **Creator:** 대표님 (원칙 제안 및 "실험실/박물관" 비유), Claude Code
  (Candidate 구조화)

## Project Impact

75 — Candidate 수가 늘어날 미래를 대비하는 확장성 원칙이며, 지금 정하지
않으면 나중에 소급 정리 비용이 커진다.

## Knowledge Value

★★★★☆
