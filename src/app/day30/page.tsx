"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

// ── 타입 ──────────────────────────────────────────────────────────────────

type Star = {
  id: string;
  starName: string;
  createdAt: string;
  dayCount: number;
  starStage: number;
  currentWish: { id: string; content: string };
};

type Journal = {
  id: string;
  emotion: string;
  helpTag: string;
  growthLine: string;
  createdAt: string;
};

type Milestone = {
  targetDay: number;
  journal: Journal;
  actualDay: number;
};

// ── 마일스톤 샘플링 ────────────────────────────────────────────────────────
// journals 중 기준일(1·3·7·14·30)에 가장 가까운 항목 추출

const TARGET_DAYS = [1, 3, 7, 14, 30] as const;

function sampleMilestones(journals: Journal[], starCreatedAt: string): Milestone[] {
  if (journals.length === 0) return [];

  const origin = new Date(starCreatedAt).getTime();

  const withDay = journals.map((j) => ({
    journal: j,
    day: Math.max(1, Math.floor((new Date(j.createdAt).getTime() - origin) / 86_400_000) + 1),
  }));

  const results: Milestone[] = [];
  const used = new Set<string>();

  for (const targetDay of TARGET_DAYS) {
    const closest = withDay
      .filter((e) => !used.has(e.journal.id))
      .sort((a, b) => Math.abs(a.day - targetDay) - Math.abs(b.day - targetDay))[0];

    if (closest) {
      used.add(closest.journal.id);
      results.push({ targetDay, journal: closest.journal, actualDay: closest.day });
    }
  }

  return results;
}

// ── 페이지 진입점 ─────────────────────────────────────────────────────────

export default function Day30Page() {
  return (
    <Suspense
      fallback={
        <p className="py-12 text-center text-sm text-gray-400">
          항로를 불러오는 중이에요…
        </p>
      }
    >
      <Day30Content />
    </Suspense>
  );
}

// ── 단계 타입 ─────────────────────────────────────────────────────────────

type Step = "intro" | "route" | "meaning" | "choice" | "closing";
type Choice = "continue" | "new";

// ── 메인 컨텐츠 ──────────────────────────────────────────────────────────

