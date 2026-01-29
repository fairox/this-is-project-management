import { ChevronDown } from "lucide-react";

interface LandingChartCardProps {
  title?: string;
  percentage?: number;
}

export function LandingChartCard({
  title = "Growth",
  percentage = 94,
}: LandingChartCardProps) {
  return (
    <div className="bg-foreground rounded-3xl p-6 flex flex-col h-full min-h-[200px] relative overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-background">{title}</h3>
        <button className="flex items-center gap-1 text-background/70 text-sm hover:text-background transition-colors">
          2024
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {/* Chart */}
      <div className="flex-1 relative">
        <svg
          viewBox="0 0 200 80"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="landingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(65, 70%, 75%)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="hsl(65, 70%, 75%)" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          <path
            d="M0,60 Q20,55 40,50 T80,35 T120,25 T160,15 T200,8 L200,80 L0,80 Z"
            fill="url(#landingGradient)"
          />

          <path
            d="M0,60 Q20,55 40,50 T80,35 T120,25 T160,15 T200,8"
            fill="none"
            stroke="hsl(65, 70%, 75%)"
            strokeWidth="3"
          />

          <circle cx="200" cy="8" r="6" fill="hsl(65, 70%, 75%)" />
          <circle cx="200" cy="8" r="3" fill="hsl(var(--foreground))" />
        </svg>

        <div className="absolute top-0 right-0 bg-[hsl(65,70%,75%)] text-foreground px-4 py-2 rounded-full text-lg font-bold">
          +{percentage}%
        </div>
      </div>
    </div>
  );
}
