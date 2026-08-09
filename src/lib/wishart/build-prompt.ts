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

const HOPE_RESTORATION_RULE = `HAPPY SELF RESTORATION RULE:
The goal is NOT a big smile or a forced expression.
The goal is to show this person as they look at their happiest and most alive —
the happiest believable version of themselves, as if captured at the best moment in their life.

Not a smile imposed from outside. The happiness that is already in them, brought forward.

Preserve the person's real expression structure first. Then apply the minimum change needed:

If already smiling in the photo:
  → Keep the actual smile pattern. Let it shine with natural warmth.
  → Change intensity: 0–10% from original.

If showing a weak or subtle smile:
  → Gently reinforce: lifted cheeks, softened eyes, natural mouth corners rising.
  → Change intensity: 10–20% from original.

If neutral expression:
  → Lift mouth corners gently. Soften the eyes. Release any held facial tension.
  → Closed-mouth gentle expression only. Do not invent or add teeth.
  → Change intensity: 20–30% from original.

If tense, tired, or guarded:
  → First restore ease: relax jaw tension, soften eyes, release held facial muscles.
  → Then add the quietest hint of warmth — mouth corners gently lifted.
  → Change intensity: 0–20% from original.

The person should look like themselves — in the happiest moment of their life.
Do NOT create a smile that was not present in the original.
Do NOT make the smile larger or more intense than what the person can naturally hold.
Do NOT apply a performance smile, commercial smile, or advertisement smile.`;

const TEETH_RULE = `TEETH RULE:
If the reference photo shows teeth naturally: preserve the original teeth pattern as-is.
If the reference photo shows a closed-mouth expression: use closed-mouth gentle smile only.
Do NOT invent a new open-mouth smile where none existed.
Do NOT show oversized toothy grin, artificially perfect teeth, or advertisement smile.
Do NOT create forced open-mouth smile or invented teeth pattern.`;

const COUPLE_EXPRESSION_RULE = `MULTI-PERSON EXPRESSION RULE:
If multiple people appear, treat each person's expression independently.
Do NOT apply the same smile, the same teeth exposure, or the same expression to all people.
Each person's expression follows their own original pattern and the rules above.
Relationship warmth is expressed through: proximity, posture, gaze direction, warm light, and atmosphere.
Do NOT homogenize the expressions across people in the image.`;

const WORLD_RESPONSE_RULE = `WORLD RESPONSE RULE:
The world carries the primary emotional weight — approximately 70–80% of the emotional expression.
The person's face carries approximately 20–30%.

This is not a canvas area ratio. It is an emotional responsibility ratio.
Do not force happiness onto the person's face.
Let the world respond to their wish instead.

Express emotion through:
- warm light falling on the scene
- emotional sky (golden hour, twilight, soft dawn)
- Yeosu sea reflecting the mood
- watercolor flowers and atmospheric color
- the selected Yeosu Origin responding to the wish energy

The person exists within the world's emotional response — the world celebrates their wish.`;

const ORIGIN_LAYER_RULE = `ORIGIN LAYER PRINCIPLE:
The real Yeosu location must remain clearly identifiable.
Preserve the location's essential visual anchors before applying DreamTown interpretation.

DreamTown light, color, atmosphere, and emotional treatment are layered onto the real place.
They must not replace, distort, or overpower the identity of the location.

Think: Real Yeosu Origin 70 / DreamTown emotional interpretation 30.

The person remains the emotional center of the image.
The Origin holds the person; it does not compete with them.`;

const DREAMTOWN_VISUAL_RULE = `DREAMTOWN VISUAL SIGNATURE RULE:
The image must carry DreamTown's emotional visual signature — not generic tourism photography.
Use 2–3 of the following atmospheric elements as needed, in harmony with the person:
- watercolor flowers (soft, present but not dominant; camellia-dominant scenery belongs to Odongdo only — non-Odongdo Origins use generic soft blooms that do not evoke camellia groves)
- emotional sky: golden hour, twilight, soft dawn, or starlit evening
- Yeosu sea light: reflected watercolor shimmer on the water
- warm atmospheric haze or light diffusion over the harbor
- painterly Yeosu landscape in soft layered watercolor washes

RESTRAINT IS REQUIRED:
Do not apply all elements at maximum saturation simultaneously.
DreamTown's signature is emotional coherence — not visual abundance.
If flowers, sky, and light all compete at full intensity, the person is lost.
Each element serves the person's emotional moment. The world supports the person.
The result should feel like one quiet, unified emotional world — genuine, not spectacular.`;

