# SPR-001 — Freeze

---

**File Name:** `SPR-001_FREEZE.md`
**Type:** Sprint Directive (운영 지시서 — GOV-001 Candidate 생명주기 대상 아님)
**Status:** Active
**작성일:** 2026-07-25

> **위치·형식 참고:** 이 저장소에 기존 `SPR-` 문서/`Sprint` 폴더가 없어
> `docs/YAKB/Sprint/`를 신규로 만들고 이 문서를 그 첫 파일로 두었다
> (`Governance/`, `History/`, `Planning/`처럼 문서 유형별 전용 폴더를
> 두는 이 저장소의 기존 관례를 따름). 앞으로 `SPR-002`, `SPR-003`도 같은
> 폴더에 쌓인다. 이 문서는 Candidate가 아니라 **운영 지시서**이므로
> `GOV-001`의 Idea→Draft→Review→Approved→LOCKED 승격 절차를 거치지
> 않는다 — Freeze/Resume이라는 자체 상태만 가진다.
>
> **참고(차단 아님, 사실만 기록):** "별빛항로"라는 이름은 이번 세션에서
> 이미 `CAND-MEAN-001`의 Duplication Check로 4가지 서로 다른 기존 용례
> (① `dreamtown-wishart/CON-004`의 5감정→3그룹 분류, ② `daily-miracles-mvp/
> SSOT-PRODUCT-001`의 단일 8씬 상품명, ③ CON-004가 의도적으로 분리해 둔
> 여행상품명 "별빛크루즈", ④ 이번 CAND-MEAN-001의 보편 3관점 프레임워크)가
> 확인된 이름이다. 이번 문서의 "호텔1호점 별빛항로"는 다섯 번째 용례다.
> 이 Freeze 지시서는 실행 우선순위를 정하는 문서이므로 이름 자체를
> 지금 정리하지는 않지만, 다음 담당자가 "별빛항로"라는 표현을 볼 때 이미
> 다의적이라는 점을 알고 있어야 한다.

---

## 목적

DreamTown Foundation 설계를 완료하였다.

지금부터는 철학을 확장하지 않는다.

Foundation은 Freeze 상태로 전환한다.

---

## 현재 우선순위

**Priority 1**

호텔 1호점 별빛항로 Open Test

목적: DreamTown Experience Proof

---

**Priority 2**

호텔 납품

---

**Priority 3**

호텔 테스트 결과 분석

---

**Priority 4**

Foundation Resume

---

## 현재 프로젝트 상태

### Active

호텔1호점 별빛항로

**Status:** ACTIVE

---

### Ready

섬별빛항로

**Status:** READY

**설명:**

구현하지 않는다.

삭제하지 않는다.

호텔 Experience Proof 완료 후 Active로 전환한다.

---

## Foundation Summary

DreamTown는

관광 플랫폼이 아니다.

감정 회복 항로이다.

AI는 답을 주지 않는다.

함께 발견한다.

행복은 목표가 아니라 결과이다.

여행은 현실을 떠나는 것이 아니라

행복한 일상으로 돌아가기 위한 과정이다.

---

## Freeze Rule

Foundation은 변경하지 않는다.

호텔 Experience Proof 이후

Review를 거쳐 수정한다.

---

## Freeze 예외 (2026-07-25 추가)

SPR-001의 Freeze는 새로운 세계관·철학·Framework의 확장을 중단하기 위한 것이다.

호텔 Open Test 및 실제 운영에 직접 필요한 운영 문서(Operation Documents)는
Freeze 대상이 아니다.

Brand Language, Hotel SOP, Partner Guide, Welcome Script 등 실행을 위한
문서는 생성 가능하다.

단, 새로운 세계관, Manifesto, Framework, Foundation 철학은 Resume Trigger
전까지 생성하지 않는다.

> **적용 사례:** `CAND-BRAND-002_DreamTown_Brand_Language.md`(2026-07-25)는
> 이 예외에 따라 Freeze 중에도 생성되었다 — 새로운 세계관이 아니라 호텔
> 1호점 Open Test에서 바로 쓰이는 운영 언어(거래 언어→환대 언어 치환)를
> 정의하는 실행 문서로 판단했기 때문이다.

---

## Resume Trigger

```text
호텔 Open Test 완료
↓
피드백 분석
↓
SSOT 업데이트
↓
섬별빛항로 Active
↓
DreamTown Foundation Resume
```

---

## Claude Code 역할

현재 Sprint에서는

새로운 철학 생성 금지

새로운 Framework 생성 금지

Experience Proof를 위한 구현만 수행

모든 변경은 Foundation을 기준으로 한다.

---

## Context Preservation

현재 DreamTown Foundation은 완료되었으며

호텔 1호점 Open Test를 위해 일시 Freeze 상태이다.

이 Sprint의 목표는 철학을 만드는 것이 아니라

철학이 실제 경험에서 작동하는지 검증하는 것이다.

호텔 Experience Proof 완료 후

현재 Foundation Context에서 다시 Resume한다.

---

## Freeze 대상 (참고 — 이번 세션에서 생성된 Foundation Candidate/Brief 목록)

이 Freeze가 가리키는 "Foundation"은 실질적으로 이번 세션에서 생성한 아래
문서들이다. 아래 문서들의 본문은 이 Freeze로 인해 수정되지 않으며, 계속
각자의 미병합 브랜치에 Idea 상태로 보존된다 — Resume 시점에 이 목록부터
다시 확인한다.

- `docs/YAKB/02_SEEDS/Candidates/CAND-OPS-004_Reunion_Operations.md`
- `docs/YAKB/02_SEEDS/Candidates/CAND-WORLD-001_Sowoni_Aurum_Aurora5_Role_Architecture.md`
- `docs/YAKB/02_SEEDS/Candidates/CAND-WORLD-002_Identity_of_Sowoni.md`
- `docs/YAKB/02_SEEDS/Candidates/CAND-BRAND-001_DreamTown_Platform_Philosophy.md`
- `docs/YAKB/02_SEEDS/Candidates/CAND-MEAN-001_Three_Perspectives_Interpretation_Framework.md`
- `docs/YAKB/Planning/DreamTown_Island_Foundation_Working_Brief_v0.1.md`

## Governance

이 문서는 Candidate가 아니라 Sprint 운영 지시서이므로 `GOV-001` 승격
절차를 따르지 않는다. 기존 SSOT/Manifesto/Candidate는 수정하지 않았다.
