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

// PATCH /api/post - 재제출 (REDIRECT/ARCHIVED → PENDING)
export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const body = await request.json();
  const id = (body?.id ?? "").toString().trim();
  const content = sanitizeText(body?.content ?? "").slice(0, 5000);

  if (!id) {
    return NextResponse.json({ error: "id는 필수입니다." }, { status: 400 });
  }
  if (!content) {
    return NextResponse.json({ error: "content는 필수입니다." }, { status: 400 });
  }

  const post = await prisma.post.findUnique({
    where: { id },
    select: { id: true, status: true, authorId: true },
  });

  if (!post) {
    return NextResponse.json({ error: "글을 찾을 수 없습니다." }, { status: 404 });
  }

  if (post.authorId !== session.user.id) {
    return NextResponse.json({ error: "본인 글만 수정할 수 있습니다." }, { status: 403 });
  }

  if (post.status !== "REDIRECT" && post.status !== "ARCHIVED") {
    return NextResponse.json({ error: "전환/보관 상태의 글만 재제출할 수 있습니다." }, { status: 409 });
  }

  const updated = await prisma.post.update({
    where: { id },
    data: {
      content,
      status: "PENDING",
      redirectReason: null,
    },
    include: {
      author: { select: { id: true, nickname: true } },
    },
  });

  console.log("EVENT: plaza_post_resubmit", {
    postId: updated.id,
    authorId: session.user.id,
    previousStatus: post.status,
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json(updated);
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
