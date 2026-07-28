# CAND-KW-001 · K-Wisdom Governance

---

## Metadata

- **File Name:** `CAND-KW-001_K-Wisdom_Governance.md`
- **Category:** Framework / Knowledge
- **Importance:** Level 4
- **Status:** Candidate
- **Promotion State:** Idea (`GOV-001_Governance_Lifecycle.md` 기준 — free to revise, no RFC required yet)
- **Validation Stage:** Concept (철학 수준에서 확립됨 — 미구현)
- **Project:** DreamTown · Project Phoenix
- **Creator:** Project Phoenix
- **Governance:** Candidate → Review → Approved → LOCKED
- **Promotion Target:** Knowledge Governance SSOT / K-Wisdom Constitution / DreamTown Knowledge Operating System
- **Origin:** DreamTown 지식 운영 체계 설계 세션 (2026-07-28)
- **Related:** `CAND-OPS-001_Knowledge_Operating_System.md`, `CAND-OPS-002_Candidate_Index_Strategy.md`, `CAND-OPS-003_Knowledge_Capture_Report_Standard.md`

---

## Purpose

K-Wisdom이 단순한 명언집이나 사례집이 아니라, 공동체의 경험을 반복적으로 검증하고 가공하여 후대의 운영자도 같은 기준으로 새로운 지혜를 계속 만들어 갈 수 있는 운영 체계로 남을 수 있도록 그 거버넌스 원칙을 정의한다.

---

## Background

Project Phoenix는 YAKB Knowledge Operating System을 통해 아이디어가 Candidate → Draft → Review → Approved → LOCKED 과정을 거쳐 영구 자산이 되는 거버넌스를 운영하고 있다.

K-Wisdom은 이 거버넌스 위에서 특별히 "지혜(Wisdom)"를 다루는 계층이다.

경험(Experience)은 원재료다. 그 경험을 공동체가 반복 검증하고 가공한 결과가 지혜(Wisdom)이며, 이것이 SSOT에 등재된다.

---

## Core Definition

**K-Wisdom은 개인 경험의 집합이 아니라, 공동체의 경험을 반복적으로 검증·가공하여 재현 가능한 지식 자산으로 승격한 결과이다.**

```
Experience (개인의 자산)
    │
    ▼
Insight (반복되는 패턴)
    │
    ▼
반복 검증(Review) + 가공(Refinement)
    │
    ▼
Wisdom (검증·가공을 거친 공동체의 자산)
    │
    ▼
실제 적용(Application)
    │
    ▼
피드백(Feedback)
    │
    ▼ (루프)
Wisdom 개선
```

---

## Principles

### 1. Experience는 개인의 자산이다

경험은 개인에게 속한다. 이것을 그대로 보존하면 아카이브이지, 지식 자산이 아니다.

### 2. Insight는 반복되는 패턴이다

여러 개인의 경험에서 반복적으로 나타나는 패턴이 Insight이다. 아직 검증 전이므로 공동체의 자산은 아니다.

### 3. Wisdom은 검증과 가공을 거친 공동체의 자산이다

Insight가 검증(Review)과 가공(Refinement)을 거쳐야 비로소 Wisdom이 된다. 개인 경험의 집합이 아니라 공동체가 함께 만든 재현 가능한 지식 자산이다.

### 4. 모든 Wisdom은 생성 과정과 근거를 추적할 수 있어야 한다

결론만 남기면 명언집이 된다. 어떤 경험에서 나왔는지, 어떤 검증을 거쳤는지까지 기록해야 K-Wisdom이다.

### 5. Wisdom은 Route뿐 아니라 DreamTown 생태계 전체에서 축적된다

Nanum, Connection, Visit, Daily Life 등 DreamTown의 모든 활동 영역에서 Wisdom이 발생할 수 있다. 특정 기능에 종속되지 않는다.

### 6. Wisdom은 실제 운영과 콘텐츠에 적용되고, 다시 피드백을 통해 발전한다

SSOT에 등재된 이후에도 Wisdom은 살아있다. LOCKED 상태도 RFC 과정을 통해 개선될 수 있다. K-Wisdom의 최종 목적은 복사(Copy)가 아니라 생성(Generation)이다.

---

## K-Wisdom vs 유사 개념 비교

| 개념 | 정의 | K-Wisdom과의 차이 |
|---|---|---|
| 명언집 | 개인의 통찰을 수집 | 검증·가공 과정 없음. 재현 불가 |
| 사례집 | 과거 사례를 보존 | 경험 보존에 집중. 지혜 추출 안 함 |
| 베스트 프랙티스 | 성공 패턴 정리 | 맥락·실패 포함 안 함. 표면적 결론만 |
| K-Wisdom | 공동체가 검증·가공한 재현 가능한 지식 자산 | 출처 추적 + 검증 과정 + 피드백 루프 포함 |

---

## Applications

- YAKB Knowledge Operating System의 Wisdom 계층 설계
- DreamTown 운영 원칙 문서화
- 파트너 운영 가이드
- 신규 운영자 온보딩 기준
- Project Phoenix 지식 자산 거버넌스

---

## Example

**Good Example — K-Wisdom으로 기록**

```text
원칙: "Claim은 반드시 사용자 선택으로 수행한다."

출처: OWN-008 Claim API 구현 과정에서 로그인 자동 Claim 방식을 검토했으나,
      사용자 의도와 무관하게 데이터가 이전되는 문제 발생.

검증: OWN-009 Claim UX 구현, OWN-010 Integration Test 44 Pass로 확인.

적용: 모든 Claim 관련 API는 사용자 명시적 선택 없이 Claim 실행 금지.

피드백 루프: 향후 자동 Claim 요구사항 발생 시 이 원칙을 기준으로 재검토.
```

**Bad Example — 사례집 수준으로 기록**

```text
"로그인 자동 Claim은 하지 말 것."
```

맥락·검증·피드백 루프 없음. 이유를 모르면 같은 실수 반복.

---

## Promotion Target

- **1순위:** Knowledge Governance SSOT (신규)
- **2순위:** K-Wisdom SSOT (신규 독립 제안)
- **3순위:** DreamTown Constitution
- **4순위:** DreamTown Knowledge Operating System (`CAND-OPS-001` → `SSOT-KNOWLEDGE-004` 통합 시 §Wisdom 계층으로 반영)

---

## Origin

- **Date:** 2026-07-28
- **Topic:** DreamTown Knowledge Operating System — K-Wisdom 거버넌스 계층 설계
- **Creator:** Project Phoenix
- **Evidence:** YAKB 거버넌스 운영 경험 (CAND-OPS-001~003, GOV-001, OWN-001~010 사이클)

---

## Project Impact

**100 / 100**

K-Wisdom이 명언집이 아니라 후대의 운영자가 같은 기준으로 새로운 지혜를 만들 수 있는 운영 체계가 된다.

YAKB Knowledge Operating System의 완성도를 결정하는 핵심 레이어.

---

## Knowledge Value

⭐⭐⭐⭐⭐

---

## Claude Code Action

- K-Wisdom 항목 생성 시 출처(Experience)와 검증 과정(Review)을 반드시 포함한다.
- "결론만" 기록하면 K-Wisdom이 아니다. 과정까지 포함해야 한다.
- LOCKED 상태 K-Wisdom도 RFC 과정을 통해 개선 가능하다 — 영구 동결이 아님.
- 운영자가 결과를 암기하는 것이 아니라 원칙으로 새 지혜를 만들 수 있는지를 기준으로 K-Wisdom 품질을 평가한다.
