---
code: RN-OPS-006
title: Repository Operational Relationship Verification
type: Research Note
status: Exploring
knowledge_level: Level 3
validation_status: Evidence-based, targeted follow-up on RN-OPS-005 open items
promotion: Not Eligible
scope: Evidence-only trace of hidden connections — not a design proposal
created: 2026-07-20
branch: docs/rn-ops-006-repository-operational-relationship
purpose: Complete the As-Is operational structure left unresolved by RN-OPS-005
related_documents:
  - Research/RN-OPS-004_DreamTown_Relationship_Verification.md
  - Research/RN-OPS-005_Star_Workshop_Revisit_System_Full_Trace.md
inventoried_repositories:
  - daily-miracles-mvp
  - sowon-dreamtown
---

> **이 문서가 아닌 것:** 설계, 리팩터링, 기능 추가 제안이 아니다.
> 모든 결론은 코드/Git Evidence만으로 작성했다. "확인되지 않았다"와
> "존재하지 않는다"를 구분한다.

---

# RN-OPS-006 — Repository Operational Relationship Verification

## 1. HometownLanding

**Status: Verified (Dead Code 아님)**

**Evidence:**
- 라우트 등록: `dreamtown-frontend/src/App.jsx:169`
  (`<Route path="/hometown" element={<HometownLanding />} />`)
- QR URL 생성: `routes/hometownRoutes.js:275`
  (`qrUrl = \`${APP_BASE_URL}/hometown?partner=${qrCode}\``) — QR 이미지 자체가
  이 경로를 인코딩한다.
- 소비 코드: `HometownLanding.jsx:259-274,298-313` —
  `new URLSearchParams(window.location.search).get('partner')`로 파라미터를
  읽고, `POST /api/hometown/arrive`(271-276행), `GET /api/hometown/partner-stars`(205-209행)를
  실제로 호출한다.
- **내부 링크 없음:** 앱 내 어떤 버튼/컴포넌트도 `/hometown`으로 직접
  링크하지 않는다(소스 전체 검색 결과 `App.jsx`의 라우트 선언 1건뿐).

**Conclusion:** `/hometown`은 인앱 내비게이션이 아니라 **QR 스캔
전용 진입점**으로 설계·구현되어 있다. 내부 링크가 없는 것은 결함이
아니라 QR 기반 진입 구조상 당연한 결과로 보인다(추정 아님 —
`generate-qr` 핸들러가 이 경로를 URL로 인코딩하는 코드가 실제로
존재).

---

## 2. star-unlock (및 star-entry)

**Status: Verified (기능 자체는 동작), Partially Verified (도달 경로)**

**Evidence:**
- `public/star-unlock.html:382` — `fetch(\`/api/star/${accessKey}\`)`
- `public/star-unlock.html:394` — `data.promises?.[0]`(응답의 promises
  배열 사용)
- `public/star-unlock.html:431` — `fetch('/api/star/reflect', ...)`
- API 마운트: `server.js:2800` — `app.use('/api/star', starMvpRoutes)`
- `routes/starMvpRoutes.js:8` — `GET /:access_key`(별 + 약속 + 최근
  reflection 조회)
