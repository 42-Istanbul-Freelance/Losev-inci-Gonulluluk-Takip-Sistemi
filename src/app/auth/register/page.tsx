"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"STUDENT" | "TEACHER">("STUDENT");
  const [schools, setSchools] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/schools")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setSchools(data);
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        role,
        phone: formData.get("phone"),
        schoolId: formData.get("schoolId"),
        grade: formData.get("grade"),
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Kayıt sırasında hata oluştu");
      setLoading(false);
    } else {
      router.push("/auth/login?registered=true");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-blue-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image src="/losev-logo.png" alt="LÖSEV Logo" width={120} height={48} className="object-contain" />
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Kayıt Ol</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gönüllülük takip sistemine katıl
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-5">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="label">Rol</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRole("STUDENT")}
                className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${
                  role === "STUDENT"
                    ? "border-primary-600 bg-primary-50 text-primary-700"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                Öğrenci
              </button>
              <button
                type="button"
                onClick={() => setRole("TEACHER")}
                className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${
                  role === "TEACHER"
                    ? "border-primary-600 bg-primary-50 text-primary-700"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                Öğretmen
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="name" className="label">Ad Soyad</label>
            <input id="name" name="name" required className="input" placeholder="Adınız Soyadınız" />
          </div>

          <div>
            <label htmlFor="email" className="label">E-posta</label>
            <input id="email" name="email" type="email" required className="input" placeholder="ornek@email.com" />
          </div>

          <div>
            <label htmlFor="password" className="label">Şifre</label>
            <input id="password" name="password" type="password" required minLength={6} className="input" placeholder="En az 6 karakter" />
          </div>

          <div>
            <label htmlFor="phone" className="label">Telefon (opsiyonel)</label>
            <input id="phone" name="phone" className="input" placeholder="05XX XXX XX XX" />
          </div>

          <div>
            <label htmlFor="schoolId" className="label">Okul</label>
            <select id="schoolId" name="schoolId" required className="select">
              <option value="">Okul seçin</option>
              {schools.map((s: any) => (
                <option key={s.id} value={s.id}>
                  {s.name} - {s.city}/{s.district}
                </option>
              ))}
            </select>
          </div>

          {role === "STUDENT" && (
            <div>
              <label htmlFor="grade" className="label">Sınıf</label>
              <select id="grade" name="grade" required className="select">
                <option value="">Sınıf seçin</option>
                {["5", "6", "7", "8", "9", "10", "11", "12"].map((g) => (
                  <option key={g} value={g}>{g}. Sınıf</option>
                ))}
              </select>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Zaten hesabınız var mı?{" "}
            <Link href="/auth/login" className="font-medium text-primary-600 hover:text-primary-500">
              Giriş Yap
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
