import type { PhotoProfile } from "./types";

const SYSTEM_PROMPT = `You are an image analysis assistant.
Analyze the given portrait photograph and return ONLY a JSON object with no extra text.

Required fields:
- description: a 1–2 sentence neutral description of the person's appearance
- person_count: integer (1 for a single person)
- expression: one of "sad" | "neutral" | "gentle_smile" | "bright_smile"
- age_impression: approximate age range as a string, e.g. "late 20s"
- distinctive_features: notable visual features (hair color, glasses, accessories, etc.)

If the image does not contain a clear human face, set person_count to 0 and fill other fields with empty strings.`;

export async function interpretPhoto(
  photoBuffer: Buffer,
  mimeType: string,
): Promise<PhotoProfile> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not configured");

  const base64 = photoBuffer.toString("base64");
  const dataUri = `data:${mimeType};base64,${base64}`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: dataUri, detail: "low" } },
            { type: "text", text: "Analyze this portrait." },
          ],
        },
      ],
      max_tokens: 300,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI vision error ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response from OpenAI vision");

  return JSON.parse(content) as PhotoProfile;
}
