"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ACTIVITY_TYPES } from "@/lib/utils";

export default function NewActivity() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: formData.get("date"),
        type: formData.get("type"),
        hours: Number(formData.get("hours")),
        description: formData.get("description"),
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Etkinlik eklenirken hata oluştu");
      setLoading(false);
    } else {
      router.push("/student/activities");
      router.refresh();
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Yeni Etkinlik Ekle</h1>

      <form onSubmit={handleSubmit} className="card space-y-5">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="date" className="label">Etkinlik Tarihi</label>
          <input
            id="date"
            name="date"
            type="date"
            required
            className="input"
            max={new Date().toISOString().split("T")[0]}
          />
        </div>

        <div>
          <label htmlFor="type" className="label">Etkinlik Türü</label>
          <select id="type" name="type" required className="select">
            <option value="">Tür seçin</option>
            {Object.entries(ACTIVITY_TYPES).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="hours" className="label">Harcanan Saat</label>
          <input
            id="hours"
            name="hours"
            type="number"
            step="0.5"
            min="0.5"
            max="24"
            required
            className="input"
            placeholder="Örn: 2.5"
          />
        </div>

        <div>
          <label htmlFor="description" className="label">Açıklama</label>
          <textarea
            id="description"
            name="description"
            required
            minLength={10}
            rows={4}
            className="input resize-none"
            placeholder="Etkinliğinizi kısaca açıklayın (en az 10 karakter)"
          />
        </div>

        <div className="rounded-lg border-2 border-dashed border-gray-200 p-8 text-center">
          <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v13.5A1.5 1.5 0 003.75 21z" />
          </svg>
          <p className="mt-2 text-sm text-gray-500">
            Fotoğraf ve belge yükleme (demo sürümünde devre dışı)
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? "Gönderiliyor..." : "Etkinliği Gönder"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary"
          >
            İptal
          </button>
        </div>
      </form>
    </div>
  );
}
