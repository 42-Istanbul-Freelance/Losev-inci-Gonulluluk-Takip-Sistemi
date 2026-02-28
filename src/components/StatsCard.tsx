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
    <div className={`relative overflow-hidden bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group ${className}`}>
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{title}</p>
          <p className="text-3xl font-extrabold text-gray-900 group-hover:text-primary-600 transition-colors">{value}</p>
          {subtitle && <p className="mt-2 text-sm font-medium text-gray-500">{subtitle}</p>}
          {trend && (
            <p className="mt-2 text-sm font-bold text-emerald-500 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
              </svg>
              {trend}
            </p>
          )}
        </div>
        {icon && (
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-blue-600 shadow-lg shadow-primary-500/30 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        )}
      </div>
      {/* Decorative background blast */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary-100/50 rounded-full blur-2xl group-hover:bg-primary-200/50 transition-colors duration-500 pointer-events-none" />
    </div>
  );
}
