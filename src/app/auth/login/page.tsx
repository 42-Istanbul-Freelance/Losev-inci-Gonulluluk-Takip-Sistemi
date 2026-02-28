"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (res?.error) {
      setError("E-posta veya şifre hatalı");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-blue-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image src="/losev-logo.png" alt="LÖSEV Logo" width={120} height={48} className="object-contain" />
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Giriş Yap</h1>
          <p className="mt-1 text-sm text-gray-500">
            LÖSEV İnci Gönüllülük Takip Sistemi
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-5">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="label">E-posta</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="input"
              placeholder="ornek@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="label">Şifre</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="input"
              placeholder="Şifrenizi girin"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Hesabınız yok mu?{" "}
            <Link href="/auth/register" className="font-medium text-primary-600 hover:text-primary-500">
              Kayıt Ol
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
