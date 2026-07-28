# CAND-ARCH-001 · DreamTown Read API Design Principles

---

## Metadata

- **File Name:** `CAND-ARCH-001_Read_API_Design_Principles.md`
- **Category:** Framework / Architecture
- **Importance:** Level 4
- **Status:** Candidate
- **Promotion State:** Idea (`GOV-001_Governance_Lifecycle.md` 기준 — free to revise, no RFC required yet)
- **Validation Stage:** Code Evidence (DT-MVP-001 구현으로 검증 — 2026-07-28)
- **Project:** DreamTown · Project Phoenix
- **Creator:** Project Phoenix
- **Governance:** Candidate → Review → Approved → LOCKED
- **Promotion Target:** Backend SSOT / API Design Guide / Dashboard SSOT
- **Origin:** DT-MVP-001 My Star Read API 구현 세션 (2026-07-28)
- **Related:** `CAND-DOM-001_DreamTown_Domain_Model_Audit.md`, `SSOT-ROUTE-001_DreamTown_Route_Manifesto.md`

---

## Purpose

DreamTown의 조회(Read) API는 단순 CRUD가 아니라, 사용자 경험을 위한 **View Model API**로 설계하는 원칙을 정의한다.

Ownership 시스템 완성 이후 Read 계층을 어떻게 설계해야 하는지에 대한 기준을 제공하여, 향후 Dashboard·Timeline·Mobile App 구현 시 일관된 API 설계를 보장한다.

---

## Background

Ownership 시스템이 완성된 이후 Dashboard 구현을 준비하면서, 프론트엔드가 여러 API를 조합하는 대신 하나의 조회 API를 통해 필요한 데이터를 받을 수 있도록 `GET /api/dt/me/star`를 설계하였다.

구현 과정에서 다음 원칙이 확인되었다.

- Ownership과 Read는 분리한다.
- Dashboard가 필요로 하는 최소 데이터를 한 번에 제공한다.
- 실제 Schema를 기준으로 응답을 설계한다.
- 민감한 내부 필드는 절대 노출하지 않는다.
- MVP 단계에서는 과도한 집계를 추가하지 않는다.

---

## Core Definition

**Read API는 테이블을 그대로 노출하는 API가 아니라, 화면(View)이 필요로 하는 데이터를 한 번에 제공하는 계약(API Contract)이다.**

DB 구조가 아닌 View 구조를 기준으로 응답을 설계한다.

---

## Principles

### 1. View 기준으로 응답을 설계한다

DB 테이블 구조를 그대로 반환하지 않는다. 화면에서 필요한 최소 정보를 제공한다.

### 2. Ownership Resolution을 먼저 수행한다

조회 대상 결정 순서:

```
Login User
↓
Guest Token
↓
Unauthorized
```

클라이언트가 Star ID를 직접 지정하지 않는다. Identity에서 시작해 소유한 데이터만 조회한다.

### 3. Summary를 함께 반환한다

Dashboard에서 필요한 Count는 별도 API 호출이 아니라 동일 응답에 포함한다.

예: `wishesCount`, `journalsCount`, `connectionsCount`, `nanumCount`

### 4. 실제 Schema를 따른다

존재하지 않는 필드를 응답에 추가하지 않는다.

| 필드 | Schema 사실 | 처리 |
|---|---|---|
| `updatedAt` | DtStar에 없음 | 반환 안 함 |
| `dayCount` | 존재하나 MVP 제외 | 반환 안 함 |
| `starStage` | 존재하나 MVP 제외 | 반환 안 함 |

### 5. 내부 구현을 숨긴다

다음은 응답 금지:
- `tokenHash`
- `guestIdentityId`
- `claimedUserId`
- `userId`
- 내부 Ownership 상태, Guard reason codes

Read API는 내부 구현이 아니라 사용자 데이터를 제공한다.

### 6. N+1을 만들지 않는다

가능하면 `_count`, `include`, 단일 Query를 사용한다. 필요 이상의 DB 호출을 만들지 않는다.

---

## Applications

- Dashboard
- Profile
- Timeline
- Mobile App
- Widget
- Home Screen

---

## Example

**Good Example — View Model API**

```text
GET /api/dt/me/star

→ {
    star: { id, name, createdAt },
    summary: { wishesCount, journalsCount, connectionsCount, nanumCount }
  }
```

Dashboard가 추가 API 없이 바로 렌더링 가능하다.

**Bad Example — Fragmented API**

```text
GET /star
GET /wish/count
GET /journal/count
GET /connection/count
GET /nanum/count
```

프론트가 데이터를 조립해야 한다. 5번의 왕복 발생.

---

## Promotion Target

- `SSOT-ENG-002_DreamTown_API_Design.md` (신규 제안)
- 또는 `CAND-DOM-001` → `SSOT-ENG-001_DreamTown_Domain_Model.md` §API 섹션에 통합

---

## Origin

- **Date:** 2026-07-28
- **Topic:** DT-MVP-001 My Star Read API
- **Creator:** Project Phoenix
- **Evidence:** `src/app/api/dt/me/star/route.ts` 구현, 테스트 결과 57 Pass / 1 Skip

---

## Project Impact

**96 / 100**

이번 세션으로 DreamTown MVP의 CRUD 균형이 완성되었다.

```text
Create        ✅
Read          ✅ (DT-MVP-001)
Update        ✅
Ownership     ✅
Verification  ✅
```

이 기반 위에서 Dashboard · Timeline · Star Growth와 같은 사용자 경험을 구축하는 단계로 전환할 수 있다.

---

## Knowledge Value

⭐⭐⭐⭐⭐

## Claude Code Action

- 신규 Read API는 화면(View) 중심으로 설계한다.
- Dashboard용 Count는 가능한 한 동일 응답에 포함한다.
- Schema와 응답 계약을 혼동하지 않는다.
- 내부 식별자와 Ownership 정보는 외부로 노출하지 않는다.
- Identity에서 시작해 소유한 데이터만 조회한다. 클라이언트 제공 ID를 신뢰하지 않는다.
