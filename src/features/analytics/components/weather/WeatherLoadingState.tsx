
import { Card } from "@/components/ui/card";

export function WeatherLoadingState() {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Weather Impact Analysis</h3>
      <div className="space-y-4">
        <div className="animate-pulse bg-gray-200 h-12 rounded-lg" />
        <div className="animate-pulse bg-gray-200 h-12 rounded-lg" />
        <div className="animate-pulse bg-gray-200 h-12 rounded-lg" />
      </div>
    </Card>
  );
}
