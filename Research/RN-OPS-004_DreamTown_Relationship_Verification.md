---
code: RN-OPS-004
title: DreamTown Relationship Verification
type: Research Note
status: Exploring
knowledge_level: Level 3
validation_status: Partial (targeted verification, not exhaustive)
promotion: Not Eligible
scope: Relationship verification only — not a design or refactor proposal
created: 2026-07-19
branch: docs/rn-ops-004-dreamtown-relationship-verification
purpose: RN-OPS-002 (Asset-Aware Development) Relationship Mapping / Human Needs Analysis input
related_documents:
  - Research/RN-OPS-002_Asset_Aware_Development.md
  - Research/RN-OPS-003_DreamTown_WebApp_Repository_Inventory.md
inventoried_repository: daily-miracles-mvp
---

> **이 문서가 아닌 것:** 새로운 설계 제안, Refactoring, Feature 추가,
> Architecture 제안, Candidate/SSOT 문서가 아니다. "Hotel 도메인이
> 필요하다"는 결론도 내리지 않는다. 이 문서는 **기존 코드에서 실제로
> 확인되는 관계만** 기록한다.

---

# RN-OPS-004 — DreamTown Relationship Verification

## 1. Purpose

`RN-OPS-003`에서 식별된 Core Domain(Journey, Voyage, Star/Star
Workshop, Promise, User, Media, Kakao Integration, Partner) 간에 실제
코드 레벨에서 어떤 관계가 존재하는지 추적하고, 각 관계의 확인 상태를
기록한다.

## 2. Scope and Limits

**조사한 파일:** 아래 §14 Evidence References에 나열한 약 20개 파일
(라우트 12개, 마이그레이션 8개, 서비스 1개). `daily-miracles-mvp`의
118개 라우트 파일, 100개 서비스 파일 전체를 조사하지 않았다 — Primary
Questions와 직접 관련된 파일만 추적했다. "전수조사"라고 주장하지
않는다.

**조사 방법:** 파일명/라우트 주석 기반 탐색(RN-OPS-003) 이후, 실제
`CREATE TABLE`, 컬럼 정의, `REFERENCES`(외래키), 라우트 파라미터,
쿼리문을 직접 읽어 관계를 추적했다.

---

## 3. Verified Relationships

| 관계 | 근거 |
|---|---|
| Voyage → Star | `voyage_wishes.star_id`가 생성된 별을 가리킨다(주석: "생성된 dt_stars.id") — `database/migrations/059_voyage_core.sql` |
| Promise(star_promises) → Star | `star_promises.star_id UUID NOT NULL REFERENCES stars(id) ON DELETE CASCADE` — `database/migrations/134_star_mvp.sql` |
| Promise(promise_records) → User | `promise_records.user_id VARCHAR(100) NOT NULL` — `database/migrations/122_promise_records.sql`, 실제 쿼리 사용: `routes/promiseRoutes.js:175,194` |
| Star(간이 시스템) → Location(문자열) | `stars.origin_location`이 `locations.code`값을 저장(주석: "code = stars.origin_location 저장값") — `database/migrations/148_locations.sql:6`, 표준화 이력 `157_workshop_loc_rename.sql` |
| Partner Application → Partner | `partner_applications.partner_id UUID REFERENCES dt_partners(id)` — `database/migrations/106_partner_applications.sql:14` |
| Partner Account → Partner | `partner_accounts.partner_id UUID NOT NULL REFERENCES dt_partners(id)` — `database/migrations/101_partner_accounts.sql:6` |
| Kakao 메시지 → 앱 내 특정 페이지(딥링크) | AlimTalk 버튼 `linkMobile: \`${APP_BASE_URL}/my-star\`` 등 — `services/messageProvider.js:639-692` |
| Star 생성 → 접근키 기반 재방문(URL) | `POST /create`가 `access_key` 발급, `GET /:access_key`로 재조회 — `routes/starMvpRoutes.js:5-8, 129-218` |
| Location(별공방) → Partner(명칭, 텍스트) | `locations.partner` 컬럼에 파트너명 직접 기록 — `database/migrations/157_workshop_loc_rename.sql`(예: `'yeosu_cablecar_workshop' → '여수 해상 케이블카'`) |

