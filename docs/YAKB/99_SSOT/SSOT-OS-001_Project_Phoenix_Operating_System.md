# SSOT-OS-001: Project Phoenix Operating System (Journey OS)

---

**목적:** Project Phoenix의 모든 Constitution과 SSOT를 하나의 운영체계로 연결한다. 개발자, 디자이너, AI, 파트너가 **처음 읽는 최상위 지도(Map)** 역할을 한다.
**최상위 Authority:** `docs/YAKB/00_MANIFESTO/MANIFESTO-001_Invisible_Value_Manifesto.md` (Manifesto Layer — Why) → `docs/YAKB/00_ARCHITECTURE/Architecture_Constitution.md` (SSA — Foundation, How). 본 문서는 두 문서의 지위를 대체하지 않는다 — 이 문서는 "지도"이고, Manifesto/Architecture Constitution이 그 지도가 가리키는 최상위 원칙이다
**역할 구분:** 이 문서는 그 자체로 새로운 원칙을 선언하지 않는다. 이미 존재하거나 예정된 Constitution/SSOT를 하나의 구조로 **연결·요약**하며, 각 절의 세부 정의는 해당 원문 문서를 따른다.
**Status:** Approved
**Level:** System Map (Operating System)
**버전:** 1.3.0 (Experience Constitution 반영)
**확정일:** 2026-07-03 (최초) / 2026-07-05 (RFC-ARCH-001, SSOT-GROWTH-001, EXPERIENCE-CONSTITUTION-001 반영)
**변경 절차:** `SSOT-LANG-001` 10절과 동일한 RFC 절차 적용 — 변경 시 `RFC-OS-{번호}_{제목}.md` 작성
**근거 자료:** `MANIFESTO-001_Invisible_Value_Manifesto.md`, `Architecture_Constitution.md`, `SSOT-LANG-001/002`, `SSOT-KNOWLEDGE-001/002/003`, `Aurora_Aurum_Audit.md`, `Project_Phoenix_Language_Audit.md`

---

> ## 개정 이력
> **2026-07-04 — `RFC-ARCH-001_Manifesto_Authority_Review.md` 반영**: 2절 Constitution Layer 체인 맨 앞에 `MANIFESTO-001`을 추가했다(이전에는 Manifesto 개념 자체가 이 체인에 없었다). 아울러 Journey Constitution 상태를 "작성 예정"에서 "존재"로 갱신했다(`SSOT-JOURNEY-001` 작성 완료 반영, 기존에 누락되어 있던 항목).
> **2026-07-04 — `CORE-PRINCIPLES-001.md` 반영(TASK-ARCH-002, 참조 체계만 갱신)**: 2절 Constitution Layer 체인에 Manifesto와 Architecture Constitution 사이 "Core Principles" 노드를 추가했다.
> **2026-07-04 — `SSOT-GROWTH-001_Growth_Architecture.md` 반영(TASK-GROWTH-001)**: 3절 SSOT Layer 상태표에 "Growth" 행을 신규 추가했다.
> **2026-07-05 — `EXPERIENCE-CONSTITUTION-001` 반영(TASK-EXP-001)**: 2절 Constitution Layer 다이어그램·상태표에서 Experience Constitution을 "예정"→"존재"로 갱신했다.

> This Constitution is governed by CORE-PRINCIPLES-001.

---

## 1. Purpose Layer

왜 존재하는가.

사람의 Journey를 통해

```
성장
  ↓
나눔
  ↓
새로운 Journey를 만드는 플랫폼
```

> 이 3행은 `Architecture_Constitution.md` 제2·3장(최상위 원칙·성장 모델)의 압축형이다. 전체 원문(소원→회복→성장→나눔→새로운 소원)은 Architecture Constitution을 따른다 — 이 절은 그것을 한 문장으로 요약해 지도의 첫 페이지에 두는 역할만 한다. **(2026-07-04 추가)** 더 근원적인 "왜"는 `MANIFESTO-001`이 정의한다 — Architecture Constitution 제2·3장은 그 Why를 시스템 운영 레벨로 옮겨 적은 것이다(`RFC-ARCH-001` 참조).

