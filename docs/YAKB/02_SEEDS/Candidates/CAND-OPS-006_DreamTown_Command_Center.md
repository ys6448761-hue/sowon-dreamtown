# CAND-OPS-006 · DreamTown Command Center

---

## Metadata

- **File Name:** `CAND-OPS-006_DreamTown_Command_Center.md`
- **Category:** Operations / Architecture
- **Importance:** Level 4
- **Status:** Candidate
- **Promotion State:** Idea (`GOV-001_Governance_Lifecycle.md` 기준 — free to revise, no RFC required yet)
- **Validation Stage:** Concept (아직 미구현 — 운영 철학 수준에서 확립됨)
- **Project:** DreamTown · Project Phoenix
- **Creator:** Project Phoenix
- **Governance:** Candidate → Review → Approved → LOCKED
- **Promotion Target:** `SSOT-OPS-001_DreamTown_Operations_Architecture.md` (신규 제안)
- **Origin:** DreamTown 운영 아키텍처 설계 세션 (2026-07-28)
- **Related:** `CAND-DOM-001_DreamTown_Domain_Model_Audit.md`, `CAND-ARCH-001_Read_API_Design_Principles.md`, `CAND-OPS-005_Ownership_Implementation_Lifecycle.md`

> **⚠️ ID 충돌 방지 메모:** CAND-OPS-005는 `CAND-OPS-005_Ownership_Implementation_Lifecycle.md`(브랜치
> `feature/checkin-mvp`)가 이미 사용 중이다. 이 문서는 CAND-OPS-006으로 할당한다.

---

## Purpose

DreamTown은 단순한 사용자 앱이 아니라 운영(Operation) 플랫폼이다.

소원이(사용자)는 하루에 한 번 들어오지만, 운영자는 매일 시스템을 본다. 이 비대칭성을 반영하여 DreamTown의 화면 아키텍처는 세 축으로 설계되어야 한다.

① 소원이 Dashboard (개인 경험) → ② 관리자 Command Center (운영 전체) → ③ Partner Dashboard (권한별 집계)

이 Candidate는 그 설계 원칙과 관리자 Command Center의 운영 지표 체계를 정의한다.

---

## Background

Ownership 시스템(OWN-001~010)과 Read API(DT-MVP-001) 완성 이후, 다음 단계는 운영자가 전체 DreamTown을 관리하는 화면이다.

이 화면 없이는 DreamTown이 운영 가능한 플랫폼이 아니라 단순한 앱에 머문다.

설계 과정에서 일반 서비스 지표(DAU, MAU, 매출, 전환율)가 아닌 DreamTown 고유의 운영 지표 — 감정 항로(Route) 진행률 — 가 핵심임이 확인되었다.

---

## Core Definition

**DreamTown의 운영 중심은 관리자 Command Center이며, 모든 소원이 활동은 운영 지표로 축적되고, 그중 권한에 맞는 집계 결과만 파트너에게 제공된다.**

데이터는 하나의 원본(DreamTown DB)에서 발생하고, 역할에 따라 다른 View로 제공된다.

```
소원이
  │
  ▼
DreamTown DB
  │
  ├─────────────────────┐
  ▼                     ▼
관리자 Command Center   Partner Dashboard
(전체 데이터)           (권한별 집계만)
```

---

## 3-Dashboard Architecture

### ① 소원이 Dashboard — "나"

개인 경험 화면. 소원이가 자신의 별과 여정을 확인한다.

| 섹션 | 내용 |
|---|---|
| 내 별 | Star 상태, 이름, 생성일 |
| 체크인 | 오늘의 체크인 기록 |
| 소원 | Wish 목록 |
| 연결 | Connection 현황 |
| 나눔 | Nanum 기록 |
| 회복 여정 | Route 진행 상태 |

### ② 관리자 Command Center — "전체"

운영 전체 화면. 운영자가 하루를 시작할 때 가장 먼저 보는 화면.

**"오늘 DreamTown이 건강한가?"** 를 한눈에 파악한다.

| 지표 | 설명 |
|---|---|
| 오늘 신규 소원이 | 당일 Star 신규 생성 수 |
| 오늘 Check-in | 당일 체크인 수 |
| 오늘 Claim | Guest → 회원 전환 수 |
| Guest → Login 전환율 | Claim / (Guest + 회원) |
| 활성 Star | 최근 7일 이내 활동 Star 수 |
| Wish / Journal / Connection / Nanum | 오늘 각 활동 수 |
| Route 진행률 | 감정 항로 단계별 완주율 |
| 오류 발생 | API 오류 수, 종류 |
| API 상태 | 주요 Endpoint 응답 상태 |
| Partner 참여 현황 | 파트너별 연결 활동 요약 |

**실시간 Command Center 화면 예시:**

