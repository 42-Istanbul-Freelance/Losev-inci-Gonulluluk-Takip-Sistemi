"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SchoolRankingChartProps {
  data: { name: string; hours: number; students: number }[];
  title?: string;
}

export function SchoolRankingChart({ data, title }: SchoolRankingChartProps) {
  return (
    <div className="card">
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fontSize: 11 }}
              stroke="#9ca3af"
              width={90}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "0.75rem",
                border: "1px solid #e5e7eb",
              }}
              formatter={(value: number, name: string) => [
                `${value} ${name === "hours" ? "saat" : "öğrenci"}`,
                name === "hours" ? "Toplam Saat" : "Öğrenci Sayısı",
              ]}
            />
            <Bar dataKey="hours" fill="#2563eb" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
