# RSR-2026-07-27 · DreamTown Ownership System Implementation

---

## Metadata

- Type: Implementation Session Record
- Date: 2026-07-27
- Branch: feature/checkin-mvp
- Related Candidate: CAND-DOM-001_DreamTown_Domain_Model_Audit.md
- Status: Complete
- Scope: OWN-001 ~ OWN-006

---

## 1. 목적

DreamTown Guest Identity 기반 Ownership 시스템을 단계적으로 구현한 과정을 기록한다.
이 문서는 설계 변경 기록이 아니라 CAND-DOM-001에 정의된 감사 항목의 구현 및 검증 이력이다.

---

## 2. 구현 항목별 기록

### OWN-001 — DtGuestIdentity Schema + Migration

**목적:** DB 레벨 Guest Identity 기반 마련

**변경 파일**
- `prisma/schema.prisma`
- `prisma/migrations/20260727000001_add_dt_guest_identity/migration.sql` (수동 생성)

**핵심 결정**
- `tokenHash String @unique` — DB에는 SHA-256 Hash만 저장
- `DtStar.guestIdentityId String?` — nullable, 기존 Legacy Star 보존
- `DtStar.userId String` — NOT NULL 유지 (변경 없음)
- `onDelete: SetNull` — Identity 삭제 시 Star 고아화 방지
- Backfill 없음 — 기존 Star는 guestIdentityId = NULL (Legacy Star)
- `prisma migrate dev --create-only`는 실제 DB 연결 필요 → 수동 SQL 작성

---

### OWN-002 — Guest Token 발급 (Wishes 신규 Star 경로)

**목적:** 첫 소원 생성 시 Guest Identity 발급

**변경 파일**
- `src/lib/utils/guest-identity.ts` (신규)
- `src/app/api/dt/wishes/route.ts`

**핵심 결정**
- `crypto.randomBytes(32).toString("base64url")` — 256bit 엔트로피
- Cookie: `dt_guest_token`, `httpOnly: true`, `secure: production`, `sameSite: "lax"`, `maxAge: 1년`
- Cookie는 `prisma.$transaction()` 성공 후에만 발급
- Array transaction → Interactive transaction 전환 (Identity 분기 로직 필요)
- Sliding expiration: 유효 Identity 재사용 시 `lastUsedAt`, `expiresAt` 갱신

---

### OWN-003 — CheckIn Guest Identity 연결

**목적:** 체크인 Star 생성에 동일 Ownership 정책 적용

**변경 파일**
- `src/app/api/checkin/route.ts`

**핵심 결정**
- `guest-identity.ts` 유틸 재사용 (신규 파일 없음)
- 파일 업로드 보상 구조(`writeFile` → transaction 실패 → `unlink`) 유지
- `let starId: string; let tokenForCookie: string;` 선언 위치 — inner try 전, TypeScript 정적 분석 통과 (inner try는 항상 re-throw)
- `guestIdentityId: identityId` — `dtStar.create` data에 추가

---

### OWN-004 — Ownership Guard

**목적:** Ownership 판정 로직 분리 (Route에서 추출)

**변경 파일**
- `src/lib/utils/ownership-guard.ts` (신규)

**`OwnershipResult` 판정 흐름**
```
DtStar 조회
  → star_not_found
  → guestIdentityId === null → legacy_star
  → token 미존재 → missing_token
  → tokenHash → DtGuestIdentity 조회 → invalid_token
  → expiresAt 확인 → expired_token
  → id 일치 확인 → not_owner
  → ok
```

**설계 결정: 2-Query vs 1-Query**
- 1-Query (`include: { guestIdentity: true }`): `invalid_token`과 `not_owner` 구분 불가
- 2-Query 채택: reason taxonomy를 보존하여 Route에서 정확한 HTTP Status 매핑 가능
- Guard는 HTTP Response 생성 금지, throw 금지 (business logic cases)

---

### OWN-005 — Wishes / Journals Write 보호

**목적:** 기존 Star 경로 Ownership Guard 적용

**변경 파일**
- `src/app/api/dt/wishes/route.ts`
- `src/app/api/dt/journals/route.ts`

**적용 범위**
- `POST /api/dt/wishes` — 기존 Star 경로(`starId` 전달 시)만 적용
- `POST /api/dt/journals` — 전체 POST 적용
- 신규 Star 생성 경로(`!starId`) — 변경 없음

