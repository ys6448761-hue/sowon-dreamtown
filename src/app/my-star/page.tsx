"use client";

/**
 * /my-star — 개인 복귀 진입점 (Personal Return)
 *
 * 정책:
 *  - localStorage에 별이 있으면 상태에 따라 분기 UI 노출
 *  - ready: 소원그림 대기 안내 + 하멜등대 공개 흐름
 *  - revealed: 소원그림 표시
 *  - 그 외: 기존 복귀/새 별 선택 UI
 *  - 별이 없으면 /onboarding으로
 */

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { readSavedStar } from "@/lib/utils/starSession";

function subscribeNoop() {
  return () => {};
}

type StarStatus = {
  status: "no_data" | "photo_missing" | "wish_missing" | "ready" | "revealed";
  visitorName: string | null;
  wishImageUrl: string | null;
  wishImageStatus: string;
  wishImageRevealedAt: string | null;
};

export default function MyStarPage() {
  const router = useRouter();
  // SSR에서는 항상 null, 클라이언트에서 실제 localStorage 값으로 재동기화
  const starId = useSyncExternalStore(subscribeNoop, () => readSavedStar(), () => null);

  const [starStatus, setStarStatus] = useState<StarStatus | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showRevealConfirm, setShowRevealConfirm] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [revealError, setRevealError] = useState("");

  useEffect(() => {
    if (!starId) {
      router.replace("/onboarding");
      return;
    }
    fetch(`/api/dt/checkin-status?starId=${starId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: StarStatus | null) => {
        if (data) setStarStatus(data);
        setIsLoaded(true);
      })
      .catch(() => { setIsLoaded(true); });
  }, [starId, router]);

  // 소원그림 생성 중 폴링
  useEffect(() => {
    const ws = starStatus?.wishImageStatus;
    if (!starId || (ws !== "pending" && ws !== "generating")) return;

    const id = setInterval(() => {
      fetch(`/api/dt/checkin-status?starId=${starId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data: StarStatus | null) => { if (data) setStarStatus(data); })
        .catch(() => {});
    }, 3000);

    return () => clearInterval(id);
  }, [starId, starStatus?.wishImageStatus]);

  async function handleReveal() {
    if (!starId || isRevealing) return;
    setIsRevealing(true);
    setRevealError("");
    try {
      const res = await fetch("/api/dt/wishes/reveal", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ starId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const typed = data as { error?: string; wishImageStatus?: string };
        if (res.status === 409) {
          setRevealError("소원그림이 아직 준비되지 않았습니다. 잠시 후 다시 시도해 주세요.");
        } else {
          setRevealError(typed.error ?? "공개 처리 중 오류가 발생했습니다.");
        }
        return;
      }
      const data = await res.json();
      setStarStatus((prev) =>
        prev
          ? {
              ...prev,
              status: "revealed",
              wishImageRevealedAt: data.wishImageRevealedAt,
              wishImageUrl: data.wishImageUrl ?? prev.wishImageUrl,
            }
          : prev
      );
      setShowRevealConfirm(false);
    } catch {
      setRevealError("네트워크 연결을 확인해 주세요.");
    } finally {
      setIsRevealing(false);
    }
  }

  if (!starId) return null;

  if (!isLoaded) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#0D1B2A] px-6">
        <p className="text-sm text-white/40">내 별을 불러오고 있어요</p>
      </main>
    );
  }

  const isRevealed = starStatus?.status === "revealed";
  const wishImageStatus = starStatus?.wishImageStatus;
  const isGenerating = starStatus?.status === "ready" && (wishImageStatus === "pending" || wishImageStatus === "generating");
  const isFailed = starStatus?.status === "ready" && wishImageStatus === "failed";
  const isReady = starStatus?.status === "ready" && !isGenerating && !isFailed;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0D1B2A] px-6">

      {isRevealed ? (
        /* ── revealed: 소원그림 표시 ── */
        <div className="w-full max-w-sm">
          <div className="mb-6 text-center">
            <p
              className="text-2xl"
              style={{ filter: "drop-shadow(0 0 14px rgba(155,135,245,0.55))" }}
              aria-hidden="true"
            >
              ✨
            </p>
            <p className="mt-3 text-sm font-medium text-white/70">소원그림이 공개되었습니다</p>
          </div>
          {starStatus?.wishImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={starStatus.wishImageUrl}
              alt="소원그림"
              className="w-full rounded-2xl shadow-lg"
            />
          )}
          <div className="mt-6 space-y-3">
            <button
              onClick={() => router.push(`/checkin?starId=${starId}`)}
              className="w-full rounded-full bg-[#9B87F5] py-3.5 text-sm font-medium text-white"
            >
              내 소원그림 다시 보기
            </button>
            <button
              onClick={() => router.push("/checkin?mode=new")}
              className="w-full rounded-full border border-white/15 py-3 text-sm text-white/50 hover:text-white/70 transition-colors"
            >
              + 새 별 만들기
            </button>
          </div>
        </div>
      ) : isGenerating ? (
        /* ── 소원그림 생성 중 ── */
        <div className="w-full max-w-xs text-center">
          <div className="mb-6 text-3xl animate-pulse" aria-hidden="true">✨</div>
          <p className="text-sm font-medium text-white/70">소원그림을 그리는 중이에요</p>
          <p className="mt-2 text-xs text-white/40">완성되면 여기서 만날 수 있어요.</p>
          <div className="mt-6 flex justify-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#9B87F5] animate-bounce [animation-delay:0ms]" />
            <span className="h-2 w-2 rounded-full bg-[#9B87F5] animate-bounce [animation-delay:150ms]" />
            <span className="h-2 w-2 rounded-full bg-[#9B87F5] animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      ) : isFailed ? (
        /* ── 소원그림 생성 실패 ── */
        <div className="w-full max-w-xs text-center">
          <p className="text-3xl mb-5" aria-hidden="true">🌙</p>
          <p className="text-sm font-medium text-white/70">그림을 완성하지 못했어요</p>
          <p className="mt-2 text-xs text-white/40">다시 시도하거나 스태프에게 말씀해 주세요.</p>
          {revealError && <p className="mt-3 text-xs text-amber-400">{revealError}</p>}
          <div className="mt-6 space-y-3">
            <button
              onClick={async () => {
                if (!starId || isRevealing) return;
                setIsRevealing(true);
                setRevealError("");
                try {
                  const res = await fetch("/api/dt/wishart/retry", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ starId }),
                  });
                  if (!res.ok) {
                    const d = await res.json().catch(() => ({}));
                    setRevealError((d as { error?: string }).error === "generation unavailable"
                      ? "현재 그림 생성이 준비 중이에요. 스태프에게 문의해 주세요."
                      : "다시 시도 중 오류가 발생했습니다.");
                    return;
                  }
                  setStarStatus((prev) => prev ? { ...prev, wishImageStatus: "pending" } : prev);
                } catch {
                  setRevealError("네트워크 연결을 확인해 주세요.");
                } finally {
                  setIsRevealing(false);
                }
              }}
              disabled={isRevealing}
              className="w-full rounded-full bg-[#9B87F5] py-3.5 text-sm font-medium text-white disabled:opacity-40"
            >
              {isRevealing ? "시도 중…" : "다시 시도하기"}
            </button>
          </div>
        </div>
      ) : isReady ? (
        /* ── ready: 하멜등대 대기 안내 ── */
        <div className="w-full max-w-xs">
          {!showRevealConfirm ? (
            <>
              <div className="mb-10 text-center">
                <div
                  className="mx-auto mb-6 h-3 w-3 rounded-full bg-[#9B87F5]"
                  style={{ boxShadow: "0 0 18px 5px rgba(155,135,245,0.4)" }}
                />
                <p className="text-sm text-white/70">
                  당신의 소원그림이 별빛을 머금고 있어요.
                </p>
                <p className="mt-2 text-xs text-white/40">하멜등대에 도착하면 만나보세요.</p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => setShowRevealConfirm(true)}
                  className="w-full rounded-full bg-[#9B87F5] py-3.5 text-sm font-medium text-white"
                >
                  하멜등대에서 소원그림 만나기
                </button>
                <button
                  onClick={() => router.push(`/home?starId=${starId}`)}
                  className="w-full rounded-full border border-white/15 py-3 text-sm text-white/50 hover:text-white/70 transition-colors"
                >
                  내 별로 복귀
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-10 text-center">
                <p className="text-sm text-white/70">지금 하멜등대에 도착하셨나요?</p>
                {revealError && (
                  <p className="mt-3 text-xs text-amber-400">{revealError}</p>
                )}
              </div>
              <div className="space-y-3">
                <button
                  onClick={handleReveal}
                  disabled={isRevealing}
                  className="w-full rounded-full bg-[#9B87F5] py-3.5 text-sm font-medium text-white disabled:opacity-40"
                >
                  {isRevealing ? "공개 중…" : "네, 만나볼게요"}
                </button>
                <button
                  onClick={() => { setShowRevealConfirm(false); setRevealError(""); }}
                  disabled={isRevealing}
                  className="w-full rounded-full border border-white/15 py-3 text-sm text-white/50 hover:text-white/70 transition-colors disabled:opacity-40"
                >
                  아직 기다릴게요
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        /* ── 기본: 상태 없음 / 로딩 중 / photo_missing 등 ── */
        <div className="w-full max-w-xs">
          <div className="mb-12 text-center">
            <div
              className="mx-auto mb-6 h-3 w-3 rounded-full bg-[#9B87F5]"
              style={{ boxShadow: "0 0 18px 5px rgba(155,135,245,0.4)" }}
            />
            <p className="text-sm text-white/50">이전에 만든 별이 있어요</p>
            <p className="mt-2 text-xs text-white/25">어떻게 할까요?</p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => router.push(`/home?starId=${starId}`)}
              className="w-full rounded-full bg-[#9B87F5] py-3.5 text-sm font-medium text-white"
            >
              내 별로 복귀
            </button>
            <button
              onClick={() => router.push("/checkin")}
              className="w-full rounded-full border border-white/15 py-3.5 text-sm text-white/50 hover:text-white/70 transition-colors"
            >
              새 별 만들기
            </button>
          </div>
        </div>
      )}

    </main>
  );
}
