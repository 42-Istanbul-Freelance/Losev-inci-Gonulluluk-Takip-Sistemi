import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    // Only TEACHER (own school) and ADMIN can access school reports
    if (session.user.role === "STUDENT") {
      return NextResponse.json({ error: "Bu rapora erişim yetkiniz yok" }, { status: 403 });
    }

    if (session.user.role === "TEACHER" && session.user.schoolId !== params.id) {
      return NextResponse.json({ error: "Yalnızca kendi okulunuzun raporuna erişebilirsiniz" }, { status: 403 });
    }

    const school = await prisma.school.findUnique({
      where: { id: params.id },
      include: {
        students: {
          include: {
            user: { select: { name: true } },
            _count: {
              select: { activities: { where: { status: "APPROVED" } } },
            },
          },
          orderBy: { totalHours: "desc" },
        },
        _count: { select: { students: true, teachers: true } },
      },
    });

    if (!school) {
      return NextResponse.json({ error: "Okul bulunamadı" }, { status: 404 });
    }

    const totalHours = school.students.reduce(
      (sum, s) => sum + s.totalHours,
      0
    );

    return NextResponse.json({ ...school, totalHours });
  } catch (error) {
    console.error("School report error:", error);
    return NextResponse.json({ error: "Rapor yüklenemedi" }, { status: 500 });
  }
}
