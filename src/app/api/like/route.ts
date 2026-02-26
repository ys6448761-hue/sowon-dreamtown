import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/like - 좋아요 토글
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { postId, userId } = body;

  if (!postId || !userId) {
    return NextResponse.json(
      { error: "postId와 userId는 필수입니다." },
      { status: 400 }
    );
  }

  const existing = await prisma.like.findUnique({
    where: { userId_postId: { userId, postId } },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    return NextResponse.json({ liked: false });
  }

  await prisma.like.create({
    data: { userId, postId },
  });

  return NextResponse.json({ liked: true }, { status: 201 });
}