- 도입 커밋: `9f4ef64`("3개월 별 해제 UX — star-unlock.html + 재방문
  감지"), 같은 커밋에서 `public/star-entry.html`도 함께 추가("QR
  재진입 시 access_key 3개월 이상이면 unlock 페이지로 자동
  리다이렉트")
- **저장소 내 참조 없음:** `star-unlock.html`, `star-entry.html` 둘 다
  다른 어떤 소스 파일(`routes/`, `services/`, `dreamtown-frontend/src/`)에서도
  파일명이 언급되지 않는다(전체 검색 0건). 두 파일 모두 도입 커밋
  이후 수정 이력이 없다(`git log --all -- <path>` 각각 1개 커밋만
  존재).

**Conclusion:**
- API 연결은 **Verified** — `star_promises`/`stars` 테이블과 정확히
  연결되어 실제로 동작 가능한 코드다.
- 그러나 이 두 페이지에 **도달하는 링크가 현재 저장소 어디에도
  없다** — 물리적 QR 스티커나 저장소 밖에서 관리되는 문자 발송
  템플릿을 통해서만 도달 가능했을 것으로 보이나, 그 발급 경로는 이번
  조사에서 찾지 못했다(Unverified, 추정 아님 — 발급 경로가 있었다는
  근거도, 없다는 근거도 확보하지 못함).

### 발견된 실제 연결 오류 (신규)

`services/reminderService.js:46`이 생성하는 리마인더 링크는
`${APP_BASE_URL}/star/${accessKey}`다. 그러나 `dreamtown-frontend/src/App.jsx`의
`/star/:id` 라우트는 `StarDetail.jsx`에 연결되고,
`StarDetail.jsx`(`dreamtown-frontend/src/pages/StarDetail.jsx`)는
`api/dreamtown.js`의 `getStarDetail()`을 호출하여
`GET /api/dt/stars/:id/detail`(`dt_stars` 테이블, UUID 기준)을 조회한다
— `access_key`(짧은 영숫자 코드, `stars` 테이블 소속)를 UUID 자리에
넣어 조회하는 형태가 된다.

**Status: Partially Verified(연결 자체는 코드로 확인됨) /
Unverified(런타임 실패 여부는 직접 실행하지 않아 확인 못함)**

**Conclusion:** `reminderService.js`가 생성하는 링크의 목적지
(`/star/:id` → `dt_stars` 조회)와 실제로 그 값을 유효하게 처리할 수
있는 라우트(`star-unlock.html` → `/api/star/:access_key` → `stars`
테이블)가 **서로 다르다.** 코드 근거로 이 불일치는 확인되나, 실제
런타임에서 어떤 에러/화면이 뜨는지는 실행하지 않아 확인하지 못했다.

---

## 3. services/ 키워드 스캔

`services/` 전체(100개 파일)에서 파일 수 기준 매치:

| 키워드 | 매치 파일 수 | 비고 |
|---|---|---|
| hometown | 1 | `partnerEvalService.js` |
| promise | 67 | 대부분 JS `Promise` 객체(비동기) — 도메인 무관 오탐 다수 |
| partner | 15 | |
| workshop | 0 | Not Present |
| revisit | 1 | |
| voyage | 7 | |
| qr | 4 | |
| kakao | 8 | |
| unlock | 0 | Not Present(파일명 기준. `star-unlock.html`은 `public/`이라 `services/` 밖) |

도메인 특화 재검색(`promise_records`, `star_promises`, `hometown`,
`voyage_wishes`, `qrcode`)으로 실제 사용 파일만 추리면:

- **`services/partnerEvalService.js`** — `hometown_visits`를 파트너
  평가 점수 산정에 사용("QR 스캔 횟수 hometown_visits 가중치 20점",
  9행, 74행, 90행). **Verified: Hometown 시스템이 파트너 평가/등급
  로직과 실제로 연결되어 있다** — `dt_partners.grade`,
  `grade_updated_at` 컬럼(RN-OPS-004에서 이미 확인된 컬럼)과의 관계로
  추정되나, 등급 산정 결과가 어디에 반영되는지(예: 프론트 노출 여부)는
  확인하지 못했다(Unverified).
- **`services/reminderService.js`** — `star_promises`(3m/6m/12m
  리마인더)를 CRON 배치로 처리, `messageProvider.sendSensAlimtalk`
  경유 카카오 발송. **Verified: Promise(A) 시스템이 실제로 Kakao
  발송과 연결되어 있다.** (단, §2의 링크 불일치 발견 포함)

**Conclusion:** `services/`에서 도메인 관련 실사용은 2개 파일뿐이며,
나머지는 파일명/일반 키워드 매치의 노이즈였다. "workshop", "unlock"이라는
단어 자체를 파일명·변수명으로 쓰는 서비스는 없다(Not Present) —
개념은 `.html` 정적 파일(`star-unlock.html`)과 라우트 주석("별공방")에만
존재한다.

---

## 4. Git History — sowon-dreamtown

`git log --oneline --all -i --grep`으로 별공방/고향/hometown/약속/promise/재방문/revisit/partner/QR/kakao/voyage
전체를 검색한 결과, **이번 세션에서 우리가 직접 작성한 RN-OPS
커밋 3건(`b8636b5`, `492246c`, `81428a8`) 외에는 매치되는 커밋이
없다.**

**Status: Not Present(sowon-dreamtown 자체 구현 이력)**

**Conclusion:** sowon-dreamtown 저장소에는 별공방/고향/약속/재방문/파트너/QR/카카오/보야지
관련 기능이 과거에 구현되었다가 삭제된 흔적이 없다 — 이 저장소는
애초에 이 도메인의 구현 이력을 가진 적이 없는 것으로 보인다(git log
전체 검색 기준).

---

## 5. Repository Relationship (As-Is, Evidence 기반만)

```
dt_partners (category='accommodation', 2건 실사용)
  │
  ├─▶ [Verified] hometown_qr_code 발급
  │     └─▶ [Verified] QR 이미지 = APP_BASE_URL/hometown?partner=CODE
  │           └─▶ [Verified] HometownLanding.jsx (React, /hometown 라우트)
  │                 └─▶ [Verified] POST /api/hometown/arrive
  │                       └─▶ [Verified] dt_stars.hometown_partner_id 갱신
  │                       └─▶ [Verified] hometown_visits INSERT (재방문 기록)
  │                       └─▶ [Verified] first_visit 시 Kakao 알림톡 발송
  │
  └─▶ [Verified] hometown_visits → partnerEvalService.js 평가 점수 반영
        └─▶ [Unverified] 평가 점수가 실제 어디에 노출/활용되는지

stars (access_key 기반, dt_stars와 별개 테이블)
  │
  ├─▶ [Verified] star_promises (3m/6m/12m 약속)
  │     └─▶ [Verified] reminderService.js CRON → Kakao 알림톡 발송
  │           └─▶ [Partially Verified/끊김] 링크가 /star/:id(dt_stars 기준)를
  │                 가리켜 stars(access_key) 시스템과 불일치
  │
  └─▶ [Verified] star-unlock.html ← GET /api/star/:access_key
        (단, 이 페이지 자체로 오는 링크 경로는 Unverified)

promise_records (user_id + location_id, dt_partners/stars와 FK 없음)
  │ [Not Present] 위 어떤 흐름과도 연결 안 됨 — 완전히 독립된 3번째 계열
```

### 호텔/카페/식당/관광지별 적용 가능성 (재확인, RN-OPS-005와 일치)

| Partner 유형 | Hometown 연결 | 근거 |
|---|---|---|
| 호텔(accommodation) | Verified(실사용 2건) | §5 다이어그램 |
| 카페/식당/관광지 | Partially Verified(코드상 category 검사 없어 기술적으로 가능, 실사용 0건) | RN-OPS-005 §11(재확인, 변경 없음) |

---

## 6. Legacy / Orphaned / Duplicate 구조 (종합)

| 구조 | 분류 | 근거 |
|---|---|---|
| `star-unlock.html`, `star-entry.html` | **Orphaned Asset** | 도입 커밋 1건 이후 참조·수정 이력 없음, 저장소 내 링크 0건 |
| `dt_stars` vs `stars` | **Duplicate Implementation** | RN-OPS-004/005에서 확인, 이번 조사에서 reminderService 링크 불일치로 실질적 영향 재확인 |
| `star_promises` vs `promise_records` | **Duplicate Implementation** | RN-OPS-005 §9 |
| "글로벌 기본 별공방"(커밋 `a5bdb5d`) | **Legacy 후보** (미확정) | RN-OPS-005 §19, 이번 조사에서 추가 확인 못함 |

---

## 7. Verified Relationships (요약)

- Partner(accommodation) → QR → HometownLanding → arrive API → dt_stars/hometown_visits 갱신 → Kakao 발송
- hometown_visits → partnerEvalService 평가 점수 반영
- star_promises → reminderService → Kakao 발송(링크는 불일치)
- star-unlock.html ↔ `/api/star/:access_key` ↔ stars/star_promises

## 8. Partially Verified Relationships

- reminderService 링크(`/star/:accessKey`)와 StarDetail 라우트(`dt_stars` 기준) 간 실제 런타임 동작(에러 여부 미실행 확인)
- partnerEvalService의 평가 점수 활용처

## 9. Unverified Relationships

- `star-unlock.html`/`star-entry.html`의 실제 배포 경로(SMS 템플릿, 물리 QR 등 저장소 밖 자산 가능성)
- `GET /api/hometown/star/:starId`, `GET /api/hometown/partner-stars` 응답이 프론트 어느 컴포넌트에서 정확히 렌더링되는지

## 10. Not Present Findings

- `services/` 내 "workshop", "unlock"이라는 이름의 서비스 모듈
- sowon-dreamtown의 별공방/고향/약속/재방문 관련 git 이력(이번 세션 기록 제외)
- 카페/식당/관광지가 실제로 hometown_qr_code를 발급받은 사례(데이터 0건, RN-OPS-005 재확인)

## 11. 미확인 영역 (추가 조사 필요)

- `star-unlock.html`/`star-entry.html`이 실제로 언제, 어떻게 사용자에게
  전달되었는지(저장소 밖 자산 확인 필요 — 이번 조사 범위 밖)
- reminderService 링크 불일치가 실제 운영에서 보고된 적 있는지(Slack/이슈
  트래커 등 저장소 밖 자료 필요)
- partnerEvalService 점수의 최종 소비처

## 12. 하지 않은 것

코드 수정 없음, DB 변경 없음, Migration 실행 없음, Feature/Architecture
제안 없음, SSOT/Candidate 생성 없음, 기존 RN 문서 수정 없음, merge/push
없음.
