import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const where: any = {};
    if (session.user.role === "TEACHER") {
      where.coordinatorId = session.user.teacherId;
    }

    const students = await prisma.student.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        school: { select: { name: true, city: true } },
        _count: { select: { activities: { where: { status: "APPROVED" } } } },
      },
      orderBy: { totalHours: "desc" },
      take: 10,
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error("Top students error:", error);
    return NextResponse.json({ error: "Veriler yüklenemedi" }, { status: 500 });
  }
}
