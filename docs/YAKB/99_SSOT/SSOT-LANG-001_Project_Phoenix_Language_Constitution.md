# SSOT-LANG-001: Project Phoenix Language Constitution

---

**분류:** 이 문서는 용어집(Dictionary)이 아니다. Project Phoenix의 **언어 헌법(Language Constitution)**이다. 앞으로 생성되는 모든 공식 문서, SSOT, 코드 주석, AI Prompt, 영상, 제품, UX는 본 문서를 우선한다.
**최상위 Authority:** `docs/YAKB/00_ARCHITECTURE/Architecture_Constitution.md` (SSA — Foundation. 본 문서와 Constitution이 충돌하면 Architecture Constitution이 우선한다)
**Status:** Approved
**Level:** Domain Constitution (Language) — Architecture Constitution 하위, 개별 SSOT-KNOWLEDGE 문서 상위
**버전:** 1.5.1 (SSOT-STARTRACE-001 교차 참조 반영)
**확정일:** 2026-07-03 (최초) / 2026-07-05 (RFC-LANG-001, RFC-LANG-002, Governance Update, SSOT-GROWTH-001, SSOT-STARTRACE-001 반영)
**변경 절차:** 10절 Change Policy 참조 — 임의 변경 금지, RFC 문서 작성 필수
**근거 자료:** `docs/YAKB/01_RAW/Project_Phoenix_Language_Audit.md` (TASK-LANG-001, 전수 조사 원본), `SSOT-KNOWLEDGE-001/002/003`
**동반 문서:** `SSOT-LANG-002_Language_Migration_List.md` (영향도 분석 — 자동 수정 금지)

> This Constitution is governed by CORE-PRINCIPLES-001.

---

> ## 개정 이력
> **2026-07-04 (1차) — `RFC-LANG-001_Journey_Canon_Update.md` 반영**: `SSOT-JOURNEY-001` 작성 중 발견된 RFC 후보 중 2건을 승인·반영했다. ① "여정"을 신규 등재하고 "Journey"와의 병행 정책을 확정, ② "세 이레(21일)"를 Canon Language에 신규 등록. "재회 vs 재방문"은 이 시점엔 비교 분석·권고안만 작성되었고 확정하지 않았다.
> **2026-07-04 (2차) — `RFC-LANG-001` 항목 3 최종 승인 반영(TASK-RFC-002)**: 보류 상태였던 "재회" 권고안을 승인 처리. Canon Language에 "재회" 신규 등재, 3-1절에 "재방문(운영 용어) vs 재회(Journey 경험 용어)" 역할 구분표 추가. `RFC-LANG-001` 문서 자체도 전 항목 승인 상태로 갱신됨.
> **2026-07-04 (3차) — `RFC-LANG-002_Star_Trace_Canon.md` 반영(TASK-LANG-002, CEO 승인)**: "Life Trace"(`MANIFESTO-001` 초안에만 존재하던 미등재 용어)를 공식 용어에서 제외하고, **"Star Trace(별의 흔적)"을 LOCKED 상태로 신규 등재**. `MANIFESTO-001_Invisible_Value_Manifesto.md`의 해당 표현도 동일하게 갱신됨.
> **2026-07-04 (4차) — Governance Update 반영**: 별씨앗(Star Seed)에 "DreamTown 첫 번째 Physical Interface" 역할과 성장 구조를 3-3절로 추가. 이 과정에서 기존 3개 성장 시퀀스(Journey 구조/별 성장 5단계/DB enum)와 다른 **네 번째 병렬 시퀀스**임을 발견해 3-3절에 기록(통합은 하지 않음). Star Trace의 새 문구 변형(사용자/경험 기반 정의)도 발견해 3-2절에 기록했으나 LOCKED 정의는 변경하지 않음.
> **2026-07-04 (5차) — `SSOT-GROWTH-001_Growth_Architecture.md` 반영(TASK-GROWTH-001)**: 4개 병렬 성장 시퀀스가 공식 9단계 Growth Architecture로 통합·매핑되었다. 3-3절 원문은 변경하지 않았으며, 해당 절이 사실상 새 9단계 구조의 전신이었음이 확인되었다.
> **2026-07-05 (6차) — `SSOT-STARTRACE-001_Star_Trace.md` 반영(TASK-STARTRACE-001, 참조만 추가)**: Star Trace Canon 행에 실제 기록 체계 정의 문서로의 참조를 추가했다. LOCKED 정의는 변경하지 않았다.

