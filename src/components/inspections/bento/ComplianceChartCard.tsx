import { useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInspectionStats } from "@/hooks/useInspections";
import { Skeleton } from "@/components/ui/skeleton";

export function ComplianceChartCard() {
  const [selectedMonth, setSelectedMonth] = useState("January");
  const { data: stats, isLoading } = useInspectionStats();
  
  const percentage = stats?.averagePassRate || 0;
  
  const months = ["January", "February", "March", "April", "May", "June", 
                  "July", "August", "September", "October", "November", "December"];

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    toast.info(`Viewing compliance for ${month}`);
  };

  return (
    <div className="bg-foreground rounded-3xl p-6 flex flex-col h-full min-h-[200px] relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-background">Compliance</h3>
        <Select value={selectedMonth} onValueChange={handleMonthChange}>
          <SelectTrigger className="bg-transparent text-background/70 text-sm hover:text-background transition-colors border-0 w-auto p-0 h-auto">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border shadow-lg z-50">
            {months.map((m) => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Chart Area */}
      <div className="flex-1 relative">
        {isLoading ? (
          <Skeleton className="w-full h-full rounded-xl" />
        ) : (
          <>
            {/* Simple wave chart using SVG */}
            <svg 
              viewBox="0 0 200 80" 
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="complianceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="hsl(65, 70%, 75%)" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="hsl(65, 70%, 75%)" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              
              {/* Area fill - height based on percentage */}
              <path
                d={`M0,${80 - (percentage * 0.6)} Q30,${80 - (percentage * 0.5)} 60,${80 - (percentage * 0.55)} T120,${80 - (percentage * 0.7)} T180,${80 - (percentage * 0.6)} T200,${80 - (percentage * 0.75)} L200,80 L0,80 Z`}
                fill="url(#complianceGradient)"
              />
              
              {/* Line */}
              <path
                d={`M0,${80 - (percentage * 0.6)} Q30,${80 - (percentage * 0.5)} 60,${80 - (percentage * 0.55)} T120,${80 - (percentage * 0.7)} T180,${80 - (percentage * 0.6)} T200,${80 - (percentage * 0.75)}`}
                fill="none"
                stroke="hsl(65, 70%, 75%)"
                strokeWidth="2"
              />
              
              {/* Dot indicator */}
              <circle 
                cx="160" 
                cy={80 - (percentage * 0.65)} 
                r="6" 
                fill="hsl(65, 70%, 75%)"
              />
              <circle 
                cx="160" 
                cy={80 - (percentage * 0.65)} 
                r="3" 
                fill="hsl(var(--foreground))"
              />
            </svg>

            {/* Percentage badge */}
            <div className="absolute top-1/2 right-4 -translate-y-1/2 bg-[hsl(65,70%,75%)] text-foreground px-3 py-1 rounded-full text-sm font-bold">
              {percentage}%
            </div>
          </>
        )}
      </div>

      {/* Stats footer */}
      {!isLoading && stats && (
        <div className="flex justify-between text-xs text-background/60 mt-2">
          <span>{stats.completed} passed</span>
          <span>{stats.failed} failed</span>
        </div>
      )}
    </div>
  );
}
