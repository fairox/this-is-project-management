import { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface InspectionStatsCardProps {
  icon: LucideIcon;
  label: string;
  value?: string | number;
  suffix?: string;
  trend?: string;
  variant?: "default" | "accent" | "muted" | "dark";
  isLoading?: boolean;
}

export function InspectionStatsCard({
  icon: Icon,
  label,
  value,
  suffix,
  trend,
  variant = "default",
  isLoading = false,
}: InspectionStatsCardProps) {
  const bgClass = {
    default: "bg-card",
    accent: "bg-[hsl(65,70%,75%)]",
    muted: "bg-[hsl(80,15%,70%)]",
    dark: "bg-foreground text-background",
  }[variant];

  return (
    <div className={`${bgClass} rounded-3xl p-6 flex flex-col justify-between h-full min-h-[140px] transition-all hover:scale-[1.02]`}>
      {/* Icon & Label */}
      <div className="flex items-center justify-between">
        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
          variant === "dark" ? "bg-background/10" : variant === "accent" ? "bg-foreground/10" : "bg-muted"
        }`}>
          <Icon className={`h-5 w-5 ${variant === "dark" ? "text-background" : "text-foreground"}`} />
        </div>
        {trend && !isLoading && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            trend.startsWith('+') 
              ? "bg-emerald-100 text-emerald-700" 
              : trend.startsWith('-') 
                ? "bg-red-100 text-red-700"
                : variant === "dark" ? "bg-background/10 text-background" : "bg-muted text-muted-foreground"
          }`}>
            {trend}
          </span>
        )}
      </div>

      {/* Value Display */}
      <div>
        {isLoading ? (
          <>
            <Skeleton className={`h-9 w-16 mb-1 ${variant === "dark" ? "bg-background/20" : ""}`} />
            <Skeleton className={`h-4 w-20 ${variant === "dark" ? "bg-background/20" : ""}`} />
          </>
        ) : (
          <>
            <span className={`text-3xl font-bold tracking-tight ${variant === "dark" ? "text-background" : "text-foreground"}`}>
              {value}
            </span>
            {suffix && (
              <span className={`text-xl font-light ml-1 ${variant === "dark" ? "text-background/70" : "text-foreground/70"}`}>
                {suffix}
              </span>
            )}
            <p className={`text-sm mt-1 ${variant === "dark" ? "text-background/70" : "text-muted-foreground"}`}>
              {label}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