---

## 1. Purpose

언어는 기능을 설명하는 것이 아니라

Journey를 설명한다.

> 모든 것은 사람의 여정을 위해 존재한다.
>
> Everything supports a Human Journey.

---

## 2. Language Architecture

언어 생성 순서

```
철학
  ↓
세계관
  ↓
Journey
  ↓
경험
  ↓
기능
  ↓
코드
```

코드가 공식 언어를 만들지 않는다.

철학이 공식 언어를 만든다.

> **근거**: `Project_Phoenix_Language_Audit.md`가 확인한 충돌(Somangi/Somanggi, Seed Star/Star Seed 등)은 전부 "철학"이 아니라 "기능/코드/개별 SSOT" 층위에서 각자 캐논을 선언해서 발생했다. 이 순서도는 그 재발을 막기 위한 규칙이다 — **철학·세계관 층위(본 문서)에서만 공식 언어가 확정되며, 하위 층위(Journey 이하)는 이를 구현할 뿐 새로 정의하지 않는다.**

---

## 3. Canon Language

공식 용어와 그 확정 상태.

| 용어 | 정의 | 확정 상태 |
|------|------|-----------|
| **예비 소원이** | 아직 소원을 품기 전, DreamTown에 처음 진입한 상태의 사람. 소원이가 되기 이전 단계 | **신규 선언** — `Project_Phoenix_Language_Audit.md`에서 코드베이스 0건으로 확인된 용어이며, 본 헌법에서 최초로 공식 등재한다(기존 발견이 아니라 신규 결정임을 명시) |
| **소원이 (Sowoni)** | 소원을 품고 여정을 시작한 사람 | 기존 확정(`DreamTown_Naming_System_SSOT.md`) |
| **소망이 (Somangi)** | 자신 안의 빛을 발견하고 다른 이의 길을 밝히는 사람. 도달점이 아니라 되어가는 상태 | **표기 확정: Somangi**(겹자 "Somanggi" 폐기, 8절 참조) |
| **아우룸 (Aurum)** | 황금 거북 안내자. 소원을 별로 인도하는 내비게이터 | 기존 확정, 표기 흔들림 없음 |
| **DreamTown** | Journey Platform의 첫 번째 Application (`Architecture_Constitution.md` 제4장) | 기존 확정 |
| **Journey** | 소원이의 전 생애에 걸친 여정. Project Phoenix가 다루는 유일한 실체. **공식 브랜드 용어(영문)** — 시스템명·제품명·국제 커뮤니케이션에서 사용 | 기존 확정 |
| **여정** | Journey의 **공식 한국어 설명 용어**. 국문 문서·화면 카피·서술형 설명에서 사용 | **신규 등재(RFC-LANG-001)** — "Journey"의 번역이나 Alias가 아니라, 각자의 문맥에서 병행 사용되는 공식 짝 용어로 확정. 어느 한쪽이 오기(誤記)가 아님 |
| **세 이레(21일)** | Journey가 일상의 리듬으로 자리 잡는 첫 번째 동행의 시간 | **신규 등록(RFC-LANG-001)** — `SSOT-JOURNEY-001` 5절 원문 정의를 그대로 승격 |
| **재회** | 과거의 자신과 현재의 자신이 다시 만나는 **Journey 의식** | **신규 등재(RFC-LANG-001 항목 3, 2026-07-04 승인)** — "재방문"과는 별도 용어로 확정(3-1절 참조). "재방문"을 대체하지 않는다 |
| **별씨앗 (Star Seed)** | 소원이 별이 되기 전 성장 단계의 씨앗. **DreamTown의 첫 번째 Physical Interface** — 소원을 행동으로 연결하는 첫 번째 증표 | 기존 확정, 영문 어순은 8절에서 확정. 역할·성장 구조는 **3-3절(2026-07-04 추가)** 참조 |
| **공명 (Resonance)** | 나눔(Nanum)과 구분되는 감정 공감 반응 체계 | 기존 확정, 나눔과의 관계는 8절에서 정리 |
| **Long-Term Companion** | 동행(同行)의 공식 영문 표기 | 기존 확정(`DreamTown_Aurora5_System_SSOT.md` §12) |
| **Witness** | 아우룸이 수행하는 공식 역할 — 별 탄생의 증인. **별도의 새 시스템이 아니라 아우룸의 역할 규정**이다 | **신규 공식화** — 설계 문서(`DreamTown_Star_Birth_Policy_Design.md`)의 "아우룸 등장: 별 탄생의 증인으로 등장" 문구를 공식 역할로 승격 |
| **Star Trace (별의 흔적)** | DreamTown에서 소원이의 성장 여정을 기록하는 공식 명칭. Origin, Star Seed, Journey, Growth, Reunion, Resonance, Sharing, Connection까지 이어지는 모든 성장 기록을 의미한다 | **🔒 LOCKED (RFC-LANG-002, CEO 승인, 2026-07-04)** — "Life Trace"를 공식 용어에서 제외하고 대체 채택. 상세는 3-2절 참조. **문구 변형 발견(3-2절 하단 참조, LOCKED 정의는 변경하지 않음)**. 실제 기록 체계(무엇을 언제 기록하는지)는 `SSOT-STARTRACE-001_Star_Trace.md`(2026-07-05)가 정의한다 — 이 LOCKED 정의는 변경되지 않았다 |