## 4. Partially Verified Relationships

| 관계 | 확인된 것 | 확인 안 된 것 |
|---|---|---|
| Partner ↔ Hotel(숙박) | `dt_partners.category`가 `CHECK (category IN ('cafe','restaurant','night','activity','transport','accommodation','etc'))`로 **'accommodation'을 허용** — `database/migrations/086_benefit_engine.sql:27-28` | 실제 데이터에 `category='accommodation'`인 `dt_partners` 행이 존재하는지는 확인 못함(코드 검색상 사용 사례 없음) |
| Location(별공방) ↔ Hotel(숙박) | `locations.venue_type`/`type` 컬럼은 자유 TEXT(CHECK 제약 없음) — 구조적으로 `'hotel'` 값 삽입 가능 — `database/migrations/148_locations.sql`, `157_workshop_loc_rename.sql` | 실제 seed 데이터의 `venue_type`은 `landmark`, `cafe`, `resort`뿐이며 `hotel`/`accommodation` 값은 없음 |
| Kakao 버튼 → 특정 위치(별공방) 진입 | `PromiseLocationPage.jsx`가 `?loc=` 쿼리 파라미터로 위치를 받는 구조가 이미 있다(`useSearchParams`, `searchParams.get('loc') \|\| 'yeosu-cablecar'`) — `dreamtown-frontend/src/pages/PromiseLocationPage.jsx:206-209` | 현재 `messageProvider.js`의 실제 Kakao 버튼 중 `/promise/create?loc=...` 형태로 링크하는 것은 없음(모두 `/my-star`, `/dreamtown`으로만 연결) |
| Star Workshop → 특정 Partner 귀속 | `origin_location`이 자유 문자열 파라미터라 이론적으로 특정 위치 코드를 지정 가능 — `routes/starMvpRoutes.js:131`(`origin_location = 'cablecar'` 기본값) | 이 파라미터가 실제로 "특정 호텔"에 대응하는 코드로 쓰인 사례는 없음(현재 코드는 케이블카/라또아/포레스트랜드/파란시뿐) |

## 5. Unverified Relationships

- `access_key` 기반 재방문 URL(`GET /:access_key`)을 실제로 소비하는 프론트엔드 라우트를 `App.jsx`에서 찾지 못했다 — 백엔드 엔드포인트는 있으나 프론트엔드 연결 여부 미확인.
- Voyage(`voyage_bookings`)가 Location/Partner와 연결되는지 — `voyage_bookings` 스키마에 `location_id`/`partner_id` 컬럼이 없음을 확인했으나, 다른 방식(코드상 조인 로직 등)으로 간접 연결되는지는 전수 확인 못함.
- `stars`(migration 124, 간이 시스템)와 `dt_stars`(migration 029, 기존 시스템)가 실제 운영에서 병행 사용되는지, 아니면 하나가 폐기 대상인지.

## 6. Not Present

- **"Hotel"이라는 이름의 독립 도메인/테이블/라우트는 어디에도 없다.**
- 특정 호텔을 "별들의 고향"으로 저장하는 전용 데이터 구조는 없다(Q8) — `dt_partners`, `locations` 어디에도 그런 라벨/컬럼이 없다.
- `messageProvider.js`에 "별들의 약속 남기기"라는 문구의 버튼은 없다(검색 결과 0건).
- `voyage_bookings`, `dt_stars`, `star_promises`, `promise_records` 중 어느 테이블에도 호텔/숙박시설을 가리키는 컬럼(`hotel_id`, `accommodation_id` 등)은 없다.

---

## 7. Relationship Map (실제 확인된 것만, 추정 표시)

