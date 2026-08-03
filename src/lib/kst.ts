/**
 * [DORMANT FEATURE] 현재 유일한 사용처(AIL-RESV-001 예약/알림)가 MVP에서 비활성 —
 * 삭제 아님, 향후 예약/알림 기능 재사용 예정.
 * AIL-RESV-001: KST(Asia/Seoul) 시간 변환 유틸
 * Dev Lock 8-1: 서버 단일 함수에서 KST ↔ UTC 변환. 프론트 계산 금지.
 * Dev Lock 8-8: NOW() 및 DB 시각은 무조건 UTC로 통일.
 */

import { toZonedTime, fromZonedTime, format as fnsFormat } from "date-fns-tz";

const TZ = "Asia/Seoul";

/**
 * KST 문자열(예: "2026-03-04T10:00") → UTC Date
 * 프론트에서 받은 KST 입력값을 UTC로 변환. 서버 전용.
 */
export function parseKstInput(kstStr: string): Date {
  // 타임존 미포함 문자열 → KST로 해석
  const withoutTz = kstStr.replace(/[Zz]$/, "").replace(/[+-]\d{2}:\d{2}$/, "");
  return fromZonedTime(new Date(withoutTz), TZ);
}

/** UTC Date → KST Date 객체 (표시 전용) */
export function toKst(utcDate: Date): Date {
  return toZonedTime(utcDate, TZ);
}

/** UTC Date → KST 포맷 문자열 */
export function formatKst(utcDate: Date, fmt = "yyyy-MM-dd HH:mm"): string {
  return fnsFormat(toZonedTime(utcDate, TZ), fmt, { timeZone: TZ });
}

/** 오늘 KST 날짜 키 (YYYY-MM-DD) */
export function getKstDateKey(date = new Date()): string {
  return fnsFormat(toZonedTime(date, TZ), "yyyy-MM-dd", { timeZone: TZ });
}

/** 오늘 KST 기준 특정 시각의 UTC Date 계산 (예: 09:00 KST) */
export function getKstTimeUtc(hour: number, minute: number, date = new Date()): Date {
  const kstDay = fnsFormat(toZonedTime(date, TZ), "yyyy-MM-dd", { timeZone: TZ });
  const kstStr = `${kstDay}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  return fromZonedTime(new Date(kstStr), TZ);
}

/**
 * Schedule.startAt(UTC) 기준 30분 전 triggerAt(UTC) 계산
 * Dev Lock 8-2: 생성 시점에 미리 계산하여 DB에 저장.
 */
export function calcBefore30mTrigger(startAtUtc: Date): Date {
  return new Date(startAtUtc.getTime() - 30 * 60 * 1000);
}

/** 테스트 알람용 분 단위 버킷 (rate limit: 1분당 1회) */
export function getMinuteBucket(): number {
  return Math.floor(Date.now() / 60_000);
}