---

## 2. Constitution Layer

현재 존재하는 헌법(Constitution)의 연결 구조.

```
Manifesto
(Project Phoenix Philosophy — Why)
  ↓
Core Principles
(Immutable Principles)
  ↓
Architecture Constitution
  ↓
Language Constitution
  ↓
Knowledge Constitution
  ↓
Journey Constitution
  ↓
Experience Constitution
  ↓
Product Constitution (예정)
  ↓
AI Constitution (예정)
```

### 실제 상태 (2026-07-04 갱신)

| Constitution | 상태 | 실제 문서 |
|---------------|------|-----------|
| **Manifesto** | ✅ **존재(신규 반영)** | `docs/YAKB/00_MANIFESTO/MANIFESTO-001_Invisible_Value_Manifesto.md` — Constitution이 아니라 그 위의 Philosophy Layer. Why를 정의하며, 아래 모든 Constitution은 이를 구현하는 How다(`RFC-ARCH-001` 참조) |
| **Core Principles** | ✅ **존재(신규 반영)** | `docs/YAKB/00_MANIFESTO/CORE-PRINCIPLES-001.md` — Constitution도 Manifesto도 아닌, 그 사이의 불변 원칙 10개(LOCKED). `RFC-ARCH-002` 참조 |
| Architecture Constitution | ✅ 존재 | `docs/YAKB/00_ARCHITECTURE/Architecture_Constitution.md` |
| Language Constitution | ✅ 존재 | `docs/YAKB/99_SSOT/SSOT-LANG-001_Project_Phoenix_Language_Constitution.md` |
| **Knowledge Constitution** | ⚠ **단일 문서로는 미존재** | 현재는 `SSOT-KNOWLEDGE-001`(Origin 생성 절차) + `SSOT-KNOWLEDGE-002`(Lifecycle) + `SSOT-KNOWLEDGE-003`(Graph) **3개 문서가 그 역할을 분담**하고 있다. 이 지도에서는 편의상 이 3개를 묶어 "Knowledge Constitution 자리"로 취급하지만, 3개 문서를 하나의 `Knowledge_Constitution.md`로 통합할지는 별도 결정(RFC-OS) 사항이다 |
| **Journey Constitution** | ✅ **존재(상태 갱신)** | `docs/YAKB/99_SSOT/SSOT-JOURNEY-001_Project_Phoenix_Journey_Constitution.md` — 이전에는 "작성 예정"으로 표기되어 있었으나 이미 작성 완료되어 있었음(TASK-JOURNEY-001, 2026-07-04) |
| **Experience Constitution** | ✅ **존재(신규 반영)** | `docs/YAKB/99_SSOT/EXPERIENCE-CONSTITUTION-001_Experience_Constitution.md` (TASK-EXP-001, 2026-07-05) |
| Product Constitution | ⏳ 예정 | 미작성 |
| AI Constitution | ⏳ 예정 | 미작성 |

---

## 3. SSOT Layer

현재 구축된 SSOT의 연결.

```
Character
Location
Route
Image
Animation
Knowledge
Language
Product
Manufacturing
QA
...
```

### 실제 상태 (2026-07-03 기준)

