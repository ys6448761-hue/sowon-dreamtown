# RFC-ARCH-002: Core Principles Impact Review

---

**목적:** `CORE-PRINCIPLES-001.md` 신설이 기존 Constitution·SSOT 문서와 충돌하는지 확인한다.
**상태:** **검토 완료.** Part 4·5가 명시적으로 승인한 항목(다이어그램 갱신, 4개 Constitution의 한 줄 참조 추가)만 실행했고, 이 Review 자체가 발견한 추가 사항은 실행하지 않고 기록만 한다.
**요청:** 루미 / **승인:** 푸르미르 CEO (TASK-ARCH-002 원문)
**작성일:** 2026-07-04
**대상 문서(검토만, Part 4·5 승인 범위 밖은 수정 없음):** `Architecture_Constitution.md`, `SSOT-JOURNEY-001`, `SSOT-LANG-001`, `SSOT-OS-001`, `SSOT-KNOWLEDGE-001/002/003`, `SSOT-LANG-002`, `MANIFESTO-001`

---

## 1. 기존 Constitution 충돌 여부

10개 원칙 각각을 4개 Constitution(Architecture/Journey/Language/OS)과 대조했다.

| Principle | 대조 결과 |
|-----------|-----------|
| 1. 보이지 않는 가치가 먼저다 | 충돌 없음 — `MANIFESTO-001`의 압축, Constitution에는 대응 문구 없음(정상 — Constitution은 How를 다룸) |
| 2. 소원은 행동으로 완성된다 | 충돌 없음 — `SSOT-JOURNEY-001` 1절과 일치 |
| 3. 별은 성장의 증거다 | 충돌 없음 — `SSOT-LANG-001` 5절 Product Language와 일치 |
| 4. DreamTown은 인생의 기준점이다 | 충돌 없음 — `SSOT-JOURNEY-001` 6절과 **문장까지 동일** |
| 5. 여정은 경쟁이 아니라 동행이다 | 충돌 없음 — `SSOT-LANG-001` Canon("동행"), `SSOT-JOURNEY-001` 1절과 일치 |
| 6. 기록은 데이터가 아니라 Star Trace이다 | 충돌 없음 — `RFC-LANG-002`로 이미 LOCKED된 정의와 일치 |
| 7. 기술보다 사람이 먼저다 | 충돌 없음 — `Architecture_Constitution.md` 제2장과 **문장까지 동일** |
| 8. 확장보다 일관성을 우선한다 | 충돌 없음 — `Architecture_Constitution.md` 제6장("Architecture는 유지된다"), 이번 세션 전체에서 반복된 "Review 먼저, 자동 수정 금지" 관행과 일치 |
| 9. 새로운 것은 기존 SSOT와 충돌하지 않는다 | 충돌 없음 — `Architecture_Constitution.md` 제7장, `SSOT-KNOWLEDGE-003` 8절과 일치 |
| 10. 모든 설계는 DreamTown다움을 먼저 확인한다 | **직접 대응 문구 없음** — 신규 종합 원칙(`CORE-PRINCIPLES-001` 자체 각주 참조). 충돌은 아니나 "DreamTown다움"이 아직 정의되지 않은 개념이라는 점은 3-2절에서 별도로 다룬다 |

**결론**: 10개 원칙 중 9개는 기존 Constitution 문구를 그대로 압축·재인용한 것이라 충돌이 있을 수 없는 구조다. 유일하게 완전히 새로운 종합인 Principle 10만 "정의 필요" 상태이며, 이는 충돌이 아니라 **미완성 상태**다.

## 2. 기존 SSOT 충돌 여부

`SSOT-KNOWLEDGE-001/002/003`, `SSOT-LANG-002`(Migration List)까지 포함해 대조했다.

- `SSOT-KNOWLEDGE-001`(Origin Generation Guide)의 Source Trace 규율은 Principle 9와 완전히 부합한다.
- `SSOT-KNOWLEDGE-002`(Lifecycle)의 단계적 성장 구조는 Principle 3과 부합한다.
- `SSOT-KNOWLEDGE-003`(Graph)의 "연결 없는 문서는 미완성" 원칙은 Principle 9와 사실상 같은 말이다.
- `SSOT-LANG-002`(Migration List)의 "한 번에 바꾸지 않는다, 영향도부터 분석한다" 원칙은 Principle 8과 부합한다.

