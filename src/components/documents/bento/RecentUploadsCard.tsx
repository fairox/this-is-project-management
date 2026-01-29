import { ChevronDown, FileText } from "lucide-react";

interface DayItem {
  day: number;
  weekday: string;
  isActive?: boolean;
}

interface RecentUploadsCardProps {
  month?: string;
  uploadCount?: number;
  selectedDay?: string;
  days?: DayItem[];
}

export function RecentUploadsCard({
  month = "January",
  uploadCount = 8,
  selectedDay = "Thu, 11",
  days = [
    { day: 8, weekday: "Mon" },
    { day: 9, weekday: "Tue" },
    { day: 10, weekday: "Wed" },
    { day: 11, weekday: "Thu", isActive: true },
    { day: 12, weekday: "Fri" },
    { day: 13, weekday: "Sat" },
  ],
}: RecentUploadsCardProps) {
  return (
    <div className="bg-card rounded-3xl p-6 h-full min-h-[280px]">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Recent</h2>
          <h2 className="text-2xl font-bold text-foreground">Uploads</h2>
        </div>
        <button className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-full text-sm font-medium hover:bg-foreground/90 transition-colors">
          {month}
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {/* Upload count */}
      <div className="flex items-center gap-2 text-muted-foreground mb-6">
        <FileText className="h-4 w-4" />
        <span className="text-sm">{uploadCount} files • {selectedDay}</span>
      </div>

      {/* Day selector */}
      <div className="flex gap-2 justify-between">
        {days.map((dayItem) => (
          <button
            key={dayItem.day}
            className={`flex flex-col items-center py-3 px-3 rounded-2xl transition-all ${
              dayItem.isActive
                ? "bg-[hsl(65,70%,75%)] text-foreground"
                : "hover:bg-muted"
            }`}
          >
            <span className="text-lg font-bold">{dayItem.day}</span>
            <span className="text-xs text-muted-foreground">{dayItem.weekday}</span>
          </button>
        ))}
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-1 mt-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div 
            key={i} 
            className={`h-2 w-2 rounded-full ${i === 8 ? 'bg-foreground' : 'bg-muted'}`} 
          />
        ))}
      </div>
    </div>
  );
}
