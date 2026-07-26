# SSOT-GROWTH-001: Growth Architecture

---

**목적:** Project Phoenix 안에 흩어져 있는 여러 성장 흐름(Journey, Star Seed, Star Trace, DB Enum 등)을 하나의 공식 Growth Architecture로 통합한다. 향후 모든 서비스와 문서는 본 SSOT를 참조한다.
**최상위 Authority:** `docs/YAKB/00_ARCHITECTURE/Architecture_Constitution.md` (SSA — Foundation)
**Level:** Domain SSOT (Growth) — Constitution이 아니라 `SSOT-KNOWLEDGE-001/002/003`과 같은 층위의 실행 표준(What). 여러 Constitution(Journey/Language/OS)에 흩어진 성장 관련 내용을 통합 참조하는 **횡단(cross-cutting) SSOT**다.
**Status:** Approved
**버전:** 1.2.0 (Star Trace 상세 정의 반영)
**확정일:** 2026-07-04 (최초) / 2026-07-05 (SSOT-PASSPORT-001, SSOT-STARTRACE-001 반영)
**변경 절차:** 6절 "SSOT 우선순위" 참조 — 새 성장 단계 추가/변경은 RFC 필수
**근거 자료:** `SSOT-JOURNEY-001`, `SSOT-LANG-001`(3-3절, 8절), `Aurora_Aurum_Audit.md`, `Project_Phoenix_Language_Audit.md`

> This SSOT is governed by CORE-PRINCIPLES-001.

> **개정 이력**: **2026-07-04 — `SSOT-PASSPORT-001_DreamTown_Passport.md` 반영(TASK-PASSPORT-001)**: 5-4절이 "미존재"로 기록했던 Passport가 공식 정의되어, 4절 매핑 규칙 표와 5-4절 결론에 참조를 추가했다. 원 조사 기록은 보존.
> **2026-07-05 — `SSOT-STARTRACE-001_Star_Trace.md` 반영(TASK-STARTRACE-001, 참조만 추가)**: 5-3절에 실제 기록 체계 정의 문서로의 참조를 추가했다.

---

## 1. Purpose

Project Phoenix의 모든 성장 표현은 하나의 공식 성장 구조를 따른다.

Journey, Star Seed, Passport, Star Trace, Reward, DB, AI Prompt는 모두 본 문서를 기준으로 한다.

---

## 2. Growth Architecture

공식 성장 구조는 다음과 같다.

```
Origin
(시작)
  ↓
Wish
(소원)
  ↓
Star Seed
(첫 번째 행동)
  ↓
Journey
(경험)
  ↓
Action
(실천)
  ↓
Growth
(변화)
  ↓
Star
(성장의 증거)
  ↓
Constellation
(연결)
  ↓
Galaxy
(확장과 공동체)
```

---

## 3. 각 단계 정의

### Origin
사용자의 시작점. 아직 아무 행동도 하지 않은 상태.

### Wish
변화를 원하는 마음. 모든 Journey의 출발점.

### Star Seed
DreamTown의 첫 번째 Physical Interface. 소원을 행동으로 연결하는 첫 번째 증표.

### Journey
실제 경험. 여행, 콘텐츠, 활동 등이 포함된다.

### Action
Journey 이후 사용자가 선택한 행동. 성장은 행동을 통해 이루어진다.

### Growth
행동의 누적 결과.

### Star
성장의 증거. 배지, 레벨, 기록 등으로 표현될 수 있다.

### Constellation
다른 사람과의 연결. 개인의 성장이 관계로 확장되는 단계.

### Galaxy
공동체와 생태계. Project Phoenix가 지향하는 최종 성장 단계.

---

## 4. 매핑 규칙

아래 항목은 Growth Architecture에 매핑한다. 실제 매핑 결과는 5절 Migration Audit의 표를 따른다.

