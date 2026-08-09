import type { ExpressionType, PhotoProfile } from "./types";

// ─── SSOT Rules ───────────────────────────────────────────────────────────────

const DREAMTOWN_V1_SSOT = `DREAMTOWN V1 SSOT:
DreamTown is a real place on Earth — Yeosu, South Korea.
DreamTown's five Origin locations are all real places in Yeosu:
  - Hamel Lighthouse (하멜등대): red cylindrical lighthouse on a harbor breakwater
  - Odongdo Island (오동도): camellia island connected by a sea walkway
  - Yeosu Expo Station (여수엑스포역): modern station opening onto the harbor
  - Yeosu Maritime Cable Car (여수해상케이블카): gondolas suspended over the sea
  - Yi Sun-sin Plaza (이순신광장): harbor promenade at the heart of Yeosu
All images must be grounded in this physical reality.
No fantasy planets, no floating islands, no impossible architecture.`;

const IDENTITY_LOCK_RULE = `IDENTITY LOCK RULE (HIGHEST PRIORITY):
Every person in the uploaded photo must remain immediately recognizable as themselves.
Preserve exactly:
- facial structure and bone proportions
- eye shape and placement
- nose shape
- jaw and chin structure
- hairstyle, hairline, and hair color
- glasses or any accessories
- skin tone family (do not lighten, darken, or smooth excessively)
- number of people and their relative positioning to each other
- main colors and patterns of clothing
Do NOT replace, idealize, anonymize, or redesign any person's identity.
Do NOT apply V-shaped jaw, enlarged eyes, or generic attractive face.
The viewer must immediately say "that's me" — not "that looks like someone like me."`;

const HOPE_RESTORATION_RULE = `HOPE RESTORATION RULE:
Show the happiness that already exists in the people — slightly more open and at ease.
Quiet genuine happiness: mouth corners naturally raised, eyes softly crinkled,
cheeks gently lifted, relaxed facial muscles, warm natural gaze.
Do NOT force a larger smile than the person naturally has.
Do NOT show exaggerated toothy grin, forced smile, or commercial advertising smile.
The WishArt is a moment of hope — not sorrow, and not a performance.
Goal: "This is me — on the day I was most genuinely happy."`;

const WORLD_RESPONSE_RULE = `WORLD RESPONSE RULE:
The environment around the subject must visually "respond" to the wish text.
Wish-related imagery (symbols, light, colors, textures) should appear in the background or atmosphere.
The world is celebrating or cradling the wish — not ignoring it.`;

const GEMSTONE_STAR_RULE = `GEMSTONE STAR RULE:
Each DreamTown visitor is associated with a gemstone star:
Citrine (황수정), Sapphire (사파이어), Emerald (에메랄드), Ruby (루비), Diamond (다이아몬드).
The gemstone's color and luminosity must appear in the image — in light, reflections, or ambient glow.
Do NOT place a literal gemstone in the image unless it naturally fits. Use color and light instead.`;

const DREAMTOWN_VISUAL_RULE = `DREAMTOWN VISUAL SIGNATURE RULE:
The image must carry DreamTown's emotional visual signature — not generic tourism photography.
Required: at least 3 of the following atmospheric elements must be present:
- watercolor flowers blooming in the background or foreground
- emotional sky: golden hour, twilight, soft dawn, or star-lit evening
- Yeosu sea light: reflected golden or blue watercolor shimmer on the water
- warm atmospheric haze: soft mist or light diffusion over the harbor
- painterly Yeosu landscape: hills, sea, islands rendered in soft layered watercolor washes
These elements form a single emotional world together — not decorative props added on top.
The result should feel like a DreamTown painting, not a travel brochure photo.`;

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
Leave breathing room at the top for atmosphere; the subject's face must be large enough
for immediate identity recognition — roughly the upper-middle third of the frame.`;

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
Subtle light effects (golden hour glow, soft bokeh, watercolor light diffusion) are appropriate.`;

