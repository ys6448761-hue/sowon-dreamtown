/**
 * PHX-WISHART-009 — WISHART_ACCESS_PIN 검증 + Rate limit
 *
 * - PIN 값은 로그·에러 응답·GitHub에 절대 노출하지 않는다.
 * - In-memory rate limit: Render 단일 인스턴스 가정 (재시작 시 초기화).
 * - 10회/15분 초과 시 rate_limited.
 */

export type PinResult = "ok" | "wrong" | "not_configured" | "rate_limited";

const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000;

// ip → { count, resetAt(ms) }
const attempts = new Map<string, { count: number; resetAt: number }>();

export function checkPin(pin: string | null | undefined, ip: string): PinResult {
  const configured = process.env.WISHART_ACCESS_PIN;
  if (!configured) return "not_configured";

  const now = Date.now();
  const entry = attempts.get(ip);

  if (entry) {
    if (now >= entry.resetAt) {
      attempts.delete(ip);
    } else if (entry.count >= MAX_ATTEMPTS) {
      return "rate_limited";
    }
  }

  if (!pin || pin.trim() !== configured) {
    const current = attempts.get(ip);
    if (current && now < current.resetAt) {
      current.count += 1;
    } else {
      attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    }
    return "wrong";
  }

  attempts.delete(ip);
  return "ok";
}

export function getClientIp(req: { headers: { get(name: string): string | null } }): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}
