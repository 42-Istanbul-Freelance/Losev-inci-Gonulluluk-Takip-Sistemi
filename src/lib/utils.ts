export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export const ACTIVITY_TYPES: Record<string, string> = {
  SEMINER: "Seminer",
  STANT: "Stant",
  BAGIS: "Bağış",
  KERMES: "Kermes",
  KAMUSAL_BILINCLENDIRME: "Kamuoyu Bilinçlendirme",
  SOSYAL_MEDYA: "Sosyal Medya Çalışması",
  FARKINDALIK: "Farkındalık Etkinliği",
  DIGER: "Diğer",
};

export const STATUS_LABELS: Record<string, string> = {
  PENDING: "Onay Bekliyor",
  APPROVED: "Onaylandı",
  REJECTED: "Reddedildi",
  REVISION_REQUESTED: "Düzenleme İstendi",
};

export const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  REVISION_REQUESTED: "bg-orange-100 text-orange-800",
};

export const BADGE_LABELS: Record<string, string> = {
  NONE: "Rozet Yok",
  BRONZE: "Bronz İnci",
  SILVER: "Gümüş İnci",
  GOLD: "Altın İnci",
  PLATINUM: "Platin İnci Lideri",
};

export const BADGE_COLORS: Record<string, string> = {
  NONE: "text-gray-400",
  BRONZE: "text-amber-700",
  SILVER: "text-gray-400",
  GOLD: "text-yellow-500",
  PLATINUM: "text-purple-500",
};

export const BADGE_THRESHOLDS = [
  { level: "PLATINUM", hours: 200 },
  { level: "GOLD", hours: 100 },
  { level: "SILVER", hours: 50 },
  { level: "BRONZE", hours: 25 },
];

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatHours(hours: number): string {
  return hours % 1 === 0 ? hours.toString() : hours.toFixed(1);
}
