# Day5 배포 런북 v1.1 (PR-16A 반영)

## 0. 사전 확인

- [ ] CI prisma migrate 통과
- [ ] staging DB 기존 post status 확인 (PENDING/APPROVED 값 정상)
- [ ] mine 비로그인 UX 확인 (에러 아닌 로그인 유도 문구)

## 1. Staging 배포 후 필수 운영 액션

### 시드 APPROVED 글 3개 생성

**목적:** 공개 피드가 비어 "고장"처럼 보이는 것 방지 + 나눔 톤 가이드 역할

**방법:**
```bash
npx tsx scripts/seed-approved-posts.ts
```

**권장 내용 (스크립트에 포함됨):**
1. 작은 실천에서 시작하는 기적
2. 오늘의 감사 한 줄
3. 힘들었지만 이렇게 바꿔봤어요

## 2. 공개 피드 확인

- [ ] /plaza 접근 시 시드 3개 정상 노출
- [ ] 새 글 작성 → PENDING → 공개 피드에 안 뜸
- [ ] mine 모드에서 작성 글 보임 + "검토중" 뱃지

## 3. Like / Rate Limit 확인

- [ ] APPROVED 글 좋아요 정상
- [ ] PENDING 글 좋아요 차단 (400)
- [ ] 10회 초과 시 429

## 4. Prod 승격 조건

- [ ] 공개 피드 비어있지 않음
- [ ] 검토중 UX 정상
- [ ] 500 에러 없음
- [ ] KPI 카드 정상

## 핵심 원칙

> "승인 UI(PR-16B) 전까지는 운영자가 공개 글을 의도적으로 유지한다."
