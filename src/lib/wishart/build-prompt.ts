import type { ExpressionType, PhotoProfile } from "./types";

// ─── SSOT Rules (ported from dreamtown-wishart image_generator.py) ───────────

const DREAMTOWN_V1_SSOT = `DREAMTOWN V1 SSOT:
DreamTown is a real place on Earth — Yeosu, South Korea.
The Hamel Lighthouse (하멜등대) is a real lighthouse-shaped building that stands within DreamTown.
All images must be grounded in this physical reality.
No fantasy planets, no floating islands, no impossible architecture.`;

const IDENTITY_LOCK_RULE = `IDENTITY LOCK RULE (HIGHEST PRIORITY):
The person in the uploaded photo is the subject.
Their face, skin tone, hair, and distinguishing features must be faithfully preserved.
Do NOT replace, idealize, anonymize, or alter the subject's identity.
If the photo shows a person with glasses, keep the glasses.
If the photo shows a person with short hair, keep the short hair.`;

const HOPE_RESTORATION_RULE = `HOPE RESTORATION RULE:
Show the happiness that already exists in the person — slightly more open and at ease.
Quiet genuine happiness: mouth corners gently raised, eyes softly crinkled, cheeks naturally lifted,
relaxed facial muscles, soft warm gaze.
Do NOT force a larger smile than the person naturally has.
Do NOT make the person look fearful, melancholic, or distressed.
Do NOT show exaggerated toothy grin, forced smile, or commercial advertising smile.
The WishArt is a moment of hope — not sorrow, and not a performance.`;

const WORLD_RESPONSE_RULE = `WORLD RESPONSE RULE:
The environment around the subject must visually "respond" to the wish text.
Wish-related imagery (symbols, light, colors, textures) should appear in the background or atmosphere.
The world is celebrating or cradling the wish — not ignoring it.`;

const GEMSTONE_STAR_RULE = `GEMSTONE STAR RULE:
Each DreamTown visitor is associated with a gemstone star:
Citrine (황수정), Sapphire (사파이어), Emerald (에메랄드), Ruby (루비), Diamond (다이아몬드).
The gemstone's color and luminosity must appear in the image — in light, reflections, or ambient glow.
Do NOT place a literal gemstone in the image unless it naturally fits. Use color and light instead.`;

const HAMEL_LIGHTHOUSE_RULE = `HAMEL LIGHTHOUSE RULE:
The Hamel Lighthouse is a real lighthouse-shaped building at DreamTown, Yeosu, Korea.
It may appear in the background as a distant landmark, in a reflection, or as a subtle silhouette.
It must look like a real lighthouse, not a fantasy tower.
Including it is optional but strongly encouraged for DreamTown identity.`;

const COLOR_RULE = `COLOR RULE:
The image must have a coherent, emotionally resonant color palette.
The gemstone color is the dominant accent.
Warm gold or soft teal may be used as secondary tones.
Avoid muddy or desaturated results — the image should feel luminous and alive.`;

const WISHART_WOW_RULE = `WISHART WOW RULE:
This image will be shown to the visitor as their personal wish portrait.
It must feel like a genuine keepsake — something they would want to save and share.
Quality, composition, and emotional resonance are the top priorities.`;

const POSTER_COMPOSITION_RULE = `POSTER COMPOSITION RULE:
Compose the image as a vertical portrait (portrait orientation, 1024×1536).
The subject should be centered or slightly off-center, with meaningful background depth.
Leave breathing room at the top for atmosphere; the subject's face should occupy roughly the upper-middle third.`;

const CANVAS_RULE = `CANVAS RULE:
Output size: 1024×1536 (portrait).
Style: 2D Korean webtoon illustration with hand-painted watercolor finish.
Rendering balance: Korean webtoon 40% / watercolor 40% / realism 20%.
Visible watercolor paper texture throughout the entire image.
Soft flat watercolor washes. Restrained cel-shaded outlines.
Soft hand-painted edges. Korean comic proportions.
The image must NOT look photorealistic, 3D-rendered, or CGI.
This is a hand-painted illustration — not a photograph or photo-manipulation.`;

const FACE_STYLE_RULE = `FACE RENDERING RULE:
Do NOT render any face as 3D.
Paint every face using flat watercolor washes, soft hand-painted edges, and restrained line work.
Subtle watercolor paper texture must remain visible through skin tones.
Cheeks and highlights are soft watercolor color blooms — not photographic gradients.
Cel-shading is subtle and restrained — not heavy anime outlines.
The face must not look like a 3D render, CGI portrait, beauty filter, or photorealistic AI photo.`;

const VITALITY_RULE = `VITALITY RULE:
Show the subject with slightly more youthful vitality —
as if during a healthy and genuinely happy period of their life,
approximately 5–10 years fresher in energy.
Do NOT change facial structure, age identity, or recognizability.
Do NOT perform teenage transformation, dramatic rejuvenation, or face reshaping.
This is an energy shift in the illustration — not a facial reconstruction.`;

