import { Card } from "@/components/ui/card";
import { Building2, ClipboardCheck, AlertTriangle, Timer } from "lucide-react";

export function Stats() {
  const stats = [
    {
      label: "Active Projects",
      value: "12",
      icon: Building2,
      trend: "+2 this month",
    },
    {
      label: "Pending Inspections",
      value: "8",
      icon: ClipboardCheck,
      trend: "3 urgent",
    },
    {
      label: "Risk Alerts",
      value: "4",
      icon: AlertTriangle,
      trend: "-2 from last week",
    },
    {
      label: "Delayed Tasks",
      value: "6",
      icon: Timer,
      trend: "2 critical",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <stat.icon className="w-6 h-6 text-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <h3 className="text-3xl font-bold tracking-tight">{stat.value}</h3>
              <p className="text-sm text-muted-foreground mt-1">{stat.trend}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}