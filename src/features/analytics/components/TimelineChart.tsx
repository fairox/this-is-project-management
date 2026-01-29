import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

const data = [
  { date: '2024-01', completion: 20 },
  { date: '2024-02', completion: 35 },
  { date: '2024-03', completion: 45 },
  { date: '2024-04', completion: 60 },
  { date: '2024-05', completion: 75 },
  { date: '2024-06', completion: 85 },
];

const config = {
  progress: { theme: { light: "#2563eb", dark: "#3b82f6" } },
};

export function TimelineChart() {
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-6">Project Timeline Progress</h3>
      <div className="h-[300px]">
        <ChartContainer config={config}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <ChartTooltip />
            <Line 
              type="monotone" 
              dataKey="completion" 
              name="Completion %" 
              stroke="var(--color-progress)"
              strokeWidth={2}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </Card>
  );
}
