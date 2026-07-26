# SSOT-TRUST-001: Trust Framework

---

**최상위 Authority:** `docs/YAKB/00_ARCHITECTURE/Architecture_Constitution.md` (SSA — Foundation. 본 문서와 Constitution이 충돌하면 Architecture Constitution이 우선한다)
**목적:** Project Phoenix 전체 Knowledge(Origin, Route, Story 등 모든 Seed/Node 문서)의 출처 신뢰도를 7단계로 분류해, SSOT 포함 가부와 Journey AI 활용 범위를 결정하는 표준을 정의한다.
**Status:** Approved
**Level:** Domain SSOT (Trust/Verification) — Architecture Constitution 하위, `SSOT-KNOWLEDGE-001`(Origin Generation Guide)의 "Trust Level 근거" 요구 조항이 참조하는 실행 표준
**버전:** 1.0.0 (RFC-TRUST-001/002 Execution — 최초 SSOT 등재)
**확정일:** 2026-07-26 (RFC-TRUST-001 Approved Candidate 승인, RFC-TRUST-002 Implementation Plan 실행)
**Origin:** `ProjectPhoenix/Framework/TRUST-FRAMEWORK.md`(2026-07-02 최초 작성, ProjectPhoenix Framework Layer) — 이 문서는 그 원본 내용을 그대로 계승하며, 원본 자체는 수정·이동·삭제하지 않는다(`RFC-TRUST-002` §3 참조 관계 계획 그대로 적용)
**변경 절차:** `GOV-001_Governance_Lifecycle.md` §6 RFC Policy(SSOT 구조 변경은 RFC 필요) — 임의 변경 금지
**Category(`RFC-LANG-004` Decision 2 체계 적용):** Trust/Verification

> This SSOT is governed by CORE-PRINCIPLES-001.

---

> ## 등재 이력
> **2026-07-26 — 최초 등재(`RFC-TRUST-001` Approved Candidate 결정 +
> `RFC-TRUST-002` Implementation Plan 실행, Execution Sprint 1)**:
> `ProjectPhoenix/Framework/TRUST-FRAMEWORK.md`의 7단계 정의를 그대로
> 계승해 YAKB SSOT로 최초 등재했다. 내용은 무수정 계승이며, 등급 재설계나
> 신규 Rule 생성은 하지 않았다. 이미 `docs/YAKB/02_SEEDS/Origin/
> ORIGIN-001_Odongdo.md`, `ORIGIN-002_Hyangiram.md`가 이 등급 체계
> (Level 4 Field Insight, Level 6 Customer Voice)를 실사용 중이었으므로,
> 이 두 문서는 소급 수정 없이 그대로 유효하다(`RFC-TRUST-001` §4 운영
> Evidence 참조).

---

## 1. 신뢰 등급 체계

모든 지식은 7단계 신뢰 등급 중 하나를 가진다.

등급 없는 지식은 SSOT에 포함하지 않는다.

---

## 2. 등급 정의

### Level 1 — Official

- 정의: 공공기관, 지자체, 공식 기관 발행 자료
- 예시: 여수시청, 문화재청, 한국관광공사 공식 발표
- 검증 방법: 공식 출처 URL 또는 문서 번호 기재
- 유효기간: 발행일 기준, 개정 시 자동 업데이트 필요

### Level 2 — Public Data

- 정의: 공개된 통계, 데이터베이스, 오픈 데이터
- 예시: 관광 통계, Wikidata, 공공 데이터포털
- 검증 방법: 데이터 출처 URL + 수집일 기재
- 유효기간: 데이터 갱신 주기에 따라 검토

### Level 3 — Verified Web

- 정의: 신뢰할 수 있는 미디어, 검증된 온라인 출처
- 예시: 언론 기사, 공식 SNS, 검증된 여행 블로그
- 검증 방법: URL + 작성자 + 발행일 기재
- 유효기간: 발행일 기준 2년 후 재검토

### Level 4 — Field Insight