| 분류 | 상태 | 실제 문서 / 비고 |
|------|------|-------------------|
| Knowledge | ✅ 존재 | `SSOT-KNOWLEDGE-001/002/003` (`docs/YAKB/99_SSOT/`) |
| Language | ✅ 존재 | `SSOT-LANG-001/002` (`docs/YAKB/99_SSOT/`) |
| **Growth** (신규 반영, 2026-07-04) | ✅ 존재 | `SSOT-GROWTH-001_Growth_Architecture.md` (`docs/YAKB/99_SSOT/`) — Journey/Star Seed/Star Trace/DB Enum/Reward 등에 흩어진 성장 구조를 9단계로 통합한 횡단(cross-cutting) SSOT |
| Character | ⚠ **다른 저장소에 존재, 이 SSOT 체계에는 미편입** | `daily-miracles-mvp/docs/ssot/core/SSOT-CHAR-001_Sowoni_Character_Bible.md`, `DreamTown_Character_SSOT.md` — 별도 넘버링 체계 |
| Location | ⏳ 미작성 | `SSOT-KNOWLEDGE-002` 9절에서 이미 "미작성"으로 표시됨. 현재는 `ORIGIN-xxx.md` Seed 문서들(`ORIGIN-001_Odongdo.md`, `ORIGIN-002_Hyangiram.md`)이 사실상 이 역할의 일부를 대신하고 있음 |
| Route | ⏳ 미작성 | 관련 코드/데이터 없음 |
| Image | ⏳ 미작성 | `SSOT-KNOWLEDGE-002` 9절에서 "SSOT-IMG-001, 미작성"으로 이미 예고됨 |
| Animation | ⏳ 미작성 | — |
| Product | ⏳ 미작성 | Product Constitution과 동일하게 예정 상태 |
| Manufacturing | ⏳ 미작성 / 대상 미확인 | 이번 조사 범위에서 실체를 확인하지 못함 — 실제로 필요한 영역인지부터 확인 필요 |
| QA | ⏳ 미작성 | Universe Bible상 "여의보주"라는 QA 팀 역할명은 있으나 SSOT 문서는 없음 |

### ⚠ 구조적 발견 — 두 개의 병렬 SSOT 체계

이 지도를 작성하며 확인한 중요한 사실: **"SSOT"라는 이름의 문서 체계가 이미 서로 다른 저장소 두 곳에 독립적으로 존재한다.**

1. `sowon-dreamtown/docs/YAKB/99_SSOT/` — 이번 세션에서 구축한 번호 체계(`SSOT-KNOWLEDGE-00X`, `SSOT-LANG-00X`, `SSOT-OS-001`)
2. `daily-miracles-mvp/docs/ssot/core/` — DreamTown 세계관·캐릭터·시스템 SSOT 군(`DreamTown_Naming_System_SSOT.md`, `DreamTown_Universe_Bible.md`, `DreamTown_Character_SSOT.md`, `DreamTown_Aurora5_System_SSOT.md` 등, 번호 체계 없음)

두 체계는 서로를 참조하지 않는다. `Project_Phoenix_Language_Audit.md`가 다룬 용어 충돌(Somangi/Somanggi 등)이 바로 이 두 체계가 서로 모르는 채 각자 발전해서 생긴 결과다. **이 지도(SSOT-OS-001) 자체가 두 체계를 처음으로 한 문서에서 나란히 인식한 시점**이며, 실제 통합은 후속 RFC-OS 대상이다.

---

## 4. Journey Layer

대표님과 오늘 확정한 구조.

```
일상
  ↓
문제
  ↓
소원
  ↓
DreamTown
  ↓
Journey
  ↓
기억 봉인
  ↓
세 이레(21일)
  ↓
동행
  ↓
재방문
  ↓
나눔
  ↓
새 Journey
```

> **신규 확정 사항**: "세 이레(21일)"과 "기억 봉인"은 오늘 이전 어떤 문서에도 등장하지 않던 표현으로, 본 문서에서 최초로 공식 Journey 구조에 편입되었다. 이 흐름은 9절 Time Layer(3개월/6개월 주기)와 짝을 이룬다 — Journey Layer가 "무엇을 겪는가"라면, Time Layer는 "그것이 얼마의 시간 위에서 벌어지는가"를 규정한다.

---

## 5. Product Layer

```
반투명 = 가능성을 품은 별
  ↓
황금 = 약속을 기억하는 별
  ↓
야광 = 동행의 별
  ↓
기억의 별
  ↓
별자리
```

