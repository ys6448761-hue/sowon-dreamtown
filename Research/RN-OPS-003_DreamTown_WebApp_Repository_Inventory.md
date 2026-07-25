---
code: RN-OPS-003
title: DreamTown WebApp Repository Inventory
type: Research Note
status: Exploring
knowledge_level: Level 3
validation_status: Baseline (Inventory only, not yet used for Gap-driven build)
promotion: Not Eligible
scope: Repository Inventory (as-is baseline) — not a design or refactor proposal
created: 2026-07-19
branch: docs/rn-ops-003-dreamtown-webapp-inventory
purpose: First Validation step of RN-OPS-002 (Asset-Aware Development) — Existing Assets / Asset Inventory stage
related_documents:
  - Research/RN-OPS-002_Asset_Aware_Development.md
  - Research/RN-OPS-001_Phoenix_Operation_Research_Integration.md
inventoried_repository: daily-miracles-mvp (dreamtown-frontend + routes/ + database/migrations/ + services/)
---

> **이 문서가 아닌 것:**
>
> - 새로운 설계나 리팩토링 제안이 아니다.
> - Architecture 변경 제안이 아니다.
> - Feature 추가 제안이 아니다.
> - SSOT/Candidate 문서가 아니다.
>
> **이 문서는** `RN-OPS-002`(Asset-Aware Development) Workflow의 첫 두
> 단계(**Existing Assets → Asset Inventory**)를 실제로 수행한 **Baseline
> 기록**이다. "무엇을 만들 것인가"가 아니라 "현재 무엇이 존재하는가"만
> 기록한다.

---

# RN-OPS-003 — DreamTown WebApp Repository Inventory

## 0. 조사 대상 및 범위 고지

**조사 대상 저장소:** `daily-miracles-mvp` (로컬 경로 `C:\DEV\daily-miracles-mvp`)

- `dreamtown-frontend/src/` — React + Vite 프론트엔드
- `routes/` — Express 백엔드 라우트 (총 118개 `.js` 파일 확인, 2026-07-19 기준)
- `services/` — 백엔드 서비스 (총 100개 `.js` 파일 확인, 2026-07-19 기준)
- `database/migrations/` — SQL 마이그레이션

**중요한 조사 한계:** 118개 라우트 파일과 100개 서비스 파일을
전수조사하지 않았다. 아래 §3~4는 도메인 키워드(파일명, 라우트 주석,
마이그레이션명, `daily-miracles-mvp/CLAUDE.md`에 이미 기록된 핵심
테이블)를 근거로 식별한 **대표 파일 목록**이며, 각 도메인의 전체
파일을 빠짐없이 나열한 것이 아니다. 전수조사가 필요한 부분은 §6
Gap에 명시한다.

---

## 1. Directory Structure (조사한 범위)

```
daily-miracles-mvp/
├── dreamtown-frontend/
│   └── src/
│       ├── pages/            ← 약 70개 페이지 컴포넌트 확인
│       ├── components/       ← 약 20개 공용 컴포넌트 확인
│       ├── features/day, features/galaxy
│       ├── api/dreamtown.js
│       ├── config/locationAliases.js
│       ├── constants/aurumMessages.js, dreamtownFlow.js
│       ├── hooks/useAiUpsell.js
│       └── lib/
├── routes/                   ← 118개 파일 (dreamtown 관련 다수, 전수조사 안 함)
├── services/                 ← 100개 파일 (messageProvider.js 등 일부만 확인)
└── database/migrations/      ← dreamtown 관련 마이그레이션 다수 확인
```

---

## 2. Core Domain 식별 (실제 Repository 기준)

파일명·라우트 주석·마이그레이션명을 근거로 다음 8개 도메인을
식별했다 (예시로 주어진 Journey/Hotel/Star Workshop/Promise/User/
Media/Kakao Integration 중 "Hotel"은 독립 도메인으로 명확히 확인되지
않아 §6에 Observation으로 별도 기록):

1. Journey (여정/항로)
2. Voyage (여정 예약/일정 — Hotel 후보와 인접)
3. Star / Star Workshop (별공방)
4. Promise (약속)
5. User / Onboarding (소원이 진입)
6. Media (스토리북/이미지)
7. Kakao Integration (알림톡 채널)
8. Partner (제휴업체 — Hotel 후보와 인접)

