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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Hoş geldin, {session?.user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-gray-500 mt-1">
            {student?.school?.name} - {student?.grade}. Sınıf
          </p>
        </div>
        <Link href="/student/activities/new" className="btn-primary">
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
        <div className="lg:col-span-2 card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hedef İlerlemesi</h3>
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">{totalHours.toFixed(1)} / {targetHours} saat</span>
                <span className="font-medium text-primary-600">{progress.toFixed(0)}%</span>
              </div>
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {nextBadge && (
                <p className="mt-3 text-sm text-gray-500">
                  Sonraki rozet: <span className="font-medium">{BADGE_LABELS[nextBadge.next]}</span>
                  {" "}({nextBadge.hoursNeeded.toFixed(1)} saat kaldı)
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="card flex items-center justify-center">
          <BadgeDisplay level={badgeLevel} size="lg" />
        </div>
      </div>

      <HoursChart data={monthlyChartData} title="Aylık Gönüllülük Saatleri" />

      {/* Recent activities */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Son Etkinlikler</h3>
          <Link href="/student/activities" className="text-sm text-primary-600 hover:text-primary-500 font-medium">
            Tümünü Gör
          </Link>
        </div>
        <div className="space-y-3">
          {activities.slice(0, 5).map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
          {activities.length === 0 && (
            <div className="card text-center py-12">
              <p className="text-gray-500">Henüz etkinlik eklemediniz.</p>
              <Link href="/student/activities/new" className="btn-primary mt-4 inline-flex">
                İlk Etkinliğini Ekle
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
