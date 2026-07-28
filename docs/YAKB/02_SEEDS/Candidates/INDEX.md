# Candidate Index

---

**목적:** `docs/YAKB/02_SEEDS/Candidates/`에 존재하는 모든 Candidate 문서를
추적하는 실험실(Lab) 인덱스. `YAKB-INDEX-001`은 Approved 이상의 공식 자산만
관리하는 박물관(Museum) 인덱스이며, 이 문서와 역할을 분리한다
(`CAND-OPS-002_Candidate_Index_Strategy.md` 참조).
**Status:** Idea (Candidate 그 자체이며, 다른 Candidate처럼 Review를 거쳐
성장할 수 있다)
**갱신 규칙:** 새 Candidate가 생성되거나, 기존 Candidate의 Status가 바뀌거나
(Idea → Draft → Review), Candidate가 승격/폐기될 때마다 이 표를 갱신한다.
Candidate가 `99_SSOT/`로 승격되면 이 표에서는 "Promoted"로 표시하고,
`YAKB-INDEX-001`에는 그 시점에 새로 등록한다.

> **⚠️ 브랜치 참고(2026-07-25):** 이 파일은 이 저장소에 아직 한 번도
> 커밋된 적이 없어(git 이력 없음), 현재 다섯 개의 서로 다른 미병합 브랜치
> (`docs/cand-ops-004-reunion-operations`,
> `docs/cand-world-001-002-sowoni-aurum-aurora5`,
> `docs/cand-brand-001-dreamtown-platform-philosophy`,
> `docs/cand-mean-001-three-perspectives-framework`,
> `docs/cand-brand-002-dreamtown-brand-language`)에 각각 독립적으로
> 존재한다(+ `docs/spr-001-freeze` 브랜치의 Sprint 문서는 이 인덱스 대상
> 아님). 병합 시 이 표를 하나로 합치는 조정이 필요하다.

---

## Candidates

