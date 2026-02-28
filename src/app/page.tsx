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
          <div className="flex items-center gap-2">
            <Image
              src="/losev-logo.png"
              alt="LÖSEV Logo"
              width={110}
              height={44}
              className="object-contain"
            />
            <div className="flex items-end mt-2 ml-2">
              <span className="text-[1.8rem] xl:text-[2rem] font-black text-[#E30613] tracking-tighter leading-none" style={{ fontFamily: 'Arial, sans-serif' }}>
                İN
              </span>
              <span className="text-[1.8rem] xl:text-[2rem] font-black text-black tracking-tighter leading-none" style={{ fontFamily: 'Arial, sans-serif' }}>
                Cİ
              </span>
            </div>
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
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-20 overflow-hidden">
        {/* Full-width Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://newpageapi.losev.org.tr/losev/slider/1e4839b7-31e3-4c61-b163-7ca422530133.jpg"
            alt="LÖSEV gönüllülük çalışması"
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/60 to-gray-900/80" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 flex flex-col items-center text-center">
          <div className="animate-fade-in-up flex flex-col items-center">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold leading-[1.1] tracking-tight text-white drop-shadow-lg max-w-4xl">
              Küçük Eller,
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-red-400 via-rose-500 to-primary-400 bg-clip-text text-transparent ml-0 sm:ml-4">
                Büyük Yürekler
              </span>
            </h1>

            <p className="mt-8 text-lg sm:text-xl text-gray-200 leading-relaxed max-w-2xl font-medium drop-shadow-md">
              LÖSEV'in gücü, gönüllülerinin yüreğinde saklıdır. İnci öğrencileri olarak
              her bir gönüllülük saatini kaydet, öğretmen onayıyla belgele
              ve dijital sertifikanı kazan.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto">
              <Link
                href="/auth/register"
                className="group w-full sm:w-auto rounded-full bg-[#E30613] px-9 py-4 text-lg font-bold text-white shadow-xl shadow-red-900/50 hover:bg-red-700 hover:-translate-y-1 transition-all duration-300"
              >
                Gönüllü Ol
                <svg className="inline-block ml-2 w-5 h-5 transition-transform group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
              </Link>
              <Link
                href="/auth/login"
                className="w-full sm:w-auto rounded-full border-2 border-white/30 bg-black/20 backdrop-blur px-9 py-4 text-lg font-semibold text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300"
              >
                Giriş Yap
              </Link>
            </div>

            <div className="mt-14 flex items-center justify-center gap-4 text-sm font-medium text-gray-300 bg-black/30 backdrop-blur rounded-full pl-2 pr-6 py-2 border border-white/10">
              <div className="flex -space-x-3">
                {["bg-primary-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500"].map((c, i) => (
                  <div key={i} className={`w-10 h-10 rounded-full ${c} border-2 border-gray-900 flex items-center justify-center text-white text-xs font-bold shadow-md`}>
                    {["AV", "ZK", "EŞ", "SÖ"][i]}
                  </div>
                ))}
              </div>
              <span>250+ İnci öğrencisi aramıza katıldı</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-10 h-14 rounded-full border-2 border-white/30 flex items-start justify-center p-2 bg-black/20 backdrop-blur">
            <div className="w-1.5 h-3 bg-white rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* ====================== UNIFIED STATS & WORKFLOW ====================== */}
      <section className="relative z-20 -mt-16 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Stats Glass Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-20">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl shadow-gray-200/50 p-6 text-center border border-white">
              <div ref={stat1.ref} className="text-4xl sm:text-5xl font-extrabold text-[#E30613]">{stat1.count}+</div>
              <div className="mt-2 text-sm sm:text-base text-gray-600 font-semibold">İnci Öğrencisi</div>
            </div>
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl shadow-gray-200/50 p-6 text-center border border-white">
              <div ref={stat2.ref} className="text-4xl sm:text-5xl font-extrabold text-blue-600">{stat2.count.toLocaleString("tr-TR")}+</div>
              <div className="mt-2 text-sm sm:text-base text-gray-600 font-semibold">Gönüllülük Saati</div>
            </div>
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl shadow-gray-200/50 p-6 text-center border border-white">
              <div ref={stat3.ref} className="text-4xl sm:text-5xl font-extrabold text-emerald-600">{stat3.count}+</div>
              <div className="mt-2 text-sm sm:text-base text-gray-600 font-semibold">Aktif Okul</div>
            </div>
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl shadow-gray-200/50 p-6 text-center border border-white">
              <div ref={stat4.ref} className="text-4xl sm:text-5xl font-extrabold text-purple-600">{stat4.count}</div>
              <div className="mt-2 text-sm sm:text-base text-gray-600 font-semibold">İl Genelinde</div>
            </div>
          </div>

          {/* Unified Workflow Segment */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Tek Platform, Sınırsız İyilik</h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
              Öğrenciden genel merkeze herkesin ihtiyaç duyduğu araçlar. Kayıt ol, etkinlik ekle, öğretmeninden onay al ve dijital sertifikanla fark yarat!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-7 left-[12.5%] right-[12.5%] step-connector opacity-50" />
            {[
              { step: "01", title: "Kayıt Ol", gradient: "from-blue-500 to-blue-700", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /> },
              { step: "02", title: "Etkinlik Ekle", gradient: "from-emerald-500 to-emerald-700", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /> },
              { step: "03", title: "Onay Al", gradient: "from-amber-500 to-amber-700", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /> },
              { step: "04", title: "Sertifika Kazan", gradient: "from-purple-500 to-purple-700", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0 0 16.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 0 1-2.77.896m5.25-6.624V2.721" /> },
            ].map((item) => (
              <div key={item.step} className="relative flex flex-col items-center text-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-transform hover:-translate-y-2 hover:shadow-xl group">
                <div className={`relative z-10 w-16 h-16 rounded-full bg-gradient-to-br ${item.gradient} shadow-lg flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">{item.icon}</svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                <span className="absolute top-4 right-4 text-4xl font-black text-gray-50 opacity-40 select-none">{item.step}</span>
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
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block rounded-full bg-purple-50 border border-purple-100 px-4 py-1 text-sm font-semibold text-purple-600 mb-4">
              Kapsayıcı İyilik Platformu
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Gönüllülükte Yeni Bir Boyut
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Öğrenciler",
                subtitle: "Geleceğin İncileri",
                desc: "Saatlerini takip et, dijital sertifikanı oluştur ve toplum için fark yarat.",
                gradient: "from-blue-500 to-blue-700",
                bgLight: "bg-blue-50/50 hover:bg-blue-50",
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />,
              },
              {
                title: "Öğretmenler",
                subtitle: "Kılavuz Gönüllüler",
                desc: "Öğrencilerinin faaliyetlerini yönet, okul bazlı harika başarılara imza at.",
                gradient: "from-emerald-500 to-emerald-700",
                bgLight: "bg-emerald-50/50 hover:bg-emerald-50",
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />,
              },
              {
                title: "Genel Merkez",
                subtitle: "LÖSEV Yönetim",
                desc: "Türkiye genelindeki 10 milyon gönüllü hedefine doğru istatistikleri ve genel etkiyi raporla.",
                gradient: "from-purple-500 to-purple-700",
                bgLight: "bg-purple-50/50 hover:bg-purple-50",
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 4.5H21m-3.75 4.5H21" />,
              },
            ].map((role, i) => (
              <div key={i} className={`rounded-2xl ${role.bgLight} border border-gray-100 p-8 transition-all hover:shadow-xl hover:-translate-y-2 text-center flex flex-col items-center group cursor-default`}>
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${role.gradient} shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">{role.icon}</svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{role.title}</h3>
                <p className="text-sm font-medium text-gray-500 mb-3">{role.subtitle}</p>
                <p className="text-sm text-gray-700 leading-relaxed max-w-[250px]">{role.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== CTA ====================== */}
      {/* ====================== CTA ====================== */}
      <section className="relative py-20 bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight">
            İyilik Serüvenine Başla
          </h2>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
            10 Milyonuncu gönüllümüz olmak ve LÖSEV İncileri arasındaki yerini almak için şimdi adım at.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="w-full sm:w-auto rounded-full bg-[#E30613] px-10 py-4 text-lg font-bold text-white shadow-xl shadow-red-900/50 hover:bg-red-700 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
            >
              Hemen Kayıt Ol
              <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
            </Link>
            <Link
              href="/auth/login"
              className="w-full sm:w-auto rounded-full border-2 border-white/20 bg-white/5 backdrop-blur px-10 py-4 text-lg font-semibold text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300"
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
