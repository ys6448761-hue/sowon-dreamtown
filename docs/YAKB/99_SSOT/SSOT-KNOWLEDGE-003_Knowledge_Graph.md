# SSOT-KNOWLEDGE-003: Knowledge Graph

---

**최상위 Authority:** `docs/YAKB/00_ARCHITECTURE/Architecture_Constitution.md` (SSA — Foundation. 본 문서와 Constitution이 충돌하면 Constitution이 우선한다)
**목적:** Project Phoenix의 모든 Knowledge를 하나의 연결된 그래프로 관리하기 위한 표준을 정의한다.
**상태:** 표준 확정 (그래프 구조 자체는 확정, 실제 연결 데이터는 Node 유형별 Seed가 아직 부족해 부분 구축 상태 — 4절 참조)
**버전:** 1.0
**작성일:** 2026-07-03
**연계 문서:** `SSOT-KNOWLEDGE-001_Origin_Generation_Guide.md`, `SSOT-KNOWLEDGE-002_Knowledge_Lifecycle.md`

---

## 1. 목적

Knowledge는 독립 문서가 아니다.

모든 Knowledge는 서로 연결된다.

---

## 2. 핵심 노드(Node)

- Location
- Route
- Origin
- Story
- Image
- Video
- Product
- Restaurant
- Festival
- FAQ
- Character
- Journey

---

## 3. 연결(Relationship)

```
Location
 ├─ 포함한다   → Route
 ├─ 등장한다   → Story
 ├─ 사용된다   → Image
 ├─ 사용된다   → Video
 ├─ 추천한다   → Restaurant
 ├─ 연결된다   → Festival
 └─ 연관된다   → Product
```

---

## 4. Origin 연결 규칙

모든 ORIGIN 문서는

관련 Location
관련 Route
관련 Story
관련 Product
관련 Image
관련 Video

를 반드시 기록한다.

이를 실제로 적용할 때는 각 `ORIGIN-xxx.md` 문서의 "6. Journey 해석" 섹션에 아래 표를 포함한다 (해당 Node가 아직 없으면 "없음 — 예정"으로 표기한다).

| 관계 유형 | 대상 ID | 근거(Source Trace 수준) |
|-----------|---------|--------------------------|
| 관련 Location | 예: `LOCATION-xxx` | |
| 관련 Route | 예: `ROUTE-xxx` | |
| 관련 Story | 예: `STORY-xxx` | |
| 관련 Product | 예: `PRODUCT-xxx` | |
| 관련 Image | 예: `_img/sub/*` 경로 | |
| 관련 Video | 예: `VIDEO-xxx` | |

> **현재 상태 안내**: `ORIGIN-001_Odongdo.md`, `ORIGIN-002_Hyangiram.md`는 이 규칙이 확정되기 전에 작성되어, 관련 Node를 위 6개 항목으로 명시적으로 구분해 기록하지는 않았다(대신 "6. Journey 해석"/"오동도 Seed와의 관계" 등 서술형으로만 연결을 표현함). Route/Story/Product/Video/Location/Image Node 자체가 프로젝트 전체에서 아직 하나도 생성되지 않아, 표에 채울 대상 ID도 아직 없는 상태다 — 현재 유일하게 존재하는 관계는 **ORIGIN-001 ↔ ORIGIN-002 (같은 SQL 게시글 `knowhow`-21에 함께 서술됨)** 이며, 이마저도 서술형으로만 기록되어 있어 위 표 형식으로는 아직 정규화되지 않았다. 이 문서 확정 이후 생성되는 `ORIGIN-003`부터는 위 표를 빠짐없이 채운다. 기존 두 문서는 소급 보강이 필요하면 별도 작업으로 진행한다.

---

## 5. Link 규칙

문서 간 ID를 사용한다.

예)

```
ORIGIN-001
  ↓
ROUTE-001
  ↓
STORY-001
  ↓
VIDEO-001
```

