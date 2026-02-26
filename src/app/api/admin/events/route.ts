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

// GET /api/admin/events — 전체 이벤트 목록 (active 포함)
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const events = await prisma.event.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { participations: true } } },
  });
  return NextResponse.json(events);
}

// POST /api/admin/events — 이벤트 생성
export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { name, description } = await request.json();
  if (!name) return NextResponse.json({ error: "name is required" }, { status: 400 });

  const event = await prisma.event.create({ data: { name, description } });
  return NextResponse.json(event, { status: 201 });
}

// PATCH /api/admin/events — 이벤트 비활성화 (soft disable)
export async function PATCH(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const event = await prisma.event.update({ where: { id }, data: { active: false } });
  return NextResponse.json(event);
}
