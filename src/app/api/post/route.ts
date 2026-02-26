import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { touchLastActive } from "@/lib/activity";
import { sanitizeText } from "@/lib/sanitize";

// GET /api/post - 글 목록 조회
// ?mine=true → 본인 글 전체 (모든 status)
// 기본 → APPROVED만 (공개 피드)
export async function GET(request: NextRequest) {
  const mine = request.nextUrl.searchParams.get("mine") === "true";

  if (mine) {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const posts = await prisma.post.findMany({
      where: { authorId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, nickname: true } },
        _count: { select: { likes: true } },
      },
    });

    return NextResponse.json(posts);
  }

  const posts = await prisma.post.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, nickname: true } },
      _count: { select: { likes: true } },
    },
  });

  console.log("EVENT: plaza_post_view", {
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json(posts);
}

// POST /api/post - 글 작성 (인증 필수)
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const body = await request.json();
  const content = sanitizeText(body.content).slice(0, 5000);

  if (!content) {
    return NextResponse.json(
      { error: "content는 필수입니다." },
      { status: 400 }
    );
  }

  const authorId = session.user.id;

  const post = await prisma.post.create({
    data: { content, authorId },
    include: {
      author: { select: { id: true, nickname: true } },
    },
  });

  await touchLastActive(authorId);

  console.log("EVENT: plaza_post_create", {
    postId: post.id,
    authorId,
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json(post, { status: 201 });
}
