# Day5 배포 런북 v2.0 (PR-16A/B/C 완료)

> 팀 공유용 SSOT. 배포 시 이 문서 순서대로 진행.

---

## 0. 환경변수 확인 (배포 전 필수)

### A. Prisma/DB
- [ ] `DATABASE_URL` : staging DB로 정확히 연결 (prod 금지)
- [ ] `DIRECT_URL` : migration/배치용 URL 일치 (사용 시)

### B. Auth/Admin
- [ ] `NEXTAUTH_URL` : staging 도메인
- [ ] `NEXTAUTH_SECRET` : 설정됨 (비어있으면 세션 불안정)
- [ ] `NEXT_PUBLIC_ADMIN_ALLOWLIST` : 운영자 닉네임 포함

### C. 운영
- [ ] `NODE_ENV=production`

---

## 1. Staging 배포

```bash
# 1-1. 마이그레이션 적용 (7개 전부 통과 확인)
npx prisma migrate deploy
npx prisma migrate status

# 1-2. 시드 APPROVED 글 3개 (공개 피드 비어 보이는 것 방지)
npx tsx scripts/seed-approved-posts.ts
```

---

## 2. 스모크 테스트 (필수 8개, 10분)

| # | 테스트 | 기대 결과 |
|---|--------|----------|
| 1 | 글 작성 | status=PENDING 생성 |
| 2 | `/admin/posts` | 해당 글 목록에 표시 |
| 3 | 승인(APPROVE) | `/plaza`에 공개 노출 |
| 4 | 전환(REDIRECT) + 사유 | 공개 비노출, 사유 저장. 빈 사유 → 400, 301자 → 400 |
| 5 | 거절(REJECT) | 공개 비노출 |
| 6 | PENDING 아닌 글 PATCH | 409 방어 확인 |
| 7 | `/my/posts` 재제출 | REDIRECT/ARCHIVED → PENDING 복귀 |
| 8 | 비관리자 `/admin/posts` | 403 차단 |

### 추가 확인
- [ ] APPROVED 글 좋아요 정상, PENDING 글 좋아요 → 400
- [ ] `/my/posts` 비로그인 → 로그인 유도
- [ ] `/plaza?mine=true` 비로그인 → 로그인 유도
- [ ] KPI API: `GET /api/admin/kpi` 정상 응답

---

## 3. KPI 6개 확인

```
GET /api/admin/kpi
```

| # | KPI | 설명 |
|---|-----|------|
| 1 | byStatus | 상태별 글 수 (PENDING/APPROVED/REDIRECT/REJECTED/ARCHIVED) |
| 2 | approvalRate | 승인율 = APPROVED / 전체 검토 완료 |
| 3 | avgReviewHours | 평균 검토 시간 (작성→첫 검토) |
| 4 | resubmitRate | 재제출률 = 재제출 PENDING / 전환된 글 |
| 5 | pendingQueue | 대기 큐 크기 + 최오래 대기 시간 |
| 6 | todayPosts | 오늘 작성 수 |

---

## 4. Prod 승격 조건

- [ ] 스모크 8개 전부 통과
- [ ] 공개 피드 비어있지 않음 (시드 3개)
- [ ] 500 에러 없음
- [ ] KPI API 정상 응답

---

## 5. 운영 원칙

> "삭제 없음. 큐레이션 중심. 사용자 주도 재도전."

### 상태 파이프라인
```
작성 → PENDING → Admin 검토
  → APPROVED (공개)
  → REDIRECT (전환 + 사유, 3일 후 자동 ARCHIVED)
  → REJECTED (거절)
  → 재제출 → PENDING (재순환)
```

### 핵심 URL
| 페이지 | URL |
|--------|-----|
| 공개 광장 | `/plaza` |
| 글 작성 | `/plaza/new` |
| 내 글 | `/my/posts` |
| Admin 홈 | `/admin` |
| 나눔 검토 | `/admin/posts` |
| KPI | `/api/admin/kpi` |
| 글 로그 | `/api/admin/posts/:id/logs` |
