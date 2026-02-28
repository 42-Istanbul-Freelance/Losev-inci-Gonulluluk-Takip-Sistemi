import { prisma } from "./prisma";

export type BadgeLevel = "NONE" | "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";

export function calculateBadge(totalHours: number): BadgeLevel {
  if (totalHours >= 200) return "PLATINUM";
  if (totalHours >= 100) return "GOLD";
  if (totalHours >= 50) return "SILVER";
  if (totalHours >= 25) return "BRONZE";
  return "NONE";
}

export function getNextBadgeInfo(totalHours: number) {
  if (totalHours >= 200) return null;
  if (totalHours >= 100) return { next: "PLATINUM" as const, hoursNeeded: 200 - totalHours };
  if (totalHours >= 50) return { next: "GOLD" as const, hoursNeeded: 100 - totalHours };
  if (totalHours >= 25) return { next: "SILVER" as const, hoursNeeded: 50 - totalHours };
  return { next: "BRONZE" as const, hoursNeeded: 25 - totalHours };
}

export async function recalculateStudentHours(studentId: string) {
  const result = await prisma.activity.aggregate({
    where: { studentId, status: "APPROVED" },
    _sum: { hours: true },
  });

  const totalHours = result._sum.hours ?? 0;
  const badgeLevel = calculateBadge(totalHours);

  await prisma.student.update({
    where: { id: studentId },
    data: { totalHours, badgeLevel },
  });

  return { totalHours, badgeLevel };
}
