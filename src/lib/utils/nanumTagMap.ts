/**
 * Nanum → Tag 매핑 레이어 (임시 룰 기반)
 *
 * AI 태그 자동생성 도입 시 이 파일만 교체 — depth 엔진 수정 불필요
 *
 * 가중치 규칙:
 *   주(primary)   = 0.7
 *   보조(secondary) = 0.3
 */

export type TagWeight = { tag: string; weight: number };

const NANUM_TAG_MAP: Record<string, TagWeight[]> = {
  miracle: [
    { tag: "healing",    weight: 0.7 },
    { tag: "connection", weight: 0.3 },
  ],
  wisdom: [
    { tag: "clarity", weight: 0.7 },
    { tag: "courage", weight: 0.3 },
  ],
};

export function resolveTagWeights(nanumType: string): TagWeight[] {
  return NANUM_TAG_MAP[nanumType] ?? [];
}

// ── Tag → UX 톤 메시지 (AI 태그 도입 시 교체) ──────────────────────────────
//
// 인덱스: [0] 스침(depth 0~1)  [1] 가까워짐(depth 2~3)  [2] 익숙함(depth 4+)
// 원칙: 설명 없음, 이유 없음, 느낌만

type TagToneMessages = [string, string, string];

const TAG_TONE_MAP: Record<string, TagToneMessages> = {
  healing: [
    "숨이 잠깐 놓이는 빛이 스쳤어요",
    "숨이 조금 더 놓이는 빛이 가까워졌어요",
    "숨이 놓이는 빛이 머물렀어요",
  ],
  clarity: [
    "조용히 정리되는 빛이 스쳤어요",
    "더 맑아지는 빛이 가까워졌어요",
    "정리되는 빛이 머물렀어요",
  ],
  courage: [
    "한 발짝 내딛게 하는 빛이 스쳤어요",
    "조금 더 용감해지는 빛이 가까워졌어요",
    "용기가 되는 빛이 머물렀어요",
  ],
  connection: [
    "어딘가 이어지는 빛이 스쳤어요",
    "연결이 조금 더 가까워졌어요",
    "이어진 빛이 머물렀어요",
  ],
};

export function getTagToneMessage(tag: string, depthStage: 0 | 1 | 2): string | null {
  return TAG_TONE_MAP[tag]?.[depthStage] ?? null;
}
