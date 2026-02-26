import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// POST /api/like - 좋아요 토글 (인증 필수)
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const body = await request.json();
  const { postId } = body;

  if (!postId) {
    return NextResponse.json(
      { error: "postId는 필수입니다." },
      { status: 400 }
    );
  }

  const userId = session.user.id;

  const existing = await prisma.like.findUnique({
    where: { userId_postId: { userId, postId } },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });

    console.log("EVENT: plaza_like_click", {
      postId,
      userId,
      action: "unlike",
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ liked: false });
  }

  await prisma.like.create({
    data: { userId, postId },
  });

  console.log("EVENT: plaza_like_click", {
    postId,
    userId,
    action: "like",
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json({ liked: true }, { status: 201 });
}
