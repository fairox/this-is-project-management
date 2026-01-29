import { LucideIcon } from "lucide-react";

interface ToolsStatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  suffix?: string;
  variant?: "default" | "accent" | "muted";
}

export function ToolsStatsCard({
  icon: Icon,
  label,
  value,
  suffix,
  variant = "default",
}: ToolsStatsCardProps) {
  const bgClass = {
    default: "bg-card",
    accent: "bg-[hsl(65,70%,75%)]",
    muted: "bg-[hsl(80,15%,70%)]",
  }[variant];

  return (
    <div className={`${bgClass} rounded-3xl p-6 flex flex-col justify-between h-full min-h-[140px]`}>
      {/* Icon & Label */}
      <div className="flex items-center gap-2 text-foreground/70">
        <Icon className="h-4 w-4" />
        <span className="text-sm">{label}</span>
      </div>

      {/* Value Display */}
      <div>
        <span className="text-4xl font-bold text-foreground tracking-tight">{value}</span>
        {suffix && <span className="text-2xl font-light text-foreground/70 ml-1">{suffix}</span>}
      </div>
    </div>
  );
}
