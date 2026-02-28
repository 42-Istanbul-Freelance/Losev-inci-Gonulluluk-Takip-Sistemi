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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Genel Merkez Paneli</h1>
        <p className="text-gray-500 mt-1">Türkiye geneli gönüllülük takibi</p>
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
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">En Aktif 10 Öğrenci</h3>
            <Link href="/admin/students" className="text-sm text-primary-600 hover:text-primary-500 font-medium">
              Tümü
            </Link>
          </div>
          <div className="space-y-2">
            {topStudents.slice(0, 10).map((s, i) => (
              <div key={s.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    i < 3 ? "bg-primary-100 text-primary-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{s.user.name}</p>
                    <p className="text-xs text-gray-500">{s.school?.name} - {s.school?.city}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-primary-600">
                  {formatHours(s.totalHours)} saat
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top 10 Schools */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">En Aktif 10 Okul</h3>
            <Link href="/admin/schools" className="text-sm text-primary-600 hover:text-primary-500 font-medium">
              Tümü
            </Link>
          </div>
          <div className="space-y-2">
            {topSchools.slice(0, 10).map((s, i) => (
              <div key={s.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    i < 3 ? "bg-primary-100 text-primary-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{s.name}</p>
                    <p className="text-xs text-gray-500">{s.city}/{s.district} - {s.students} öğrenci</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-primary-600">
                  {formatHours(s.totalHours)} saat
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
