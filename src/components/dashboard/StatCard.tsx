import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  iconBgColor: string;
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
}

export default function StatCard({
  icon,
  iconBgColor,
  title,
  value,
  trend,
  subtitle,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-5 border border-[var(--rawuh-border)]">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: iconBgColor }}
        >
          {icon}
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              trend.isPositive
                ? "text-[var(--rawuh-success)]"
                : "text-[var(--rawuh-error)]"
            }`}
          >
            <span className="material-symbols-outlined text-lg">
              {trend.isPositive ? "trending_up" : "trending_down"}
            </span>
            {trend.value}%
          </div>
        )}
      </div>
      <p className="text-sm text-[var(--rawuh-text-muted)] mb-1">{title}</p>
      <p className="text-2xl font-bold text-[var(--rawuh-text)]">{value}</p>
      {subtitle && (
        <p className="text-xs text-[var(--rawuh-text-muted)] mt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
}