> **원문 대조 안내**: 이 다섯 용어는 `SSOT-LANG-001` 5절 "Product Language"와 동일 계열이다. 원문에서 "기억의 별"/"별자리" 뒤에 정의가 생략되어 있어, `SSOT-LANG-001`에 이미 등록된 전체 정의를 아래에 그대로 인용한다 — **새 정의를 만들지 않고 기존 캐논을 그대로 따른다**(2절 Language Architecture 원칙).
>
> | 상태 | 정의(`SSOT-LANG-001` 5절 원문) |
> |------|-------------------------------|
> | 반투명 | 가능성을 품은 별 |
> | 황금 | 약속을 기억하는 별 |
> | 야광 | 동행의 별 |
> | 별의 기억 | Journey 봉인 |
> | 별자리 | 연결된 삶 |
>
> 오늘 두 지시문(`TASK-LANG-002`, `TASK-OS-001`) 사이에서 "별의 기억"/"기억의 별"처럼 어순이 미세하게 흔들린 것 자체가, `Project_Phoenix_Language_Audit.md`가 지적한 "여러 문서가 같은 개념을 조금씩 다르게 반복 선언"하는 패턴이 오늘 이 대화 안에서도 재현된 사례다. 이 문서는 `SSOT-LANG-001` 쪽 표기를 캐논으로 따른다.

---

## 6. Knowledge Layer

```
Legacy
  ↓
Origin
  ↓
Seed
  ↓
Knowledge
  ↓
Journey Knowledge
```

> **원문 대조 안내**: `SSOT-KNOWLEDGE-002_Knowledge_Lifecycle.md`가 이미 정의한 전체 7단계(Legacy → Origin → Seed → Journey Knowledge → Story → AI Response → DreamTown Experience)의 **요약뷰**다. 이 절이 추가한 "Knowledge" 노드는 Seed가 조직화되어 재사용 가능한 지식 총체로 통합되는 단계를 지도상에서 강조하기 위한 표기이며, 이를 `SSOT-KNOWLEDGE-002`의 정식 5번째 단계로 승격할지는 별도 RFC 대상이다. 전체 정의와 승격 조건은 `SSOT-KNOWLEDGE-002`를 따른다.

---

## 7. AI Layer

```
Aurora
  ↓
Aurum
  ↓
Witness
  ↓
Long-Term Companion
  ↓
Memory
  ↓
Companion
```

> **원문 대조 안내**: Aurora/Aurum/Witness/Long-Term Companion은 `SSOT-LANG-001` 3·7절에 이미 정의되어 있다. **"Memory"와 "Companion"은 이번에 처음 등장한 용어**로, `SSOT-LANG-001`의 Canon Language 표에는 아직 없다. 이 흐름도가 Aurora→Aurum→Witness→Long-Term Companion 다음 단계로 Memory·Companion을 배치한 것은 **새로운 관계 설정**이므로, 이 두 용어의 정의를 `SSOT-LANG-001` 3절에 추가하는 RFC-LANG 작업을 후속 과제로 남긴다(10절 참조). "Companion"이 "Long-Term Companion"과 어떻게 다른지(포괄 개념인지, 더 짧은 관계인지)도 그 RFC에서 함께 정의되어야 한다.

---

## 8. Service Layer

대표님이 구상한 모든 서비스를 연결.

```
YouTube
  ↓
DreamTown
  ↓
Journey App
  ↓
별씨앗
  ↓
Community
  ↓
AI Companion
  ↓
Memory
  ↓
재방문
```

### 실제 구축 상태 (`Aurora_Aurum_Audit.md` 교차 확인)

