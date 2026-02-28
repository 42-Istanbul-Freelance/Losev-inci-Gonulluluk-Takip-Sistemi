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

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Bu rapora erişim yetkiniz yok" }, { status: 403 });
    }

    const schools = await prisma.school.findMany({
      include: {
        students: {
          select: { totalHours: true },
        },
        _count: { select: { students: true } },
      },
    });

    const ranked = schools
      .map((s) => ({
        id: s.id,
        name: s.name,
        city: s.city,
        district: s.district,
        students: s._count.students,
        totalHours: s.students.reduce((sum, st) => sum + st.totalHours, 0),
        avgHours:
          s._count.students > 0
            ? Math.round(
              (s.students.reduce((sum, st) => sum + st.totalHours, 0) /
                s._count.students) *
              10
            ) / 10
            : 0,
      }))
      .sort((a, b) => b.totalHours - a.totalHours)
      .slice(0, 10);

    return NextResponse.json(ranked);
  } catch (error) {
    console.error("Top schools error:", error);
    return NextResponse.json({ error: "Veriler yüklenemedi" }, { status: 500 });
  }
}
