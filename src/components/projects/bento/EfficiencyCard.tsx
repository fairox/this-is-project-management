import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EfficiencyCardProps {
  percentage?: number;
  month?: string;
}

export function EfficiencyCard({
  percentage = 40,
  month = "January",
}: EfficiencyCardProps) {
  return (
    <div className="bg-foreground rounded-3xl p-6 flex flex-col h-full min-h-[200px] text-background">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Efficiency</h3>
          <Select defaultValue="january">
            <SelectTrigger className="w-auto h-auto p-0 bg-transparent border-0 text-background/70 text-sm gap-1 [&>svg]:h-3 [&>svg]:w-3">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="january">January</SelectItem>
              <SelectItem value="february">February</SelectItem>
              <SelectItem value="march">March</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* Simple Wave Chart SVG */}
        <svg className="w-full h-16" viewBox="0 0 100 40" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(65, 70%, 75%)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(65, 70%, 75%)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,30 Q10,25 20,28 T40,20 T60,25 T80,15 T100,20"
            fill="none"
            stroke="hsl(65, 70%, 75%)"
            strokeWidth="2"
          />
          <path
            d="M0,30 Q10,25 20,28 T40,20 T60,25 T80,15 T100,20 L100,40 L0,40 Z"
            fill="url(#chartGradient)"
          />
        </svg>

        {/* Percentage Bubble */}
        <div className="absolute right-4 top-0 h-16 w-16 rounded-full border-2 border-[hsl(65,70%,75%)] flex items-center justify-center">
          <span className="text-sm font-bold text-[hsl(65,70%,75%)]">+{percentage}%</span>
        </div>
      </div>
    </div>
  );
}
