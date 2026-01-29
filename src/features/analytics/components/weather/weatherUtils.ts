
export interface WeatherResponse {
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  clouds: {
    all: number;
  };
  uvi?: number;
}

export const defaultWeatherData: WeatherResponse = {
  main: {
    temp: 20,
    humidity: 50,
  },
  wind: {
    speed: 5,
  },
  clouds: {
    all: 30,
  },
  uvi: 5,
};

export const calculateImpact = (value: number, type: string): number => {
  switch (type) {
    case "Temperature":
      return Math.min(100, Math.max(0, (value / 40) * 100));
    case "Humidity":
      return Math.min(100, Math.max(0, value));
    case "Wind Speed":
      return Math.min(100, Math.max(0, (value / 20) * 100));
    case "Cloud Cover":
      return Math.min(100, Math.max(0, value));
    case "UV Index":
      return Math.min(100, Math.max(0, (value / 11) * 100));
    default:
      return 50;
  }
};
