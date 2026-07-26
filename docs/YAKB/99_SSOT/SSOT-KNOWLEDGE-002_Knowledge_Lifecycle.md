# SSOT-KNOWLEDGE-002: Knowledge Lifecycle

---

**최상위 Authority:** `docs/YAKB/00_ARCHITECTURE/Architecture_Constitution.md` (SSA — Foundation. 본 문서와 Constitution이 충돌하면 Constitution이 우선한다)
**목적:** Project Phoenix의 모든 Knowledge가 생성, 성장, 활용되는 전체 생명주기를 정의한다.
**상태:** 표준 확정
**버전:** 1.0
**작성일:** 2026-07-03
**연계 문서:** `SSOT-KNOWLEDGE-001_Origin_Generation_Guide.md` (Legacy→Origin 단계의 실행 절차), `PROJECT-PHOENIX.md`, `SEED_FIRST_PRINCIPLE.md`, `YAKB_Standard.md`

---

## 1. 목적

Knowledge는 문서가 아니다.

시간이 지날수록 성장하는 자산이다.

---

## 2. Lifecycle

```
Legacy
  ↓
Origin
  ↓
Seed
  ↓
Journey Knowledge
  ↓
Story
  ↓
AI Response
  ↓
DreamTown Experience
```

---

## 3. 단계 정의

**Legacy**
- 원본 데이터
- SQL
- HTML
- 이미지
- 동영상

**Origin**
- 최초 구조화
- Source Trace
- 검증 완료

**Seed**
- 재사용 가능한 지식
- 메타데이터 부여
- 검색 가능

**Journey Knowledge**
- 장소 간 연결
- 감정 연결
- 추천 경로 생성

**Story**
- DreamTown
- 영상
- 여행 코스
- 콘텐츠

**AI Response**
- 챗봇
- 추천
- 검색
- RAG

**DreamTown Experience**
- 사용자 경험
- 여행
- 제품
- 영상
- 커뮤니티

---

## 4. 단계별 입력 / 출력

```
Legacy
  ↓
Origin.md
  ↓
Seed
  ↓
Journey
  ↓
Story
  ↓
AI
  ↓
Experience
```

---

## 5. 승격 조건

| 전환 | 승격 조건 |
|------|-----------|
| Legacy → Origin | Source Trace / 검증 완료 |
| Origin → Seed | 메타데이터 / 태그 / 품질 검증 |
| Seed → Journey | 다른 Seed와 연결 |
| Journey → Story | 콘텐츠 제작 가능 |
| Story → AI | AI 응답 가능 |
| AI → Experience | 실제 사용자에게 제공 |

각 전환은 이전 단계를 대체하지 않는다. Origin이 Seed로 승격되어도 Origin은 남아 있으며, Seed가 Journey로 확장되어도 Seed는 그대로 존재한다 — 아래로 흐를수록 위 단계가 사라지는 것이 아니라, 위 단계를 참조하며 새로운 층이 쌓인다.

---

## 6. Version 관리

Knowledge는 문서 하나하나가 아래 Status 중 하나를 가진다.

```
Draft → Review → Approved → Published → Archived
```

- **Draft**: 최초 작성, 아직 검증 전 (예: 4절 완료 기준을 통과하지 못한 Origin Seed)
- **Review**: Source Trace·중복 제거 등 검증 진행 중
- **Approved**: `SSOT-KNOWLEDGE-001` 9절 완료 기준 전항목 통과
- **Published**: Journey/Story/AI 등 하위 단계에서 실제로 참조·활용 중
- **Archived**: 더 이상 갱신되지 않지만 삭제하지 않고 이력으로 보존 (7절 원칙 참조)

---

## 7. 운영 원칙

Knowledge는 삭제하지 않는다.

개정한다.

Source는 항상 추적 가능해야 한다.

모든 Story는 Knowledge에서 생성된다.

AI는 Knowledge를 기반으로 답변한다.

---

## 8. 적용 범위

이 Lifecycle은 아래 모든 Knowledge 유형에 동일하게 적용된다.

- Location
- Restaurant
- Festival
- Route
- Product
- Character
- Video
- Image
- FAQ

---

## 9. 연계 SSOT

| 문서 | 역할 | 상태 |
|------|------|------|
| `SSOT-KNOWLEDGE-001` (Origin Generation Guide) | Legacy → Origin 단계의 실행 절차 정의 | ✅ 작성 완료 |
| `SSOT-KNOWLEDGE-002` (본 문서) | 전체 Lifecycle 정의 | ✅ 작성 완료 |
| `SSOT-IMG-001` | 이미지 자산(Priority 3) 처리 표준 | ⏳ 미작성 — 향후 필요 시 작성 |
| `SSOT-VID-001` | 동영상 자산 처리 표준 | ⏳ 미작성 — 향후 필요 시 작성 |
| `SSOT-LOC-001` | Location(장소) Knowledge 표준 | ⏳ 미작성 — 향후 필요 시 작성 |

> `SSOT-IMG-001`, `SSOT-VID-001`, `SSOT-LOC-001`은 아직 존재하지 않는다. 이 문서에서 이름만 먼저 확정해 두고, 각 자산 유형의 처리량이 실제로 쌓여 표준화가 필요한 시점에 `SSOT-KNOWLEDGE-001`과 동일한 형식(정정 요약 박스 포함)으로 작성한다.

---

## 10. 최종 원칙

Project Phoenix의 최종 자산은

웹사이트가 아니다.

영상도 아니다.

성장하는 Knowledge이다.
