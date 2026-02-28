"use client";

import { useEffect, useState } from "react";
import { ActivityCard } from "@/components/ActivityCard";
import Link from "next/link";

export default function StudentActivities() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetch("/api/activities")
      .then((r) => r.json())
      .then((data) => {
        setActivities(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  const filtered =
    filter === "ALL"
      ? activities
      : activities.filter((a) => a.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Etkinliklerim</h1>
        <Link href="/student/activities/new" className="btn-primary">
          + Etkinlik Ekle
        </Link>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[
          { value: "ALL", label: "Tümü" },
          { value: "PENDING", label: "Bekliyor" },
          { value: "APPROVED", label: "Onaylı" },
          { value: "REJECTED", label: "Reddedildi" },
          { value: "REVISION_REQUESTED", label: "Düzenleme" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === f.value
                ? "bg-primary-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {f.label}
            {f.value !== "ALL" && (
              <span className="ml-1.5 text-xs">
                ({activities.filter((a) => a.status === f.value).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
        {filtered.length === 0 && (
          <div className="card text-center py-16">
            <p className="text-gray-500">Bu filtreye uygun etkinlik bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
}
