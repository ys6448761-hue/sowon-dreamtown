# SSOT-STARTRACE-001: Star Trace

---

**목적:** Star Trace는 DreamTown에서 사용자의 성장과 경험을 기록하는 공식 기록 체계이다. 본 문서는 Star Trace가 무엇을 기록하고, 무엇을 기록하지 않으며, Growth Architecture 및 Passport와 어떻게 연결되는지를 정의한다. Star Trace는 로그(Log)가 아니라 성장의 기록(Trace)이다.
**최상위 Authority:** `docs/YAKB/00_ARCHITECTURE/Architecture_Constitution.md` (SSA — Foundation)
**Level:** Domain SSOT (Star Trace) — `SSOT-LANG-001` Canon Language의 "Star Trace"(LOCKED) 정의를 실제 기록 체계로 구체화하는 실행 표준. Canon 정의 자체는 바꾸지 않는다.
**Status:** Approved
**버전:** 1.0.0
**확정일:** 2026-07-05
**변경 절차:** `GOV-001_Governance_Lifecycle.md` 6절 참조 — Event Category 추가/변경은 RFC 필수(4절 원문에도 명시)
**근거 자료:** `SSOT-LANG-001`(Star Trace LOCKED Canon), `SSOT-GROWTH-001`, `SSOT-PASSPORT-001`, `EXPERIENCE-CONSTITUTION-001`

> This SSOT is governed by CORE-PRINCIPLES-001.

---

## 1. Purpose

Star Trace는 사용자의 Journey를 시간순으로 저장하는 기능이 아니다.

사용자의 의미 있는 성장 순간을 연결하는 공식 기록 체계이다.

---

## 2. Position

```
Growth Architecture
  ↓
Journey
  ↓
Star Trace
  ↓
Passport
  ↓
Memory
```

Star Trace는 Growth를 생성하지 않는다.

Star Trace는 Growth를 기록하고 의미를 부여한다.

> **`SSOT-PASSPORT-001` 2절과의 관계(충돌 아님, 12절 참조)**: `SSOT-PASSPORT-001`은 "Growth Architecture → Star Trace → Passport → User Experience"로 더 압축된 체인을 쓴다. 이 문서는 그 사이에 "Journey"(Star Trace가 실제로 기록하는 대상)를 끼워 넣고, 끝을 "User Experience"(포괄적 결과)가 아니라 "Memory"(`SSOT-PASSPORT-001` 3절의 Core Role 중 하나)로 구체화했을 뿐이다. 두 다이어그램은 같은 순서(Growth Architecture 다음에 Star Trace, 그 다음에 Passport)를 공유하며 서로 다른 확대 배율일 뿐 모순되지 않는다.

---

## 3. Recording Principles

Star Trace는 다음 기준을 만족하는 이벤트만 기록한다.

- Journey의 중요한 전환점
- Growth 단계 변화
- Star Seed 획득 및 성장
- 재회가 이루어진 순간
- 특별한 감정적 경험
- 사용자가 스스로 의미 있다고 남긴 기록

기술적인 내부 이벤트는 기록 대상이 아니다.

---

## 4. Event Categories

공식 Event Category

- Journey Started
- Journey Completed
- Star Seed Acquired
- Growth Advanced
- Memory Added
- Reunion Experienced
- Special Moment

새로운 Category는 RFC를 통해 추가한다.

> **분류 확인(11절 상세)**: 이 7개는 `SSOT-LANG-001` Canon Language에 해당하는 "공식 용어"(Somangi, Star Trace, 재회 등 철학적·브랜드 용어)가 아니라, Star Trace 데이터 스키마의 **기술적 이벤트 유형(enum) 이름**이다. "구현 원칙"의 "새로운 공식 용어는 RFC 없이 추가하지 않는다"는 이미 이 절 자체가 "새 Category는 RFC를 통해 추가한다"고 명시해 지키고 있다 — 이 7개는 이번 문서 작성으로 최초 정의되는 것이며, Language Canon에는 등재하지 않는다.

---

## 5. Star Trace Entry

각 기록은 최소한 다음 정보를 가진다.

- Event Type
- Timestamp
- Journey
- Growth Stage
- Related Star Seed (선택)
- Memory (선택)
- User Reflection (선택)

