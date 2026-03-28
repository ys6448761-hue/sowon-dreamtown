"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ConnectionMoment from "@/components/dreamtown/ConnectionMoment";
import { shouldShowResonance, getMaxResonanceDepth, getDepthStage, getTopTagRatio, getFallbackRate, getResonanceMessage, selectResonanceTag, markResonanceShown } from "@/lib/utils/resonanceState";
import { readSavedStar } from "@/lib/utils/starSession";

// ── SSOT 타입 (DreamTown API & Data Schema v1 — 확정) ────────────────────
// 출처: DreamTown API 응답 SSOT v1 (2026-03-27)
// ⚠️ 필드 변경/삭제 금지 — 확장만 허용

type Star = {
  id: string;
  starName: string;
  createdAt: string;    // "YYYY-MM-DD"
  dayCount: number;     // API 제공값 — UI 계산 금지
  starStage: 1 | 2 | 3 | 4;
  currentWish: {
    id: string;
    content: string;
  };
};

type WishItem = {
  id: string;
  starId: string;
  content: string;
  createdAt: string;    // "YYYY-MM-DD"
};

type WishesData = {
  current: WishItem | null;
  previous: WishItem[];
};

type Journal = {
  id: string;
  emotion: "숨이 놓였어요" | "믿고 싶어졌어요" | "정리됐어요" | "용기났어요";
  helpTag: "위로" | "결심" | "쉼" | "연결" | "실행";
  growthLine: "조금 가벼워졌어요" | "조금 또렷해졌어요" | "조금 용감해졌어요";
  createdAt: string;    // "YYYY-MM-DD"
};

type NanumMessage = {
  id: string;
  type: "miracle" | "wisdom" | "thanks";
  message: string;
  createdAt: string;    // "YYYY-MM-DD"
};

type NanumData = {
  counts: { miracle: number; wisdom: number }; // thanks 없음 (서버 제거)
  messages: NanumMessage[];
};

type Tab = "wish" | "journal" | "film" | "nanum";

// ── Mock 데이터 (SSOT v1 구조와 100% 일치 — API 연결 시 그대로 교체) ─────

const MOCK_STAR: Star = {
  id: "star_1",
  starName: "작은 빛의 시작",
  createdAt: "2026-03-20",
  dayCount: 7,
  starStage: 2,
  currentWish: { id: "wish_10", content: "조금 더 나를 믿고 싶어요" },
};

const MOCK_WISHES: WishesData = {
  current: {
    id: "wish_10",
    starId: "star_1",
    content: "조금 더 나를 믿고 싶어요",
    createdAt: "2026-03-20",
  },
  previous: [
    {
      id: "wish_9",
      starId: "star_1",
      content: "하루를 덜 불안하게 보내고 싶어요",
      createdAt: "2026-03-10",
    },
    {
      id: "wish_8",
      starId: "star_1",
      content: "작은 습관을 꾸준히 이어가고 싶어요",
      createdAt: "2026-03-01",
    },
  ],
};

const MOCK_JOURNALS: Journal[] = [
  {
    id: "journal_1",
    emotion: "숨이 놓였어요",
    helpTag: "쉼",
    growthLine: "조금 가벼워졌어요",
    createdAt: "2026-03-26",
  },
  {
    id: "journal_2",
    emotion: "용기났어요",
    helpTag: "실행",
    growthLine: "조금 용감해졌어요",
    createdAt: "2026-03-25",
  },
];

const MOCK_NANUM: NanumData = {
  counts: { miracle: 12, wisdom: 5 },
  messages: [
    {
      id: "nanum_1",
      type: "miracle",
      message: "당신의 작은 용기가 오늘 누군가에게 닿았어요.",
      createdAt: "2026-03-26",
    },
    {
      id: "nanum_2",
      type: "wisdom",
      message: "천천히 가도 괜찮아요. 방향이 더 중요해요.",
      createdAt: "2026-03-25",
    },
  ],
};

// ── 유틸 ──────────────────────────────────────────────────────────────────
// dayCount는 API 제공값 사용 — 여기서 계산하지 않음

