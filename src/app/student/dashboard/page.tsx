"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { StatsCard } from "@/components/StatsCard";
import { BadgeDisplay } from "@/components/BadgeDisplay";
import { ActivityCard } from "@/components/ActivityCard";
import { HoursChart } from "@/components/charts/HoursChart";
import { BADGE_LABELS } from "@/lib/utils";
import { getNextBadgeInfo } from "@/lib/badges";
import Link from "next/link";

export default function StudentDashboard() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/students/profile").then((r) => r.json()),
      fetch("/api/activities").then((r) => r.json()),
    ]).then(([p, a]) => {
      setProfile(p);
      setActivities(Array.isArray(a) ? a : []);
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

  const student = profile?.student;
  const totalHours = student?.totalHours ?? 0;
  const targetHours = student?.targetHours ?? 30;
  const badgeLevel = student?.badgeLevel ?? "NONE";
  const progress = Math.min((totalHours / targetHours) * 100, 100);
  const nextBadge = getNextBadgeInfo(totalHours);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const approvedActivities = activities.filter((a) => a.status === "APPROVED");
  const monthlyHours = approvedActivities
    .filter((a) => {
      const d = new Date(a.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, a) => sum + a.hours, 0);

  const yearlyHours = approvedActivities
    .filter((a) => new Date(a.date).getFullYear() === currentYear)
    .reduce((sum, a) => sum + a.hours, 0);

  const months = [
    "Oca", "Şub", "Mar", "Nis", "May", "Haz",
    "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara",
  ];
  const monthlyChartData = months.map((month, i) => ({
    month,
    hours: Math.round(
      approvedActivities
        .filter((a) => {
          const d = new Date(a.date);
          return d.getMonth() === i && d.getFullYear() === currentYear;
        })
        .reduce((sum, a) => sum + a.hours, 0) * 10
    ) / 10,
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-white shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Hoş geldin, <span className="text-[#E30613]">{session?.user?.name?.split(" ")[0]}</span>!
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            {student?.school?.name} <span className="mx-2 text-gray-300">|</span> {student?.grade}. Sınıf
          </p>
        </div>
        <Link
          href="/student/activities/new"
          className="rounded-full bg-[#E30613] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-900/20 hover:bg-red-700 hover:-translate-y-0.5 transition-all w-full sm:w-auto text-center"
        >
          + Etkinlik Ekle
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Toplam Saat"
          value={totalHours.toFixed(1)}
          subtitle={`Hedef: ${targetHours} saat`}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          }
        />
        <StatsCard
          title="Bu Ay"
          value={monthlyHours.toFixed(1)}
          subtitle="saat"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
          }
        />
        <StatsCard
          title="Bu Yıl"
          value={yearlyHours.toFixed(1)}
          subtitle="saat"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
          }
        />
        <StatsCard
          title="Etkinlik Sayısı"
          value={activities.length}
          subtitle={`${approvedActivities.length} onaylı`}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          }
        />
      </div>

      {/* Progress bar and badge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
            </svg>
            Hedef İlerlemesi
          </h3>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-end border-b border-gray-100 pb-4 mb-2">
              <div>
                <span className="block text-4xl font-black text-gray-900">{totalHours.toFixed(1)} <span className="text-lg text-gray-400 font-medium">/ {targetHours} saat</span></span>
              </div>
              <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-blue-600">{progress.toFixed(0)}%</span>
            </div>

            <div className="h-5 bg-gray-100 rounded-full overflow-hidden shadow-inner relative">
              <div
                className="h-full bg-gradient-to-r from-primary-500 via-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite] -skew-x-12 translate-x-[-100%]" />
              </div>
            </div>

            {nextBadge && (
              <p className="mt-2 text-sm text-gray-600 font-medium flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                <span className="text-amber-500">⭐</span>
                Sonraki rozet: <strong className="text-gray-900 px-1">{BADGE_LABELS[nextBadge.next]}</strong>
                <span className="text-primary-600">({nextBadge.hoursNeeded.toFixed(1)} saat kaldı)</span>
              </p>
            )}
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl group-hover:bg-amber-400/20 transition-colors" />
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Gönüllülük Rozeti</p>
          <BadgeDisplay level={badgeLevel} size="lg" />
        </div>
      </div>

      <HoursChart data={monthlyChartData} title="Aylık Gönüllülük Saatleri" />

      {/* Recent activities */}
      <div className="relative">
        <div className="flex items-end justify-between mb-6 pb-2 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">Son Etkinlikler</h3>
          <Link href="/student/activities" className="text-sm font-bold text-primary-600 hover:text-primary-700 bg-primary-50 px-4 py-1.5 rounded-full transition-colors">
            Tümünü Gör
          </Link>
        </div>
        <div className="space-y-4">
          {activities.slice(0, 5).map((activity) => (
            <div key={activity.id} className="transition-transform hover:-translate-y-1">
              <ActivityCard activity={activity} />
            </div>
          ))}
          {activities.length === 0 && (
            <div className="bg-white/50 backdrop-blur border border-dashed border-gray-300 rounded-2xl text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium mb-4">Henüz hiç etkinlik eklemedin.</p>
              <Link href="/student/activities/new" className="rounded-full bg-[#E30613] px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-red-700 transition-colors inline-block">
                İlk Etkinliğini Ekle
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
