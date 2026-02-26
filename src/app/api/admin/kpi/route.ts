import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";

// GET /api/admin/kpi — 운영 KPI 6개
export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin(session.user.name)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const now = new Date();

  // 1. 상태별 글 수
  const statusCounts = await prisma.post.groupBy({
    by: ["status"],
    _count: true,
  });
  const byStatus: Record<string, number> = {};
  for (const row of statusCounts) byStatus[row.status] = row._count;
  const totalPosts = Object.values(byStatus).reduce((a, b) => a + b, 0);

  // 2. 승인율 (APPROVED / 전체 검토 완료)
  const reviewed = (byStatus["APPROVED"] ?? 0) + (byStatus["REJECTED"] ?? 0) + (byStatus["REDIRECT"] ?? 0) + (byStatus["ARCHIVED"] ?? 0);
  const approvalRate = reviewed > 0
    ? Math.round(((byStatus["APPROVED"] ?? 0) / reviewed) * 100)
    : null;

  // 3. 평균 검토 시간 (APPROVED/REJECTED의 첫 AdminLog - Post.createdAt)
  const recentLogs = await prisma.adminLog.findMany({
    where: { action: { in: ["APPROVED", "REJECTED", "REDIRECT"] } },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      createdAt: true,
      post: { select: { createdAt: true } },
    },
  });
  let avgReviewMs = 0;
  if (recentLogs.length > 0) {
    const totalMs = recentLogs.reduce((sum, log) => {
      return sum + (log.createdAt.getTime() - log.post.createdAt.getTime());
    }, 0);
    avgReviewMs = totalMs / recentLogs.length;
  }
  const avgReviewHours = recentLogs.length > 0
    ? Math.round(avgReviewMs / (1000 * 60 * 60) * 10) / 10
    : null;

  // 4. 재제출률 (PENDING 중 이전에 REDIRECT/ARCHIVED였던 것)
  const resubmitLogs = await prisma.adminLog.count({
    where: { action: { in: ["REDIRECT"] } },
  });
  const pendingAfterRedirect = await prisma.post.count({
    where: {
      status: "PENDING",
      adminLogs: { some: { action: "REDIRECT" } },
    },
  });
  const resubmitRate = resubmitLogs > 0
    ? Math.round((pendingAfterRedirect / resubmitLogs) * 100)
    : null;

  // 5. 대기 큐 크기 + 최오래 대기
  const pendingCount = byStatus["PENDING"] ?? 0;
  const oldestPending = pendingCount > 0
    ? await prisma.post.findFirst({
        where: { status: "PENDING" },
        orderBy: { createdAt: "asc" },
        select: { createdAt: true },
      })
    : null;
  const oldestPendingHours = oldestPending
    ? Math.round((now.getTime() - oldestPending.createdAt.getTime()) / (1000 * 60 * 60) * 10) / 10
    : null;

  // 6. 오늘 작성 수
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayPosts = await prisma.post.count({
    where: { createdAt: { gte: todayStart } },
  });

  return NextResponse.json({
    measuredAt: now.toISOString(),
    kpi: {
      byStatus,
      totalPosts,
      approvalRate: approvalRate !== null ? `${approvalRate}%` : "데이터 부족",
      avgReviewHours: avgReviewHours !== null ? `${avgReviewHours}h` : "데이터 부족",
      resubmitRate: resubmitRate !== null ? `${resubmitRate}%` : "데이터 부족",
      pendingQueue: {
        count: pendingCount,
        oldestWaitHours: oldestPendingHours,
      },
      todayPosts,
    },
  });
}
