import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/post - 글 목록 조회
export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, nickname: true } },
      _count: { select: { likes: true } },
    },
  });

  return NextResponse.json(posts);
}

// POST /api/post - 글 작성
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { content, authorId } = body;

  if (!content || !authorId) {
    return NextResponse.json(
      { error: "content와 authorId는 필수입니다." },
      { status: 400 }
    );
  }

  const post = await prisma.post.create({
    data: { content, authorId },
    include: {
      author: { select: { id: true, nickname: true } },
    },
  });

  return NextResponse.json(post, { status: 201 });
}
