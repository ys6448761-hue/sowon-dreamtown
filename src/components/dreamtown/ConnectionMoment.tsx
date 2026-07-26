"use client";

/**
 * ConnectionMoment
 * 동일 공명자가 2회 이상 공명 → connection_completed → 단 1회 노출
 *
 * 3단계:
 *   1. 감지  — "조용히 스쳐갔던 빛이 다시 닿았어요"
 *   2. 깨달음 — "같은 소원이 다시 당신의 별을 지나갔어요"
 *   3. 선택  — "조용히 간직" / "이어가볼게요"
 *
 * ⚠️ 이름·프로필 절대 미노출 / 관계 강요 없음
 */

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type ConnectionMomentProps = {
  connectionId: string;
  otherStarId: string;
  myStarId: string;
  onDismiss: () => void;
};

type Step = "detection" | "realization" | "choice";

export default function ConnectionMoment({
  connectionId,
  otherStarId,
  myStarId,
  onDismiss,
}: ConnectionMomentProps) {
  const [step, setStep] = useState<Step>("detection");
  const [visible, setVisible] = useState(true);
  const router = useRouter();

  // 단계 자동 전환: detection → realization (1.8초 후)
  useEffect(() => {
    if (step !== "detection") return;
    const t = setTimeout(() => setStep("realization"), 1800);
    return () => clearTimeout(t);
  }, [step]);

  async function acknowledge() {
    await fetch(`/api/dt/connection/${connectionId}/acknowledge`, { method: "POST" }).catch(() => {});
  }

  async function handleKeep() {
    await acknowledge();
    setVisible(false);
    setTimeout(onDismiss, 400);
  }

  async function handleConnect() {
    await acknowledge();
    setVisible(false);
    setTimeout(() => {
      router.push(`/star/${otherStarId}?from=${myStarId}`);
    }, 400);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D1B2A]/80 px-6 backdrop-blur-sm"
          style={{ pointerEvents: "auto" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
        >
          <div className="w-full max-w-sm">
            {step === "detection" && <DetectionStep />}
            {step === "realization" && <RealizationStep onNext={() => setStep("choice")} />}
            {step === "choice" && <ChoiceStep onKeep={handleKeep} onConnect={handleConnect} />}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── 두 빛 스쳐가는 연출 ───────────────────────────────────────────────────

function TwoLights() {
  return (
    <div className="relative mx-auto mb-8 flex h-10 w-40 items-center justify-between">
      {/* 빛 1 (내 별) */}
      <motion.div
        className="h-2.5 w-2.5 rounded-full bg-[#FFD76A]"
        style={{ boxShadow: "0 0 8px rgba(255,215,106,0.85)" }}
        animate={{ x: [0, 14, 0] }}
        transition={{ duration: 0.75, ease: "easeInOut", times: [0, 0.5, 1] }}
      />
      {/* 연결선 — 선이 아니라 흐릿한 흐름 */}
      <motion.div
        className="absolute left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(to right, rgba(255,215,106,0) 0%, rgba(155,135,245,0.55) 50%, rgba(255,215,106,0) 100%)",
        }}
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: [0, 0.8, 0], scaleX: [0, 1, 0] }}
        transition={{ duration: 0.75, ease: "easeInOut" }}
      />
      {/* 빛 2 (다른 별) */}
      <motion.div
        className="h-2.5 w-2.5 rounded-full bg-[#9B87F5]"
        style={{ boxShadow: "0 0 8px rgba(155,135,245,0.85)" }}
        animate={{ x: [0, -14, 0] }}
        transition={{ duration: 0.75, ease: "easeInOut", times: [0, 0.5, 1] }}
      />
    </div>
  );
}

// ── Step 1: 감지 ──────────────────────────────────────────────────────────

function DetectionStep() {
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <TwoLights />
      <p className="text-sm leading-relaxed text-white/75">
        조용히 스쳐갔던 빛이<br />
        다시 닿았어요
      </p>
    </motion.div>
  );
}

// ── Step 2: 깨달음 ────────────────────────────────────────────────────────

function RealizationStep({ onNext }: { onNext: () => void }) {
  useEffect(() => {
    const t = setTimeout(onNext, 2200);
    return () => clearTimeout(t);
  }, [onNext]);

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <TwoLights />
      <p className="text-sm leading-relaxed text-white/75">
        같은 소원이<br />
        다시 당신의 별을 지나갔어요
      </p>
    </motion.div>
  );
}

// ── Step 3: 선택 ──────────────────────────────────────────────────────────

function ChoiceStep({
  onKeep,
  onConnect,
}: {
  onKeep: () => void;
  onConnect: () => void;
}) {
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <p className="mb-7 text-sm leading-relaxed text-white/70">
        이 인연을<br />
        이어볼까요?
      </p>
      <div className="flex flex-col gap-3">
        <button
          onClick={onKeep}
          className="rounded-full border border-white/15 py-3 text-sm text-white/60 hover:bg-white/5 transition-colors"
        >
          조용히 간직할게요
        </button>
        <button
          onClick={onConnect}
          className="rounded-full border border-[#9B87F5]/50 bg-[#9B87F5]/15 py-3 text-sm text-[#C4B5FC] hover:bg-[#9B87F5]/25 transition-colors"
        >
          한 번 이어가볼게요
        </button>
      </div>
    </motion.div>
  );
}

