---
Document: Research Package Standard v1.1 (Proposal)
Classification: Proposal
Status: Pending Validation
Base Version: Research_Package_Standard_v1.0.md (Frozen, unchanged)
Owner: Phoenix Research Institute
Change Policy: Freeze → 실사용 → 개선사항 기록 → Proposal → 검증 → 다음 버전 Freeze (OP-009)
---

# Proposal — Research Package Standard v1.1

> 본 문서는 SSOT가 아니다. `Research_Package_Standard_v1.0.md`(Frozen)를 대체하지 않는다.
> OP-009 Living Methodology Rule에 따라 검증(실사용 후 개선사항 반영 여부 확인) 전까지 Proposal 상태로 보관한다.

## 기존 v1.0(Frozen)과의 구조 차이

| v1.0 (Frozen, 13개 항목) | v1.1 Proposal (11개 항목) |
|---|---|
| Metadata | Research ID |
| Research Question | Research Question |
| Research Timeline | Research Scope |
| Research Scope | Research Timeline |
| Research Summary | Research Summary |
| Decision Log | Completed Outputs |
| Completed Outputs | Evidence |
| Evidence | Decision Log |
| Known Limits | Known Limits |
| Research Handoff | Research Status (신규) |
| Research Impact | Research Handoff |
| Research Integrity Check | — |
| Legacy Note | — |

주요 변화: Metadata → Research ID로 명칭 변경, Research Impact/Research Integrity Check/Legacy Note 제거, Research Status 신규 추가, 항목 순서 변경(Scope↔Timeline, Decision Log 위치 이동).

---

# 원본 제안 내용 (사용자 제공, 그대로 보존)

## 목적

Research Package는 연구를 다시 수행하기 위한 문서가 아니다.

이미 완료된 연구를 후대 연구자가 그대로 이어받을 수 있도록 정리한 **공식 연구 자산(Research Asset)** 이다.

새로운 연구는 추가하지 않는다.

새로운 해석도 하지 않는다.

당시 연구에서 실제 수행한 내용만 기록한다.

확실하지 않은 내용은

- 확인 불가
- 자료 없음

으로 기록한다.

---

## 1. Research ID

예)

```
R001 Human Foundation
```

---

## 2. Research Question

당시 연구의 핵심 질문

예)

```
인간은 어떤 존재인가?
```

---

## 3. Research Scope

당시 조사한 범위만 기록한다.

예)

- 철학
- 심리학
- 신경과학
- 진화생물학
- 인류학
- 종교학

새로운 분야를 추가하지 않는다.

---

## 4. Research Timeline

연구가 어떤 순서로 진행되었는지 기록한다.

예)

```
Week 1
Research Archive

Week 2
Comparative Matrix

Week 3
Common Pattern

Week 4
Foundation Candidate

Week 5
Cross Validation

Week 6
Research Freeze
```

새로운 내용을 추가하지 않는다.

---

## 5. Research Summary

연구 전체를 1~2페이지 정도로 요약한다.

주의사항

- 새로운 해석 금지
- 새로운 결론 금지
- 당시 연구 내용을 요약만 한다.

---

## 6. Completed Outputs

실제로 완료한 산출물만 기록한다.

예)

```
Archive

Comparative Matrix

Common Pattern

Foundation Candidate

Cross Validation

Research Freeze
```

없는 것은 기록하지 않는다.

---

## 7. Evidence

연구의 근거가 되는 자료를 기록한다.

예)

- Comparative Matrix
- Common Pattern
- Candidate 표
- Cross Validation 표
- 연구 메모
- 토론 기록
- 참고 문헌

가능하면 문서명과 위치를 함께 기록한다.

---

## 8. Decision Log

연구 과정에서 실제 내려진 결정만 기록한다.

예)

```
Candidate 공동 선정

SSOT 승격 보류

Freeze 결정

추가 검증 필요
```

새로운 결정을 만들지 않는다.

---

## 9. Known Limits

당시 연구에서 해결하지 못한 사항을 기록한다.

예)

- 추가 검증 필요
- 연구 범위 제한
- 자료 부족
- 학문 간 견해 차이
- 후속 연구 필요

---

## 10. Research Status

현재 연구 상태를 기록한다.

예)

```
Status

Frozen

Tier

Research Archive

Version

v0.1
```

---

## 11. Research Handoff

다음 연구자가 바로 이어받을 수 있도록 작성한다.

필수 항목

```
현재 상태

완료 단계

다음 연구

필수 입력 자료

주의 사항

금지 사항
```

---

## 작성 원칙

Research Package는

- 연구를 다시 하지 않는다.
- 새로운 자료를 조사하지 않는다.
- 새로운 이론을 만들지 않는다.
- 기존 결론을 수정하지 않는다.
- 당시 연구 내용을 보존한다.

추측보다 빈칸이 낫다.

---

## Code 역할

Research Package 작성 완료 후 Code는

- 내용을 수정하지 않는다.
- 연구를 해석하지 않는다.
- GitHub 저장
- Commit 관리
- CHANGELOG 기록
- Civilization Log 기록

만 수행한다.

---

## 최종 목표

Research Package의 목적은 문서를 많이 만드는 것이 아니다.

**10년 후 새로운 연구자가 와도 지금까지의 연구를 그대로 이어갈 수 있는 연구 자산을 만드는 것**이다.

Research Documents는 연구의 원본이다.

Research Package는 연구의 인계 문서이다.

PRM은 연구 방법론이다.

이 세 문서는 서로 역할을 혼동하지 않는다.

---

# 다음 단계 (검증 대기)

- 본 Proposal은 실사용 검증 전이다.
- v1.0(Frozen)과 v1.1(Proposal)의 항목 차이를 검토하고 채택 여부를 확정하는 것은 연구소(사용자)의 결정 사항이다.
- 검증 후 채택이 확정되면, 그 시점에 `Research_Package_Standard_v1.1.md`로 Freeze하고 v1.0은 이전 버전으로 보존한다(OP-009).
