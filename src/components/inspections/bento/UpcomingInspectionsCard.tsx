import { ClipboardCheck } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Inspection, useUpcomingInspections } from "@/hooks/useInspections";
import { Skeleton } from "@/components/ui/skeleton";
import { InspectionDetailDialog } from "../InspectionDetailDialog";

interface DayItem {
  date: Date;
  day: number;
  weekday: string;
  isActive?: boolean;
  inspectionCount: number;
}

export function UpcomingInspectionsCard() {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'MMMM'));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { data: upcomingInspections, isLoading } = useUpcomingInspections(20);

  const handleInspectionClick = (inspection: Inspection) => {
    setSelectedInspection(inspection);
    setDialogOpen(true);
  };

  const months = ["January", "February", "March", "April", "May", "June", 
                  "July", "August", "September", "October", "November", "December"];

  // Generate days for the current week
  const days = useMemo(() => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday
    const weekDays: DayItem[] = [];
    
    for (let i = 0; i < 6; i++) {
      const date = addDays(weekStart, i);
      const inspectionsOnDay = upcomingInspections?.filter(
        insp => isSameDay(new Date(insp.scheduled_date), date)
      ).length || 0;
      
      weekDays.push({
        date,
        day: date.getDate(),
        weekday: format(date, 'EEE'),
        isActive: isSameDay(date, selectedDate),
        inspectionCount: inspectionsOnDay,
      });
    }
    
    return weekDays;
  }, [selectedDate, upcomingInspections]);

  const inspectionsForSelectedDay = useMemo(() => {
    return upcomingInspections?.filter(
      insp => isSameDay(new Date(insp.scheduled_date), selectedDate)
    ) || [];
  }, [upcomingInspections, selectedDate]);

  const totalUpcoming = upcomingInspections?.length || 0;

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    const monthIndex = months.indexOf(month);
    const newDate = new Date(selectedDate);
    newDate.setMonth(monthIndex);
    setSelectedDate(newDate);
    toast.info(`Viewing inspections for ${month}`);
  };

  const handleDaySelect = (dayItem: DayItem) => {
    setSelectedDate(dayItem.date);
    const count = dayItem.inspectionCount;
    toast.success(`${format(dayItem.date, 'EEEE, MMM d')}`, { 
      description: count > 0 ? `${count} inspection${count > 1 ? 's' : ''} scheduled` : 'No inspections scheduled'
    });
  };

  return (
    <div className="bg-card rounded-3xl p-6 h-full min-h-[280px]">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Upcoming</h2>
          <h2 className="text-2xl font-bold text-foreground">Inspections</h2>
        </div>
        <Select value={selectedMonth} onValueChange={handleMonthChange}>
          <SelectTrigger className="bg-foreground text-background px-4 py-2 rounded-full text-sm font-medium hover:bg-foreground/90 transition-colors border-0 w-auto">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border shadow-lg z-50">
            {months.map((m) => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Inspection count */}
      <div className="flex items-center gap-2 text-muted-foreground mb-6">
        <ClipboardCheck className="h-4 w-4" />
        {isLoading ? (
          <Skeleton className="h-4 w-40" />
        ) : (
          <span className="text-sm">
            {totalUpcoming} upcoming • {inspectionsForSelectedDay.length} on {format(selectedDate, 'EEE, d')}
          </span>
        )}
      </div>

      {/* Day selector */}
      <div className="flex gap-2 justify-between">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-12 rounded-2xl" />
          ))
        ) : (
          days.map((dayItem) => (
            <button
              key={dayItem.date.toISOString()}
              onClick={() => handleDaySelect(dayItem)}
              className={`flex flex-col items-center py-3 px-3 rounded-2xl transition-all hover:scale-105 relative ${
                dayItem.isActive
                  ? "bg-[hsl(65,70%,75%)] text-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <span className="text-lg font-bold">{dayItem.day}</span>
              <span className="text-xs text-muted-foreground">{dayItem.weekday}</span>
              {dayItem.inspectionCount > 0 && (
                <span className={`absolute -top-1 -right-1 h-5 w-5 rounded-full text-xs flex items-center justify-center font-medium ${
                  dayItem.isActive ? 'bg-foreground text-background' : 'bg-primary text-primary-foreground'
                }`}>
                  {dayItem.inspectionCount}
                </span>
              )}
            </button>
          ))
        )}
      </div>

      {/* Inspection list preview */}
      {inspectionsForSelectedDay.length > 0 && (
        <div className="mt-4 space-y-2">
          {inspectionsForSelectedDay.slice(0, 2).map((insp) => (
            <button
              key={insp.id}
              onClick={() => handleInspectionClick(insp)}
              className="flex items-center gap-2 text-sm bg-muted/50 rounded-lg px-3 py-2 w-full text-left hover:bg-muted transition-colors cursor-pointer"
            >
              <span className="capitalize font-medium">{insp.type}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground truncate">{insp.inspector_name}</span>
            </button>
          ))}
          {inspectionsForSelectedDay.length > 2 && (
            <p className="text-xs text-muted-foreground text-center">
              +{inspectionsForSelectedDay.length - 2} more
            </p>
          )}
        </div>
      )}

      <InspectionDetailDialog
        inspection={selectedInspection}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-1 mt-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div 
            key={i} 
            className={`h-2 w-2 rounded-full ${i === new Date().getMonth() ? 'bg-foreground' : 'bg-muted'}`} 
          />
        ))}
      </div>
    </div>
  );
}