const COLOR_RULE = `COLOR RULE:
The image must have a coherent, emotionally resonant color palette.
Warm gold or soft teal may be used as accent tones.
Avoid muddy or desaturated results — the image should feel luminous and alive.
Avoid excessive golden saturation that overwhelms the faces or flattens identity.`;

const WISHART_WOW_RULE = `WISHART WOW RULE:
This image will be shown to the visitor as their personal wish portrait.
It must feel like a genuine keepsake — something they would want to save and share.
Quality, composition, and emotional resonance are the top priorities.`;

const PERSON_FIRST_RULE = `PERSON-FIRST COMPOSITION RULE:
DreamTown WishArt is NOT "a Yeosu tourist illustration with a person added."
It IS "the moment a person's wish is held by Yeosu."

Visual priority order:
1. The person — face, identity, expression
2. The warmth and relationship between people (if multiple)
3. DreamTown emotional atmosphere
4. The selected Yeosu Origin as supporting context
5. Decorative elements last

The first thing the eye must reach is the person's face — not the landmark, not the background.
The landmark must support the person, not compete with them.
Background intensity must not overpower or visually crowd the faces.
Reduce landmark visual dominance compared to a typical tourism illustration.
The Yeosu location appears as emotional context — not as the hero of the image.`;

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
The atmosphere should feel charged with quiet possibility — not mundane, not dramatic.
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
- Do NOT show artificial perfect teeth or a forced open-mouth smile that did not exist in the original.
- Do NOT apply identical smiles or identical expressions across multiple people.
- Do NOT show impossible physics (floating people, etc.) unless the wish text explicitly calls for it.
- Do NOT make the background a generic studio backdrop or plain gradient.
- Do NOT compose as a tourism poster — no location name banners.
- Do NOT let the landmark or background visually overpower the subjects' faces.
- Do NOT add floating lanterns, glitter explosions, or fantasy magic particle effects.
- Do NOT apply excessive flower density or excessive golden saturation that crowds the faces.
- Do NOT add visual clutter (sparkling particles, glowing effects) directly around the faces.
- Do NOT show multiple magical stars, star seeds (별씨앗), or star workshop (별공방) symbols.
- Do NOT show a white lighthouse, European lighthouse, or hilltop lighthouse.
- Do NOT show generic European scenery that is not Yeosu.`;

// ─── Location detection ───────────────────────────────────────────────────────

type LocationType = "healing" | "new_beginning" | "courage" | "wisdom" | "gratitude";

const LOCATION_KEYWORDS: Record<LocationType, string[]> = {
  gratitude:     ["가족", "사랑", "감사", "부모", "엄마", "아빠", "아내", "남편", "아이", "함께", "행복"],
  healing:       ["건강", "회복", "치유", "휴식", "평안", "위로", "아프", "마음편안"],
  new_beginning: ["새출발", "시작", "취업", "입학", "이직", "변화", "새로운", "출발"],
  courage:       ["용기", "도전", "합격", "시험", "성공", "성취", "해내", "자신감"],
  wisdom:        ["방향", "선택", "고민", "지혜", "결정", "마음정리", "길을 찾"],
};

const LOCATION_RULES: Record<LocationType, string> = {
  healing: `LOCATION — ODONGDO ISLAND (오동도), Yeosu, Korea:
A small island reached by a 768-meter wooden walkway over the sea.
Visual anchors:
- 768-meter wooden sea-walkway stretching over calm water
- camellia forest: dense trees with red and pink blossoms (동백꽃)
- lighthouse at the island's tip
- calm sheltered cove and shoreline
Light: soft morning or sunset light filtering through camellia trees.
Note: Camellia blossoms (동백꽃) are the identity anchor of this Origin — do not carry them into other locations.`,

  new_beginning: `LOCATION — YEOSU EXPO STATION (여수엑스포역), Yeosu, Korea:
A modern station opening directly toward Yeosu harbor — a gateway between land and sea.
Visual anchors:
- sweeping curved modern roof
- harbor and open sky visible beyond the platform
- glass and steel structure with light streaming through
- sense of a journey beginning — arrival and departure in one place
Light: fresh morning light, open sky.
Do NOT show: generic European railway station — the station must read as Yeosu coastal context.`,

  courage: `LOCATION — YEOSU MARITIME CABLE CAR (여수해상케이블카), Yeosu, Korea:
