"use client";

import { useEffect, useState } from "react";
import { HoursChart } from "@/components/charts/HoursChart";
import { ActivityTypeChart } from "@/components/charts/ActivityTypeChart";
import { StatsCard } from "@/components/StatsCard";
import { formatHours } from "@/lib/utils";

export default function TeacherReports() {
  const [activities, setActivities] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/activities").then((r) => r.json()),
      fetch("/api/reports/top-students").then((r) => r.json()),
    ]).then(([a, s]) => {
      setActivities(Array.isArray(a) ? a : []);
      setStudents(Array.isArray(s) ? s : []);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
    );
  }

  const approved = activities.filter((a) => a.status === "APPROVED");
  const totalHours = approved.reduce((sum, a) => sum + a.hours, 0);
  const avgHours = students.length > 0 ? totalHours / students.length : 0;

  const months = [
    "Oca", "Şub", "Mar", "Nis", "May", "Haz",
    "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara",
  ];
  const monthlyData = months.map((month, i) => ({
    month,
    hours: Math.round(
      approved
        .filter((a) => new Date(a.date).getMonth() === i)
        .reduce((sum, a) => sum + a.hours, 0) * 10
    ) / 10,
  }));

  const typeCounts = new Map<string, number>();
  for (const a of approved) {
    typeCounts.set(a.type, (typeCounts.get(a.type) ?? 0) + 1);
  }
  const typeData = Array.from(typeCounts.entries()).map(([type, count]) => ({
    type,
    count,
  }));

  const badgeCounts = { BRONZE: 0, SILVER: 0, GOLD: 0, PLATINUM: 0 };
  for (const s of students) {
    if (s.badgeLevel in badgeCounts) {
      badgeCounts[s.badgeLevel as keyof typeof badgeCounts]++;
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Okul Raporları</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Toplam Saat" value={formatHours(totalHours)} />
        <StatsCard title="Ortalama Saat/Öğrenci" value={formatHours(avgHours)} />
        <StatsCard title="Toplam Etkinlik" value={approved.length} />
        <StatsCard title="Rozet Kazanan" value={Object.values(badgeCounts).reduce((a, b) => a + b, 0)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HoursChart data={monthlyData} title="Aylık Saat Dağılımı" />
        <ActivityTypeChart data={typeData} title="Etkinlik Türü Dağılımı" />
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rozet Dağılımı</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Bronz İnci", count: badgeCounts.BRONZE, color: "bg-amber-100 text-amber-800" },
            { label: "Gümüş İnci", count: badgeCounts.SILVER, color: "bg-gray-100 text-gray-800" },
            { label: "Altın İnci", count: badgeCounts.GOLD, color: "bg-yellow-100 text-yellow-800" },
            { label: "Platin İnci", count: badgeCounts.PLATINUM, color: "bg-purple-100 text-purple-800" },
          ].map((b) => (
            <div key={b.label} className={`rounded-xl p-4 text-center ${b.color}`}>
              <div className="text-2xl font-bold">{b.count}</div>
              <div className="text-sm font-medium mt-1">{b.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