- 정의: 현장 전문가의 직접 경험과 지식
- 예시: 문화관광해설사, 사진작가, 현지 여행사 직원
- 검증 방법: 기여자 이름 + 역할 + 취득일 기재
- 유효기간: 연 1회 재확인 권장

### Level 5 — Community Insight

- 정의: 검증된 커뮤니티나 체험단의 집합적 경험
- 예시: 체험단 보고서, 여행 동호회 정보
- 검증 방법: 출처 그룹명 + 취득일 기재
- 유효기간: 취득일 기준 1년 후 재검토

### Level 6 — Customer Voice

- 정의: 개별 고객의 경험 후기와 피드백
- 예시: 투어 참가자 리뷰, DreamTown 소원이 피드백
- 검증 방법: 익명 처리 후 수집일 기재
- 유효기간: 수집일 기준 참고용으로만 활용

### Level 7 — Hypothesis

- 정의: 아직 검증되지 않은 가설, 추정, 아이디어
- 예시: 현장 미확인 정보, 추정 데이터
- 검증 방법: 가설 근거 + 검증 예정일 기재
- 유효기간: 검증 전까지 Journey AI 답변 기반으로 사용 불가

---

## 3. 기록 형식

모든 지식에는 다음 메타데이터를 포함한다.

```markdown
- Trust Level: Level {1~7}
- 출처: {URL 또는 기여자명}
- 검증일: YYYY-MM-DD
- 검증자: {이름 또는 역할}
- 유효기간: YYYY-MM-DD 또는 "상시"
```

---

## 4. 활용 기준

| Level | Journey AI 답변 활용 | SSOT 포함 |
|-------|---------------------|-----------|
| 1 — Official | 가능 | 가능 |
| 2 — Public Data | 가능 | 가능 |
| 3 — Verified Web | 가능 (출처 명시) | 가능 |
| 4 — Field Insight | 가능 (기여자 명시) | 가능 |
| 5 — Community Insight | 참고용 | 조건부 |
| 6 — Customer Voice | 감정 레이어 한정 | 익명 처리 후 |
| 7 — Hypothesis | 불가 | 불가 |

---

## 5. 기존 Candidate Pipeline 연계 (참조만, 신규 절차 아님)

이 SSOT가 정의하는 등급 체계 자체를 향후 개정하려면, 다른 모든 공식
용어와 동일하게 아래 경로를 따른다(`RFC-LANG-003` 추가 원칙과 동일 원리
적용) — **이 경로는 새로 만드는 것이 아니라 이미 존재하는 두 절차를
연결한 것이다.**

```
Framework(ProjectPhoenix 등)가 등급 체계 변경을 제안한다
      ↓
docs/YAKB/02_SEEDS/Candidates/에 CAND-* 문서로 등록(GOV-001 Idea→Draft→Review)
      ↓
RFC-TRUST-{n} 작성(GOV-001 §6 RFC Policy)
      ↓
대표(CEO) Approved
      ↓
본 SSOT-TRUST-001 개정
```

---

## 6. 운영 Evidence (참조, `RFC-TRUST-001` §4에서 이미 확인됨)

- `docs/YAKB/02_SEEDS/Origin/ORIGIN-001_Odongdo.md`: "Trust Level: Level 4 (Field Insight — 여수여행센터 관리자/운영자 작성)" 실사용
- `docs/YAKB/02_SEEDS/Origin/ORIGIN-002_Hyangiram.md`: 동일 형식 실사용
- `docs/YAKB/99_SSOT/SSOT-KNOWLEDGE-001_Origin_Generation_Guide.md`: 모든 Origin 문서에 "Trust Level 근거" 절 기재를 템플릿 필수 항목으로 요구(이번 등재로 그 요구가 참조할 실제 정의 문서가 확정됨)

---

## Governance

`GOV-001_Governance_Lifecycle.md` §6 RFC Policy를 따른다. 본 문서는
`RFC-TRUST-001`(Approved Candidate 결정)과 `RFC-TRUST-002`(Implementation
Plan)의 승인된 범위 내에서만 생성되었다 — 등급 재설계, 새 Rule 생성,
Framework 원본 변경은 수행하지 않았다.