| 서비스 | 상태 |
|--------|------|
| YouTube | 이번 감사 범위에서 연동 코드·전략 문서를 확인하지 못함 — 구상 단계로 파악 |
| DreamTown | ✅ 실서비스 중 (`daily-miracles-mvp`, `app.dailymiracles.kr`) |
| Journey App | ⏳ 별도 앱으로서의 실체를 확인하지 못함 — `sowon-dreamtown`이 관련 시도로 보이나 현재 미커밋·미완성 상태(`Aurora_Aurum_Audit.md` 3-d 참조) |
| 별씨앗 | ✅ 데이터 모델로 존재(`dt_wishes`/`dt_stars`), 다만 3개 저장소에 파편화(`SSOT-KNOWLEDGE-003` 8절 참조) |
| Community | 부분적으로 존재 — `free`(자유게시판) 등 게시판 형태로만 확인됨, "Community"라는 이름의 통합 제품은 아직 없음 |
| AI Companion | ⏳ 미구현 — `Aurora_Aurum_Audit.md` 7절에서 "Journey Companion 개념 자체가 미구현"으로 이미 결론 |
| Memory | ⏳ 미구현 — 7절과 동일 사유, `DtJournal` 필드가 유일한 씨앗 |
| 재방문 | 부분 인프라 존재 — 리텐션 크론(`retention-cron.js`, Day1/3/7 알림)은 있으나 이 Service Layer가 그리는 "나눔 이후의 재방문" 개념과는 목적이 다름(마케팅성 이탈 방지에 가까움) |

---

## 9. Time Layer

오늘 새롭게 발견한 핵심.

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

Project Phoenix는 공간뿐 아니라 시간도 설계한다.

> 4절 Journey Layer의 "세 이레(21일)"이 **첫 의식의 주기**라면, 이 Time Layer의 "3개월/6개월"은 **그 이후의 장기 회고 주기**로 읽힌다 — 두 절 모두 오늘 처음 확정된 것이므로, 이 대응 관계 자체도 아직 공식 정의는 아니고 이 지도가 제안하는 해석이다. 정식 정의가 필요하면 Journey Constitution(2절, 작성 예정) 몫으로 남긴다.

---

## 10. OS Map

한 장으로 전체 구조를 도식화한다.

```
Purpose
  ↓
Journey
  ↓
Language
  ↓
Knowledge
  ↓
Experience
  ↓
AI
  ↓
Product
  ↓
Memory
  ↓
Community
  ↓
Service
```

> 이 10줄은 1~9절의 각 Layer를 이 문서 하나로 압축한 목차다. 처음 이 프로젝트에 합류하는 개발자·디자이너·AI·파트너는 이 도식만 보고, 필요한 절로 바로 이동하면 된다.

---

## 11. 구축 상태 요약 및 다음 작업 (추가 확인)

이 문서를 작성하며 확인된, 후속 RFC가 필요한 항목을 모아둔다(임의로 지금 결정하지 않는다).

| # | 항목 | 필요한 다음 결정 |
|---|------|--------------------|
| 1 | Knowledge Constitution 단일화 여부 | `SSOT-KNOWLEDGE-001/002/003` 3편을 그대로 둘지, `Knowledge_Constitution.md`로 통합할지 |
| 2 | 두 SSOT 체계의 병존 (`sowon-dreamtown/docs/YAKB/99_SSOT/` vs `daily-miracles-mvp/docs/ssot/`) | 통합/상호 참조 방식 결정 — `SSOT-LANG-002 Migration List`와 유사한 방식의 "SSOT 통합 계획" 문서가 필요할 수 있음 |
| 3 | "Memory"·"Companion" 용어 정의 부재 | `SSOT-LANG-001` 3절에 추가하는 RFC-LANG 필요 |
| 4 | Product Layer 어순 미세 불일치("별의 기억" vs "기억의 별") | 이번 문서는 `SSOT-LANG-001` 표기를 그대로 따름 — 추가 조치 불필요, 참고용 기록만 남김 |
| 5 | Knowledge Layer의 "Knowledge" 노드 승격 여부 | `SSOT-KNOWLEDGE-002` Lifecycle 5단계 승격 RFC 필요 |
| 6 | Journey/Experience/Product/AI Constitution 작성 순서 | 미정 — 다음 세션에서 우선순위 논의 필요 |

이 문서는 지도이므로, 위 6개 항목이 미해결이어도 지도 자체는 유효하다 — 지도가 가리키는 목적지(각 Constitution/SSOT) 중 아직 도착하지 않은 곳이 있다는 뜻일 뿐이다.
