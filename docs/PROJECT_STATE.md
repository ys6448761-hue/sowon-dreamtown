# PROJECT_STATE

- **Status:** Operational State / Not SSOT
- **Purpose:** Handover + Next Action
- **Source of Truth:** GitHub code + `prisma/schema.prisma`
- **Conflict Rule:** SSOT/code와 충돌 시 이 문서가 우선하지 않음
- **Updated At:** 2026-08-10 (rev 2)
- **Current Production HEAD:** `d9bf2ba` (fix: return revealed artwork to my star)

---

## Handover Rule

새로운 루미/담당자는 작업 시작 전:

1. 이 문서 읽기
2. **NOW / WAITING / NEXT ACTION** 확인
3. **ACTIVE CODE MAP** 포인터부터 조사
4. 포인터가 틀리거나 부족할 때만 repo-wide search
5. WAITING 항목은 재개 조건이 충족되지 않으면 구현하지 않음
6. SSOT 승격은 Candidate → Review → SSOT 절차 유지

---

## NOW

현재 진행 중 — 배포됐으나 실기기 검증 대기 또는 진행 중.

| 항목 | 상태 | 위치 |
|---|---|---|
| Camera + Gallery + Auto Optimize | 배포됨 (`6468089`), **실기기 검증 대기** | `CheckinPageContent.tsx` + `route.ts` |
| WishArt Happiest Believable Self | 배포됨 (`e733f70`), **Production 검증 진행 중** | `build-prompt.ts` |
| Revealed WishArt Routing | 배포됨 (`85d8f27`, `d9bf2ba`), **검증 대기** | `my-star/page.tsx`, `CheckinPageContent.tsx` |

---

## DONE / RECENTLY CLOSED

| 항목 | Commit |
|---|---|
| Revealed WishArt routing fix — Step 7 "내 소원별 만나기" → `/my-star` | `d9bf2ba` |
| Revealed WishArt routing fix — /my-star "내 소원그림 다시 보기" → `/checkin?starId=${starId}` | `85d8f27` |
| Camera/Gallery 분리 + optimizePhoto (canvas JPEG 0.92, max 2048px, EXIF, 20MB guard) | `6468089` |
| Happiest Believable Self (HOPE_RESTORATION_RULE, adaptive VITALITY_RULE, toothy grin carve-out) | `e733f70` |
| mode=new bypass — 새 별 생성 의도 명시 진입 | `128264d` |
| 기존 별 보유자 + 새 별 만들기 CTA | `96bc154` |
| Origin Architecture 분리 (shared rules vs location rules) | `f2971ba` |
| response_format param 오류 수정 (gpt-image-2 edit API) | `3a82824` |
| zombie star resume 오판정 수정 (photo + wish 모두 있을 때만 resume) | `b90f2d6` |

---

## WAITING

| 항목 | 이유 | 재개 조건 |
|---|---|---|
| WishArt Entitlement Architecture | 판매 단위·voucher·재생성 정책 미확정. Phase 2 Preflight 설계 완료. | 판매정책 확정 + Phase 1 Schema 승인 |
| Voucher Redeem API (`/api/dt/voucher/redeem`) | Entitlement 의존 | 위 동일 |
| 3P / 4P Reveal Architecture | 1P WishArt 운영 데이터 충분히 확인 후 | WishArt 1P 만족도 검증 완료 |
| 별씨앗 / 별공방 / 기적영상 / 하멜등대 구조 연동 | MVP 단계 외 | 1P 검증 완료 후 별도 승인 |

### Entitlement 설계 방향 (재개 시 참조)

- 별 생성은 무제한. WishArt만 Entitlement 소비.
- `DtWishartVoucher` + `DtWishartEntitlement` 2개 신규 테이블 (additive-only migration).
- Atomic reserve: `UPDATE ... WHERE status='AVAILABLE' FOR UPDATE SKIP LOCKED RETURNING id`
- `wishImageStatus`에 `"skipped"` 추가 (entitlement 없음 표시) — `"failed"`와 혼합 금지.
- 상세 설계: 세션 히스토리 또는 docs/Architecture 참조.

