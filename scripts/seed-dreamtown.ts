/**
 * DreamTown Seed Pack v1.0 — 호텔 1호점 오픈용 공식 초기 콘텐츠
 * 실행: npm run seed:dreamtown
 * 주의: 운영 DB 실행은 별도 승인 후 1회만. 자동 배포 시 실행하지 않음.
 *
 * idempotency:
 *   - User: upsert by fixed id "dreamtown-seed-user"
 *   - Post: upsert by fixed id "dreamtown-seed-post-01" ~ "06", "dreamtown-seed-nanum-01" ~ "03"
 *   - Event: upsert by name (@unique)
 *   중복 실행 시 추가 생성 없음. 기존 데이터 수정 없음.
 */
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

const SEED_USER_ID = "dreamtown-seed-user";

const PLAZA_POSTS = [
  {
    id: "dreamtown-seed-post-01",
    content:
      "붉은 등대와 여수의 밤바다를 바라보며\n오늘 마음속에 오래 남아 있던 소원을 조용히 꺼내 보았습니다.\n그 순간도 별의 한 장면으로 기록됩니다.",
  },
  {
    id: "dreamtown-seed-post-02",
    content:
      "엑스포 바닷길에서 바람을 느끼며\n잠시 걸음을 늦추었습니다.\n숨을 고른 오늘의 마음도 하나의 Miracle입니다.",
  },
  {
    id: "dreamtown-seed-post-03",
    content:
      "여행의 마지막 밤,\n호텔 창문 밖 불빛을 바라보며 하루를 정리했습니다.\n여행은 끝나도 별의 성장은 계속됩니다.",
  },
  {
    id: "dreamtown-seed-post-04",
    content:
      "케이블카가 천천히 올라갈수록\n마음속 시야도 조금 넓어졌습니다.\n새롭게 보인 풍경이 오늘의 기적이 되었습니다.",
  },
  {
    id: "dreamtown-seed-post-05",
    content:
      "지역의 사람과 특산품에 담긴 이야기를 만나고\n여수의 기억 하나를 집으로 가져갑니다.\n좋은 소비도 여행의 Miracle이 될 수 있습니다.",
  },
  {
    id: "dreamtown-seed-post-06",
    content:
      "DreamTown은 여행에서 만난 의미 있는 순간을 기록하고\n그 경험이 하나의 별을 성장시키도록 연결합니다.\n당신이 살아낸 오늘의 기적이 당신의 별을 키웁니다.",
  },
];

const NANUM_POSTS = [
  {
    id: "dreamtown-seed-nanum-01",
    content: "오늘 받은 따뜻함을 다음 여행자에게 남깁니다.",
  },
  {
    id: "dreamtown-seed-nanum-02",
    content: "여수에서 발견한 좋은 장소 하나를 조용히 나눕니다.",
  },
  {
    id: "dreamtown-seed-nanum-03",
    content: "여행 중 마음이 지친 누군가에게 따뜻한 한마디를 남깁니다.",
  },
];

const EVENTS = [
  {
    name: "DreamTown Miracle Package",
    description:
      "호텔 체크인에서 시작해 소원을 남기고 나만의 별을 만나는 여행 경험입니다.",
  },
  {
    name: "별빛항로 안내",
    description:
      "여수의 장소를 따라 도착, 호흡, 연결, 상승, 쉼, 소원, 안식의 감정 항로를 경험합니다.",
  },
  {
    name: "하멜등대 Miracle 기록",
    description:
      "하멜등대에서 오늘의 마음과 소원을 남기고 여행의 한 장면을 별에 기록해 보세요.",
  },
];

async function main() {
  console.log("🌱 DreamTown Seed Pack v1.0 시작");

  await prisma.$transaction(
    async (tx) => {
      // 1. 공식 Seed 계정
      await tx.user.upsert({
        where: { id: SEED_USER_ID },
        create: { id: SEED_USER_ID, nickname: "DreamTown" },
        update: {},
      });
      console.log("  ✓ User: DreamTown (dreamtown-seed-user)");

      // 2. 광장 Story Posts (POST-01 ~ 06)
      for (const p of PLAZA_POSTS) {
        await tx.post.upsert({
          where: { id: p.id },
          create: {
            id: p.id,
            content: p.content,
            status: "APPROVED",
            postType: "TEXT",
            authorId: SEED_USER_ID,
          },
          update: {},
        });
        console.log(`  ✓ ${p.id}`);
      }

      // 3. 나눔 Posts (NANUM-01 ~ 03) — plaza 나눔(글) 탭 TEXT posts
      for (const n of NANUM_POSTS) {
        await tx.post.upsert({
          where: { id: n.id },
          create: {
            id: n.id,
            content: n.content,
            status: "APPROVED",
            postType: "TEXT",
            authorId: SEED_USER_ID,
          },
          update: {},
        });
        console.log(`  ✓ ${n.id}`);
      }

      // 4. Events (EVENT-01 ~ 03) — upsert by name (@unique)
      for (const e of EVENTS) {
        await tx.event.upsert({
          where: { name: e.name },
          create: { name: e.name, description: e.description, active: true },
          update: {},
        });
        console.log(`  ✓ Event: ${e.name}`);
      }
    },
    { timeout: 15000 },
  );

  console.log("\n🚀 완료");
  console.log("  광장 글: 6개 (POST-01~06)");
  console.log("  나눔 글: 3개 (NANUM-01~03)");
  console.log("  이벤트: 3개 (EVENT-01~03)");
  console.log("  필름: 제외 (thumbnailUrl Asset 없음)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
