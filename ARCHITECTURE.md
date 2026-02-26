# Architecture (소원꿈터 v0)

## Stack

- Web: Next.js (App Router)
- DB: SQLite (dev) / PostgreSQL (prod)
- ORM: Prisma **6.x pinned**
- Deploy: TBD

## Generated Prisma Client

- source: `src/generated/prisma/client.ts`
- import rule: `../generated/prisma/client`

## Domain

- User / Post / Like / Event / EventParticipation

## 디렉토리 구조

```
sowon-dreamtown/
├── prisma/
│   └── schema.prisma          # DB 스키마
├── scripts/
│   └── status-gate.js         # Gate 검증
├── src/
│   ├── app/
│   │   └── api/
│   │       ├── post/route.ts  # 글 CRUD API
│   │       └── like/route.ts  # 좋아요 API
│   └── lib/
│       └── prisma.ts          # Prisma Client 싱글턴
├── AURORA-STATUS.md
├── MVP_SCOPE.md
├── DECISIONS.md
├── ARCHITECTURE.md
└── KPI.md
```

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
