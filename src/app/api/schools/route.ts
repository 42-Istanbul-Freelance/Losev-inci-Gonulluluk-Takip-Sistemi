import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Unauthenticated users (register form) get minimal data
    if (!session) {
      const schools = await prisma.school.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true, city: true, district: true },
      });
      return NextResponse.json(schools);
    }

    // Authenticated users get full data
    const schools = await prisma.school.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { students: true, teachers: true } },
      },
    });
    return NextResponse.json(schools);
  } catch (error) {
    console.error("Schools fetch error:", error);
    return NextResponse.json({ error: "Okullar yüklenemedi" }, { status: 500 });
  }
}
