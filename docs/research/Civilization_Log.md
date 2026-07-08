# Civilization Log

Phoenix Civilization Research Program(PCRP) 변경 기록.

---

## 2026-07-06

- 연구 디렉터리 구조 생성(`docs/research/PHX-000` ~ `PHX-008`, `_TEMPLATE`)
- `PHX-000_Phoenix_Methodology.md` 생성(Confirmed SSOT)
- `PHX-001/archive/v0.1-A.md` 등록(Research Archive, Tier 2, 출처 검증 대기, SSOT 아님)

## 2026-07-06 (정정)

- 정합성 오류 수정: `docs/research/PHX-000/PHX-000_Phoenix_Methodology.md` 삭제, `docs/research/PHX-000/` 폴더 삭제
- 동일 내용을 `docs/research/PRM.md`로 이동
- 연구 ID를 R001부터 시작하도록 명시(R000 Phoenix Methodology 행 제거)
- 문서 내 PHX-000 / R000 표현 전부 제거

## 2026-07-06

Phoenix Research Project는 단일 프로젝트가 아니라
Phoenix Research Institute 구조로 재정의되었다.

DreamTown은 연구의 출발점이 아니라
기초 연구 결과를 사람들에게 적용하는 첫 번째 Application Layer로 정리되었다.

R001 Human Foundation과 R002 Mind Foundation은 Frozen 상태이며,
SSOT가 아니라 Research Archive로 보존한다.

PRM은 연구가 아니라 방법론 문서로 분리한다.

PHX-000 및 R000 구조는 제거하고,
연구 번호는 R001부터 시작한다.

## 2026-07-07

- R002_Mind_Foundation의 Frozen 원본 확보를 시도했으나, `daily-miracles-mvp`/`dreamtown-wishart`/`antigravity-notebooklm`/`sowon-dreamtown` 전체를 조사한 결과 실제 연구 원본을 찾지 못했다.
- 조사 과정에서 R001_Human_Foundation의 기존 archive(`v0.1-A.md`) 역시 실제 연구 내용이 아니라 등록 스텁("내용은 별도로 채워진다")뿐임을 재확인했다.
- Code는 연구를 해석·창작하지 않으므로, R002 archive는 원본 확보 전까지 생성하지 않는다.
- `README.md` 신설: PHX-004 ~ PHX-008을 **Legacy Pending Review**로 명시(삭제·이관 보류, 사유는 README 참조).

## 2026-07-07 (SSOT 등록)

- `Research_Package_Standard_v1.0.md` 신설 및 SSOT(Frozen)로 등록. Research Package(연구 인계 문서)의 표준 구조(13개 항목)와 운영 원칙(OP-009 Living Methodology Rule, OP-010 Content Before Storage Rule)을 정의한다.
- 본 표준은 Research Package의 형식만 정의하며, 연구 결과(Research Content)의 진위는 각 Research 문서(R001~R008)가 책임진다(적용 범위 명시).
- `Constitution.md`에 "Research Standards" 목록(Constitution.md / PRM.md / Research_Package_Standard_v1.0.md / 개별 연구) 및 OP-009·OP-010 참조를 추가.
- `README.md`에 동일한 Research Standards 목록을 추가.
- 기존 R001~R003 폴더 구조는 변경하지 않았다. "Research Standards" 트리에 표시된 `Research/` 항목은 개별 연구 문서 그룹을 가리키는 개념적 표기로 해석했으며, R00x 폴더를 별도의 `Research/` 하위 폴더로 물리적으로 이동하지 않았다(명시적 지시 시 별도 수행).

## 2026-07-07 (Operating System v1.0)

Phoenix Research Institute Operating System v1.0 정리

- Institute Index 생성 (`Institute_Index.md`)
- Operating System 문서 생성 (`Operating_System_v1.0.md`)
- 연구소 운영 구조를 하나의 체계로 통합

향후 모든 연구는 Constitution, PRM,
Research Package Standard를 기반으로 수행한다.

- `Evidence/`, `Papers/` 폴더 구조만 준비(빈 폴더). 실제 운영은 추후 진행한다.
- Repository 구조 점검 결과, 운영 원칙상의 `Research` 항목에 대응하는 물리적 `Research/` 폴더는 존재하지 않으며 R001~R003 폴더가 `docs/research/` 바로 아래에 위치한다. `_TEMPLATE/`과 `PHX-004~008/`도 운영 원칙 목록 밖에 있는 구조로 확인된다. 폴더 이동은 수행하지 않았으며 보고만 한다.
- 새로운 원칙·철학·SSOT는 추가하지 않았으며, 기존 Constitution/PRM/Research Package Standard를 요약했다.

