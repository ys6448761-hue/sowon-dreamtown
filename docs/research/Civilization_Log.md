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
