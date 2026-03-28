import { NextRequest, NextResponse } from "next/server";

/**
 * 미들웨어 — 공개 경로 가드
 *
 * 1. 중복 슬래시 정규화 (//dreamtown → /dreamtown)
 * 2. ?entry=invite 포함 모든 경로 → /dreamtown 강제 (star auto-load 금지 경로)
 */
export function middleware(req: NextRequest) {
  const { pathname, search, searchParams } = req.nextUrl;

  // 1. 중복 슬래시 정규화
  const normalized = pathname.replace(/\/+/g, "/");
  if (normalized !== pathname) {
    const url = req.nextUrl.clone();
    url.pathname = normalized;
    return NextResponse.redirect(url, { status: 308 });
  }

  // 2. ?entry=invite → /dreamtown 강제 (개인 경로에 invite 붙어도 public flow)
  const isInvite = searchParams.get("entry") === "invite";
  const isAlreadyDreamtown = normalized === "/dreamtown";
  if (isInvite && !isAlreadyDreamtown) {
    const url = req.nextUrl.clone();
    url.pathname = "/dreamtown";
    url.search = search; // 파라미터 유지 (entry=invite 포함)
    return NextResponse.redirect(url, { status: 302 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // API, _next static, 파비콘 제외
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
