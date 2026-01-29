
import { Progress } from "@/components/ui/progress";
import { LucideIcon } from "lucide-react";

interface WeatherConditionItemProps {
  type: string;
  value: number;
  unit: string;
  impact: number;
  icon: React.ReactNode;
  onClick: () => void;
}

export function WeatherConditionItem({
  type,
  value,
  unit,
  impact,
  icon,
  onClick,
}: WeatherConditionItemProps) {
  return (
    <div
      className="flex items-center space-x-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
      onClick={onClick}
    >
      <div className="text-primary">{icon}</div>
      <div className="flex-1">
        <div className="flex justify-between mb-1">
          <span className="font-medium">{type}</span>
          <span className="text-sm text-gray-500">
            {value}
            {unit}
          </span>
        </div>
        <Progress value={impact} className="h-2" />
      </div>
    </div>
  );
}
