interface LandingStatsCardProps {
  value: string;
  label: string;
  suffix?: string;
  variant?: "default" | "accent" | "dark";
}

export function LandingStatsCard({
  value,
  label,
  suffix,
  variant = "default",
}: LandingStatsCardProps) {
  const bgClass = {
    default: "bg-card",
    accent: "bg-[hsl(65,70%,75%)]",
    dark: "bg-foreground",
  }[variant];

  const textClass = variant === "dark" ? "text-background" : "text-foreground";
  const subTextClass = variant === "dark" ? "text-background/70" : "text-muted-foreground";

  return (
    <div className={`${bgClass} rounded-3xl p-6 flex flex-col justify-between h-full min-h-[160px] animate-fade-in`}>
      <p className={`text-sm ${subTextClass}`}>{label}</p>
      <div className="mt-auto">
        <span className={`text-5xl font-bold ${textClass}`}>{value}</span>
        {suffix && <span className={`text-2xl ${subTextClass} ml-1`}>{suffix}</span>}
      </div>
    </div>
  );
}
