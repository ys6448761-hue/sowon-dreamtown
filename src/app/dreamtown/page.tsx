"use client";

/**
 * /dreamtown — 공개 입구 (Public Entry)
 *
 * 정책:
 *  - localStorage/cookie/session 무관하게 자동 복귀 절대 금지
 *  - ?entry=invite 포함 → 동일하게 public flow 강제
 *  - 기존 별 안내는 하단 약한 CTA로만 노출 (강제 이동 없음)
 *  - //dreamtown → middleware에서 /dreamtown 으로 308 redirect
 */

import { Component, ReactNode, Suspense, useSyncExternalStore } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { readSavedStar } from "@/lib/utils/starSession";

// useSyncExternalStore용 no-op subscribe — localStorage 변경 구독이 필요 없는
// 1회성 읽기(마운트/hydration 시점 값만 필요)라 빈 구독으로 충분하다.
function subscribeNoop() {
  return () => {};
}

// 공개 입구에서 throw = UX 파괴 — 에러 바운더리로 완전 차단
class PublicEntryErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: unknown) {
    console.error("[dreamtown/public] caught by ErrorBoundary:", err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-[#0D1B2A] px-6">
          <p className="text-sm text-white/40">잠시 후 다시 시도해주세요</p>
        </main>
      );
    }
    return this.props.children;
  }
}

export default function DreamtownEntryPage() {
  return (
    <PublicEntryErrorBoundary>
      <Suspense>
        <DreamtownEntry />
      </Suspense>
    </PublicEntryErrorBoundary>
  );
}

function DreamtownEntry() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // forcePublicEntry: /dreamtown 또는 ?entry=invite — star hydrate 전면 금지
  // (middleware가 invite를 /dreamtown 으로 redirect하므로 중복 방어)
  const forcePublicEntry =
    typeof window !== "undefined"
      ? window.location.pathname.replace(/\/+/g, "/") === "/dreamtown" ||
        searchParams.get("entry") === "invite"
      : true;

  // 자동 복귀 없음 — 존재 여부만 확인해서 복귀 버튼 노출 여부를 파생값으로 계산
  // (SSR에서는 항상 없음으로 취급, 클라이언트에서 실제 localStorage 값으로 재동기화)
  const savedStarId = useSyncExternalStore(subscribeNoop, () => readSavedStar(), () => null);
  const hasExistingStar = forcePublicEntry && Boolean(savedStarId);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0D1B2A] px-6">
      {/* 인트로 */}
      <div className="mb-14 text-center">
        <div className="mx-auto mb-6 h-3 w-3 rounded-full bg-[#9B87F5]"
          style={{ boxShadow: "0 0 18px 5px rgba(155,135,245,0.4)" }}
        />
        <h1 className="text-lg font-medium text-white/80">
          드림타운에 오신 걸 환영해요
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-white/40">
          소원을 품은 별들이 모이는 곳이에요.
          <br />
          당신의 별을 만들어보세요.
        </p>
      </div>

      {/* 메인 CTA */}
      <div className="w-full max-w-xs space-y-3">
        <button
          onClick={() => router.push("/onboarding")}
          className="w-full rounded-full bg-[#9B87F5] py-3.5 text-sm font-medium text-white"
        >
          별 만들기
        </button>
      </div>

      {/* 기존 별 — 약한 CTA (강제 이동 없음) */}
      {hasExistingStar && (
        <p className="mt-10 text-xs text-white/25">
          이미 만든 별이 있나요?{" "}
          <button
            onClick={() => router.push("/my-star")}
            className="underline underline-offset-4 hover:text-white/40 transition-colors"
          >
            내 별로 돌아가기
          </button>
        </p>
      )}
    </main>
  );
}
