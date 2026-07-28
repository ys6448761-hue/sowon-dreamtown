# Session Asset — 2026-07-28 · Knowledge to Wisdom

---

## Date

2026-07-28

## Theme

코드를 지식으로, 지식을 운영 원칙으로 — 경험을 검증 가능한 지혜로 가공하는 시스템 수립

---

## Starting Context

이전 세션(compacted context)에서 이어받은 상태:

- OWN-001~009 완료 (Schema 고정 → Token 발급 → Ownership Guard → Write 보호 → Claim API → Atomic Claim → Claim UX)
- DT-MVP-001 완료 (`GET /api/dt/me/star`)
- 테스트: 소유권 44 Pass / 1 Skip, Me Star 13 Pass
- Vitest 2.1.9 설치 (`vitest.config.ts` 포함)

---

## Key Decisions

1. **Experience → Insight → Wisdom 3계층 확립**
   - Experience: 개인의 자산
   - Insight: 반복되는 패턴 (아직 공동체 자산 아님)
   - Wisdom: 공동체 검증·가공을 거친 재현 가능한 지식 자산

2. **K-Wisdom은 Route뿐 아니라 DreamTown 생태계 전체에서 생성된다**
   - Nanum, Connection, Visit, Daily Life 포함

3. **DreamTown은 소원이 Dashboard + 관리자 Command Center + Partner Dashboard의 3-Dashboard 플랫폼이다**
   - 핵심 운영 지표: 감정 항로(Route) 퍼널 — DAU/MAU/매출이 아님

4. **세션의 결정과 다음 시작점을 반드시 대물림한다 (SSOT-OPS-SESSION-001)**
   - 새로운 세션은 새로운 시작이 아니라 이전 세션에서 이어지는 다음 구간이다

---

## Created or Updated Assets

| ID | File | Action |
|---|---|---|
| CAND-ARCH-001 | `CAND-ARCH-001_Read_API_Design_Principles.md` | 신규 생성 |
| CAND-OPS-005 | `CAND-OPS-005_Ownership_Implementation_Lifecycle.md` | 신규 생성 |
| CAND-OPS-006 | `CAND-OPS-006_DreamTown_Command_Center.md` | 신규 생성 |
| CAND-KW-001 | `CAND-KW-001_K-Wisdom_Governance.md` | 신규 생성 (v2 개정 포함) |
| CAND-OPS-007 | `CAND-OPS-007_Session_Asset_Governance.md` | 신규 생성 (Review, 즉시 승격) |
| SSOT-OPS-SESSION-001 | `SSOT-OPS-SESSION-001_Session_Asset_and_Knowledge_Inheritance.md` | 신규 생성 (Approved) |
| CAND-DOM-001 | `CAND-DOM-001_DreamTown_Domain_Model_Audit.md` | OWN-010, DT-MVP-001 완료 기록 추가 |
| Sessions/INDEX.md | `docs/YAKB/Sessions/INDEX.md` | 신규 생성 |

---

## Commits

| Hash | Message | Scope |
|---|---|---|
| `ba73122` | docs(governance): add ownership implementation lifecycle candidate | CAND-OPS-005, CAND-ARCH-001, CAND-DOM-001, INDEX.md |
| `af52c08` | docs(governance): add K-Wisdom and operations candidates | CAND-OPS-006, CAND-KW-001, INDEX.md |

**미커밋 구현 파일 (이번 세션 생성, 아직 스테이징 전):**

- `src/__tests__/dt-ownership/ownership.test.ts` (OWN-010, 44 Pass / 1 Skip)
- `src/__tests__/dt-me-star/me-star.test.ts` (DT-MVP-001, 13 Pass)
- `src/app/api/dt/me/star/route.ts` (DT-MVP-001 구현)
- `src/app/api/dt/claim/route.ts` (OWN-008/008A 구현)
- `src/components/dreamtown/ClaimModal.tsx` (OWN-009 구현)
- `vitest.config.ts` (Vitest 2.1.9 설정)

---

## Key Learning

1. **Insight는 검증 전이다.** Experience → Insight까지는 개인 영역. Insight → Wisdom에 공동체 검증이 필요하다.

2. **운영자가 먼저다.** DreamTown의 관리자 Command Center가 소원이 Dashboard보다 먼저 설계되어야 한다. 운영자는 매일 시스템을 보기 때문이다.

3. **감정 항로가 운영 지표다.** DAU/MAU가 아니라 Route 퍼널(도착→호흡→연결→상승→쉼→소원→안식) 완주율이 DreamTown의 고유 운영 지표다.

4. **세션 대물림은 선택이 아니다.** 좋은 원칙을 만들어도 다음 세션에서 이어받지 못하면 지식이 쌓이지 않는다. SSOT-OPS-SESSION-001이 이 규칙을 명문화했다.

5. **CAND ID 충돌 관리.** CAND-OPS-004는 Reunion_Operations.md, CAND-OPS-005는 Ownership_Lifecycle이 선점. 사용자가 제안한 ID가 선점된 경우 다음 번호로 할당하고 충돌 이력을 기록한다.

---

## Unfinished Items

- [ ] 구현 파일 커밋 (`src/__tests__/`, `src/app/api/dt/`, `src/components/dreamtown/`, `vitest.config.ts`)
- [ ] SSOT-OPS-SESSION-001 LOCK (다음 사이클 후 RFC 없이 오너 결정으로 가능)
- [ ] CAND-OPS-007 Promoted 표시 확정
- [ ] 관리자 Command Center 구현 시작 (API 설계 먼저)
- [ ] YAKB-INDEX-001 갱신 (SSOT-OPS-SESSION-001 등록)

---

## Next Starting Point

**1순위:** 미커밋 구현 파일 커밋 (OWN-010 + DT-MVP-001 + Vitest 일괄)

**2순위:** 관리자 Command Center 구현 — `GET /api/admin/dt/summary` 집계 API 설계

**3순위:** CAND-OPS-007 Promoted 처리 + YAKB-INDEX-001 갱신

---

## Inheritance Statement

다음 세션은 본 기록을 기준으로 이어서 진행하며, 확정된 결정을 특별한 근거 없이 다시 초기화하지 않는다.

특히 다음은 이미 결정된 사항이다.

- Experience → Insight → Wisdom 3계층 구조
- DreamTown 3-Dashboard 아키텍처 (소원이 / 관리자 Command Center / Partner)
- K-Wisdom은 DreamTown 생태계 전체에서 축적됨
- 세션 종료 시 Session Asset 작성 의무 (SSOT-OPS-SESSION-001)
- OWN-001~010, DT-MVP-001 구현 완료 상태
