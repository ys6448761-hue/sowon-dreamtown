/**
 * 시드 APPROVED 글 3개 생성
 * 용도: PR-16B(Admin 승인 UI) 전까지 공개 피드가 비어 보이지 않도록
 * 실행: npx tsx scripts/seed-approved-posts.ts
 */
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

const SEED_POSTS = [
  "작은 실천에서 시작하는 기적. 오늘 하루도 한 걸음 나아갔어요.",
  "오늘의 감사 한 줄: 아침에 눈을 떴을 때, 따뜻한 햇살이 반겨줬어요.",
  "힘들었지만 이렇게 바꿔봤어요. 부정적인 생각이 올 때마다, 좋았던 순간 하나를 떠올려요.",
];

async function main() {
  // 시드용 운영자 계정 찾기 (첫 번째 유저 사용)
  const admin = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
  if (!admin) {
    console.error("유저가 없습니다. 먼저 로그인하여 유저를 생성하세요.");
    process.exit(1);
  }

  console.log(`시드 작성자: ${admin.nickname} (${admin.id})`);

  for (const content of SEED_POSTS) {
    const post = await prisma.post.create({
      data: {
        content,
        status: "APPROVED",
        authorId: admin.id,
      },
    });
    console.log(`✅ 생성: ${post.id} - ${content.slice(0, 30)}...`);
  }

  console.log("\n🌱 시드 APPROVED 글 3개 생성 완료!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
