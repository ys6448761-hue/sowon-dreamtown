# SSOT-LANG-002: Language Migration List

---

**목적:** `SSOT-LANG-001_Project_Phoenix_Language_Constitution.md`이 확정한 공식 언어를 기존 문서·코드와 대조하여, 충돌·중복되는 지점과 그 영향 범위를 기록한다.
**원칙:** 언어는 한 번에 바꾸지 않는다. 영향도를 먼저 분석한 뒤 계획적으로 이관한다. **이 문서는 자동 수정을 수행하지 않는다** — 어떤 파일도 이 문서 작성 과정에서 변경되지 않았다.
**최상위 Authority:** `docs/YAKB/00_ARCHITECTURE/Architecture_Constitution.md` (SSA — Foundation)
**Status:** Level 2 (중요 — 실행 전 검토 대상, Approved 캐논은 아니고 실행 계획 초안)
**버전:** 1.1 (Governance Update 반영)
**작성일:** 2026-07-03 (최초) / 2026-07-04 (#10~12 추가)
**근거 자료:** `SSOT-LANG-001_Project_Phoenix_Language_Constitution.md`, `Project_Phoenix_Language_Audit.md`

---

## 1. 사용법

각 행은 다음을 의미한다: **기존 용어**가 **영향 문서**에 등장하며, `SSOT-LANG-001`이 확정한 **공식 용어**와 표기가 다르다. **수정 우선순위**는 얼마나 시급히 실제 문서를 고쳐야 하는지를 나타내며, 이 우선순위는 이 문서가 실제로 수정하라는 지시가 아니라 **다음에 그 문서를 다룰 사람을 위한 참고 자료**다.

우선순위 기준:
- **High**: 사용자 노출 가능성이 있거나, 진행 중인 개발(TASK-AUDIT-001의 21시 스케줄러 구현 등)이 이 용어에 직접 의존함
- **Medium**: 내부 문서 간 불일치이지만 향후 제품화 시 반드시 정리해야 함
- **Low**: 순수 내부/설계 문서 간 표기 차이, 당장 실사용에 영향 없음

---

## 2. Migration Table

| # | 기존 용어 | 공식 용어 | 영향 문서 | 수정 우선순위 | 비고 |
|---|-----------|-----------|-----------|----------------|------|
| 1 | Somanggi (겹자 g) | Somangi | `daily-miracles-mvp/docs/ssot/core/DreamTown_Universe_Bible.md` (258, 265, 576행 등 다수) | Medium | 저작권 등록급 문서(v4.0)라 신중한 수정 필요. `Architecture_Constitution.md` 제7장 "Legacy 원본은 수정하지 않는다" 원칙 적용 여부를 먼저 판단할 것 — 등록본 자체는 보존하고, 이후 판(v4.1 등)에서만 표기를 바로잡는 방식을 권고 |
| 2 | Star Seed(별의 씨앗) → New Light(새빛) → … | Seed Star(씨앗별) → Growing Star(성장별) → … | `daily-miracles-mvp/docs/ssot/core/DreamTown_Wish_System_SSOT.md` (33, 160, 161행), `DreamTown_Miracle_System_SSOT.md` (174, 175행) | Medium | 두 문서 모두 "SSOT"를 자칭하므로 방치 시 세 번째 변형이 또 생길 위험. 실제 DB(`dt_star_stage` enum: `day1/day7/day30/day100/day365`)는 어느 쪽과도 다르므로, 두 문서 모두 "표시용 별칭 정의"일 뿐 스키마 자체엔 영향 없음 |
| 3 | StarLink | Aurora Path | `dreamtown-wishart/CON-002_sowongreem.md` | Low | 코드 구현 없음(설계 문서 단계). 판단 근거가 코드 우선순위가 아니라 세계관 정합성이므로, 이의 제기 시 RFC-LANG 대상 1순위 후보로 표시 |
| 4 | 별공방 (단축형) | 별빛 공방 | `dreamtown-wishart`의 CON-002/CON-003 계열 문서 | Low | 구어체 약칭으로는 계속 허용되므로(Alias Policy) 강제 치환 대상 아님 |
| 5 | 체크인 (소원 관련 감정 체크인) | 별빛 대화 / 오늘의 별 | `daily-miracles-mvp/dreamtown-frontend/src/components/WishCheckin.jsx`, `daily-miracles-mvp/routes/wishCheckinRoutes.js` | **High** | `Aurora_Aurum_Audit.md`가 지목한 "1순위 개발 과제"(21시 스케줄러)가 바로 이 체크인 개념을 다루므로, 코드 작업 착수 전 이 문서 표기부터 정리하는 것이 효율적 |
| 5-1 | (범위 확인) 출석 포인트 체크인 | 변경 대상 아님 — 별개 시스템으로 유지 | `daily-miracles-mvp/routes/dailyCheckRoutes.js`, `database/migrations/006_daily_checks_table.sql` | — | 소원과 무관한 범용 스트릭/포인트 메커니즘. `SSOT-LANG-001` 7절 "범위 한정"에 따라 "별빛 대화" 대상에서 명시적으로 제외 |
| 5-2 | (범위 확인) Plaza 온도 체크인 | 변경 대상 아님 — 별개 시스템으로 유지 | `sowon-dreamtown/src/app/api/me/checkin/route.ts` | — | 질문-응답 구조가 아닌 로그인 스트릭/온도 게이지. 마찬가지로 "별빛 대화" 범위 밖 |
| 5-3 | (범위 확인) QR 현장 체크인 | 변경 대상 아님 — 별개 제품으로 유지 | `dreamtown-wishart/templates/origin_checkin.html`, `app.py` | — | 물리적 방문 기반의 완전히 다른 제품(WishArt). 명칭 통합 대상 아님 |
| 6 | Aurora5 (오버로드 — AI 시스템/팀 명칭 혼용) | AI 시스템=Aurora5, 팀=Aurora5 Team | `DreamTown_Universe_Bible.md` §7-1, §7-2 | Low | 내부 문서에서만 혼용, 사용자 노출 없음. 팀 소개 섹션에만 "Aurora5 Team" 표기 추가하면 해소 |
| 7 | 소원꿈터 광장 (단독 축약 "Plaza"/"광장") | 소원꿈터 광장 (정식 문서 표기) | `sowon-dreamtown/src/app/plaza/page.tsx`, `AIL-111` 주석("Plaza 체크인 API") | Low | 코드 라우트/주석은 Alias Policy에 따라 유지, 향후 작성되는 기획·SSOT 문서에서만 정식 명칭 사용 |
| 8 | Journey Language(7단계) vs 성장 모델(5단계) vs 별 성장 5단계 | 계층적 병존 확정(4절) | `Architecture_Constitution.md` 제3장, `DreamTown_Universe_Bible.md` §5 | Medium | **`Architecture_Constitution.md`는 임의 수정 대상이 아님**(자체 Change Policy로 보호됨). 세 흐름도의 대응 관계를 설명하는 별도 해설 문서(또는 `SSOT-LANG-001` 4절 보강)만 권고하며, 원문 수정은 각 문서의 고유 변경 절차(Architecture Review / RFC)를 따로 거쳐야 함 |
| 9 | 나눔/공명 혼용 서술 | 공존 확정, 구분 정의 명시 | `sowon-dreamtown/prisma/schema.prisma`(`DtNanum`), `DreamTown_Universe_Bible.md` §6-4 | Low | 코드는 이미 두 모델(`DtNanum`/공명 필드)로 구분 구현되어 있어 실질적 충돌 아님 — 문서에 "서로 다른 체계"라는 설명 한 줄만 추가하면 해소 |
| 10 | Life Trace(삶의 흔적) | Star Trace(별의 흔적) | `MANIFESTO-001_Invisible_Value_Manifesto.md` 2절 | — (**이미 반영 완료**) | `RFC-LANG-002_Star_Trace_Canon.md`(TASK-LANG-002, CEO 승인)로 처리됨. Life Trace는 Canon에 등재된 적이 없어 "Deprecated 표시"가 아니라 "제외 후 대체"로 처리했다. 코드/DB 영향 없음(구현된 적 없는 용어) |
| 11 | Star Seed 성장 구조 4중 병존 | 통합하지 않음, 4개 병존 확정 | `SSOT-JOURNEY-001` 2절(Journey 구조), `SSOT-LANG-001` 8절(별 성장 5단계 2계열), `dt_star_stage` DB enum, `SSOT-LANG-001` 3-3절(소원→Star Seed→행동→성장→별→별자리→은하, 2026-07-04 신규) | Medium | Governance Update(2026-07-04)로 신규 발견된 **네 번째** 병렬 성장 시퀀스. 넷 다 "성장"을 표현하지만 명칭·단계 수·순서가 다르다 — 통합 여부는 별도 RFC-LANG 대상 |
| 12 | Star Trace 정의 문구 변형 | LOCKED 정의 유지("소원이의 성장 여정을 기록하는 공식 명칭") | `SSOT-LANG-001` 3절 Canon Language, 3-2절 각주 | Low | Governance Update 지시서의 "사용자의 성장과 경험을 기록하는 공식 Journey 기록 체계" 문구는 취지는 같으나 표현이 다름 — LOCKED 용어라 자동 교체하지 않고 발견만 기록 |

---

## 3. 신규 선언 용어 (Migration 대상 아님)

아래는 기존 용어와의 충돌이 아니라 `SSOT-LANG-001`에서 **최초로 공식화된** 용어이므로, 이관할 "기존 표기"가 없다. 참고용으로만 기록한다.

| 용어 | 상태 | 비고 |
|------|------|------|
| 예비 소원이 | 신규 선언 | 코드베이스 전체에서 0건 확인됨. 실제 적용처(예: 온보딩 플로우)는 별도 기획 필요 |
| Witness (아우룸의 역할) | 신규 공식화 | 새 시스템이 아니라 기존 설계 문서 문구("증인으로 등장")를 역할로 승격한 것 — 코드 영향 없음 |
| 오늘의 별 | 신규 확정(메시지 문구는 기존 설계 문서에 이미 존재) | `DreamTown_Star_Birth_Policy_Design.md`의 발송 문구를 그대로 공식명으로 채택 |

---

## 4. 실행 권고 순서

이 문서는 실행 지시가 아니지만, 만약 이관 작업을 시작한다면 아래 순서를 권고한다 — 우선순위(High → Medium → Low) 순이 아니라, **의존 관계** 순이다.

1. **#5 (체크인 → 별빛 대화/오늘의 별)** — `Aurora_Aurum_Audit.md`의 1순위 개발 과제(21시 스케줄러)가 착수되기 전에 문서 표기부터 정리. 코드/DB는 그대로 둔다.
2. **#2 (별 성장 5단계)** — 실제 DB enum과 무관한 표시용 문제이므로 언제 진행해도 리스크가 낮음. 다음에 새 SSOT 문서를 작성할 때 자연스럽게 반영.
3. **#1 (Somangi 표기)** — 저작권 등록 문서 처리 절차를 먼저 확인한 뒤 진행.
4. **#8 (Journey Language 계층 정리)** — `Architecture_Constitution.md`를 건드리지 않는 별도 해설 문서만 추가하는 방향으로, Architecture Review 필요 여부를 먼저 확인.
5. 나머지(#3, #4, #6, #7, #9) — Low 우선순위이므로 정해진 시급성 없이, 관련 문서를 다른 이유로 수정할 때 함께 반영.
