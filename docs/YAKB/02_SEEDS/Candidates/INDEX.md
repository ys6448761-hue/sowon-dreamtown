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

> **⚠️ 브랜치 참고(2026-07-24):** 이 파일은 이 저장소에 아직 한 번도
> 커밋된 적이 없어(git 이력 없음), 현재 세 개의 서로 다른 미병합 브랜치
> (`docs/cand-ops-004-reunion-operations`,
> `docs/cand-world-001-002-sowoni-aurum-aurora5`,
> `docs/cand-brand-001-dreamtown-platform-philosophy`)에 각각 독립적으로
> 존재한다. 병합 시 이 표를 하나로 합치는 조정이 필요하다.

---

## Candidates

| ID | File | Category | Status | Promotion Target | Note |
|---|---|---|---|---|---|
| CAND-ROUTE-001 | `CAND-ROUTE-001_DreamTown_Route_Manifesto.md` | Constitution / Manifesto (Route) | **Promoted** — Superseded by SSOT-ROUTE-001 (2026-07-15) | `SSOT-ROUTE-001` (완료) | Project History로 보존(삭제 안 함). 전체 이력은 `docs/YAKB/History/PROMOTION-001_SSOT-ROUTE-001.md` 참조 |
| CAND-OPS-001 | `CAND-OPS-001_Knowledge_Operating_System.md` | Operations / Constitution | Idea (보존, Origin 유지) — **통합 Draft 착수 보류** | `SSOT-KNOWLEDGE-004` §1 | `REVIEW-PLAN-001` §6 Consolidation Gate 참조 — 실제 운영 사례 2건 이상 누적 전까지 보류 |
| CAND-OPS-002 | `CAND-OPS-002_Candidate_Index_Strategy.md` | Operations / Constitution | Idea (보존, Origin 유지) — **통합 Draft 착수 보류** | `SSOT-KNOWLEDGE-004` §2 | 상동 |
| CAND-OPS-003 | `CAND-OPS-003_Knowledge_Capture_Report_Standard.md` | Operations / Constitution | Idea (보존, Origin 유지) — **통합 Draft 착수 보류** | `SSOT-KNOWLEDGE-004` §3 | 상동. 2026-07-15 Amendment로 보고서 유형 구분(📦/🎬/💻/🚀) 추가, 💻/🚀는 미검증 |
| CAND-OPS-004 | `CAND-OPS-004_Reunion_Operations.md` | Operations / Business Hypothesis | Idea | 미정 (§20 참조 — SSOT-OPS·SSOT-EXP·SSOT-JOURNEY·SSOT-HOTEL·CAND-BIZ·CAND-DATA 후보 다수) | Hotel001 사업 가설(재회 운영). §18 Duplication Check에서 3건의 미해결 충돌 발견: (1) "재회" 용어가 `SSOT-LANG-001` §3-1에 이미 다른 의미로 LOCKED, (2) `daily-miracles-mvp`에 트리거 미정 상태의 "재회(Reunion)" 백로그가 이미 존재(저장소 소유권 미정), (3) 호텔 역할이 `SSOT-LOOP-001`에 이미 "안식"으로 LOCKED — Review 전 반드시 해소 필요. **(브랜치 `docs/cand-ops-004-reunion-operations`)** |
| CAND-WORLD-001 | `CAND-WORLD-001_Sowoni_Aurum_Aurora5_Role_Architecture.md` | Constitution / Character-World | Idea | `DreamTown_Character_SSOT.md`(daily-miracles-mvp)에 오로라5 항목 추가 | 소원이/아우룸/오로라5 3축 역할 구조. "오로라5"/"Aurora5" 명명 충돌(daily-miracles-mvp의 실제 엔지니어링 브랜드명과) — Review 전 해소 필요. **(브랜치 `docs/cand-world-001-002-sowoni-aurum-aurora5`)** |
| CAND-WORLD-002 | `CAND-WORLD-002_Identity_of_Sowoni.md` | Constitution / Character-World | Idea | `CAND-WORLD-001`과 함께 `DreamTown_Character_SSOT.md`로 승격 제안 | 소원이 정체성 재정의 + 별빛 소원이(EP01 대표 캐릭터). 기존 Character SSOT와 "확장 vs 재정의" 판단 필요. **(브랜치 `docs/cand-world-001-002-sowoni-aurum-aurora5`)** |
| CAND-BRAND-001 | `CAND-BRAND-001_DreamTown_Platform_Philosophy.md` | Brand / Constitution | Idea | `MANIFESTO-001` + `daily-miracles-mvp/CAND-BRAND-001`과 함께 검토 | DreamTown Platform Philosophy(여수 연결 플랫폼론). Duplication Check에서 3건 발견: (1) "플랫폼" 용어가 Project Phoenix(`MANIFESTO-001`, 최상위 권위)/DreamTown/여수 3자 경합 상태(daily-miracles-mvp의 기존 CAND-BRAND-001이 이미 flag한 미해결 사안), (2) "오로라5" 이중 사용을 daily-miracles-mvp CAND-BRAND-001이 이미 독립적으로 발견(= CAND-WORLD-001의 우려 재확인), (3) "여수여행센터→하루하루의 기적→DreamTown" 계보가 이 저장소엔 처음 기록됨 — Review 전 (1) 해소 필요. **⚠️ ID 중복**: `daily-miracles-mvp`에도 별도의 `CAND-BRAND-001`(하루하루의 기적 Brand Architecture)이 존재 — 서로 다른 저장소의 별개 문서. **(브랜치 `docs/cand-brand-001-dreamtown-platform-philosophy`)** |

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
