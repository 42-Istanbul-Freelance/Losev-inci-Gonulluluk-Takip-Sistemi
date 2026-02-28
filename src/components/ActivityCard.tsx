import { ACTIVITY_TYPES, STATUS_LABELS, STATUS_COLORS, formatDate, formatHours, cn } from "@/lib/utils";

interface ActivityCardProps {
  activity: {
    id: string;
    date: string;
    type: string;
    hours: number;
    description: string;
    status: string;
    reviewNote?: string | null;
    createdAt: string;
  };
  showActions?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onRevision?: (id: string) => void;
}

export function ActivityCard({
  activity,
  showActions,
  onApprove,
  onReject,
  onRevision,
}: ActivityCardProps) {
  return (
    <div className="relative overflow-hidden bg-white/90 backdrop-blur-md rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-xl hover:border-primary-100 transition-all duration-300 group">
      {/* Subtle left accent border */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary-400 to-blue-500 opacity-70 group-hover:opacity-100 transition-opacity" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pl-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <h3 className="text-lg font-bold text-gray-900 leading-tight">
              {ACTIVITY_TYPES[activity.type] || activity.type}
            </h3>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-sm",
                STATUS_COLORS[activity.status]
              )}
            >
              {STATUS_LABELS[activity.status]}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-600 line-clamp-2 md:line-clamp-none pr-4">
            {activity.description}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-gray-500">
            <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
              {formatDate(activity.date)}
            </span>
            <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              {formatHours(activity.hours)} saat
            </span>
          </div>
          {activity.reviewNote && (
            <div className="mt-4 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 p-3.5 border border-red-100 shadow-inner">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <span className="text-xs font-bold text-red-800 uppercase tracking-widest">Öğretmen Notu</span>
              </div>
              <p className="text-sm text-red-900 font-medium ml-6">{activity.reviewNote}</p>
            </div>
          )}
        </div>

        {/* Hours Big Display */}
        <div className="hidden sm:flex flex-col items-center justify-center shrink-0 w-24 h-24 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-white shadow-inner group-hover:border-primary-100 group-hover:from-primary-50 group-hover:to-white transition-colors">
          <div className="text-2xl font-black text-gray-900 group-hover:text-[#E30613] transition-colors">
            {formatHours(activity.hours)}
          </div>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">saat</div>
        </div>
      </div>

      {showActions && activity.status === "PENDING" && (
        <div className="mt-5 flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100 bg-gray-50/50 -mx-5 -mb-5 px-5 pb-5 sm:rounded-b-2xl">
          <button onClick={() => onApprove?.(activity.id)} className="rounded-full bg-emerald-500 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-600 hover:-translate-y-0.5 transition-all">
            Onayla
          </button>
          <button onClick={() => onRevision?.(activity.id)} className="rounded-full bg-amber-500 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-amber-600 hover:-translate-y-0.5 transition-all">
            Düzenleme İste
          </button>
          <button onClick={() => onReject?.(activity.id)} className="rounded-full bg-rose-500 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-rose-600 hover:-translate-y-0.5 transition-all">
            Reddet
          </button>
        </div>
      )}
    </div>
  );
}
