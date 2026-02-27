import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

const TEMPLATES = ["A_WARM", "B_SPECIFIC", "C_GUIDE"] as const;
const TEMPLATE_REASONS: Record<string, string> = {
  A_WARM: "나눔 공간에서는 따뜻한 표현을 권장해요. 조금 다듬어서 다시 올려주시면 좋겠어요.",
  B_SPECIFIC: "내용을 좀 더 구체적으로 적어주시면 다른 분들이 이해하기 쉬울 거예요. 수정 후 다시 제출해주세요.",
  C_GUIDE: "커뮤니티 가이드에 맞게 일부 표현을 수정해주세요. 수정 후 다시 올려주시면 검토할게요.",
};

async function main() {
  const admin = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
  if (!admin) { console.error("유저 없음"); process.exit(1); }

  console.log(`Admin: ${admin.nickname} (${admin.id})`);

  const pending = await prisma.post.findMany({ where: { status: "PENDING" } });
  console.log(`PENDING 글: ${pending.length}개\n`);

  if (pending.length === 0) {
    console.log("검토할 PENDING 글이 없습니다.");
    await prisma.$disconnect();
    return;
  }

  // 시뮬레이션: APPROVED / REDIRECT(A→B→C 순환) / REJECTED 반복
  const cycle = ["APPROVED", "REDIRECT", "REJECTED"] as const;
  let templateIdx = 0;

  for (let i = 0; i < pending.length; i++) {
    const post = pending[i];
    const action = cycle[i % cycle.length];

    const isRedirect = action === "REDIRECT";
    const templateType = isRedirect ? TEMPLATES[templateIdx % TEMPLATES.length] : null;
    const reason = templateType ? TEMPLATE_REASONS[templateType] : null;
    if (isRedirect) templateIdx++;

    await prisma.$transaction(async (tx) => {
      await tx.post.update({
        where: { id: post.id },
        data: {
          status: action === "APPROVED" ? "APPROVED" : action === "REJECTED" ? "REJECTED" : "REDIRECT",
          redirectReason: reason,
        },
      });

      await tx.adminLog.create({
        data: {
          postId: post.id,
          adminId: admin.id,
          action: action === "APPROVED" ? "APPROVED" : action === "REJECTED" ? "REJECTED" : "REDIRECT",
          redirectReason: reason,
          templateType,
        },
      });
    });

    const tag = templateType ? ` [${templateType}]` : "";
    console.log(`✅ ${post.id.slice(0, 8)} → ${action}${tag}${reason ? ` (${reason.slice(0, 25)}...)` : ""}`);
  }

  console.log(`\n🎯 시뮬레이션 완료 (${pending.length}건). run-metrics.ts로 KPI를 확인하세요.`);
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
