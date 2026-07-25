# RFC-JOURNEY-002: Journey Alignment Review

---

**목적:** `SSOT-JOURNEY-001`의 Journey 구조와 `MANIFESTO-001`의 Journey Flow를 비교하여, 세 이레(21일)·재회·동행의 누락 여부를 검토한다.
**상태:** **검토 완료 — Decision 아님(Review Only).** 이 문서는 발견과 RFC 후보만 담으며, `SSOT-JOURNEY-001`을 수정하지 않았다.
**작성일:** 2026-07-04
**대상 문서(수정 없이 참조만 함):** `SSOT-JOURNEY-001_Project_Phoenix_Journey_Constitution.md` 2절, `MANIFESTO-001_Invisible_Value_Manifesto.md` 6절

---

## 1. 두 흐름도 대조

| 순서 | `SSOT-JOURNEY-001` 2절 (11마디) | `MANIFESTO-001` 6절 (9마디) |
|------|-----------------------------------|--------------------------------|
| 1 | 일상 | 일상 |
| 2 | 문제 | 문제 |
| 3 | 소원 | 소원 |
| 4 | DreamTown | DreamTown |
| 5 | 여정 | Journey |
| 6 | 기억 봉인 | 기억 |
| 7 | **세 이레(21일)** | — (없음) |
| 8 | **동행** | — (없음) |
| 9 | 재방문 | 재회 |
| 10 | 나눔 | 나눔 |
| 11 | 새로운 Journey | 새로운 Journey |

## 2. 누락 여부 검토

### 2-1. 세 이레(21일) — Manifesto에서 누락

`SSOT-JOURNEY-001` 5절이 "세 이레는 Journey가 일상의 리듬으로 자리 잡는 첫 번째 동행의 시간"이라고 명확히 정의했고, `RFC-LANG-001`로 `SSOT-LANG-001` Canon Language에도 이미 등재되어 있다. 그런데 `MANIFESTO-001`의 압축된 흐름에는 이 마디가 없다.

**분석**: "세 이레"는 구체적 기간(21일)을 명시하는 **운영적 디테일**에 가깝다 — Manifesto가 "100년 후에도 변하지 않을 내용만" 담아야 한다는 자체 작성 원칙을 따른다면, "21일"처럼 구체적 숫자가 들어간 규정은 시대나 서비스 설계에 따라 바뀔 수 있어 Manifesto 레벨에는 부적합할 수 있다. 즉 **누락이 아니라 의도적 생략일 가능성이 있다.**

### 2-2. 동행 — Manifesto에서 누락

"동행"은 `SSOT-LANG-001` Canon Language에 "Long-Term Companion"의 한국어 대응어로 이미 등재되어 있고, `Architecture_Constitution.md`·`SSOT-OS-001` 등 여러 문서에서 반복되는 핵심 철학어다. Manifesto 본문 8절("AI")에서 "삶의 증인(Witness)"을 다루지만 "동행"이라는 단어 자체는 Journey 흐름도(6절)에 등장하지 않는다.

**분석**: "세 이레"와 달리 "동행"은 구체적 수치가 없는 **순수 철학어**다. Manifesto의 "100년 불변" 원칙에 부합하는 단어인데도 빠져 있어, 이는 "세 이레"보다 더 설명하기 어려운 누락이다 — 의도적 생략인지 단순 누락인지 이번 검토만으로는 판단할 수 없다.

### 2-3. 재회 — 누락 아님, 이미 정확히 반영됨

Manifesto는 "재회"를 쓰고 있고, 이는 `RFC-LANG-001`(TASK-RFC-002 승인)이 정한 "재회 = Journey 경험/의식/사용자 메시지 용어" 정책과 정확히 일치한다. **오히려 `SSOT-JOURNEY-001` 쪽이 아직 "재방문"으로 남아 있어, 이 자리에서는 Manifesto가 Constitution보다 최신 Canon을 반영하고 있는 상태다.**

## 3. RFC 후보 (결정하지 않음 — 향후 검토용으로만 기록)

| # | 후보 | 내용 |
|---|------|------|
| 1 | Manifesto에 "세 이레(21일)" 추가 여부 | 추가할지, 혹은 "Manifesto는 철학만, 구체 규정은 Constitution 몫"이라는 원칙을 공식화해 의도적 생략으로 확정할지 결정 필요 |
| 2 | Manifesto에 "동행" 추가 여부 | 순수 철학어인데 빠져 있어, "세 이레"보다 우선 검토할 가치가 있음 |
| 3 | `SSOT-JOURNEY-001`·`SSOT-OS-001`의 "재방문"→"재회" 정리 | `RFC-LANG-001`·`RFC-003`이 이미 인지한 사항과 동일 — 이번 대조로 한 번 더 확인됨. 실행은 여전히 보류 상태 |
| 4 | "여정"(Constitution) vs "Journey"(Manifesto) 5번째 마디 표기 | `RFC-LANG-001`의 병행 정책 범위 안에 있어 충돌 아님 — 참고 기록만 |
| 5 | "기억 봉인"(Constitution) vs "기억"(Manifesto) 6번째 마디 표기 | 사소한 축약으로 보이나, Manifesto의 "기억"이 Journey Layer의 "기억 봉인"과 `SSOT-OS-001` Time Layer의 "기억"(9절) 중 어느 쪽에 더 가까운 표현인지도 확인 필요 |

## 4. 완료 보고 요약

| 확인 항목 | 결과 |
|-----------|------|
| 세 이레(21일) 누락 여부 | 누락 확인. 구체적 수치가 있어 의도적 생략 가능성 있음(2-1) |
| 재회 누락 여부 | **누락 아님** — 오히려 Manifesto가 Constitution보다 최신 Canon("재회")을 앞서 반영 중(2-3) |
| 동행 누락 여부 | 누락 확인. 순수 철학어인데 빠져 있어 설명하기 더 어려운 사례(2-2) |
| 실행 여부 | **미실행** — `SSOT-JOURNEY-001`, `MANIFESTO-001` 모두 이 검토로 수정되지 않았다(단, `MANIFESTO-001`의 Life Trace→Star Trace는 별도 RFC-LANG-002로 이미 반영됨) |
