"use client";

import { useEffect, useState, useRef } from "react";
import { BadgeDisplay } from "@/components/BadgeDisplay";
import { BADGE_LABELS, BADGE_THRESHOLDS, formatHours } from "@/lib/utils";

export default function CertificatePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/students/profile")
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      });
  }, []);

  async function handleDownload() {
    const { jsPDF } = await import("jspdf");
    const student = profile?.student;
    const badgeLevel = student?.badgeLevel ?? "NONE";

    if (badgeLevel === "NONE") return;

    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

    pdf.setFillColor(37, 99, 235);
    pdf.rect(0, 0, 297, 210, "F");

    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(15, 15, 267, 180, 5, 5, "F");

    pdf.setFontSize(14);
    pdf.setTextColor(37, 99, 235);
    pdf.text("LÖSEV İnci Gönüllülük Takip Sistemi", 148.5, 40, { align: "center" });

    pdf.setFontSize(28);
    pdf.setTextColor(30, 41, 59);
    pdf.text("GÖNÜLLÜLÜK SERTİFİKASI", 148.5, 60, { align: "center" });

    pdf.setFontSize(12);
    pdf.setTextColor(100, 116, 139);
    pdf.text("Bu sertifika ile tasdik olunur ki", 148.5, 78, { align: "center" });

    pdf.setFontSize(22);
    pdf.setTextColor(30, 41, 59);
    pdf.text(profile?.name ?? "", 148.5, 95, { align: "center" });

    pdf.setFontSize(12);
    pdf.setTextColor(100, 116, 139);
    pdf.text(
      `${student?.school?.name ?? ""} - ${student?.grade}. Sınıf`,
      148.5,
      108,
      { align: "center" }
    );

    pdf.setFontSize(14);
    pdf.setTextColor(30, 41, 59);
    pdf.text(
      `toplam ${formatHours(student?.totalHours ?? 0)} saat gönüllülük çalışması gerçekleştirmiştir.`,
      148.5,
      125,
      { align: "center" }
    );

    pdf.setFontSize(20);
    pdf.setTextColor(37, 99, 235);
    pdf.text(`${BADGE_LABELS[badgeLevel]}`, 148.5, 145, { align: "center" });

    pdf.setFontSize(10);
    pdf.setTextColor(148, 163, 184);
    const today = new Date().toLocaleDateString("tr-TR");
    pdf.text(`Düzenlenme Tarihi: ${today}`, 148.5, 170, { align: "center" });

    pdf.save(`losev-inci-sertifika-${profile?.name?.replace(/\s/g, "-")}.pdf`);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
    );
  }

  const student = profile?.student;
  const badgeLevel = student?.badgeLevel ?? "NONE";
  const totalHours = student?.totalHours ?? 0;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Sertifika & Rozetler</h1>

      {/* Current badge */}
      <div className="card text-center py-10">
        <BadgeDisplay level={badgeLevel} size="lg" />
        <p className="mt-4 text-lg font-semibold text-gray-900">
          {profile?.name}
        </p>
        <p className="text-gray-500">
          Toplam {formatHours(totalHours)} saat gönüllülük
        </p>
        {badgeLevel !== "NONE" && (
          <button onClick={handleDownload} className="btn-primary mt-6">
            Sertifikayı İndir (PDF)
          </button>
        )}
        {badgeLevel === "NONE" && (
          <p className="mt-4 text-sm text-gray-400">
            Sertifika almak için en az 25 saat onaylı gönüllülük gereklidir.
          </p>
        )}
      </div>

      {/* Badge levels */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Rozet Seviyeleri</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { level: "BRONZE", hours: 25, color: "border-amber-300 bg-amber-50" },
            { level: "SILVER", hours: 50, color: "border-gray-300 bg-gray-50" },
            { level: "GOLD", hours: 100, color: "border-yellow-300 bg-yellow-50" },
            { level: "PLATINUM", hours: 200, color: "border-purple-300 bg-purple-50" },
          ].map((b) => {
            const earned = totalHours >= b.hours;
            return (
              <div
                key={b.level}
                className={`rounded-xl border-2 p-6 text-center transition-all ${
                  earned ? b.color : "border-gray-200 bg-white opacity-50"
                }`}
              >
                <BadgeDisplay level={b.level} size="md" />
                <p className="mt-2 text-sm font-medium text-gray-600">
                  {b.hours}+ saat
                </p>
                {earned && (
                  <span className="mt-2 inline-block text-xs font-medium text-green-600 bg-green-50 rounded-full px-2 py-0.5">
                    Kazanıldı
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
