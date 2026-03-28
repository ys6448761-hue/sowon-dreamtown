/**
 * API 에러 분류 + request_id 생성 유틸
 *
 * DoD: error_class !== "Unknown" 보장 (가능한 경우)
 *      request_id로 서버 로그 1회 추적 가능
 */

import { NextResponse } from "next/server";

export type ErrorClass =
  | "Validation"   // 입력값 오류, JSON parse, 필드 누락
  | "DB"           // Prisma / DB 레이어 오류
  | "External"     // fetch, 외부 API 오류
  | "Runtime"      // undefined 참조, TypeError 등
  | "Auth"         // 인증/권한 오류
  | "Unknown";     // 분류 불가 (최후 수단)

export function classifyError(err: unknown): ErrorClass {
  if (err instanceof SyntaxError) return "Validation";
  if (err instanceof TypeError)   return "Runtime";

  if (err instanceof Error) {
    const msg = err.message ?? "";
    const code = (err as { code?: string }).code ?? "";

    // Prisma 에러 코드 (P1xxx = 연결, P2xxx = 쿼리, P3xxx = 마이그레이션)
    if (code.match(/^P[123]\d{3}$/)) return "DB";
    // PrismaClientUnknownRequestError / PrismaClientKnownRequestError
    if (err.constructor?.name?.startsWith("PrismaClient")) return "DB";

    if (msg.includes("JSON") || msg.includes("parse"))       return "Validation";
    if (msg.includes("fetch") || msg.includes("ECONNREFUSED")) return "External";
    if (msg.includes("undefined") || msg.includes("null"))   return "Runtime";
    if (msg.includes("Unauthorized") || msg.includes("403")) return "Auth";
  }

  return "Unknown";
}

export function makeRequestId(): string {
  return crypto.randomUUID();
}

/**
 * 500 응답 표준 헬퍼
 * - request_id 생성 + 로그 출력 + error_class 분류
 * - body: { error: "INTERNAL_ERROR", error_class, request_id }
 */
export function serverError(
  label: string,
  err: unknown,
  requestId: string = makeRequestId(),
): NextResponse {
  const error_class = classifyError(err);
  console.error(`[${label}] request_id=${requestId} error_class=${error_class}`, err);
  return NextResponse.json(
    { error: "INTERNAL_ERROR", error_class, request_id: requestId },
    { status: 500 },
  );
}
