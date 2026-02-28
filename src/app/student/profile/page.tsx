"use client";

import { useEffect, useState } from "react";
import { BadgeDisplay } from "@/components/BadgeDisplay";
import { formatHours } from "@/lib/utils";

export default function StudentProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/students/profile")
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/students/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        phone: formData.get("phone"),
        grade: formData.get("grade"),
        targetHours: Number(formData.get("targetHours")),
      }),
    });

    if (res.ok) {
      setMessage("Profil güncellendi");
    } else {
      setMessage("Güncelleme sırasında hata oluştu");
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
    );
  }

  const student = profile?.student;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Profilim</h1>

      <div className="card flex items-center gap-6">
        <BadgeDisplay level={student?.badgeLevel ?? "NONE"} size="lg" />
        <div>
          <h2 className="text-xl font-bold text-gray-900">{profile?.name}</h2>
          <p className="text-gray-500">
            {student?.school?.name} - {student?.grade}. Sınıf
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Toplam: {formatHours(student?.totalHours ?? 0)} saat
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        {message && (
          <div
            className={`rounded-lg p-3 text-sm ${
              message.includes("hata")
                ? "bg-red-50 border border-red-200 text-red-700"
                : "bg-green-50 border border-green-200 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="name" className="label">Ad Soyad</label>
            <input
              id="name"
              name="name"
              defaultValue={profile?.name}
              required
              className="input"
            />
          </div>
          <div>
            <label htmlFor="email" className="label">E-posta</label>
            <input
              id="email"
              value={profile?.email}
              disabled
              className="input bg-gray-50 text-gray-500"
            />
          </div>
          <div>
            <label htmlFor="phone" className="label">Telefon</label>
            <input
              id="phone"
              name="phone"
              defaultValue={profile?.phone ?? ""}
              className="input"
            />
          </div>
          <div>
            <label htmlFor="grade" className="label">Sınıf</label>
            <select
              id="grade"
              name="grade"
              defaultValue={student?.grade}
              className="select"
            >
              {["5", "6", "7", "8", "9", "10", "11", "12"].map((g) => (
                <option key={g} value={g}>{g}. Sınıf</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="targetHours" className="label">Hedef Saat</label>
            <input
              id="targetHours"
              name="targetHours"
              type="number"
              min={10}
              max={500}
              defaultValue={student?.targetHours ?? 30}
              className="input"
            />
          </div>
          <div>
            <label className="label">Okul</label>
            <input
              value={`${student?.school?.name} (${student?.school?.city}/${student?.school?.district})`}
              disabled
              className="input bg-gray-50 text-gray-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
}
