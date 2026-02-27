/**
 * REDIRECT 템플릿 A/B/C 실험 승자 판정 스크립트
 *
 * 사용법:
 *   npx tsx scripts/evaluate-experiment.ts --range 14d
 *   npx tsx scripts/evaluate-experiment.ts --range 7d --minN 10
 *   npx tsx scripts/evaluate-experiment.ts --range 30d --json
 *
 * 옵션:
 *   --range   7d | 14d | 30d (default: 14d)
 *   --minN    최소 표본 수 (default: 30)
 *   --json    CI/자동화용 JSON 출력
 */
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

const TEMPLATES = ["A_WARM", "B_SPECIFIC", "C_GUIDE"] as const;

function parseArgs() {
  const args = process.argv.slice(2);
  let range = "14d";
  let minN = 30;
  let json = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--range" && args[i + 1]) { range = args[++i]; }
    if (args[i] === "--minN" && args[i + 1]) { minN = parseInt(args[++i], 10); }
    if (args[i] === "--json") { json = true; }
  }

  const days = range === "7d" ? 7 : range === "30d" ? 30 : 14;
  return { days, range: `${days}d`, minN, json };
}

function round(n: number, d = 4): number {
  const f = Math.pow(10, d);
  return Math.round(n * f) / f;
}

type TemplateResult = {
  templateType: string;
  redirectCount: number;
  resubmitCount: number;
  resubmitRate: number;
  approvalCount: number;
  approvalConversionRate: number;
  disqualifyFlag: boolean;
  disqualifyReason: string | null;
};

