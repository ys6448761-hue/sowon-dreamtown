# 소원꿈터 현황판

> 최종 업데이트: 2026-02-26

## 프로젝트 상태: 🟢 정상

| 항목 | 상태 |
|------|------|
| 레포 | ✅ 생성 완료 |
| 스택 | Next.js + Prisma + SQLite(dev) |
| Gate 시스템 | ✅ 적용 |
| 광장 CRUD | ✅ 완료 |

## 현재 마일스톤

- [x] GitHub 레포 생성
- [x] Next.js App Router 초기화
- [x] Gate 시스템 이식 (5파일 + CI)
- [x] Prisma v0 스키마 + 마이그레이션
- [x] 광장 최소 CRUD (글 작성/목록/좋아요)
- [x] KPI 이벤트 로깅 (console.log)

## API 엔드포인트

| Method | Path | 기능 |
|--------|------|------|
| GET | `/api/post` | 글 목록 조회 |
| POST | `/api/post` | 글 작성 |
| POST | `/api/like` | 좋아요 토글 |

## 팀

| 역할 | 담당 |
|------|------|
| CEO | 푸르미르 (이세진) |
| 기술 | Claude Code |
