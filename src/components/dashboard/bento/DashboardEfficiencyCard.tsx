import { ChevronDown } from "lucide-react";

interface DashboardEfficiencyCardProps {
  percentage?: number;
  month?: string;
}

export function DashboardEfficiencyCard({
  percentage = 40,
  month = "January",
}: DashboardEfficiencyCardProps) {
  return (
    <div className="bg-foreground rounded-3xl p-6 flex flex-col h-full min-h-[160px] relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-background">Efficiency</h3>
        <button className="flex items-center gap-1 text-background/70 text-sm hover:text-background transition-colors">
          {month}
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {/* Chart area */}
      <div className="flex-1 relative">
        <svg
          viewBox="0 0 200 60"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="effGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(65, 70%, 75%)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="hsl(65, 70%, 75%)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <path
            d="M0,45 Q30,35 60,40 T120,25 T200,20 L200,60 L0,60 Z"
            fill="url(#effGradient)"
          />

          {/* Line */}
          <path
            d="M0,45 Q30,35 60,40 T120,25 T200,20"
            fill="none"
            stroke="hsl(65, 70%, 75%)"
            strokeWidth="2"
          />

          {/* Dot */}
          <circle cx="120" cy="25" r="6" fill="hsl(65, 70%, 75%)" />
          <circle cx="120" cy="25" r="3" fill="hsl(var(--foreground))" />
        </svg>

        {/* Percentage badge */}
        <div className="absolute top-1/2 right-4 -translate-y-1/2 bg-[hsl(65,70%,75%)] text-foreground px-3 py-1 rounded-full text-sm font-bold">
          +{percentage}%
        </div>
      </div>
    </div>
  );
}
