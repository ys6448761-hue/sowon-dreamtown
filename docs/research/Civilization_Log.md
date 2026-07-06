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