---

## KNOWN ISSUES

현재 미해결 또는 미검증.

| 이슈 | 상태 |
|---|---|
| Camera 실기기 EXIF orientation 검증 미완 | 미테스트 |
| 20MB 초과 사진 auto-optimize production 검증 미완 | 미테스트 |
| GPTs 생성 vs Production 생성 happiness gap 반복 확인 필요 | 진행 중 |

---

## ACTIVE CODE MAP

```
WishArt Prompt
→ src/lib/wishart/build-prompt.ts                (HOPE_RESTORATION_RULE, VITALITY_RULE)

WishArt Generation Pipeline
→ src/lib/wishart/run-generation.ts              (runWishartGeneration)
→ src/lib/wishart/generate-image.ts              (gpt-image-2 edits API)
→ src/lib/wishart/interpret-photo.ts             (photo analysis)

Checkin UI
→ src/app/checkin/CheckinPageContent.tsx         (Step 1–7, optimizePhoto, camera/gallery)

Checkin API
→ src/app/api/checkin/route.ts                   (POST, dedup guard, runWishartGeneration 호출)

My Star
→ src/app/my-star/page.tsx                       (revealed 상태 UI + routing)

DreamTown Public Entry
→ src/app/dreamtown/page.tsx

Home
→ src/app/home/page.tsx                          (WishTab, starId routing)

Data Schema
→ prisma/schema.prisma
   DtGuestIdentity  — 방문자 토큰 (hash만 저장)
   DtStar           — wishImageStatus: pending|generating|ready|failed|revealed
   DtWish           — 소원 텍스트
```

---

## CURRENT PRODUCT RULES

운영 판단에 필요한 최소 요약. 원문 SSOT는 `build-prompt.ts` + `docs/YAKB/99_SSOT/` 참조.

- 별은 여러 개 만들 수 있음 (무제한)
- 새 별 생성 의도: `/checkin?mode=new`
- 일반 `/checkin`: 기존 별 resume 가능 (zombie star 조건 제외)
- 기존 ready/revealed 별은 덮어쓰지 않음
- WishArt 1P에는 gemstone·별씨앗·별공방 없음
- Origin: wish 기반 5개 location 매핑 (Yeosu Real 70 / DreamTown Interpretation 30)
- Identity Lock 우선 — 얼굴 형태·특징 보존이 희망 복원보다 우선
- Happiest Believable Self: 현재 피로 복사 금지, 이미 행복한 표정은 그대로 보존
- Vitality restoration: 최대 5~10년 (강제 회춘 목표가 아닌 최대 허용 범위)
- 어린이 나이 변형 금지

---

## DO NOT DO YET

- 결제 시스템 즉시 구현 (판매정책 미확정)
- GuestIdentity 당 평생 1회 WishArt 제한 (정책 폐기됨)
- `wishImageStatus`에 entitlement 상태 혼합 (`"failed"`를 권한 없음으로 재사용 금지)
- 3P/4P를 MVP에 바로 구현
- 별 자체 생성 제한
- 미검증 운영 아이디어를 SSOT로 바로 승격
- 새 npm 패키지 추가 (EXIF 라이브러리, 미용 필터 등)

---

## NEXT ACTION

1. **Camera + Gallery + Routing 실기기 검증** — EXIF orientation, 20MB 경계, revealed WishArt 이동 흐름 확인
2. **WishArt GPTs vs Production** 결과 1~2건 추가 비교 → happiness gap 패턴 확인
3. **WishArt Entitlement** 판매정책 결정 시 Phase 1 Schema 설계로 재개

---

*PROJECT_STATE 갱신 시점: 의미 있는 작업 Save 완료 / Next Action 변경 / WAITING 재개·해제 / Production 검증으로 상태 변경. 일반 대화만으로 갱신하지 않는다.*
