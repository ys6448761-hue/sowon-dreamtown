import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { sendSlackAlerts } from "@/lib/slack";
import { TEMPLATE_TYPES } from "@/lib/redirect-templates";

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

  // --- Template Performance (A/B/C별 REDIRECT → RESUBMIT 전환율) ---
  const redirectLogs = await prisma.adminLog.findMany({
    where: { createdAt: { gte: since }, action: "REDIRECT", templateType: { not: null } },
    select: { postId: true, templateType: true },
    distinct: ["postId"],
  });

  // postIds를 templateType별로 그룹화
  const postIdsByTemplate = new Map<string, string[]>();
  for (const log of redirectLogs) {
    const tt = log.templateType!;
    const arr = postIdsByTemplate.get(tt) ?? [];
    arr.push(log.postId);
    postIdsByTemplate.set(tt, arr);
  }

  const templatePerformance = await Promise.all(
    TEMPLATE_TYPES.map(async (tt) => {
      const postIds = postIdsByTemplate.get(tt) ?? [];
      const redirectCount = postIds.length;
      let resubmitCount = 0;
      let approvalCount = 0;

      if (postIds.length > 0) {
        // 재제출 = REDIRECT 후 현재 PENDING (재제출 대기 중)
        resubmitCount = await prisma.post.count({
          where: { id: { in: postIds }, status: "PENDING" },
        });
        // 승인 전환 = REDIRECT 후 최종 APPROVED
        approvalCount = await prisma.post.count({
          where: { id: { in: postIds }, status: "APPROVED" },
        });
      }

      return {
        templateType: tt,
        redirectCount,
        resubmitCount,
        approvalCount,
        resubmitConversionRate: redirectCount > 0 ? round(resubmitCount / redirectCount) : 0,
        approvalConversionRate: redirectCount > 0 ? round(approvalCount / redirectCount) : 0,
      };
    }),
  );

  // 실험 균형 검증: 총 REDIRECT 중 templateType별 비율
  const totalRedirects = redirectLogs.length;
  const experimentHealth = {
    totalRedirects,
    distribution: TEMPLATE_TYPES.map((tt) => ({
      templateType: tt,
      count: postIdsByTemplate.get(tt)?.length ?? 0,
      ratio: totalRedirects > 0 ? round((postIdsByTemplate.get(tt)?.length ?? 0) / totalRedirects) : 0,
    })),
    balanced: true,
  };
  // 40% 초과 편향 체크
  if (totalRedirects >= 6) {
    experimentHealth.balanced = experimentHealth.distribution.every((d) => d.ratio <= 0.4);
  }

  // --- Alerts (표본 n>=20이면 정상 발동, n<20이면 yellow 제한) ---
  const alerts: Alert[] = [];
  const lowSample = kpi.totalReviewed < 20;

  if (kpi.p90ReviewHours > 72) {
    alerts.push({ type: "HIGH_P90", severity: lowSample ? "yellow" : "red", message: `p90 검토 시간이 ${kpi.p90ReviewHours}h로 72h를 초과했습니다.${lowSample ? " (n<20 표본 주의)" : ""}` });
  } else if (kpi.p90ReviewHours > 24) {
    alerts.push({ type: "WARN_P90", severity: "yellow", message: `p90 검토 시간이 ${kpi.p90ReviewHours}h입니다. (목표: 24h 이내)` });
  }

  if (pendingCount >= 20) {
    alerts.push({ type: "QUEUE_BACKLOG", severity: "red", message: `대기 큐에 ${pendingCount}개 글이 적체되어 있습니다.` });
  } else if (pendingCount >= 10) {
    alerts.push({ type: "QUEUE_WARN", severity: "yellow", message: `대기 큐 ${pendingCount}개. 검토 필요.` });
  }

  if (kpi.rejectionRate > 0.3) {
    alerts.push({ type: "HIGH_REJECTION", severity: lowSample ? "yellow" : "yellow", message: `거절률 ${(kpi.rejectionRate * 100).toFixed(0)}%가 30% 임계치를 초과했습니다.${lowSample ? " (n<20 표본 주의)" : ""}` });
  }

  if (oldestPendingHours && oldestPendingHours > 48) {
    alerts.push({ type: "STALE_PENDING", severity: "red", message: `${oldestPendingHours}h 이상 대기 중인 글이 있습니다.` });
  }

  if (!experimentHealth.balanced) {
    const skewed = experimentHealth.distribution.find((d) => d.ratio > 0.4);
    if (skewed) {
      alerts.push({ type: "EXPERIMENT_SKEW", severity: "yellow", message: `템플릿 ${skewed.templateType} 비율 ${(skewed.ratio * 100).toFixed(0)}% — 균등 배분 기대치(33%) 이탈` });
    }
  }

  // severity 정렬: red first
  alerts.sort((a, b) => (a.severity === "red" ? -1 : 1) - (b.severity === "red" ? -1 : 1));

  // Slack 알람 전송 (RED/STALE_PENDING만 즉시, 비동기)
  if (alerts.length > 0) {
    sendSlackAlerts(alerts, range).catch(() => {});
  }

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
    templatePerformance,
    experimentHealth,
    alerts,
  });
}
