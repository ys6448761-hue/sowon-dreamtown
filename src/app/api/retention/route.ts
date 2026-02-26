import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/retention - D1 리텐션 최소 측정
export async function GET() {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  const totalUsers = await prisma.user.count();

  const activeIn24h = await prisma.user.count({
    where: { lastActiveAt: { gte: oneDayAgo } },
  });

  const createdBeforeOneDayAndActiveIn24h = await prisma.user.count({
    where: {
      createdAt: { lte: oneDayAgo },
      lastActiveAt: { gte: oneDayAgo },
    },
  });

  const createdBetween24hAnd48h = await prisma.user.count({
    where: {
      createdAt: { gte: twoDaysAgo, lte: oneDayAgo },
    },
  });

  const d1Retention =
    createdBetween24hAnd48h > 0
      ? Math.round(
          (createdBeforeOneDayAndActiveIn24h / createdBetween24hAnd48h) * 100
        )
      : null;

  console.log("EVENT: retention_query", {
    totalUsers,
    activeIn24h,
    d1Retention,
    timestamp: now.toISOString(),
  });

  return NextResponse.json({
    totalUsers,
    activeIn24h,
    d1Retention: d1Retention !== null ? `${d1Retention}%` : "데이터 부족",
    measuredAt: now.toISOString(),
  });
}
