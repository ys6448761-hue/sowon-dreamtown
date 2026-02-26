# 소원꿈터 KPI & Event Dictionary

> 작성일: 2026-02-26

## 핵심 KPI

| KPI | 정의 | 목표 (v0) |
|-----|------|----------|
| DAU | 일간 활성 사용자 | 측정 시작 |
| 글 작성률 | 글 작성 수 / DAU | 측정 시작 |
| 좋아요률 | 좋아요 수 / 글 조회 수 | 측정 시작 |

## Event Dictionary

### v0 이벤트

| Event Name | Trigger | Properties | 구현 |
|------------|---------|------------|------|
| `plaza_post_view` | 글 목록 조회 | `{ timestamp }` | console.log |
| `plaza_post_create` | 글 작성 완료 | `{ postId, authorId, timestamp }` | console.log |
| `plaza_like_click` | 좋아요 클릭 | `{ postId, userId, timestamp }` | console.log |

### 이벤트 로깅 형식 (v0)

```
EVENT: {event_name} {properties_json}
```

예시:
```
EVENT: plaza_post_create {"postId":1,"authorId":"user_1","timestamp":"2026-02-26T10:00:00Z"}
```

### 향후 확장 (v1+)

| Event Name | Trigger | 우선순위 |
|------------|---------|---------|
| `plaza_post_delete` | 글 삭제 | P1 |
| `plaza_comment_create` | 댓글 작성 | P1 |
| `user_signup` | 회원가입 | P0 |
| `user_login` | 로그인 | P0 |

## 로깅 전략

| 단계 | 방식 | 시점 |
|------|------|------|
| v0 | `console.log` | 현재 |
| v1 | DB 테이블 저장 | 사용자 10명+ |
| v2 | 외부 분석 도구 연동 | 사용자 100명+ |
