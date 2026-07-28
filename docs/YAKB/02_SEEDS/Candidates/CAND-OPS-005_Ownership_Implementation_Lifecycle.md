# CAND-OPS-005 · Ownership Implementation Lifecycle

---

## Metadata

- **File Name:** `CAND-OPS-005_Ownership_Implementation_Lifecycle.md`
- **Category:** Operations
- **Importance:** Level 4
- **Status:** Candidate
- **Promotion State:** Idea (`GOV-001_Governance_Lifecycle.md` 기준 — free to revise, no RFC required yet)
- **Validation Stage:** Code Evidence (DreamTown OWN-001~OWN-010 완료 — 2026-07-27)
- **Project:** DreamTown · Project Phoenix
- **Creator:** Project Phoenix
- **Governance:** Candidate → Review → Approved → LOCKED
- **Promotion Target:** Operations SSOT / Backend Architecture SSOT / QA · Verification SSOT
- **Origin:** DreamTown Check-in MVP Ownership 완성 세션 (2026-07-27)
- **Related:** `CAND-DOM-001_DreamTown_Domain_Model_Audit.md`, `CAND-ARCH-001_Read_API_Design_Principles.md`

> **⚠️ ID 충돌 방지 메모:** CAND-OPS-004는 `CAND-OPS-004_Reunion_Operations.md`(브랜치
> `docs/cand-ops-004-reunion-operations`)가 이미 사용 중이다. 이 문서는 CAND-OPS-005로
> 할당한다.

---

## Purpose

Guest 기반 서비스를 운영할 때 Ownership 기능을 어떤 순서와 기준으로 구축하고 검증해야 하는지를 표준화한다.

Ownership은 일회성 기능이 아니라, Schema → Guard → Claim → UX → Integration Test까지 이어지는 하나의 운영 라이프사이클이다. 이 라이프사이클을 표준화함으로써 신규 Guest 기반 서비스에서 동일한 품질로 Ownership을 구현할 수 있도록 한다.

---

## Background

DreamTown Check-in MVP 구현 과정에서 Guest Token 기반 Ownership 시스템을 단계적으로 구축하였다.

구현 과정에서 다음과 같은 운영 원칙이 확립되었다.

- Schema를 먼저 고정
- Token 발급
- Ownership Guard 구축
- Write 보호
- Claim API 구현
- Atomic Claim 보강
- Claim UX 연결
- End-to-End Integration Test 수행

---

## Core Definition

**Ownership은 기능 하나가 아니라, Schema → Guard → Claim → UX → Integration Test까지 포함하는 하나의 운영 라이프사이클이다.**

각 단계는 앞 단계가 완료된 이후에 시작하며, Integration Test가 통과해야 라이프사이클이 종료된다.

---

## Principles

### 1. 도메인을 먼저 고정한다

Schema와 Ownership 규칙을 먼저 정의한다. 구현 도중 Schema를 변경하지 않는다.

### 2. Write보다 Ownership을 먼저 보호한다

모든 Write API는 동일한 Ownership Guard를 사용한다. API마다 다른 Ownership 로직을 구현하지 않는다.

### 3. Claim은 반드시 사용자 선택으로 수행한다

로그인 자체가 Claim을 의미하지 않는다. 사용자가 명시적으로 선택한 시점에만 Claim을 실행한다.

### 4. Claim은 Atomic해야 한다

DB 조건부 업데이트(`WHERE claimedUserId IS NULL AND expiresAt > now`)를 통해 동시에 하나의 요청만 성공해야 한다. 사전 조회 후 업데이트 방식은 Race Condition을 만든다.

### 5. 구현 완료의 기준은 통합 테스트다

기능 구현만으로 완료하지 않는다. E2E 수준에서 전체 흐름을 검증한 후에 완료로 처리한다.

---

## Implementation Lifecycle

```
OWN-001  Schema 고정
   ↓
OWN-002  Token 발급 + HttpOnly Cookie
   ↓
OWN-003  Guest Identity 연결
   ↓
OWN-004  Ownership Guard 구축 (verifyStarOwnership)
   ↓
OWN-005  Write API 보호 적용
   ↓
OWN-006  Reference Integrity (연결 대상 존재 확인)
   ↓
OWN-007  나머지 Write API 보호 (Nanum / Connection / Acknowledge)
   ↓
OWN-007A API Contract 정리 (fromStarId Body 필수화)
   ↓
OWN-008  Claim API 구현 (POST /api/dt/claim)
   ↓
OWN-008A Atomic Claim 보강 (조건부 UPDATE, Race Condition 차단)
   ↓
OWN-009  Claim UX 연결 (ClaimModal + SessionProvider)
   ↓
OWN-010  Integration Test (E2E 전체 흐름 검증)
```

---

## Evidence

이번 세션에서 다음이 완료되었다.

- Ownership 구현 완료 (OWN-001 ~ OWN-009)
- Atomic Claim 보강 (OWN-008A)
- Claim UX 구현 (OWN-009)
- Integration Test 45개 작성 (OWN-010)
- **결과: 44 Pass / 1 Skip**

Skip 1건: Scenario 6 (Atomic Claim 동시성) — PostgreSQL 행 수준 잠금에 의존하는 동시성 검증. 실제 DB가 있을 때만 실행하도록 `it.skipIf(!process.env.TEST_DATABASE_URL)`로 분리하였다. Mock만으로 Atomicity를 검증했다고 보고하지 않는다는 원칙을 지켰다.

---

## Applications

- Guest 기반 서비스
- 익명 사용자 → 회원 전환 플로우
- Token Ownership 설계
- Claim Workflow
- Backend 운영 표준
- QA Checklist
- 신규 프로젝트 Starter Template

---

## Example

**Good Example**

```text
기능 구현 후 Race Condition까지 보완한다.
UX와 Backend 책임을 분리한다.
실제 통합 테스트를 완료 기준으로 삼는다.
```

**Bad Example**

```text
로그인 시 자동 Claim
Write API마다 다른 Ownership 로직 사용
Mock만으로 Atomicity를 검증했다고 판단
기능 구현 후 통합 검증 없이 완료 처리
```

---

## Promotion Target

- Operations SSOT
- Backend Architecture SSOT
- QA / Verification SSOT

---

## Origin

- **Date:** 2026-07-27
- **Topic:** DreamTown Ownership System Completion (OWN-001 ~ OWN-010)
- **Creator:** Project Phoenix
- **Evidence:** `src/app/api/dt/claim/route.ts`, `src/components/dreamtown/ClaimModal.tsx`, `src/__tests__/dt-ownership/ownership.test.ts` (44 Pass / 1 Skip)

---

## Project Impact

**98 / 100**

---

## Knowledge Value

⭐⭐⭐⭐⭐

---

## Claude Code Action

- Ownership 관련 신규 기능은 본 Lifecycle을 기본 순서로 따른다.
- Ownership 변경 시 Integration Test 갱신 여부를 함께 검토한다.
- Atomicity가 필요한 기능은 조건부 UPDATE 또는 동등한 원자적 메커니즘을 우선 검토한다.
- Claim은 사용자 선택으로만 실행한다. 로그인 자동 Claim 금지.
- Mock만으로 동시성을 검증했다고 보고하지 않는다.
