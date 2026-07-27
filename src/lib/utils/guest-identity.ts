import { createHash, randomBytes } from "crypto";

export const GUEST_TOKEN_COOKIE_NAME = "dt_guest_token";
export const GUEST_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 year

export function generateGuestToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashGuestToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function calculateGuestIdentityExpiry(now = new Date()): Date {
  return new Date(now.getTime() + GUEST_TOKEN_MAX_AGE_SECONDS * 1000);
}
