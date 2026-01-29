import { Clock } from "lucide-react";

interface DashboardTotalTimeCardProps {
  hours?: number;
  label?: string;
}

export function DashboardTotalTimeCard({
  hours = 645,
  label = "Total project time",
}: DashboardTotalTimeCardProps) {
  return (
    <div className="bg-[hsl(80,15%,70%)] rounded-3xl p-6 flex flex-col justify-between h-full min-h-[140px]">
      <div className="flex items-center gap-2 text-foreground/70">
        <Clock className="h-4 w-4" />
        <span className="text-sm">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold text-foreground">{hours}</span>
        <span className="text-xl text-foreground/70">h</span>
      </div>
    </div>
  );
}
