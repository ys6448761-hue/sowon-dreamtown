---
code: RN-OPS-005
title: Star Workshop / Revisit System Full Trace
type: Research Note
status: Exploring
knowledge_level: Level 3
validation_status: Broad but not exhaustive (see §26 Scope and Limitations)
promotion: Not Eligible
scope: Full-repository relationship trace — not a design or refactor proposal
created: 2026-07-19
branch: docs/rn-ops-005-star-workshop-revisit-full-trace
purpose: RN-OPS-002 (Asset-Aware Development) — broadened Existing Assets / Relationship Mapping, correcting scope limits of RN-OPS-004
related_documents:
  - Research/RN-OPS-002_Asset_Aware_Development.md
  - Research/RN-OPS-003_DreamTown_WebApp_Repository_Inventory.md
  - Research/RN-OPS-004_DreamTown_Relationship_Verification.md
inventoried_repositories:
  - daily-miracles-mvp
  - sowon-dreamtown
---

> **이 문서가 아닌 것:** 새로운 설계, Refactoring, Feature 추가,
> Architecture 제안, Candidate/SSOT 문서가 아니다. 기존 RN 문서를
> 수정하지 않았다. "지금까지 발견 안 됐다"를 "기능이 없다"로 취급하지
> 않는다 — 이번 조사에서 **실제로 대규모 기존 시스템을 새로 발견**했다.

---

# RN-OPS-005 — Star Workshop / Revisit System Full Trace

## 1. Purpose

`RN-OPS-004`는 일부 파일만 확인한 targeted verification이었다. 이번
조사는 "별공방/별저금통/별들의 약속/재방문" 개념이 케이블카에만
국한된 개별 기능인지, 아니면 호텔·카페·식당·관광지 등 여러
Partner/Location에 적용 가능한 범용 구조인지를 Repository 전체
범위(코드, 문서, git history)에서 다시 확인한다.

## 2. Domain Intent (조사 방향 참고, 코드 존재를 가정하지 않음)

1. 소원이들이 방문한 장소를 별저금통에 모은다.
2. 저장된 장소는 다시 방문할 이유가 된다.
3. 별들의 약속은 재방문 의향이 아니라 실제로 다시 오겠다는 약속이다.
4. 재방문 시 해당 장소에서 약속을 다시 열거나 재회할 수 있다.
5. 이 원리는 케이블카뿐 아니라 호텔·카페·식당·관광지·Partner 전반에
   적용 가능해야 한다.

## 3. Repositories and Scope

- `daily-miracles-mvp` (주 조사 대상) — `dreamtown-frontend/`, `routes/`,
  `services/`, `database/migrations/`, `docs/`, `scripts/`
- `sowon-dreamtown` — `src/app/dreamtown/`, `src/app/api/dt/`,
  `src/components/dreamtown/`

## 4. Search Method

1. 한글/영문 키워드로 `grep -rl`(node_modules/.next/.git 제외) 전체
   탐색
2. 히트된 파일 중 핵심 문서·라우트·마이그레이션을 직접 읽고 실제
   구현 여부 확인
3. `git log --oneline --all -i --grep=...`로 커밋 이력 탐색, 의심스러운
   커밋은 `git show --stat`으로 실제 변경 내용 확인
4. Postgres 운영 DB에 read-only SELECT 실행(건수/샘플만, 민감정보
   마스킹) — 이전 턴의 `dt_partners` 조회에 이어 `hometown_visits`,
   `dt_stars.hometown_partner_id`, `star_promises`, `promise_records`
   건수 확인

## 5. Search Coverage

**했다:** 위 키워드 전체를 `daily-miracles-mvp` 루트에서
`--exclude-dir=node_modules,.next,.git`로 검색(1차), 히트 파일 중
SSOT/Decision 문서 8개, 라우트 3개, 마이그레이션 4개를 전문 읽음,
git log 전체 이력(`--all`) 검색, DB 5개 테이블 건수 확인.

**하지 않았다:** `services/` 100개 파일 전수 읽기, `scripts/` 전수
확인, `public/` 자산 전수 확인, `tests/` 폴더 존재 여부 확인(발견되지
않음 — Gap), 삭제된 파일의 `git show`(파일 자체가 아니라 커밋 diff
stat만 확인), sowon-dreamtown의 git history는 확인하지 않음(daily-
miracles-mvp만 확인).

---

## 6. Terminology Map (실제 코드/문서 기준)

