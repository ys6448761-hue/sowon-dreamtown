export function safeString(str: string, maxLen?: number): string {
  const chars = Array.from(str ?? "");
  return maxLen ? chars.slice(0, maxLen).join("") : chars.join("");
}
