interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: string;
  className?: string;
}

export function StatsCard({ title, value, subtitle, icon, trend, className = "" }: StatsCardProps) {
  return (
    <div className={`card ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          {trend && (
            <p className="mt-1 text-sm font-medium text-green-600">{trend}</p>
          )}
        </div>
        {icon && (
          <div className="rounded-xl bg-primary-50 p-3 text-primary-600">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
