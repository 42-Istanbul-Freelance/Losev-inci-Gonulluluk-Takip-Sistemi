import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        student: {
          include: {
            school: true,
            coordinator: { include: { user: { select: { name: true } } } },
          },
        },
        teacher: { include: { school: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Profil yüklenemedi" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const body = await req.json();

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: body.name,
        phone: body.phone,
      },
    });

    if (session.user.role === "STUDENT" && session.user.studentId) {
      await prisma.student.update({
        where: { id: session.user.studentId },
        data: {
          grade: body.grade,
          targetHours: body.targetHours ? Number(body.targetHours) : undefined,
        },
      });
    }

    return NextResponse.json({ message: "Profil güncellendi" });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Profil güncellenemedi" },
      { status: 500 }
    );
  }
}
