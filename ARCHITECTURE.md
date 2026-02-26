# 소원꿈터 아키텍처

## 기술 스택

```
┌─────────────────────────────────────┐
│           Next.js App Router        │
│         (React Server Components)   │
├─────────────────────────────────────┤
│         API Routes (Route Handlers) │
│         src/app/api/**/route.ts     │
├─────────────────────────────────────┤
│            Prisma ORM               │
│         (Type-safe queries)         │
├─────────────────────────────────────┤
│     SQLite (dev) / PostgreSQL (prod)│
└─────────────────────────────────────┘
```

## 디렉토리 구조

```
sowon-dreamtown/
├── prisma/
│   └── schema.prisma          # DB 스키마
├── scripts/
│   └── status-gate.js         # Gate 검증
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── post/route.ts  # 글 CRUD API
│   │   │   └── like/route.ts  # 좋아요 API
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── lib/
│       └── prisma.ts          # Prisma Client 싱글턴
├── AURORA-STATUS.md
├── MVP_SCOPE.md
├── DECISIONS.md
├── ARCHITECTURE.md
└── KPI.md
```

## 데이터 모델 (v0)

```
User ──┐
       ├──< Post ──< Like
       │
       └──< EventParticipation >── Event
```

- **User**: 사용자 기본 정보
- **Post**: 광장 게시글
- **Like**: 좋아요 (User-Post 관계)
- **Event**: KPI 이벤트 정의
- **EventParticipation**: 이벤트 참여 기록

## API 엔드포인트

| Method | Path | 기능 | KPI Event |
|--------|------|------|-----------|
| GET | `/api/post` | 글 목록 | `plaza_post_view` |
| POST | `/api/post` | 글 작성 | `plaza_post_create` |
| POST | `/api/like` | 좋아요 | `plaza_like_click` |

## 환경별 DB

| 환경 | DB | 이유 |
|------|-----|------|
| Development | SQLite | 제로 설정, 빠른 개발 |
| Production | PostgreSQL | 확장성, 동시성 |
