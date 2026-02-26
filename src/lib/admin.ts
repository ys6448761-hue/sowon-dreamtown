export function getAdminAllowlist(): string[] {
  return (process.env.NEXT_PUBLIC_ADMIN_ALLOWLIST ?? "")
    .split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
}

export function isAdmin(name?: string | null): boolean {
  if (!name) return false;
  return getAdminAllowlist().includes(name.trim().toLowerCase());
}
