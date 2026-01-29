import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Leaf, ShieldCheck, AlertTriangle, Info, Recycle } from "lucide-react";

interface ComplianceMetric {
  id: string;
  category: string;
  status: 'compliant' | 'warning' | 'non-compliant';
  value: number;
  threshold: number;
  unit: string;
  lastChecked: string;
  icon: React.ReactNode;
  description: string;
}

export function EnvironmentalCompliance() {
  const { toast } = useToast();

  const metrics: ComplianceMetric[] = [
    {
      id: "1",
      category: "Air Quality",
      status: "compliant",
      value: 45,
      threshold: 50,
      unit: "µg/m³",
      lastChecked: "2024-03-20",
      icon: <Leaf className="h-5 w-5" />,
      description: "Particulate matter (PM2.5) levels within acceptable range"
    },
    {
      id: "2",
      category: "Noise Level",
      status: "warning",
      value: 85,
      threshold: 90,
      unit: "dB",
      lastChecked: "2024-03-20",
      icon: <AlertTriangle className="h-5 w-5" />,
      description: "Average noise levels approaching threshold"
    },
    {
      id: "3",
      category: "Waste Management",
      status: "compliant",
      value: 82,
      threshold: 75,
      unit: "%",
      lastChecked: "2024-03-20",
      icon: <Recycle className="h-5 w-5" />,
      description: "Recycling rate exceeds target"
    },
    {
      id: "4",
      category: "Water Quality",
      status: "non-compliant",
      value: 15,
      threshold: 10,
      unit: "NTU",
      lastChecked: "2024-03-20",
      icon: <Info className="h-5 w-5" />,
      description: "Turbidity levels above permitted limit"
    }
  ];

  const getStatusColor = (status: ComplianceMetric['status']) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'non-compliant':
        return 'bg-red-500';
    }
  };

  const getProgressValue = (value: number, threshold: number) => {
    return (value / threshold) * 100;
  };

  const handleMetricClick = (metric: ComplianceMetric) => {
    toast({
      title: `${metric.category} Compliance Status`,
      description: `${metric.description}. Current value: ${metric.value}${metric.unit} (Threshold: ${metric.threshold}${metric.unit})`,
    });
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Environmental Compliance</h3>
        <Badge variant="outline" className="px-4">
          Last Updated: {new Date().toLocaleDateString()}
        </Badge>
      </div>
      <div className="space-y-6">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="flex items-center space-x-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
            onClick={() => handleMetricClick(metric)}
          >
            <div className="text-primary">{metric.icon}</div>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="font-medium">{metric.category}</span>
                <Badge className={getStatusColor(metric.status)}>
                  {metric.status}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Progress 
                  value={getProgressValue(metric.value, metric.threshold)} 
                  className="flex-1" 
                />
                <span className="text-sm text-gray-500 min-w-[4.5rem]">
                  {metric.value}{metric.unit}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
