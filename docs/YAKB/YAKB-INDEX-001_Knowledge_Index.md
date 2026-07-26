# YAKB-INDEX-001: Knowledge Index

---

**목적:** YAKB(Yeosu AI Knowledge Base / Project Phoenix Knowledge Base)의 공식 탐색 지도(Navigation Map). 사람과 AI가 어떤 문서를 어떤 순서로 참조해야 하는지 정의하는 진입점이다.
**최상위 Authority:** `docs/YAKB/00_ARCHITECTURE/Architecture_Constitution.md` (SSA — Foundation)
**Status:** Approved
**버전:** 1.0
**확정일:** 2026-07-04
**변경 절차:** 신규 Manifesto/Core Principles/Constitution/SSOT/RFC 문서가 생성될 때마다 본 Index를 함께 갱신한다(8절 참조, 자동 갱신 원칙). Reading Order·AI Reading Policy·Dependency Rule 자체를 바꾸는 것은 RFC 대상이다.
**관계:** `docs/YAKB/Project_Blueprint.md`가 8계층 구조를 한 장으로 압축한 개요라면, 이 문서는 **그 안에서 실제로 어떤 문서를 어떤 순서로 읽어야 하는지**를 안내하는 상세 내비게이션이다. 두 문서는 서로 대체하지 않는다.

> This Index is governed by CORE-PRINCIPLES-001.

---

## 1. Purpose

YAKB Index는 Project Phoenix의 모든 지식 자산을 연결하는 공식 진입점이다.

새로운 구성원, AI, 개발자, 디자이너는 본 문서를 가장 먼저 참조한다.

---

## 2. Knowledge Hierarchy

```
Manifesto
    │
    ▼
Core Principles
    │
    ▼
Constitution
    │
    ▼
Project Blueprint
    │
    ▼
SSOT
    │
    ▼
RFC
    │
    ▼
Task
    │
    ▼
Implementation
    │
    ▼
Service
```

---

## 3. Reading Order

### Level 1 — Philosophy

- Manifesto
- Core Principles

목적: 왜 Project Phoenix가 존재하는지 이해한다.

**실제 문서**: `docs/YAKB/00_MANIFESTO/MANIFESTO-001_Invisible_Value_Manifesto.md`, `docs/YAKB/00_MANIFESTO/CORE-PRINCIPLES-001.md` (둘 다 존재)

### Level 2 — Governance

- Project Blueprint
- Architecture Constitution
- Language Constitution

목적: 프로젝트 운영 원칙과 문서 구조를 이해한다.

**실제 문서**: `docs/YAKB/Project_Blueprint.md`, `docs/YAKB/00_ARCHITECTURE/Architecture_Constitution.md`, `docs/YAKB/99_SSOT/SSOT-LANG-001_Project_Phoenix_Language_Constitution.md` (모두 존재). Journey Constitution(`SSOT-JOURNEY-001`)과 OS Constitution(`SSOT-OS-001`)도 같은 레벨에 속하나 원 지시서 예시에는 없었다 — 실제로는 이 둘도 Level 2에 포함해야 완전하다(6절 Navigation Table 참조).

### Level 3 — Standards

대표 SSOT

- Growth
- Language
- Journey
- Character
- Image
- Animation
- Video Pipeline
- Location
- Route

목적: 실행 표준을 이해한다.

**실제 구축 상태** (2026-07-15 갱신, 임의로 지어내지 않고 실측대로 표기 —
Route 행은 `SSOT-ROUTE-001` 승격에 맞춰 2026-07-15에 갱신, 나머지는
2026-07-04 기준 유지):

| SSOT | 상태 |
|------|------|
| Growth | ✅ 존재 — `SSOT-GROWTH-001_Growth_Architecture.md` |
| Language | ✅ 존재 — `SSOT-LANG-001/002` |
| Journey | ✅ 존재 — `SSOT-JOURNEY-001`(Constitution 겸 SSOT 성격) |
| Character | ⚠ 다른 저장소에 존재, YAKB 체계 미편입 — `daily-miracles-mvp/docs/ssot/core/SSOT-CHAR-001_Sowoni_Character_Bible.md` |
| Image | ⏳ 미작성 (`SSOT-KNOWLEDGE-002` 9절에서 이미 예고됨) |
| Animation | ⏳ 미작성 |
| Video Pipeline | ⏳ 미작성 |
| Location | ⏳ 미작성 (`ORIGIN-xxx.md` Seed 문서가 부분적으로 대신함) |
| Route | ✅ 존재 — `SSOT-ROUTE-001_DreamTown_Route_Manifesto.md` (v1.0, 2026-07-15 승격, Origin: `CAND-ROUTE-001`) |
| Trust | ✅ 존재 — `SSOT-TRUST-001_Trust_Framework.md` (v1.0.0, 2026-07-26 등재, Origin: `ProjectPhoenix/Framework/TRUST-FRAMEWORK.md`, `RFC-TRUST-001`(Approved Candidate 결정)/`RFC-TRUST-002`(Implementation) 경유) |

### Level 4 — Change Management

- RFC
- Migration List

목적: 변경 절차와 변경 이력을 확인한다.

**실제 문서**: `docs/YAKB/99_SSOT/RFC/`(다수 RFC 존재), `SSOT-LANG-002_Language_Migration_List.md`. RFC가 언제 필요한지, 문서가 어떤 State(Idea~Archived)를 거치는지의 **운영 규칙 자체**는 `docs/YAKB/Governance/GOV-001_Governance_Lifecycle.md`(2026-07-04 신설)를 따른다.