| 항목 | 존재 여부(실측) | 매핑 방식 |
|------|-------------------|-----------|
| DreamTown Journey | ✅ 존재(`SSOT-JOURNEY-001`) | 11단계 → 9단계 근사 대응(5-1절) |
| Star Seed 성장 단계 | ✅ 존재(3종류 병존, `SSOT-LANG-001` 3-3절·8절) | 부분은 이미 신규 구조와 거의 동일(5-2절) |
| Star Trace | ✅ 존재(LOCKED, `SSOT-LANG-001` 3절) | 특정 단계가 아니라 **전 단계를 관통하는 기록 체계**로 매핑(5-3절) |
| Passport | ✅ **존재(2026-07-04 정의됨)** | `SSOT-PASSPORT-001_DreamTown_Passport.md`로 공식 정의 완료 — Growth Architecture를 사용자에게 보여주는 Experience Interface(5-4절 갱신 참조) |
| Reward | ⚠️ 존재하나 분산됨(daily-miracles-mvp Playground `rewardService.js`) | "Star" 단계의 구현체로 매핑(5-5절) |
| DB Enum | ✅ 존재(`dt_star_stage`) | Star 성장 5단계와 동일 계열로 추정 매핑(5-2절) |
| AI Prompt | ✅ 존재(`dreamtown-wishart/prompt_builder.py`) | 별도 시각 구현 레이어로 참고 매핑(5-6절) |
| Future Products | 해당 없음 | 향후 신규 제품은 설계 시 본 9단계부터 대조(6절) |

---

## 5. Migration Audit

현재 존재하는 성장 구조를 실제로 조사한 결과다. **자동으로 기존 구조를 고치지 않았다** — 매핑만 하고, 실제 문서 수정이 필요한 항목은 각 하위 절에 표시했다.

### 5-1. DreamTown Journey (`SSOT-JOURNEY-001` 2절, 11마디) → Growth Architecture(9마디) 대응

| Journey 구조 | Growth Architecture | 비고 |
|---------------|----------------------|------|
| 일상 | Origin | |
| 문제 | Origin | Origin의 세부 국면(문제 인식)으로 흡수 |
| 소원 | Wish | 문장까지 일치하는 개념 |
| DreamTown | Wish → Star Seed 전이 지점 | DreamTown 진입이 곧 Star Seed 발급의 계기 |
| 여정 / Journey | Journey | 표기(여정/Journey)는 `RFC-LANG-001` 병행 정책 그대로 유지 |
| 기억 봉인 | Growth | "Journey를 봉인한 기억"은 누적된 변화의 기록 |
| 세 이레(21일) | Action | 반복되는 실천의 리듬 |
| 동행 | Action ~ Growth 사이 | 특정 단계라기보다 전 구간에 걸친 관계 양식 |
| 재회 / 재방문 | Star | 과거·현재 자신이 다시 만나는 지점 = 성장의 증거를 확인하는 순간 |
| 나눔 | Constellation → Galaxy | 개인 성장이 관계·공동체로 확장 |
| 새로운 Journey | Origin(순환) | 다음 사이클의 시작 |

> **정합성 참고**: 11마디를 9단계에 강제로 욱여넣지 않았다 — "동행"처럼 특정 한 칸이 아니라 여러 단계에 걸쳐 있는 개념은 그대로 "~사이"로 표시했다. `SSOT-JOURNEY-001` 본문은 이 대응표 때문에 수정하지 않는다(11마디 구조가 더 상세하며, Growth Architecture는 그 압축형이다).

### 5-2. Star 성장 단계 3종 → Growth Architecture 대응

`SSOT-LANG-001`에는 이미 스타 성장과 관련된 **세 가지 서로 다른 구조**가 있었다(`RFC-LANG-001`/Governance Update에서 이미 지적됨). 이번 조사로 넷째(Growth Architecture)를 더하면 총 4개다.

| # | 구조 | 단계 | Growth Architecture 대응 |
|---|------|------|----------------------------|
| 1 | 별 성장 5단계 (계열 A, `SSOT-LANG-001` 8절, `DreamTown_Naming_System_SSOT.md`) | Seed Star → Growing Star → Bright Star → Guide Star → Somangi | Star Seed → Growth → Star → Constellation → Galaxy — **놀랍도록 깔끔하게 대응**(5단계:5단계) |
| 2 | 별 성장 5단계 (계열 B, `DreamTown_Wish_System_SSOT.md`/`DreamTown_Miracle_System_SSOT.md`) | Star Seed → New Light → Bright Star → Guide Star → Somangi | 계열 A와 2단계 명칭만 다를 뿐 동일 대응 |
| 3 | DB enum(`dt_star_stage`) | day1 → day7 → day30 → day100 → day365 | 계열 A/B와 **동일한 5칸**이라 같은 자리에 대응될 가능성이 높음. 단, 코드에서 day1=Seed Star 식의 명시적 매핑을 직접 확인하지는 못했다 — **추정 매핑**으로 표시 |
| 4 (신규) | `SSOT-LANG-001` 3-3절 (Governance Update로 추가) | 소원 → Star Seed → 행동 → 성장 → 별 → 별자리 → 은하 | **이 구조는 사실상 Growth Architecture 그 자체다** — "Origin"과 "Journey"만 없을 뿐, 나머지 7개 단계(소원=Wish, Star Seed=Star Seed, 행동=Action, 성장=Growth, 별=Star, 별자리=Constellation, 은하=Galaxy)가 **완전히 일치**한다 |

