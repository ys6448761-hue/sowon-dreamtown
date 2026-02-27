# REDIRECT 템플릿 실험 운영 규정 (SOP)

## 실험 정보
- 시작일: 2026-02-27
- 종료 예정: 2026-03-13 (D+14)
- 분류: 소원꿈터 / 성장실험 / REDIRECT A-B-C

## 실험 목적
REDIRECT 사유 템플릿(A/B/C)에 따른 재제출 전환율 개선

Primary KPI:
- RESUBMIT / REDIRECT

Secondary KPI:
- APPROVED_after_resubmit / RESUBMIT

---

## 운영 동결 규칙 (14일)

1. 템플릿 문구 수정 금지
2. 운영자 커스텀 사유는 1문장 보강까지만
3. 템플릿 수동 선택 금지 (자동 랜덤 1/3)
4. 최초 REDIRECT 시 templateType 고정 유지
5. redirectReason에는 최소 템플릿 문구 1문장 이상 반드시 저장

---

## 운영 루틴

### 매일 (5분)
- /admin/metrics (7d) 확인
- 알람 발생 여부 확인
- Template Performance 표본수 확인

### 주 1회 (15분)
- /admin/metrics (30d) 확인
- A/B/C별 REDIRECT n / RESUBMIT n / 전환율 비교
- 극단 쏠림(랜덤 불균형) 여부 점검

---

## D+7 중간 점검

- template별 REDIRECT n 확인
- n < 10 → 결론 금지
- 전환율 참고만 (승자 선언 금지)

## D+14 최종 판독

판독 조건:
- template별 REDIRECT n >= 20 또는 14일 경과

승자 기준:
- 1순위: RESUBMIT / REDIRECT
- 2순위: APPROVED_after_resubmit / RESUBMIT

탈락 조건:
- 재제출은 높으나 승인 전환율 급락

판독 명령:
```bash
npx tsx scripts/evaluate-experiment.ts --range 14d
```

---

## 결과 처리

- 승자 템플릿 단일 표준화
- 패자 템플릿 제거 또는 개선 실험 설계
- 실험 종료 후 SOP 업데이트
