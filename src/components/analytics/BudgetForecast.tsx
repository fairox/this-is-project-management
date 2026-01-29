
import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";

const data = [
  { month: 'Jan', actual: 4000, projected: 4200, forecast: 4100 },
  { month: 'Feb', actual: 3000, projected: 3800, forecast: 3500 },
  { month: 'Mar', actual: 2000, projected: 3200, forecast: 2800 },
  { month: 'Apr', actual: null, projected: 3600, forecast: 3200 },
  { month: 'May', actual: null, projected: 3400, forecast: 3600 },
  { month: 'Jun', actual: null, projected: 3800, forecast: 3900 },
];

const config = {
  actual: { theme: { light: "#2563eb", dark: "#3b82f6" } },
  projected: { theme: { light: "#9ca3af", dark: "#6b7280" } },
  forecast: { theme: { light: "#059669", dark: "#10b981" } },
};

export function BudgetForecast() {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold">Budget Forecast</h3>
        <div className="text-sm text-muted-foreground">
          Next 3 months projection
        </div>
      </div>
      <div className="h-[300px]">
        <ChartContainer config={config}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="actual" 
              name="Actual Spending" 
              stroke="var(--color-actual)"
              strokeWidth={2}
              dot={{ strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="projected" 
              name="Projected Budget" 
              stroke="var(--color-projected)"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
            <Line 
              type="monotone" 
              dataKey="forecast" 
              name="Forecast" 
              stroke="var(--color-forecast)"
              strokeWidth={2}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </Card>
  );
}
