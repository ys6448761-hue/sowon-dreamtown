import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";

type Alert = { type: string; severity: "red" | "yellow"; message: string };

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

type LogRow = { action: string; createdAt: Date; post: { createdAt: Date } };

function computeKpi(logs: LogRow[]) {
  const approved = logs.filter((l) => l.action === "APPROVED").length;
  const redirected = logs.filter((l) => l.action === "REDIRECT").length;
  const rejected = logs.filter((l) => l.action === "REJECTED").length;
  const total = approved + redirected + rejected;

  const reviewHours = logs
    .map((l) => (l.createdAt.getTime() - l.post.createdAt.getTime()) / (1000 * 60 * 60))
    .filter((h) => h >= 0)
    .sort((a, b) => a - b);

  return {
    totalReviewed: total,
    approvalRate: total > 0 ? round(approved / total) : 0,
    redirectRate: total > 0 ? round(redirected / total) : 0,
    rejectionRate: total > 0 ? round(rejected / total) : 0,
    medianReviewHours: round(percentile(reviewHours, 50)),
    p90ReviewHours: round(percentile(reviewHours, 90)),
  };
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
  const prevSince = new Date(since.getTime() - days * 24 * 60 * 60 * 1000);

  // 현재 기간 + 이전 기간 로그
  const allLogs = await prisma.adminLog.findMany({
    where: {
      createdAt: { gte: prevSince },
      action: { in: ["APPROVED", "REDIRECT", "REJECTED"] },
    },
    orderBy: { createdAt: "asc" },
    select: {
      action: true,
      createdAt: true,
      post: { select: { createdAt: true } },
    },
  });

  const currentLogs = allLogs.filter((l) => l.createdAt >= since);
  const prevLogs = allLogs.filter((l) => l.createdAt < since);

  const kpi = computeKpi(currentLogs);
  const prevKpi = computeKpi(prevLogs);

  // 재제출 전환율
  let resubmitConversionRate = 0;
  let prevResubmitConversionRate = 0;

  const redirectedInPeriod = await prisma.adminLog.findMany({
    where: { createdAt: { gte: since }, action: "REDIRECT" },
    select: { postId: true },
    distinct: ["postId"],
  });
  if (redirectedInPeriod.length > 0) {
    const resubmitted = await prisma.post.count({
      where: { id: { in: redirectedInPeriod.map((l) => l.postId) }, status: "PENDING" },
    });
    resubmitConversionRate = round(resubmitted / redirectedInPeriod.length);
  }

  const prevRedirected = await prisma.adminLog.findMany({
    where: { createdAt: { gte: prevSince, lt: since }, action: "REDIRECT" },
    select: { postId: true },
    distinct: ["postId"],
  });
  if (prevRedirected.length > 0) {
    const prevResub = await prisma.post.count({
      where: { id: { in: prevRedirected.map((l) => l.postId) }, status: "PENDING" },
    });
    prevResubmitConversionRate = round(prevResub / prevRedirected.length);
  }

  // PENDING 큐
  const pendingCount = await prisma.post.count({ where: { status: "PENDING" } });
  const oldestPending = pendingCount > 0
    ? await prisma.post.findFirst({
        where: { status: "PENDING" },
        orderBy: { createdAt: "asc" },
        select: { createdAt: true },
      })
    : null;
  const oldestPendingHours = oldestPending
    ? round((now.getTime() - oldestPending.createdAt.getTime()) / (1000 * 60 * 60))
    : null;

  // --- Trend ---
  const dailyMap: Record<string, { approved: number; redirected: number; rejected: number; hours: number[] }> = {};
  for (let i = 0; i < days; i++) {
    const d = new Date(since.getTime() + i * 24 * 60 * 60 * 1000);
    dailyMap[toDateStr(d)] = { approved: 0, redirected: 0, rejected: 0, hours: [] };
  }

  for (const log of currentLogs) {
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

  // --- Alerts (severity 정렬: red > yellow) ---
  const alerts: Alert[] = [];

  if (kpi.p90ReviewHours > 72) {
    alerts.push({ type: "HIGH_P90", severity: "red", message: `p90 검토 시간이 ${kpi.p90ReviewHours}h로 72h를 초과했습니다.` });
  } else if (kpi.p90ReviewHours > 24) {
    alerts.push({ type: "WARN_P90", severity: "yellow", message: `p90 검토 시간이 ${kpi.p90ReviewHours}h입니다. (목표: 24h 이내)` });
  }

  if (pendingCount >= 20) {
    alerts.push({ type: "QUEUE_BACKLOG", severity: "red", message: `대기 큐에 ${pendingCount}개 글이 적체되어 있습니다.` });
  } else if (pendingCount >= 10) {
    alerts.push({ type: "QUEUE_WARN", severity: "yellow", message: `대기 큐 ${pendingCount}개. 검토 필요.` });
  }

  if (kpi.rejectionRate > 0.3) {
    alerts.push({ type: "HIGH_REJECTION", severity: "yellow", message: `거절률 ${(kpi.rejectionRate * 100).toFixed(0)}%가 30% 임계치를 초과했습니다.` });
  }

  if (oldestPendingHours && oldestPendingHours > 48) {
    alerts.push({ type: "STALE_PENDING", severity: "red", message: `${oldestPendingHours}h 이상 대기 중인 글이 있습니다.` });
  }

  // severity 정렬: red first
  alerts.sort((a, b) => (a.severity === "red" ? -1 : 1) - (b.severity === "red" ? -1 : 1));

  return NextResponse.json({
    range,
    totalReviewed: kpi.totalReviewed,
    kpi: {
      approvalRate: kpi.approvalRate,
      redirectRate: kpi.redirectRate,
      rejectionRate: kpi.rejectionRate,
      medianReviewHours: kpi.medianReviewHours,
      p90ReviewHours: kpi.p90ReviewHours,
      resubmitConversionRate,
      pendingQueue: pendingCount,
      oldestPendingHours,
    },
    prevKpi: {
      approvalRate: prevKpi.approvalRate,
      redirectRate: prevKpi.redirectRate,
      rejectionRate: prevKpi.rejectionRate,
      medianReviewHours: prevKpi.medianReviewHours,
      p90ReviewHours: prevKpi.p90ReviewHours,
      resubmitConversionRate: prevResubmitConversionRate,
    },
    trend: { dailyReviewCounts, dailyReviewTime },
    alerts,
  });
}
