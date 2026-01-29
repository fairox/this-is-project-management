
import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { PieChart, Pie, Cell, Legend } from "recharts";

const data = [
  { name: "Labor", value: 35000 },
  { name: "Materials", value: 25000 },
  { name: "Equipment", value: 15000 },
  { name: "Other", value: 5000 },
];

const COLORS = ["#2563eb", "#059669", "#d97706", "#dc2626"];

const chartConfig = {
  data: {
    label: "Budget Data",
    color: "#2563eb"
  }
};

export function BudgetChart() {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold">Budget Breakdown</h3>
        <div className="text-sm text-muted-foreground">
          Current Period
        </div>
      </div>
      <div className="h-[300px]">
        <ChartContainer config={chartConfig}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <ChartTooltip />
            <Legend />
          </PieChart>
        </ChartContainer>
      </div>
    </Card>
  );
}