```
Kakao (messageProvider.js WL 버튼)
  │  [Verified: 딥링크 자체] → /my-star, /dreamtown
  │  [Not Present: promise/star-workshop로의 직접 버튼]
  ▼
User (session/user_id)
  │
  ▼
Star 생성 (routes/starMvpRoutes.js POST /create)
  │  [Verified] access_key 발급, origin_location(자유 문자열) 저장
  │
  ├─▶ [Verified] star_promises (star_id FK)         ← "Promise" 구현 A
  ├─▶ [Verified] locations.code = origin_location   ← "Star Workshop" 위치
  │        │  [Verified] locations.partner (텍스트) → 파트너명
  │        │  [Partially Verified] venue_type 자유 TEXT, 'hotel' 값 없음
  │        │
  └─▶ [Verified] voyage_wishes.star_id (역방향 참조) ← Voyage 도메인

promise_records (user_id + location_id 문자열)      ← "Promise" 구현 B
  │  [Not Present] star_id, partner_id 컬럼 없음
  │  ⚠ star_promises와 별개의 병렬 구조 (§8 참고)

dt_partners (category CHECK에 'accommodation' 포함)
  │  [Partially Verified] 구조적으로 숙박업체 등록 가능
  │  [Not Present] 실제 accommodation 카테고리 데이터/연결 없음
  │
  └─▶ [Verified] partner_applications, partner_accounts (partner_id FK)

accommodations (완전히 별도 시스템: database/yeosu_migration.sql)
  │  [Not Present] 위 DreamTown Star/Partner/Location 생태계와 어떤 FK도 없음
  └─▶ bookings (accommodation_id FK) — 독립적인 여행상품 견적/예약 시스템
```

---

## 8. Hotel Concept Trace

Hotel(호텔/숙박) 개념은 코드베이스에 **두 갈래로 흩어져** 존재하며,
서로 연결되어 있지 않다:

1. **`dt_partners.category = 'accommodation'`** — DreamTown 파트너
   생태계 안에서 숙박업체를 표현할 수 있는 **스키마 상의 여지**만
   존재(`086_benefit_engine.sql:28`). 실제 사용 사례는 검색되지 않았다.
2. **`accommodations` 테이블(별도 시스템)** — `database/yeosu_migration.sql`,
   `routes/yeosuRoutes.js`에 완전히 독립된 숙박 예약 시스템(체크인/
   체크아웃/1박 요금/`bookings` 테이블)이 존재한다. 이 시스템은 자체
   `users` 테이블을 쓰며 DreamTown의 `dt_stars`/`dt_partners`/
   `locations`와 **어떤 외래키로도 연결되어 있지 않다.**

**결론(사실만):** "Hotel"은 Not Present(DreamTown 생태계 기준)이지만,
저장소 전체 기준으로는 완전히 별도의 여행상품 시스템에 Verified로
존재한다. 이 두 시스템을 통합하는 코드는 확인되지 않았다.

---

## 9. Partner–Voyage–Workshop–Promise Trace

```
Partner (dt_partners)
  │ [Verified] partner_applications, partner_accounts와 FK 연결
  │ [Not Present] Voyage, Star, Promise 테이블과의 직접 FK 없음
  │ [Partially Verified] locations.partner 텍스트 컬럼을 통해 "별공방=Location"과
  │   이름 수준에서만 연결(FK 아님, 자유 텍스트 매칭)

Voyage (voyage_wishes, voyage_bookings)
  │ [Verified] voyage_wishes.star_id → stars(dt_stars 추정, 확인 필요)
  │ [Not Present] Partner, Location과의 FK 없음

Star Workshop (locations, origin_location)
  │ [Verified] Star ↔ Location 코드로 연결(origin_location)
  │ [Partially Verified] Location ↔ Partner는 텍스트 컬럼(locations.partner)로만 연결, FK 아님

Promise (star_promises / promise_records — 두 개의 독립 구현)
  │ star_promises: [Verified] Star와 FK
  │ promise_records: [Verified] User·Location(문자열)과 연결, Star/Partner와는 [Not Present]
```

