import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";

// GET /api/admin/posts/:id/logs — 특정 글의 AdminLog 최신 20개
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin(session.user.name)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;

  const logs = await prisma.adminLog.findMany({
    where: { postId: id },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      admin: { select: { id: true, nickname: true } },
    },
  });

  return NextResponse.json({ logs });
}