---

## 3. Domain별 상세

### 3.1 Journey

**Purpose:** 소원이의 여정(Route) 경험 흐름을 관리한다.

**주요 파일:**

- Frontend: `JourneySceneEngine.jsx`, `JourneyContextPage.jsx`, `JourneyRecommendPage.jsx`, `JourneyWishPage.jsx`, `YeosuJourneyPage.jsx`, `StarJourneyPage.jsx`, `constants/dreamtownFlow.js`
- Backend: `routes/journeyLogRoutes.js`, `routes/dreamtownRoutes.js`(`POST /api/dt/journeys/start`, `POST /api/dt/journey-logs`, `GET /api/dt/journey-logs`, `POST /api/dt/journeys/from-recommendation`, `POST /api/dt/journeys/:journeyId/log`, `POST /api/dt/journeys/:journeyId/complete`), `routes/dtEngineRoutes.js`(내용 미상세 조사, §6 Unknown)
- DB: `091_dreamtown_flow.sql`, `094_dreamtown_flow_add_stages.sql`, `096_wish_journeys_stars.sql`, `route_catalog`(테이블명, 코드 주석에서 확인)

**Dependency:** Star(항로 완료 시 성장 데이터로 전환, `journeys/:journeyId/complete`), Wish(초기 소원 데이터)

---

### 3.2 Voyage (Hotel 인접 도메인)

**Purpose:** 여정 예약·일정·결제·회고를 관리한다. "Hotel"이라는 이름의
독립 도메인/파일은 발견되지 않았으나, 이 도메인이 실질적으로 숙박/
예약 흐름을 담당하는 것으로 보인다(§6 Observation 참조).

**주요 파일:**

- Frontend: `VoyageBooking.jsx`, `VoyageLanding.jsx`, `VoyagePaymentReturn.jsx`, `VoyageReflection.jsx`, `VoyageReflectPage.jsx`, `VoyageSelectPage.jsx`, `VoyageStatus.jsx`, `VoyageWish.jsx`, `VoyageAdmin.jsx`
- Backend: `routes/voyageRoutes.js`, `routes/voyageAdminRoutes.js`, `routes/starVoyageRoutes.js`
- DB: `037_voyage_logs.sql`, `038_voyage_logs_source.sql`, `043_create_voyage_schedule.sql`, `059_voyage_core.sql`, `098_voyage_bookings_extend.sql`

**Dependency:** 결제(`routes/nicepayRoutes.js`, 내용 미상세 조사), Star(voyage-logs가 별 데이터와 연결)

---

### 3.3 Star / Star Workshop (별공방)

**Purpose:** 소원이의 "별" 생성·성장·전시(광장/은하)를 관리한다.
"별공방"이라는 용어를 `routes/dreamtownRoutes.js`(3151행,
`GET /api/dt/admin/location/:loc — 제휴업체 장소별 별공방 현황`)에서
실제로 확인했다.

**주요 파일:**

- Frontend: `Star.jsx`, `StarBirth.jsx`, `StarDetail.jsx`, `StarGrowth.jsx`, `StarSummaryPage.jsx`, `MyStar.jsx`, `MyStarReturn.jsx`, `AllStars.jsx`, `Galaxy.jsx`, `GalaxyPage.jsx`, `ConstellationPage.jsx`
- Backend: `routes/starMvpRoutes.js`, `routes/dreamtownRoutes.js`(`stars/*`, `galaxies/*` 다수 엔드포인트 — 생성/조회/성장로그/공명/선물/타임라인 등), `routes/adminLocationRoutes.js`
- DB: `029_dreamtown_p0.sql`, `035_dt_stars_growth_log.sql`, `040_add_parent_star_id_to_dt_stars.sql`, `051~056_dt_star_zones/locations/visits/emotion_tag/meaning_text.sql`, `058_star_logs_level_up.sql`, `085_dt_stars_userid_nullable.sql`, `092_star_profile.sql`, `116_sample_stars.sql`, `124_simple_star_system.sql`, `126_star_trajectory.sql`

**Dependency:** Journey(여정 완료 시 성장 데이터 반영), Gift(별 선물), Resonance(공명/나눔)

---

### 3.4 Promise (약속)

**Purpose:** "약속" 관련 기록을 관리한다(구체적 UX 흐름은 §6 Unknown).

