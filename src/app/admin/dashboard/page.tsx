"use client";

import { useEffect, useState } from "react";
import { StatsCard } from "@/components/StatsCard";
import { HoursChart } from "@/components/charts/HoursChart";
import { ActivityTypeChart } from "@/components/charts/ActivityTypeChart";
import { formatHours } from "@/lib/utils";
import Link from "next/link";

export default function AdminDashboard() {
  const [overview, setOverview] = useState<any>(null);
  const [topStudents, setTopStudents] = useState<any[]>([]);
  const [topSchools, setTopSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/reports/overview").then((r) => r.json()),
      fetch("/api/reports/top-students").then((r) => r.json()),
      fetch("/api/reports/top-schools").then((r) => r.json()),
    ]).then(([o, s, sc]) => {
      setOverview(o);
      setTopStudents(Array.isArray(s) ? s : []);
      setTopSchools(Array.isArray(sc) ? sc : []);
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-white shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Genel Merkez <span className="text-[#E30613]">Paneli</span></h1>
          <p className="text-gray-500 mt-2 font-medium">Türkiye geneli gönüllülük takibi</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Toplam Öğrenci"
          value={overview?.totalStudents ?? 0}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
          }
        />
        <StatsCard
          title="Toplam Okul"
          value={overview?.totalSchools ?? 0}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </svg>
          }
        />
        <StatsCard
          title="Toplam Gönüllülük Saati"
          value={formatHours(overview?.totalHours ?? 0)}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          }
        />
        <StatsCard
          title="Onaylı Etkinlik"
          value={overview?.approvedActivities ?? 0}
          subtitle={`Toplam: ${overview?.totalActivities ?? 0}`}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HoursChart data={overview?.monthlyHours ?? []} title="Aylık Gönüllülük Saatleri" />
        <ActivityTypeChart data={overview?.typeDistribution ?? []} title="Etkinlik Türü Dağılımı" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 10 Students */}
        <div className="bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl p-6 shadow-sm overflow-hidden relative">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="text-xl">🏆</span>
              En Aktif 10 Öğrenci
            </h3>
            <Link href="/admin/students" className="text-sm font-bold text-primary-600 hover:text-primary-700 bg-primary-50 px-4 py-1.5 rounded-full transition-colors">
              Tümü
            </Link>
          </div>
          <div className="space-y-3">
            {topStudents.slice(0, 10).map((s, i) => (
              <div key={s.id} className="group flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-primary-100 hover:bg-primary-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold shadow-sm ${i === 0 ? "bg-amber-400 text-white shadow-amber-400/50" :
                      i === 1 ? "bg-gray-300 text-gray-700 shadow-gray-400/50" :
                        i === 2 ? "bg-amber-700 text-white shadow-amber-800/50" : "bg-gray-100 text-gray-500"
                    }`}>
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-gray-900 group-hover:text-primary-700 transition-colors">{s.user.name}</p>
                    <p className="text-xs font-medium text-gray-500">{s.school?.name} <span className="mx-1 opacity-50">•</span> {s.school?.city}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-base font-black text-primary-600">
                    {formatHours(s.totalHours)}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">saat</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 10 Schools */}
        <div className="bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl p-6 shadow-sm overflow-hidden relative">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="text-xl">🏫</span>
              En Aktif 10 Okul
            </h3>
            <Link href="/admin/schools" className="text-sm font-bold text-primary-600 hover:text-primary-700 bg-primary-50 px-4 py-1.5 rounded-full transition-colors">
              Tümü
            </Link>
          </div>
          <div className="space-y-3">
            {topSchools.slice(0, 10).map((s, i) => (
              <div key={s.id} className="group flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-emerald-100 hover:bg-emerald-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold shadow-sm ${i === 0 ? "bg-emerald-500 text-white shadow-emerald-500/50" :
                      i === 1 ? "bg-emerald-400 text-white shadow-emerald-400/50" :
                        i === 2 ? "bg-emerald-300 text-white shadow-emerald-300/50" : "bg-gray-100 text-gray-500"
                    }`}>
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{s.name}</p>
                    <p className="text-xs font-medium text-gray-500">{s.city}/{s.district} <span className="mx-1 opacity-50">•</span> {s.students} öğrenci</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-base font-black text-emerald-600">
                    {formatHours(s.totalHours)}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">saat</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
