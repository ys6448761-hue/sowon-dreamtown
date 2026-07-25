# SSOT-PASSPORT-001: DreamTown Passport

---

**목적:** DreamTown Passport는 단순한 디지털 회원증이나 스탬프북이 아니다. Passport는 사용자의 Journey, Growth, Star Seed, Star Trace를 하나의 경험으로 연결하는 공식 인터페이스이다. 향후 모든 DreamTown 서비스는 Passport를 중심으로 사용자의 성장과 경험을 기록한다.
**최상위 Authority:** `docs/YAKB/00_ARCHITECTURE/Architecture_Constitution.md` (SSA — Foundation)
**Level:** Domain SSOT (Passport) — `SSOT-GROWTH-001`을 사용자 경험으로 보여주는 Experience Interface. 새로운 성장 구조를 정의하지 않는다.
**Status:** Approved (`GOV-001` Lifecycle 기준)
**버전:** 1.0.1 (SSOT-STARTRACE-001 교차 참조 반영)
**확정일:** 2026-07-04 (최초) / 2026-07-05 (SSOT-STARTRACE-001 반영)
**변경 절차:** `GOV-001_Governance_Lifecycle.md` 6절 RFC Policy 참조 — SSOT 구조 변경은 RFC 필요
**근거 자료:** `SSOT-GROWTH-001_Growth_Architecture.md`(5-4절 "Passport 미존재" 발견을 해소하는 문서), `SSOT-JOURNEY-001`, `SSOT-LANG-001`

> This SSOT is governed by CORE-PRINCIPLES-001.

---

## 1. Purpose

DreamTown Passport는 사용자의 성장을 기록하고 연결하는 공식 Experience Interface이다.

Passport는 Growth Architecture를 사용자에게 보여주는 창이며, Star Trace를 담는 그릇이다.

---

## 2. Position

Passport는 다음 구조를 따른다.

```
Growth Architecture
  ↓
Star Trace
  ↓
DreamTown Passport
  ↓
User Experience
```

Passport는 Growth를 생성하지 않는다.

Growth를 기록하고 보여주며 다음 Journey를 제안한다.

---

## 3. Core Roles

Passport의 핵심 역할은 다음과 같다.

### Identity
사용자의 DreamTown 신원

### Journey
방문한 Journey 기록

### Growth
현재 성장 단계 표시

### Star Trace
성장의 흔적 기록

### Star Seed
보유 및 성장 상태 표시

### Memory
사진, 기록, 추억 연결

### Future Journey
다음 Journey 추천

---

## 4. Growth Mapping

Passport는 `SSOT-GROWTH-001`을 그대로 따른다.

```
Origin
  ↓
Wish
  ↓
Star Seed
  ↓
Journey
  ↓
Action
  ↓
Growth
  ↓
Star
  ↓
Constellation
  ↓
Galaxy
```

Passport는 새로운 성장 단계를 정의하지 않는다.

---

## 5. Star Trace Mapping

Passport는 Star Trace를 공식 기록 체계로 사용한다.

예시

- Journey 완료
- Star Seed 획득
- 성장 단계 변경
- 특별 이벤트
- 재회
- 커뮤니티 활동

> **용어 정정(2026-07-04, 원 지시서 대비)**: 원 지시서 예시는 "재방문"이었으나, `SSOT-LANG-001` 3-1절이 이미 확정한 역할 구분(재방문=운영/CRM/통계 용어, 재회=Journey 경험/사용자 메시지 용어)에 따라 **Passport는 사용자 대면 Experience Interface이므로 "재회"로 표기했다.** Passport 자체가 이번에 처음 작성되는 문서이므로, 기존 LOCKED 텍스트를 고치는 것이 아니라 신규 문서에 이미 확정된 Canon을 정확히 반영한 것이다.
>
> **✅ 처리 현황(2026-07-05, TASK-STARTRACE-001)**: 위 예시는 `SSOT-STARTRACE-001_Star_Trace.md`의 공식 Event Category(Journey Started/Completed, Star Seed Acquired, Growth Advanced, Memory Added, Reunion Experienced, Special Moment)로 정식 구체화되었다. 단, "커뮤니티 활동"은 그 Event Category 목록에 정확히 대응하는 항목이 없다 — Special Moment로 흡수될지 별도 Category가 필요할지는 `SSOT-STARTRACE-001` 4절의 RFC 절차 대상이다.

---

## 6. UI Principles

Passport UI는 다음 원칙을 따른다.

