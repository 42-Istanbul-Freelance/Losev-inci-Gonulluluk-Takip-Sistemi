"use client";

import { useEffect, useState } from "react";
import { BADGE_LABELS, formatHours } from "@/lib/utils";

export default function AdminStudents() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reports/top-students")
      .then((r) => r.json())
      .then((data) => {
        setStudents(Array.isArray(data) ? data : []);
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">En Aktif Öğrenciler</h1>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3.5 px-4 font-medium text-gray-500">Sıra</th>
                <th className="text-left py-3.5 px-4 font-medium text-gray-500">Öğrenci</th>
                <th className="text-left py-3.5 px-4 font-medium text-gray-500">Okul</th>
                <th className="text-left py-3.5 px-4 font-medium text-gray-500">İl</th>
                <th className="text-left py-3.5 px-4 font-medium text-gray-500">Sınıf</th>
                <th className="text-right py-3.5 px-4 font-medium text-gray-500">Toplam Saat</th>
                <th className="text-right py-3.5 px-4 font-medium text-gray-500">Etkinlik</th>
                <th className="text-right py-3.5 px-4 font-medium text-gray-500">Rozet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map((s, i) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-bold ${
                      i < 3 ? "bg-primary-100 text-primary-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {i + 1}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-gray-900">{s.user.name}</td>
                  <td className="py-3.5 px-4 text-gray-600">{s.school?.name}</td>
                  <td className="py-3.5 px-4 text-gray-500">{s.school?.city}</td>
                  <td className="py-3.5 px-4 text-gray-600">{s.grade}. Sınıf</td>
                  <td className="py-3.5 px-4 text-right font-semibold text-primary-600">
                    {formatHours(s.totalHours)}
                  </td>
                  <td className="py-3.5 px-4 text-right text-gray-600">
                    {s._count?.activities ?? 0}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {s.badgeLevel !== "NONE" ? (
                      <span className="inline-flex items-center rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700">
                        {BADGE_LABELS[s.badgeLevel]}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {students.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">Henüz öğrenci verisi bulunmuyor.</p>
          </div>
        )}
      </div>
    </div>
  );
}