### 3-1. 재방문 vs 재회 역할 구분

`RFC-LANG-001`(항목 3)이 권고하고, 동일 RFC 내에서 승인·확정된 역할 분리다(TASK-RFC-002, 2026-07-04). **폐기·대체 관계가 아니라, 서로 다른 청중을 위한 병존 관계**다(3절 나눔/공명의 공존 방식과 동일한 패턴).

| 용어 | 역할 | 사용 영역 |
|------|------|-----------|
| 재방문 | 운영 용어 | CRM, 리텐션, 통계, 크론잡, 관리자 |
| 재회 | Journey 경험 용어 | AI, 앱, 영상, DreamTown, 사용자 메시지 |

> "재방문"은 `daily-miracles-mvp`의 리텐션 크론잡(Day1/3/7 넛지 등) 등 이미 운영 중인 시스템의 용어이므로 그대로 유지한다(Alias Policy, 9절). "재회"는 `SSOT-JOURNEY-001` 6절이 그리는 "과거의 자신과 현재의 자신이 다시 만나는 의식"을 사용자에게 직접 전달할 때만 사용하는 신규 공식 용어다.

### 3-2. Star Trace 포함 범위 (LOCKED, RFC-LANG-002)

CEO 결정사항 원문: "Star Trace는 Origin부터 별씨앗, 항로, 성장, 재회, 공명, 나눔, 연결까지 이어지는 소원이의 성장 기록을 의미한다."

| 한국어 | 영문(포함 범위 목록 기준) |
|--------|----------------------------|
| Origin | Origin |
| 별씨앗 | Star Seed |
| 성장 | Growth |
| 재회 | Reunion |
| 공명 | Resonance |
| 나눔 | Sharing |
| 연결 | Connection |

> **표기 확인 필요(자동 수정하지 않음)**: CEO 결정문 원문에는 "항로"가 포함되어 있으나, 지시서의 영문 "포함 범위" 목록(Origin/Star Seed/Journey/Growth/Reunion/Resonance/Sharing/Connection)에는 "항로"에 대응하는 항목이 없다. 대신 영문 목록에는 "Journey"가 있으나 한국어 결정문에는 "여정"이 없다. 이 둘이 서로 대응하는 표현인지("항로"≈"Journey"의 다른 표현), 혹은 "항로"가 별도로 누락된 항목인지 확인이 필요하다 — 임의로 판단하지 않고 그대로 기록만 남긴다.

> **Star Trace 정의 문구 변형 발견(2026-07-04, Governance Update 지시서)**: 새 지시서에 "Star Trace는 DreamTown에서 사용자의 성장과 경험을 기록하는 공식 Journey 기록 체계이다"라는 문구가 등장했다. 이는 위 LOCKED 정의("소원이의 성장 여정을 기록하는 공식 명칭")와 취지는 같으나 표현이 다르다("사용자"/"경험"/"Journey 기록 체계" vs "소원이"/"성장 여정"/"공식 명칭"). **LOCKED 상태인 기존 정의는 이 문구로 대체하지 않았다** — LOCKED 용어는 통상 RFC보다 더 엄격한 절차(Manifesto 개정에 준하는 승인)를 요구하므로, 변경이 필요하면 별도로 명시 승인해야 한다.

