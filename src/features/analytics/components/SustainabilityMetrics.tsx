import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { analyzeEnvironmentalImpact, EnvironmentalMetric } from "@/features/analytics/aiAnalytics";
import { Leaf, Droplets, Wind, Recycle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export function SustainabilityMetrics() {
  const [metrics, setMetrics] = useState<EnvironmentalMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setIsLoading(true);
        const data = await analyzeEnvironmentalImpact({});
        setMetrics(data);
        
        toast({
          title: "Environmental Analysis Complete",
          description: "Sustainability metrics have been updated",
        });
      } catch (error) {
        console.error("Error loading environmental metrics:", error);
        toast({
          title: "Error",
          description: "Failed to load sustainability metrics",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadMetrics();
  }, [toast]);

  const getIcon = (category: string) => {
    switch (category) {
      case "Carbon Footprint":
        return <Leaf className="h-5 w-5" />;
      case "Water Usage":
        return <Droplets className="h-5 w-5" />;
      case "Energy Efficiency":
        return <Wind className="h-5 w-5" />;
      case "Waste Recycling":
        return <Recycle className="h-5 w-5" />;
      default:
        return <Leaf className="h-5 w-5" />;
    }
  };

  const getImpactColor = (impact: number) => {
    if (impact >= 0.7) return "bg-green-500";
    if (impact >= 0.4) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Sustainability Metrics</h3>
        <Badge variant="outline">
          {isLoading ? "Analyzing..." : "Last Updated: " + new Date().toLocaleDateString()}
        </Badge>
      </div>

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          {metrics.map((metric) => (
            <div
              key={metric.category}
              className="p-4 border rounded-lg hover:border-primary transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="text-primary">{getIcon(metric.category)}</div>
                <div className="flex-1">
                  <h4 className="font-medium">{metric.category}</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {metric.value} {metric.unit}
                    </span>
                    <Badge className={getImpactColor(metric.impact)}>
                      Impact Score: {(metric.impact * 100).toFixed(0)}%
                    </Badge>
                  </div>
                </div>
              </div>
              <Progress value={metric.impact * 100} className="mb-2" />
              {metric.recommendation && (
                <p className="text-sm text-muted-foreground mt-2">
                  💡 {metric.recommendation}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 h-[300px]">
          <h4 className="font-medium mb-4">Environmental Impact Overview</h4>
          <BarChart
            width={800}
            height={300}
            data={metrics}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="impact" name="Impact Score" fill="var(--primary)" />
          </BarChart>
        </div>
      </div>
    </Card>
  );
}
