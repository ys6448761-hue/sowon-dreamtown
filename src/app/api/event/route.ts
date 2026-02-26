import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/event - 이벤트 목록 조회 (공개)
export async function GET() {
  const events = await prisma.event.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { participations: true } },
    },
  });

  return NextResponse.json(events);
}

// POST /api/event - 이벤트 생성 (인증 필수)
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const body = await request.json();
  const { name, description } = body;

  if (!name) {
    return NextResponse.json(
      { error: "name은 필수입니다." },
      { status: 400 }
    );
  }

  const event = await prisma.event.create({
    data: { name, description },
  });

  console.log("EVENT: event_create", {
    eventId: event.id,
    name: event.name,
    createdBy: session.user.id,
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json(event, { status: 201 });
}
