# CAND-WORLD-001: Sowoni · Aurum · Aurora5 Role Architecture

---

**File Name:** `CAND-WORLD-001_Sowoni_Aurum_Aurora5_Role_Architecture.md`
**Category:** Constitution / Character-World
**Status:** Idea (per `GOV-001_Governance_Lifecycle.md` §3 — free to revise, no RFC required yet)

---

## Purpose

DreamTown의 세 축 — 소원이(경험 주체), 아우룸(직접 동행 안내자), 오로라5(뒤에서
세계를 설계·연구·운영하는 집단지성) — 의 역할을 서로 혼동 없이 구분하기 위해
작성한다. 이는 운영 절차가 아니라 세계관·캐릭터·경험 언어를 결정하는 도메인
정의다.

## Background

`daily-miracles-mvp/docs/ssot/core/DreamTown_Character_SSOT.md`(Active,
Owner: Aurora5)가 이미 소원이와 아우룸의 정체성·외형·서사 역할을 상세히
정의하고 있다. 그러나 이 파일에는 "오로라5"가 캐릭터/세계관 요소로 정의되어
있지 않다 — 문서 상단 메타데이터의 "Owner" 필드로만 등장한다. 동시에
`sowon-dreamtown`의 `MANIFESTO-001_Invisible_Value_Manifesto.md` §8("AI")은
"Aurora와 Aurum은 기록자가 아니다. 삶의 증인(Witness)이다"라고 이미 선언해
두었다 — 이는 "오로라5"가 아니라 "Aurora"라는 표기이며, 역할도 "증인"으로
서술되어 있어 본 Candidate가 제안하는 "설계·연구·운영" 프레이밍과 강조점이
다르다. 이 Candidate는 이 두 기존 자료를 통합·대체하지 않고, 그 위에 세
번째 축(오로라5)의 역할을 명시적으로 추가 제안한다.

## Core Definition

소원이는 소원을 품고 항로를 살아가는 주체이며, 아우룸은 소원이와 직접
동행하는 황금거북 안내자이고, 오로라5는 아우룸과 항로 세계를 뒤에서
설계·연구·운영하는 집단지성 연구소다.

## Principles

1. 소원이는 사용자가 아니다.
2. 소원이와 직접 대화하는 존재는 아우룸이다.
3. 오로라5는 세계 밖의 운영자가 아니라 세계 안의 연구소이지만, 평상시
   전면에 나서지 않는다.
4. 아우룸은 관계를 만들고, 오로라5는 그 관계가 지속될 구조를 만든다.
5. 밤 9시·항로 탐방·별들의 약속·호텔 재회에서 화자와 역할을 혼용하지
   않는다.

## Applications

- 영상/이미지/웹툰/스토리북 제작 시 화자 선택 기준
- 밤 9시 경험, 별들의 약속, 호텔 재회(`CAND-OPS-004`) 등 신규 경험 설계 시
  "누가 말하는가"를 먼저 결정하는 체크리스트
- `DreamTown_Character_SSOT.md` 갱신 시 오로라5 항목 추가 여부 검토 자료

## Example

- 좋은 예: 별들의 약속 안내 음성은 아우룸이 전달하고, 그 약속이 성립하는
  배경 로직과 데이터 구조는 오로라5가 설계한 것으로 화면 밖에서만 언급된다.
- 나쁜 예: 오로라5가 화면에 직접 등장해 사용자에게 말을 걸거나, 아우룸이
  세계관 설계 배경(연구소 운영 등)을 직접 설명한다.

## Duplication Check (2026-07-24)

저장 전 `docs/YAKB/99_SSOT/`, `docs/YAKB/00_MANIFESTO/`, `docs/YAKB/01_RAW/`
및 자매 저장소 `daily-miracles-mvp/docs/ssot/`를 검색했다. **아래 2건은
명확한 명명·정의 충돌이며, 이번 저장에서 수정하지 않고 그대로 보고만
한다.**

