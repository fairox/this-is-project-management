
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WeatherErrorStateProps {
  useDefaultLocation: boolean;
  onLocationToggle: () => void;
}

export function WeatherErrorState({
  useDefaultLocation,
  onLocationToggle,
}: WeatherErrorStateProps) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Weather Impact Analysis</h3>
      <div className="space-y-4">
        <p className="text-red-500">
          Unable to access location or fetch weather data.
        </p>
        <Button onClick={onLocationToggle}>
          {useDefaultLocation ? "Try using my location" : "Use default location"}
        </Button>
      </div>
    </Card>
  );
}
