import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { activitySchema } from "@/lib/validators";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const studentId = searchParams.get("studentId");

    const where: any = {};

    if (session.user.role === "STUDENT") {
      where.studentId = session.user.studentId;
    } else if (session.user.role === "TEACHER") {
      where.student = { coordinatorId: session.user.teacherId };
    }

    if (status) where.status = status;
    if (studentId) where.studentId = studentId;

    const activities = await prisma.activity.findMany({
      where,
      include: {
        student: {
          include: {
            user: { select: { name: true, email: true } },
            school: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Activities fetch error:", error);
    return NextResponse.json({ error: "Etkinlikler yüklenemedi" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "STUDENT") {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = activitySchema.safeParse({
      ...body,
      hours: Number(body.hours),
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const activity = await prisma.activity.create({
      data: {
        studentId: session.user.studentId!,
        date: new Date(parsed.data.date),
        type: parsed.data.type,
        hours: parsed.data.hours,
        description: parsed.data.description,
        photos: body.photos || "[]",
        documents: body.documents || "[]",
      },
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error("Activity create error:", error);
    return NextResponse.json(
      { error: "Etkinlik oluşturulamadı" },
      { status: 500 }
    );
  }
}
