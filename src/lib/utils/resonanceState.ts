/**
 * resonance depth 엔진
 *
 * - 입력: TagWeight[] (매핑 레이어에서 변환된 값)
 * - 태그 체계(nanumTagMap 등)와 완전 분리
 * - AI 태그 자동생성 도입 시 이 파일 수정 없음
 */

import type { TagWeight } from "./nanumTagMap";
import { getTagToneMessage } from "./nanumTagMap";

const STORAGE_KEY = "dt_resonance_state";

type UserResonanceState = {
  resonanceDepthByTag: Record<string, number>;
  lastShownAt?: number;
};

function load(): UserResonanceState {
  if (typeof window === "undefined") return { resonanceDepthByTag: {} };
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    // 구버전 데이터(recentTags만 있는 경우) graceful 처리
    return raw ? { resonanceDepthByTag: {}, ...raw } : { resonanceDepthByTag: {} };
  } catch {
    return { resonanceDepthByTag: {} };
  }
}

function save(state: UserResonanceState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ── 깊이 누적 ──────────────────────────────────────────────────────────────

export function updateDepth(weights: TagWeight[]): void {
  const state = load();
  const depth = { ...state.resonanceDepthByTag };
  for (const { tag, weight } of weights) {
    depth[tag] = (depth[tag] ?? 0) + weight;
  }
  save({ ...state, resonanceDepthByTag: depth });
}

// ── 노출 조건 ──────────────────────────────────────────────────────────────

export function shouldShowResonance(): boolean {
  const state = load();
  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;

  // 고유 태그 2개 이상 필요
  if (Object.keys(state.resonanceDepthByTag).length < 2) return false;
  // 하루 1회 제한
  if (state.lastShownAt && now - state.lastShownAt < DAY) return false;

  // 최고 depth 기반 확률 가산 (+5%p/depth, 상한 50%)
  const prob = Math.min(0.35 + (getMaxResonanceDepth() - 1) * 0.05, 0.50);
  if (Math.random() > prob) return false;

  return true;
}

// ── 메시지 분기 ────────────────────────────────────────────────────────────

export function getMaxResonanceDepth(): number {
  const depths = Object.values(load().resonanceDepthByTag);
  return depths.length > 0 ? Math.max(...depths) : 0;
}

export function getDepthStage(): 0 | 1 | 2 {
  const d = getMaxResonanceDepth();
  return d >= 4 ? 2 : d >= 2 ? 1 : 0;
}

export function getResonanceMessage(chosenTag?: string | null): string {
  const depth = getMaxResonanceDepth();
  const stage: 0 | 1 | 2 = depth >= 4 ? 2 : depth >= 2 ? 1 : 0;

  // tag 톤 메시지 우선 — 없으면 depth 기본 메시지 fallback
  if (chosenTag) {
    const toned = getTagToneMessage(chosenTag, stage);
    if (toned) return toned;
  }

  if (stage === 2) return "어딘가 익숙한 빛이 머물렀어요";
  if (stage === 1) return "같은 빛이 조금 더 가까워졌어요";
  return "같은 빛이 다시 스쳐 지나갔어요";
}

// ── 재등장 확률 함수 ──────────────────────────────────────────────────────
//
//   P(tag) = min(cap, base + k * log(1 + depth))
//   base=0.12  k=0.15  cap=0.65
//
//   depth  0 → ~0.12
//   depth  1 → ~0.22
//   depth  3 → ~0.33
//   depth  5 → ~0.41
//   depth  8 → ~0.50
//   depth 14 → ~0.65 (cap)

export function getReappearanceProbability(depth: number): number {
  const base = 0.12;
  const k    = 0.15;
  const cap  = 0.65;
  return Math.min(cap, base + k * Math.log(1 + depth));
}

// ── 상태 파생 지표 ────────────────────────────────────────────────────────
//
// 새 state 필드 없이 resonanceDepthByTag에서 실시간 계산

export function getTopTagRatio(): number {
  const depths = Object.values(load().resonanceDepthByTag);
  if (depths.length === 0) return 0;
  const total = depths.reduce((s, d) => s + d, 0);
  const max   = Math.max(...depths);
  return total > 0 ? max / total : 0;
}

// totalDepth 4 기준 — 나눔 ~4회 이상이면 연결 형성으로 간주
export function getFallbackRate(): number {
  const depths = Object.values(load().resonanceDepthByTag);
  const total  = depths.reduce((s, d) => s + d, 0);
  return Math.max(0, 1 - total / 4);
}

// ── 메시지 선택 weight 함수 ───────────────────────────────────────────────

type WeightCtx = { chosenStage: 0 | 1 | 2; topTagRatio: number; fallbackRate: number };

function getFocusWeight(topTagRatio: number, stage: 0 | 1 | 2): number {
  if (topTagRatio >= 0.6) {
    if (stage === 2) return 1.3;
    if (stage === 1) return 1.1;
    return 0.9;
  }
  if (topTagRatio < 0.4) {
    if (stage === 0) return 1.2;
    return 1.0;
  }
  return 1.0;
}

function getFallbackWeight(fallbackRate: number, stage: 0 | 1 | 2): number {
  if (fallbackRate > 0.5) {
    if (stage === 0) return 1.2;
    return 0.95;
  }
  if (fallbackRate < 0.2) {
    if (stage === 2) return 1.2;
    return 1.0;
  }
  return 1.0;
}

function getMessageWeight(ctx: WeightCtx): number {
  return getFocusWeight(ctx.topTagRatio, ctx.chosenStage)
       * getFallbackWeight(ctx.fallbackRate, ctx.chosenStage);
}

// ── 선택 로직 내부 단계 ────────────────────────────────────────────────────

// ctx 전달 시 per-tag stage 기반 weight 적용 — 확률 함수/depth 엔진 수정 없음
function getTagProbabilities(
  depthMap: Record<string, number>,
  ctx?: WeightCtx,
): Record<string, number> {
  const probs: Record<string, number> = {};
  for (const [tag, depth] of Object.entries(depthMap)) {
    const base = getReappearanceProbability(depth);
    if (ctx) {
      const tagStage: 0 | 1 | 2 = depth >= 4 ? 2 : depth >= 2 ? 1 : 0;
      probs[tag] = base * getMessageWeight({ ...ctx, chosenStage: tagStage });
    } else {
      probs[tag] = base;
    }
  }
  return probs;
}

function normalizeProbabilities(probs: Record<string, number>): Record<string, number> {
  const total = Object.values(probs).reduce((a, b) => a + b, 0);
  if (total === 0) return probs;
  const normalized: Record<string, number> = {};
  for (const [tag, p] of Object.entries(probs)) {
    normalized[tag] = p / total;
  }
  return normalized;
}

function pickTag(normalizedProbs: Record<string, number>): string {
  let cumulative = 0;
  const rand = Math.random();
  for (const [tag, p] of Object.entries(normalizedProbs)) {
    cumulative += p;
    if (rand <= cumulative) return tag;
  }
  return Object.keys(normalizedProbs)[0]; // 부동소수점 안전망
}

// depth 기반 확률로 normalize → 태그 1개 선택 (weighted random)
//
// allTags: 미접촉 태그(depth=0)도 포함할 경우 전달 — 낮은 확률(0.12)로 등장 유지
// 반환값이 null이면 호출처에서 기본 흐름 유지
export function selectResonanceTag(allTags?: string[]): string | null {
  const stored = load().resonanceDepthByTag;

  // depth=0 미접촉 태그 병합 (allTags 전달 시)
  const depthMap: Record<string, number> = {};
  if (allTags) {
    for (const tag of allTags) depthMap[tag] = 0;
  }
  Object.assign(depthMap, stored); // 저장값이 0보다 항상 우선

  if (Object.keys(depthMap).length === 0) return null;

  // 상태 기반 context — 확률 함수/depth 엔진 수정 없이 감각만 미세 조정
  const ctx: WeightCtx = {
    chosenStage: getDepthStage(),
    topTagRatio: getTopTagRatio(),
    fallbackRate: getFallbackRate(),
  };

  const probs      = getTagProbabilities(depthMap, ctx);
  const normalized = normalizeProbabilities(probs);
  return pickTag(normalized);
}

// ── 노출 후 상태 기록 ──────────────────────────────────────────────────────

export function markResonanceShown(): void {
  const state = load();
  save({ ...state, lastShownAt: Date.now() });
}