## 2026-07-07 (Research Package Standard v1.1 Proposal 등록)

- 사용자가 "Research Package Standard v1.0"이라는 이름으로 새 문서를 제공했으나, 기존 Frozen `Research_Package_Standard_v1.0.md`(13개 항목)와 구조가 다름을 확인(11개 항목: Metadata→Research ID 명칭 변경, Research Impact/Research Integrity Check/Legacy Note 제거, Research Status 신규 추가, 항목 순서 변경).
- OP-009 Living Methodology Rule("표준은 사용 중 변경하지 않는다")에 따라, 검증 없이 Frozen v1.0을 덮어쓰지 않는다.
- 사용자에게 처리 방식(v1.1 Proposal 등록 / v1.0 교체 / 참고용 별도 보관)을 확인 질문했으나 응답이 없어, 가장 보수적이고 되돌리기 쉬운 선택으로 판단해 `Research_Package_Standard_v1.1_Proposal.md`로 등록했다.
- Classification: Proposal, Status: Pending Validation. v1.0은 Frozen 상태 그대로 유지되며 여전히 유일한 SSOT다.
- v1.0과 v1.1 Proposal의 항목 차이표를 문서 내에 기록했다.
- 채택 여부, v1.1 Freeze 여부는 연구소(사용자)의 결정 사항이며 Code가 임의로 확정하지 않는다.

## 2026-07-07 (v1.1 Proposal 처리 방식 확정)

- 사용자가 "1번(v1.1 Proposal 등록)"으로 진행을 확정했다. `Research_Package_Standard_v1.0.md`는 Frozen 상태를 유지하고, Constitution OP-009를 그대로 적용한다.
- `Research_Package_Standard_v1.1_Proposal.md`에 "변경 이유" 항목을 추가했다. 제출 문서에 변경 이유가 명시되어 있지 않아 **자료 없음**으로 기록했으며, Code는 변경 의도를 추측하지 않았다.
- 실제 변경(v1.1 채택 여부)은 **R003 이후 진행되는 연구에서 실사용 검증을 거친 뒤** 결정하도록 문서에 명시했다. R001, R002에는 소급 적용하지 않는다.
- 검증 후 채택이 확정되면 그 시점에 `Research_Package_Standard_v1.1.md`로 Freeze하고 v1.0은 이전 버전(archive)으로 보존한다.

## 2026-07-07 (R003 Research Quality Framework)

Research Quality Guideline v1.0 생성

Traceability Principle 추가

Counter-Evidence Principle 추가

Research Quality Checklist 추가

Research Handoff에 Known Risks 추가

R003부터 동일한 품질 기준 적용

- `Research_Quality_Guideline_v1.0.md`는 운영 지침이며 PRM을 대체하지 않는다. PRM, Constitution, Research Package Standard는 수정하지 않았다.
- `README.md`, `Institute_Index.md`에 참조를 추가했다.
- R001, R002에는 소급 적용하지 않는다.

## 2026-07-07 (Foundation Phase 완료 선언)

운영체계는 당분간 Frozen이다. 이제부터는 연구를 쌓아라.

Phoenix Research Institute는 Foundation Phase를 완료하였다.

이후의 모든 노력은 운영체계 구축이 아니라, 운영체계 위에 검증 가능한 연구를 축적하는 데 집중한다.

- Constitution, PRM, Research Package Standard, Institute Index, Operating System v1.0, Research Quality Guideline은 이 선언에 따라 변경하지 않았다. 별도 지시가 있을 때까지 현 상태를 유지한다.
- 이후 작업은 R003 이후 연구 축적을 기본 흐름으로 한다.

## 2026-07-07 (Research Integration Workflow v1.0)

