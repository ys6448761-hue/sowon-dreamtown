"use client";

/**
 * /star/[id] — Connected Star View (읽기 전용, 익명)
 *
 * 보여주는 것:
 *  - 별 이름 + 항해 일수 (D+N)
 *  - 현재 소원 1줄 (텍스트만, 50자 clip)
 *  - 항해기록에서 growthLine 최대 5개 (시간순)
 *  - 단 1개 CTA: "조용히 공명하기"
 *
 * 숨기는 것:
 *  - 프로필/신원, 감정 태그, helpTag, 날짜, 나눔 카운트
 *
 * ?from=myStarId  → 뒤로가기 시 /home?starId=xxx
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { safeString } from "@/lib/utils/safeString";
import { updateDepth } from "@/lib/utils/resonanceState";
import { resolveTagWeights } from "@/lib/utils/nanumTagMap";

type StarData = {
  id: string;
  starName: string;
  dayCount: number;
  currentWish: { content: string } | null;
};

type GrowthLine = {
  id: string;
  growthLine: string;
  createdAt: string;
};

type ResonanceState = "idle" | "sending" | "done";

const RESONANCE_MESSAGES: Record<string, string> = {
  miracle: "작은 기적이 전해졌어요",
  wisdom: "지혜가 조용히 닿았어요",
};

export default function StarViewPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const starId = params.id;
  const fromStarId = searchParams.get("from") ?? "";

  const [star, setStar] = useState<StarData | null>(null);
  const [growthLines, setGrowthLines] = useState<GrowthLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [resonanceState, setResonanceState] = useState<ResonanceState>("idle");
  const [resonanceDoneMsg, setResonanceDoneMsg] = useState("");
  const [showTypeSheet, setShowTypeSheet] = useState(false);
  const [nanumFlash, setNanumFlash] = useState(false);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (flashTimerRef.current) clearTimeout(flashTimerRef.current); }, []);

  const load = useCallback(async () => {
    try {
      const [starRes, journalsRes] = await Promise.all([
        fetch(`/api/dt/stars/${starId}`),
        fetch(`/api/dt/journals?starId=${starId}`),
      ]);

      if (starRes.ok) setStar(await starRes.json());
      if (journalsRes.ok) {
        const journals: GrowthLine[] = await journalsRes.json();
        // 시간순 오름차순 → 최대 5개
        const sorted = [...journals].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        setGrowthLines(sorted.slice(0, 5));
      }
    } catch { /* 조용히 처리 */ }
    finally { setLoading(false); }
  }, [starId]);

  useEffect(() => { load(); }, [load]);

  async function handleResonate(type: "miracle" | "wisdom") {
    setShowTypeSheet(false);
    setResonanceState("sending");

    const messages = {
      miracle: "조용한 기적이 함께 이어지길 바랍니다",
      wisdom: "당신의 항해에 지혜가 닿기를 바랍니다",
    };

    const url = fromStarId
      ? `/api/dt/nanum?fromStarId=${fromStarId}`
      : `/api/dt/nanum`;

    try {
      const safePayload = {
        starId: safeString(starId),
        type,
        message: safeString(messages[type] || ""),
      };
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(safePayload),
      });
      // A: 나눔 직후 1.5초 여운 플래시 + 태그 누적
      if (typeof window !== "undefined") {
        localStorage.setItem("nanum_last_shared_at", String(Date.now()));
      }
      updateDepth(resolveTagWeights(type));
      setNanumFlash(true);
      flashTimerRef.current = setTimeout(() => {
        setNanumFlash(false);
        setResonanceDoneMsg(RESONANCE_MESSAGES[type]);
        setResonanceState("done");
      }, 1500);
    } catch {
      setResonanceState("idle");
    }
  }

  function handleBack() {
    if (fromStarId) router.push(`/home?starId=${fromStarId}`);
    else router.push("/home");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center">
        <div className="h-1.5 w-1.5 rounded-full bg-[#9B87F5] animate-pulse" />
      </div>
    );
  }

  if (!star) {
    return (
      <div className="min-h-screen bg-[#0D1B2A] flex flex-col items-center justify-center gap-4">
        <p className="text-sm text-white/40">별을 찾을 수 없어요</p>
        <button onClick={handleBack} className="text-xs text-white/30 underline underline-offset-4">
          돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1B2A] flex flex-col">
      {/* 뒤로가기 */}
      <div className="px-6 pt-12 pb-0">
        <button
          onClick={handleBack}
          className="text-xs text-white/30 hover:text-white/50 transition-colors"
        >
          ← 당신의 별로 돌아갈게요
        </button>
      </div>

      {/* 별 헤더 */}
      <div className="flex flex-col items-center pt-10 pb-8 px-6">
        {/* 별 글로우 — 내 별보다 흐리게 */}
        <motion.div
          className="mb-5 h-3 w-3 rounded-full bg-[#9B87F5]"
          style={{
            boxShadow: "0 0 14px 4px rgba(155,135,245,0.35)",
          }}
          animate={{ opacity: [0.55, 0.75, 0.55] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />

        <p className="text-base font-medium text-white/75">{star.starName}</p>
        <p className="mt-1 text-xs text-[#9B87F5]/60">D+{star.dayCount} 항해 중</p>
      </div>

      {/* 현재 소원 */}
      {star.currentWish && (
        <div className="mx-6 mb-8 rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4">
          <p className="mb-1.5 text-[10px] text-white/30">지금 품고 있는 소원</p>
          <p className="text-sm leading-relaxed text-white/60 line-clamp-2">
            {star.currentWish.content}
          </p>
        </div>
      )}

      {/* 항해 흔적 */}
      {growthLines.length > 0 && (
        <div className="mx-6 mb-8">
          <p className="mb-3 text-[10px] text-white/25">항해 흔적</p>
          <div className="flex flex-col gap-2.5">
            {growthLines.map((g, i) => (
              <motion.div
                key={g.id}
                className="flex items-start gap-2.5"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <div className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-[#9B87F5]/40" />
                <p className="text-sm leading-relaxed text-white/50">{g.growthLine}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 공명 결과 / CTA */}
      <div className="mt-auto px-6 pb-12">
        <AnimatePresence mode="wait">
          {resonanceState === "done" ? (
            <motion.div
              key="done"
              className="text-center"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="mb-2 text-xs text-white/35">{resonanceDoneMsg}</p>
              <button
                onClick={handleBack}
                className="mt-4 text-xs text-white/25 underline underline-offset-4"
              >
                당신의 별로 돌아갈게요
              </button>
            </motion.div>
          ) : (
            <motion.div key="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <button
                onClick={() => setShowTypeSheet(true)}
                disabled={resonanceState === "sending"}
                className="w-full rounded-full border border-[#9B87F5]/30 bg-[#9B87F5]/10 py-3.5 text-sm text-[#C4B5FC] hover:bg-[#9B87F5]/18 transition-colors disabled:opacity-40"
              >
                {resonanceState === "sending" ? "전하는 중…" : "조용히 공명하기"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* A: 나눔 직후 여운 플래시 (1.5초, 보상/결과 없음) */}
      <AnimatePresence>
        {nanumFlash && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
          >
            <p className="text-center text-sm leading-relaxed text-white/50">
              당신의 빛이<br />다른 항해에 닿았어요
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 공명 타입 선택 시트 */}
      <AnimatePresence>
        {showTypeSheet && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-[#0D1B2A]/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTypeSheet(false)}
          >
            <motion.div
              className="w-full max-w-sm rounded-t-3xl bg-[#111C2A] px-6 pb-10 pt-6"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 text-center">
                <p className="text-xs text-white/35">어떤 공명을 전할까요?</p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleResonate("miracle")}
                  className="rounded-full border border-[#FFD76A]/25 bg-[#FFD76A]/8 py-3.5 text-sm text-[#FFD76A]/75 hover:bg-[#FFD76A]/14 transition-colors"
                >
                  작은 기적 — 소원이 이어지길
                </button>
                <button
                  onClick={() => handleResonate("wisdom")}
                  className="rounded-full border border-[#9B87F5]/25 bg-[#9B87F5]/8 py-3.5 text-sm text-[#C4B5FC]/75 hover:bg-[#9B87F5]/14 transition-colors"
                >
                  지혜 — 항해에 도움이 되길
                </button>
                <button
                  onClick={() => setShowTypeSheet(false)}
                  className="mt-1 py-2 text-xs text-white/25"
                >
                  닫기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
