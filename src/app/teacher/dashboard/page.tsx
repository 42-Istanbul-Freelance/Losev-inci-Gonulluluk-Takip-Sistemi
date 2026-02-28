"use client";

import { useEffect, useState } from "react";
import { StatsCard } from "@/components/StatsCard";
import { HoursChart } from "@/components/charts/HoursChart";
import { ActivityTypeChart } from "@/components/charts/ActivityTypeChart";
import Link from "next/link";

export default function TeacherDashboard() {
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

  const pending = activities.filter((a) => a.status === "PENDING");
  const approved = activities.filter((a) => a.status === "APPROVED");
  const totalHours = approved.reduce((sum, a) => sum + a.hours, 0);

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

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-white shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Öğretmen <span className="text-[#E30613]">Paneli</span></h1>
          <p className="text-gray-500 mt-2 font-medium">Okul bazlı gönüllülük takibi</p>
        </div>
        {pending.length > 0 && (
          <Link
            href="/teacher/activities"
            className="rounded-full bg-amber-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-amber-900/20 hover:bg-amber-600 hover:-translate-y-0.5 transition-all w-full sm:w-auto text-center animate-pulse-slow"
          >
            {pending.length} Onay Bekliyor
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Toplam Öğrenci"
          value={students.length}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
          }
        />
        <StatsCard
          title="Onay Bekleyen"
          value={pending.length}
          className={pending.length > 0 ? "border-yellow-200 bg-yellow-50/50" : ""}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          }
        />
        <StatsCard
          title="Onaylı Etkinlik"
          value={approved.length}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          }
        />
        <StatsCard
          title="Toplam Saat"
          value={totalHours.toFixed(1)}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HoursChart data={monthlyData} title="Aylık Gönüllülük Saatleri (Okul)" />
        <ActivityTypeChart data={typeData} title="Etkinlik Türü Dağılımı" />
      </div>

      {/* Top students */}
      <div className="bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl p-6 shadow-sm overflow-hidden relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b border-gray-100 gap-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
            En Aktif Öğrenciler
          </h3>
          <Link href="/teacher/students" className="text-sm font-bold text-primary-600 hover:text-primary-700 bg-primary-50 px-4 py-1.5 rounded-full transition-colors shrink-0">
            Tümünü Gör
          </Link>
        </div>
        <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-bold text-gray-400 uppercase tracking-widest text-xs">Sıra</th>
                <th className="text-left py-3 px-4 font-bold text-gray-400 uppercase tracking-widest text-xs">Öğrenci</th>
                <th className="text-left py-3 px-4 font-bold text-gray-400 uppercase tracking-widest text-xs">Sınıf</th>
                <th className="text-right py-3 px-4 font-bold text-gray-400 uppercase tracking-widest text-xs">Saat</th>
                <th className="text-right py-3 px-4 font-bold text-gray-400 uppercase tracking-widest text-xs">Rozet</th>
              </tr>
            </thead>
            <tbody>
              {students.slice(0, 5).map((s, i) => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                  <td className="py-4 px-4 font-medium text-gray-400 group-hover:text-primary-600 transition-colors">#{i + 1}</td>
                  <td className="py-4 px-4 font-bold text-gray-900">{s.user.name}</td>
                  <td className="py-4 px-4 font-medium text-gray-600">{s.grade}. Sınıf</td>
                  <td className="py-4 px-4 text-right font-black text-primary-600">
                    {s.totalHours.toFixed(1)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${s.badgeLevel !== "NONE" ? 'bg-primary-50 text-primary-700' : 'text-gray-400'}`}>
                      {s.badgeLevel !== "NONE" ? s.badgeLevel : "-"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {students.length === 0 && (
            <div className="text-center py-10 text-gray-500 font-medium">Kayıtlı öğrenci verisi bulunmamaktadır.</div>
          )}
        </div>
      </div>
    </div>
  );
}
