"use client";

/**
 * /checkin — QR 체크인 (CHECKIN-001 / CHECKIN-002)
 *
 * 흐름: 환영 → 우주민 등록(이름+전화) → 정면사진 → 소원 작성 → 소원 확인 → 완료
 * 완료 후: starId를 localStorage에 저장하고 /home?starId=... 로 이동 가능
 */

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

const NAME_MAX = 50;
const PHONE_MAX = 20;
const WISH_MAX = 200;

export default function CheckinPage() {
  const router = useRouter();
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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const trimName = name.trim();
  const trimPhone = phone.trim();
  const trimWish = wish.trim();

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

      const data: { success: boolean; starId: string } = await res.json();

      // 별 ID를 localStorage에 저장 — 이후 /home에서 복귀 가능
      if (typeof window !== "undefined") {
        localStorage.setItem("dt_active_star_id", data.starId);
      }

      setCompletedStarId(data.starId);
      setStatus("idle");
      setStep(6);
    } catch {
      setErrorMsg("네트워크 연결을 확인하고 다시 시도해 주세요.");
      setStatus("error");
    }
  }

  return (
    <main className="flex min-h-[85vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Step 1: 환영 */}
        {step === 1 && (
          <section className="text-center">
            <p className="text-3xl" aria-hidden="true">✦</p>
            <h1 className="mt-4 text-lg font-semibold text-gray-800">
              DreamTown Check-in
            </h1>
            <p className="mt-5 text-base leading-relaxed text-gray-600">
              환영합니다, 소원이님.
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
              style={{ filter: "drop-shadow(0 0 14px rgba(155,135,245,0.55))" }}
              aria-hidden="true"
            >
              ★
            </p>
            <h1 className="mt-5 text-lg font-semibold text-gray-800">
              소원이님의 별이
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

            <div className="mt-6 space-y-3">
              <button
                onClick={() => {
                  if (completedStarId) {
                    router.push(`/home?starId=${completedStarId}`);
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
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