| 조사 대상 용어 | 코드/문서에서의 실제 의미 | 근거 |
|---|---|---|
| 별공방 | (A) `/entry?loc=cablecar`, `/cablecar` 페이지(케이블카 입장 UI, 판매 CTA 0개) | 커밋 `0904bc8` |
| | (B) 관리자 화면의 "🌌 별공방 운영센터" 섹션(장소별 별 현황 대시보드) | 커밋 `fd4a455`, `6af03b3`; `routes/dreamtownRoutes.js:3151` |
| | (C) `locations.stage` 컬럼 기본값 `'workshop'` | `database/migrations/157_workshop_loc_rename.sql` |
| 별들의 고향 | 호텔 파트너에게만 부여되는 "고향" 지위 — `dt_stars.hometown_partner_id` | `SSOT-2026-0413-001`, `database/migrations/099_hometown_columns.sql` |
| 별들의 약속 | (A) `star_promises`(Star FK 기반, 3m/6m/12m 타임캡슐) | `database/migrations/134_star_mvp.sql` |
| | (B) `promise_records`(User+Location 기반, GPS 90일 잠금) | `database/migrations/122/123` |
| | (C) "별공방 등록 완료"(화면 라벨, 미구현 Draft) | `SSOT-APP-002` |
| 재방문 | `hometown_visits` 테이블 + `dt_stars.hometown_visit_count` | `database/migrations/100_hometown_visits.sql` |
| 봉인·해제 | `SSOT-LOOP-001`의 최상위 사업 루프 용어(봉인→시간잠금→재방문→해제) | `docs/ssot/core/SSOT-LOOP-001_Seal_Return_Unlock_Loop_Guide.md` |

**핵심 관찰:** "별공방"이라는 한 단어가 최소 3개의 서로 다른 코드
개념(입장 페이지 / 관리자 대시보드 섹션 / DB 컬럼 기본값)을
가리킨다. "별들의 약속"도 최소 2개의 서로 다른 테이블(`star_promises`
vs `promise_records`)로 **중복 구현**되어 있다.

---

## 7. Star Workshop Findings

- **Verified:** `/entry?loc={code}`, `/cablecar` 라우트가 "별공방"으로
  지칭된다(커밋 `0904bc8`, `12c1718`, `a5bdb5d`).
- **Verified:** 관리자 측 "별공방 운영센터"는 장소(`loc`)별 별 생성
  현황을 보는 대시보드다 — `routes/dreamtownRoutes.js:3151`
  (`GET /api/dt/admin/location/:loc`), `LocationAdmin.jsx`.
- **Verified:** `locations` 테이블의 `stage` 컬럼 기본값이 `'workshop'`
  — 모든 location이 기본적으로 "workshop 단계"로 취급된다(`157_workshop_loc_rename.sql:20`).
- **Partially Verified:** 케이블카·라또아카페·포레스트랜드·파란시
  4곳이 `locations` 시드 데이터에 존재(`148_locations.sql`) — 즉
  구조적으로는 케이블카 외에도 "별공방 위치"가 여러 곳 존재하나,
  운영 UI(EntryPage, CablecarPage)가 실제로 케이블카에 가장 특화되어
  있다.
- **Legacy Only:** 커밋 `a5bdb5d feat: 기본 별공방(global) 관리자 +
  EntryPage 기본 진입`은 "글로벌 기본 별공방" 개념을 도입했으나, 이후
  운영은 케이블카 중심으로 굳어진 것으로 보인다(§9 참고).

## 8. Star Bank Findings (별저금통)

- **Not Present.** "별저금통"이라는 이름의 테이블/컬럼/컴포넌트는
  전체 검색에서 0건이다. 사용자별 "방문 장소 컬렉션"을 명시적으로
  모으는 별도 자료구조도 발견되지 않았다.
- **Partially Verified — 기능적 대응물:** `hometown_visits` 테이블(별
  1개당 여러 방문 기록 축적)과 `dt_stars.hometown_visit_count`가
  "저금통"의 기능적 요구(장소 방문을 누적)를 부분적으로 충족한다.
  다만 이것은 "여러 장소를 모으는" 컬렉션이 아니라 "하나의 고향
  장소"에 대한 방문 횟수 누적이라는 점에서 Domain Intent 1번("방문한
  **장소들**을 모은다")과는 다르다 — 고향은 단일 구조로 잠겨 있다
  (`DEC-2026-0413-001`).
