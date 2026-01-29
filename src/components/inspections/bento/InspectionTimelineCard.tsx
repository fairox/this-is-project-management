import { Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { format, startOfWeek, addDays } from "date-fns";
import { Inspection, useInspections } from "@/hooks/useInspections";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InspectionDetailDialog } from "../InspectionDetailDialog";

interface TimelineTask {
  id: string;
  name: string;
  progress: number;
  color: "accent" | "muted" | "default";
  type: string;
  inspectorName: string;
  status: string;
}

export function InspectionTimelineCard() {
  const { data: inspections, isLoading } = useInspections();
  const navigate = useNavigate();
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleInspectionClick = (type: string) => {
    // Find the first inspection of this type to show in the dialog
    const inspection = inspections?.find(i => i.type === type);
    if (inspection) {
      setSelectedInspection(inspection);
      setDialogOpen(true);
    } else {
      toast.info(`No ${type} inspections found`);
    }
  };

  // Get current week days
  const weekDays = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    return Array.from({ length: 5 }).map((_, i) => {
      const date = addDays(start, i);
      return format(date, 'EEE d');
    });
  }, []);

  // Convert inspections to timeline tasks
  const tasks: TimelineTask[] = useMemo(() => {
    if (!inspections) return [];
    
    // Get distinct inspection types with their stats
    const typeStats = inspections.reduce((acc, insp) => {
      if (!acc[insp.type]) {
        acc[insp.type] = { total: 0, completed: 0, latestInspector: insp.inspector_name, latestStatus: insp.status };
      }
      acc[insp.type].total++;
      if (insp.status === 'completed') acc[insp.type].completed++;
      return acc;
    }, {} as Record<string, { total: number; completed: number; latestInspector: string; latestStatus: string }>);

    const colors: ("accent" | "muted" | "default")[] = ["accent", "muted", "accent"];
    
    return Object.entries(typeStats).slice(0, 3).map(([type, stats], index) => ({
      id: type,
      name: type.charAt(0).toUpperCase() + type.slice(1),
      progress: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
      color: colors[index % colors.length],
      type,
      inspectorName: stats.latestInspector,
      status: stats.latestStatus,
    }));
  }, [inspections]);

  const getBarColor = (color: TimelineTask["color"]) => {
    switch (color) {
      case "accent":
        return "bg-[hsl(65,70%,75%)]";
      case "muted":
        return "bg-muted";
      default:
        return "bg-card";
    }
  };

  const handleAddInspection = () => {
    toast.success("Add Inspection", { description: "Opening inspection scheduler..." });
    // Could navigate to a create inspection page or open a modal
  };

  return (
    <div className="bg-card rounded-3xl p-6 h-full min-h-[280px]">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Inspection</h2>
          <h2 className="text-2xl font-bold text-foreground">Schedule</h2>
        </div>
        <button 
          onClick={handleAddInspection}
          className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-full text-sm font-medium hover:bg-foreground/90 transition-all hover:scale-105"
        >
          <Plus className="h-4 w-4" />
          Add inspection
        </button>
      </div>

      {/* Timeline */}
      <div className="relative mt-8">
        {/* Vertical line */}
        <div className="absolute left-[45%] top-0 bottom-8 w-px bg-border" />
        
        {/* Tasks */}
        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="flex-1 h-10 rounded-full" />
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-8 w-20" />
              </div>
            ))
          ) : tasks.length > 0 ? (
            tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-4">
                {/* Task bar */}
                <div className="flex-1 flex items-center">
                  <button 
                    className={`${getBarColor(task.color)} rounded-full px-4 py-2 flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity`}
                    style={{ 
                      width: `${Math.max(Math.min(task.progress, 100) * 0.8, 30)}%`,
                      minWidth: "120px"
                    }}
                    onClick={() => handleInspectionClick(task.type)}
                  >
                    <span className="text-sm font-medium text-foreground truncate">{task.name}</span>
                    <span className="text-xs text-foreground/70 ml-auto">{task.progress}%</span>
                  </button>
                </div>
                
                {/* Connector dot */}
                <div className="h-3 w-3 rounded-full bg-card border-2 border-foreground z-10" />
                
                {/* Inspector info */}
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 border-2 border-card">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-muted text-xs">
                      {task.inspectorName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground hidden lg:block truncate max-w-[80px]">
                    {task.inspectorName.split(' ')[0]}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">No inspections found</p>
          )}
        </div>

        {/* Timeline labels */}
        <div className="flex justify-between mt-6 text-xs text-muted-foreground">
          {weekDays.map((day, index) => (
            <span key={day} className={index === Math.floor(weekDays.length / 2) ? "font-bold text-foreground" : ""}>
              {day}
            </span>
          ))}
        </div>
      </div>

      <InspectionDetailDialog
        inspection={selectedInspection}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
