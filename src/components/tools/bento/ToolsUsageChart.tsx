import { ChevronDown } from "lucide-react";

interface ToolsUsageChartProps {
  month?: string;
  percentage?: number;
}

export function ToolsUsageChart({
  month = "January",
  percentage = 40,
}: ToolsUsageChartProps) {
  return (
    <div className="bg-foreground rounded-3xl p-6 flex flex-col h-full min-h-[200px] relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-background">Usage</h3>
        <button className="flex items-center gap-1 text-background/70 text-sm hover:text-background transition-colors">
          {month}
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {/* Chart Area */}
      <div className="flex-1 relative">
        {/* Simple wave chart using SVG */}
        <svg 
          viewBox="0 0 200 80" 
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="usageGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(65, 70%, 75%)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="hsl(65, 70%, 75%)" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          
          {/* Area fill */}
          <path
            d="M0,60 Q25,45 50,50 T100,35 T150,45 T200,30 L200,80 L0,80 Z"
            fill="url(#usageGradient)"
          />
          
          {/* Line */}
          <path
            d="M0,60 Q25,45 50,50 T100,35 T150,45 T200,30"
            fill="none"
            stroke="hsl(65, 70%, 75%)"
            strokeWidth="2"
          />
          
          {/* Dot indicator */}
          <circle 
            cx="150" 
            cy="45" 
            r="6" 
            fill="hsl(65, 70%, 75%)"
          />
          <circle 
            cx="150" 
            cy="45" 
            r="3" 
            fill="hsl(var(--foreground))"
          />
        </svg>

        {/* Percentage badge */}
        <div className="absolute top-1/2 right-4 -translate-y-1/2 bg-[hsl(65,70%,75%)] text-foreground px-3 py-1 rounded-full text-sm font-bold">
          +{percentage}%
        </div>
      </div>
    </div>
  );
}
