import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
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
