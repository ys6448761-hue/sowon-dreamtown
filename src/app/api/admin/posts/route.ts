import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin(session.user.name)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return null;
}

// GET /api/admin/posts — PENDING 글 목록
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const posts = await prisma.post.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      author: { select: { id: true, nickname: true } },
    },
  });

  return NextResponse.json({ posts });
}

// PATCH /api/admin/posts — 승인/전환/거절
export async function PATCH(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await request.json();
  const id = (body?.id ?? "").toString().trim();
  const action = (body?.action ?? "").toString().trim();
  const redirectReason = (body?.redirectReason ?? "").toString().trim();

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  if (!["APPROVE", "REDIRECT", "REJECT"].includes(action)) {
    return NextResponse.json({ error: "action must be APPROVE|REDIRECT|REJECT" }, { status: 400 });
  }

  if (action === "REDIRECT" && !redirectReason) {
    return NextResponse.json({ error: "redirectReason is required for REDIRECT" }, { status: 400 });
  }

  const existing = await prisma.post.findUnique({
    where: { id },
    select: { id: true, status: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "post not found" }, { status: 404 });
  }

  if (existing.status !== "PENDING") {
    return NextResponse.json({ error: "only PENDING posts can be reviewed" }, { status: 409 });
  }

  const data: { status: string; redirectReason?: string } = { status: "" };

  if (action === "APPROVE") data.status = "APPROVED";
  if (action === "REJECT") data.status = "REJECTED";
  if (action === "REDIRECT") {
    data.status = "REDIRECT";
    data.redirectReason = redirectReason;
  }

  const post = await prisma.post.update({
    where: { id },
    data,
    select: { id: true, status: true },
  });

  console.log("EVENT: admin_post_review", {
    postId: post.id,
    action,
    newStatus: post.status,
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json({ post });
}
