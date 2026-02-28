"use client";

import { useEffect, useState } from "react";
import { formatHours } from "@/lib/utils";

export default function AdminSchools() {
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"totalHours" | "students" | "avgHours">("totalHours");

  useEffect(() => {
    fetch("/api/reports/top-schools")
      .then((r) => r.json())
      .then((data) => {
        setSchools(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  const sorted = [...schools].sort((a, b) => b[sortBy] - a[sortBy]);

  function getSchoolBadge(school: any) {
    if (school.totalHours >= 500) return { label: "Yılın En Aktif İnci Okulu", color: "bg-yellow-100 text-yellow-800" };
    if (school.totalHours >= 200) return { label: "Sosyal Etki Lideri Okul", color: "bg-purple-100 text-purple-800" };
    if (school.totalHours >= 50) return { label: "İnci Dostu Okul", color: "bg-blue-100 text-blue-800" };
    return null;
  }

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
        <h1 className="text-2xl font-bold text-gray-900">Okul Sıralaması</h1>
        <div className="flex gap-2">
          {[
            { value: "totalHours" as const, label: "Toplam Saat" },
            { value: "students" as const, label: "Öğrenci Sayısı" },
            { value: "avgHours" as const, label: "Ort. Saat" },
          ].map((s) => (
            <button
              key={s.value}
              onClick={() => setSortBy(s.value)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                sortBy === s.value
                  ? "bg-primary-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3.5 px-4 font-medium text-gray-500">Sıra</th>
                <th className="text-left py-3.5 px-4 font-medium text-gray-500">Okul</th>
                <th className="text-left py-3.5 px-4 font-medium text-gray-500">İl/İlçe</th>
                <th className="text-right py-3.5 px-4 font-medium text-gray-500">Öğrenci</th>
                <th className="text-right py-3.5 px-4 font-medium text-gray-500">Toplam Saat</th>
                <th className="text-right py-3.5 px-4 font-medium text-gray-500">Ort. Saat</th>
                <th className="text-left py-3.5 px-4 font-medium text-gray-500">Rozet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sorted.map((s, i) => {
                const badge = getSchoolBadge(s);
                return (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-bold ${
                        i < 3 ? "bg-primary-100 text-primary-700" : "bg-gray-100 text-gray-500"
                      }`}>
                        {i + 1}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-gray-900">{s.name}</td>
                    <td className="py-3.5 px-4 text-gray-500">{s.city}/{s.district}</td>
                    <td className="py-3.5 px-4 text-right text-gray-600">{s.students}</td>
                    <td className="py-3.5 px-4 text-right font-semibold text-primary-600">
                      {formatHours(s.totalHours)}
                    </td>
                    <td className="py-3.5 px-4 text-right text-gray-600">
                      {formatHours(s.avgHours)}
                    </td>
                    <td className="py-3.5 px-4">
                      {badge && (
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.color}`}>
                          {badge.label}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {schools.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">Henüz okul verisi bulunmuyor.</p>
          </div>
        )}
      </div>
    </div>
  );
}
