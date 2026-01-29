
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Cloud, Droplets, Sun, Thermometer, Wind } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { WeatherConditionItem } from "./weather/WeatherConditionItem";
import { WeatherLoadingState } from "./weather/WeatherLoadingState";
import { WeatherErrorState } from "./weather/WeatherErrorState";
import { WeatherResponse, defaultWeatherData, calculateImpact } from "./weather/weatherUtils";

interface WeatherCondition {
  type: string;
  value: number;
  unit: string;
  impact: number;
  icon: React.ReactNode;
}

export function WeatherImpact() {
  const { toast } = useToast();
  const [useDefaultLocation, setUseDefaultLocation] = useState(false);

  const { data: weatherData, isLoading, error, refetch } = useQuery({
    queryKey: ['weather'],
    queryFn: async () => {
      if (useDefaultLocation) {
        return defaultWeatherData;
      }

      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 5000,
            maximumAge: 0,
          });
        });
        
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${process.env.WEATHER_API_KEY || ''}&units=metric`
        );
        
        if (!response.ok) {
          throw new Error('Weather data fetch failed');
        }
        return response.json() as Promise<WeatherResponse>;
      } catch (error) {
        if (error instanceof GeolocationPositionError) {
          toast({
            title: "Location Access Denied",
            description: "Using default weather data. Enable location access for local weather.",
            variant: "destructive",
          });
        }
        throw error;
      }
    },
    retry: false,
    enabled: !useDefaultLocation,
  });

  const getWeatherConditions = (): WeatherCondition[] => {
    const data = weatherData || defaultWeatherData;
    
    return [
      {
        type: "Temperature",
        value: Number(data.main.temp.toFixed(1)),
        unit: "°C",
        impact: calculateImpact(data.main.temp, "Temperature"),
        icon: <Thermometer className="h-5 w-5" />,
      },
      {
        type: "Humidity",
        value: data.main.humidity,
        unit: "%",
        impact: calculateImpact(data.main.humidity, "Humidity"),
        icon: <Droplets className="h-5 w-5" />,
      },
      {
        type: "Wind Speed",
        value: Number(data.wind.speed.toFixed(1)),
        unit: "m/s",
        impact: calculateImpact(data.wind.speed, "Wind Speed"),
        icon: <Wind className="h-5 w-5" />,
      },
      {
        type: "Cloud Cover",
        value: data.clouds.all,
        unit: "%",
        impact: calculateImpact(data.clouds.all, "Cloud Cover"),
        icon: <Cloud className="h-5 w-5" />,
      },
      {
        type: "UV Index",
        value: data.uvi || 5,
        unit: "",
        impact: calculateImpact(data.uvi || 5, "UV Index"),
        icon: <Sun className="h-5 w-5" />,
      },
    ];
  };

  const handleConditionClick = (condition: WeatherCondition) => {
    toast({
      title: `${condition.type} Impact Analysis`,
      description: `Current value: ${condition.value}${condition.unit} - Impact on project progress: ${condition.impact}%`,
    });
  };

  if (isLoading) {
    return <WeatherLoadingState />;
  }

  if (error) {
    return (
      <WeatherErrorState
        useDefaultLocation={useDefaultLocation}
        onLocationToggle={() => {
          if (!useDefaultLocation) {
            setUseDefaultLocation(true);
          } else {
            setUseDefaultLocation(false);
            refetch();
          }
        }}
      />
    );
  }

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Weather Impact Analysis</h3>
        {useDefaultLocation && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setUseDefaultLocation(false);
              refetch();
            }}
          >
            Use my location
          </Button>
        )}
      </div>
      <div className="space-y-4">
        {getWeatherConditions().map((condition) => (
          <WeatherConditionItem
            key={condition.type}
            {...condition}
            onClick={() => handleConditionClick(condition)}
          />
        ))}
      </div>
    </Card>
  );
}
