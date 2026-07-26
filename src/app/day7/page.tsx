"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

// ── 타입 ──────────────────────────────────────────────────────────────────

type GrowthLine = "조금 가벼워졌어요" | "조금 또렷해졌어요" | "조금 용감해졌어요";

type Journal = {
  id: string;
  growthLine: string;
  createdAt: string;
};

// ── growthLine → 문장 변환 ────────────────────────────────────────────────
// 마지막 항목 제외 "고"로 연결, 마지막은 "요"로 마무리

const TRANSFORM_MID: Record<string, string> = {
  "조금 가벼워졌어요": "조금 더 가벼워졌고",
  "조금 또렷해졌어요": "조금 더 또렷해졌고",
  "조금 용감해졌어요": "조금 더 용감해졌고",
};

const TRANSFORM_END: Record<string, string> = {
  "조금 가벼워졌어요": "조금 더 가벼워졌어요",
  "조금 또렷해졌어요": "조금 더 또렷해졌어요",
  "조금 용감해졌어요": "조금 더 용감해졌어요",
};

function buildSummaryLines(journals: Journal[]): string[] {
  if (journals.length === 0) return ["조금 더 또렷해졌어요"];

  // growthLine 빈도 집계
  const freq: Record<string, number> = {};
  for (const j of journals.slice(0, 7)) {
    freq[j.growthLine] = (freq[j.growthLine] ?? 0) + 1;
  }

  // 빈도 높은 순 상위 2개
  const top = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([line]) => line);

  if (top.length === 1) {
    return [TRANSFORM_END[top[0]] ?? top[0]];
  }

  return [
    TRANSFORM_MID[top[0]] ?? top[0],
    TRANSFORM_END[top[1]] ?? top[1],
  ];
}

// ── 페이지 진입점 ─────────────────────────────────────────────────────────

export default function Day7Page() {
  return (
    <Suspense
      fallback={
        <p className="py-12 text-center text-sm text-gray-400">
          별을 불러오는 중이에요…
        </p>
      }
    >
      <Day7Content />
    </Suspense>
  );
}

// ── 단계 타입 ─────────────────────────────────────────────────────────────

type Step = "intro" | "summary" | "choice" | "closing";

// ── 메인 컨텐츠 ──────────────────────────────────────────────────────────

function Day7Content() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const starId = searchParams.get("starId") ?? "";

  const [step, setStep] = useState<Step>("intro");
  const [summaryLines, setSummaryLines] = useState<string[]>([]);
  const [visible, setVisible] = useState(false); // fade-in 제어
  const [prevStep, setPrevStep] = useState(step);

  // 저널 로드 → summary 계산
  useEffect(() => {
    if (!starId) return;
    fetch(`/api/dt/journals?starId=${starId}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Journal[]) => setSummaryLines(buildSummaryLines(data)))
      .catch(() => setSummaryLines(["조금 더 또렷해졌어요"]));
  }, [starId]);

  // 단계가 바뀐 렌더에서 즉시 숨김 처리 (렌더링 중 상태 조정 — effect 내부 아님)
  if (prevStep !== step) {
    setPrevStep(step);
    setVisible(false);
  }

  // 짧은 지연 후 다시 보이게 (콜백 내부 setState)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, [step]);

  function goNext(nextStep: Step) {
    setVisible(false);
    setTimeout(() => setStep(nextStep), 350);
  }

  function goHome() {
    router.push(`/home?starId=${starId}`);
  }

  return (
    <main className="flex min-h-[75vh] flex-col items-center justify-center px-6">
      <div
        className="w-full max-w-sm text-center transition-opacity duration-500"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {step === "intro" && (
          <IntroStep onNext={() => goNext("summary")} />
        )}
        {step === "summary" && (
          <SummaryStep lines={summaryLines} onNext={() => goNext("choice")} />
        )}
        {step === "choice" && (
          <ChoiceStep onChoose={() => goNext("closing")} />
        )}
        {step === "closing" && (
          <ClosingStep onDone={goHome} />
        )}
      </div>
    </main>
  );
}

// ── Step 1: 조용한 시작 ────────────────────────────────────────────────────

function IntroStep({ onNext }: { onNext: () => void }) {
  return (
    <div>
      <p className="text-3xl" aria-hidden="true">★</p>
      <p className="mt-6 text-base leading-loose text-gray-700">
        지난 며칠 동안<br />
        <span className="text-[#9B87F5]">작은 변화</span>가 쌓였어요
      </p>
      <button
        onClick={onNext}
        className="mt-10 text-xs text-gray-400 hover:text-gray-500"
      >
        천천히 살펴볼게요 →
      </button>
    </div>
  );
}

// ── Step 2: 변화 요약 ─────────────────────────────────────────────────────

function SummaryStep({ lines, onNext }: { lines: string[]; onNext: () => void }) {
  return (
    <div>
      <p className="text-sm text-gray-400">당신은</p>
      <div className="mt-4 space-y-1">
        {lines.map((line, i) => (
          <p key={i} className="text-lg font-medium leading-relaxed text-gray-800">
            {line}
          </p>
        ))}
      </div>
      <button
        onClick={onNext}
        className="mt-10 text-xs text-gray-400 hover:text-gray-500"
      >
        계속 →
      </button>
    </div>
  );
}

// ── Step 3: 감정 회상 ─────────────────────────────────────────────────────

function ChoiceStep({ onChoose }: { onChoose: () => void }) {
  return (
    <div>
      <p className="text-base leading-relaxed text-gray-700">
        이 순간을<br />
        기억해두고 싶나요?
      </p>
      <div className="mt-8 flex flex-col gap-3">
        <button
          onClick={onChoose}
          className="rounded-full border border-[#9B87F5]/30 bg-white py-3 text-sm text-gray-600 hover:bg-[#9B87F5]/5 transition-colors"
        >
          조용히 간직할게요
        </button>
        <button
          onClick={onChoose}
          className="rounded-full border border-[#9B87F5]/30 bg-white py-3 text-sm text-gray-600 hover:bg-[#9B87F5]/5 transition-colors"
        >
          한 번 더 이어가볼게요
        </button>
      </div>
    </div>
  );
}

// ── Step 4: 마무리 ─────────────────────────────────────────────────────────

function ClosingStep({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div>
      <p
        className="text-3xl transition-all duration-1000"
        style={{ filter: "drop-shadow(0 0 12px rgba(255,215,106,0.70))" }}
        aria-hidden="true"
      >
        ★
      </p>
      <p className="mt-6 text-base leading-loose text-gray-700">
        당신의 별은<br />
        <span className="text-[#9B87F5]">조금 더 밝아졌어요</span>
      </p>
      <p className="mt-2 text-xs text-gray-400">잠시 후 돌아갈게요…</p>
    </div>
  );
}