**요약:** Partner → Voyage/Star Workshop/Promise로 이어지는 **단일하고
일관된 FK 체인은 존재하지 않는다.** Location이 Star와 Partner 사이를
느슨하게(문자열/자유 텍스트로) 이어주는 유일한 연결점이다.

---

## 10. Kakao to Star Workshop Entry Path

**질문:** 카카오 챗봇의 "별들의 약속 남기기" 버튼에서 특정 호텔의
별공방으로 바로 진입할 수 있는가?

- 그런 이름의 버튼 자체가 **Not Present**(§6).
- 다만 기술적 **부품**은 부분적으로 존재한다(Partially Verified):
  - Kakao WL 버튼은 임의의 `linkMobile` URL을 가질 수 있다(`messageProvider.js`).
  - `PromiseLocationPage.jsx`는 `?loc=` 쿼리 파라미터로 특정 위치를 받을 수 있다.
  - 이론적으로 `linkMobile: \`${APP_BASE_URL}/promise/create?loc=yeosu_cablecar_workshop\`` 형태의 버튼을 만드는 것은 **기존 두 메커니즘을 조합**하면 가능해 보인다.
- 그러나 "호텔"에 대응하는 `loc` 코드가 현재 `locations` 테이블에
  하나도 없으므로(§6, §8), 실제로 "특정 호텔의 별공방"으로 보낼 수
  있는 대상 자체가 지금은 없다.

**결론: Partially Verified — 연결에 필요한 두 부품(버튼 링크 자유도,
쿼리 파라미터 수신 구조)은 각각 존재하지만, 실제로 연결해 쓴 사례는
없고 "호텔" 대상 데이터도 없다.**

---

## 11. Available URL / Route Pattern

**Verified 기존 패턴:**

| 패턴 | 예시 | 파일 |
|---|---|---|
| Route param (`:id`) | `/star/:id`, `/promise/:id`, `/voyage/:id`, `/my-star/:id` | `dreamtown-frontend/src/App.jsx:114-192` |
| Query parameter | `/promise/create?loc={code}` | `PromiseLocationPage.jsx:206-209` |
| Access key(토큰) 기반 진입 | `GET /:access_key` (백엔드), `linkMobile: .../r/${token}` (Kakao) | `routes/starMvpRoutes.js:8`, `services/messageProvider.js:195-196` |

프론트엔드가 `access_key`를 어느 라우트에서 소비하는지는 §5
Unverified 참고.

---

## 12. Data Persistence Findings

- Star 관련 테이블이 **두 세대**로 나뉘어 있다: `dt_stars`(구, migration 029)와 `stars`(신, migration 124) — `starMvpRoutes.js`는 `stars`를 사용한다(코드 주석 `extra: { table: 'stars' }`, `routes/starMvpRoutes.js:180`).
- Promise도 **두 개의 독립 구현**이 존재한다: `star_promises`(Star FK 기반) vs `promise_records`(User+Location 기반, GPS 검증 포함). 서로 참조하지 않는다.
- `locations` 테이블은 원래 5개 필드로 시작했으나(migration 148) migration 157에서 `display_name`/`partner`/`type`/`stage` 4개 컬럼이 추가로 붙었다 — 스키마가 점진적으로 확장되어 온 이력이 보인다.

---

## 13. Gaps

- 118개 라우트, 100개 서비스 파일 대부분 미조사.
- `voyage_wishes.star_id`가 `dt_stars`와 `stars` 중 어느 테이블을 실제로 가리키는지 FK 제약조건 문구로 명확히 확인하지 못했다(주석은 "dt_stars.id"라고 되어 있으나 §Data Persistence Findings의 이중 테이블 이슈와 교차 확인 필요).
- `dt_partners.category='accommodation'`의 실제 데이터 존재 여부(운영 DB 직접 조회 필요, 이번 조사는 마이그레이션/코드 파일만 확인).
- `access_key` 재방문 URL의 프론트엔드 소비처.
- Kakao 알림톡이 실제로 어떤 사용자 행동(가입/체크인/Part1 전달 등)에서 트리거되는지의 전체 트리거 목록.

