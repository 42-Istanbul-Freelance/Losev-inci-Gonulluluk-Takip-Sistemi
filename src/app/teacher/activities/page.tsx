"use client";

import { useEffect, useState } from "react";
import { ActivityCard } from "@/components/ActivityCard";

export default function TeacherActivities() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING");
  const [reviewNote, setReviewNote] = useState("");
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  function fetchActivities() {
    fetch("/api/activities")
      .then((r) => r.json())
      .then((data) => {
        setActivities(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchActivities();
  }, []);

  async function handleReview(id: string, status: string) {
    if (status === "REVISION_REQUESTED" || status === "REJECTED") {
      if (!reviewingId || reviewingId !== id) {
        setReviewingId(id);
        return;
      }
    }

    await fetch(`/api/activities/${id}/review`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, reviewNote: reviewNote || undefined }),
    });

    setReviewNote("");
    setReviewingId(null);
    fetchActivities();
  }

  const filtered = activities.filter((a) =>
    filter === "ALL" ? true : a.status === filter
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Etkinlik Onayları</h1>

      <div className="flex gap-2 flex-wrap">
        {[
          { value: "PENDING", label: "Bekliyor" },
          { value: "APPROVED", label: "Onaylı" },
          { value: "REJECTED", label: "Reddedildi" },
          { value: "REVISION_REQUESTED", label: "Düzenleme" },
          { value: "ALL", label: "Tümü" },
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
            <span className="ml-1.5 text-xs">
              ({activities.filter((a) => f.value === "ALL" ? true : a.status === f.value).length})
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((activity) => (
          <div key={activity.id}>
            <div className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-sm font-medium text-primary-600">
                    {activity.student?.user?.name} - {activity.student?.school?.name}
                  </p>
                </div>
              </div>
              <ActivityCard
                activity={activity}
                showActions={true}
                onApprove={(id) => handleReview(id, "APPROVED")}
                onReject={(id) => handleReview(id, "REJECTED")}
                onRevision={(id) => handleReview(id, "REVISION_REQUESTED")}
              />
              {reviewingId === activity.id && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                  <textarea
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    placeholder="Öğrenciye not bırakın..."
                    rows={2}
                    className="input resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReview(activity.id, "REJECTED")}
                      className="btn-danger text-xs"
                    >
                      Reddet
                    </button>
                    <button
                      onClick={() => handleReview(activity.id, "REVISION_REQUESTED")}
                      className="btn-secondary text-xs"
                    >
                      Düzenleme İste
                    </button>
                    <button
                      onClick={() => { setReviewingId(null); setReviewNote(""); }}
                      className="btn-secondary text-xs"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
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