Cable car gondolas suspended over the open sea between Dolsan Island and Yeosu mainland.
Visual anchors:
- cable car gondola suspended over open sea
- aerial perspective — significant height above the water
- deep blue Yeosu sea below
- cable lines receding toward the horizon
- distant islands visible
Light: wind-swept sky, deep blue sea.
Do NOT show: generic mountain cable car or inland gondola — this must read as open Yeosu sea.`,

  wisdom: `LOCATION — HAMEL LIGHTHOUSE (하멜등대), DreamTown, Yeosu, Korea:
A RED cylindrical lighthouse standing on a harbor breakwater connected to land.
Visual anchors:
- RED cylindrical body (not white — the red color is the identity)
- white lantern room at the top
- harbor breakwater visibly connected to land — grounded, not floating
- "하멜등대" vertical Korean signage (optional, supporting — not required for identity)
Light: deep harbor blues, red lighthouse as warm anchor point.
Do NOT show: a floating lighthouse not grounded on its breakwater; do not make the lighthouse the dominant visual element over the people.`,

  gratitude: `LOCATION — YI SUN-SIN PLAZA (이순신광장), Yeosu, Korea:
A wide open harbor square at the heart of urban Yeosu, facing the sea.
Visual anchors:
- Admiral Yi Sun-sin statue: standing figure in military armor, on a base with
  turtle-ship (거북선) motifs, facing the Yeosu harbor
- the statue is identifiable — not a distant silhouette, but a recognizable armored general
- turtle ship (거북선): secondary recognizable landmark, visible when composition permits
- open stone-paved harbor square and Yeosu sea stretching to the horizon
Light: warm evening or golden hour over the harbor.
Do NOT show: generic military statue without turtle-ship context, camellia flowers
(that is Odongdo, not here), generic seaside park, European waterfront, or a monument dominating the portrait.`,
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
  // Check in order: gratitude → healing → new_beginning → courage → wisdom
  for (const type of ["gratitude", "healing", "new_beginning", "courage", "wisdom"] as LocationType[]) {
    if (LOCATION_KEYWORDS[type].some((kw) => lower.includes(kw))) {
      return type;
    }
  }
  // TODO: replace with LLM-based classifier before hotel full launch
  return "wisdom"; // temporary fallback — Hamel Lighthouse
}

// ─── Gemstone helpers (reserved for 3P — not used in current MVP prompt) ──────

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

// Reserved for 3P — not called in buildWishartPrompt()
export function detectGemstone(wishText: string): string {
  const lower = wishText.toLowerCase();
  for (const [gem, keywords] of Object.entries(GEMSTONE_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return gem;
    }
  }
  return "citrine";
}

// Reserved for 3P
export { GEMSTONE_COLORS };

// ─── Expression adjustment ────────────────────────────────────────────────────

function expressionAdjustment(expression: ExpressionType): string {
  switch (expression) {
    case "sad":
      return "The subject shows tension or sadness. Restore relaxation first: soften jaw, release facial tension, warm the eyes. Apply only a very subtle mouth-corner lift if it fits naturally. Do NOT invent a smile. Change intensity: 0–20% from original.";
    case "neutral":
      return "The subject has a neutral expression. Apply minimal change: slightly lift mouth corners, soften the eyes, relax facial muscles. Closed-mouth expression only — do NOT invent teeth. Change intensity: 20–30% from original.";
    case "gentle_smile":
      return "The subject already has a gentle smile. Preserve the exact smile pattern as-is. Illuminate it gently with the wish energy — do NOT enlarge or intensify the smile. Change intensity: 0–10% from original.";
    case "bright_smile":
      return "The subject has a bright smile. Preserve the exact original smile pattern completely. Do NOT change the smile itself. Let the world around them respond with wish energy. Change intensity: 0% from original.";
  }
}

// ─── Main export ─────────────────────────────────────────────────────────────

export function buildWishartPrompt(profile: PhotoProfile, wishText: string): string {
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

${TEETH_RULE}

${COUPLE_EXPRESSION_RULE}

${WORLD_RESPONSE_RULE}

${ORIGIN_LAYER_RULE}

${locationRule}

${PERSON_FIRST_RULE}

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

WISH TEXT (what this person is wishing for):
"${wishText}"

LOCATION SELECTED: ${locationName}
(chosen based on the emotional meaning of the wish above)

---

Create a WishArt portrait: a 2D hand-painted watercolor illustration of the subject from the uploaded photo, at ${locationName}, at the moment their wish is released into the world. The person is the center — the Yeosu location holds them. The world responds to the wish through light, atmosphere, and the emotional landscape. Portrait orientation (1024×1536). This is a meaningful personal keepsake the subject would want to save and keep forever.`;
}
