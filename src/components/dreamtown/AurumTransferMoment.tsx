"use client";

/**
 * AurumTransferMoment
 * 소원 제출 성공 직후 0.5초간 1회 재생
 * 아우룸 → 빛 궤적 → 별 생성 순서
 *
 * ⚠️ 구현 원칙
 * - pointer-events 없음
 * - 반복 재생 없음
 * - 사운드 없음
 * - 화려하지 않게 — 짧고 조용하게 지나감
 */

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";

export type AurumTransferMomentProps = {
  visible: boolean;
  onComplete?: () => void;
};

export default function AurumTransferMoment({
  visible,
  onComplete,
}: AurumTransferMomentProps) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => onComplete?.(), 500);
    return () => clearTimeout(t);
  }, [visible, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute inset-0 overflow-hidden"
          style={{ pointerEvents: "none" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
        >
          <AurumSprite />
          <LightTrail />
          <BornStar />
          <SoftCaption />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── 아우룸 스프라이트 ─────────────────────────────────────────────────────
// 이미지 없을 시 이모지 fallback

function AurumSprite() {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 w-20 -translate-x-[140%] -translate-y-[20%] sm:w-24"
      initial={{ opacity: 0, scale: 0.8, x: 16, y: 10 }}
      animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      {/* aurum.png 준비 전 fallback */}
      <AurumFallback />
    </motion.div>
  );
}

function AurumFallback() {
  // aurum.png 존재 시 Image로 교체
  // <Image src="/images/characters/aurum.png" alt="" width={96} height={96} priority className="h-auto w-full" />
  return (
    <div
      className="flex h-20 w-20 items-center justify-center rounded-full"
      style={{
        background: "radial-gradient(circle, rgba(255,215,106,0.18) 0%, transparent 70%)",
      }}
    >
      <span
        className="text-4xl"
        style={{ filter: "drop-shadow(0 0 8px rgba(255,215,106,0.70))" }}
        role="img"
        aria-label="아우룸"
      >
        🐢
      </span>
    </div>
  );
}

// ── 빛 궤적 ──────────────────────────────────────────────────────────────

function LightTrail() {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 h-20 w-36 -translate-x-[55%] -translate-y-[80%] rounded-full"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: [0, 0.95, 0.65, 0],
        scale: [0.9, 1, 1, 1.02],
      }}
      transition={{
        duration: 0.3,
        times: [0, 0.35, 0.75, 1],
        ease: "easeOut",
        delay: 0.15,
      }}
      style={{
        background:
          "radial-gradient(circle at 20% 80%, rgba(255,215,106,0.95) 0%, rgba(255,215,106,0.55) 22%, rgba(255,215,106,0.18) 45%, rgba(255,215,106,0) 70%)",
        filter: "blur(8px)",
        pointerEvents: "none",
      }}
    />
  );
}

// ── 별 생성 ───────────────────────────────────────────────────────────────

function BornStar() {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[120%]"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: [0, 1, 0.92], scale: [0.6, 1.04, 1] }}
      transition={{ duration: 0.2, delay: 0.3, ease: "easeOut" }}
    >
      <div
        className="h-6 w-6 rotate-45 rounded-[3px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,245,210,1) 0%, rgba(255,215,106,1) 45%, rgba(255,190,70,0.95) 100%)",
          boxShadow:
            "0 0 12px rgba(255,215,106,0.85), 0 0 28px rgba(255,215,106,0.35)",
        }}
      />
    </motion.div>
  );
}

// ── 한 줄 캡션 ────────────────────────────────────────────────────────────

function SoftCaption() {
  return (
    <motion.p
      className="absolute bottom-20 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm tracking-tight text-[#F7E7B8]"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{ duration: 0.45, delay: 0.05, ease: "easeInOut" }}
    >
      조용히 전해졌어요
    </motion.p>
  );
}