> **핵심 발견**: Growth Architecture(9단계)는 완전히 새로운 발명이 아니라, 이미 `SSOT-LANG-001` 3-3절에 있던 7단계 구조에 "Origin"과 "Journey"를 끼워 넣어 완성한 것이다. 이는 좋은 신호다 — 이번 통합이 기존 캐논과 충돌하지 않고 그 위에 자연스럽게 얹힌다는 뜻이다.
>
> **미해결 항목(자동 수정하지 않음)**: 계열 A/B의 "성장별/새빛" 명칭 불일치는 이미 `Project_Phoenix_Language_Audit.md`·`RFC-LANG-001`에서 발견되어 계열 A(Naming System SSOT 계열)가 우선 채택된 바 있다. 이번 감사는 그 결정을 뒤집지 않는다.

### 5-3. Star Trace → Growth Architecture 대응

Star Trace(별의 흔적)의 LOCKED 정의("DreamTown에서 소원이의 성장 여정을 기록하는 공식 명칭", 포함범위: Origin/Star Seed/Journey/Growth/Reunion/Resonance/Sharing/Connection)를 Growth Architecture와 대조하면:

| Star Trace 포함범위 | Growth Architecture 대응 |
|----------------------|----------------------------|
| Origin | Origin |
| Star Seed | Star Seed |
| Journey | Journey |
| Growth | Growth |
| Reunion(재회) | Star(5-1절 대응 근거) |
| Resonance(공명) | Constellation(다른 사람과의 감정적 연결) |
| Sharing(나눔) | Constellation → Galaxy |
| Connection(연결) | Galaxy |

> **✅ 처리 현황(2026-07-05, TASK-STARTRACE-001)**: 이 대응표가 다루는 "무엇을 기록하는가"는 이제 `SSOT-STARTRACE-001_Star_Trace.md`가 실제 기록 원칙·Event Category·데이터 스키마로 구체화했다. 이 절의 결론(전 단계를 관통하는 기록 체계)은 변경되지 않았다.

**결론**: Star Trace는 Growth Architecture의 **특정 한 단계가 아니라, 전 단계(Origin~Galaxy)를 관통해서 기록하는 체계**다 — "성장의 기록 매체"로 이해하면 정확하다. `SSOT-LANG-001`의 Star Trace LOCKED 정의는 수정하지 않는다(이미 이 9단계와 정확히 호환된다).

### 5-4. Passport — 신규 개념 확인

`daily-miracles-mvp`, `sowon-dreamtown`, `dreamtown-wishart`, `dreamtown-assets`, `antigravity-notebooklm` 전체를 검색한 결과 **"Passport"라는 이름의 기능·DB·화면·설계 문서는 어디에도 없다.** 유일하게 근접한 것은 `daily-miracles-mvp/database/migrations/017_aurora5_unified_engine.sql`의 주석 `-- 배지/여권 (Q11: jsonb)`뿐이며, 실제 컬럼명은 `badges`(passport라는 이름의 별도 테이블이 아님)다.

**결론**: Passport는 이번 지시서로 처음 도입되는 개념이다. 억지로 기존 구조에서 근거를 찾지 않는다 — Growth Architecture의 개념상, Passport는 "Origin부터 Galaxy까지의 여정을 담는 물리적/디지털 기록물"에 해당할 것으로 추정되나, **구체적 설계는 이 문서의 범위 밖이며 신규 기능 기획이 필요하다.**

> **✅ 처리 현황(2026-07-04, TASK-PASSPORT-001)**: 위 예측이 그대로 맞아떨어졌다 — `SSOT-PASSPORT-001_DreamTown_Passport.md`가 Passport를 "Growth Architecture를 사용자에게 보여주는 Experience Interface"로 공식 정의했다. 이 절의 조사 결과(코드베이스에 0건)는 여전히 유효한 역사적 기록으로 보존한다.

### 5-5. Reward — 실제로는 두 갈래로 분산되어 있음

- **Playground Reward Engine**(`daily-miracles-mvp/services/playground/rewardService.js`, `database/migrations/014_playground_engine.sql`): 배지(`warm_one_liner`, `healed_someone`, `remix_spark`, `bring_a_creator`, `first_artifact`, `s_grade_master`) + 크레딧(`weekly_s_grade` 100, `first_creator_via_link` 200, `top_help_score_weekly` 300 등) — 소원놀이터(Playground) 모듈 전용의 독립된 시스템.
- **`routes/rewardRoutes.js`**: 이름은 "Reward"이지만 실제로는 기존 `pointService`(포인트 900P 차감)를 그대로 호출하는 워터마크 PDF 미리보기 기능 — 별도 시스템이 아니라 **기존 포인트 시스템에 "Reward"라는 라벨만 붙인 것.**

