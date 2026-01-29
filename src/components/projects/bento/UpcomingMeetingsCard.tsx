import { Phone, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const DAYS = [
  { day: 8, label: "Mon" },
  { day: 9, label: "Tue" },
  { day: 10, label: "Wed" },
  { day: 11, label: "Thu" },
  { day: 12, label: "Fri" },
  { day: 13, label: "Sat" },
];

interface UpcomingMeetingsCardProps {
  callCount?: number;
  selectedDay?: number;
}

export function UpcomingMeetingsCard({
  callCount = 3,
  selectedDay = 11,
}: UpcomingMeetingsCardProps) {
  const [activeDay, setActiveDay] = useState(selectedDay);
  const activeDayData = DAYS.find(d => d.day === activeDay);

  return (
    <div className="bg-card rounded-3xl p-6 flex flex-col h-full min-h-[280px]">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tight leading-tight">
          Upcoming<br />Meetings
        </h2>
        <Select defaultValue="january">
          <SelectTrigger className="w-auto h-10 bg-foreground text-background border-0 rounded-full px-4 gap-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="january">January</SelectItem>
            <SelectItem value="february">February</SelectItem>
            <SelectItem value="march">March</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Call Info */}
      <div className="flex items-center gap-2 text-muted-foreground mb-6">
        <Phone className="h-4 w-4" />
        <span className="text-sm">
          {callCount} calls • {activeDayData?.label}, {activeDay}
        </span>
      </div>

      {/* Day Selector */}
      <div className="flex gap-2 mt-auto">
        {DAYS.map((dayItem) => (
          <button
            key={dayItem.day}
            onClick={() => setActiveDay(dayItem.day)}
            className={`flex-1 flex flex-col items-center py-3 px-2 rounded-2xl transition-all ${
              activeDay === dayItem.day
                ? "bg-[hsl(65,70%,75%)] text-foreground"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            }`}
          >
            <span className="text-lg font-semibold">{dayItem.day}</span>
            <span className="text-xs">{dayItem.label}</span>
          </button>
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-1.5 mt-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === 4 ? "w-4 bg-foreground" : "w-1.5 bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