```
DreamTown Command Center
──────────────────────────
현재 온라인      127명
오늘 체크인       84
오늘 소원         65
오늘 연결         18
오늘 나눔          9
Guest            73
회원             54
Claim            21
Route 완료율     68%
──────────────────────────
최근 Activity
✔ Star 생성
✔ Connection
✔ Nanum
✔ Partner Program
✔ Error
──────────────────────────
Partner Health
호텔 A   🟢
호텔 B   🟡
카페 C   🟢
```

### ③ Partner Dashboard — "우리 호텔"

파트너가 자신에게 허용된 집계 데이터만 확인하는 화면.

| 섹션 | 내용 |
|---|---|
| 우리 호텔 이용자 | 해당 파트너와 연결된 소원이 수 |
| 체크인 | 파트너 공간 내 체크인 수 |
| Route 완료율 | 파트너 연계 Route 완주율 |
| 프로그램 참여 | 파트너 프로그램 참여 현황 |
| 공개 후기 | 소원이가 공개 허용한 후기 |
| 재방문 | 재방문 소원이 수 |

---

## Principles

### 1. 소원이 Dashboard는 개인 경험을 위한 화면이다

소원이는 자신의 여정만 본다. 타인의 데이터나 운영 지표는 보이지 않는다.

### 2. 관리자 Command Center는 전체 운영 상태를 실시간으로 관리하는 화면이다

운영자는 DreamTown 전체를 본다. 이 화면이 없으면 운영은 불가능하다. 소원이 Dashboard보다 먼저 설계되어야 하는 이유이기도 하다.

### 3. Partner Dashboard는 권한이 있는 집계 데이터만 제공한다

파트너는 자신과 연결된 소원이의 집계 결과만 확인할 수 있다. 개인 식별 정보는 제공하지 않는다.

### 4. 모든 운영 데이터는 하나의 데이터 원본(DB)에서 파생되며, 권한에 따라 다른 View를 제공한다

View가 달라도 데이터 원본은 하나다. 중복 저장하지 않는다.

### 5. DreamTown의 핵심 운영 지표는 매출이 아니라 감정 항로(Route)의 진행과 회복 경험의 품질이다

일반 서비스 지표(DAU, MAU, 매출, 전환율)가 아니라 감정 항로 자체를 운영 지표로 삼는다.

---

## DreamTown 고유 운영 지표 — 감정 항로 퍼널

DreamTown만의 독창성. 단순 관광 데이터가 아닌 감정 회복 항로의 완주율.

```
오늘 도착    120명
    ↓
호흡        118명
    ↓
연결        103명
    ↓
상승         88명
    ↓
쉼           81명
    ↓
소원         72명
    ↓
안식         70명
```

이 퍼널은 각 단계에서 얼마나 많은 소원이가 이탈했는지, 어느 단계가 회복에 가장 효과적인지를 운영자가 파악할 수 있게 한다.

---

## Applications

- 관리자 Command Center 설계
- Partner Dashboard 권한 모델
- DreamTown 운영 지표 정의
- Route 퍼널 분석
- 신규 파트너 온보딩 데이터 패키지
- DreamTown 헬스체크 자동화

---

## Example

**Good Example — 감정 항로 기반 운영**

```text
오늘 "상승" 단계 이탈률이 15%로 평소보다 높다.
→ 운영자가 해당 시간대 콘텐츠를 점검한다.
→ Partner B의 프로그램 참여율이 낮다는 것을 확인한다.
→ Partner B에게 운영 피드백을 전달한다.
```

**Bad Example — 일반 서비스 지표로 운영**

```text
DAU 127, MAU 2,340, 전환율 16.5%
```

DreamTown의 회복 경험 품질이 이 숫자 안에 보이지 않는다.

---

## Promotion Target

- `SSOT-OPS-001_DreamTown_Operations_Architecture.md` (신규 제안)
- 또는 기존 SSOT에 §Operations 섹션으로 통합

---

## Origin

- **Date:** 2026-07-28
- **Topic:** DreamTown 3-Dashboard 운영 아키텍처 설계
- **Creator:** Project Phoenix
- **Evidence:** 운영 철학 수준 확립 (미구현, 설계 단계)

---

## Project Impact

**100 / 100**

소원이 Dashboard, 관리자 Command Center, Partner Dashboard를 하나의 운영 아키텍처로 연결하는 기준이 된다.

DreamTown이 앱이 아닌 운영 플랫폼임을 명시하는 첫 번째 Candidate.

---

## Knowledge Value

⭐⭐⭐⭐⭐

---

## Claude Code Action

- 관리자 화면 설계 시 이 Candidate의 3-Dashboard 아키텍처를 기준으로 삼는다.
- 운영 지표는 일반 서비스 지표(DAU/MAU)가 아니라 감정 항로 퍼널로 설계한다.
- Partner에게 제공하는 데이터는 반드시 집계(Aggregate)만 제공한다. 개인 식별 정보 포함 금지.
- Command Center API는 Read API 원칙(`CAND-ARCH-001`)을 따른다.