### Level 5 — Execution

- Task
- Prompt
- Code
- Design
- Manufacturing

목적: 실제 구현을 수행한다.

**실제 상태**: Task는 세션별 지시서로 발생·소멸하며 YAKB 문서 체계에 영구 보존되지 않는다(`Project_Blueprint.md` 참조). Prompt/Code/Design/Manufacturing은 YAKB 바깥의 각 코드 저장소(`daily-miracles-mvp`, `sowon-dreamtown`, `dreamtown-wishart` 등)에 존재한다.

### Level 6 — Services

현재 서비스

- DreamTown

향후 예정

- Aurora
- Aurum
- Future Products

**실제 상태**: DreamTown은 `daily-miracles-mvp`가 `app.dailymiracles.kr`로 실서비스 중(`Aurora_Aurum_Audit.md` 참조). Aurora/Aurum(밤 9시 체크인 등)은 설계는 있으나 코드 구현은 없음(`Aurora_Aurum_Audit.md` 결론).

---

## 4. AI Reading Policy

AI는 다음 순서를 우선적으로 따른다.

1. Manifesto
2. Core Principles
3. Constitution
4. Project Blueprint
5. 관련 SSOT
6. RFC
7. Task
8. Implementation

AI는 Implementation보다 SSOT를 우선한다.

SSOT보다 Constitution을 우선한다.

Constitution보다 Core Principles를 우선한다.

---

## 5. Dependency Rule

각 문서는 상위 계층을 참조할 수 있다.

하위 계층은 상위 계층을 변경할 수 없다.

예시

- SSOT는 Constitution을 참조할 수 있다.
- Task는 SSOT를 참조할 수 있다.
- Implementation은 Task를 참조할 수 있다.
- Service는 모든 상위 계층을 따른다.

> 이 규칙은 이번 세션 전체에서 실제로 지켜온 관행("수정 금지 대상은 Review만 작성, LOCKED 용어는 RFC로만 변경")을 명문화한 것이다 — 새 원칙이 아니라 이미 실천 중이던 규칙의 선언이다.

---

## 6. Navigation Table

| 문서 유형 | 역할 | 대표 문서 | 실제 상태 |
|---|---|---|---|
| Manifesto | 존재 이유 | `MANIFESTO-001` | ✅ 존재 |
| Core Principles | 불변 원칙 | `CORE-PRINCIPLES-001` | ✅ 존재(LOCKED) |
| Constitution | 운영 원칙 | Architecture / Language / Journey / OS | ✅ 4편 존재, Knowledge는 3편 분담, Experience/Product/AI는 미작성 |
| Blueprint | 전체 구조 | `Project_Blueprint.md` | ✅ 존재 |
| SSOT | 실행 표준 | Growth, Language, Knowledge, Route, Trust 등 | ⚠ 일부만 존재(3절 표 참조) — Route는 2026-07-15 `SSOT-ROUTE-001` 승격, Trust는 2026-07-26 `SSOT-TRUST-001` 등재로 각각 신규 추가 |
| RFC | 변경 관리 | `RFC-*` | ✅ 다수 존재(`docs/YAKB/99_SSOT/RFC/`) |
| Task | 실행 계획 | `TASK-*` | 세션별, 비영구 |
| Implementation | 구현 | Code / Prompt / Design | YAKB 문서 체계 밖(각 코드 저장소) |
| Service | 사용자 가치 | DreamTown | ✅ DreamTown 실서비스 중, Aurora/Aurum은 설계 단계 |

---

## 7. Completion Criteria

- [x] YAKB 공식 Index 생성
- [x] 문서 계층 시각화(2절)
- [x] 읽기 순서 정의(3절)
- [x] AI Reading Policy 정의(4절)
- [x] Dependency Rule 정의(5절)
- [x] Navigation Table 작성(6절)
- [x] 신규 문서 추가 시 본 Index를 함께 갱신하도록 명시(8절)

---

## 8. 유지보수 원칙 (자동 갱신 규칙)

새로운 Manifesto, Core Principles, Constitution, SSOT, RFC 문서가 만들어지면 **그 문서를 만드는 작업의 일부로 본 Index도 함께 갱신한다.** 구체적으로:

- 새 Constitution → 2절 Knowledge Hierarchy에는 이미 "Constitution"으로 포괄되어 있으므로 구조 변경 불필요, 6절 Navigation Table의 "대표 문서" 칸에 추가
- 새 SSOT → 3절 Level 3 "실제 구축 상태" 표에 상태 갱신, 6절 Navigation Table 갱신
- 새 RFC → 별도 갱신 불필요(Level 4는 "RFC 전체"를 가리키며 개별 RFC를 나열하지 않음)
- 새 Service → 3절 Level 6 및 6절 표에 실제 상태 갱신

이 문서 자체가 오래되어 실제 상태와 어긋나면(예: 3절 표가 새로 생긴 SSOT를 반영하지 못하면), 그 문서를 다음에 다루는 작업에서 바로잡는다 — 이번 세션에서 `SSOT-OS-001`, `SSOT-LANG-001` 등을 다룰 때마다 상태표를 갱신해 온 것과 동일한 관행이다.