function Day30Content() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const starId = searchParams.get("starId") ?? "";

  const [step, setStep] = useState<Step>("intro");
  const [visible, setVisible] = useState(false);
  const [star, setStar] = useState<Star | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [choice, setChoice] = useState<Choice | null>(null);
  const [prevStep, setPrevStep] = useState(step);

  // 데이터 로드
  useEffect(() => {
    if (!starId) return;
    Promise.all([
      fetch(`/api/dt/stars/${starId}`).then((r) => (r.ok ? r.json() : null)),
      fetch(`/api/dt/journals?starId=${starId}`).then((r) => (r.ok ? r.json() : [])),
    ]).then(([starData, journalData]: [Star | null, Journal[]]) => {
      if (starData) setStar(starData);
      setMilestones(sampleMilestones(journalData, starData?.createdAt ?? new Date().toISOString()));
    }).catch(() => {});
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

  function handleChoice(c: Choice) {
    setChoice(c);
    goNext("closing");
  }

  function handleDone() {
    if (choice === "new") {
      router.push("/onboarding");
    } else {
      router.push(`/home?starId=${starId}`);
    }
  }

  return (
    <main className="flex min-h-[75vh] flex-col items-center justify-center px-6">
      <div
        className="w-full max-w-sm transition-opacity duration-500"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {step === "intro" && (
          <IntroStep starName={star?.starName} onNext={() => goNext("route")} />
        )}
        {step === "route" && (
          <RouteStep milestones={milestones} onNext={() => goNext("meaning")} />
        )}
        {step === "meaning" && (
          <MeaningStep onNext={() => goNext("choice")} />
        )}
        {step === "choice" && (
          <ChoiceStep onChoose={handleChoice} />
        )}
        {step === "closing" && (
          <ClosingStep choice={choice} onDone={handleDone} />
        )}
      </div>
    </main>
  );
}

// ── Step 1: 시작 ──────────────────────────────────────────────────────────

function IntroStep({ starName, onNext }: { starName?: string; onNext: () => void }) {
  return (
    <div className="text-center">
      <p
        className="text-4xl"
        aria-hidden="true"
        style={{ filter: "drop-shadow(0 0 14px rgba(255,215,106,0.65))" }}
      >
        ★
      </p>
      <p className="mt-6 text-base leading-loose text-gray-700">
        {starName && <span className="text-[#9B87F5]">{starName}</span>}
        {starName && <br />}
        여기까지<br />
        함께 걸어왔어요
      </p>
      <button
        onClick={onNext}
        className="mt-10 text-xs text-gray-400 hover:text-gray-500 transition-colors"
      >
        항로를 살펴볼게요 →
      </button>
    </div>
  );
}

// ── Step 2: 항로 시각화 ────────────────────────────────────────────────────

function RouteStep({ milestones, onNext }: { milestones: Milestone[]; onNext: () => void }) {
  const items = milestones.length > 0
    ? milestones
    : [{ targetDay: 1, actualDay: 1, journal: { id: "", emotion: "숨이 놓였어요", helpTag: "쉼", growthLine: "조금 가벼워졌어요", createdAt: "" } }];

  return (
    <div>
      <p className="mb-6 text-center text-sm text-gray-400">당신의 항로</p>

      <div className="space-y-0">
        {items.map((m, i) => (
          <div key={m.journal.id || i} className="flex items-stretch gap-4">
            {/* 타임라인 선 + 점 */}
            <div className="flex flex-col items-center">
              <div className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[#9B87F5]/60" />
              {i < items.length - 1 && (
                <div className="w-px flex-1 bg-[#9B87F5]/20" style={{ minHeight: 32 }} />
              )}
            </div>

            {/* 내용 */}
            <div className="pb-6">
              <p className="text-[10px] font-medium text-[#9B87F5]/70">
                Day {m.targetDay}
              </p>
              <p className="mt-0.5 text-sm text-gray-700">{m.journal.emotion}</p>
              <p className="text-xs text-gray-400">{m.journal.growthLine}</p>
            </div>
          </div>
        ))}

        {/* 지금 */}
        <div className="flex items-center gap-4">
          <div className="mt-1 h-3 w-3 flex-shrink-0 rounded-full bg-[#FFD76A]/80"
            style={{ boxShadow: "0 0 8px rgba(255,215,106,0.55)" }}
          />
          <p className="text-sm font-medium text-[#FFD76A]/90">지금</p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onNext}
          className="text-xs text-gray-400 hover:text-gray-500 transition-colors"
        >
          계속 →
        </button>
      </div>
    </div>
  );
}

// ── Step 3: 의미 해석 ─────────────────────────────────────────────────────

function MeaningStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center">
      <p className="text-base leading-loose text-gray-700">
        당신은<br />
        멈추지 않고<br />
        <span className="text-[#9B87F5]">조금씩 나아가고 있었어요</span>
      </p>
      <p className="mt-4 text-sm leading-relaxed text-gray-400">
        기록이 아니라<br />
        당신이 만들어온 흐름이에요
      </p>
      <button
        onClick={onNext}
        className="mt-10 text-xs text-gray-400 hover:text-gray-500 transition-colors"
      >
        계속 →
      </button>
    </div>
  );
}

// ── Step 4: 항로 선택 ─────────────────────────────────────────────────────

function ChoiceStep({ onChoose }: { onChoose: (c: Choice) => void }) {
  return (
    <div className="text-center">
      <p className="text-base leading-relaxed text-gray-700">
        이제 어디로<br />
        가고 싶나요?
      </p>
      <div className="mt-8 flex flex-col gap-3">
        <button
          onClick={() => onChoose("continue")}
          className="rounded-full border border-[#9B87F5]/30 bg-white py-3 text-sm text-gray-600 hover:bg-[#9B87F5]/5 transition-colors"
        >
          조금 더 이어가볼게요
        </button>
        <button
          onClick={() => onChoose("new")}
          className="rounded-full border border-[#FFD76A]/40 bg-white py-3 text-sm text-gray-600 hover:bg-[#FFD76A]/5 transition-colors"
        >
          새로운 소원을 시작해볼게요
        </button>
      </div>
    </div>
  );
}

// ── Step 5: 마무리 ────────────────────────────────────────────────────────

function ClosingStep({ choice, onDone }: { choice: Choice | null; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="text-center">
      <p
        className="text-4xl"
        aria-hidden="true"
        style={{ filter: "drop-shadow(0 0 16px rgba(255,215,106,0.75))" }}
      >
        ★
      </p>
      {choice === "new" ? (
        <p className="mt-6 text-base leading-loose text-gray-700">
          새로운 항로가<br />
          <span className="text-[#9B87F5]">시작될 거예요</span>
        </p>
      ) : (
        <p className="mt-6 text-base leading-loose text-gray-700">
          당신의 항로는<br />
          <span className="text-[#9B87F5]">계속 이어지고 있어요</span>
        </p>
      )}
      <p className="mt-2 text-xs text-gray-400">잠시 후 이동할게요…</p>
    </div>
  );
}
