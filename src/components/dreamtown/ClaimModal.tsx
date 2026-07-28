"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const CLAIM_STORAGE_KEY = "dt_claim_handled";

export default function ClaimModal() {
  const { status } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // 로그인 감지 시 Modal 표시
  // localStorage: Claim 완료/불가 → 영구 숨김
  // sessionStorage: "나중에" → 현재 탭 세션 동안 숨김
  useEffect(() => {
    if (status !== "authenticated") return;
    if (localStorage.getItem(CLAIM_STORAGE_KEY)) return;
    if (sessionStorage.getItem(CLAIM_STORAGE_KEY)) return;
    setOpen(true);
  }, [status]);

  function dismiss() {
    sessionStorage.setItem(CLAIM_STORAGE_KEY, "1");
    setOpen(false);
  }

  async function handleClaim() {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/dt/claim", { method: "POST" });
      const data: { ok?: boolean; claimedStars?: number; error?: string } = await res.json();

      setOpen(false);

      if (res.ok && data.ok) {
        localStorage.setItem(CLAIM_STORAGE_KEY, "done");
        const count = data.claimedStars ?? 0;
        showToast(count > 0 ? `별 ${count}개를 계정으로 가져왔습니다.` : "별을 계정으로 가져왔습니다.");
        setTimeout(() => window.location.reload(), 1500);
      } else if (res.status === 409) {
        localStorage.setItem(CLAIM_STORAGE_KEY, "done");
        showToast("이미 가져온 별입니다.");
      } else if (res.status === 401) {
        showToast("로그인이 만료되었습니다. 다시 로그인해 주세요.");
      } else if (res.status === 403 || res.status === 404) {
        localStorage.setItem(CLAIM_STORAGE_KEY, "no_guest");
        showToast("가져올 데이터가 없습니다.");
      } else {
        showToast("오류가 발생했습니다. 다시 시도해 주세요.");
      }
    } catch {
      setOpen(false);
      showToast("오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <>
      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="claim-modal-title"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white px-6 py-7 shadow-xl">
            <p id="claim-modal-title" className="mb-2 text-base font-semibold text-gray-800">
              Guest로 만든 별을<br />현재 계정으로 가져오시겠습니까?
            </p>
            <p className="mb-6 text-sm leading-relaxed text-gray-500">
              Guest로 세운 소원과 항해기록을<br />
              로그인 계정과 연결합니다.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={dismiss}
                disabled={loading}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40"
              >
                나중에
              </button>
              <button
                type="button"
                onClick={handleClaim}
                disabled={loading}
                className="flex-1 rounded-xl bg-[#9B87F5] py-2.5 text-sm font-medium text-white hover:bg-[#8B74F0] transition-colors disabled:opacity-40"
              >
                {loading ? "가져오는 중…" : "가져오기"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full bg-gray-800/90 px-5 py-2.5 text-sm text-white shadow-lg"
          role="status"
          aria-live="polite"
        >
          {toast}
        </div>
      )}
    </>
  );
}
