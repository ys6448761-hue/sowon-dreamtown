# CAND-DOM-001 · DreamTown Domain Model Audit

---

## Metadata

- Category: Engineering / Domain
- Importance: Level 4
- Status: Candidate
- Promotion State: Idea (`GOV-001_Governance_Lifecycle.md` 기준 — free to revise, no RFC required yet)
- Validation Stage: Code Audit (2026-07-27 세션)
- Project: DreamTown · Project Phoenix
- Creator: Claude Code (DreamTown 코드베이스 직접 분석)
- Governance: Candidate → Review → Approved → LOCKED
- Promotion Target: `SSOT-ENG-001_DreamTown_Domain_Model.md` (신규 제안)
- PLAN-ENG-001 참조: §9 Transaction Boundary, §11 Domain Smells

---

## Implementation Status Log

> 이 섹션은 코드 변경이 완료될 때마다 갱신한다. "설계"로 시작한 항목이
> 실제 구현이 완료되면 "구현 완료"로 업데이트된다.

| Work Item | 관련 섹션 | 구현 상태 | 완료일 |
|---|---|---|---|
| DT-RF-001 — Star+Wish+Journal $transaction (wishes/route.ts) | §9 ISS-001 | ✅ 구현 완료 | 2026-07-27 |
| DT-RF-002 — CheckIn $transaction + 파일 보상 (checkin/route.ts) | §9 ISS-002 | ✅ 구현 완료 | 2026-07-27 |
| DT-RF-003 — Day 0 Journal 상수 단일화 | §6 BR-J-03, §11 DS-02 | ✅ 구현 완료 | 2026-07-27 |
| OWN-001 — DtGuestIdentity Schema + Migration (prisma/schema.prisma) | §11 DS-03, §14 | ✅ 구현 완료 | 2026-07-27 |
| OWN-002 — Guest Token 발급 + Sliding Expiration (wishes/route.ts) | §11 DS-03 | ✅ 구현 완료 | 2026-07-27 |
| OWN-003 — CheckIn Guest Identity 연결 (checkin/route.ts) | §11 DS-03 | ✅ 구현 완료 | 2026-07-27 |
| OWN-004 — Ownership Guard (ownership-guard.ts) | §11 DS-03, §7 | ✅ 구현 완료 | 2026-07-27 |
| OWN-005 — Wishes/Journals Write 보호 (Guard 적용) | §7, §11 DS-03 | ✅ 구현 완료 | 2026-07-27 |
| OWN-006 — Connection 참조 무결성 (connection/route.ts) | §6 BR-N-02, §10 ISS-004 | ✅ 구현 완료 | 2026-07-27 |
| DT-AUTH-002 — ClaimToken Schema | §4 userId no FK | 미구현 (Phase 2) | — |
| DT-RF-005 — DtConnection unique constraint | §10 ISS-004 | 미구현 (Phase 4) | — |

> **OWN-002 구현 노트 (2026-07-27):**
> Guest Token 생성(SHA-256 hash), 신규 Star ↔ GuestIdentity 연결, HttpOnly Cookie 발급,
> Sliding expiration 적용 완료 — `src/app/api/dt/wishes/route.ts` (신규 Star 경로만).
>
> **claimedUserId 임시 상태:**
> `DtGuestIdentity.claimedUserId`는 현재 단순 `String?` 임시 필드이며,
> Claim 정책 안정화(OWN-008) 이후 `User` relation 승격 여부를 재검토한다.

---

## 1. 분석 목적

DreamTown 코드베이스(`feature/checkin-mvp` 브랜치, 2026-07-27)에 대한
DDD(Domain-Driven Design) 관점 감사. 코드 변경이 아닌 현황 파악과 설계 방향
도출이 목적이다.

분석 범위:
- `prisma/schema.prisma` — 전체 DreamTown 모델
- `src/app/api/dt/**` — 모든 DT API route
- `src/app/api/checkin/route.ts` — QR CheckIn API
- `src/app/home/page.tsx` — Home 페이지 (클라이언트 로직 포함)
- `src/lib/utils/resonanceState.ts`, `nanumTagMap.ts` — 클라이언트 도메인 로직
- `src/lib/auth.ts`, `src/components/Providers.tsx` — 인증 인프라

---

## 2. Aggregate 목록

| Aggregate Root | Entity 구성원 | Value Object | 비고 |
|---|---|---|---|
| **DtStar** | DtWish, DtJournal, DtNanum, DtConnection | starName?, emotion(문자열 VO), helpTag(문자열 VO), growthLine(문자열 VO) | userId=String (FK 없음) — 소유자 연결 미완성 |
| **User** | Post, Like, EventParticipation, AdminLog | — | DtStar와 @relation 없음 |

