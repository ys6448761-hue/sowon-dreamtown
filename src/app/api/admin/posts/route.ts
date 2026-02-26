import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { lazyArchiveRedirects } from "@/lib/lazy-archive";
import { pickRandomTemplate, REDIRECT_TEMPLATES, type TemplateType } from "@/lib/redirect-templates";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    return { denied: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) as NextResponse, session: null };
  }
  if (!isAdmin(session.user.name)) {
    return { denied: NextResponse.json({ error: "Forbidden" }, { status: 403 }) as NextResponse, session: null };
  }
  return { denied: null, session };
}

// GET /api/admin/posts — PENDING 글 목록 (Lazy Archive 실행 후)
export async function GET() {
  const { denied } = await requireAdmin();
  if (denied) return denied;

  // Lazy Archive: REDIRECT 3일 경과 → ARCHIVED
  const archived = await lazyArchiveRedirects();

  const posts = await prisma.post.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      author: { select: { id: true, nickname: true } },
    },
  });

  return NextResponse.json({ posts, archived });
}

// PATCH /api/admin/posts — 승인/전환/거절 (멱등성 보장)
export async function PATCH(request: NextRequest) {
  const { denied, session } = await requireAdmin();
  if (denied) return denied;

  const body = await request.json();
  const id = (body?.id ?? "").toString().trim();
  const action = (body?.action ?? "").toString().trim();
  const rawReason = (body?.redirectReason ?? "").toString().trim();

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  if (!["APPROVE", "REDIRECT", "REJECT"].includes(action)) {
    return NextResponse.json({ error: "action must be APPROVE|REDIRECT|REJECT" }, { status: 400 });
  }

  // action → targetStatus 매핑
  const targetStatus =
    action === "APPROVE" ? "APPROVED" :
    action === "REJECT" ? "REJECTED" :
    "REDIRECT";

  // REDIRECT 전용 검증
  if (targetStatus === "REDIRECT") {
    if (!rawReason) {
      return NextResponse.json({ error: "redirectReason is required for REDIRECT" }, { status: 400 });
    }
    if (rawReason.length > 300) {
      return NextResponse.json({ error: "redirectReason too long (max 300)" }, { status: 400 });
    }
  }

  // 승인/거절에 redirectReason 혼입 차단
  if (targetStatus !== "REDIRECT" && rawReason) {
    return NextResponse.json({ error: "redirectReason allowed only for REDIRECT" }, { status: 400 });
  }

  const existing = await prisma.post.findUnique({
    where: { id },
    select: { id: true, status: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "post not found" }, { status: 404 });
  }

  // 멱등성: 동일 상태면 200 OK
  if (existing.status === targetStatus) {
    return NextResponse.json({ post: existing });
  }

  // PENDING이 아니면 차단
  if (existing.status !== "PENDING") {
    return NextResponse.json({ error: "only PENDING posts can be reviewed" }, { status: 409 });
  }

  // REDIRECT: 템플릿 배정 (동일 post 기존 templateType 재사용)
  let templateType: TemplateType | null = null;
  let finalReason = rawReason || null;

  if (targetStatus === "REDIRECT") {
    const prevLog = await prisma.adminLog.findFirst({
      where: { postId: id, action: "REDIRECT", templateType: { not: null } },
      orderBy: { createdAt: "desc" },
      select: { templateType: true },
    });

    templateType = (prevLog?.templateType as TemplateType) ?? pickRandomTemplate();

    // 템플릿 본문 + 운영자 커스텀 사유 조합
    const templateText = REDIRECT_TEMPLATES[templateType];
    finalReason = rawReason
      ? `${templateText}\n\n${rawReason}`
      : templateText;
  }

  // 트랜잭션: 상태 변경 + Audit Log
  const updated = await prisma.$transaction(async (tx) => {
    const post = await tx.post.update({
      where: { id },
      data: {
        status: targetStatus,
        redirectReason: finalReason,
      },
      select: { id: true, status: true },
    });

    await tx.adminLog.create({
      data: {
        postId: id,
        adminId: session!.user!.id,
        action: targetStatus,
        redirectReason: finalReason,
        templateType,
      },
    });

    return post;
  });

  console.log("EVENT: admin_post_review", {
    postId: updated.id,
    action,
    newStatus: updated.status,
    adminId: session!.user!.id,
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json({ post: updated });
}
