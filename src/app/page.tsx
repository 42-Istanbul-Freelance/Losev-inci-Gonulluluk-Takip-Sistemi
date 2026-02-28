"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return { count, ref };
}

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const stat1 = useCountUp(250);
  const stat2 = useCountUp(4800);
  const stat3 = useCountUp(42);
  const stat4 = useCountUp(18);

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
    <div className="min-h-screen bg-white overflow-hidden">
      {/* ====================== NAVBAR ====================== */}
      <nav className="relative z-50 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Image
              src="/losev-logo.png"
              alt="LÖSEV Logo"
              width={110}
              height={44}
              className="object-contain"
            />
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="rounded-full border border-gray-200 bg-white/80 backdrop-blur px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
            >
              Giriş Yap
            </Link>
            <Link
              href="/auth/register"
              className="rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 hover:bg-primary-700 transition-all"
            >
              Kayıt Ol
            </Link>
          </div>
        </div>
      </nav>

      {/* ====================== HERO ====================== */}
      <section className="relative pt-8 pb-20 lg:pt-16 lg:pb-32">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-primary-100 via-blue-50 to-purple-100 blob opacity-40 -translate-y-1/4 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-rose-100 via-orange-50 to-yellow-100 blob opacity-30 translate-y-1/4 -translate-x-1/4 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: text */}
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-100 px-4 py-1.5 text-sm font-medium text-primary-700 mb-6">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              LÖSEV İnci Gönüllülük Takip Sistemi
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.1] tracking-tight text-gray-900">
              Küçük Eller,
              <br />
              <span className="bg-gradient-to-r from-primary-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Büyük Yürekler
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-xl">
              LÖSEV&apos;in gücü, gönüllülerinin yüreğinde saklıdır. İnci öğrencileri olarak
              her bir gönüllülük saatini kaydet, öğretmen onayıyla belgele
              ve dijital sertifikanı kazan.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/auth/register"
                className="group rounded-full bg-primary-600 px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-primary-600/20 hover:bg-primary-700 hover:shadow-primary-700/25 transition-all"
              >
                Gönüllü Ol
                <svg className="inline-block ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
              </Link>
              <Link
                href="/auth/login"
                className="rounded-full border-2 border-gray-200 px-7 py-3.5 text-base font-semibold text-gray-700 hover:border-primary-200 hover:bg-primary-50/50 transition-all"
              >
                Giriş Yap
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-4 text-sm text-gray-500">
              <div className="flex -space-x-2">
                {["bg-primary-400", "bg-emerald-400", "bg-amber-400", "bg-rose-400"].map((c, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-white flex items-center justify-center text-white text-[10px] font-bold`}>
                    {["AV", "ZK", "EŞ", "SÖ"][i]}
                  </div>
                ))}
              </div>
              <span>250+ İnci öğrencisi katıldı</span>
            </div>
          </div>

          {/* Right: image collage */}
          <div className="relative hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-lg">
              {/* Main image */}
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl shadow-primary-900/20 rotate-1 hover:rotate-0 transition-transform duration-500">
                <img
                  src="https://newpageapi.losev.org.tr/losev/slider/1e4839b7-31e3-4c61-b163-7ca422530133.jpg"
                  alt="LÖSEV gönüllülük çalışması"
                  className="w-full h-[340px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>

              {/* Secondary image - offset */}
              <div className="absolute -bottom-8 -left-8 z-20 rounded-2xl overflow-hidden shadow-xl -rotate-3 hover:rotate-0 transition-transform duration-500 border-4 border-white">
                <img
                  src="https://newpageapi.losev.org.tr/losev/slider/944f2d90-b1c1-40f2-a764-af94e6dc5571.jpg"
                  alt="LÖSEV İnci öğrencileri"
                  className="w-48 h-36 object-cover"
                />
              </div>

              {/* Small floating decorative icons */}
              <div className="absolute -top-4 -right-4 z-30 animate-float">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 shadow-lg shadow-rose-400/30 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                </div>
              </div>

              <div className="absolute top-1/2 -right-6 z-30 animate-float-reverse delay-300">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-400/30 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                </div>
              </div>

              {/* Badge overlay */}
              <div className="absolute -top-3 left-6 z-30 bg-white rounded-full px-4 py-2 shadow-lg border border-gray-100 flex items-center gap-2">
                <span className="text-lg">🎓</span>
                <span className="text-xs font-bold text-gray-700">LÖSEV İncileri</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================== IMPACT STATS ====================== */}
      <section className="relative py-16 bg-gradient-to-r from-primary-600 via-blue-600 to-indigo-700">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="white" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,202.7C672,203,768,181,864,170.7C960,160,1056,160,1152,170.7C1248,181,1344,203,1392,213.3L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div ref={stat1.ref}>
              <div className="text-4xl sm:text-5xl font-extrabold">{stat1.count}+</div>
              <div className="mt-2 text-sm sm:text-base text-blue-100 font-medium">İnci Öğrencisi</div>
            </div>
            <div ref={stat2.ref}>
              <div className="text-4xl sm:text-5xl font-extrabold">{stat2.count.toLocaleString("tr-TR")}+</div>
              <div className="mt-2 text-sm sm:text-base text-blue-100 font-medium">Gönüllülük Saati</div>
            </div>
            <div ref={stat3.ref}>
              <div className="text-4xl sm:text-5xl font-extrabold">{stat3.count}+</div>
              <div className="mt-2 text-sm sm:text-base text-blue-100 font-medium">Aktif Okul</div>
            </div>
            <div ref={stat4.ref}>
              <div className="text-4xl sm:text-5xl font-extrabold">{stat4.count}</div>
              <div className="mt-2 text-sm sm:text-base text-blue-100 font-medium">İl Genelinde</div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================== LOSEV INCI BANNER ====================== */}
      <section className="py-12 bg-gradient-to-r from-primary-50 via-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative rounded-2xl bg-white/80 backdrop-blur border border-primary-100 p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 shadow-sm">
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center shadow-lg">
              <span className="text-3xl">💎</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">LÖSEV İncileri Projesi</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Geleceğin duyarlı bireylerini yetiştirmek için küçük yaşlardan itibaren çocuklara ve gençlere
                dokunan uzun soluklu bir iyilik yolculuğu. LÖSEV İnci öğrencileri, gönüllülük çalışmalarıyla
                topluma değer katıyor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================== HOW IT WORKS ====================== */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block rounded-full bg-primary-50 border border-primary-100 px-4 py-1 text-sm font-semibold text-primary-600 mb-4">
              Nasıl Çalışır?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Dört adımda gönüllülüğünü belgele
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-7 left-[12.5%] right-[12.5%] step-connector" />

            {[
              {
                step: "01",
                title: "Kayıt Ol",
                desc: "Okulunu seç, profilini oluştur ve sisteme hemen katıl.",
                gradient: "from-primary-500 to-blue-600",
                icon: (
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
                ),
              },
              {
                step: "02",
                title: "Etkinlik Ekle",
                desc: "Yaptığın gönüllülük çalışmasını tarih, tür ve süre ile kaydet.",
                gradient: "from-emerald-500 to-teal-600",
                icon: (
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                ),
              },
              {
                step: "03",
                title: "Öğretmen Onayı",
                desc: "Koordinatör öğretmenin etkinliğini inceler ve onaylar.",
                gradient: "from-amber-500 to-orange-600",
                icon: (
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                ),
              },
              {
                step: "04",
                title: "Rozet Kazan",
                desc: "Saatlerin biriktikçe rozetini yükselt ve sertifikanı indir.",
                gradient: "from-purple-500 to-indigo-600",
                icon: (
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0 0 16.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 0 1-2.77.896m5.25-6.624V2.721" /></svg>
                ),
              },
            ].map((item) => (
              <div key={item.step} className="relative flex flex-col items-center text-center">
                <div className={`relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} shadow-lg flex items-center justify-center mb-5`}>
                  {item.icon}
                </div>
                <span className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-1">Adım {item.step}</span>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-[220px]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== FEATURES ====================== */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block rounded-full bg-emerald-50 border border-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-600 mb-4">
              Özellikler
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Her şey tek platformda
            </h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              Öğrenciden genel merkeze kadar herkesin ihtiyaç duyduğu tüm araçlar
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Saat Takibi",
                desc: "Toplam, aylık ve yıllık gönüllülük saatlerini otomatik hesapla. Hedefine ne kadar yakın olduğunu gör.",
                iconBg: "bg-blue-50",
                iconColor: "text-blue-600",
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
              },
              {
                title: "Öğretmen Onayı",
                desc: "Koordinatör öğretmenin etkinliklerini inceler, onaylar veya düzenleme talep eder. Güvenilir kayıtlar.",
                iconBg: "bg-emerald-50",
                iconColor: "text-emerald-600",
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.745 3.745 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />,
              },
              {
                title: "Dijital Sertifika",
                desc: "Rozet seviyene göre PDF sertifika oluştur. Üniversite başvurularında kullanılabilecek resmi belge.",
                iconBg: "bg-amber-50",
                iconColor: "text-amber-600",
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0 0 16.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 0 1-2.77.896m5.25-6.624V2.721" />,
              },
              {
                title: "Okul Raporları",
                desc: "Okul bazlı toplam saat, öğrenci başarıları ve performans grafikleriyle anlık takip.",
                iconBg: "bg-purple-50",
                iconColor: "text-purple-600",
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />,
              },
              {
                title: "İl Bazlı Analiz",
                desc: "Türkiye genelindeki gönüllülük etkisini il bazında görüntüle. Etki haritasını keşfet.",
                iconBg: "bg-rose-50",
                iconColor: "text-rose-600",
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />,
              },
              {
                title: "Mobil Uyumlu",
                desc: "Telefon, tablet veya bilgisayar — her cihazdan kolayca erişim. Her yerde yanında.",
                iconBg: "bg-cyan-50",
                iconColor: "text-cyan-600",
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />,
              },
            ].map((f, i) => (
              <div key={i} className="feature-card group">
                <div className={`w-14 h-14 rounded-2xl ${f.iconBg} flex items-center justify-center mb-5 transition-transform group-hover:scale-110`}>
                  <svg className={`w-7 h-7 ${f.iconColor}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">{f.icon}</svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== BADGE JOURNEY ====================== */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block rounded-full bg-amber-50 border border-amber-100 px-4 py-1 text-sm font-semibold text-amber-600 mb-4">
              Rozet Yolculuğu
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Her saat, seni bir adım ileriye taşır
            </h2>
            <p className="mt-4 text-gray-500 max-w-xl mx-auto">
              Gönüllülük saatlerin biriktikçe rozet seviyen yükselir.
              Her rozet, bir başarı hikayesidir.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { level: "Bronz İnci", hours: "25+ saat", emoji: "🥉", bg: "from-amber-100 to-orange-50", border: "border-amber-200", text: "text-amber-800", ring: "ring-amber-300" },
              { level: "Gümüş İnci", hours: "50+ saat", emoji: "🥈", bg: "from-gray-100 to-slate-50", border: "border-gray-300", text: "text-gray-700", ring: "ring-gray-300" },
              { level: "Altın İnci", hours: "100+ saat", emoji: "🥇", bg: "from-yellow-100 to-amber-50", border: "border-yellow-300", text: "text-yellow-800", ring: "ring-yellow-300" },
              { level: "Platin İnci Lideri", hours: "200+ saat", emoji: "💎", bg: "from-purple-100 to-indigo-50", border: "border-purple-200", text: "text-purple-800", ring: "ring-purple-300" },
            ].map((b, i) => (
              <div
                key={i}
                className={`relative rounded-2xl bg-gradient-to-b ${b.bg} border-2 ${b.border} p-6 text-center transition-all hover:scale-105 hover:ring-4 ${b.ring}/30`}
              >
                <div className="text-5xl mb-4">{b.emoji}</div>
                <h3 className={`text-base font-bold ${b.text} mb-1`}>{b.level}</h3>
                <p className="text-sm text-gray-500 font-medium">{b.hours}</p>
                {i < 3 && (
                  <div className="hidden md:block absolute -right-5 top-1/2 -translate-y-1/2 text-gray-300 z-10">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" /></svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== WHO USES THIS ====================== */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block rounded-full bg-purple-50 border border-purple-100 px-4 py-1 text-sm font-semibold text-purple-600 mb-4">
              Hedef Kitle
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Herkes için tasarlandı
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Öğrenciler",
                subtitle: "Ortaokul & Lise",
                desc: "Gönüllülük çalışmalarını kaydet, saatlerini takip et, rozetlerini biriktir ve dijital sertifikanı oluştur.",
                gradient: "from-primary-500 to-blue-600",
                bgLight: "bg-blue-50",
                features: ["Etkinlik ekleme ve takip", "Saat hedefi belirleme", "Rozet ve sertifika kazanma", "İlerleme grafiği"],
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" /></svg>
                ),
              },
              {
                title: "Öğretmenler",
                subtitle: "Koordinatör",
                desc: "Öğrencilerin etkinliklerini onayla, okul bazlı performansı takip et ve raporları incele.",
                gradient: "from-emerald-500 to-teal-600",
                bgLight: "bg-emerald-50",
                features: ["Etkinlik onay/red sistemi", "Öğrenci saat takibi", "Okul performans grafiği", "Düzenleme talep etme"],
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
                ),
              },
              {
                title: "Genel Merkez",
                subtitle: "LÖSEV Yönetimi",
                desc: "Türkiye genelindeki gönüllülük verilerini analiz et, okul ve il bazlı sıralamaları gör.",
                gradient: "from-purple-500 to-indigo-600",
                bgLight: "bg-purple-50",
                features: ["Türkiye geneli istatistik", "Okul/il bazlı sıralama", "En aktif öğrenci listeleri", "Aylık etki raporları"],
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 4.5H21m-3.75 4.5H21" /></svg>
                ),
              },
            ].map((role, i) => (
              <div key={i} className={`rounded-2xl ${role.bgLight} border border-gray-100 p-8 transition-all hover:shadow-xl hover:-translate-y-1`}>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.gradient} shadow-lg flex items-center justify-center mb-6`}>
                  {role.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{role.title}</h3>
                <p className="text-sm font-medium text-gray-400 mb-3">{role.subtitle}</p>
                <p className="text-sm text-gray-600 leading-relaxed mb-5">{role.desc}</p>
                <ul className="space-y-2.5">
                  {role.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2.5 text-sm text-gray-700">
                      <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== CTA ====================== */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <img
          src="https://newpageapi.losev.org.tr/losev/slider/944f2d90-b1c1-40f2-a764-af94e6dc5571.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 via-blue-800/85 to-indigo-900/90" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <div className="text-5xl mb-6">🌟</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            Her adımınız, yeni bir
            <br />
            hayatın başlangıcı olsun
          </h2>
          <p className="mt-5 text-lg text-blue-100 max-w-xl mx-auto leading-relaxed">
            10 milyonuncu gönüllümüz ol! Her bir gönüllülük saati,
            lösemili bir çocuğun hayatına dokunuyor. Hemen kaydol, fark yaratmaya başla.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="rounded-full bg-white px-8 py-4 text-base font-bold text-primary-700 shadow-xl hover:bg-gray-50 transition-all"
            >
              Hemen Kayıt Ol
            </Link>
            <Link
              href="/auth/login"
              className="rounded-full border-2 border-white/30 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-all"
            >
              Giriş Yap
            </Link>
          </div>
        </div>
      </section>

      {/* ====================== FOOTER ====================== */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="md:col-span-2">
              <Image
                src="/losev-logo.png"
                alt="LÖSEV Logo"
                width={120}
                height={48}
                className="object-contain brightness-0 invert opacity-80 mb-4"
              />
              <p className="text-sm leading-relaxed max-w-sm">
                LÖSEV İnci Gönüllülük Takip Sistemi, İnci öğrencilerinin sosyal sorumluluk
                çalışmalarını kayıt altına alır, doğrular ve raporlar.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Hızlı Erişim</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/auth/login" className="hover:text-white transition-colors">Giriş Yap</Link></li>
                <li><Link href="/auth/register" className="hover:text-white transition-colors">Kayıt Ol</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Hakkında</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="https://www.losev.org.tr" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LÖSEV Resmi Site</a></li>
                <li><span>İletişim: info@losev.org.tr</span></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} LÖSEV İnci Gönüllülük Takip Sistemi. Tüm hakları saklıdır.
            </p>
            <p className="text-xs text-gray-500">
              Lösemili Çocuklar Sağlık ve Eğitim Vakfı
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
