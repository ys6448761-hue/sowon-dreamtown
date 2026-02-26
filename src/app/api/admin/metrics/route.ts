import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";

type Alert = { type: string; message: string };

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// GET /api/admin/metrics?range=7d|30d
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin(session.user.name)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const rangeParam = request.nextUrl.searchParams.get("range") ?? "7d";
  const days = rangeParam === "30d" ? 30 : 7;
  const range = days === 30 ? "30d" : "7d";

  const now = new Date();
  const since = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  // 기간 내 AdminLog 전체 조회 (검토 행위)
  const logs = await prisma.adminLog.findMany({
    where: {
      createdAt: { gte: since },
      action: { in: ["APPROVED", "REDIRECT", "REJECTED"] },
    },
    orderBy: { createdAt: "asc" },
    select: {
      action: true,
      createdAt: true,
      post: { select: { createdAt: true } },
    },
  });

  // --- KPI 계산 ---
  const approved = logs.filter((l) => l.action === "APPROVED").length;
  const redirected = logs.filter((l) => l.action === "REDIRECT").length;
  const rejected = logs.filter((l) => l.action === "REJECTED").length;
  const totalReviewed = approved + redirected + rejected;

  const approvalRate = totalReviewed > 0 ? round(approved / totalReviewed) : 0;
  const redirectRate = totalReviewed > 0 ? round(redirected / totalReviewed) : 0;
  const rejectionRate = totalReviewed > 0 ? round(rejected / totalReviewed) : 0;

  // 검토 시간 (시간 단위)
  const reviewHours = logs
    .map((l) => (l.createdAt.getTime() - l.post.createdAt.getTime()) / (1000 * 60 * 60))
    .filter((h) => h >= 0)
    .sort((a, b) => a - b);

  const medianReviewHours = round(percentile(reviewHours, 50));
  const p90ReviewHours = round(percentile(reviewHours, 90));

  // 재제출 전환율: 기간 내 REDIRECT 중 다시 PENDING(재제출)된 비율
  const redirectPostIds = logs
    .filter((l) => l.action === "REDIRECT")
    .map((l) => l.post)
    .filter(Boolean);

  let resubmitConversionRate = 0;
  if (redirected > 0) {
    // REDIRECT 된 post 중 현재 PENDING인 것 (= 재제출함)
    const redirectedPostLogs = await prisma.adminLog.findMany({
      where: {
        createdAt: { gte: since },
        action: "REDIRECT",
      },
      select: { postId: true },
      distinct: ["postId"],
    });
    const redirectedIds = redirectedPostLogs.map((l) => l.postId);

    if (redirectedIds.length > 0) {
      const resubmitted = await prisma.post.count({
        where: {
          id: { in: redirectedIds },
          status: "PENDING",
        },
      });
      resubmitConversionRate = round(resubmitted / redirectedIds.length);
    }
  }

  // --- Trend: 일별 집계 ---
  const dailyMap: Record<string, { approved: number; redirected: number; rejected: number; hours: number[] }> = {};

  // 날짜 범위 초기화
  for (let i = 0; i < days; i++) {
    const d = new Date(since.getTime() + i * 24 * 60 * 60 * 1000);
    dailyMap[toDateStr(d)] = { approved: 0, redirected: 0, rejected: 0, hours: [] };
  }

  for (const log of logs) {
    const dateKey = toDateStr(log.createdAt);
    if (!dailyMap[dateKey]) dailyMap[dateKey] = { approved: 0, redirected: 0, rejected: 0, hours: [] };
    const entry = dailyMap[dateKey];

    if (log.action === "APPROVED") entry.approved++;
    if (log.action === "REDIRECT") entry.redirected++;
    if (log.action === "REJECTED") entry.rejected++;

    const h = (log.createdAt.getTime() - log.post.createdAt.getTime()) / (1000 * 60 * 60);
    if (h >= 0) entry.hours.push(h);
  }

  const dates = Object.keys(dailyMap).sort();

  const dailyReviewCounts = dates.map((date) => ({
    date,
    approved: dailyMap[date].approved,
    redirected: dailyMap[date].redirected,
    rejected: dailyMap[date].rejected,
  }));

  const dailyReviewTime = dates.map((date) => {
    const sorted = dailyMap[date].hours.sort((a, b) => a - b);
    return {
      date,
      p50: sorted.length > 0 ? round(percentile(sorted, 50)) : null,
      p90: sorted.length > 0 ? round(percentile(sorted, 90)) : null,
    };
  });

  // --- Alerts ---
  const alerts: Alert[] = [];

  if (p90ReviewHours > 72) {
    alerts.push({ type: "HIGH_P90", message: "p90 review time exceeded 72h" });
  }
  if (p90ReviewHours > 24 && p90ReviewHours <= 72) {
    alerts.push({ type: "WARN_P90", message: `p90 review time is ${p90ReviewHours}h (target: <24h)` });
  }

  const pendingCount = await prisma.post.count({ where: { status: "PENDING" } });
  if (pendingCount >= 20) {
    alerts.push({ type: "QUEUE_BACKLOG", message: `${pendingCount} posts waiting in PENDING queue` });
  }

  if (rejectionRate > 0.3) {
    alerts.push({ type: "HIGH_REJECTION", message: `rejection rate ${(rejectionRate * 100).toFixed(0)}% exceeds 30% threshold` });
  }

  return NextResponse.json({
    range,
    kpi: {
      approvalRate,
      redirectRate,
      rejectionRate,
      medianReviewHours,
      p90ReviewHours,
      resubmitConversionRate,
    },
    trend: {
      dailyReviewCounts,
      dailyReviewTime,
    },
    alerts,
  });
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