DreamTown의 유일한 Aggregate Root는 `DtStar`다. 다른 DT 모델은 모두 DtStar에 Cascade 종속된다.

---

## 3. Entity / Value Object 분류

### Entity (DB 식별자 있음)

| Entity | Schema | 생명주기 | 비고 |
|---|---|---|---|
| DtStar | `id String @id` (no @default) | 생성만 (삭제 없음) | id는 클라이언트가 생성 (crypto.randomUUID()) |
| DtWish | `id String @id` | 생성만 | starId → DtStar (Cascade) |
| DtJournal | `id String @id` | 생성만 | Day 0는 자동 생성 |
| DtNanum | `id String @id` | 생성만 | type: miracle \| wisdom \| thanks |
| DtConnection | `id String @id` | 생성 + acknowledged 업데이트 | otherStarId: FK 없음 |

### Value Object 후보 (현재 단순 문자열)

| 필드 | 현재 타입 | 유효값 | 검증 위치 |
|---|---|---|---|
| `emotion` | String | 숨이 놓였어요 \| 믿고 싶어졌어요 \| 정리됐어요 \| 용기났어요 | 없음 (서버 미검증) |
| `helpTag` | String | 위로 \| 결심 \| 쉼 \| 연결 \| 실행 | 없음 (서버 미검증) |
| `growthLine` | String | 조금 가벼워졌어요 \| 조금 또렷해졌어요 \| 조금 용감해졌어요 | 없음 (서버 미검증) |
| `DtNanum.type` | String | miracle \| wisdom \| thanks | 없음 (서버 미검증) |

---

## 4. Star 생명주기

```
[없음]
  ↓ POST /api/dt/wishes (starId 없음)
  ↓ POST /api/checkin
[탄생 — DtStar created]
  ↓ userId = "anonymous" (⚠️ 인증 미연결)
  ↓ Day 0 DtJournal 자동 생성 (emotion/helpTag/growthLine 고정값)
[성장 — DtWish, DtJournal 추가]
  ↓ dayCount 수동 필드 (실제 업데이트 로직 없음 — 항상 1)
  ↓ starStage 수동 필드 (실제 업데이트 로직 없음 — 항상 1)
[연결 — DtConnection 생성]
  ↓ Nanum 3회 이상 받은 후 fromStarId와 자동 연결
  ↓ acknowledged = false → ConnectionMoment 1회 노출
[보존 — 무기한]
  ↓ Cascade 삭제 외 삭제 경로 없음
```

---

## 5. Domain Event 목록

현재 코드에 명시적 Domain Event 없음. 암묵적 이벤트 목록:

| 이벤트 | 발생 조건 | 현재 처리 방식 | 이상적 처리 |
|---|---|---|---|
| StarBorn | 최초 소원 작성 (starId 없음) | wishes/route.ts 또는 checkin/route.ts inline | Domain Event |
| Day0JournalCreated | wishCount === 1 | 동일 route inline | StarBorn 핸들러 |
| NanumReceived | POST /api/dt/nanum | nanum/route.ts inline | Domain Event |
| ConnectionCreated | Nanum 3회 + fromStarId 있을 때 | nanum/route.ts inline (조건부) | NanumReceived 핸들러 |
| ConnectionAcknowledged | acknowledge route POST | connection/acknowledge/route.ts | — |

---

## 6. Business Rules

### BR-S-01: Star 탄생 (확정)
- 최초 소원 작성 시 DtStar 생성
- `userId = "anonymous"` (인증 연결 전 임시값)
- `starName = "나의 별"` (고정)

### BR-W-01: Wish 내용 제한 (확정)
- 내용 필수, 1~200자
- 추가 검증 없음 (sanitize 없음 — checkin은 sanitizeText 사용, wishes는 없음)

### BR-J-01: Day 0 Journal 자동 생성 (확정)
- 조건: 해당 Star의 wishCount === 1 (첫 번째 소원)
- emotion: `"믿고 싶어졌어요"` (고정)
- helpTag: `"연결"` (고정)
- growthLine: `"조금 가벼워졌어요"` (고정)

### BR-J-02: helpTag 유효값 (확정, 히스토리 있음)
- 유효값: 위로 \| 결심 \| 쉼 \| 연결 \| 실행
- 이력: `20260328000002_fix_helpTag_start` — "시작" → "연결" 마이그레이션