---

### 3-3. Star Seed 역할 및 성장 구조 (2026-07-04 추가)

Star Seed(별씨앗)는 DreamTown의 **첫 번째 Physical Interface**다 — 소원을 행동으로 연결하는 첫 번째 증표.

```
소원
  ↓
Star Seed
  ↓
행동
  ↓
성장
  ↓
별
  ↓
별자리
  ↓
은하
```

> **⚠ 네 번째 병렬 성장 시퀀스 발견(자동 통합하지 않음)**: 이 구조는 기존에 이미 존재하던 세 개의 성장 시퀀스와 또 다르다.
> 1. Journey 구조(`SSOT-JOURNEY-001` 2절): 일상→문제→소원→DreamTown→여정→기억 봉인→세 이레→동행→재회/재방문→나눔→새 Journey
> 2. 별 성장 5단계(8절, 두 계열 병존): "Seed Star→Growing Star→Bright Star→Guide Star→Somangi" 또는 "Star Seed→New Light→…"
> 3. 실제 DB enum(`dt_star_stage`): day1→day7→day30→day100→day365
> 4. **본 절(신규)**: 소원→Star Seed→행동→성장→별→별자리→은하
>
> 넷 다 "성장"을 표현하지만 명칭·단계 수·순서가 서로 다르다. 이번 작업 지시는 "Star Seed 위치 명시"만 요청했으므로, 이 네 시퀀스를 하나로 통합하는 작업은 하지 않는다 — 통합이 필요하다고 판단되면 별도 RFC-LANG 대상으로 남긴다.
>
> **✅ 처리 현황(2026-07-04, TASK-GROWTH-001)**: `SSOT-GROWTH-001_Growth_Architecture.md`가 이 네 시퀀스(및 그 밖의 Reward/AI Prompt 등)를 공식 9단계 Growth Architecture(Origin→Wish→Star Seed→Journey→Action→Growth→Star→Constellation→Galaxy)에 매핑했다. **이 절의 7단계 구조가 사실상 그 9단계의 전신이었다**(Origin·Journey만 추가됨). 본 절의 원문은 변경하지 않았다 — 상세 매핑은 `SSOT-GROWTH-001` 5-2절 참조.

---

## 4. Journey Language

공식 Journey 언어.

```
가능성
  ↓
약속
  ↓
동행
  ↓
기억
  ↓
재회
  ↓
나눔
  ↓
별자리
```

> **주의(Migration 대상)**: 이 7단계는 오늘(2026-07-03) 최초로 확정된 Journey Language이며, 기존에 이미 존재하던 두 개의 유사 흐름도와 층위가 다르다.
> - `Architecture_Constitution.md` 제3장 "성장 모델"(소원→회복→성장→나눔→새로운소원, 5단계) — **철학 층위**, 최상위 원칙
> - `DreamTown_Universe_Bible.md` §5의 별 성장 5단계(씨앗별→성장별→빛나는별→안내별→소망이) — **세계관/제품 층위**, 5절 Product Language와 직결
>
> 세 흐름도는 서로 다른 대상(철학적 원칙 / 사람의 여정 경험 / 별이라는 사물의 성장)을 설명하므로 **충돌이 아니라 계층적 대응 관계**로 본다. 다만 세 문서 간의 정확한 대응 관계는 아직 명문화되지 않았으며, 임의로 통합·수정하지 않는다 — 상세 영향도는 `SSOT-LANG-002_Language_Migration_List.md`를 따로 작성해 추적한다.

---

## 5. Product Language

| 상태 | 의미 |
|------|------|
| 반투명 | 가능성을 품은 별 |
| 황금 | 약속을 기억하는 별 |
| 야광 | 동행의 별 |
| 별의 기억 | Journey 봉인 |
| 별자리 | 연결된 삶 |

> 이 다섯 용어는 4절 Journey Language의 단어(가능성/약속/동행/기억/별자리)를 그대로 재사용해 별의 물리적 상태와 대응시킨다 — Journey Language가 추상적 여정을, Product Language가 그 여정이 별이라는 사물에 어떻게 나타나는지를 설명하는 구조다.

