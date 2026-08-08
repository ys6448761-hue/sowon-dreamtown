import { prisma } from "@/lib/prisma";
import { uploadToR2 } from "@/lib/r2";
import { interpretPhoto } from "./interpret-photo";
import { buildWishartPrompt } from "./build-prompt";
import { generateWishartFromPhoto } from "./generate-image";

export async function runWishartGeneration(
  starId: string,
  photoBuffer: Buffer,
  wishText: string,
  mimeType: string,
): Promise<void> {
  try {
    await prisma.dtStar.update({
      where: { id: starId },
      data: { wishImageStatus: "generating" },
    });

    const profile = await interpretPhoto(photoBuffer, mimeType);
    const prompt = buildWishartPrompt(profile, wishText);
    const pngBuffer = await generateWishartFromPhoto(photoBuffer, prompt, mimeType);

    const r2Key = `wishart/${starId}/wish_image.png`;
    await uploadToR2(r2Key, pngBuffer, "image/png");

    await prisma.dtStar.update({
      where: { id: starId },
      data: { wishImageUrl: r2Key, wishImageStatus: "ready" },
    });
  } catch (err) {
    console.error(`[wishart] generation failed for star ${starId}:`, err instanceof Error ? err.message : err);
    await prisma.dtStar.update({
      where: { id: starId },
      data: { wishImageStatus: "failed" },
    }).catch(() => {});
  }
}
