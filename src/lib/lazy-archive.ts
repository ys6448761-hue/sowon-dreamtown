import { prisma } from "./prisma";

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

/**
 * Lazy Archive: REDIRECT 상태인 글 중 3일 경과한 것을 ARCHIVED로 전환.
 * Admin 페이지 조회 시 호출 (cron 불필요).
 */
export async function lazyArchiveRedirects(): Promise<number> {
  const cutoff = new Date(Date.now() - THREE_DAYS_MS);

  const result = await prisma.post.updateMany({
    where: {
      status: "REDIRECT",
      updatedAt: { lt: cutoff },
    },
    data: { status: "ARCHIVED" },
  });

  if (result.count > 0) {
    console.log("EVENT: lazy_archive", {
      archived: result.count,
      cutoff: cutoff.toISOString(),
      timestamp: new Date().toISOString(),
    });
  }

  return result.count;
}
