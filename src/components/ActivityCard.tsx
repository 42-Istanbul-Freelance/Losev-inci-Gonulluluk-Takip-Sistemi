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
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="font-semibold text-gray-900">
              {ACTIVITY_TYPES[activity.type] || activity.type}
            </h3>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                STATUS_COLORS[activity.status]
              )}
            >
              {STATUS_LABELS[activity.status]}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
            {activity.description}
          </p>
          <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
              {formatDate(activity.date)}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              {formatHours(activity.hours)} saat
            </span>
          </div>
          {activity.reviewNote && (
            <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
              <span className="font-medium">Öğretmen notu:</span>{" "}
              {activity.reviewNote}
            </div>
          )}
        </div>
        <div className="text-right shrink-0">
          <div className="text-2xl font-bold text-primary-600">
            {formatHours(activity.hours)}
          </div>
          <div className="text-xs text-gray-500">saat</div>
        </div>
      </div>

      {showActions && activity.status === "PENDING" && (
        <div className="mt-4 flex items-center gap-2 pt-4 border-t border-gray-100">
          <button onClick={() => onApprove?.(activity.id)} className="btn-success text-xs px-3 py-1.5">
            Onayla
          </button>
          <button onClick={() => onRevision?.(activity.id)} className="btn-secondary text-xs px-3 py-1.5">
            Düzenleme İste
          </button>
          <button onClick={() => onReject?.(activity.id)} className="btn-danger text-xs px-3 py-1.5">
            Reddet
          </button>
        </div>
      )}
    </div>
  );
}