**주요 파일:**

- Frontend: `PromiseLocationPage.jsx`, `PromiseViewPage.jsx`
- Backend: `routes/promiseRoutes.js`
- DB: `122_promise_records.sql`, `123_promise_records_v2.sql`(v2 존재 — 스키마 변경 이력 있음)

**Dependency:** Location(장소 정보, `PromiseLocationPage`명에서 추정)

---

### 3.5 User / Onboarding

**Purpose:** 소원이의 최초 진입·온보딩·소원 입력을 관리한다.

**주요 파일:**

- Frontend: `EntryPage.jsx`, `AppLaunch.jsx`, `OnboardingPage.jsx`, `WishGate.jsx`, `WishInputScreen.jsx`, `WishSelect.jsx`, `Intro.jsx`, `IntroScene.jsx`, `DreamTownIntro.jsx`
- Backend: `routes/wishRoutes.js`, `routes/dailyCheckRoutes.js`
- DB: `wish_entries`, `sowon_profiles`(`daily-miracles-mvp/CLAUDE.md`에 이미 기록된 핵심 테이블), `092_star_profile.sql`

**Dependency:** Star(소원 → 별 생성 흐름)

---

### 3.6 Media (스토리북/이미지)

**Purpose:** 소원이의 이야기를 스토리북/이미지/디지털 콘텐츠로
생성·제공한다.

**주요 파일:**

- Frontend: `DigitalBook.jsx`, `StoryDraftMVP.jsx`, `Postcard.jsx`
- Backend: `routes/storybookRoutes.js`, `routes/wishImageRoutes.js`
- Services: `services/storybookQueue.js`

**Dependency:** Wish(스토리 원본 데이터), 이미지 생성 AI(연동 방식은 §6 Unknown)

---

### 3.7 Kakao Integration

**Purpose:** 카카오 채널(알림톡)을 통한 메시지 발송.

**주요 파일:**

- Services: `services/messageProvider.js`(20행: `SENS_CHANNEL_ID`, 주석 "카카오 채널 ID") — `daily-miracles-mvp/CLAUDE.md`에서도 "발송 허브"로 이미 명시된 파일

**Dependency:** SENS(외부 알림톡/SMS 발송 서비스, 코드 자체가 아니라 외부 연동)

**주의:** 전용 `kakaoRoutes.js` 같은 독립 라우트 파일은 발견하지
못했다 — Kakao 연동은 `messageProvider.js`를 통한 발송 기능으로만
확인된다(§6 Observation).

---

### 3.8 Partner (제휴업체 — Hotel 후보)

**Purpose:** 제휴업체(호텔 등으로 추정)의 신청·대시보드·인증을
관리한다.

**주요 파일:**

- Frontend: `PartnerApply.jsx`, `PartnerApplyResult.jsx`, `PartnerDashboard.jsx`, `PartnerLogin.jsx`, `PartnerManual.jsx`, `PartnerVerify.jsx`
- Backend: `routes/partnerApplyRoutes.js`

**Dependency:** Star(`adminLocationRoutes.js`의 "제휴업체 장소별 별공방 현황"과 연결 가능성 — 확인 안 됨, §6 Unknown)

---

## 4. Relationship Mapping (실제 구현 기준 관찰)

```
Kakao Integration (messageProvider.js, 알림톡)
  ↓ (추정 — 실제 발송 트리거 코드는 미확인, §6 Unknown)
User / Onboarding (EntryPage, WishGate)
  ↓
Journey (JourneySceneEngine, dreamtownFlow)
  ↓
Star / Star Workshop (StarBirth → StarGrowth → MyStar)
  ↓
Promise (PromiseLocationPage, PromiseViewPage)
```

이 흐름은 앞서 `sowon-dreamtown`의
`docs/constitution 계열(daily-miracles-mvp)` `CAND-BRAND-001` §8
"호텔 운영 흐름"(카카오톡 채널 → Part1 → 호흡항로 → 체크인 → Part2 →
21시 오로라5 안내 → Part3 → 후기 → 별들의 약속)과 **개념적으로
일치**한다 — 다만 그 문서의 각 단계(호흡항로, 오로라5 안내 등)에
정확히 대응하는 코드 파일은 이번 조사에서 1:1로 확인하지 못했다.
"Voyage"(예약/일정) 도메인이 어느 지점에서 이 흐름에 연결되는지도
명확히 확인하지 못했다.