const WISH_MOMENT_SCENE = `WISH MOMENT SCENE:
The image captures the exact moment the wish is being released into the world.
The atmosphere should feel charged with possibility — not mundane, not dramatic.
Subtle light effects (lens flare, bokeh, golden hour glow, or bioluminescent ambiance) are appropriate.`;

const NEGATIVE_RULE = `NEGATIVE RULE (what to avoid):
- Do NOT add text, logos, or watermarks.
- Do NOT show violence, fear, or distress.
- Do NOT alter the subject's race, gender, or age significantly.
- Do NOT render photorealistic portrait, cinematic photo, 3D render, or CGI face.
- Do NOT create plastic skin, hyperreal skin, or beauty-filter face.
- Do NOT use Pixar-like face, game character face, or sharp anime proportions.
- Do NOT apply V-shaped jaw or artificially enlarged eyes.
- Do NOT replace, redesign, or idealize the subject's facial identity.
- Do NOT show exaggerated toothy grin, forced smile, or commercial advertising smile.
- Do NOT show impossible physics (floating people, etc.) unless the wish text explicitly calls for it.
- Do NOT make the background generic (plain studio backdrop, plain gradient).
- Do NOT compose as a tourism poster or add floating lanterns and fantasy particle explosions.`;

// ─── Gemstone detection ───────────────────────────────────────────────────────

const GEMSTONE_KEYWORDS: Record<string, string[]> = {
  citrine: ["황수정", "시트린", "노랑", "노란", "gold", "golden", "황금"],
  sapphire: ["사파이어", "파랑", "파란", "blue", "하늘", "바다"],
  emerald: ["에메랄드", "초록", "녹색", "green", "숲", "자연"],
  ruby: ["루비", "빨강", "붉은", "red", "열정", "rose"],
  diamond: ["다이아몬드", "다이아", "투명", "white", "빛", "반짝"],
};

const GEMSTONE_COLORS: Record<string, string> = {
  citrine: "warm golden yellow (citrine)",
  sapphire: "deep royal blue (sapphire)",
  emerald: "vivid forest green (emerald)",
  ruby: "rich crimson red (ruby)",
  diamond: "brilliant white and prismatic light (diamond)",
};

function detectGemstone(wishText: string): string {
  const lower = wishText.toLowerCase();
  for (const [gem, keywords] of Object.entries(GEMSTONE_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return gem;
    }
  }
  return "citrine"; // default
}

// ─── Expression adjustment ────────────────────────────────────────────────────

function expressionAdjustment(expression: ExpressionType): string {
  switch (expression) {
    case "sad":
      return "The subject's expression in the output must be softened to quiet warmth — a moment of peace replacing sadness.";
    case "neutral":
      return "The subject's expression in the output should suggest gentle anticipation or calm readiness.";
    case "gentle_smile":
      return "The subject's gentle smile should be preserved and slightly illuminated by the wish energy.";
    case "bright_smile":
      return "The subject's bright smile should radiate outward into the environment — the world smiling back.";
  }
}

// ─── Main export ─────────────────────────────────────────────────────────────

export function buildWishartPrompt(profile: PhotoProfile, wishText: string): string {
  const gemstone = detectGemstone(wishText);
  const gemColor = GEMSTONE_COLORS[gemstone];
  const expAdj = expressionAdjustment(profile.expression);

  const personDesc =
    profile.person_count > 0
      ? `Subject: ${profile.description}. Age impression: ${profile.age_impression}. Distinctive features: ${profile.distinctive_features}.`
      : "Subject: the person in the uploaded photo.";

  return `${DREAMTOWN_V1_SSOT}

${IDENTITY_LOCK_RULE}

${HOPE_RESTORATION_RULE}

${WORLD_RESPONSE_RULE}

${GEMSTONE_STAR_RULE}

${HAMEL_LIGHTHOUSE_RULE}

${COLOR_RULE}

${WISHART_WOW_RULE}

${POSTER_COMPOSITION_RULE}

${CANVAS_RULE}

${FACE_STYLE_RULE}

${VITALITY_RULE}

${WISH_MOMENT_SCENE}

${NEGATIVE_RULE}

---

SUBJECT PROFILE:
${personDesc}

EXPRESSION DIRECTIVE:
${expAdj}

GEMSTONE: ${gemstone} — use ${gemColor} as the dominant accent color in light, reflections, and atmosphere.

WISH TEXT (what this person is wishing for):
"${wishText}"

---

Create a WishArt portrait: a 2D hand-painted watercolor illustration of the subject from the uploaded photo, at or near the Hamel Lighthouse at DreamTown (Yeosu, Korea), at the moment their wish is released into the world. The environment responds to the wish text above. The gemstone color permeates the light and atmosphere. The image is a Korean webtoon-style hand-painted illustration, portrait orientation (1024×1536), and feels like a meaningful personal keepsake the subject would want to keep.`;
}