const NEGATIVE_RULE = `NEGATIVE RULE (what to avoid):
- Do NOT add text, logos, watermarks, QR codes, or explanatory text of any kind.
- Do NOT show violence, fear, or distress.
- Do NOT alter the subject's race, gender, or age significantly.
- Do NOT render photorealistic portrait, cinematic photo, 3D render, or CGI face.
- Do NOT create plastic skin, hyperreal skin, or beauty-filter face.
- Do NOT use Pixar-like face, game character face, or sharp anime proportions.
- Do NOT apply V-shaped jaw or artificially enlarged eyes.
- Do NOT replace, redesign, or idealize the subject's facial identity.
- Do NOT show exaggerated toothy grin, forced smile, or commercial advertising smile.
- Do NOT show impossible physics (floating people, etc.) unless the wish text explicitly calls for it.
- Do NOT make the background a generic studio backdrop or plain gradient.
- Do NOT compose as a tourism poster — no location name banners.
- Do NOT add floating lanterns, glitter explosions, or fantasy magic particle effects.
- Do NOT show multiple magical stars, star seeds (별씨앗), or star workshop (별공방) symbols.
- Do NOT show a white lighthouse, European lighthouse, or hilltop lighthouse.
- Do NOT show generic European scenery that is not Yeosu.`;

// ─── Location detection ───────────────────────────────────────────────────────

type LocationType = "healing" | "new_beginning" | "courage" | "wisdom" | "gratitude";

const LOCATION_KEYWORDS: Record<LocationType, string[]> = {
  healing:       ["치유", "휴식", "평안", "마음", "위로", "쉬고", "쉬다", "평화", "안정", "힐링", "위안", "편안"],
  new_beginning: ["시작", "변화", "도전", "새출발", "새로운", "출발", "도약", "기회", "모험", "첫"],
  courage:       ["용기", "성취", "전진", "자신감", "이겨", "극복", "강해", "할 수 있", "성공", "도전", "이기"],
  gratitude:     ["가족", "사랑", "감사", "관계", "함께", "부모", "자녀", "아이", "소중", "고마", "행복"],
  wisdom:        ["방향", "고민", "지혜", "선택", "마음정리", "결정", "길", "답", "깨달음", "생각"],
};

const LOCATION_RULES: Record<LocationType, string> = {
  healing: `LOCATION — ODONGDO ISLAND (오동도), Yeosu, Korea:
A small island connected to the mainland by a 768-meter wooden walkway over the sea.
Famous for its dense camellia forest and a white lighthouse at the island's tip.
Key visual elements: wooden sea-walkway, camellia blossoms (red and pink), calm sheltered cove,
soft morning or sunset light filtering through camellia trees.
The atmosphere is quiet, healing, and intimately natural.
Paint in DreamTown watercolor style: drifting camellia petals, reflected light on the walkway water,
warm gentle sunlight diffused through the trees. Gemstone color in the petal light.`,

  new_beginning: `LOCATION — YEOSU EXPO STATION (여수엑스포역), Yeosu, Korea:
A modern station with a sweeping curved roof, opening directly toward Yeosu harbor.
The station represents the gateway to a new journey — arrival and departure in one place.
Key visual elements: curved modern roof forms, open sky, harbor visible beyond the platform,
light streaming through glass and steel, sense of a journey about to begin.
The atmosphere is hopeful, forward-looking, full of new possibility.
Paint in DreamTown watercolor style: fresh morning light, open sky washes of color,
architectural lines softened into watercolor edges. Gemstone color in the sky light.`,

  courage: `LOCATION — YEOSU MARITIME CABLE CAR (여수해상케이블카), Yeosu, Korea:
Cable car gondolas suspended over the open sea between Dolsan Island and the Yeosu mainland.
The cable car experience is about height, wind, and the courage to cross above the sea.
Key visual elements: cable car gondola, aerial perspective over Yeosu harbor,
deep blue sea below, distant islands, cable lines receding into the horizon.
The atmosphere is exhilarating, expansive, courageous.
Paint in DreamTown watercolor style: deep blue sea with watercolor shimmer,
soft aerial haze, wind-swept watercolor sky. Gemstone color in the sea reflections.`,

  wisdom: `LOCATION — HAMEL LIGHTHOUSE (하멜등대), DreamTown, Yeosu, Korea:
A RED cylindrical lighthouse standing on a harbor breakwater visibly connected to the land.
Appearance: red cylindrical body, white lantern room at the top.
Key visual elements: red lighthouse, harbor breakwater, deep blue Yeosu sea,
distant cable car lights where composition permits.
If text appears naturally: vertical "하멜등대" Korean signage on the lighthouse body.
The atmosphere is reflective, directional — a moment of clarity at the edge of the sea.
Paint in DreamTown watercolor style: deep harbor blues, red lighthouse as warm anchor,
watercolor light on the breakwater stones. Gemstone color in the harbor light.
Do NOT show: white lighthouse, European lighthouse, hilltop lighthouse, floating lighthouse.`,

  gratitude: `LOCATION — YI SUN-SIN PLAZA (이순신광장), Yeosu, Korea:
A harbor-front promenade plaza in the heart of Yeosu, facing the open sea.
The plaza is a place of gathering — where people celebrate relationships and the sea.
Key visual elements: harbor promenade, Yeosu bay, warm evening or golden hour light,
sense of togetherness, gentle sea breeze, the Admiral Yi Sun-sin statue as a distant silhouette.
The atmosphere is warm, grateful, and celebratory of bonds between people.
Paint in DreamTown watercolor style: golden sunset over the harbor, soft sea reflections,
warm gathering light. Gemstone color in the sunset glow on the water.`,
};

