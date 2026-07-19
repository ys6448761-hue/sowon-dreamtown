---
code: RN-OPS-002
title: Asset-Aware Development
type: Research Note
status: Exploring
knowledge_level: Level 3
validation_status: Not Yet Validated
promotion: Not Eligible
scope: Software / Web App / Feature Development Procedure (not a Backbone, not a Governance document)
created: 2026-07-19
branch: docs/rn-ops-002-asset-aware-development
---

> **이 문서가 아닌 것 (먼저 명확히 한다):**
>
> - Backbone이 아니다.
> - 새 Governance 문서가 아니다.
> - 기존 Constitution의 대체물이 아니다.
> - 검증 완료된 방법론이 아니다.
> - Candidate가 아니다. SSOT가 아니다.
>
> 이 문서는 `ProjectPhoenix/Constitution/PROJECT-PHOENIX-CONSTITUTION.md`의
> **Research First(제1조), Legacy Preservation(제2조), Pilot Before
> Scale(제9조)** 원칙을 소프트웨어·웹앱·기능 개발 과정에 적용하는
> 실행 절차를 연구하는, **Exploring 단계의 Research Note**다.

---

# RN-OPS-002 — Asset-Aware Development

기존 자산을 먼저 분석하고, 부족한 기능만 선택적으로 조립하는 개발 절차

---

## 1. 목적

이 문서는 새로운 Project Phoenix 구조를 정의하지 않는다.

정확한 목적은 다음과 같다:

> 기존 Project Phoenix Constitution의 Research First, Legacy
> Preservation, Pilot Before Scale 원칙을 소프트웨어·웹앱·기능 개발
> 과정에 적용하는 실행 절차를 연구한다.

## 2. 기존 문서와의 관계

다음 문서를 참조한다:

- `ProjectPhoenix/Constitution/PROJECT-PHOENIX-CONSTITUTION.md`
- `docs/research/Constitution.md`
- `docs/research/PRM.md`
- `Research/RN-OPS-001_Phoenix_Operation_Research_Integration.md`

`ProjectPhoenix Constitution`의 다음 조항과 명시적으로 연결한다:

- 제1조 Research First
- 제2조 Legacy Preservation
- 제9조 Pilot Before Scale

이 문서는 위 조항을 **대체하거나 재정의하지 않는다.**

> Asset-Aware Development는 기존 Constitution 원칙을 소프트웨어 및
> 웹앱 개발 순서로 구체화한 탐색적 적용안이다.

## 3. Core Definition

> Asset-Aware Development는 새로운 시스템을 처음부터 설계하기 전에,
> 기존 자산을 발견하고 목록화하며 관계를 분석한 뒤, 실제 사용자
> 요구와 부족한 부분을 확인하고, 필요한 기능만 선택적으로 조립하여
> 운영으로 검증하는 개발 접근법이다.

한국어 핵심 문장:

> 자산을 먼저 읽고, 사람의 필요를 확인하고, 부족한 것만 조립한다.

---

## 4. Workflow

```
Existing Assets
  ↓
Asset Inventory
  ↓
Relationship Mapping
  ↓
Human Needs Analysis
  ↓
Gap Analysis
  ↓
Selective Composition
  ↓
Operational Validation
```

### Existing Assets

현재 저장소와 운영 환경에 존재하는 문서, 코드, 구조, 자산을 먼저
확인한다.

### Asset Inventory

각 자산의 위치, 역할, 상태, 정본 여부를 목록화한다.

### Relationship Mapping

Constitution, Research, Evidence, Candidate, SSOT, Project, Asset
사이의 관계를 파악한다.

### Human Needs Analysis

기술적으로 가능한 기능이 아니라 실제 사용자에게 필요한 경험을
확인한다.

### Gap Analysis

이미 존재하는 것과 실제로 부족한 것을 구분한다.

### Selective Composition

기존 자산을 우선 재사용하고, 부족한 기능만 선택적으로 추가한다.

### Operational Validation

실제 프로젝트에서 사용하고 결과를 관찰한다.

---

## 5. 기존 원칙과의 연결

| 기존 원칙 | 개발 적용 |
|---|---|
| Research First | 설계 전에 기존 사례와 자산을 먼저 조사한다. |
| Legacy Preservation | 기존 자료와 구조를 삭제하거나 대체하지 않고 재사용 가능성을 먼저 검토한다. |
| Pilot Before Scale | DreamTown 등 실제 프로젝트에서 먼저 시험한 뒤 확장 여부를 판단한다. |

이 연결은 "새로운 원칙"이 아니라 "기존 원칙의 개발 적용"이다.

---

## 6. 독립적인 연구 내용

다음 세 가지는 기존 문서(`ProjectPhoenix/`, `docs/research/`,
`RN-OPS-001`, `docs/YAKB/`)에 명시적으로 존재하지 않았다(2026-07-19
전체 검색 확인):

- Relationship Mapping
- Gap Analysis
- Selective Composition

Selective Composition의 정의:

> 모든 기능을 새로 만드는 것이 아니라, 기존 자산을 조립하고 실제
> 부족한 부분만 추가하는 방식.

---

## 7. 이번 세션의 최초 관찰 사례

사례 흐름:

1. 새로운 Backbone 문서를 만들려 했다.
2. 기존 저장소를 먼저 조사했다.
3. `ProjectPhoenix/`와 `docs/research/`의 성숙한 체계를 발견했다.
4. 개념 중복 가능성을 확인했다.
5. 문서 작성을 중단했다.
6. Backbone과 Asset-Aware Development를 분리했다.
7. 기존 자산을 대체하지 않고 부족한 개발 절차만 연구하기로 전환했다.

