import { cn, BADGE_LABELS, BADGE_COLORS } from "@/lib/utils";

interface BadgeDisplayProps {
  level: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const BADGE_ICONS: Record<string, string> = {
  NONE: "○",
  BRONZE: "🥉",
  SILVER: "🥈",
  GOLD: "🥇",
  PLATINUM: "💎",
};

const BADGE_BG: Record<string, string> = {
  NONE: "bg-gray-100",
  BRONZE: "bg-amber-50 border-amber-200",
  SILVER: "bg-gray-50 border-gray-300",
  GOLD: "bg-yellow-50 border-yellow-300",
  PLATINUM: "bg-purple-50 border-purple-200",
};

const sizeClasses = {
  sm: "w-8 h-8 text-lg",
  md: "w-14 h-14 text-2xl",
  lg: "w-20 h-20 text-4xl",
};

export function BadgeDisplay({ level, size = "md", showLabel = true }: BadgeDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          "rounded-full border-2 flex items-center justify-center",
          BADGE_BG[level] || BADGE_BG.NONE,
          sizeClasses[size]
        )}
      >
        {BADGE_ICONS[level] || BADGE_ICONS.NONE}
      </div>
      {showLabel && (
        <span
          className={cn(
            "text-sm font-semibold",
            BADGE_COLORS[level] || BADGE_COLORS.NONE
          )}
        >
          {BADGE_LABELS[level] || "Rozet Yok"}
        </span>
      )}
    </div>
  );
}