---

## 5. Unknown / Observation / Gap

### Unknown (조사했으나 확인 못 함)

- `routes/dtEngineRoutes.js`, `routes/dtEventRoutes.js`, `routes/dtAiUnlockRoutes.js`의 정확한 역할 — 파일명만 확인, 내용 미조사
- Kakao 알림톡이 실제로 어느 이벤트(가입/체크인/Part 전달 등)에서 트리거되는지
- `PromiseLocationPage`/`PromiseViewPage`가 실제 사용자 화면에서 어떤 순서로 노출되는지
- Partner(제휴업체) 데이터가 Star/Location 도메인과 실제로 어떻게 연결되는지
- 이미지 생성 AI(DALL-E 3, `CLAUDE.md`에 명시)가 Media 도메인의 어느 서비스 파일에서 호출되는지

### Observation (관찰되었으나 해석은 보류)

- "Hotel"이라는 이름의 독립 도메인/파일/라우트는 존재하지 않는다 — 대신 **Voyage**(예약·일정)와 **Partner**(제휴업체) 두 도메인이 그 역할을 나누어 맡고 있는 것으로 보인다.
- Kakao 연동은 전용 도메인 파일이 아니라 `messageProvider.js` 하나의 발송 기능으로 존재한다 — "Kakao Integration"을 독립 도메인으로 부르는 것이 실제 코드 구조와는 다소 맞지 않을 수 있다.
- `promise_records`가 v2까지 있다는 것은 이 도메인이 최근에도 스키마 변경이 있었던, 비교적 활발히 개발 중인 영역임을 시사한다.

### Gap (확인된 공백)

- 118개 라우트 파일 중 이번에 실제로 확인한 것은 약 20개 내외다 — 나머지 약 90여 개는 파일명조차 이 문서에 나열하지 못했다.
- 100개 서비스 파일 중 이번에 확인한 것은 `messageProvider.js`, `storybookQueue.js` 등 소수다.
- Frontend `components/`, `features/day`, `features/galaxy`의 내부 구현은 조사하지 않았다.
- `sowon-dreamtown/src/app/dreamtown/`, `src/app/api/dt/`(같은 레포 내 별도의 더 작은 DreamTown 구현)와 `daily-miracles-mvp/dreamtown-frontend`의 관계 — 두 구현이 병행 운영 중인지, 하나가 실험/폐기 대상인지 확인하지 못했다.

---

## 6. Out of Scope (이번 작업에서 하지 않은 것)

- Refactoring 금지 — 실제로 수행하지 않음
- Feature 추가 금지 — 실제로 수행하지 않음
- SSOT 변경 금지 — 실제로 수행하지 않음
- Candidate 생성 금지 — 실제로 수행하지 않음
- Architecture 변경 금지 — 실제로 수행하지 않음
- Repository 코드/문서 수정 — 하지 않음(이 Inventory 문서 생성 외 어떤 파일도 변경하지 않음)

---

## 7. Inventory Summary

| 항목 | 값 |
|---|---|
| 조사 대상 저장소 | `daily-miracles-mvp` |
| 확인된 Core Domain 수 | 8 (Journey, Voyage, Star/Star Workshop, Promise, User/Onboarding, Media, Kakao Integration, Partner) |
| "Hotel" 독립 도메인 존재 여부 | 확인 안 됨 (Voyage/Partner가 그 역할을 분담하는 것으로 관찰) |
| 전수조사한 라우트 파일 | 약 20개 / 118개 |
| 전수조사한 서비스 파일 | 2개 / 100개 |
| Relationship Mapping 신뢰도 | 낮음~중간 — 도메인 존재는 확인, 정확한 트리거·연결 지점은 다수 미확인 |
| RN-OPS-002 Validation 단계 | Existing Assets, Asset Inventory 완료. Relationship Mapping 부분 완료(§4). Human Needs Analysis/Gap Analysis/Selective Composition/Operational Validation은 아직 착수 안 함 |
| Next Action | §5 Unknown 항목 중 우선순위가 높은 것(Kakao 트리거 지점, Hotel/Partner 관계)부터 후속 조사, 또는 이 Baseline으로 Human Needs Analysis 진행 여부 결정 |
