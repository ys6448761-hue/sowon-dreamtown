/**
 * REDIRECT 템플릿 A/B/C (2주 동결 — 2026-03-13까지)
 *
 * templateType: A_WARM | B_SPECIFIC | C_GUIDE
 * 운영자 커스텀 사유와 조합 가능 (템플릿 본문 + 커스텀)
 */

export const TEMPLATE_TYPES = ["A_WARM", "B_SPECIFIC", "C_GUIDE"] as const;
export type TemplateType = (typeof TEMPLATE_TYPES)[number];

export const REDIRECT_TEMPLATES: Record<TemplateType, string> = {
  A_WARM:
    "나눔 공간에서는 따뜻한 표현을 권장해요. 조금 다듬어서 다시 올려주시면 좋겠어요.",
  B_SPECIFIC:
    "내용을 좀 더 구체적으로 적어주시면 다른 분들이 이해하기 쉬울 거예요. 수정 후 다시 제출해주세요.",
  C_GUIDE:
    "커뮤니티 가이드에 맞게 일부 표현을 수정해주세요. 수정 후 다시 올려주시면 검토할게요.",
};

/** 랜덤 1/3 배정 */
export function pickRandomTemplate(): TemplateType {
  const idx = Math.floor(Math.random() * TEMPLATE_TYPES.length);
  return TEMPLATE_TYPES[idx];
}