**reason → HTTP Status 매핑**
| reason | status |
|---|---|
| star_not_found | 404 |
| legacy_star, missing_token, invalid_token, expired_token, not_owner | 403 |

---

### OWN-006 — Connection Reference Integrity

**목적:** Connection 생성 시 참조 무결성 보장

**변경 파일**
- `src/app/api/dt/connection/route.ts`

**추가 검증 (순서 고정)**
1. `starId` 존재 확인 → 404 `"star not found"`
2. `otherStarId` 존재 확인 → 404 `"other star not found"`
3. `starId === otherStarId` 확인 → 400 `"cannot connect to self"`

**결정 사항**
- Ownership Guard 미적용 — Connection은 수신자 관점 이벤트, Ownership 정책 별도 검토 필요
- Cookie / Guest Token 미사용
- `DtConnection.otherStarId`는 schema FK 없음 — 애플리케이션 레벨로 보완

---

## 3. 일관된 구현 원칙

| 원칙 | 근거 |
|---|---|
| Token 평문은 Cookie에만 존재 | DB에 plaintext 저장 금지 |
| DB에는 SHA-256 Hash만 저장 | 단방향 해시로 복원 불가 |
| Cookie는 Transaction 성공 후에만 발급 | 부분 발급 상태 방지 |
| Ownership 판정과 Business Logic 분리 | Guard는 판정만, Route는 HTTP만 |
| Legacy Star 자동 허용 금지 | guestIdentityId = NULL → 403 |
| 기존 API Contract 유지 | 호환성 |
| Token / tokenHash 로그 출력 금지 | 보안 |

---

## 4. TypeScript 검증 결과

| 시점 | 신규 오류 | 기존 오류 | 비고 |
|---|---|---|---|
| OWN-001 완료 | 0 | 11 | plaza/page.tsx (무관) |
| OWN-002 완료 | 0 | 11 | 동일 |
| OWN-003 완료 | 0 | 11 | 동일 |
| OWN-004 완료 | 0 | 11 | 동일 |
| OWN-005 완료 | 0 | 11 | 동일 |
| OWN-006 완료 | 0 | 11 | 동일 |

`plaza/page.tsx` 11건은 이 세션 이전부터 존재하는 별개 문제.

---

## 5. 확인된 미해결 항목

| 항목 | 내용 | Phase |
|---|---|---|
| OWN-007 | Nanum / Connection Acknowledge Ownership Guard 적용 | Phase 2 |
| OWN-008 | Claim API — Guest Identity → User 연결 | Phase 2 |
| DT-AUTH-002 | ClaimToken Schema 정식화 | Phase 2 |
| DT-RF-005 | DtConnection unique constraint (Schema) | Phase 4 |
| — | 만료 GuestIdentity 정리 정책 | 미정 |
| — | `DtConnection.otherStarId` DB 레벨 FK 적용 여부 | 미정 |
| — | Nanum route 내 Connection 생성 참조 무결성 | Phase 2 |

---

## 6. 산출물 목록

| 파일 | 변경 유형 |
|---|---|
| `prisma/schema.prisma` | 수정 (OWN-001) |
| `prisma/migrations/20260727000001_add_dt_guest_identity/migration.sql` | 신규 (OWN-001) |
| `src/lib/utils/guest-identity.ts` | 신규 (OWN-002) |
| `src/lib/utils/ownership-guard.ts` | 신규 (OWN-004) |
| `src/app/api/dt/wishes/route.ts` | 수정 (OWN-002, OWN-005) |
| `src/app/api/checkin/route.ts` | 수정 (OWN-003) |
| `src/app/api/dt/journals/route.ts` | 수정 (OWN-005) |
| `src/app/api/dt/connection/route.ts` | 수정 (OWN-006) |
| `docs/YAKB/02_SEEDS/Candidates/CAND-DOM-001_DreamTown_Domain_Model_Audit.md` | 수정 (Implementation Status 업데이트) |

---

## 7. CAND-DOM-001 참조

이 RSR은 CAND-DOM-001의 구현 이력을 별도 문서로 분리한 것이다.
CAND-DOM-001의 Implementation Status Log가 정전(Single Source)이며, 이 문서는 맥락 보존용이다.

Lifecycle: CAND-DOM-001은 이 구현 이후에도 `Candidate / Idea` 상태 유지.
Schema 변경 등 Phase 2 작업 완료 후 Review 진입 가능성 있음.