---

## 6. Place Language

장소도 감정을 가진다.

| 장소 | 감정 |
|------|------|
| 오동도 | 회복 |
| 향일암 | 다짐 |
| 하멜등대 | 희망 |
| 등 | (후속 확장) |

> **정합성 확인**: `하멜등대=희망`은 기존 확정된 `CON-005_hamel_lighthouse.md`의 "Layer 1: 희망(브랜드 상징)" 정의와 일치한다(Layer 0의 "지혜"는 별개 층위로 유지됨, 충돌 아님).
> **확장 방법**: 이 표는 완결된 목록이 아니다. 새 Place Language 항목은 `SSOT-KNOWLEDGE-001_Origin_Generation_Guide.md`가 정의하는 Origin Seed 생성 절차를 거쳐 확정된 목적지(현재 `ORIGIN-001_Odongdo.md`, `ORIGIN-002_Hyangiram.md` 완료, 8개 후보 대기 중)에서 자연스럽게 채워진다. 임의로 새 장소·감정을 추가하지 않는다.

---

## 7. AI Language

| 용어 | 정의 |
|------|------|
| Aurora | Aurora5의 약칭 — 보이지 않는 관찰자, 지능형 동행 시스템 |
| Aurum | 아우룸 — 소원이에게 보이는 안내자이자 메신저 |
| Witness | 아우룸의 공식 역할(3절 참조) — 별 탄생의 증인 |
| 오늘의 별 | 밤 9시 의식(Ritual)의 사용자 노출 헤드라인 메시지("오늘의 별이 떠올랐습니다") |
| 별빛 대화 | 소원 관련 감정 체크인의 공식 명칭(8절 참조) |
| Long-Term Companion | 동행(同行)의 공식 영문 표기(3절과 동일) |

> **범위 한정**: "별빛 대화"/"오늘의 별"은 **소원과 직접 연결된 사용자 대면 의식**에만 적용되는 명칭이다. 출석/포인트 체크인(`daily_checks`)이나 현장 QR 체크인(`dreamtown-wishart`)처럼 소원과 무관한 별개 시스템까지 이 이름으로 통합하는 것은 아니다 — 9절 Alias Policy 참조.

---

## 8. 금지 용어 (Forbidden / Deprecated Terms)

아래는 `Project_Phoenix_Language_Audit.md`가 확인한 충돌을 이 헌법이 확정한 결과다. **문서 표기에만 적용되며, 기존 코드/DB를 즉시 리네이밍하지 않는다**(9절 Alias Policy).

| 금지(구) 용어 | 공식(신) 용어 | 근거 |
|---------------|----------------|------|
| 체크인 (소원 관련 감정 체크인 한정) | **별빛 대화** 또는 **오늘의 별** | 4개의 서로 다른 "체크인" 개념 중 소원 관련 것만 분리 명명(7절 범위 한정 참조) |
| Somanggi (겹자 g) | **Somangi** (외자 g) | `DreamTown_Universe_Bible.md` 내부에서도 표기가 혼재되어 있어 하나로 확정 |
| Star Seed(별의 씨앗) → New Light(새빛) → … (`DreamTown_Wish_System_SSOT.md`, `DreamTown_Miracle_System_SSOT.md` 계열) | **Seed Star(씨앗별) → Growing Star(성장별) → Bright Star(빛나는 별) → Guide Star(안내별) → Somangi** (`DreamTown_Naming_System_SSOT.md`, `DreamTown_Universe_Bible.md` 계열 채택) | "Naming System SSOT"라는 명칭 자체가 언어를 전담하는 문서이므로 우선 채택. 단, 실제 DB(`dt_star_stage` enum)는 `day1/day7/day30/day100/day365`로 별개 구현되어 있어, 이 다섯 이름은 어디까지나 **표시용 별칭**임을 함께 기록한다 |
| StarLink | **Aurora Path** | 소원→별 파이프라인을 가리키는 동의어 중 하나만 채택(세계관 정합성 근거 — 판단에 의한 결정, 코드 구현은 양쪽 다 없음) |
| 별공방 (단축형) | **별빛 공방** (정식 명칭) | 세계관 성서(`DreamTown_Universe_Bible.md`)의 정식 표기를 채택. "별공방"은 구어체 약칭으로만 허용 |
| — (Aurora5 오버로드) | AI 시스템 = **Aurora5**, 내부 개발팀 = **Aurora5 Team** | 동일 문자열이 서로 다른 두 실체(AI 시스템/개발팀)를 가리키던 것을 표기로 구분 |
| 소원꿈터 광장 (단독 축약: "Plaza"/"광장") | 정식 문서에서는 **소원꿈터 광장** 전체 표기 사용 | 코드 라우트/주석의 축약형은 유지(Alias Policy) |
| 나눔/공명의 혼용 | **공존 확정** — 나눔(참여형 리액션: 기적나눔·지혜나눔·감사나눔) / 공명(공감형 리액션: relief·courage·clarity·belief) | 폐기가 아니라 "서로 다른 체계임을 명시"로 해결 |

