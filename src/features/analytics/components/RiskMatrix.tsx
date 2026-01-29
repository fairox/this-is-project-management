import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ZAxis, Legend } from "recharts";
import { predictRisks, RiskPrediction } from "@/features/analytics/aiAnalytics";
import { useToast } from "@/hooks/use-toast";

interface RiskDataPoint {
  impact: number;
  probability: number;
  size: number;
  name: string;
  isAI?: boolean;
}

const initialData: RiskDataPoint[] = [
  { impact: 4, probability: 3, size: 100, name: "Budget Overrun" },
  { impact: 5, probability: 2, size: 100, name: "Schedule Delay" },
  { impact: 2, probability: 4, size: 100, name: "Resource Shortage" },
  { impact: 3, probability: 5, size: 100, name: "Quality Issues" },
  { impact: 1, probability: 1, size: 100, name: "Weather Impact" },
];

const config = {
  risk: { theme: { light: "#ef4444", dark: "#dc2626" } },
  aiRisk: { theme: { light: "#3b82f6", dark: "#2563eb" } },
};

export function RiskMatrix() {
  const [data, setData] = useState<RiskDataPoint[]>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadAIPredictions = async () => {
      try {
        setIsLoading(true);
        const predictions = await predictRisks({});
        
        const aiRisks: RiskDataPoint[] = predictions.map(risk => ({
          impact: risk.impact,
          probability: risk.probability,
          size: 100,
          name: risk.name,
          isAI: true
        }));

        setData([...initialData, ...aiRisks]);
        
        toast({
          title: "AI Risk Analysis Complete",
          description: `${predictions.length} potential risks identified`,
        });
      } catch (error) {
        console.error("Error loading AI predictions:", error);
        toast({
          title: "Error",
          description: "Failed to load AI risk predictions",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAIPredictions();
  }, [toast]);

  return (
    <Card className="p-6 overflow-hidden">
      <h3 className="font-semibold mb-6">
        Risk Assessment Matrix
        {isLoading && <span className="ml-2 text-sm text-muted-foreground">(Loading AI analysis...)</span>}
      </h3>
      <div className="h-[400px] w-full min-w-0">
        <ChartContainer config={config}>
          <ScatterChart margin={{ top: 30, right: 30, bottom: 40, left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              dataKey="impact" 
              name="Impact" 
              domain={[0, 5]}
              label={{ value: 'Impact', position: 'bottom', offset: 20 }}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              type="number" 
              dataKey="probability" 
              name="Probability" 
              domain={[0, 5]}
              label={{ value: 'Probability', angle: -90, position: 'left', offset: 20 }}
              tick={{ fontSize: 12 }}
            />
            <ZAxis type="number" range={[100, 100]} />
            <Legend />
            <ChartTooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter 
              name="Manual Risks" 
              data={data.filter(d => !d.isAI)} 
              fill="var(--color-risk)"
            />
            <Scatter 
              name="AI-Predicted Risks" 
              data={data.filter(d => d.isAI)} 
              fill="var(--color-aiRisk)"
            />
          </ScatterChart>
        </ChartContainer>
      </div>
    </Card>
  );
}
