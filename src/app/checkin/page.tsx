"use client";

import { useRef, useState } from "react";

type Step = 1 | 2 | 3 | 4 | 5;

const NAME_MAX = 50;
const WISH_MAX = 200;

export default function CheckinPage() {
  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [wish, setWish] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const trimmedName = name.trim();
  const trimmedWish = wish.trim();

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setPhotoFile(file);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  }

  async function handleSubmit() {
    if (!trimmedName || !photoFile || !trimmedWish || status === "loading") return;
    setStatus("loading");

    try {
      const body = new FormData();
      body.append("name", trimmedName);
      body.append("photo", photoFile);
      body.append("wish", trimmedWish);

      const res = await fetch("/api/checkin", { method: "POST", body });
      if (!res.ok) {
        setStatus("error");
        return;
      }

      setStatus("idle");
      setStep(5);
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {step === 1 && (
          <section className="text-center">
            <p className="text-3xl" aria-hidden="true">✦</p>
            <h1 className="mt-4 text-xl font-semibold text-gray-800">
              DreamTown에 오신 것을
              <br />
              환영합니다
            </h1>
            <p className="mt-3 text-sm text-gray-400">
              지금부터 당신의 별을 만들어볼게요.
            </p>
            <button
              onClick={() => setStep(2)}
              className="mt-8 w-full rounded-full bg-[#9B87F5] py-3 text-sm font-medium text-white"
            >
              시작하기
            </button>
          </section>
        )}

        {step === 2 && (
          <section>
            <h2 className="text-center text-lg font-semibold text-gray-800">
              우주민 등록
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              이름을 알려주세요.
            </p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력해주세요"
              maxLength={NAME_MAX}
              className="mt-6 w-full rounded-xl border border-[#9B87F5]/30 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-[#9B87F5] focus:ring-1 focus:ring-[#9B87F5]/40"
            />
            <button
              onClick={() => setStep(3)}
              disabled={!trimmedName}
              className="mt-6 w-full rounded-full bg-[#9B87F5] py-3 text-sm font-medium text-white disabled:opacity-40"
            >
              다음
            </button>
          </section>
        )}

        {step === 3 && (
          <section>
            <h2 className="text-center text-lg font-semibold text-gray-800">
              정면사진 등록
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              당신의 정면사진을 등록해주세요.
            </p>

            <div className="mt-6 flex flex-col items-center">
              {photoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoPreview}
                  alt="정면사진 미리보기"
                  className="h-40 w-40 rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-40 w-40 items-center justify-center rounded-2xl border border-dashed border-[#9B87F5]/40 text-xs text-gray-300">
                  사진 없음
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
                className="mt-4 text-sm text-gray-500"
              />
            </div>

            <button
              onClick={() => setStep(4)}
              disabled={!photoFile}
              className="mt-6 w-full rounded-full bg-[#9B87F5] py-3 text-sm font-medium text-white disabled:opacity-40"
            >
              다음
            </button>
          </section>
        )}

        {step === 4 && (
          <section>
            <h2 className="text-center text-lg font-semibold text-gray-800">
              소원 남기기
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              지금 마음속에 있는 소원을 남겨주세요.
            </p>

            <textarea
              value={wish}
              onChange={(e) => {
                setWish(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              placeholder="예) 올해 안에 좋아하는 일로 생계를 유지하고 싶어요."
              rows={4}
              maxLength={WISH_MAX}
              className="mt-6 w-full resize-none rounded-xl border border-[#9B87F5]/30 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-[#9B87F5] focus:ring-1 focus:ring-[#9B87F5]/40"
            />
            <p className="mt-1 text-right text-xs text-gray-300">
              {trimmedWish.length} / {WISH_MAX}
            </p>

            {status === "error" && (
              <p className="mt-2 text-center text-sm text-gray-400">
                다시 한 번 천천히 남겨볼까요?
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={!trimmedWish || status === "loading"}
              className="mt-4 w-full rounded-full bg-[#9B87F5] py-3 text-sm font-medium text-white disabled:opacity-40"
            >
              {status === "loading" ? "별빛씨앗을 심는 중이에요…" : "별빛씨앗 심기"}
            </button>
          </section>
        )}

        {step === 5 && (
          <section className="text-center">
            <p className="text-3xl" aria-hidden="true">🌱</p>
            <h1 className="mt-4 text-xl font-semibold text-gray-800">
              별빛씨앗이
              <br />
              심어졌습니다.
            </h1>
            <p className="mt-3 text-sm text-gray-400">
              {trimmedName}님의 별이 자라나기 시작했어요.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
