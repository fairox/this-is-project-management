import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ReferenceLine } from "recharts";

const data = [
  { month: 'Jan', variance: 400, positive: 400, negative: 0 },
  { month: 'Feb', variance: -800, positive: 0, negative: -800 },
  { month: 'Mar', variance: -1200, positive: 0, negative: -1200 },
  { month: 'Apr', variance: 600, positive: 600, negative: 0 },
  { month: 'May', variance: -300, positive: 0, negative: -300 },
  { month: 'Jun', variance: 200, positive: 200, negative: 0 },
];

const config = {
  positive: { theme: { light: "#059669", dark: "#10b981" } },
  negative: { theme: { light: "#dc2626", dark: "#ef4444" } },
};

export function CostVarianceChart() {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold">Cost Variance Analysis</h3>
        <div className="text-sm text-muted-foreground">
          Planned vs Actual Cost Difference
        </div>
      </div>
      <div className="h-[300px]">
        <ChartContainer config={config}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip />
            <Legend />
            <ReferenceLine y={0} stroke="#666" />
            <Bar 
              dataKey="positive" 
              name="Under Budget" 
              fill="var(--color-positive)"
              stackId="stack"
            />
            <Bar 
              dataKey="negative" 
              name="Over Budget" 
              fill="var(--color-negative)"
              stackId="stack"
            />
          </BarChart>
        </ChartContainer>
      </div>
    </Card>
  );
}