- `Research_Integration_Workflow_v1.0.md` 신설. 여러 연구자(Researcher GPTs)가 생산한 Research Archive를 Comparative Analysis → Common Pattern → Research Integrator(루미)의 Research Package 작성 → 대표 승인 → Code(Chief Knowledge Steward)의 GitHub 저장 순서로 통합하는 절차를 정의한다.
- Research Archive는 다수 존재할 수 있으나, Code가 GitHub에 저장하는 공식 연구 기록(Research Package)은 하나임을 명시한다. 개별 Archive는 Evidence로 보존되며 공식 결론으로 취급하지 않는다.
- Code는 대표 승인이 완료된 Research Package만 저장하며, 연구 내용 수정·해석·재구성·새 SSOT 작성을 하지 않는다.
- 기존 SSOT(Constitution, PRM, Research Package Standard, Research Quality Guideline)는 수정하지 않았다.
- 직전 Foundation Phase 완료 선언("운영체계는 당분간 Frozen") 직후에 접수된 지시이나, 본 워크플로우는 기존 운영 문서를 변경하는 것이 아니라 다수 연구자의 결과물을 단일 공식 기록으로 접수하기 위한 절차이므로, "연구를 쌓는" 단계에 필요한 인프라로 판단해 등록했다.

## 2026-07-07 (Operational Research & Knowledge Archive Proposal v0.1 등록)

- `Operational_Research_and_Knowledge_Archive_v0.1_Proposal.md` 등록. Classification: Proposal, Status: Pending Validation. R003부터 실사용 검증을 시작하며, 충분한 운영 검증 후 SSOT 승격 여부를 결정한다. Constitution과 PRM은 변경하지 않았다.

## 2026-07-07 (Phoenix Research Fellow Charter v1.0 Proposal 등록)

Phoenix Research Fellow Charter v1.0 Proposal 등록.

본 Charter는 특정 AI의 프롬프트가 아니라 Phoenix Research Institute의 공통 연구원 운영 헌장으로 정의한다.

GPT, Claude, Gemini, Perplexity 및 향후 모든 AI와 인간 연구원은 동일한 Charter를 기반으로 운영한다.

Charter를 Single Source of Truth로 관리하며, AI는 Charter의 구현체로 간주한다.

본 Charter는 R003~R005 실사용 검증 후 v1.0 Frozen 승격 여부를 결정한다.

## 2026-07-07 (R003 Week 1 Freeze 요청 — 보류)

- "R003 Week 1 Research Archive Freeze v1.0" Research Package가 전달되었다. Philosophy/Psychology/Neuroscience/Evolutionary Biology/Anthropology/Religious Studies 6개 Archive를 Frozen v0.1로 저장하라는 지시였으나, 실제 연구 본문(Archive 내용)은 지시서에 포함되지 않고 제목·Quality Audit 결과(Approved)·저장 경로·커밋 메시지만 제공되었다.
- 6개 Archive의 실제 콘텐츠를 C:\DEV 전체(sowon-dreamtown, daily-miracles-mvp, dreamtown-wishart, antigravity-notebooklm 등)에서 검색했으나 어디에도 존재하지 않음을 확인했다. `docs/research/R003_Meaning_Foundation/`은 `.gitkeep`만 있는 빈 폴더다.
- OP-010(Content Before Storage Rule)에 따라 Code는 연구자가 없는 연구를 작성하지 않으며, 실제 본문 없이 "Frozen v0.1 / Approved"로 저장하지 않는다. 저장·Commit·Push·Verification·상태 변경(Complete)을 보류한다.
- 실제 Archive 본문이 제공되면 그 시점에 저장을 재개한다. 저장 위치는 지시서의 `research/R003/week1/`이 아니라 기존 구조인 `docs/research/R003_Meaning_Foundation/`을 우선 사용한다(중복 폴더 생성 방지).

## 2026-07-08 (R003 Week 1 Complete)

R003 Week 1 Complete

Research Question:
Why do humans seek meaning?

Completed Research Archives:
- Philosophy
- Psychology
- Neuroscience
- Evolutionary Biology
- Anthropology
- Religious Studies

Status:
Research Archives Frozen v0.1

Next Phase:
R003 Week 2
Comparative Matrix

- 실제 Archive 본문이 포함된 Research Package Bundle이 전달되어, 6개 Archive를 원문 그대로(요약·수정·재작성 없이) `docs/research/R003_Meaning_Foundation/`에 저장했다. 기존 구조를 유지했으며 중복 폴더(`research/R003/week1/`)는 생성하지 않았다.
- Quality Audit(Lumi) 결과 6개 Archive 모두 Approved. Research Fellow 기준 충족을 확인했다.
