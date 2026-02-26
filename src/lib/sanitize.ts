/** HTML 태그 제거 + trim. XSS 방지용 서버 저장 전 필터. */
export function sanitizeText(input: string): string {
  if (!input) return "";
  return input.replace(/<[^>]*>?/gm, "").trim();
}