async function main() {
  const { days, range, minN, json } = parseArgs();
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  // REDIRECT 로그 (templateType 있는 것만, period 내)
  const redirectLogs = await prisma.adminLog.findMany({
    where: {
      createdAt: { gte: since },
      action: "REDIRECT",
      templateType: { not: null },
    },
    select: { postId: true, templateType: true },
    distinct: ["postId"],
  });

  // templateType별 postId 그룹화
  const postIdsByTemplate = new Map<string, string[]>();
  for (const log of redirectLogs) {
    const tt = log.templateType!;
    const arr = postIdsByTemplate.get(tt) ?? [];
    arr.push(log.postId);
    postIdsByTemplate.set(tt, arr);
  }

  // 템플릿별 성과 집계
  const results: TemplateResult[] = [];

  for (const tt of TEMPLATES) {
    const postIds = postIdsByTemplate.get(tt) ?? [];
    const redirectCount = postIds.length;

    let resubmitCount = 0;
    let approvalCount = 0;

    if (postIds.length > 0) {
      // 재제출 = 현재 PENDING (REDIRECT 후 다시 제출됨)
      resubmitCount = await prisma.post.count({
        where: { id: { in: postIds }, status: "PENDING" },
      });
      // 승인 = 최종 APPROVED
      approvalCount = await prisma.post.count({
        where: { id: { in: postIds }, status: "APPROVED" },
      });
    }

    const resubmitRate = redirectCount > 0 ? round(resubmitCount / redirectCount) : 0;
    const approvalConversionRate = resubmitCount > 0 ? round(approvalCount / resubmitCount) : 0;

    // 탈락 판정: 재제출률 상위인데 승인전환율이 최하위 → 재제출만 높고 승인 못 받는 패턴
    let disqualifyFlag = false;
    let disqualifyReason: string | null = null;

    results.push({
      templateType: tt,
      redirectCount,
      resubmitCount,
      resubmitRate,
      approvalCount,
      approvalConversionRate,
      disqualifyFlag,
      disqualifyReason,
    });
  }

  // 탈락 판정 (전체 결과 기반)
  const withData = results.filter((r) => r.redirectCount > 0);
  if (withData.length >= 2) {
    const sortedByResub = [...withData].sort((a, b) => b.resubmitRate - a.resubmitRate);
    const sortedByApproval = [...withData].sort((a, b) => b.approvalConversionRate - a.approvalConversionRate);

    for (const r of results) {
      if (r.redirectCount === 0) continue;
      const resubRank = sortedByResub.findIndex((x) => x.templateType === r.templateType);
      const approvalRank = sortedByApproval.findIndex((x) => x.templateType === r.templateType);

      // 재제출 1위인데 승인 최하위 → 탈락
      if (resubRank === 0 && approvalRank === sortedByApproval.length - 1 && withData.length >= 2) {
        r.disqualifyFlag = true;
        r.disqualifyReason = "재제출률 상위이나 승인전환율 최하위";
      }
    }
  }

  // 승자 판정
  const eligible = results.filter((r) => r.redirectCount >= minN && !r.disqualifyFlag);
  const winner = eligible.length > 0
    ? eligible.sort((a, b) => b.approvalConversionRate - a.approvalConversionRate)[0]
    : null;

  const totalRedirects = redirectLogs.length;
  const allMeetMinN = results.every((r) => r.redirectCount >= minN);

  // 운영자 편향 분석
  const adminLogs = await prisma.adminLog.findMany({
    where: {
      createdAt: { gte: since },
      action: "REDIRECT",
      templateType: { not: null },
    },
    select: {
      adminId: true,
      templateType: true,
      admin: { select: { nickname: true } },
    },
  });

  const adminMap = new Map<string, { nickname: string; counts: Record<string, number>; total: number }>();
  for (const log of adminLogs) {
    let entry = adminMap.get(log.adminId);
    if (!entry) {
      entry = { nickname: log.admin.nickname, counts: {}, total: 0 };
      adminMap.set(log.adminId, entry);
    }
    entry.counts[log.templateType!] = (entry.counts[log.templateType!] ?? 0) + 1;
    entry.total++;
  }

  const adminBias = Array.from(adminMap.entries()).map(([adminId, data]) => {
    const dist = TEMPLATES.map((tt) => ({
      templateType: tt,
      count: data.counts[tt] ?? 0,
      ratio: data.total > 0 ? round((data.counts[tt] ?? 0) / data.total) : 0,
    }));
    const maxRatio = Math.max(...dist.map((d) => d.ratio));
    return {
      adminId: adminId.slice(0, 8),
      nickname: data.nickname,
      total: data.total,
      distribution: dist,
      biasFlag: data.total >= 6 && maxRatio > 0.5,
    };
  });

  // --- 출력 ---
  if (json) {
    console.log(JSON.stringify({
      range,
      minN,
      totalRedirects,
      allMeetMinN,
      results,
      winner: winner?.templateType ?? null,
      adminBias,
    }, null, 2));
    await prisma.$disconnect();
    return;
  }

  console.log("═══════════════════════════════════════════════════════");
  console.log("  REDIRECT 템플릿 실험 — 승자 판정 리포트");
  console.log("═══════════════════════════════════════════════════════");
  console.log(`  범위: ${range} | 최소 표본: ${minN} | 총 REDIRECT: ${totalRedirects}`);
  console.log();

  // 성과 테이블
  console.log("【템플릿 성과】");
  console.log("  Template       | n    | Resub | Resub% | Approv | Approv% | Flag");
  console.log("  ─────────────────────────────────────────────────────────────────");
  for (const r of results) {
    const flag = r.disqualifyFlag ? "DISQUALIFY" : "";
    console.log(
      `  ${r.templateType.padEnd(14)} | ${String(r.redirectCount).padStart(4)} | ${String(r.resubmitCount).padStart(5)} | ${(r.resubmitRate * 100).toFixed(1).padStart(5)}% | ${String(r.approvalCount).padStart(6)} | ${(r.approvalConversionRate * 100).toFixed(1).padStart(6)}% | ${flag}`,
    );
  }
  console.log();

  // 승자
  if (!allMeetMinN) {
    console.log(`  ⚠️  표본 부족 — 모든 템플릿이 n>=${minN}을 충족하지 않습니다.`);
    console.log("      데이터 축적을 계속하세요.");
  } else if (winner) {
    console.log(`  🏆 승자: ${winner.templateType}`);
    console.log(`     승인전환율 ${(winner.approvalConversionRate * 100).toFixed(1)}% (n=${winner.redirectCount})`);
    console.log("     → 이 템플릿을 단일 표준으로 고정하는 것을 추천합니다.");
  } else {
    console.log("  ⚠️  적격 템플릿이 없습니다. (탈락 조건 확인 필요)");
  }
  console.log();

  // 탈락
  const disqualified = results.filter((r) => r.disqualifyFlag);
  if (disqualified.length > 0) {
    console.log("【탈락 템플릿】");
    for (const d of disqualified) {
      console.log(`  ❌ ${d.templateType}: ${d.disqualifyReason}`);
    }
    console.log();
  }

  // 운영자 편향
  console.log("【운영자 편향 분석】");
  if (adminBias.length === 0) {
    console.log("  (REDIRECT 기록 없음)");
  } else {
    for (const ab of adminBias) {
      const distStr = ab.distribution.map((d) => `${d.templateType}=${d.count}(${(d.ratio * 100).toFixed(0)}%)`).join(", ");
      const flag = ab.biasFlag ? " ⚠️ BIAS" : "";
      console.log(`  ${ab.nickname} (n=${ab.total}): ${distStr}${flag}`);
    }
  }
  console.log();

  console.log("═══════════════════════════════════════════════════════");
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
