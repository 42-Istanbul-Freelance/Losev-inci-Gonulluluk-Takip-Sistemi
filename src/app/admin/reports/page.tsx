"use client";

import { useEffect, useState } from "react";
import { StatsCard } from "@/components/StatsCard";
import { HoursChart } from "@/components/charts/HoursChart";
import { ActivityTypeChart } from "@/components/charts/ActivityTypeChart";
import { SchoolRankingChart } from "@/components/charts/SchoolRankingChart";
import { formatHours } from "@/lib/utils";

export default function AdminReports() {
  const [overview, setOverview] = useState<any>(null);
  const [topSchools, setTopSchools] = useState<any[]>([]);
  const [topStudents, setTopStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/reports/overview").then((r) => r.json()),
      fetch("/api/reports/top-schools").then((r) => r.json()),
      fetch("/api/reports/top-students").then((r) => r.json()),
    ]).then(([o, sc, st]) => {
      setOverview(o);
      setTopSchools(Array.isArray(sc) ? sc : []);
      setTopStudents(Array.isArray(st) ? st : []);
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

  const badgeCounts = { BRONZE: 0, SILVER: 0, GOLD: 0, PLATINUM: 0 };
  for (const s of topStudents) {
    if (s.badgeLevel in badgeCounts) {
      badgeCounts[s.badgeLevel as keyof typeof badgeCounts]++;
    }
  }

  const schoolChartData = topSchools.slice(0, 10).map((s) => ({
    name: s.name.length > 20 ? s.name.substring(0, 20) + "..." : s.name,
    hours: s.totalHours,
    students: s.students,
  }));

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Detaylı Raporlar</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Toplam Gönüllülük Saati" value={formatHours(overview?.totalHours ?? 0)} />
        <StatsCard title="Toplam Öğrenci" value={overview?.totalStudents ?? 0} />
        <StatsCard title="Toplam Etkinlik" value={overview?.totalActivities ?? 0} />
        <StatsCard
          title="Ort. Saat/Öğrenci"
          value={
            overview?.totalStudents > 0
              ? formatHours(Math.round(((overview?.totalHours ?? 0) / overview.totalStudents) * 10) / 10)
              : "0"
          }
        />
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Genel Özet</h3>
        <div className="rounded-lg bg-primary-50 p-4 text-sm text-primary-900">
          <p>
            Türkiye genelinde <strong>{overview?.totalStudents ?? 0}</strong> İnci öğrencisi
            toplam <strong>{formatHours(overview?.totalHours ?? 0)} saat</strong> gönüllülük çalışması
            gerçekleştirmiştir. <strong>{overview?.totalSchools ?? 0}</strong> okuldan
            toplamda <strong>{overview?.approvedActivities ?? 0}</strong> onaylı etkinlik kaydedilmiştir.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HoursChart data={overview?.monthlyHours ?? []} title="Aylık Faaliyet Dağılımı" />
        <ActivityTypeChart data={overview?.typeDistribution ?? []} title="Etkinlik Türüne Göre İstatistik" />
      </div>

      <SchoolRankingChart data={schoolChartData} title="Okul Bazlı Sıralama" />

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rozet Dağılımı (Türkiye Geneli)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Bronz İnci", count: badgeCounts.BRONZE, color: "bg-amber-100 text-amber-800", hours: "25+ saat" },
            { label: "Gümüş İnci", count: badgeCounts.SILVER, color: "bg-gray-100 text-gray-800", hours: "50+ saat" },
            { label: "Altın İnci", count: badgeCounts.GOLD, color: "bg-yellow-100 text-yellow-800", hours: "100+ saat" },
            { label: "Platin İnci", count: badgeCounts.PLATINUM, color: "bg-purple-100 text-purple-800", hours: "200+ saat" },
          ].map((b) => (
            <div key={b.label} className={`rounded-xl p-4 text-center ${b.color}`}>
              <div className="text-3xl font-bold">{b.count}</div>
              <div className="text-sm font-medium mt-1">{b.label}</div>
              <div className="text-xs mt-0.5 opacity-70">{b.hours}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
