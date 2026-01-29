interface DashboardDateCardProps {
  day?: number;
  weekday?: string;
  month?: string;
}

export function DashboardDateCard({
  day = 19,
  weekday = "Tue",
  month = "January",
}: DashboardDateCardProps) {
  return (
    <div className="bg-card rounded-3xl p-6 flex flex-col items-center justify-center h-full min-h-[140px]">
      <div className="flex items-baseline gap-4">
        <span className="text-5xl font-bold text-foreground">{day}</span>
        <div className="text-left">
          <p className="text-foreground font-medium">{weekday},</p>
          <p className="text-muted-foreground">{month}</p>
        </div>
      </div>
    </div>
  );
}
