"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!session) return null;

  const role = session.user.role;
  const basePath = `/${role.toLowerCase()}`;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href={`${basePath}/dashboard`} className="flex items-center gap-3">
          <Image src="/losev-logo.png" alt="LÖSEV Logo" width={90} height={36} className="object-contain" />
          <span className="font-bold text-gray-900 hidden sm:block">
            LÖSEV İnci
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavLinks role={role} basePath={basePath} />
        </nav>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium text-gray-900">{session.user.name}</div>
            <div className="text-xs text-gray-500">
              {role === "STUDENT" ? "Öğrenci" : role === "TEACHER" ? "Öğretmen" : "Yönetici"}
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Çıkış
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3">
          <nav className="flex flex-col gap-1">
            <NavLinks role={role} basePath={basePath} onClick={() => setMenuOpen(false)} />
          </nav>
        </div>
      )}
    </header>
  );
}

function NavLinks({
  role,
  basePath,
  onClick,
}: {
  role: string;
  basePath: string;
  onClick?: () => void;
}) {
  const links =
    role === "STUDENT"
      ? [
          { href: `${basePath}/dashboard`, label: "Panel" },
          { href: `${basePath}/activities`, label: "Etkinliklerim" },
          { href: `${basePath}/activities/new`, label: "Etkinlik Ekle" },
          { href: `${basePath}/profile`, label: "Profil" },
          { href: `${basePath}/certificate`, label: "Sertifika" },
        ]
      : role === "TEACHER"
      ? [
          { href: `${basePath}/dashboard`, label: "Panel" },
          { href: `${basePath}/activities`, label: "Onay Bekleyenler" },
          { href: `${basePath}/students`, label: "Öğrenciler" },
          { href: `${basePath}/reports`, label: "Raporlar" },
        ]
      : [
          { href: `${basePath}/dashboard`, label: "Panel" },
          { href: `${basePath}/schools`, label: "Okullar" },
          { href: `${basePath}/students`, label: "Öğrenciler" },
          { href: `${basePath}/cities`, label: "İller" },
          { href: `${basePath}/reports`, label: "Raporlar" },
        ];

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onClick}
          className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          {link.label}
        </Link>
      ))}
    </>
  );
}