> "Growth Stage" 필드는 새로운 성장 단계 체계를 만드는 것이 아니라 `SSOT-GROWTH-001`의 9단계(Origin~Galaxy) 값을 그대로 참조한다.

---

## 6. Relationship

Star Trace는 다음 문서를 따른다.

- Growth Architecture
- Experience Constitution
- Journey Constitution
- Passport SSOT
- Language Constitution

---

## 7. Non-goals

Star Trace는 다음을 하지 않는다.

- 사용자 행동 전체를 추적하지 않는다.
- 광고 분석용 로그를 만들지 않는다.
- 체류 시간을 경쟁 지표로 사용하지 않는다.
- 모든 클릭을 저장하지 않는다.

---

## 8. Privacy Principles

기록은 사용자의 성장과 기억을 위한 것이다.

분석보다 의미를 우선한다.

사용자는 자신의 Star Trace를 열람하고 관리할 수 있어야 한다.

---

## 9. Experience Review

새로운 기록 항목을 추가하기 전에 확인한다.

- Growth와 연결되는가?
- Experience Constitution과 일치하는가?
- 사용자에게 의미 있는 기억인가?
- 단순 분석용 데이터는 아닌가?

---

## 10. Completion Criteria

- [x] Star Trace의 공식 목적 정의
- [x] 기록 대상과 비대상 정의(3·7절)
- [x] Event Category 정의(4절, Language Canon과 구분됨을 명시)
- [x] Passport 및 Growth Architecture와 연결(2·5절)
- [x] Privacy 원칙 정의(8절)
- [x] 기존 SSOT와 충돌 없이 상호 참조만 추가(12절)

---

## 11. Consistency Audit (신규 발견, 자동 수정하지 않음)

- **Position 다이어그램 차이**: 2절 각주 참조 — 충돌 아님, 확대 배율 차이.
- **Event Category vs Language Canon**: 4절 각주 참조 — 기술적 이벤트 유형이지 새 공식 용어가 아님.
- **기존 분석 인프라와의 경계**: `Aurora_Aurum_Audit.md`가 확인한 `daily-miracles-mvp`의 마케팅/퍼널 분석 시스템(`marketing_events` 테이블, GitHub Actions "Daily Funnel Report" 등)은 이미 실재한다. 7절 Non-goals("광고 분석용 로그를 만들지 않는다", "체류 시간을 경쟁 지표로 사용하지 않는다")는 Star Trace가 **그 시스템과 별개**임을 명확히 하는 경계선이다 — 기존 분석 인프라를 대체하거나 통합하려는 것이 아니라, 애초에 다른 목적(의미 있는 성장 기록)의 별도 체계임을 선언한다.
- **"재회" 사용 확인**: Event Category의 "Reunion Experienced"는 `SSOT-LANG-001` 3-1절이 확정한 "재회(Journey 경험 용어)"와 정확히 일치한다 — "재방문"이 아니라 "재회"가 기록 대상이라는 점이 Star Trace의 경험 중심적 성격과 일관된다.

---

## 12. 상호 참조 반영 내역

`SSOT-LANG-001`의 Star Trace Canon 항목, `SSOT-GROWTH-001`의 Star Trace 대응 절(5-3절), `SSOT-PASSPORT-001`의 Star Trace Mapping(5절)에 **본 문서를 가리키는 참조만 추가**했다(내용 재작성 없음).

---

## 완료 보고 요약

| 확인 항목 | 결과 |
|-----------|------|
| Star Trace의 공식 목적 정의 | ✅ 1절 |
| 기록 대상과 비대상 정의 | ✅ 3·7절 |
| Event Category 정의 | ✅ 4절 — Language Canon과 구분되는 기술적 분류임을 명시 |
| Passport 및 Growth Architecture와 연결 | ✅ 2·5절, 기존 Position 다이어그램과의 차이는 확대 배율 차이로 정리(11절) |
| Privacy 원칙 정의 | ✅ 8절 |
| 기존 SSOT와 충돌 없이 상호 참조만 추가 | ✅ 12절 — `SSOT-LANG-001`/`SSOT-GROWTH-001`/`SSOT-PASSPORT-001`에 참조만 추가 |
