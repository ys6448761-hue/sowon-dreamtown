/**
 * readSavedStar — localStorage에서 dt_active_star_id를 읽는 단일 진입점
 *
 * 공개 경로(PUBLIC_ROUTES)에서는 null 반환 — 별 자동 복귀 전역 차단
 * SSR 환경(window 없음)에서도 null 반환
 */

const PUBLIC_ROUTES = ['/dreamtown'];

export function readSavedStar(): string | null {
  if (typeof window === 'undefined') return null;
  if (PUBLIC_ROUTES.includes(window.location.pathname)) return null;
  return localStorage.getItem('dt_active_star_id');
}