이 사례를 각 단계와 연결하면:

| 실제 발생 | 단계 |
|---|---|
| 새 Backbone 문서를 만들려 함 | (설계 시도) |
| 기존 저장소를 먼저 조사함 | Existing Assets |
| `ProjectPhoenix/`, `docs/research/` 목록화 | Asset Inventory |
| 겹치는 개념 vs 다른 역할 분석 | Relationship Mapping |
| 중복 없는 상위 개념이 필요한지 확인 | Human Needs Analysis |
| "정말 새로 필요한가?" 판단 | Gap Analysis |
| RN-OPS-002를 좁은 범위로 재정의 | Selective Composition |
| 이 문서에 대한 승인·후속 적용 | Operational Validation |

> **이 사례는 최초 관찰 1건이며, 반복 검증된 Evidence가 아니다.**

다음 표현은 사용하지 않는다: 검증 완료 / 운영 원칙 확정 / Evidence
축적 완료 / Candidate 승격 가능 / SSOT 승격 가능.

---

## 8. Conventional Vibe Coding과의 차이

일반적인 흐름:

```
Natural Language Request
  ↓
AI Assumption
  ↓
Generated Structure
  ↓
Coding
  ↓
Data Input
```

Asset-Aware Development:

```
Existing Assets
  ↓
Repository Analysis
  ↓
Relationship Discovery
  ↓
User Needs
  ↓
Gap Detection
  ↓
Selective Composition
  ↓
Operational Validation
```

핵심 차이:

- AI가 무에서 구조를 발명하지 않는다.
- AI가 기존 자산을 먼저 읽는다.
- AI는 Analyst, Planner, Curator, Composer 역할을 수행한다.
- 기능보다 자산과 사용자 필요가 먼저다.
- GitHub는 계속 Source of Truth로 남는다.

---

## 9. Project Phoenix 웹앱 적용 (탐색적 스케치)

웹앱을 새로운 Source of Truth로 정의하지 않는다.

```
GitHub Repository
  ↓
Asset Index
  ↓
Relationship Layer
  ↓
Read-only Web Interface
  ↓
Search / Dashboard / Timeline / Knowledge Map
```

초기 웹앱 원칙:

- 기존 자산 우선
- read-only 우선
- 중복 데이터베이스 최소화
- GitHub 원본 보존
- 부족한 기능만 MVP로 구현
- 사용자 필요 확인 후 기능 추가

---

## 10. Risks

- 기존 자산의 품질이 낮으면 잘못된 구조를 재사용할 수 있음
- 자산 조사에 시간이 걸림
- 모든 것을 보존하려다 필요한 개선을 지연할 수 있음
- 관계 해석이 틀릴 수 있음
- GitHub 문서만으로 실제 사용자 요구를 모두 알 수 없음
- 기존 구조에 과도하게 종속될 수 있음
- 한 번의 성공 사례를 일반화할 위험이 있음

---

## 11. Validation Plan

DreamTown 웹앱을 첫 Test Bed로 사용한다.

검증 순서:

1. Repository Inventory 작성
2. DreamTown 관련 기존 자산 목록화
3. 자산 역할과 상태 확인
4. 자산 간 Relationship Mapping
5. 실제 소원이 사용자 필요 확인
6. Gap Analysis 수행
7. 필요한 기능만 MVP로 구현
8. 운영 기록 수집
9. 반복 적용 가능성 평가

검증 질문:

- 기존 자산을 실제로 재사용했는가?
- 중복 문서나 중복 기능이 줄었는가?
- 불필요한 기능을 구현 전에 제외했는가?
- GitHub가 Source of Truth로 유지되었는가?
- 사용자에게 실제로 필요한 경험이 제공되었는가?
- 다른 프로젝트에서도 같은 절차를 반복할 수 있는가?

---

## 12. Promotion Conditions

Candidate 검토 전 최소 조건:

- DreamTown 웹앱에서 실제 적용
- 다른 프로젝트에서 최소 1회 추가 적용
- 최소 2개 이상의 반복 사례
- 중복 개발 방지 사례 기록
- 기존 자산 재사용 사례 기록
- Gap Analysis로 기능을 제외하거나 축소한 사례
- 사용자 또는 운영자 피드백
- 기존 Constitution, PRM, Governance와 충돌하지 않음

현재 결론:

```
Current Status: Exploring
Evidence Level: Initial Observation Only
Promotion: Not Recommended
Next Action: Validate through DreamTown website planning and MVP operation
```

---

## 13. 작성 금지 사항 (이 문서 자체의 자기 제약)

- 새로운 Backbone을 정의하지 않는다.
- Project Phoenix 전체 폴더 구조를 재설계하지 않는다.
- 새로운 Research Cycle을 만들지 않는다.
- PRM을 대체하지 않는다.
- Constitution을 수정하지 않는다.
- Confirmed SSOT 또는 Frozen 문서를 수정하지 않는다.
- Asset-Aware Development를 공식 운영 원칙으로 선언하지 않는다.
- 이번 사례를 Evidence로 확정하지 않는다.
- Candidate 또는 SSOT 승격을 제안하지 않는다.
- 외부 사례를 출처 없이 추가하지 않는다.
- "세계 최초", "유일", "검증 완료" 같은 표현을 사용하지 않는다.
