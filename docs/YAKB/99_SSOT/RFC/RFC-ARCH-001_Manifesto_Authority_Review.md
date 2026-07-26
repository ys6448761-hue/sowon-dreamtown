# RFC-ARCH-001: Manifesto Authority Review

---

**목적:** `MANIFESTO-001_Review.md` 1·2절이 발견한 "Manifesto와 Architecture Constitution의 최상위 지위 중복 선언" 문제를 해소한다.
**상태:** **✅ 전면 반영 완료** — CEO 결정(TASK-LANG-002)에 이어, 사용자가 "Architecture Constitution과 OS Constitution에 반영하는 후속 작업으로 진행한다"고 명시 승인(2026-07-04)하여 두 문서 모두 실제 개정됨.
**요청:** 루미 / **승인:** 푸르미르 CEO (TASK-LANG-002 원문) / **후속 실행 승인:** 사용자 (2026-07-04)
**작성일:** 2026-07-04 (1차, 검토) / 2026-07-04 (2차, 실행 승인 및 반영)
**대상 문서:** `Architecture_Constitution.md`(v1.0→1.1 반영), `MANIFESTO-001_Invisible_Value_Manifesto.md`(변경 없음), `SSOT-OS-001_Project_Phoenix_Operating_System.md`(v1.0→1.1 반영)

---

## 1. 배경

`MANIFESTO-001_Review.md` 1절이 지적한 문제: `Architecture_Constitution.md`는 스스로를 "SSA — 모든 SSOT와 모든 의사결정의 최상위 기준 문서"라 선언하고, `MANIFESTO-001`은 "모든 Constitution보다 위"라고 선언되어, **두 문서가 동시에 "최상위"를 자칭**하고 있었다.

## 2. CEO 결정 (LOCK) — 그대로 채택

- **Manifesto는 Constitution보다 상위의 운영 문서가 아니다.**
- **Manifesto는 프로젝트의 존재 이유(Why)를 선언하는 철학 문서다.**
- **Constitution은 Manifesto를 구현하기 위한 운영 원칙(How)이다.**

새 계층 구조:

```
MANIFESTO
(Project Philosophy)
  ↓
CONSTITUTION
(Architecture / Journey / Language / OS)
  ↓
SSOT
  ↓
RFC
  ↓
TASK
  ↓
IMPLEMENTATION
```

## 3. 해석 확정

`MANIFESTO-001_Review.md` 1절이 제시했던 두 해석 후보 중 **(a) 영역 구분**이 채택되었다: Manifesto = 존재 이유(WHY, 철학), Architecture Constitution(및 다른 Constitution)의 "SSA/최상위" 지위 = 시스템 운영·의사결정 레벨(HOW)에서의 최상위. **두 문서는 경쟁하지 않는다 — 서로 다른 질문에 답한다.** Manifesto가 Architecture Constitution의 SSA 지위를 무효화하거나 대체하지 않는다.

## 4. 실행 상태 — 무엇이 반영되었는가 (2026-07-04 2차 갱신)

| 항목 | 상태 |
|------|------|
| CEO 결정 자체 | ✅ 승인·확정(본 RFC로 기록) |
| `Architecture_Constitution.md` 메타데이터 문구("SSA — 모든 SSOT와 모든 의사결정의 최상위 기준 문서") | **✅ 반영 완료(v1.1)** — "시스템 운영·의사결정 레벨(How)"로 한정하는 문구 추가, `MANIFESTO-001`을 Why의 출처로 명시. 0절 의존 관계 다이어그램 최상단에 `MANIFESTO-001` 추가. 제1장~제7장 원문은 **변경하지 않고** "읽는 법" 안내만 추가 |
| `MANIFESTO-001.md` "위치" 필드("모든 Constitution보다 위에서 존재 이유를 정의한다") | 수정 불필요 — 이 표현 자체가 이미 3절의 해석과 모순되지 않는다("존재 이유를 정의"한다는 것이 곧 "운영 권한을 갖는다"는 뜻은 아니므로) |
| `SSOT-OS-001` 2절 "Constitution Layer" 체인 | **✅ 반영 완료(v1.1)** — 체인 맨 앞에 "Manifesto" 노드 추가, 상태표에 `MANIFESTO-001` 행 신설. 겸사겸사 "Journey Constitution: 작성 예정"으로 남아있던 stale 상태도 "존재"로 정정(`SSOT-JOURNEY-001`가 이미 작성되어 있었음) |

## 5. 영향 문서 목록

| 문서 | 조치 |
|------|------|
| `Architecture_Constitution.md` | **✅ 반영 완료** — v1.0→1.1, 개정 이력 박스 추가 |
| `SSOT-OS-001` | **✅ 반영 완료** — v1.0→1.1, 개정 이력 박스 추가 |
| `MANIFESTO-001.md` | 변경 없음(변경 불필요로 확정) |
| `MANIFESTO-001_Review.md` | 1·2절 발견 사항에 처리 완료 상태 갱신함 |

## 6. 완료 보고 요약

| 확인 항목 | 결과 |
|-----------|------|
| 권한 충돌 해소 | **✅ 완전 해소** — Manifesto(Why)와 Constitution(How)의 영역 구분으로 해석 확정, 양쪽 문서에 실제 반영됨 |
| Architecture Constitution 문구 반영 | ✅ 완료(v1.1) |
| SSOT-OS-001 반영 | ✅ 완료(v1.1) |
| 남은 후속 작업 | 없음(이 RFC가 다루던 범위 내에서는). `SSOT-OS-001` 11절의 "Knowledge Constitution 단일화 여부" 등 기존에 별도로 열려있던 항목은 이 RFC의 범위 밖이므로 그대로 둠 |
