import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Admin 유저 찾기
  const admin = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
  if (!admin) { console.error("유저 없음"); process.exit(1); }

  console.log(`Admin: ${admin.nickname} (${admin.id})`);

  // PENDING 글 조회
  const pending = await prisma.post.findMany({ where: { status: "PENDING" } });
  console.log(`PENDING 글: ${pending.length}개\n`);

  if (pending.length === 0) {
    console.log("검토할 PENDING 글이 없습니다.");
    await prisma.$disconnect();
    return;
  }

  // 시뮬레이션: 첫 번째 → APPROVED, 두 번째 → REDIRECT, 세 번째 → REJECTED
  const actions: { status: string; action: string; reason?: string }[] = [
    { status: "APPROVED", action: "APPROVED" },
    { status: "REDIRECT", action: "REDIRECT", reason: "나눔 공간에서는 따뜻한 표현을 권장해요. 조금 다듬어주세요." },
    { status: "REJECTED", action: "REJECTED" },
  ];

  for (let i = 0; i < Math.min(pending.length, actions.length); i++) {
    const post = pending[i];
    const act = actions[i];

    await prisma.$transaction(async (tx) => {
      await tx.post.update({
        where: { id: post.id },
        data: {
          status: act.status,
          redirectReason: act.reason ?? null,
        },
      });

      await tx.adminLog.create({
        data: {
          postId: post.id,
          adminId: admin.id,
          action: act.action,
          redirectReason: act.reason ?? null,
        },
      });
    });

    console.log(`✅ ${post.id.slice(0, 8)} → ${act.status}${act.reason ? ` (사유: ${act.reason.slice(0, 30)}...)` : ""}`);
  }

  console.log("\n🎯 시뮬레이션 완료. run-metrics.ts로 KPI를 확인하세요.");
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
