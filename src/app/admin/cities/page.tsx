"use client";

import { useEffect, useState } from "react";
import { formatHours } from "@/lib/utils";
import { SchoolRankingChart } from "@/components/charts/SchoolRankingChart";

export default function AdminCities() {
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reports/top-schools")
      .then((r) => r.json())
      .then((data) => {
        setSchools(Array.isArray(data) ? data : []);
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

  const cityMap = new Map<string, { hours: number; students: number; schools: number }>();
  for (const s of schools) {
    const existing = cityMap.get(s.city) ?? { hours: 0, students: 0, schools: 0 };
    cityMap.set(s.city, {
      hours: existing.hours + s.totalHours,
      students: existing.students + s.students,
      schools: existing.schools + 1,
    });
  }

  const cityData = Array.from(cityMap.entries())
    .map(([city, data]) => ({ city, ...data }))
    .sort((a, b) => b.hours - a.hours);

  const chartData = cityData.slice(0, 10).map((c) => ({
    name: c.city,
    hours: Math.round(c.hours * 10) / 10,
    students: c.students,
  }));

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">İl Bazlı Etki Haritası</h1>

      <SchoolRankingChart data={chartData} title="İl Bazlı Gönüllülük Saatleri" />

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3.5 px-4 font-medium text-gray-500">Sıra</th>
                <th className="text-left py-3.5 px-4 font-medium text-gray-500">İl</th>
                <th className="text-right py-3.5 px-4 font-medium text-gray-500">Okul Sayısı</th>
                <th className="text-right py-3.5 px-4 font-medium text-gray-500">Öğrenci Sayısı</th>
                <th className="text-right py-3.5 px-4 font-medium text-gray-500">Toplam Saat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cityData.map((c, i) => (
                <tr key={c.city} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-bold ${
                      i < 3 ? "bg-primary-100 text-primary-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {i + 1}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-gray-900">{c.city}</td>
                  <td className="py-3.5 px-4 text-right text-gray-600">{c.schools}</td>
                  <td className="py-3.5 px-4 text-right text-gray-600">{c.students}</td>
                  <td className="py-3.5 px-4 text-right font-semibold text-primary-600">
                    {formatHours(c.hours)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {cityData.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">Henüz il verisi bulunmuyor.</p>
          </div>
        )}
      </div>
    </div>
  );
}