const LOCATION_NAMES: Record<LocationType, string> = {
  healing:       "Odongdo Island (오동도), Yeosu",
  new_beginning: "Yeosu Expo Station (여수엑스포역)",
  courage:       "Yeosu Maritime Cable Car (여수해상케이블카)",
  wisdom:        "Hamel Lighthouse (하멜등대), DreamTown, Yeosu",
  gratitude:     "Yi Sun-sin Plaza (이순신광장), Yeosu",
};

function detectLocation(wishText: string): LocationType {
  const lower = wishText.toLowerCase();
  // gratitude checked first — family/love keywords are strong signals
  for (const type of ["gratitude", "healing", "new_beginning", "courage", "wisdom"] as LocationType[]) {
    if (LOCATION_KEYWORDS[type].some((kw) => lower.includes(kw))) {
      return type;
    }
  }
  return "wisdom"; // default: Hamel Lighthouse
}

// ─── Gemstone detection ───────────────────────────────────────────────────────

const GEMSTONE_KEYWORDS: Record<string, string[]> = {
  citrine:  ["황수정", "시트린", "노랑", "노란", "gold", "golden", "황금"],
  sapphire: ["사파이어", "파랑", "파란", "blue", "하늘", "바다"],
  emerald:  ["에메랄드", "초록", "녹색", "green", "숲", "자연"],
  ruby:     ["루비", "빨강", "붉은", "red", "열정", "rose"],
  diamond:  ["다이아몬드", "다이아", "투명", "white", "빛", "반짝"],
};

const GEMSTONE_COLORS: Record<string, string> = {
  citrine:  "warm golden yellow (citrine)",
  sapphire: "deep royal blue (sapphire)",
  emerald:  "vivid forest green (emerald)",
  ruby:     "rich crimson red (ruby)",
  diamond:  "brilliant white and prismatic light (diamond)",
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
  const locationType = detectLocation(wishText);
  const locationRule = LOCATION_RULES[locationType];
  const locationName = LOCATION_NAMES[locationType];

  const personDesc =
    profile.person_count > 0
      ? `Subject: ${profile.description}. Age impression: ${profile.age_impression}. Distinctive features: ${profile.distinctive_features}.`
      : "Subject: the person in the uploaded photo.";

  return `${DREAMTOWN_V1_SSOT}

${IDENTITY_LOCK_RULE}

${HOPE_RESTORATION_RULE}

${WORLD_RESPONSE_RULE}

${GEMSTONE_STAR_RULE}

${locationRule}

${DREAMTOWN_VISUAL_RULE}

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

LOCATION SELECTED: ${locationName}
(chosen based on the emotional meaning of the wish above)

---

Create a WishArt portrait: a 2D hand-painted watercolor illustration of the subject from the uploaded photo, at ${locationName}, at the moment their wish is released into the world. The environment and atmosphere respond to the wish. The gemstone color permeates the light. The image carries DreamTown's emotional visual signature — flowers, sea light, emotional sky, painterly Yeosu landscape. Portrait orientation (1024×1536). This is a meaningful personal keepsake the subject would want to save and keep forever.`;
}
