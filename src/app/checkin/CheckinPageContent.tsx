"use client";

/**
 * /checkin 체크인 UI — Client Component
 * useSearchParams()를 사용하므로 page.tsx의 <Suspense> 내부에서만 렌더링.
 */

import { useRef, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

type CheckinStatus = {
  status: "no_data" | "photo_missing" | "wish_missing" | "ready" | "revealed";
  visitorName: string | null;
  // photoUrl 제외 — API 응답에서 삭제됨 (개인정보 보호, S4)
  wishContent: string | null;
  wishImageUrl: string | null;
  wishImageStatus: string;
  wishImageRevealedAt: string | null;
};

const NAME_MAX = 50;
const PHONE_MAX = 20;
const WISH_MAX = 200;

export default function CheckinPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>(1);

  // 입력값
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [wish, setWish] = useState("");

  // 제출 상태
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [completedStarId, setCompletedStarId] = useState<string | null>(null);

  const [showImmediateConfirm, setShowImmediateConfirm] = useState(false);

  // Phase A: Resume state
  const [resumeStarId, setResumeStarId] = useState<string | null>(null);
  const [checkinStatus, setCheckinStatus] = useState<CheckinStatus | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const trimName = name.trim();
  const trimPhone = phone.trim();
  const trimWish = wish.trim();

  // Phase A: Auto-initialize — ?starId= URL 우선, 없으면 쿠키로 기존 별 조회
  useEffect(() => {
    const starId = searchParams.get("starId");
    if (starId) {
      setResumeStarId(starId);
      fetchCheckinStatus(starId);
      return;
    }

    // ?starId= 없음 — dt_guest_token 쿠키 기반으로 기존 별 조회 (서버에서 쿠키 읽음)
    // 기존 /api/dt/me/star 재사용. 신규 사용자(401)는 Step 1으로 자연스럽게 진입.
    fetch("/api/dt/me/star")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { ok: boolean; star: { id: string } } | null) => {
        if (data?.ok && data.star?.id) {
          setResumeStarId(data.star.id);
          fetchCheckinStatus(data.star.id);
        } else {
          setIsInitializing(false);
        }
      })
      .catch(() => setIsInitializing(false));
  }, [searchParams]);

  // 소원그림 생성 중 폴링 — wishImageStatus가 pending|generating인 동안 3초마다 재조회
  useEffect(() => {
    const isGenerating =
      step === 7 &&
      checkinStatus?.wishImageStatus !== undefined &&
      (checkinStatus.wishImageStatus === "pending" || checkinStatus.wishImageStatus === "generating");

    if (!isGenerating || !resumeStarId) return;

    const id = setInterval(() => {
      fetchCheckinStatus(resumeStarId);
    }, 3000);

    return () => clearInterval(id);
  }, [step, checkinStatus?.wishImageStatus, resumeStarId]);

  async function fetchCheckinStatus(starId: string) {
    try {
      const res = await fetch(`/api/dt/checkin-status?starId=${starId}`);
      if (!res.ok) {
        setErrorMsg("진행 상태를 불러오지 못했습니다.");
        setIsInitializing(false);
        return;
      }
      const data: CheckinStatus = await res.json();
      setCheckinStatus(data);
      routeToCorrectStep(data);
    } catch (err) {
      console.error("fetchCheckinStatus error:", err);
      setErrorMsg("네트워크 연결을 확인해 주세요.");
      setIsInitializing(false);
    }
  }

  function routeToCorrectStep(status: CheckinStatus) {
    switch (status.status) {
      case "no_data":
        setStep(1);
        break;
      case "photo_missing":
        setStep(3);
        break;
      case "wish_missing":
        // 사진은 이미 저장되어 있으나 미리보기 불가(보안). Step 3부터 재진입해 사진 재선택 후 소원 작성.
        if (status.visitorName) setName(status.visitorName);
        setStep(3);
        break;
      case "ready":
      case "revealed":
        setStep(7);
        if (status.visitorName) setName(status.visitorName);
        break;
    }
    setIsInitializing(false);
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setPhotoFile(file);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  }

  async function handleSubmit() {
    if (!trimName || !photoFile || !trimWish || status === "loading") return;
    setStatus("loading");
    setErrorMsg("");

    try {
      const body = new FormData();
      body.append("name", trimName);
      if (trimPhone) body.append("phone", trimPhone);
      body.append("photo", photoFile);
      body.append("wish", trimWish);

      const res = await fetch("/api/checkin", { method: "POST", body });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMsg((data as { error?: string }).error ?? "잠시 문제가 생겼습니다.");
        setStatus("error");
        return;
      }

      const data: { success: boolean; starId: string; isResuming?: boolean } =
        await res.json();

      // 별 ID를 localStorage에 저장 — 이후 /home에서 복귀 가능
      if (typeof window !== "undefined") {
        localStorage.setItem("dt_active_star_id", data.starId);
      }

      if (data.isResuming) {
        // 기존 별 발견 — fetchCheckinStatus 완료 전까지 loading 유지 (버튼 조기 복귀 방지)
        setResumeStarId(data.starId);
        setIsInitializing(true);
        await fetchCheckinStatus(data.starId);
        setStatus("idle");
        return;
      }

      setCompletedStarId(data.starId);
      setStatus("idle");
      setStep(6);
    } catch {
      setErrorMsg("네트워크 연결을 확인하고 다시 시도해 주세요.");
      setStatus("error");
    }
  }

  async function handleReveal() {
    if (!resumeStarId || status === "loading") return;
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/dt/wishes/reveal", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ starId: resumeStarId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMsg((data as { error?: string }).error ?? "공개 처리 중 오류가 발생했습니다.");
        setStatus("error");
        return;
      }

      const data = await res.json();
      setCheckinStatus((prev) =>
        prev
          ? {
              ...prev,
              status: "revealed",
              wishImageRevealedAt: data.wishImageRevealedAt,
            }
          : null
      );
      setStatus("idle");
      setStep(7);
    } catch {
      setErrorMsg("네트워크 연결을 확인하고 다시 시도해 주세요.");
      setStatus("error");
    }
  }

  return (
    <main className="flex min-h-[85vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* 초기 로딩 — 쿠키 확인 중 (isInitializing=true && step===1) */}
        {isInitializing && step === 1 && (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-400">…</p>
          </div>
        )}

        {/* Step 1: 환영 */}
        {step === 1 && !isInitializing && (
          <section className="text-center">
            <p className="text-3xl" aria-hidden="true">✦</p>
            <h1 className="mt-4 text-lg font-semibold text-gray-800">
              DreamTown Check-in
            </h1>
            <p className="mt-5 text-base leading-relaxed text-gray-600">
              당신의 별씨앗이 기다리고 있어요.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">
              별들의 고향에 도착하셨습니다.
              <br />
              지금부터 당신의 별빛항로를 준비합니다.
            </p>
            <button
              onClick={() => setStep(2)}
              className="mt-10 w-full rounded-full bg-[#9B87F5] py-3 text-sm font-medium text-white"
            >
              우주민 등록 시작하기
            </button>
          </section>
        )}

        {/* Step 2: 우주민 등록 (이름 + 전화번호) */}
        {step === 2 && (
          <section>
            <h2 className="text-center text-lg font-semibold text-gray-800">
              우주민 등록
            </h2>
            <p className="mt-2 text-center text-sm leading-relaxed text-gray-400">
              DreamTown에서 사용할
              <br />
              당신의 이름을 알려주세요.
            </p>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력해주세요"
              maxLength={NAME_MAX}
              className="mt-6 w-full rounded-xl border border-[#9B87F5]/30 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-[#9B87F5] focus:ring-1 focus:ring-[#9B87F5]/40"
            />

            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="연락 가능한 휴대전화 번호 (선택)"
              maxLength={PHONE_MAX}
              type="tel"
              inputMode="tel"
              className="mt-3 w-full rounded-xl border border-[#9B87F5]/30 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-[#9B87F5] focus:ring-1 focus:ring-[#9B87F5]/40"
            />

            <p className="mt-3 text-xs leading-relaxed text-gray-300 text-center">
              연락처는 DreamTown 운영에만 사용되며 외부에 제공되지 않습니다.
            </p>

            <button
              onClick={() => setStep(3)}
              disabled={!trimName}
              className="mt-6 w-full rounded-full bg-[#9B87F5] py-3 text-sm font-medium text-white disabled:opacity-40"
            >
              다음
            </button>
          </section>
        )}

        {/* Step 3: 정면사진 업로드 */}
        {step === 3 && (
          <section>
            <h2 className="text-center text-lg font-semibold text-gray-800">
              정면사진 등록
            </h2>
            <p className="mt-2 text-center text-sm leading-relaxed text-gray-400">
              당신의 가장 빛나는 모습을 담기 위해
              <br />
              얼굴이 잘 보이는 정면사진 한 장을 등록해 주세요.
            </p>

            <div className="mt-6 flex flex-col items-center">
              {photoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoPreview}
                  alt="정면사진 미리보기"
                  className="h-44 w-44 rounded-2xl object-cover shadow-md"
                />
              ) : (
                <div className="flex h-44 w-44 items-center justify-center rounded-2xl border border-dashed border-[#9B87F5]/40 text-xs text-gray-300">
                  사진을 선택해주세요
                </div>
              )}

              {/* 카메라 촬영 + 갤러리 선택 모두 지원 */}
              <label className="mt-5 cursor-pointer rounded-full border border-[#9B87F5]/40 px-5 py-2 text-sm text-[#9B87F5] hover:bg-[#9B87F5]/5 transition-colors">
                {photoFile ? "다시 선택하기" : "사진 선택 또는 촬영"}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  capture="user"
                  onChange={handlePhotoChange}
                  className="sr-only"
                />
              </label>

              <p className="mt-3 text-xs text-gray-300 text-center">
                모자나 선글라스가 없는 밝은 사진을 권장합니다.
              </p>
            </div>

            <button
              onClick={() => setStep(4)}
              disabled={!photoFile}
              className="mt-8 w-full rounded-full bg-[#9B87F5] py-3 text-sm font-medium text-white disabled:opacity-40"
            >
              다음
            </button>
          </section>
        )}

        {/* Step 4: 소원 작성 */}
        {step === 4 && (
          <section>
            <h2 className="text-center text-lg font-semibold text-gray-800">
              소원 작성
            </h2>
            <p className="mt-2 text-center text-sm leading-relaxed text-gray-400">
              지금 당신의 마음속에 있는
              <br />
              가장 소중한 소원은 무엇인가요?
            </p>

            <textarea
              value={wish}
              onChange={(e) => {
                setWish(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              placeholder="예) 다시 나답게 웃으며 살아가고 싶어요."
              rows={4}
              maxLength={WISH_MAX}
              className="mt-6 w-full resize-none rounded-xl border border-[#9B87F5]/30 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-[#9B87F5] focus:ring-1 focus:ring-[#9B87F5]/40"
            />
            <p className="mt-1 flex justify-between text-xs text-gray-300">
              <span>너무 짧거나 길지 않게 한 문장으로 남겨주세요.</span>
              <span>{trimWish.length} / {WISH_MAX}</span>
            </p>

            <button
              onClick={() => setStep(5)}
              disabled={trimWish.length < 2}
              className="mt-5 w-full rounded-full bg-[#9B87F5] py-3 text-sm font-medium text-white disabled:opacity-40"
            >
              다음
            </button>
          </section>
        )}

        {/* Step 5: 소원 확인 */}
        {step === 5 && (
          <section>
            <h2 className="text-center text-lg font-semibold text-gray-800">
              소원 확인
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              이 소원을 당신의 별에 담을까요?
            </p>

            <div className="mt-6 rounded-2xl border border-[#9B87F5]/30 bg-[#9B87F5]/5 px-5 py-5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#9B87F5] mb-2">
                나의 소원
              </p>
              <p className="text-sm leading-relaxed text-gray-700">{trimWish}</p>
            </div>

            {status === "error" && (
              <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-center">
                <p className="text-sm text-amber-700">
                  {errorMsg || "별을 만드는 중 잠시 문제가 생겼습니다."}
                </p>
                <p className="mt-1 text-xs text-amber-500">
                  입력한 내용은 안전하게 보관되어 있습니다. 잠시 후 다시 시도해 주세요.
                </p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={status === "loading"}
              className="mt-5 w-full rounded-full bg-[#9B87F5] py-3 text-sm font-medium text-white disabled:opacity-40"
            >
              {status === "loading" ? (
                <span className="flex flex-col items-center gap-0.5">
                  <span>당신의 소원이</span>
                  <span>별빛을 만나고 있습니다…</span>
                </span>
              ) : (
                "내 소원을 별에 담기"
              )}
            </button>

            <button
              onClick={() => { setStatus("idle"); setErrorMsg(""); setStep(4); }}
              disabled={status === "loading"}
              className="mt-3 w-full py-2 text-xs text-gray-300 hover:text-gray-400 transition-colors disabled:opacity-40"
            >
              소원 다시 쓰기
            </button>
          </section>
        )}

        {/* Step 6: 완료 */}
        {step === 6 && (
          <section className="text-center">
            <p
              className="text-4xl"
              style={{
                filter: "drop-shadow(0 0 14px rgba(155,135,245,0.55))",
                animation: "starBirth 0.8s ease forwards",
              }}
              aria-hidden="true"
            >
              ★
            </p>
            <h1 className="mt-5 text-lg font-semibold text-gray-800">
              {trimName}님의 별이
              <br />
              태어났습니다.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              당신의 소원은 지금
              <br />
              DreamTown의 별빛 속에서 자라고 있습니다.
            </p>

            <div className="mt-8 rounded-2xl border border-[#9B87F5]/20 bg-[#9B87F5]/[0.04] px-5 py-5 text-center">
              <p className="text-xs font-medium text-[#9B87F5]/70">하멜등대 예고</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                오늘 저녁,
                <br />
                별빛항로의 끝에서
                <br />
                DreamTown이 준비한 선물을 만나게 됩니다.
              </p>
            </div>

            <div
              className="mt-6 space-y-3"
              style={{
                opacity: 0,
                animation: "fadeIn 0.8s ease forwards",
                animationDelay: "2s",
              }}
            >
              <button
                onClick={() => router.push("/my-star")}
                className="w-full rounded-full bg-[#9B87F5] py-3.5 text-sm font-medium text-white"
              >
                내 소원별 만나기
              </button>
              <button
                onClick={() => router.push("/dreamtown")}
                className="w-full rounded-full border border-[#9B87F5]/30 py-3 text-sm text-[#9B87F5]/70 hover:bg-[#9B87F5]/5 transition-colors"
              >
                별빛항로 안내 보기
              </button>
              <p className="pt-3 text-xs text-center text-gray-300">
                오늘, 미소를 품은 소원이가 되었습니다.
              </p>
            </div>
          </section>
        )}

        {/* Step 7: Reveal (Phase A — Soft Open Resume) */}
        {step === 7 && checkinStatus && (
          <section className="text-center">
            {isInitializing ? (
              <div className="py-8">
                <p className="text-sm text-gray-400">로딩 중…</p>
              </div>
            ) : checkinStatus.status === "revealed" ? (
              // 이미 공개됨
              <>
                {/* 재회 메시지 — ?starId= 재진입 또는 isResuming 경로일 때만 표시 */}
                {resumeStarId !== null && completedStarId === null && (
                  <div className="mb-6 text-center">
                    <p className="text-sm font-medium text-[#9B87F5]/80">
                      다시 만나서 반가워요.
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-gray-400">
                      당신의 별은
                      <br />
                      여전히 빛나고 있습니다.
                    </p>
                  </div>
                )}
                <p
                  className="text-4xl"
                  style={{ filter: "drop-shadow(0 0 14px rgba(155,135,245,0.55))" }}
                  aria-hidden="true"
                >
                  ✨
                </p>
                <h1 className="mt-5 text-lg font-semibold text-gray-800">
                  {trimName || "소원이"}님의
                  <br />
                  소원그림이 공개되었습니다.
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-gray-400">
                  당신의 소원이 담긴
                  <br />
                  하멜등대의 별빛을 만나보세요.
                </p>

                {checkinStatus.wishImageUrl && (
                  <div className="mt-8">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={checkinStatus.wishImageUrl}
                      alt="소원그림"
                      className="w-full rounded-2xl shadow-lg"
                    />
                  </div>
                )}

                <div className="mt-8 space-y-3">
                  <button
                    onClick={() => {
                      if (resumeStarId) {
                        router.push(`/home?starId=${resumeStarId}`);
                      }
                    }}
                    className="w-full rounded-full bg-[#9B87F5] py-3.5 text-sm font-medium text-white"
                  >
                    내 소원별 만나기
                  </button>
                  <button
                    onClick={() => router.push("/dreamtown")}
                    className="w-full rounded-full border border-[#9B87F5]/30 py-3 text-sm text-[#9B87F5]/70 hover:bg-[#9B87F5]/5 transition-colors"
                  >
                    별빛항로 안내 보기
                  </button>
                  <p className="pt-3 text-xs text-center text-gray-300">
                    오늘, 미소를 품은 소원이가 되었습니다.
                  </p>
                </div>
              </>
            ) : checkinStatus?.wishImageStatus === "pending" || checkinStatus?.wishImageStatus === "generating" ? (
              // 소원그림 생성 중
              <>
                <div
                  className="text-4xl animate-pulse"
                  aria-hidden="true"
                >
                  ✨
                </div>
                <h1 className="mt-5 text-lg font-semibold text-gray-800">
                  소원그림을 그리는 중이에요
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-gray-400">
                  당신의 소원과 얼굴을 담아<br />
                  세상에 하나뿐인 그림을 만들고 있어요.<br />
                  <br />
                  잠시 기다려 주세요.
                </p>
                <div className="mt-6 flex justify-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#9B87F5] animate-bounce [animation-delay:0ms]" />
                  <span className="h-2 w-2 rounded-full bg-[#9B87F5] animate-bounce [animation-delay:150ms]" />
                  <span className="h-2 w-2 rounded-full bg-[#9B87F5] animate-bounce [animation-delay:300ms]" />
                </div>
              </>
            ) : checkinStatus?.wishImageStatus === "failed" ? (
              // 소원그림 생성 실패
              <>
                <p className="text-4xl" aria-hidden="true">🌙</p>
                <h1 className="mt-5 text-lg font-semibold text-gray-800">
                  그림을 완성하지 못했어요
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-gray-400">
                  잠시 별빛이 닿지 않았나 봐요.<br />
                  다시 시도하거나 스태프에게 말씀해 주세요.
                </p>
                {status === "error" && errorMsg && (
                  <p className="mt-3 text-xs text-amber-600">{errorMsg}</p>
                )}
                <div className="mt-8 space-y-3">
                  <button
                    onClick={async () => {
                      if (!resumeStarId || status === "loading") return;
                      setStatus("loading");
                      setErrorMsg("");
                      try {
                        const res = await fetch("/api/dt/wishart/retry", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ starId: resumeStarId }),
                        });
                        if (!res.ok) {
                          const d = await res.json().catch(() => ({}));
                          setErrorMsg((d as { error?: string }).error === "generation unavailable"
                            ? "현재 그림 생성이 준비 중이에요. 스태프에게 문의해 주세요."
                            : "다시 시도 중 오류가 발생했습니다.");
                          setStatus("error");
                          return;
                        }
                        setStatus("idle");
                        setCheckinStatus((prev) => prev ? { ...prev, wishImageStatus: "pending" } : prev);
                      } catch {
                        setErrorMsg("네트워크 연결을 확인해 주세요.");
                        setStatus("error");
                      }
                    }}
                    disabled={status === "loading"}
                    className="w-full rounded-full bg-[#9B87F5] py-3.5 text-sm font-medium text-white disabled:opacity-40"
                  >
                    {status === "loading" ? "시도 중…" : "다시 시도하기"}
                  </button>
                  <button
                    onClick={() => router.push("/my-star")}
                    className="w-full rounded-full border border-[#9B87F5]/30 py-3 text-sm text-[#9B87F5]/70 hover:bg-[#9B87F5]/5 transition-colors"
                  >
                    내 소원별 보기
                  </button>
                </div>
              </>
            ) : (
              // 준비됨 — 공개 선택
              <>
                <p
                  className="text-4xl"
                  style={{ filter: "drop-shadow(0 0 14px rgba(155,135,245,0.55))" }}
                  aria-hidden="true"
                >
                  ⭐
                </p>
                <h1 className="mt-5 text-lg font-semibold text-gray-800">
                  당신의 소원그림이<br />준비되었습니다
                </h1>

                {!showImmediateConfirm ? (
                  <>
                    <p className="mt-4 text-sm leading-relaxed text-gray-400">
                      여수의 밤이 깊어질수록<br />
                      당신의 소원그림은 별빛을 머금습니다.<br />
                      <br />
                      하멜등대에서 처음 만나면<br />
                      더 오래 기억될 거예요.
                    </p>

                    <div className="mt-8 space-y-3">
                      <button
                        onClick={() => router.push("/my-star")}
                        className="w-full rounded-full bg-[#9B87F5] py-3.5 text-sm font-medium text-white"
                      >
                        하멜등대에서 만날게요
                      </button>
                      <button
                        onClick={() => setShowImmediateConfirm(true)}
                        className="w-full rounded-full border border-[#9B87F5]/30 py-3 text-sm text-[#9B87F5]/70 hover:bg-[#9B87F5]/5 transition-colors"
                      >
                        그래도 지금 볼래요
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="mt-4 text-sm leading-relaxed text-gray-400">
                      지금 만나도 괜찮아요.<br />
                      다만 하멜등대에서의 첫 만남을 추천드려요.
                    </p>

                    {status === "error" && (
                      <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-center">
                        <p className="text-sm text-amber-700">{errorMsg}</p>
                      </div>
                    )}

                    <div className="mt-8 space-y-3">
                      <button
                        onClick={handleReveal}
                        disabled={status === "loading"}
                        className="w-full rounded-full bg-[#9B87F5] py-3.5 text-sm font-medium text-white disabled:opacity-40"
                      >
                        {status === "loading" ? "공개 중…" : "지금 공개하기"}
                      </button>
                      <button
                        onClick={() => { setShowImmediateConfirm(false); setErrorMsg(""); setStatus("idle"); }}
                        disabled={status === "loading"}
                        className="w-full rounded-full border border-[#9B87F5]/30 py-3 text-sm text-[#9B87F5]/70 hover:bg-[#9B87F5]/5 transition-colors disabled:opacity-40"
                      >
                        하멜등대에서 기다리기
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
