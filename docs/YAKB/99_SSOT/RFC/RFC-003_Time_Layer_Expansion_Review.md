# RFC-003: Time Layer 확장 검토

---

**목적:** `SSOT-JOURNEY-001` Language Validation(9절)에서 발견된 "1년" 마디를 `SSOT-OS-001` 9절 Time Layer에 어떻게 반영할지 검토한다.
**상태:** **검토 완료 — Decision 아님(Review Only).** 이 문서는 분석과 권고안만 담으며, 어떤 기존 문서도 수정하지 않았다.
**작성일:** 2026-07-04
**대상 문서(수정 없이 참조만 함):** `SSOT-OS-001_Project_Phoenix_Operating_System.md` 9절, `SSOT-JOURNEY-001_Project_Phoenix_Journey_Constitution.md` 8절
**금지 사항 준수:** Memory Constitution을 작성하지 않았다. `SSOT-OS-001`을 수정하지 않았다.

---

## 1. 현황

`SSOT-OS-001` 9절 Time Layer:

```
현재
  ↓
Journey
  ↓
기억
  ↓
3개월
  ↓
6개월
  ↓
재방문
  ↓
새로운 자신
```

`SSOT-JOURNEY-001` 8절 Time Layer(재진술):

> "3개월, 6개월, **1년** 후 기억을 다시 열어 성장의 변화를 확인한다."

"1년"이 `SSOT-OS-001`의 원본 구조에는 없는 새 마디로 등장했다.

---

## 2. 검토 내용

### 2-1. "1년"은 Journey Layer인가, Memory Layer인가

| 구분 | 정의(현재까지의 사용 패턴 기준) | "1년"이 이 정의에 맞는가 |
|------|-------------------------------|--------------------------|
| **Journey Layer** (`SSOT-JOURNEY-001` 2절 기준) | 질적으로 다른 삶의 국면을 나열한다(일상→문제→소원→DreamTown→여정→기억 봉인→세 이레→동행→재방문→나눔→새 Journey). 각 마디는 "무엇을 겪는가"를 나타낸다 | **아니다** — "1년"은 새로운 국면(겪는 사건)이 아니라 시점(when)이다 |
| **Time Layer** (`SSOT-OS-001` 9절 기준) | "공간뿐 아니라 시간도 설계한다"는 선언 아래, 정해진 시점마다 "기억을 다시 여는" 회고 리듬을 나열한다(3개월→6개월) | **그렇다** — "1년"은 3개월·6개월과 정확히 같은 종류(회고 시점)이며, 그 다음 순서로 자연스럽게 이어진다 |

**분석 결론**: "1년"은 Journey Layer의 새 국면이 아니라, **이미 존재하는 Time Layer 시퀀스(3개월→6개월)의 세 번째 마디**다. 별도 레이어를 새로 만들 필요 없이 기존 Time Layer를 연장하는 문제로 좁혀진다.

### 2-2. Memory Constitution으로 이관이 적절한가

`SSOT-OS-001` 2절 "Constitution Layer"가 나열한 예정 헌법 목록(Architecture → Language → Knowledge → Journey → Experience → Product → AI)에는 **"Memory Constitution"이 애초에 포함되어 있지 않다.** "Memory Constitution"은 `TASK-RFC-002`의 "수정 금지" 목록에서 처음 언급된, 아직 `SSOT-OS-001`에 공식 등재되지 않은 개념이다.

이 사실 자체가 이번 검토의 핵심 발견이다: **"1년을 Memory Constitution으로 이관"하려면, 먼저 "Memory Constitution이 실제로 Constitution Layer의 8번째 자리로 추가될 것인가"부터 결정되어야 한다.** 이는 이 RFC의 범위를 넘는 별도 결정(향후 RFC-OS 대상)이다.

**따라서 지금 시점에서는 이관을 권고하지 않는다** — 이관할 대상(Memory Constitution)이 아직 존재를 확정받지 못했기 때문이다. "1년"은 지금 있는 자리(`SSOT-OS-001` Time Layer)에 두는 것이 유일하게 실행 가능한 선택지다.

다만 "기억"이 Time Layer 전체(3개월/6개월/1년 모두 "기억을 다시 여는" 행위)를 관통하는 주제라는 점은, **훗날 Memory Constitution이 실제로 만들어질 경우 Time Layer 전체가 그 산하로 옮겨갈 강력한 후보**임을 시사한다. 이는 3번째 검토 항목(최종 구조 권고안)에서 "단기안"과 "장기안"으로 나누어 제시한다.

### 2-3. Time Layer 최종 구조 권고안

#### 단기 권고안 (지금 채택 가능, 구조 변경 최소)

```
현재
  ↓
Journey
  ↓
기억
  ↓
3개월
  ↓
6개월
  ↓
1년       ← 신규 추가
  ↓
재방문
  ↓
새로운 자신
```

`SSOT-OS-001`을 실제로 수정할 때는 "6개월"과 "재방문" 사이에 "1년"을 삽입하는 것만으로 충분하다 — 새 레이어나 새 Constitution을 만들 필요가 없다.

#### 장기 권고안 (Memory Constitution이 실제로 만들어질 경우에 한해)

```
Journey Constitution
  ↓
Memory Constitution   ← 신규 헌법(아직 미승인)
  ↓
Time Layer (현재/기억/3개월/6개월/1년/재회)
```

이 경우 Time Layer 전체(9절)가 `SSOT-OS-001`에서 Memory Constitution으로 이관되고, `SSOT-OS-001`에는 참조 링크만 남기는 구조가 자연스럽다. **단, 이는 "Memory Constitution 신설"이라는 훨씬 큰 결정에 종속되므로, 이번 RFC에서 채택하지 않는다.**

### 2-4. 부수 발견 — "재방문/재회" 표기 문제

Time Layer 마지막 두 마디 "재방문 → 새로운 자신"의 "재방문"은, `RFC-LANG-001`(TASK-RFC-002로 승인)이 확정한 역할 구분("재방문=운영 용어" / "재회=Journey 경험 용어")에 따르면 **"재회"로 표기하는 것이 더 정확할 수 있다** — Time Layer는 사용자의 경험을 그리는 지도이지 리텐션 지표 문서가 아니기 때문이다. 다만 이 변경은 `SSOT-OS-001` 수정을 요구하며, `RFC-LANG-001` 자체가 이미 "이번엔 반영하지 않음(의도적)"으로 남겨둔 사항이므로, 본 RFC도 동일하게 **적용하지 않고 발견 사실로만 기록한다.**

---

## 3. 완료 보고 요약

| 확인 항목 | 결과 |
|-----------|------|
| 1년의 소속 | Journey Layer 아님, **Time Layer(기존 3개월/6개월과 동일 종류)** |
| Memory Constitution 이관 적절성 | **부적절(현시점)** — Memory Constitution 자체가 `SSOT-OS-001` Constitution Layer에 아직 공식 등재되지 않았음. 이관은 그 결정이 선행된 뒤에나 유효 |
| Time Layer 최종 구조 권고 | 단기: `...6개월→1년→재방문→새로운 자신`(3번째 마디로 삽입). 장기: Memory Constitution 신설 시 Time Layer 전체 이관 검토 |
| 실행 여부 | **미실행** — `SSOT-OS-001`은 이 RFC 작성 과정에서 전혀 수정되지 않았다(권고안만 존재) |
