/**
 * CHECKIN-002: 소원그림 배정 유틸
 *
 * 21개의 사전 생성된 하멜등대 stage3 이미지 중 1개를 starId 기반으로 결정론적 배정.
 * - 동일 starId → 항상 동일 이미지 (재시작/재배포 후에도 일관성 유지)
 * - 이미지는 기본 비공개 (wishImageStatus = "ready", wishImageRevealedAt = null)
 * - 공개는 별도 Reveal API에서만 가능
 */

const WISH_IMAGE_BASE = "/images/star-cache/yeosu_hamel";

const WISH_IMAGE_FILES = [
  "02_curiosity_sapphire_yeosu_hamel_stage3.png",
  "03_connection_emerald_yeosu_hamel_stage3.png",
  "04_quiet_expansion_ruby_yeosu_hamel_stage3.png",
  "05_fragile_hope_diamond_yeosu_hamel_stage3.png",
  "06_calm_citrine_yeosu_hamel_stage3.png",
  "08_connection_emerald_yeosu_hamel_stage3.png",
  "09_quiet_expansion_ruby_yeosu_hamel_stage3.png",
  "10_fragile_hope_diamond_yeosu_hamel_stage3.png",
  "11_calm_citrine_yeosu_hamel_stage3.png",
  "12_curiosity_sapphire_yeosu_hamel_stage3.png",
  "14_quiet_expansion_ruby_yeosu_hamel_stage3.png",
  "15_fragile_hope_diamond_yeosu_hamel_stage3.png",
  "16_calm_citrine_yeosu_hamel_stage3.png",
  "17_curiosity_sapphire_yeosu_hamel_stage3.png",
  "18_connection_emerald_yeosu_hamel_stage3.png",
  "20_fragile_hope_diamond_yeosu_hamel_stage3.png",
  "21_calm_citrine_yeosu_hamel_stage3.png",
  "22_curiosity_sapphire_yeosu_hamel_stage3.png",
  "23_connection_emerald_yeosu_hamel_stage3.png",
  "24_quiet_expansion_ruby_yeosu_hamel_stage3.png",
  "25_fragile_hope_diamond_yeosu_hamel_stage3.png",
] as const;

/** starId 문자열을 단순 해시로 변환 → 이미지 인덱스 결정 */
function hashIndex(starId: string): number {
  let h = 0;
  for (let i = 0; i < starId.length; i++) {
    h = (h * 31 + starId.charCodeAt(i)) >>> 0;
  }
  return h % WISH_IMAGE_FILES.length;
}

export function assignWishImageUrl(starId: string): string {
  const fileName = WISH_IMAGE_FILES[hashIndex(starId)];
  return `${WISH_IMAGE_BASE}/${fileName}`;
}