**결론**: 충돌 없음. 오히려 10개 원칙 중 다수가 기존 SSOT들이 개별적으로 실천해오던 원칙을 사후적으로 하나의 명단에 모은 것에 가깝다.

## 3. Language 영향

- Principle 6(Star Trace), Principle 5(동행/여정)에 쓰인 용어는 모두 이미 `SSOT-LANG-001` Canon Language에 LOCKED/확정 상태로 존재한다 — 추가 등재 불필요.
- **"DreamTown다움"(Principle 10)은 Canon Language에 없는 신규 개념이다.** 이 개념이 실제로 반복 사용될 것이라면 향후 `RFC-LANG`을 통해 정의가 필요하다 — **이번 Review에서는 정의하지 않는다**(수정 금지 지시: "Language Canon" 변경 없음).

## 4. Journey 영향

- Principle 2("소원은 행동으로 완성된다")와 Principle 5("여정은 경쟁이 아니라 동행이다")는 `SSOT-JOURNEY-001`의 기존 선언을 그대로 압축한 것이라 **Journey Flow(2절)에 어떤 영향도 주지 않는다** — 새 마디를 추가하거나 기존 마디를 바꿀 필요가 없다.
- `SSOT-JOURNEY-001`에는 Part 5에 따라 참조 한 줄만 추가했다("This Constitution is governed by CORE-PRINCIPLES-001."). 본문·Journey Flow는 무변경.

## 5. OS 영향

- `SSOT-OS-001` 2절 "Constitution Layer" 체인에 Manifesto와 Architecture Constitution 사이 "Core Principles" 노드, 상태표에 행을 추가했다(Part 4/5 승인 범위, 실행 완료).
- 1·10절(Purpose Layer, OS Map) 등 다른 절은 "참조 체계만" 지시 범위 밖이라 손대지 않았다.

## 6. 실행 요약 — 실제로 무엇이 바뀌었는가

| 문서 | 실행 내용 |
|------|-----------|
| `CORE-PRINCIPLES-001.md` | 신규 생성(Part 1·2·3) |
| `Architecture_Constitution.md` | 0절 다이어그램에 Core Principles 노드 추가 + 개정 이력 + 거버넌스 참조 한 줄(Part 4) |
| `SSOT-OS-001.md` | 2절 다이어그램·상태표에 Core Principles 노드 추가 + 개정 이력 + 거버넌스 참조 한 줄(Part 4, "참조 체계만") |
| `SSOT-JOURNEY-001.md` | 거버넌스 참조 한 줄만 추가(Part 5, 본문 무변경) |
| `SSOT-LANG-001.md` | 거버넌스 참조 한 줄만 추가(Part 5, 본문 무변경) |
| `MANIFESTO-001.md`, `Journey Flow`, `Language Canon`, `Star Trace 정의` | **무변경**(수정 금지 목록 준수) |

## 완료 보고 요약

| 확인 항목 | 결과 |
|-----------|------|
| 기존 Constitution 충돌 | 없음(9개 원칙은 기존 문구의 압축, 1개는 신규 종합) |
| 기존 SSOT 충돌 | 없음 — 오히려 기존 관행의 사후 정리에 가까움 |
| Language 영향 | "DreamTown다움" 1건이 미정의 상태로 남음(정의하지 않음, 향후 RFC-LANG 대상) |
| Journey 영향 | 없음(Journey Flow 무변경) |
| OS 영향 | Constitution Layer 다이어그램 갱신만(참조 체계) |
| DoD 충족 여부 | Core Principles 문서 생성 ✅ / 10개 원칙 작성 ✅ / 문서 계층 반영 ✅ / Constitution 참조 추가 ✅(4건) / Impact Review 작성 ✅ / 기존 SSOT 내용 변경 없음 ✅(참조 한 줄 외 무변경) |