function formatKo(iso: string): string {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ── 페이지 진입점 ─────────────────────────────────────────────────────────

export default function HomeDreamPage() {
  return (
    <Suspense
      fallback={
        <p className="py-12 text-center text-sm text-gray-400">별을 불러오는 중이에요…</p>
      }
    >
      <HomeContent />
    </Suspense>
  );
}

// ── 메인 컨텐츠 ──────────────────────────────────────────────────────────

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawTab = searchParams.get("tab") as Tab | null;
  const tab: Tab =
    rawTab && ["wish", "journal", "film", "nanum"].includes(rawTab) ? rawTab : "wish";

  // starId: URL 파라미터 → localStorage 폴백 → onboarding 리다이렉트
  const urlStarId = searchParams.get("starId");
  const starId = urlStarId ?? readSavedStar() ?? "";

  const [star, setStar] = useState<Star | null>(null);
  const [wishes, setWishes] = useState<WishesData | null>(null);
  const [journals, setJournals] = useState<Journal[]>([]);
  const [nanum, setNanum] = useState<NanumData | null>(null);
  const [loading, setLoading] = useState(true);

  // 연결 모멘트 상태
  const [connection, setConnection] = useState<{ id: string; otherStarId: string } | null>(null);

  // B: 나눔 재공명 배너 (1회성)
  const [nanumBanner, setNanumBanner] = useState(false);

  // 같은 빛 스침 배너 (태그 2개 이상 + 하루 1회 + 35% 확률)
  const [resonanceBanner, setResonanceBanner] = useState(false);
  const [resonanceMsg, setResonanceMsg] = useState("");

  useEffect(() => {
    const last = localStorage.getItem("nanum_last_shared_at");
    if (!last) return;
    const diff = Date.now() - Number(last);
    const DAY = 24 * 60 * 60 * 1000;
    if (diff < DAY) return;
    if (diff <= 3 * DAY) {
      console.log("[RESONANCE_BANNER_SHOWN]", {
        ts: Date.now(),
        diffHours: Math.floor(diff / (1000 * 60 * 60)),
      });
      setNanumBanner(true);
      localStorage.removeItem("nanum_last_shared_at");
      return;
    }
    localStorage.removeItem("nanum_last_shared_at");
  }, []);

  useEffect(() => {
    if (!shouldShowResonance()) return;
    // 3단계(depth >= 4): 과노출 방지 — 25% 추가 게이트
    if (getMaxResonanceDepth() >= 4 && Math.random() > 0.25) return;
    const chosenTag   = selectResonanceTag();
    const chosenStage = getDepthStage();
    const msg         = getResonanceMessage(chosenTag);
    const isFallback  = !chosenTag;

    console.log("[RESONANCE_TAG_SHOWN]", {
      chosenTag,
      chosenStage,
      isFallback,
      topTagRatio:  Math.round(getTopTagRatio()  * 100) / 100,
      fallbackRate: Math.round(getFallbackRate()  * 100) / 100,
      ts: Date.now(),
    });

    setResonanceMsg(msg);
    markResonanceShown();
    setResonanceBanner(true);
  }, []);

  // 별 반응 상태 (journal 생성 시)
  const [starGlowing, setStarGlowing] = useState(false);
  const [glowMessage, setGlowMessage] = useState<string | null>(null);
  const [glowVisible, setGlowVisible] = useState(false);

  const GLOW_MESSAGES = ["조금 더 밝아졌어요", "작은 빛이 더해졌어요", "조금 또렷해졌어요"];

  function triggerGlow() {
    const msg = GLOW_MESSAGES[Math.floor(Math.random() * GLOW_MESSAGES.length)];
    setGlowMessage(msg);
    setGlowVisible(true);
    setStarGlowing(true);
    setTimeout(() => setStarGlowing(false), 700);       // 발광 복귀
    setTimeout(() => setGlowVisible(false), 1800);      // 메시지 페이드 시작
    setTimeout(() => setGlowMessage(null), 2600);       // 메시지 DOM 제거
  }

  const prevTab = useRef<Tab>(tab);
  useEffect(() => {
    if (prevTab.current !== tab) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      prevTab.current = tab;
    }
  }, [tab]);

  // ── 데이터 로드 ───────────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        // Star
        const starRes = await fetch(`/api/dt/stars/${starId}`);
        const starData: Star = starRes.ok ? await starRes.json() : MOCK_STAR;

        // Wishes
        const wishRes = await fetch(`/api/dt/wishes?starId=${starId}`);
        const wishData: WishesData = wishRes.ok ? await wishRes.json() : MOCK_WISHES;

        // Journals
        const journalRes = await fetch(`/api/dt/journals?starId=${starId}`);
        const journalData: Journal[] = journalRes.ok ? await journalRes.json() : [];

        // Nanum
        const nanumRes = await fetch(`/api/dt/nanum?starId=${starId}`);
        const nanumData: NanumData = nanumRes.ok
          ? await nanumRes.json()
          : MOCK_NANUM;

        if (!cancelled) {
          setStar(starData);
          setWishes(wishData);
          setJournals(journalData);
          setNanum(nanumData);

          // 미확인 연결 체크 (connection_completed)
          const connRes = await fetch(`/api/dt/connection?starId=${starId}`);
          if (connRes.ok) {
            const connData = await connRes.json();
            if (connData) setConnection({ id: connData.id, otherStarId: connData.otherStarId });
          }

          // Day 30 진입 — Day 7보다 우선 체크 (최초 1회)
          const seen30Key = `day30_seen_${starId}`;
          if (starData.dayCount >= 30 && !localStorage.getItem(seen30Key)) {
            localStorage.setItem(seen30Key, "1");
            router.replace(`/day30?starId=${starId}`);
            return;
          }

          // Day 7 진입 — localStorage로 최초 1회만
          const seenKey = `day7_seen_${starId}`;
          if (starData.dayCount === 7 && !localStorage.getItem(seenKey)) {
            localStorage.setItem(seenKey, "1");
            router.replace(`/day7?starId=${starId}`);
          }
        }
      } catch {
        // API 미연결 시 mock으로 graceful fallback
        if (!cancelled) {
          setStar(MOCK_STAR);
          setWishes(MOCK_WISHES);
          setJournals([]);
          setNanum(MOCK_NANUM);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [starId]);

  // starId 없으면 onboarding으로
  if (!starId) {
    router.replace("/onboarding");
    return null;
  }

  if (loading) {
    return (
      <p className="py-12 text-center text-sm text-gray-400">별을 불러오는 중이에요…</p>
    );
  }

  return (
    <main>
      {/* B: 나눔 재공명 배너 — 나눔 후 다음 홈 진입 시 1회 노출, 상세/수치 없음 */}
      {nanumBanner && (
        <div
          className="mx-4 mb-4 mt-2 rounded-xl border border-[#9B87F5]/20 bg-[#9B87F5]/[0.06] px-5 py-3 text-center transition-opacity duration-500"
          aria-live="polite"
        >
          <p className="text-xs leading-relaxed text-white/40">
            당신이 스쳐간 빛이<br />어딘가에서 이어지고 있어요
          </p>
          <button
            onClick={() => setNanumBanner(false)}
            className="mt-2 text-[10px] text-white/20 hover:text-white/35 transition-colors"
          >
            닫기
          </button>
        </div>
      )}

      {/* 같은 빛 스침 — 태그 2개↑ + 하루 1회 + 35% 확률 */}
      {resonanceBanner && (
        <div
          className="mx-4 mb-4 mt-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-center"
          aria-live="polite"
        >
          <p className="text-xs leading-relaxed text-white/35">
            {resonanceMsg}
          </p>
          <button
            onClick={() => setResonanceBanner(false)}
            className="mt-2 text-[10px] text-white/20 hover:text-white/35 transition-colors"
          >
            닫기
          </button>
        </div>
      )}

      {/* 연결 모멘트 — 미확인 connection_completed 1회 노출 */}
      {connection && (
        <ConnectionMoment
          connectionId={connection.id}
          otherStarId={connection.otherStarId}
          myStarId={starId}
          onDismiss={() => setConnection(null)}
        />
      )}

      {/* 나의 별 요약 레이어 */}
      {star && (
        <MyStarLayer
          star={star}
          glowing={starGlowing}
          message={glowMessage}
          messageVisible={glowVisible}
        />
      )}

      {/* 탭 네비게이션 */}
      <nav className="mb-5 mt-4 flex gap-1 rounded-xl bg-gray-100 p-1" aria-label="소원꿈터 탭">
        {(
          [
            { key: "wish", label: "소원" },
            { key: "journal", label: "항해기록" },
            { key: "film", label: "필름" },
            { key: "nanum", label: "나눔" },
          ] as { key: Tab; label: string }[]
        ).map(({ key, label }) => (
          <Link
            key={key}
            href={`/home?tab=${key}&starId=${starId}`}
            className={`flex-1 rounded-lg py-2 text-center text-sm font-medium transition-colors ${
              tab === key
                ? "bg-white text-[#9B87F5] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* 탭 컨텐츠 */}
      {tab === "wish" && <WishTab wishes={wishes} />}
      {tab === "journal" && (
        <JournalTab
          journals={journals}
          starId={starId}
          onAddJournal={(j) => { setJournals((prev) => [j, ...prev]); triggerGlow(); }}
        />
      )}
      {tab === "film" && <FilmTab />}
      {tab === "nanum" && nanum && <NanumTab nanum={nanum} />}
    </main>
  );
}

// ── 나의 별 요약 레이어 ───────────────────────────────────────────────────

function MyStarLayer({
  star,
  glowing = false,
  message = null,
  messageVisible = false,
}: {
  star: Star;
  glowing?: boolean;
  message?: string | null;
  messageVisible?: boolean;
}) {
  // dayCount: API 제공값 직접 사용 (UI 계산 금지 — SSOT v1)
  // 기본 발광 강도 (starStage 1–4 → opacity 0.30–0.80)
  const BASE_OPACITY = [0.30, 0.45, 0.60, 0.80][Math.min(star.starStage - 1, 3)];
  // journal 생성 시 순간 1.0으로 밝아졌다가 복귀
  const glowOpacity = glowing ? 1.0 : BASE_OPACITY;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#9B87F5]/25 bg-gradient-to-b from-[#0D1B2A] to-[#162040] px-5 py-5">
      <div className="flex items-center gap-4">
        {/* 별 아이콘 — 잔잔한 발광 (transition으로 자연스럽게) */}
        <div className="relative h-14 w-14 flex-shrink-0">
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-[#FFD76A]/30 blur-xl transition-opacity duration-700"
            style={{ opacity: glowOpacity }}
          />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#0D1B2A]/70 ring-1 ring-[#FFD76A]/35">
            <span
              className="text-2xl leading-none transition-all duration-700"
              style={{
                filter: glowing
                  ? "drop-shadow(0 0 10px rgba(255,215,106,0.90))"
                  : "drop-shadow(0 0 5px rgba(255,215,106,0.55))",
              }}
            >
              ★
            </span>
          </div>
        </div>

        {/* 텍스트 */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[15px] font-semibold text-white">{star.starName}</p>
            <span className="rounded-full bg-[#9B87F5]/25 px-2 py-0.5 text-[10px] font-medium text-[#C4B5FC]">
              D+{star.dayCount}
            </span>
          </div>
          {star.currentWish?.content && (
            <p className="mt-0.5 truncate text-sm text-white/55">
              {star.currentWish.content}
            </p>
          )}
        </div>
      </div>

      {/* 한 줄 메시지 — journal 생성 직후 2초 노출 후 fade out */}
      {message && (
        <p
          className="mt-3 text-center text-xs text-[#C4B5FC]/80 transition-opacity duration-700"
          style={{ opacity: messageVisible ? 1 : 0 }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

// ── 소원 탭 ──────────────────────────────────────────────────────────────

function WishTab({ wishes }: { wishes: WishesData | null }) {
  const current = wishes?.current ?? null;
  const previous = wishes?.previous ?? [];

  if (!current && previous.length === 0) {
    return (
      <div className="py-14 text-center">
        <p className="mb-5 text-sm text-gray-400">아직 소원이 없어요.</p>
        <Link
          href="/plaza/new"
          className="inline-block rounded-full bg-[#9B87F5] px-6 py-2.5 text-sm text-white"
        >
          첫 소원 세우기
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 현재 소원 카드 */}
      {current && (
        <div className="rounded-xl border border-[#9B87F5]/35 bg-gradient-to-br from-[#9B87F5]/8 to-white px-5 py-5">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-[#9B87F5]">
            지금 나의 소원
          </p>
          <p className="text-[15px] leading-relaxed text-gray-800">{current.content}</p>
          <p className="mt-2 text-xs text-gray-400">{formatKo(current.createdAt)}</p>
        </div>
      )}

      {/* 새 소원 버튼 */}
      <Link
        href="/plaza/new"
        className="block rounded-xl border border-dashed border-[#9B87F5]/40 px-4 py-4 text-center text-sm text-[#9B87F5]/70 hover:bg-[#9B87F5]/5"
      >
        + 새 소원 남기기
      </Link>

      {/* 이전 소원 목록 */}
      {previous.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium text-gray-400">지난 소원들</p>
          <div className="space-y-2">
            {previous.map((w) => (
              <div key={w.id} className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                <p className="text-sm text-gray-600">{w.content}</p>
                <p className="mt-1 text-xs text-gray-400">{formatKo(w.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── 항해기록 탭 ───────────────────────────────────────────────────────────

function JournalTab({
  journals,
  starId,
  onAddJournal,
}: {
  journals: Journal[];
  starId: string;
  onAddJournal: (j: Journal) => void;
}) {
  // Day 1 위젯: 기록이 1개 이하(Day 0 자동생성만)일 때 표시
  const showDay1 = journals.length <= 1;

  if (journals.length === 0 && !showDay1) {
    return (
      <div className="py-14 text-center">
        <p className="text-sm leading-relaxed text-gray-400">
          아직 남겨진 항해 기록이 없어요.
          <br />
          오늘의 작은 여정을 조용히 남겨보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* 기존 기록 목록 */}
      {journals.map((j) => (
        <div key={j.id} className="rounded-lg border border-gray-100 bg-white p-4">
          <p className="mb-2 text-xs text-gray-400">{formatKo(j.createdAt)}</p>
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-full bg-[#9B87F5]/10 px-2.5 py-0.5 text-xs text-[#9B87F5]">
              {j.emotion}
            </span>
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500">
              {j.helpTag}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600">{j.growthLine}</p>
        </div>
      ))}

      {/* Day 1 감정 선택 위젯 */}
      {showDay1 && (
        <Day1Widget starId={starId} onComplete={onAddJournal} />
      )}
    </div>
  );
}

// ── Day 1 감정 선택 위젯 ──────────────────────────────────────────────────

const EMOTIONS = ["숨이 놓였어요", "믿고 싶어졌어요", "정리됐어요", "용기났어요"] as const;
const HELP_TAGS = ["위로", "결심", "쉼", "연결", "실행"] as const;

const GROWTH_LINE: Record<string, Journal["growthLine"]> = {
  "숨이 놓였어요": "조금 가벼워졌어요",
  "믿고 싶어졌어요": "조금 또렷해졌어요",
  "정리됐어요": "조금 또렷해졌어요",
  "용기났어요": "조금 용감해졌어요",
};

function Day1Widget({
  starId,
  onComplete,
}: {
  starId: string;
  onComplete: (j: Journal) => void;
}) {
  const [step, setStep] = useState<"emotion" | "helpTag" | "done">("emotion");
  const [emotion, setEmotion] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleHelpTag(helpTag: string) {
    if (!emotion || saving) return;
    setSaving(true);

    const growthLine = GROWTH_LINE[emotion] ?? "조금 또렷해졌어요";

    try {
      const res = await fetch("/api/dt/journals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ starId, emotion, helpTag, growthLine }),
      });

      if (res.ok) {
        const data: { journal: Journal } = await res.json();
        onComplete(data.journal);
      }
    } catch {
      // 조용히 실패 — 사용자에게 에러 노출 안 함
    } finally {
      setStep("done");
      setSaving(false);
    }
  }

  if (step === "done") {
    return (
      <div className="rounded-xl border border-[#9B87F5]/20 bg-[#9B87F5]/5 px-5 py-5 text-center">
        <p className="text-sm text-[#9B87F5]">작은 항해가 남겨졌어요 ✨</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#9B87F5]/20 bg-gradient-to-br from-[#9B87F5]/5 to-white px-5 py-5">
      {step === "emotion" && (
        <>
          <p className="mb-4 text-sm font-medium text-gray-700">
            오늘은 어떤 느낌이었나요?
          </p>
          <div className="grid grid-cols-2 gap-2">
            {EMOTIONS.map((e) => (
              <button
                key={e}
                onClick={() => { setEmotion(e); setStep("helpTag"); }}
                className="rounded-full border border-[#9B87F5]/30 bg-white py-2.5 text-sm text-gray-700 hover:border-[#9B87F5] hover:bg-[#9B87F5]/5 transition-colors"
              >
                {e}
              </button>
            ))}
          </div>
        </>
      )}

      {step === "helpTag" && (
        <>
          <p className="mb-1 text-xs text-[#9B87F5]">{emotion}</p>
          <p className="mb-4 text-sm font-medium text-gray-700">
            도움이 되었던 건 무엇이었나요?
          </p>
          <div className="flex flex-wrap gap-2">
            {HELP_TAGS.map((h) => (
              <button
                key={h}
                onClick={() => handleHelpTag(h)}
                disabled={saving}
                className="rounded-full border border-[#9B87F5]/30 bg-white px-4 py-2 text-sm text-gray-700 hover:border-[#9B87F5] hover:bg-[#9B87F5]/5 transition-colors disabled:opacity-40"
              >
                {h}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── 필름 탭 ───────────────────────────────────────────────────────────────

function FilmTab() {
  return (
    <div className="py-20 text-center">
      <p className="text-3xl" aria-hidden="true">
        🌟
      </p>
      <p className="mt-3 text-sm leading-relaxed text-gray-400">
        당신의 항해 순간이<br />
        별빛처럼 기록되는 공간이에요 ✨<br />
        곧 열릴 예정이에요.
      </p>
    </div>
  );
}

// ── 나눔 탭 ───────────────────────────────────────────────────────────────

function NanumTab({ nanum }: { nanum: NanumData }) {
  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-400">
        다른 소원이의 빛이<br />
        내 항해에도 조용히 닿는 곳이에요.
      </p>

      {/* 받은 나눔 카운트 — thanks 숫자 미노출 (UI 정책) */}
      <div className="flex gap-3">
        <NanumCountCard count={nanum.counts.miracle} label="기적나눔" emoji="✨" />
        <NanumCountCard count={nanum.counts.wisdom} label="지혜나눔" emoji="🧠" />
      </div>

      {/* 받은 메시지 (thanks 타입 포함 노출) */}
      {nanum.messages.length > 0 ? (
        <div>
          <p className="mb-2 text-xs font-medium text-gray-400">받은 나눔</p>
          <div className="space-y-2">
            {nanum.messages.map((m) => (
              <div key={m.id} className="rounded-lg border border-gray-100 bg-white px-4 py-3">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 text-base" aria-hidden="true">
                    {m.type === "miracle" ? "✨" : m.type === "wisdom" ? "🧠" : "🙏"}
                  </span>
                  <p className="text-sm text-gray-700">{m.message}</p>
                </div>
                <p className="mt-1.5 text-xs text-gray-400">{formatKo(m.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="py-8 text-center text-sm text-gray-400">아직 받은 나눔이 없어요</p>
      )}
    </div>
  );
}

function NanumCountCard({
  count,
  label,
  emoji,
}: {
  count: number;
  label: string;
  emoji: string;
}) {
  return (
    <div className="flex-1 rounded-xl border border-[#9B87F5]/20 bg-[#9B87F5]/5 px-4 py-4 text-center">
      <p className="text-xl font-bold text-[#9B87F5]">{count}</p>
      <p className="mt-0.5 text-xs text-gray-500">
        {label} {emoji}
      </p>
    </div>
  );
}
