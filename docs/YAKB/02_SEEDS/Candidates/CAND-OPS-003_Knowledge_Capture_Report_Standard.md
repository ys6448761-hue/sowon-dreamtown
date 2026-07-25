# CAND-OPS-003: Knowledge Capture Report Standard

---

**File Name:** `CAND-OPS-003_Knowledge_Capture_Report_Standard.md`
**Category:** Operations / Constitution
**Status:** Idea (per `GOV-001_Governance_Lifecycle.md` §3 — free to revise, no RFC required yet)

---

## Purpose

"이번 세션을 자산화해"라는 명령이 매번 다른 형식의 요약으로 끝나지 않도록,
세션 종료 시 출력하는 보고서의 **구조**를 표준화한다. 이 표준은 보고서의
형식만 고정하며, 각 세션에서 실제로 무엇이 만들어졌는지는 그 세션의 실제
작업 결과만 반영해야 한다 — 형식이 내용을 대신 지어내서는 안 된다.

## Background

2026-07-14 세션에서, 대표님이 "이번 세션을 자산화해"를 표준 명령어로 굳히자고
제안하며, 예시 보고서 형식(Candidate 생성 / 기존 SSOT 영향 분석 / 신규 자산 /
Repository 변경 / Review Queue / 승격 후보 / Session Achievement / Next
Action + 마지막 요약 블록)을 제시했다. 예시에 포함된 구체적 자산 목록(Season1
영상, Artwork, OST 등)은 이 저장소의 실제 상태와 무관한 예시였으므로, 이
Candidate는 그 형식만 추출해 원칙으로 남긴다.

## Core Definition

모든 작업 세션은 종료 시("이번 세션을 자산화해" 요청에 대해) 표준화된
Knowledge Capture Report를 생성하여, 그 세션에서 실제로 생성된 자산·Candidate
문서·영향받은 SSOT·Review 대기 목록·다음 작업을 기록한다. 보고서의 모든 항목은
그 세션에서 실제로 확인된 사실만 담아야 하며, 형식을 채우기 위해 존재하지 않는
자산을 지어내지 않는다.

## Principles

1. 보고서 구조는 고정한다: Candidate 생성 → 기존 SSOT 영향 분석 → 신규 자산 →
   Repository 변경 → Review Queue → 승격 후보 → Session Achievement → Next
   Action → 요약 블록(Session Assets / New Candidates / SSOT Updated /
   Review Queue / Knowledge Impact / Repository Status / Next Recommended
   Task).
2. 항목에 해당 사항이 없으면 "없음"이라고 명시한다 — 빈 항목을 다른 세션의
   예시나 상상으로 채우지 않는다.
3. Knowledge Impact 점수(0–100)와 Repository Status(Healthy/Attention
   필요 등)는 그 세션에서 실제로 변경된 파일 수·거버넌스 절차 준수 여부를
   근거로 산정한다 — 임의로 높은 점수를 매기지 않는다.
4. 이 보고서는 `docs/YAKB/02_SEEDS/Candidates/INDEX.md`의 내용과 일치해야
   한다 — 보고서에 언급된 Candidate는 반드시 INDEX.md에도 등록되어 있어야
   한다.

## Applications

- "이번 세션을 자산화해" 명령의 최종 출력 형식
- 세션 간 인수인계(handoff) 문서로 활용

## Example

- 좋은 예: 이번 세션에 Candidate 3개를 만들었으면 "New Candidates: 3"이라고
  적고, 실제 파일명을 나열한다.
- 나쁜 예: 형식을 맞추기 위해 이번 세션에서 만들지 않은 영상/이미지/OST
  자산을 "신규 자산"란에 나열한다.

## Amendment (2026-07-15): Report Type Differentiation

세션 종료 보고서를 작업 유형에 따라 구분한다 — 형식은 Principles(1절)의
구조를 공유하되, 표지(제목/아이콘)와 강조 항목만 유형별로 다르다.

| 세션 종류 | 보고서 | 강조 항목 |
|---|---|---|
| SSOT / Candidate 작업 | 📦 Knowledge Capture Report | Candidate 생성, Review Queue, 승격 후보 |
| Asset 작업 | 🎬 Asset Capture Report | Repository Updated, Final Assets Registered, Architecture Established |
| 코드 개발 | 💻 Development Report | (미검증 — 아직 실제 사용 사례 없음) |
| 릴리스 | 🚀 Release Report | (미검증 — 아직 실제 사용 사례 없음) |

**적용 현황:** 📦(Knowledge)와 🎬(Asset) 두 형식은 이미 실제 세션에서 사용되어
검증되었다(2026-07-14 Knowledge Capture Report, 2026-07-15
`ACP-2026-07-15_Final_Asset_Repository_Initialization.md`). 💻/🚀 두 형식은
아직 실제로 사용된 적이 없다 — [[phoenix_candidate_restraint]] 원칙에 따라,
이 네 유형 구분 전체를 정식 SSOT로 승격하기 전에 💻/🚀도 최소 1회 이상 실제
세션에서 사용해 검증하는 것을 권장한다. 그 전까지 이 Amendment는 `CAND-OPS-003`
본문에 종속된 하위 조항으로만 존재하며, 별도 Candidate 파일(`CAND-OPS-005`
등)로 분리 생성하지 않는다.

## Duplication Check

- `CAND-OPS-001`(저장소 정체성 선언), `CAND-OPS-002`(Candidate 인덱스 분리)와
  주제 계열은 같으나, 이 문서는 "세션 종료 보고 형식"이라는 별도의 구체적
  범위를 다룬다 — 중복 아님, 세 번째 하위 원칙.
- 기존 `Candidates/INDEX.md`, `GOV-001` 어디에도 "세션 종료 보고서" 개념은
  없었다 — 신규 개념 확인.

## Promotion Target

신규 `SSOT-KNOWLEDGE-004` — `CAND-OPS-001`, `CAND-OPS-002`와 함께 하나의
SSOT로 묶어 승격하는 것을 권장한다(세 Candidate 모두 Knowledge Governance
운영 방식을 다루므로).

## Origin

- **Conversation Date:** 2026-07-14
- **Topic:** 세션 종료 보고서 표준화, "이번 세션을 자산화해" 표준 명령어화
- **Creator:** 대표님 (형식 제안), Claude Code (Candidate 구조화 및 사실
  검증 원칙 추가)

## Project Impact

65 — 운영 편의성을 높이지만, 보고서 내용이 사실에 기반해야 한다는 원칙(3절)이
없으면 오히려 신뢰도를 해칠 위험이 있어 Impact를 OPS-001/002보다 다소 낮게
평가한다.

## Knowledge Value

★★★★☆