### BR-J-03: Day 0 Journal 기본값 단일화 (✅ DT-RF-003 구현 완료)
- **공통 정의**: `src/lib/utils/day-zero-journal.ts` — `DAY_ZERO_JOURNAL` 상수
- `wishes/route.ts`, `checkin/route.ts` 모두 동일 import로 통합
- 서버 Day 0 기본값은 이제 한 곳에만 존재
- **미해소 잔여**: `home/page.tsx` GROWTH_LINE 매핑(클라이언트 emotion→growthLine 계산)이 서버 Day 0 규칙과 동일한 정책인지 확정 불가 — 별도 검토 필요 (이번 작업 범위 외)

### BR-N-01: Nanum 타입 (확정)
- 유효값: miracle \| wisdom \| thanks
- thanks는 GET 응답에서 count 제외 (UI 정책)
- 서버 타입 검증 없음

### BR-N-02: Connection 자동 생성 (확정, 취약점 있음)
- 조건: fromStarId 있음 + fromStarId ≠ starId + prevNanumCount >= 2 + Connection 없음
- fromStarId는 query parameter — DB 미저장 (ISS-011)
- Connection 중복 방지: DB unique constraint 없음 (ISS-004)

---

## 7. Domain Invariant

| Invariant | 강제 위치 | 상태 |
|---|---|---|
| Wish content 1~200자 | API route validation | ✅ 강제 중 |
| name 1~50자 (checkin) | API route validation | ✅ 강제 중 |
| photo 8MB 이하, jpeg/png/webp | API route validation | ✅ 강제 중 |
| Star → Wish 연결 무결성 | Prisma FK (Cascade) | ✅ 강제 중 |
| Day 0 Journal = 첫 소원 시에만 | `wishCount === 1` 체크 | ✅ 강제 중 (취약: count race 가능) |
| Connection 중복 없음 | `DtConnection.findFirst` 체크 | ⚠️ Application level만 (DB unique 없음) |
| Star 소유자 일치 | 없음 | ❌ 강제 안 됨 |

---

## 8. 외부 의존성

| 의존 | 종류 | DreamTown 영향 |
|---|---|---|
| PostgreSQL (Prisma) | 필수 | Star, Wish, Journal, Nanum, Connection 저장 |
| `public/uploads/checkin/` | 파일 시스템 | QR CheckIn 사진 저장 |
| `localStorage` | 클라이언트 | `dt_active_star_id`, `dt_resonance_state`, `nanum_last_shared_at` |
| NextAuth.js | 선택 (미연결) | DreamTown에서 사용하지 않음 |
| `temperature_state` (raw SQL) | 레거시 | me/checkin, me/temperature 전용 — DT Core와 분리됨 |

---

## 9. Transaction Boundary

### 9-1. ISS-001 — Star+Wish+Journal (wishes/route.ts)

**구현 상태: ✅ DT-RF-001 구현 완료 (2026-07-27)**

| | 변경 전 | 변경 후 |
|---|---|---|
| DtStar.create | 단독 await | `$transaction([...])` 내부 |
| DtWish.create | 단독 await | `$transaction([...])` 내부 |
| DtJournal.create | 단독 await | `$transaction([...])` 내부 |
| 부분 실패 시 | 고아 Star/Wish 남음 | 전체 롤백 — 고아 없음 |
| 파일 보상 | 해당 없음 | 해당 없음 |

**변경된 파일**: `src/app/api/dt/wishes/route.ts`
- 경로 구분: NEW Star(starId 없음) → $transaction. EXISTING Star → 단일 write (변경 없음)
- `crypto.randomUUID()`: 트랜잭션 외부에서 사전 생성
- API Response: 변경 없음

---

### 9-2. ISS-002 — Star+Wish+Journal + 파일 보상 (checkin/route.ts)

**구현 상태: ✅ DT-RF-002 구현 완료 (2026-07-27)**

| | 변경 전 | 변경 후 |
|---|---|---|
| writeFile | 단독 await | 단독 await (트랜잭션 밖, 먼저 실행) |
| DtStar.create | 단독 await | `$transaction([...])` 내부 |
| DtWish.create | 단독 await | `$transaction([...])` 내부 |
| DtJournal.create | 단독 await | `$transaction([...])` 내부 |
| DB 부분 실패 시 | 고아 파일 + 고아 Star/Wish | 파일 삭제 보상 + 전체 DB 롤백 |
| 파일 실패 시 | serverError (기존과 동일) | serverError (기존과 동일) |

**변경된 파일**: `src/app/api/checkin/route.ts`
- `unlink` 추가 (fs/promises)
- `filePath` 변수 분리 (writeFile 경로와 unlink 경로 공유)
- `starId = crypto.randomUUID()` 트랜잭션 전 사전 생성
- 내부 try-catch: DB 실패 → `unlink(filePath).catch(() => {})` → re-throw → 외부 catch → serverError
- API Response: 변경 없음