- 성장은 숫자보다 이야기로 표현한다.
- 배지는 목적이 아니라 결과이다.
- 사용자는 현재 위치보다 다음 Journey를 먼저 본다.
- 경쟁보다 개인의 성장에 집중한다.
- 감정과 추억을 우선한다.

---

## 7. Data Ownership

Passport는 다음 데이터를 참조한다.

- User
- Star Trace
- Journey
- Growth
- Star Seed
- Rewards

새로운 성장 구조를 만들지 않는다.

> **참조 확인**: "Rewards"는 `SSOT-GROWTH-001` 5-5절이 확인한 **Playground Reward Engine**(`daily-miracles-mvp/services/playground/rewardService.js`, 배지+크레딧)을 가리킨다. Passport는 이 데이터를 **참조만** 하며, 9절에 따라 별도의 Reward Engine을 직접 만들지 않는다.

---

## 8. Dependency

Passport는 다음 문서를 따른다.

- Manifesto
- Core Principles
- Journey Constitution
- Growth Architecture
- Language Constitution
- Governance Lifecycle

> Architecture Constitution(SSA)은 위 목록에 없지만, 상단 메타데이터의 "최상위 Authority"로서 이 목록 전체를 관통하는 최상위 근거로 이미 명시되어 있다 — 원 지시서의 Dependency 목록을 그대로 유지하고, 이 각주로만 보완한다.

---

## 9. Out of Scope

Passport는 다음 기능을 직접 수행하지 않는다.

- 결제
- 쇼핑몰
- 관리자 기능
- 별도 Reward Engine

필요 시 다른 SSOT에서 정의한다.

---

## 10. Future Extensions

향후 Passport는 다음과 연결될 수 있다.

- 모바일 앱
- 웹 서비스
- NFC Star Seed
- QR Journey
- 커뮤니티
- Galaxy Network

본 SSOT는 확장 가능성을 열어두되 현재 구현을 강제하지 않는다.

---

## 11. Consistency Audit (신규 발견, 자동 수정하지 않음)

- **"Interface" 용어 중복 확인**: `SSOT-LANG-001` 3-3절은 Star Seed를 "DreamTown의 첫 번째 **Physical Interface**"로 정의한다. 본 문서(1절)는 Passport를 "공식 **Experience Interface**"로 정의한다. 두 용어는 서로 다른 층위(Star Seed=첫 물리적 증표 하나, Passport=전체 경험을 담는 그릇)를 가리켜 충돌은 아니지만, "Interface"라는 단어가 이제 두 가지 수식어(Physical/Experience)로 쓰이게 되었다는 점을 기록해 둔다. 필요 시 `SSOT-LANG-001` Canon Language에 "Interface" 계열 용어를 별도로 정리하는 RFC-LANG 대상이 될 수 있다.
- **Reward 실체 확인**: 9절이 "별도 Reward Engine을 만들지 않는다"고 명시한 것은, `SSOT-GROWTH-001` 5-5절이 이미 발견한 "Playground Reward Engine(진짜) vs `rewardRoutes.js`(포인트 재라벨)" 분산 문제를 Passport 레벨에서 반복하지 않겠다는 선언과 일치한다. 새로운 충돌이 아니라 기존 발견을 존중하는 설계다.
- **완료 기준의 "기존 SSOT와 충돌 없이 상호 참조만 추가"** 이행 내역은 12절 참조.

---

## 12. 상호 참조 반영 내역

`SSOT-GROWTH-001_Growth_Architecture.md`의 5-4절("Passport — 신규 개념 확인")과 4절 매핑 규칙 표는 이 문서가 존재하기 전, "Passport는 미존재"라고 기록했던 부분이다. 그 문서에 **본 SSOT를 가리키는 참조만 추가**했다(내용 재작성 없음) — 상세는 `SSOT-GROWTH-001` 해당 절 참조.

---

## 완료 보고 요약

| 확인 항목 | 결과 |
|-----------|------|
| Passport의 공식 목적 정의 | ✅ 1절 |
| Growth Architecture와 연결 | ✅ 4절, 신규 단계 정의 없음 확인 |
| Star Trace 연결 | ✅ 5절, 용어 정정 1건(재방문→재회) 반영 |
| Star Seed 연결 | ✅ 3절, "Physical Interface"와의 관계는 11절에서 정리 |
| UI 원칙 정의 | ✅ 6절 |
| 의존 관계 명시 | ✅ 8절 |
| 기존 SSOT와 충돌 없이 상호 참조만 추가 | ✅ `SSOT-GROWTH-001`에만 참조 추가, 그 외 본문 수정 없음 |
