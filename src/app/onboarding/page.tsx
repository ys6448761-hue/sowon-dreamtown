"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AurumTransferMoment from "@/components/dreamtown/AurumTransferMoment";

const MAX = 200;

export default function OnboardingPage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [showAurum, setShowAurum] = useState(false);
  const [pendingStarId, setPendingStarId] = useState<string | null>(null);

  const trimmed = content.trim();
  const canSubmit = trimmed.length > 0 && trimmed.length <= MAX;

  async function handleSubmit() {
    if (!canSubmit || status === "loading") return;
    setStatus("loading");

    try {
      const res = await fetch("/api/dt/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: trimmed }),
      });

      if (!res.ok) {
        setStatus("error");
        return;
      }

      const data: { success: boolean; starId: string } = await res.json();
      // 아우룸 연출 → onComplete에서 이동
      // 내 별 ID 영구 저장 — 어디서든 복귀 가능
      localStorage.setItem("dt_active_star_id", data.starId);
      setPendingStarId(data.starId);
      setShowAurum(true);
    } catch {
      setStatus("error");
    }
  }

  return (
    // relative 필요 — AurumTransferMoment가 absolute inset-0
    <main className="relative flex min-h-[70vh] flex-col items-center justify-center px-4">
      {/* 상단 안내 */}
      <div className="mb-10 text-center">
        <p className="text-2xl" aria-hidden="true">★</p>
        <h1 className="mt-3 text-lg font-semibold text-gray-800">
          지금 마음속에 있는 소원을
          <br />
          조용히 남겨볼까요?
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          잘 쓰지 않아도 괜찮아요.
          <br />
          지금 느껴지는 그대로면 충분해요.
        </p>
      </div>

      {/* 소원 입력 */}
      <div className="w-full max-w-sm">
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="예) 올해 안에 좋아하는 일로 생계를 유지하고 싶어요."
          rows={4}
          maxLength={MAX}
          className="w-full resize-none rounded-xl border border-[#9B87F5]/30 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-[#9B87F5] focus:ring-1 focus:ring-[#9B87F5]/40"
        />
        <p className="mt-1 text-right text-xs text-gray-300">
          {trimmed.length} / {MAX}
        </p>

        {/* 에러 메시지 — 압박 없이 */}
        {status === "error" && (
          <p className="mt-2 text-center text-sm text-gray-400">
            다시 한 번 천천히 남겨볼까요?
          </p>
        )}

        {/* 제출 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || status === "loading" || showAurum}
          className="mt-4 w-full rounded-full bg-[#9B87F5] py-3 text-sm font-medium text-white transition-opacity disabled:opacity-40"
        >
          {status === "loading" && !showAurum ? "별에 담는 중이에요…" : "조용히 남기기"}
        </button>
      </div>

      {/* 아우룸 연출 — 제출 성공 직후 0.5초 1회 */}
      <AurumTransferMoment
        visible={showAurum}
        onComplete={() => {
          setShowAurum(false);
          router.push(`/home?starId=${pendingStarId}`);
        }}
      />
    </main>
  );
}