---

### 9-3. Nanum + Connection (nanum/route.ts)

**구현 상태: 미구현 — 별도 Work Item 없음 (현재 구조 유지)**

DtNanum.create 후 조건부 DtConnection.create. 두 조작은 독립적 의미를 가지므로
$transaction 불필요. DtConnection unique constraint 부재(ISS-004)는 Schema 변경으로
해소 예정 (DT-RF-005, Phase 4).

---

## 10. API별 책임 분석

| Route | Create | Read | Update | Delete | 비고 |
|---|---|---|---|---|---|
| `POST /api/dt/wishes` | Star?, Wish, Journal? | — | — | — | Star 생성은 조건부 |
| `GET /api/dt/wishes` | — | Wish 목록 | — | — | current + previous[] |
| `POST /api/dt/journals` | Journal | — | — | — | 수동 Journal |
| `GET /api/dt/journals` | — | Journal 목록 | — | — | |
| `POST /api/dt/nanum` | Nanum, Connection? | Nanum count | — | — | Connection 생성 조건부 |
| `GET /api/dt/nanum` | — | Nanum 목록 | — | — | take: 20, thanks 제외 |
| `GET /api/dt/connection` | — | Connection 목록 | — | — | acknowledged: false 필터 |
| `POST /api/dt/connection/:id/acknowledge` | — | — | acknowledged = true | — | |
| `GET /api/dt/stars/:id` | — | Star 상세 | — | — | |
| `POST /api/checkin` | Star, Wish, Journal | — | — | — | 파일 저장 포함 |
| `GET /api/me/temperature` | — | 온도 상태 | — | — | `auth()` 사용 |
| `POST /api/me/checkin` | — | — | 온도 UPSERT | — | `auth()` 사용, raw SQL |

**주목 사항**: `auth()`를 사용하는 DT 관련 route는 `me/temperature`, `me/checkin` 뿐.
나머지 DT API는 모두 Public (인증 없음).

---

## 11. Domain Smells

### DS-01: Fat Route / Transaction Script

**상태**: 부분 개선됨 — DT-RF-001, DT-RF-002 완료

| | 변경 전 | 변경 후 |
|---|---|---|
| wishes/route.ts | 순차 3개 await | $transaction 묶음 |
| checkin/route.ts | 순차 3개 await | $transaction 묶음 + unlink 보상 |
| 도메인 서비스 레이어 | 없음 | 없음 (이번 Roadmap 범위 외) |
| Application Service | 없음 | 없음 (이번 Roadmap 범위 외) |

남은 문제: Business Logic이 여전히 route.ts에 위치. Repository Pattern, Application Service 도입은 PLAN-ENG-001 Phase 6로 보류.

---

### DS-02: Business Rule 중복 — Day 0 Journal 기본값

**상태: ✅ 서버 중복 해소 (DT-RF-003 완료) — 클라이언트 불일치 별도 검토 필요**

| 위치 | 내용 | 상태 |
|---|---|---|
| `wishes/route.ts` | `...DAY_ZERO_JOURNAL` import 사용 | ✅ 해소 |
| `checkin/route.ts` | `...DAY_ZERO_JOURNAL` import 사용 | ✅ 해소 |
| `src/lib/utils/day-zero-journal.ts` | 서버 공통 정의 (단일 출처) | ✅ 신규 생성 |
| `home/page.tsx` GROWTH_LINE 매핑 | 클라이언트 emotion→growthLine 계산 | ⚠️ 별도 검토 필요 |

**클라이언트 불일치 잔여**:
- 서버 Day 0: emotion 무관하게 항상 `growthLine = "조금 가벼워졌어요"` (고정)
- 클라이언트 GROWTH_LINE: `"믿고 싶어졌어요" → "조금 또렷해졌어요"` (감정별 다름)
- 두 규칙이 동일 정책인지 확정 불가 → home/page.tsx 미수정 (이번 작업 범위 외)

---

### DS-03: 소유권 미정의

**상태: 미해소 (Phase 2-3 대기)**

모든 DtStar는 `userId = "anonymous"`. Star 소유자를 증명할 수단 없음.
해소 경로: PLAN-ENG-001 Phase 2 (ClaimToken) → Phase 3 (ownershipGuard).

---

### DS-04: 클라이언트-서버 상태 분리

**상태: 미해소 (Phase 6 보류)**

| 도메인 상태 | 위치 | 서버 대응 |
|---|---|---|
| `dt_active_star_id` | localStorage | 없음 |
| `dt_resonance_state` | localStorage | 없음 |
| `nanum_last_shared_at` | localStorage | 없음 |
| ResonanceState (depth, 확률) | localStorage `resonanceState.ts` | 없음 |

