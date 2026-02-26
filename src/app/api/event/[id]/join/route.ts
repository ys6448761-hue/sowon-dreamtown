import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// POST /api/event/[id]/join - 이벤트 참여 (인증 필수)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { id: eventId } = await params;
  const userId = session.user.id;

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) {
    return NextResponse.json(
      { error: "이벤트를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  const existing = await prisma.eventParticipation.findUnique({
    where: { userId_eventId: { userId, eventId } },
  });

  if (existing) {
    return NextResponse.json(
      { error: "이미 참여한 이벤트입니다." },
      { status: 409 }
    );
  }

  const participation = await prisma.eventParticipation.create({
    data: { userId, eventId },
  });

  console.log("EVENT: event_join", {
    eventId,
    userId,
    participationId: participation.id,
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json({ joined: true, participationId: participation.id }, { status: 201 });
}
