import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/lib/validators";
import { recalculateStudentHours } from "@/lib/badges";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = reviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    // Fetch activity and verify ownership for TEACHER role
    const existingActivity = await prisma.activity.findUnique({
      where: { id: params.id },
      include: { student: { select: { coordinatorId: true } } },
    });

    if (!existingActivity) {
      return NextResponse.json({ error: "Etkinlik bulunamadı" }, { status: 404 });
    }

    // Teachers can only review activities of students they coordinate
    if (session.user.role === "TEACHER" && existingActivity.student.coordinatorId !== session.user.teacherId) {
      return NextResponse.json({ error: "Bu etkinliği inceleme yetkiniz yok" }, { status: 403 });
    }

    const activity = await prisma.activity.update({
      where: { id: params.id },
      data: {
        status: parsed.data.status,
        reviewNote: parsed.data.reviewNote || null,
        reviewedAt: new Date(),
        reviewedBy: session.user.id,
      },
    });

    if (parsed.data.status === "APPROVED" || parsed.data.status === "REJECTED") {
      await recalculateStudentHours(activity.studentId);
    }

    return NextResponse.json(activity);
  } catch (error) {
    console.error("Review error:", error);
    return NextResponse.json(
      { error: "İnceleme kaydedilemedi" },
      { status: 500 }
    );
  }
}