ResonanceState 서버 이전은 이번 Roadmap 범위 외.

---

## 12. Bounded Context

DreamTown은 현재 하나의 Bounded Context로 동작한다. 명시적 Context Map 없음.

| Context | 핵심 모델 | 외부 의존 |
|---|---|---|
| **DreamTown Core** | DtStar, DtWish, DtJournal, DtNanum, DtConnection | User (userId 참조만, FK 없음) |
| **Identity** | User, NextAuth | DreamTown (미연결) |
| **Legacy (Plaza)** | Post, Like, Event, EventParticipation | User |
| **Ops** | Schedule, NotificationJob | 독립 |
| **Daily CheckIn** | temperature_state (raw SQL) | User (auth() 사용) |

`DreamTown Core`와 `Identity`의 경계는 현재 점선 — 연결 설계가 Phase 2-3에서 필요.

---

## 13. Layer 분석

| 레이어 | 현재 위치 | 현재 상태 | 이상적 상태 |
|---|---|---|---|
| Presentation | `src/app/**/*.tsx` | ✅ 분리됨 | — |
| Application (Use Case) | 없음 — route.ts에 혼재 | ❌ 없음 | Application Service 레이어 |
| Domain Logic | route.ts + 일부 client utils | ⚠️ 혼재 | Domain Service |
| Infrastructure | Prisma, fs, auth | ✅ 격리됨 | — |

---

## 14. Prisma 관계 요약

```
User
  └─ (userId 참조만, @relation 없음) ─── DtStar ──┬── DtWish     (Cascade)
                                                   ├── DtJournal  (Cascade)
                                                   ├── DtNanum    (Cascade)
                                                   └── DtConnection (Cascade, otherStarId FK 없음)
```

**주목할 부재**:
- `DtStar.userId ─ User.id` FK 없음
- `DtConnection.otherStarId ─ DtStar.id` FK 없음
- `DtStar.id @default(uuid())` 없음 (클라이언트 생성)

---

## 15. 도메인 다이어그램 (텍스트)

```
┌──────────────────────────────────────────────────────┐
│                    DtStar (AR)                       │
│  id: String (client UUID)                            │
│  userId: "anonymous" ──── [User] (FK 없음, 미연결)    │
│  starName: "나의 별"                                  │
│  dayCount: 1 (업데이트 없음)                           │
│  starStage: 1 (업데이트 없음)                          │
│  visitorName?, photoUrl? (CheckIn 전용)               │
│                                                      │
│  ┌──────────┐  ┌───────────┐  ┌──────────────────┐   │
│  │ DtWish   │  │ DtJournal │  │   DtNanum        │   │
│  │ content  │  │ emotion   │  │   type(3종)      │   │
│  │          │  │ helpTag   │  │   message        │   │
│  │          │  │ growthLine│  │                  │   │
│  └──────────┘  └───────────┘  └──────────────────┘   │
│                                                      │
│  ┌─────────────────────────────┐                     │
│  │ DtConnection                │                     │
│  │ otherStarId (FK 없음)       │                     │
│  │ acknowledged: false → true  │                     │
│  └─────────────────────────────┘                     │
└──────────────────────────────────────────────────────┘
```

---

## 16. 주요 미결 사항 (Review 시 판단 필요)

| 항목 | 내용 | 관련 결정 |
|---|---|---|
| Star 소유권 방식 | HttpOnly Cookie Claim Token vs Session vs Public | PLAN-ENG-001 D-03 |
| 기존 anonymous Star 처리 | 유지 vs 플래그 vs 정리 | PLAN-ENG-001 D-04 |
| dayCount / starStage 구현 | 현재 항상 1 — 자동 업데이트 필요 여부 | PLAN-ENG-001 D-06 |
| DtConnection 방향성 | 단방향 vs 양방향 | PLAN-ENG-001 D-07 |
| DtNanum fromStarId 저장 | 현재 미저장 — DB 저장 여부 | PLAN-ENG-001 |
| emotion/helpTag/growthLine enum 전환 | 현재 String — enum 필요 여부 | 별도 결정 |
| GROWTH_LINE 서버-클라이언트 불일치 해소 | wishes vs home/page.tsx 규칙 통일 | DT-RF-003 이후 |

---

*이 문서는 2026-07-27 세션의 코드 직접 분석을 기반으로 작성되었으며,*
*§9 Implementation Status Log를 통해 코드 변경 시마다 갱신된다.*
*Review 전환 조건: PLAN-ENG-001 §14 H항 참조.*
