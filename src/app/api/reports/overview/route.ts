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

    const [
      totalStudents,
      totalActivities,
      approvedActivities,
      totalSchools,
      hoursResult,
    ] = await Promise.all([
      prisma.student.count(),
      prisma.activity.count(),
      prisma.activity.count({ where: { status: "APPROVED" } }),
      prisma.school.count(),
      prisma.activity.aggregate({
        where: { status: "APPROVED" },
        _sum: { hours: true },
      }),
    ]);

    const totalHours = hoursResult._sum.hours ?? 0;

    const monthlyData = await prisma.activity.findMany({
      where: { status: "APPROVED" },
      select: { date: true, hours: true },
    });

    const monthlyMap = new Map<string, number>();
    const months = [
      "Oca", "Şub", "Mar", "Nis", "May", "Haz",
      "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara",
    ];

    for (const a of monthlyData) {
      const d = new Date(a.date);
      const key = months[d.getMonth()];
      monthlyMap.set(key, (monthlyMap.get(key) ?? 0) + a.hours);
    }

    const monthlyHours = months.map((m) => ({
      month: m,
      hours: Math.round((monthlyMap.get(m) ?? 0) * 10) / 10,
    }));

    const activityTypeCounts = await prisma.activity.groupBy({
      by: ["type"],
      where: { status: "APPROVED" },
      _count: true,
    });

    const typeDistribution = activityTypeCounts.map((a) => ({
      type: a.type,
      count: a._count,
    }));

    return NextResponse.json({
      totalStudents,
      totalActivities,
      approvedActivities,
      totalSchools,
      totalHours,
      monthlyHours,
      typeDistribution,
    });
  } catch (error) {
    console.error("Overview error:", error);
    return NextResponse.json({ error: "Rapor yüklenemedi" }, { status: 500 });
  }
}