| ID | File | Category | Status | Promotion Target | Note |
|---|---|---|---|---|---|
| CAND-ROUTE-001 | `CAND-ROUTE-001_DreamTown_Route_Manifesto.md` | Constitution / Manifesto (Route) | **Promoted** — Superseded by SSOT-ROUTE-001 (2026-07-15) | `SSOT-ROUTE-001` (완료) | Project History로 보존(삭제 안 함). 전체 이력은 `docs/YAKB/History/PROMOTION-001_SSOT-ROUTE-001.md` 참조 |
| CAND-OPS-001 | `CAND-OPS-001_Knowledge_Operating_System.md` | Operations / Constitution | Idea (보존, Origin 유지) — **통합 Draft 착수 보류** | `SSOT-KNOWLEDGE-004` §1 | `REVIEW-PLAN-001` §6 Consolidation Gate 참조 — 실제 운영 사례 2건 이상 누적 전까지 보류 |
| CAND-OPS-002 | `CAND-OPS-002_Candidate_Index_Strategy.md` | Operations / Constitution | Idea (보존, Origin 유지) — **통합 Draft 착수 보류** | `SSOT-KNOWLEDGE-004` §2 | 상동 |
| CAND-OPS-003 | `CAND-OPS-003_Knowledge_Capture_Report_Standard.md` | Operations / Constitution | Idea (보존, Origin 유지) — **통합 Draft 착수 보류** | `SSOT-KNOWLEDGE-004` §3 | 상동. 2026-07-15 Amendment로 보고서 유형 구분(📦/🎬/💻/🚀) 추가, 💻/🚀는 미검증 |
| CAND-OPS-004 | `CAND-OPS-004_Reunion_Operations.md` | Operations / Business Hypothesis | Idea | 미정 (§20 참조) | Hotel001 사업 가설(재회 운영). 3건의 미해결 충돌. **(브랜치 `docs/cand-ops-004-reunion-operations`)** |
| CAND-WORLD-001 | `CAND-WORLD-001_Sowoni_Aurum_Aurora5_Role_Architecture.md` | Constitution / Character-World | Idea | `DreamTown_Character_SSOT.md`에 오로라5 항목 추가 | 소원이/아우룸/오로라5 3축 역할 구조. "오로라5" 명명 충돌. **(브랜치 `docs/cand-world-001-002-sowoni-aurum-aurora5`)** |
| CAND-WORLD-002 | `CAND-WORLD-002_Identity_of_Sowoni.md` | Constitution / Character-World | Idea | `CAND-WORLD-001`과 함께 승격 제안 | 소원이 정체성 재정의 + 별빛 소원이. "확장 vs 재정의" 판단 필요. **(브랜치 `docs/cand-world-001-002-sowoni-aurum-aurora5`)** |
| CAND-BRAND-001 | `CAND-BRAND-001_DreamTown_Platform_Philosophy.md` | Brand / Constitution | Idea | `MANIFESTO-001` + daily-miracles-mvp CAND-BRAND-001과 함께 검토 | DreamTown Platform Philosophy. "플랫폼" 용어 3자 경합. ⚠️ ID 중복(daily-miracles-mvp에 별도 동명 문서). **(브랜치 `docs/cand-brand-001-dreamtown-platform-philosophy`)** |
| CAND-MEAN-001 | `CAND-MEAN-001_Three_Perspectives_Interpretation_Framework.md` | Framework | Idea | `Meaning Engine SSOT`(가칭), CON-004 충돌 해소 선행 | Core Meaning + 별빛/달빛/소망 3관점. **🚨 심각한 충돌**: `dreamtown-wishart/CON-004`(LOCKED)와 근본적으로 다른 모델. **(브랜치 `docs/cand-mean-001-three-perspectives-framework`)** |
| CAND-BRAND-002 | `CAND-BRAND-002_DreamTown_Brand_Language.md` | Brand | Idea | `SSOT-BRAND-{n}`(가칭) | 거래 언어→환대 언어 치환 어휘집. `SPR-001` Freeze 예외(운영 문서) 근거로 생성. 번호 정정(제안 001→002, 기존 CAND-BRAND-001과 구분). **(브랜치 `docs/cand-brand-002-dreamtown-brand-language`)** |
| CAND-DOM-001 | `CAND-DOM-001_DreamTown_Domain_Model_Audit.md` | Engineering / Domain | Idea | `SSOT-ENG-001_DreamTown_Domain_Model.md` (신규 제안) | DreamTown DDD 감사. OWN-001~009 + DT-MVP-001 구현 완료 ✅ (2026-07-28). DT-AUTH-002, DT-RF-005 미구현. 구현 이력: `docs/YAKB/Research/RSR-2026-07-27_DreamTown_Ownership_System_Implementation.md`. **(브랜치 `feature/checkin-mvp`)** |
| CAND-ARCH-001 | `CAND-ARCH-001_Read_API_Design_Principles.md` | Framework / Architecture | Idea | `SSOT-ENG-002_DreamTown_API_Design.md` (신규 제안) 또는 `SSOT-ENG-001` §API 통합 | DreamTown Read API 설계 원칙 — View Model API, Ownership Resolution 우선, Summary 동반 반환, N+1 금지. DT-MVP-001 구현으로 검증 (57 Pass). **(브랜치 `feature/checkin-mvp`)** |
| CAND-OPS-005 | `CAND-OPS-005_Ownership_Implementation_Lifecycle.md` | Operations | Idea | Operations SSOT / Backend Architecture SSOT / QA·Verification SSOT | Guest Ownership 구현 라이프사이클 표준 (OWN-001~010). Atomic Claim·Integration Test 포함 완료 기준. 44 Pass / 1 Skip. **(⚠️ CAND-OPS-004는 Reunion_Operations.md 선점 — 005로 할당)** **(브랜치 `feature/checkin-mvp`)** |
| CAND-OPS-006 | `CAND-OPS-006_DreamTown_Command_Center.md` | Operations / Architecture | Idea | `SSOT-OPS-001_DreamTown_Operations_Architecture.md` (신규 제안) | DreamTown 3-Dashboard 운영 아키텍처 (소원이/관리자 Command Center/Partner). 감정 항로 퍼널이 핵심 운영 지표. **(⚠️ CAND-OPS-005는 Ownership_Implementation_Lifecycle.md 선점 — 006으로 할당)** **(브랜치 `feature/checkin-mvp`)** |
| CAND-KW-001 | `CAND-KW-001_K-Wisdom_Governance.md` | Framework / Knowledge | Idea | Knowledge Governance SSOT / K-Wisdom SSOT / DreamTown Constitution | K-Wisdom 거버넌스 — Experience(개인)→Insight(패턴)→Wisdom(공동체 자산) 3계층. 명언집·사례집과의 차이: 출처·검증·피드백 루프 포함. Route뿐 아니라 DreamTown 생태계 전체에서 축적. **신규 KW 카테고리 계열 시작.** **(브랜치 `feature/checkin-mvp`)** |
| CAND-OPS-007 | `CAND-OPS-007_Session_Asset_Governance.md` | Operations / Constitution | **Review → Promoted** — `SSOT-OPS-SESSION-001`로 즉시 승격 (2026-07-28, 오너 결정) | `SSOT-OPS-SESSION-001_Session_Asset_and_Knowledge_Inheritance.md` ✅ | 세션 종료 시 Session Asset 작성 + 대물림 원칙. 반복 맥락 단절 문제 실증 확인으로 즉시 승격. **(브랜치 `feature/checkin-mvp`)** |

**참고:** `SSOT-KNOWLEDGE-004`의 구조 설계는
`docs/YAKB/Planning/SSOT-KNOWLEDGE-004_Draft_Design_Outline.md`에 있다(설계만,
실제 병합 아님, 착수 보류 중). 보류 조건과 재개 기준은
`docs/YAKB/Planning/REVIEW-PLAN-001_OPS_Candidates_Consolidation.md` §6을
따른다 — 현재 실제 운영 사례 1건(Route 승격 + Asset Repository 구축) 완료,
2건 이상 누적 시 재검토.

---

## Duplication Watchlist

새 Candidate를 만들기 전, 위 표와 `docs/YAKB/99_SSOT/`를 먼저 확인한다. 겹치는
주제가 있으면 새 파일을 만들지 않고 기존 Candidate/SSOT에 보완 내용을 추가하는
것을 우선 검토한다.
