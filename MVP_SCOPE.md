# 소원꿈터 MVP Scope v1

> 작성일: 2026-02-26

## 비전

소원꿈터는 팬덤 기반 커뮤니티 플랫폼으로, 사용자들이 소원을 공유하고 서로 응원하는 광장(Plaza)을 중심으로 운영됩니다.

## MVP 범위 (v0)

### 포함

| 기능 | 설명 | 우선순위 |
|------|------|---------|
| 광장 글 작성 | 텍스트 기반 게시글 CRUD | P0 |
| 광장 글 목록 | 최신순 글 목록 조회 | P0 |
| 좋아요 | 게시글 좋아요 토글 | P0 |
| KPI 이벤트 로깅 | 주요 액션 콘솔 로그 | P0 |
| 사용자 모델 | 기본 User 스키마 | P0 |

### 제외 (v0 범위 밖)

- 댓글 시스템
- 이미지 업로드
- 알림 시스템
- 소셜 로그인
- 검색 기능
- 실시간 채팅

## 기술 스택

| 레이어 | 기술 |
|--------|------|
| Frontend | Next.js 14+ App Router |
| Styling | Tailwind CSS |
| ORM | Prisma |
| DB (dev) | SQLite |
| DB (prod) | PostgreSQL (전환 예정) |
| Language | TypeScript |

## Done 조건

1. `POST /api/post` → 글 생성 성공
2. `GET /api/post` → 글 목록 반환
3. `POST /api/like` → 좋아요 성공
4. 콘솔 EVENT 로그 출력 확인
5. Gate 스크립트 PASS
