import { LucideIcon } from "lucide-react";

interface QuickStatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: string;
  accentColor?: boolean;
}

export function QuickStatsCard({
  icon: Icon,
  label,
  value,
  trend,
  accentColor = false,
}: QuickStatsCardProps) {
  return (
    <div className={`rounded-3xl p-5 flex flex-col justify-between h-full min-h-[120px] ${
      accentColor ? "bg-[hsl(65,70%,75%)]" : "bg-card"
    }`}>
      <div className="flex items-center justify-between">
        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
          accentColor ? "bg-foreground/10" : "bg-muted"
        }`}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            trend.startsWith('+') 
              ? "bg-emerald-100 text-emerald-700" 
              : trend.startsWith('-') 
                ? "bg-red-100 text-red-700"
                : "bg-muted text-muted-foreground"
          }`}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