- **결론:** "여러 장소를 저금통처럼 모으는" 기능은 Not Present.
  "하나의 장소에 대한 방문 누적"은 Verified.

## 9. Promise Findings

세 가지 서로 다른 구현이 발견되었다(§6 참고):

1. **`star_promises`** — Verified. `star_id` FK, `type IN ('3m','6m','12m')`,
   `routes/starMvpRoutes.js:229-284`(`POST /promise`). DB 실사용 27건
   확인(2026-07-19 조회).
2. **`promise_records`** — Verified. `user_id`+`location_id`(GPS 검증,
   90일), `routes/promiseRoutes.js`. DB 실사용 19건 확인.
3. **`SSOT-APP-002`의 "First Promise"** — **Not Present(코드)**,
   Draft 문서만 존재(`status: Draft`, "이번 턴에서 코드를 작성하지
   않았다"고 문서 자체에 명시).

**Duplicate Implementation:** 1과 2는 이름(Promise)과 목적(감정 봉인·
시간 후 개봉)이 거의 동일하지만 서로 다른 테이블·다른 라우트·다른
프론트엔드 페이지로 병행 존재하며 서로 참조하지 않는다.

## 10. Revisit and Reunion Findings

- **Verified — 최상위 사업 원칙:** `SSOT-LOOP-001`(Confirmed,
  2026-06-10 갱신)이 "봉인 → 시간잠금 → 재방문 → 해제 → 회복"을
  회사 전체의 핵심 루프로 명문화했다. 검증 지표까지 정의(7/30/90일
  재접속률, 현장 재방문 의향 등).
- **Verified — 실제 구현:** `POST /api/hometown/arrive`가 재방문을
  실제로 처리한다(`routes/hometownRoutes.js:151-171`, "동일 고향
  재방문" 분기) — `hometown_visit_count` 증가, `hometown_visits`
  행 추가.
- **Partially Verified — "해제"(unlock):** 커밋 `9f4ef64 feat: 3개월
  별 해제 UX — star-unlock.html + 재방문 감지`가 존재하나, 이번
  조사에서 `star-unlock.html` 파일 자체를 직접 열어보지는 않았다(Gap,
  §22).
- **재회(reunion):** 별도 이름의 "재회" 기능은 Not Present — `promise_records`
  개봉(`/:id/open`)과 `hometown/arrive`의 재방문이 그 역할을
  기능적으로 대신하는 것으로 보인다.

## 11. Partner Category Applicability

`dt_partners.category` 허용값: `cafe, restaurant, night, activity,
transport, accommodation, etc`(CHECK 제약, `086_benefit_engine.sql`).

| category | 실제 데이터(2026-07-19 조회) | Hometown 로직 연결 |
|---|---|---|
| cafe | 16건 | 코드상 제한 없음(§12 참고) |
| restaurant | 6건 | 코드상 제한 없음 |
| activity | 5건 | 코드상 제한 없음 |
| night | 2건 | 코드상 제한 없음 |
| accommodation | 2건(호텔 2곳) | 실제 QR 발급·hometown_star_count=10 확인 |
| etc | 1건 | 코드상 제한 없음 |

**중요:** `DEC-2026-0413-002`는 "고향 부여 로직은 category='accommodation'인
파트너에서만 허용(추후 백엔드 validation 추가 권장)"이라고 명시했다.
그러나 `routes/hometownRoutes.js`의 `POST /arrive` 핸들러(50-239행)를
직접 읽은 결과 **category를 검사하는 코드가 없다** — `hometown_qr_code`
값만으로 파트너를 조회한다(61-66행). 즉 **설계 문서(LOCKED/CONFIRMED)는
호텔 전용을 의도하지만, 실제 코드는 category와 무관하게 QR 코드만
있으면 어느 파트너든 "고향"이 될 수 있는 구조다.**

**결론:** Partially Verified — 데이터 상으로는 호텔만 고향 QR을 실제
발급받았지만, 코드 자체는 카페/식당/관광지도 기술적으로 막혀 있지
않다.

## 12. Hotel Applicability

- **Verified(실제 사용 중):** 호텔 2곳이 `dt_partners.category='accommodation'`으로
  등록, `hometown_qr_code` 발급 완료, 각각 `hometown_star_count=10`.
- **Verified(별도 경로):** `VoyageSelectPage.jsx`에 호텔 3곳(유탑
  마리나, +2곳)이 **하드코딩된 카드 + `tel:` 직접 전화 연결**로
  존재한다(코드 파일 21-44행 등) — DB 연결이나 예약 시스템 없음, 완전
  정적 리스트.
- **Not Present:** `SSOT-APP-002`가 설명하는 "Hotel = Experience
  Stage(체크인/First Promise/안식/재진입)" 흐름은 Draft 문서 단계일
  뿐 코드에는 없다.

## 13. Cafe and Restaurant Applicability

- **Not Present(고향 역할):** `DEC-2026-0413-002`가 명시적으로
  금지("카페·식당은 고향 역할 불가").
- **Verified(로그 역할):** `SSOT-2026-0413-001`이 카페·식당·레저를
  "삶의 로그 기록 지점"으로 정의. 코드 상 라또아 카페가 실제
  `locations` 시드 데이터에 존재(`lattoa_cafe` → `yeosu_lattoa_cafe`,
  `157_workshop_loc_rename.sql`)하고 커밋 `904fe5d`(라또아 커피숍
  샘플 별 10개)로 실제 운영 시도가 있었다.
- 다만 "로그 기록"이 `hometown_visits`와 다른 별도 테이블/API로
  구현되어 있는지는 확인하지 못했다(Gap).

## 14. Kakao / QR / Deep Link Findings

- **Verified:** `hometownRoutes.js`가 QR 코드 생성/다운로드 API를
  가진다(`POST /admin/generate-qr`, `GET /admin/:partnerId/qr-download`,
  245-452행) — `qrcode` 패키지로 실제 QR 이미지 생성.
- **Verified:** 커밋 `da4572d feat: 카카오톡 1클릭 공유 복구 (별공방
  흐름 + DreamTown SPA)` — 카카오 공유가 별공방 흐름과 실제로
  연결된 이력이 있다(RN-OPS-004에서 확인한 `messageProvider.js`의
  AlimTalk WL 버튼과 같은 계열).
- **Verified:** first_visit 시 SMS/알림톡 자동 발송(`hometownRoutes.js:192-221`,
  `SENS_HOMETOWN_TEMPLATE_CODE` 환경변수 사용).
- **Partially Verified:** Kakao 버튼이 QR 스캔 자체를 대체하여 특정
  호텔로 "바로 진입"시키는 코드는 확인하지 못했다 — QR은 오프라인
  스캔(파트너 현장 QR) 전제로 보인다. RN-OPS-004에서 확인한
  `PromiseLocationPage`의 `?loc=` 쿼리와 이 `hometown_qr_code`는
  서로 다른 메커니즘(둘 다 존재하나 통합되어 있지 않음).

## 15. Database Relationship Map

```
dt_partners (category: cafe/restaurant/night/activity/transport/accommodation/etc)
  ├─▶ [Verified] partner_applications, partner_accounts (partner_id FK)
  ├─▶ [Verified] hometown_qr_code, hometown_star_count (자체 컬럼, 099)
  └─▶ [Verified] dt_stars.hometown_partner_id (역참조 FK, 099)
        │
        ├─▶ [Verified] hometown_visits (star_id + partner_id FK, 100)
        ├─▶ [Verified] star_promises (star_id FK, 134) — "약속" 구현 A
        └─▶ [Not Present FK] promise_records (user_id + location_id 문자열) — "약속" 구현 B, 완전 별개

locations (code, venue_type, partner[텍스트], stage='workshop')
  └─▶ [Verified] stars.origin_location = locations.code (문자열 매칭, FK 아님, 157)

accommodations (완전 별도 여행상품 시스템, yeosu_migration.sql)
  └─▶ [Not Present] 위 어떤 테이블과도 FK 없음
```

## 16. Frontend Relationship Map

```
EntryPage / CablecarPage (/entry?loc=cablecar, /cablecar)  ← "별공방"(A)
  └─▶ StarBirth → StarDetail
        └─▶ [Verified] "여수에서 이어가기" 버튼 → /voyage-select
              └─▶ VoyageSelectPage: 호텔 카드 3장(하드코딩) → tel: 직접 통화
PromiseLocationPage(/promise/create?loc=) → promise_records (RN-OPS-004 기존 확인)
starMvpRoutes 소비 프론트: 명확한 화면 미확인(Gap) → star_promises
HometownLanding.jsx / HometownAdmin.jsx → hometownRoutes.js API (화면-API 1:1 매핑은 미확인, Gap)
```

## 17. Backend Relationship Map

```
POST /api/hometown/arrive        (routes/hometownRoutes.js:50)   [Verified, 실사용 45 stars]
POST /api/hometown/admin/generate-qr                              [Verified]
GET  /api/hometown/star/:starId                                   [존재만 확인, 내용 미독, Gap]
GET  /api/hometown/partner-stars                                   [존재만 확인, Gap]
POST /api/dt/promise (starMvpRoutes.js)          → star_promises  [Verified, 27건]
POST /api/promise (promiseRoutes.js)             → promise_records[Verified, 19건]
GET  /api/dt/admin/location/:loc (dreamtownRoutes.js:3151)         [Verified, "별공방 현황"]
```

## 18. Git History Findings

주요 커밋(오래된 순, `git log --all -i --grep` 결과 기준):

| 커밋 | 의미 |
|---|---|
| `9b05870` | 별들의 고향 MVP 최초 도입(QR 스캔 고향 등록) |
| `b04255e` | 파트너 어드민 JWT 로그인 시스템 |
| `3f9133a` | 약속 기록 MVP(장소×시간 이중 잠금) — `promise_records` 계열 기원 |
| `3bbbb17`, `3086d93` | 약속기록 구조/보안 리팩터 |
| `7b68fbb` | Star MVP 전체(migration 134~143) — `star_promises` 계열 기원 |
| `0904bc8` | 별공방/드림타운 앱 구조 **분리** + 여수 숙박(호텔) 연결(`VoyageSelectPage` 도입) |
| `9f4ef64` | 3개월 별 해제 UX + 재방문 감지 |
| `49846bf` | 2026-04-13 세계관·고향·포인트 SSOT+DEC+TASK 확정본 저장(이번 조사에서 읽은 문서들의 커밋) |
| `c9b8832` | SSOT-LOOP-001 확정(가장 최근, 2026-06-10) |
| `992f97b` | SSOT-METRIC-001 확정(가장 최근) |

**패턴 관찰:** "약속"(Promise)과 "고향"(Hometown)은 **처음부터 별개
기능으로 시작**되었다(`3f9133a`와 `9b05870`은 서로 다른 커밋, 다른
날짜대 추정). 이후 통합 시도 흔적은 커밋 메시지 검색으로는 발견되지
않았다 — 즉 "중복"이 아니라 "애초에 분리 설계"였을 가능성이 있다
(§19 참고, 단정하지 않음).

## 19. Duplicate and Legacy Implementations

- **Duplicate Implementation:** `star_promises` vs `promise_records` —
  §9 참고. 둘 다 활발히 사용 중(27건/19건)이라 어느 한쪽이 "레거시"라고
  단정할 근거는 없다 — Duplicate Implementation으로만 분류한다.
- **Duplicate Implementation:** `dt_stars`(migration 029) vs
  `stars`(migration 124) — RN-OPS-004에서 이미 발견, 이번 조사에서도
  재확인됨(`hometownRoutes.js`는 `dt_stars`를 사용, `starMvpRoutes.js`는
  `stars`를 사용 — 두 라우트 파일이 서로 다른 테이블을 쓴다).
- **Legacy Only 후보:** 커밋 `a5bdb5d`의 "글로벌 기본 별공방" 개념 —
  이후 케이블카 중심 운영으로 실질 대체된 것으로 보이나, 코드 자체가
  삭제되었는지는 확인하지 못함(Gap).
- **Orphaned Asset 후보:** `SSOT-APP-002`(Draft, 다음 스프린트 설계) —
  작성 시점(2026-07-13) 이후 실제 구현 커밋을 git log에서 찾지
  못했다 — 설계만 되고 아직 착수되지 않은 상태로 보인다.

## 20. Verified Relationships

- Hotel(`accommodation`) → `hometown_qr_code` 발급 → QR 스캔 → `dt_stars.hometown_partner_id` 부여 → 재방문 시 `hometown_visit_count` 증가
- Star → `star_promises`(FK) 직접 연결
- 재방문 감지 → SMS/알림톡 발송(`messageProvider.js` 경유)
- "별공방" = 케이블카 입장 페이지 + 관리자 대시보드 명칭(사업/UI 개념, 단일 데이터 구조 아님)

## 21. Partially Verified Relationships

- 카페/식당도 기술적으로 "고향" QR을 발급받을 수 있는가 — 코드상 가능, 실제 발급 사례는 없음(호텔 2곳뿐)
- 케이블카가 "전용"처럼 보이는 이유 — §4 질문 답변: **설계(전용 아님, 실제 첫 구현 장소일 뿐) + 운영 관행(케이블카 중심으로 굳어짐)의 혼합.** SSOT는 4가지 장소 유형을 모두 정의하지만, 실제 마케팅/운영 커밋 대부분이 케이블카에 집중되어 있다.

## 22. Unverified Relationships

- `star-unlock.html`의 실제 재방문 감지 로직 상세
- `GET /api/hometown/star/:starId`, `GET /api/hometown/partner-stars`의 정확한 응답 구조
- `HometownLanding.jsx`가 어느 라우트에서 어떤 파라미터로 열리는지
- sowon-dreamtown 쪽의 git history(별도 확인 안 함)
- 라또아 카페의 "로그 기록"이 `hometown_visits`와 통합되어 있는지, 별도 API인지

## 23. Not Present Findings

- "별저금통"이라는 이름의 데이터 구조(§8)
- 카페/식당이 실제로 "고향"이 된 사례(데이터 0건)
- Kakao 버튼에서 QR 스캔 없이 특정 파트너 고향으로 직행하는 딥링크
- `SSOT-APP-002`의 실제 코드 구현

## 24. Evidence Index

| 근거 | 위치 |
|---|---|
| 별공방=케이블카 입장 UI | 커밋 `0904bc8`, `12c1718`, `routes/dreamtownRoutes.js:3151` |
| 고향 세계관 SSOT(LOCKED) | `docs/ssot/core/SSOT-2026-0413-001_별_고향_로그_세계관.md` |
| 재방문 엔진 SSOT(LOCKED) | `docs/ssot/core/SSOT-2026-0413-002_여수_재방문_엔진_및_포인트_구조.md` |
| 고향 부여 원칙(CONFIRMED) | `docs/decisions/DEC-2026-0413-001_고향_부여_원칙.md` |
| 역할 분리 결정(CONFIRMED) | `docs/decisions/DEC-2026-0413-002_탄생지_고향_로그_역할_분리.md` |
| 봉인·재방문·해제 루프(Confirmed, 최신) | `docs/ssot/core/SSOT-LOOP-001_Seal_Return_Unlock_Loop_Guide.md` |
| First Promise Flow(Draft, 미구현) | `docs/ssot/support/SSOT-APP-002_DreamTown_First_Promise_Flow.md` |
| hometown 컬럼 정의 | `database/migrations/099_hometown_columns.sql` |
| hometown_visits 테이블 | `database/migrations/100_hometown_visits.sql` |
| /arrive 핸들러(category 미검사 확인) | `routes/hometownRoutes.js:50-239` |
| star_promises 테이블 | `database/migrations/134_star_mvp.sql` |
| VoyageSelectPage 호텔 하드코딩 | `dreamtown-frontend/src/pages/VoyageSelectPage.jsx:21-44,142-145` |
| DB 실측치(2026-07-19) | 본 대화 내 read-only 쿼리 결과(accommodation 2건, hometown_visits 5건, stars_with_hometown 45건, star_promises 27건, promise_records 19건) |

## 25. Minimal Next Validation Step

- `star-unlock.html` 실제 코드를 열어 "해제" 로직이 어느 테이블을
  쓰는지 확인
- `HometownLanding.jsx`가 실제로 어떤 라우트/QR과 연결되는지 `App.jsx`
  라우트 정의와 대조
- 카페/식당 카테고리 파트너가 향후 `hometown_qr_code`를 발급받을
  경우 실제로 등록이 되는지(코드상 category 검사 없음을 재확인한
  §11 근거로) 실제 실행은 하지 않고 코드 경로만 재확인

## 26. Scope and Limitations

- `services/` 100개 파일 중 `messageProvider.js` 외 전수 확인 안 함
- `scripts/`, `public/` 전수 확인 안 함, `tests/` 폴더 존재 자체를
  확인하지 못함
- sowon-dreamtown의 git history 확인 안 함(코드베이스만 확인, 관련
  용어 매칭 결과 daily-miracles-mvp 대비 현저히 적음을 근거로 "주
  구현체 아님"으로 잠정 판단 — §12 재확인 필요 목록에는 없음)
- 삭제된 파일 자체의 온전한 내용 복원(`git show <hash>:<path>`)은
  수행하지 않음 — commit stat과 메시지만 확인
- DB 조회는 5개 집계 쿼리로 한정 — 개별 행 상세, JOIN 기반 무결성
  검증은 하지 않음
