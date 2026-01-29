import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, User, MapPin, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { Inspection } from "@/hooks/useInspections";
import { InspectionDetailDialog } from "./InspectionDetailDialog";
import { Skeleton } from "@/components/ui/skeleton";

interface InspectionListDialogProps {
  title: string;
  inspections: Inspection[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading?: boolean;
}

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-500",
  in_progress: "bg-yellow-500",
  completed: "bg-green-500",
  failed: "bg-red-500",
  cancelled: "bg-muted",
};

export function InspectionListDialog({
  title,
  inspections,
  open,
  onOpenChange,
  isLoading = false,
}: InspectionListDialogProps) {
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleInspectionClick = (inspection: Inspection) => {
    setSelectedInspection(inspection);
    setDetailOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md bg-card border-0 rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {title} Inspections
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              {inspections.length} inspection{inspections.length !== 1 ? 's' : ''} found
            </p>
          </DialogHeader>

          <ScrollArea className="max-h-[400px] pr-4">
            <div className="space-y-3 py-2">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-2xl" />
                ))
              ) : inspections.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No {title.toLowerCase()} inspections found</p>
                  <p className="text-sm mt-1">Create one from the hero card above</p>
                </div>
              ) : (
                inspections.map((inspection) => (
                  <button
                    key={inspection.id}
                    onClick={() => handleInspectionClick(inspection)}
                    className="w-full text-left bg-muted/50 hover:bg-muted rounded-2xl p-4 transition-colors group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={`${statusColors[inspection.status]} text-white text-xs rounded-full`}>
                          {inspection.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline" className="text-xs rounded-full capitalize">
                          {inspection.priority}
                        </Badge>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>{format(new Date(inspection.scheduled_date), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span>{inspection.inspector_name}</span>
                      </div>
                      {inspection.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{inspection.location}</span>
                        </div>
                      )}
                    </div>
                    
                    {inspection.pass_rate !== null && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              inspection.pass_rate >= 80 ? 'bg-green-500' : 
                              inspection.pass_rate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${inspection.pass_rate}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{inspection.pass_rate}%</span>
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <InspectionDetailDialog
        inspection={selectedInspection}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </>
  );
}
