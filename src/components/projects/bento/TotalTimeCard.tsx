import { Clock } from "lucide-react";

interface TotalTimeCardProps {
  hours?: number;
  label?: string;
}

export function TotalTimeCard({
  hours = 645,
  label = "Total project time",
}: TotalTimeCardProps) {
  return (
    <div className="bg-[hsl(80,15%,70%)] rounded-3xl p-6 flex flex-col justify-between h-full min-h-[140px]">
      {/* Icon & Label */}
      <div className="flex items-center gap-2 text-foreground/70">
        <Clock className="h-4 w-4" />
        <span className="text-sm">{label}</span>
      </div>

      {/* Hours Display */}
      <div>
        <span className="text-4xl font-bold text-foreground tracking-tight">{hours}</span>
        <span className="text-2xl font-light text-foreground/70 ml-1">h</span>
      </div>
    </div>
  );
}