1. **"오로라5"/"Aurora5" 명명 충돌 — 이미 존재하는 실제 엔지니어링 브랜드명**
   `daily-miracles-mvp`에는 `aurora5/`라는 별도 하위 시스템(routes·services·
   jobs·middleware, "7일 미션 체험"이라는 **별개 상품**용)이 실제로 존재하며,
   `aurora5-master-knowledge-v2.md`, `AURORA-STATUS.md`,
   `017_aurora5_unified_engine.sql`(`aurora_video_jobs` 등)까지 폭넓게
   쓰이고 있다. 이 명명 충돌은 이미 `01_RAW/Aurora_Aurum_Audit.md`(2026-07-03,
   감사 완료)가 §8-5("네이밍 충돌로 인한 혼선")에서 명시적으로 경고한
   사항이다. 본 Candidate가 "오로라5"를 세계관 속 연구소로 공식화하면, 실제
   상품 브랜드명("Aurora5 = 7일 미션 체험")과 세계관 캐릭터명이 같은
   단어를 서로 다른 두 가지로 쓰게 된다 — `RFC-LANG-001`이 경고한 "체크인
   4중 충돌"과 동일 패턴이 재발할 위험이 있다.
2. **`MANIFESTO-001` §8과의 프레이밍 차이** `MANIFESTO-001_Invisible_Value_
   Manifesto.md` §8("AI")은 이미 "Aurora와 Aurum은 기록자가 아니다. 삶의
   증인(Witness)이다"라고 선언했다. 본 Candidate는 오로라5를 "설계·연구·
   운영하는 집단지성 연구소"로 규정한다 — "증인(Witness)"과 "설계·운영
   주체"는 상호 배타적이지는 않으나 강조점이 다르다. 어느 쪽이 우선하는
   프레이밍인지, 혹은 둘이 양립하는지는 Review에서 판단이 필요하다.

**충돌 아님(연관 사실만 기록):**
- `DreamTown_Character_SSOT.md`(daily-miracles-mvp, Active)는 소원이·아우룸의
  정체성·외형·서사 역할을 이미 상세히 LOCKED급으로 정의해 두었으나, "오로라5"
  캐릭터 정의는 없다 — 본 Candidate의 소원이/아우룸 서술은 그 SSOT와 방향이
  일치하며 충돌하지 않는다. 다만 이 SSOT는 이 저장소(sowon-dreamtown)가 아니라
  `daily-miracles-mvp`에 있다는 점에서, 실제 승격 시 어느 저장소의 정본을
  갱신할지는 `CAND-OPS-004`의 §18에서 이미 제기된 것과 동일한 "저장소 소유권"
  질문이 다시 등장한다.
- `01_RAW/Aurora_Aurum_Audit.md`는 "밤 9시" 기능이 코드로는 전혀 구현되지
  않았다는 사실도 함께 확인했다 — 본 Candidate의 원칙 5("밤 9시... 화자를
  혼용하지 않는다")는 아직 구현되지 않은 경험에 대한 사전 역할 정의이며,
  기능 존재 여부와는 별개로 유효하다.

## Governance

`GOV-001_Governance_Lifecycle.md`(Idea → Draft → Review → Approved →
LOCKED)를 따른다. 기존 SSOT/Manifesto는 수정하지 않았다. 위 2건의 명명·
프레이밍 충돌이 해소되기 전에는 Draft 단계로 진행하지 않는다.

## Promotion Target

`daily-miracles-mvp/docs/ssot/core/DreamTown_Character_SSOT.md`에 "오로라5"
항목을 추가하는 형태로 승격하는 것을 제안한다. 단, 승격 전 위 명명 충돌
(특히 "Aurora5" 브랜드명과의 구분)이 먼저 해소되어야 한다.

## Origin

- **Conversation Date:** 2026-07-24
- **Topic:** 소원이/아우룸/오로라5 역할 구조
- **Creator:** 대표님 (Level 4 감지 및 초안 제시), Claude Code (Duplication
  Check 및 구조화)

## Project Impact

70 — 세계관 언어의 일관성을 높이는 가치는 크지만, "Aurora5" 명명 충돌이
해소되지 않은 채 승격되면 오히려 혼선을 키울 위험이 있어 완전한 점수를
주지 않는다.

## Knowledge Value

★★★★☆
