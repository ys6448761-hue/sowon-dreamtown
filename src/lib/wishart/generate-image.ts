export async function generateWishartFromPhoto(
  photoBuffer: Buffer,
  prompt: string,
  mimeType: string = "image/jpeg",
): Promise<Buffer> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not configured");

  const formData = new FormData();
  formData.append("model", "gpt-image-2");
  formData.append("prompt", prompt);
  formData.append("size", "1024x1536");
  formData.append("quality", "high");
  formData.append("response_format", "b64_json");
  formData.append("image", new Blob([photoBuffer], { type: mimeType }), "photo.jpg");

  const res = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI image edit error ${res.status}: ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  const b64 = data.data?.[0]?.b64_json;
  if (!b64) throw new Error("No image data returned from OpenAI");

  return Buffer.from(b64, "base64");
}
