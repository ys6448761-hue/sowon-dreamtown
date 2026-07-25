# CAND-WORLD-002: Identity of Sowoni

---

**File Name:** `CAND-WORLD-002_Identity_of_Sowoni.md`
**Category:** Constitution / Character-World
**Status:** Idea (per `GOV-001_Governance_Lifecycle.md` §3 — free to revise, no RFC required yet)

---

## Purpose

"소원이"가 특정 캐릭터 한 명의 이름이 아니라, 소원을 품은 모든 사람이
DreamTown에 들어오는 순간 취하는 정체성이라는 점을 정의하기 위해
작성한다. `CAND-WORLD-001`이 정의한 3축 역할 구조(소원이/아우룸/오로라5)
중 "소원이" 축을 더 깊이 다루는 하위 문서다.

## Background

`daily-miracles-mvp/docs/ssot/core/DreamTown_Character_SSOT.md`는 현재
소원이를 "소원을 품은 모든 사람을 대표하는 메인 내러티브 캐릭터"로
정의하며, "관객(사용자)이 자신을 투영하는 캐릭터"라고 서술한다 — 즉
기존 정의는 소원이를 **사용자가 자신을 투영하는 단일 캐릭터**로 그린다.
본 Candidate는 이를 한 걸음 더 진전시켜, 소원이를 **모든 고객이 실제로
취하는 정체성 자체**로, "별빛 소원이"를 그 중 EP01의 대표 사례(첫 번째
소원이)로 재구성한다.

## Core Definition

소원이는 DreamTown 서비스를 이용하는 사용자가 아니라, 소원을 품고 자신의
인생 항로를 살아가는 모든 존재의 이름이다.

## 세계관 구조

```
모든 사람
        │
        ▼
    소원을 품는다
        │
        ▼
      소원이
        │
 ┌──────┴──────┐
 │             │
 ▼             ▼
별빛 소원이   다른 모든 소원이
(대표 캐릭터) (여행자들)
```

## Principles

1. 모든 고객은 DreamTown에 들어오는 순간 '소원이'가 된다.
2. '별빛 소원이'는 EP01의 대표 캐릭터이자 첫 번째 소원이다.
3. 아우룸은 모든 소원이의 안내자다.
4. 오로라5는 세계를 설계하고 운영하는 집단지성 연구소다.
5. DreamTown는 사용자를 확보하는 서비스가 아니라, 새로운 소원이를 만나는
   플랫폼이다.

## Applications

- 온보딩/마케팅 카피에서 "사용자"/"고객" 대신 "소원이"를 쓸 수 있는
  범위 판단 기준
- EP01 외 신규 도시·신규 여정에서 "새로운 대표 소원이"가 필요한지,
  아니면 "별빛 소원이"가 계속 대표 캐릭터로 남는지 결정할 때 참조
- `CAND-OPS-004_Reunion_Operations.md`의 "고객과 소원이의 관계" 서술이
  이 정체성 구조와 일치하는지 확인하는 기준

## Example

- 좋은 예: 신규 가입 안내 카피에서 "당신도 오늘부터 하나의 소원이입니다"
  라고 표현한다.
- 나쁜 예: "별빛 소원이가 곧 사용자다"처럼 대표 캐릭터와 일반 사용자를
  동일시해, 다른 소원이(여행자들)의 존재를 지운다.

## Duplication Check (2026-07-24)

`CAND-WORLD-001`과 동일한 범위(`docs/YAKB/99_SSOT/`, `00_MANIFESTO/`,
`01_RAW/`, `daily-miracles-mvp/docs/ssot/`)를 검색했다.

1. **기존 `DreamTown_Character_SSOT.md`의 소원이 정의와의 관계 — 확장인지
   재정의인지 판단 필요** 기존 정의: "소원을 품은 모든 사람을 대표하는
   메인 내러티브 캐릭터", "관객(사용자)이 자신을 투영하는 캐릭터"(단수
   캐릭터 프레이밍). 본 Candidate 정의: "소원이 = 모든 고객이 실제로
   취하는 정체성"(카테고리/이름 프레이밍), "별빛 소원이 = 그중 EP01
   대표 사례". 두 정의는 방향은 같아 보이나(둘 다 "사용자가 아니다"라는
   전제 공유), **단일 캐릭터냐 모두가 취하는 정체성이냐**라는 구조적
   차이가 있다 — `CAND-WISH-001`의 "컨디션 좋던 시절처럼 보이나"→"가장
   행복했던 나" 확장 사례와 유사한 성격의 질문이므로, 대표님의 "확장
   관계"인지 "재정의"인지 명시적 판단이 필요하다.
2. **"별빛 소원이"는 신규 용어 확인** `daily-miracles-mvp`,
   `sowon-dreamtown` 전체 검색 결과 "별빛 소원이"라는 표현은 이번에
   처음 등장한다(0건 매치) — 새 캐릭터명으로 확인.
3. **오로라5 명명 충돌은 `CAND-WORLD-001`과 동일** — 본 문서 원칙 4도
   "오로라5"를 그대로 사용하므로, `CAND-WORLD-001` Duplication Check
   1번 항목("Aurora5" 실제 브랜드명과의 충돌)이 이 문서에도 동일하게
   적용된다. 여기서 다시 반복하지 않고 `CAND-WORLD-001`을 참조한다.

**충돌 아님:**
- "여행자들"이 "다른 모든 소원이"를 가리킨다는 구조는 기존 SSOT의 "관객이
  자신을 투영하는 캐릭터" 서술과 상충하지 않는다 — 오히려 그 투영이
  "누구나 소원이가 될 수 있다"는 방향으로 자연스럽게 확장된 것으로 볼 수
  있다.

## Governance

`GOV-001_Governance_Lifecycle.md`를 따른다. 기존 SSOT는 수정하지 않았다.
위 1번(확장 vs 재정의) 판단이 나기 전에는 Draft로 진행하지 않는다.

## Promotion Target

`CAND-WORLD-001`과 함께 `daily-miracles-mvp/docs/ssot/core/
DreamTown_Character_SSOT.md`로 승격(소원이 정의 보강 + 오로라5 신규 추가)
하는 것을 제안한다. 단, Duplication Check 1번(확장 vs 재정의) 판단이
선행되어야 한다.

## Origin

- **Conversation Date:** 2026-07-24
- **Topic:** 소원이 정체성 재정의, 별빛 소원이(EP01 대표 캐릭터)
- **Creator:** 대표님 (Level 4 감지 및 초안 제시), Claude Code (Duplication
  Check 및 구조화)

## Project Impact

75 — DreamTown 전체 브랜드 언어("사용자"가 아니라 "소원이")에 미치는
영향이 크지만, 기존 Character SSOT와의 관계(확장/재정의)가 확정되지 않아
`CAND-WORLD-001`보다 근소하게 높게, 그러나 만점보다는 낮게 평가한다.

## Knowledge Value

★★★★☆
