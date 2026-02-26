import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

async function main() {
  const now = new Date();
  const since7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  console.log("═══════════════════════════════════════════");
  console.log("📊 운영 메트릭스 수동 집계 (dev DB)");
  console.log("═══════════════════════════════════════════");
  console.log(`기준 시각: ${now.toISOString()}`);
  console.log(`범위: 최근 7일 (${since7d.toISOString().slice(0, 10)} ~)`);
  console.log();

  // 1. 전체 글 상태별 분포
  const allPosts = await prisma.post.findMany({
    select: { id: true, status: true, content: true, createdAt: true, redirectReason: true },
  });
  const byStatus: Record<string, number> = {};
  for (const p of allPosts) byStatus[p.status] = (byStatus[p.status] ?? 0) + 1;

  console.log("【1. 상태별 글 분포】");
  for (const [status, count] of Object.entries(byStatus)) {
    console.log(`  ${status}: ${count}개`);
  }
  console.log(`  총: ${allPosts.length}개`);
  console.log();

  // 2. AdminLog 분석
  const logs = await prisma.adminLog.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      admin: { select: { nickname: true } },
      post: { select: { createdAt: true, content: true } },
    },
  });

  console.log("【2. AdminLog 이력】");
  console.log(`  총 로그: ${logs.length}건`);
  if (logs.length > 0) {
    for (const log of logs) {
      const reviewH = ((log.createdAt.getTime() - log.post.createdAt.getTime()) / (1000 * 60 * 60)).toFixed(1);
      console.log(`  ${log.action} | by ${log.admin.nickname} | ${reviewH}h | ${log.createdAt.toISOString().slice(0, 16)}`);
      if (log.redirectReason) console.log(`    └ 사유: ${log.redirectReason}`);
    }
  } else {
    console.log("  (아직 검토 기록 없음)");
  }
  console.log();

  // 3. KPI 계산
  const approved = logs.filter(l => l.action === "APPROVED").length;
  const redirected = logs.filter(l => l.action === "REDIRECT").length;
  const rejected = logs.filter(l => l.action === "REJECTED").length;
  const totalReviewed = approved + redirected + rejected;

  console.log("【3. KPI 6개】");
  if (totalReviewed > 0) {
    console.log(`  approvalRate:  ${(approved / totalReviewed * 100).toFixed(1)}%`);
    console.log(`  redirectRate:  ${(redirected / totalReviewed * 100).toFixed(1)}%`);
    console.log(`  rejectionRate: ${(rejected / totalReviewed * 100).toFixed(1)}%`);

    const hours = logs
      .map(l => (l.createdAt.getTime() - l.post.createdAt.getTime()) / (1000 * 60 * 60))
      .filter(h => h >= 0)
      .sort((a, b) => a - b);

    console.log(`  medianReviewH: ${percentile(hours, 50).toFixed(1)}h`);
    console.log(`  p90ReviewH:    ${percentile(hours, 90).toFixed(1)}h`);
  } else {
    console.log("  (검토 데이터 없음 — 아직 Admin 검토 미수행)");
  }

  // 재제출
  const resubmitPending = await prisma.post.count({
    where: { status: "PENDING", adminLogs: { some: { action: "REDIRECT" } } },
  });
  console.log(`  resubmitConv:  ${redirected > 0 ? (resubmitPending / redirected * 100).toFixed(1) + "%" : "N/A"}`);
  console.log();

  // 4. 대기 큐
  const pendingPosts = allPosts.filter(p => p.status === "PENDING");
  console.log("【4. 대기 큐 (PENDING)】");
  console.log(`  수: ${pendingPosts.length}개`);
  if (pendingPosts.length > 0) {
    const oldest = pendingPosts.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[0];
    const waitH = ((now.getTime() - oldest.createdAt.getTime()) / (1000 * 60 * 60)).toFixed(1);
    console.log(`  최오래 대기: ${waitH}h`);
    console.log(`  내용들:`);
    for (const p of pendingPosts) {
      console.log(`    - [${p.id.slice(0, 8)}] ${p.content.slice(0, 40)}...`);
    }
  }
  console.log();

  // 5. 알람 체크
  console.log("【5. 알람 체크】");
  const hours = logs
    .map(l => (l.createdAt.getTime() - l.post.createdAt.getTime()) / (1000 * 60 * 60))
    .filter(h => h >= 0)
    .sort((a, b) => a - b);
  const p90 = hours.length > 0 ? percentile(hours, 90) : 0;

  if (p90 > 72) console.log("  🔴 HIGH_P90: p90 review time > 72h");
  else if (p90 > 24) console.log(`  🟡 WARN_P90: p90 = ${p90.toFixed(1)}h (target: <24h)`);
  else console.log("  ✅ p90 정상");

  if (pendingPosts.length >= 20) console.log(`  🟡 QUEUE_BACKLOG: ${pendingPosts.length}개 대기`);
  else console.log(`  ✅ 큐 정상 (${pendingPosts.length}개)`);

  if (totalReviewed > 0 && rejected / totalReviewed > 0.3) console.log("  🟡 HIGH_REJECTION: 거절률 > 30%");
  else console.log("  ✅ 거절률 정상");

  console.log();
  console.log("═══════════════════════════════════════════");
  console.log("📋 진단 요약");
  console.log("═══════════════════════════════════════════");

  if (totalReviewed === 0) {
    console.log("⚠️  아직 Admin 검토가 1건도 없습니다.");
    console.log("   → /admin/posts에서 PENDING 글을 검토해주세요.");
    console.log("   → 검토 후 다시 이 스크립트를 돌리면 KPI가 계산됩니다.");
  } else {
    console.log("✅ 메트릭스 정상 수집 가능 상태");
  }

  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