ID는 항상 `{TYPE}-{3자리 번호}` 형식을 따른다 (`SSOT-KNOWLEDGE-001`의 `ORIGIN-xxx.md` 명명 규칙과 동일한 원리를 모든 Node 유형에 확장 적용). 문서 본문에서 다른 Knowledge를 참조할 때는 파일명이 아니라 이 ID로 링크한다 — 파일이 이동·이름 변경되어도 그래프 관계가 끊어지지 않도록 하기 위함이다.

---

## 6. 그래프 구축 원칙

- 단방향이 아니라 **양방향 연결** (예: Location → Route 관계를 기록하면, Route 문서에도 역방향으로 해당 Location을 기록한다)
- **Source Trace 유지** (그래프 연결 자체도 근거 없이 주장하지 않는다 — 8절 품질 기준 참조)
- **삭제하지 않고 관계를 확장** (`SSOT-KNOWLEDGE-002` 7절 "Knowledge는 삭제하지 않는다" 원칙과 동일하게, 관계가 바뀌어도 이전 관계를 지우지 않고 새 관계를 추가한다)

---

## 7. AI 활용

이 그래프 구조는 아래 활용을 전제로 설계된다.

- 관련 장소 추천
- 유사 장소 탐색
- 스토리 생성
- 영상 생성
- 여행 추천
- RAG 검색

---

## 8. 품질 기준

**연결 없는 문서는 미완성이다.**

어떤 Node 문서든 3절의 Relationship 중 최소 1개 이상을 다른 Node와 맺고 있지 않으면 초안(Draft) 상태로 간주한다 (`SSOT-KNOWLEDGE-002` 6절 Status 정의와 연동).

**관계는 검증 가능한 근거를 가진다.**

"오동도와 향일암이 연결된다"처럼 관계를 서술할 때는 그 근거(예: 같은 SQL 게시글에 함께 등장, 같은 여행 코스에 함께 포함)를 Source Trace 수준으로 명시해야 한다 — 근거 없는 관계 주장은 그래프에 포함하지 않는다.

이 기준으로 현재 Node별 구축 현황을 점검하면 아래와 같다 (표준과 실측치를 혼동하지 않기 위해 투명하게 기록한다).

| Node 유형 | 존재하는 문서 | 비고 |
|-----------|----------------|------|
| Origin | `ORIGIN-001_Odongdo.md`, `ORIGIN-002_Hyangiram.md` | 2건 존재, 8개 후보 대기 중(`Legacy_to_Seed_Plan.md` 6-1절) |
| Location | 없음 | Origin과 별도 Node로 아직 분리 생성되지 않음 |
| Route | 없음 | |
| Story | 없음 | |
| Image | 없음 (Origin 문서 내부에 이미지 자산 섹션으로만 존재) | 별도 Node 문서화는 `SSOT-IMG-001`(미작성) 확정 후 진행 |
| Video | 없음 | |
| Product | 없음 | |
| Restaurant | 없음 | ORIGIN-001 "9. 다음 단계"에 `SEED-RESTAURANT-001` 후보로만 언급됨 |
| Festival | 없음 | ORIGIN-002 "6. 관련 축제"에 향일암일출제가 서술형으로만 언급됨 |
| FAQ | 없음 | |
| Character | 없음 | |
| Journey | 없음 | |

Node 대부분이 아직 없으므로, 8절 기준("연결 없는 문서는 미완성")을 엄격히 적용하면 현재 유일한 완성 Node는 없고 Origin 2건도 "부분 완성(Draft~Review)" 수준이다.

---

## 9. 연계 SSOT

| 문서 | 역할 | 상태 |
|------|------|------|
| `SSOT-KNOWLEDGE-001` (Origin Generation Guide) | Origin Seed 생성 절차 — 이 문서의 4절이 참조하는 Source Trace 규칙의 원본 | ✅ 작성 완료 |
| `SSOT-KNOWLEDGE-002` (Knowledge Lifecycle) | 전체 생명주기 — 이 문서의 6·8절이 참조하는 "삭제하지 않는다" 원칙의 원본 | ✅ 작성 완료 |

---

## 10. 최종 원칙

Project Phoenix의 Knowledge는

문서의 집합이 아니라

연결된 Journey Graph이다.