**Growth Architecture 대응**: Part 3에서 이미 "Star = 성장의 증거. 배지, 레벨, 기록 등으로 표현될 수 있다"고 정의했다 — Playground Reward Engine의 배지 체계가 정확히 이 "Star" 단계의 **실제 구현 사례**다. `routes/rewardRoutes.js`는 성장 단계와 무관한 별도의 포인트 소비 기능이므로 매핑 대상에서 제외한다.

### 5-6. AI Prompt — 별도의 시각 구현 레이어(참고용, 통합하지 않음)

`dreamtown-wishart/prompt_builder.py`에는 이미 자체적인 단계 구조가 있다: `1P 발견 → 2P 응답 → 3P 기록`(주석), `STAGE 0~5` 빌드 파이프라인, gemstone star의 world-response 비율(10%→60%→100%) 밝기 연출. 이는 **이미지 생성 시 카메라 앵글·보석 밝기를 결정하는 시각 연출 로직**이며, 사용자 대면 성장 단계 그 자체는 아니다.

**대응(느슨한 참고용)**: 1P 발견≈Wish/Star Seed 근방, 2P 응답≈Journey/Action 근방, 3P 기록≈Growth/Star 근방으로 대략 대응되나, **이 문서는 이 시각 연출 로직을 Growth Architecture로 강제 통합하지 않는다** — 목적이 다른 별도 구현 레이어이기 때문이다. 향후 필요시 별도 RFC로 정식 매핑한다.

또한 `daily-miracles-mvp/database/migrations/017_aurora5_unified_engine.sql`의 `sowon_profiles.ef_scores`(vitality/relationship/growth/resolve/stability 5개 성장 차원 + 보석 매핑)는 **순차적 단계가 아니라 다차원 점수 체계**라 9단계 시퀀스와는 성격이 다르다 — 이 역시 통합하지 않고 참고 사실로만 기록한다.

### 5-7. 중복 구조 종합

| 발견된 중복/병존 구조 | 처리 방침 |
|--------------------------|-------------|
| Journey 11마디 vs Growth 9단계 | 압축 관계로 정리(5-1절), 원문 수정 없음 |
| 별 성장 5단계 계열 A/B/DB enum vs Growth 9단계 | 계열 A 우선 채택은 유지, Growth 9단계가 그 위에 얹힘(5-2절), 원문 수정 없음 |
| `SSOT-LANG-001` 3-3절 구조 vs Growth 9단계 | **사실상 동일 구조 확인** — 3-3절이 이 문서의 직접적 전신(5-2절) |
| Reward(Playground) vs Reward(포인트 라벨) | 별개 시스템임을 명확화(5-5절), 코드 변경 없음 |
| AI Prompt 시각 단계 vs Growth 9단계 | 통합하지 않고 참고 매핑만(5-6절) |

---

## 6. SSOT 우선순위

성장과 관련된 모든 신규 기능은 본 SSOT-GROWTH-001을 먼저 참조해야 한다.

새로운 성장 단계를 추가하거나 변경하는 경우에는 반드시 RFC를 거친다.

---

## 완료 보고 요약

| 확인 항목 | 결과 |
|-----------|------|
| SSOT-GROWTH-001 생성 | ✅ |
| 공식 Growth Architecture 정의 | ✅ 9단계, 원문 그대로 |
| 성장 단계별 역할 명확화 | ✅ 3절 |
| 기존 성장 체계 Mapping Table | ✅ 5절(Journey/별성장 3종/Star Trace/Passport/Reward/AI Prompt) |
| 중복 구조 Audit | ✅ 5-7절 — 핵심 발견: 3-3절 구조가 Growth Architecture와 사실상 동일했음 |
| Passport 실존 여부 | ❌ 미존재 확인(신규 개념, 5-4절) |
| Reward 실존 여부 | ⚠️ Playground Reward Engine은 실존(Star 단계 구현체), `rewardRoutes.js`는 포인트 시스템 재라벨일 뿐 |
| 기존 문서 수정 여부 | **없음** — `SSOT-JOURNEY-001`, `SSOT-LANG-001`(3-2·3-3·8절), DB, 코드 전부 원문 유지. 본 문서는 매핑만 수행 |
