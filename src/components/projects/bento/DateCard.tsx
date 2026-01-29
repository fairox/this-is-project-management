interface DateCardProps {
  day?: number;
  weekday?: string;
  month?: string;
}

export function DateCard({
  day = 19,
  weekday = "Tue",
  month = "January",
}: DateCardProps) {
  return (
    <div className="bg-card rounded-3xl p-6 flex items-center gap-4 h-full min-h-[100px]">
      <div className="h-14 w-14 rounded-2xl bg-foreground text-background flex items-center justify-center">
        <span className="text-2xl font-bold">{day}</span>
      </div>
      <div>
        <p className="text-lg font-semibold text-foreground">{weekday},</p>
        <p className="text-muted-foreground">{month}</p>
      </div>
    </div>
  );
}