---

## 9. Alias Policy

기존 코드와 DB는 유지한다.

문서는 공식 용어만 사용한다.

- SSOT, Seed 문서(`ORIGIN-xxx.md` 등), PRD, 기획 문서 등 **공식 문서는 예외 없이 본 헌법의 Canon Language를 사용**한다.
- 기존 코드의 변수명, 함수명, DB 테이블/컬럼명, API 경로는 **리네이밍하지 않는다.** (예: `daily_checks` 테이블, `/api/me/checkin` 경로, `WishCheckin.jsx` 파일명 등은 그대로 유지)
- 신규 코드를 작성할 때는 가능한 한 공식 용어에 맞춰 명명할 것을 **권장**하되, 강제하지 않는다.
- 8절의 "금지 용어"는 문서 표기 규칙이지, 기존 시스템에 대한 즉시 수정 지시가 아니다. 실제 반영 계획은 `SSOT-LANG-002_Language_Migration_List.md`에서 별도로 관리한다.

---

## 10. Change Policy

공식 용어는 헌법 수준이다.

임의 변경 금지.

변경 시 RFC 문서 작성.

- RFC 문서 명명 규칙: `RFC-LANG-{번호}_{제목}.md`
- RFC는 본 문서의 변경을 제안하는 문서일 뿐, RFC 작성 자체가 변경을 확정하지 않는다 — 승인 절차는 `Architecture_Constitution.md` 상단 메타데이터의 "Architecture Review" 절차를 언어 영역에 동일하게 적용한다(별도 절차를 새로 만들지 않는다).
- 8절의 결정 사항이라도 이의가 제기되면 RFC를 통해 재논의할 수 있다 — 특히 "StarLink vs Aurora Path"처럼 코드 근거 없이 판단으로 결정된 항목은 향후 RFC 대상이 되기 쉬운 항목으로 표시해 둔다.

---

## 11. 추가 작업 — Audit 대조 체크리스트

`Project_Phoenix_Language_Audit.md`가 요청한 6개 항목에 대한 처리 결과.

| 확인 항목 | 처리 여부 | 근거 절 |
|-----------|-----------|---------|
| Somangi/Somanggi 충돌 해결 여부 | ✅ 해결 — Somangi로 확정 | 3절, 8절 |
| Seed Star 명칭 충돌 해결 여부 | ✅ 해결 — Seed Star/씨앗별 계열 채택, DB 별칭 성격 명시 | 8절 |
| Aurora5 중복 해결 방향 | ✅ 방향 확정 — AI 시스템은 Aurora5, 팀은 Aurora5 Team | 8절 |
| 체크인 용어 통일 | ✅ 통일 — 별빛 대화 / 오늘의 별(소원 관련 한정) | 7절, 8절 |
| 공명/나눔 체계 정리 | ✅ 정리 — 폐기 아닌 공존 확정, 구분 정의 명시 | 3절, 8절 |
| Journey Language 등록 여부 | ✅ 등록 완료 | 4절 |

모든 결정 사항의 **실제 영향 범위(어떤 기존 문서를 언제 고쳐야 하는지)**는 이 문서가 아니라 `SSOT-LANG-002_Language_Migration_List.md`에서 다룬다 — 이 문서는 "무엇이 공식 언어인가"를 정하고, Migration List는 "그것을 반영하려면 무엇을 건드려야 하는가"를 분석한다.