---

## 14. Evidence References

| 파일 | 관련 내용 |
|---|---|
| `daily-miracles-mvp/database/migrations/029_dreamtown_p0.sql` (line 57) | `dt_stars` 테이블 생성 |
| `daily-miracles-mvp/database/migrations/124_simple_star_system.sql` (line 5) | `stars` 테이블 생성(간이 시스템) |
| `daily-miracles-mvp/database/migrations/134_star_mvp.sql` (전체) | `access_key`, `origin_location`, `star_promises` 추가 |
| `daily-miracles-mvp/database/migrations/122_promise_records.sql` | `promise_records` 생성 |
| `daily-miracles-mvp/database/migrations/123_promise_records_v2.sql` | `promise_records` 필드 확장 |
| `daily-miracles-mvp/database/migrations/148_locations.sql` | `locations` 테이블 생성, seed 데이터 |
| `daily-miracles-mvp/database/migrations/157_workshop_loc_rename.sql` | `locations.partner`/`type`/`stage` 컬럼 추가, 코드 표준화 |
| `daily-miracles-mvp/database/migrations/086_benefit_engine.sql` (line 23-38) | `dt_partners` 테이블, `category` CHECK 제약 |
| `daily-miracles-mvp/database/migrations/101_partner_accounts.sql` | `partner_accounts.partner_id` FK |
| `daily-miracles-mvp/database/migrations/106_partner_applications.sql` | `partner_applications.partner_id` FK |
| `daily-miracles-mvp/database/migrations/059_voyage_core.sql` | `voyage_wishes.star_id`, `voyage_bookings` |
| `daily-miracles-mvp/database/yeosu_migration.sql` | `accommodations`, `bookings`(별도 시스템) |
| `daily-miracles-mvp/routes/promiseRoutes.js` (line 38-44, 169-403) | `LOCATION_COORDS`, `promise_records` CRUD |
| `daily-miracles-mvp/routes/starMvpRoutes.js` (line 5-8, 129-343) | `POST /create`, `GET /:access_key`, `POST /promise`, `GET /connections/:access_key` |
| `daily-miracles-mvp/routes/partnerApplyRoutes.js` (line 6-8, 49-57) | Partner 신청 API |
| `daily-miracles-mvp/routes/yeosuRoutes.js` (line 8-290) | `accommodations` 조회/예약 API |
| `daily-miracles-mvp/services/messageProvider.js` (line 26, 186-215, 639-692) | `APP_BASE_URL`, AlimTalk WL 버튼, 딥링크 |
| `daily-miracles-mvp/dreamtown-frontend/src/App.jsx` (line 114-192) | Route 정의(`:id`, query 등) |
| `daily-miracles-mvp/dreamtown-frontend/src/pages/PromiseLocationPage.jsx` (line 206-209) | `?loc=` 쿼리 파라미터 소비 |

---

## 15. Minimal Next Validation Step

(제안이 아니라, 다음에 "확인이 더 필요한 지점"만 기록한다.)

- `voyage_wishes.star_id`가 실제로 `dt_stars`/`stars` 중 어느 것을
  가리키는지 스키마 정의(REFERENCES 절)를 직접 확인한다.
- 운영 DB에서 `dt_partners`에 `category='accommodation'`인 행이 실제로
  있는지 조회한다.
- `access_key` 재방문 URL을 프론트엔드 어느 라우트가 소비하는지
  `App.jsx` 외 다른 라우팅 설정(예: 별도 리다이렉트 서버)을 확인한다.

---

## 16. 하지 않은 것

- 코드 수정 없음
- Refactoring 없음
- Feature 추가 없음
- Architecture 제안 없음
- Candidate 생성 없음
- SSOT 변경 없음
- 기존 문서 수정 없음
- "Hotel 도메인이 필요하다"는 결론 없음 — 이 문서는 현재 상태만 기록한다
