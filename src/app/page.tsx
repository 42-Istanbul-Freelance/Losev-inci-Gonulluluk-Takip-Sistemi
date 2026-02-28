"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      const role = session.user.role.toLowerCase();
      router.push(`/${role}/dashboard`);
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50">
      <nav className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Image src="/losev-logo.png" alt="LÖSEV Logo" width={100} height={40} className="object-contain" />
          <span className="text-xl font-bold text-gray-900">
            LÖSEV İnci
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="btn-secondary">
            Giriş Yap
          </Link>
          <Link href="/auth/register" className="btn-primary">
            Kayıt Ol
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-700 mb-6">
            Gönüllülük Takip Sistemi
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
            Gönüllülüğünü{" "}
            <span className="text-primary-600">Kaydet</span>,{" "}
            <span className="text-primary-600">Takip Et</span>,{" "}
            <span className="text-primary-600">Belgele</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            LÖSEV İnci öğrencilerinin sosyal sorumluluk çalışmalarını kayıt
            altına alan, öğretmen onayından geçiren ve dijital sertifika üreten
            takip sistemi.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/auth/register" className="btn-primary text-base px-8 py-3">
              Hemen Başla
            </Link>
            <Link href="/auth/login" className="btn-secondary text-base px-8 py-3">
              Giriş Yap
            </Link>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Saat Takibi</h3>
            <p className="text-gray-600 text-sm">
              Gönüllülük saatlerini otomatik olarak hesapla, aylık ve yıllık
              hedeflerini takip et.
            </p>
          </div>
          <div className="card text-center">
            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.745 3.745 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Onay Sistemi</h3>
            <p className="text-gray-600 text-sm">
              Koordinatör öğretmen onayı ile güvenilir ve doğrulanmış gönüllülük
              kayıtları.
            </p>
          </div>
          <div className="card text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0 0 16.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 0 1-2.77.896m5.25-6.624V2.721" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Dijital Sertifika</h3>
            <p className="text-gray-600 text-sm">
              Bronz, Gümüş, Altın ve Platin rozet seviyeleri ile dijital
              gönüllülük sertifikası.
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="card py-8">
            <div className="text-3xl font-bold text-primary-600">25+</div>
            <div className="text-sm text-gray-500 mt-1">Bronz İnci</div>
          </div>
          <div className="card py-8">
            <div className="text-3xl font-bold text-gray-400">50+</div>
            <div className="text-sm text-gray-500 mt-1">Gümüş İnci</div>
          </div>
          <div className="card py-8">
            <div className="text-3xl font-bold text-yellow-500">100+</div>
            <div className="text-sm text-gray-500 mt-1">Altın İnci</div>
          </div>
          <div className="card py-8">
            <div className="text-3xl font-bold text-purple-500">200+</div>
            <div className="text-sm text-gray-500 mt-1">Platin İnci</div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-500">
          LÖSEV İnci Gönüllülük Takip Sistemi &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
