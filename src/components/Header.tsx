"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { readSavedStar } from "@/lib/utils/starSession";

// 공개 경로 — "내 별" 버튼 숨김 (star auto-load 차단)
const PUBLIC_ROUTES = ["/dreamtown", "/my-star"];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const isPublicRoute = PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "?"));

  function goToMyStar() {
    const starId = readSavedStar();
    if (starId) {
      router.push(`/home?starId=${starId}`);
    } else {
      router.push("/onboarding");
    }
  }

  return (
    <header className="mb-8 flex items-center justify-between">
      <Link href="/" className="text-4xl font-bold text-violet-600">
        소원꿈터
      </Link>

      <nav className="flex items-center gap-4 text-lg">
        <Link href="/plaza">광장</Link>
        <Link href="/events">이벤트</Link>
        {/* 공개 경로에서는 "내 별" 버튼 숨김 — localStorage → /home 자동 이동 차단 */}
        {!isPublicRoute && (
          <button
            type="button"
            onClick={goToMyStar}
            className="rounded-xl bg-[#9B87F5] px-5 py-2.5 text-sm text-white hover:bg-[#8B74F0] transition-colors"
          >
            내 별
          </button>
        )}
      </nav>
    </header>
  );
}