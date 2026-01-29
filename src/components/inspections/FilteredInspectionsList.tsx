import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, User, MapPin, ArrowRight, Search } from "lucide-react";
import { format } from "date-fns";
import { Inspection } from "@/hooks/useInspections";
import { InspectionDetailDialog } from "./InspectionDetailDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { InspectionFiltersState } from "./InspectionFilters";

interface FilteredInspectionsListProps {
  inspections: Inspection[];
  filters: InspectionFiltersState;
  isLoading?: boolean;
}

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-500",
  in_progress: "bg-yellow-500",
  completed: "bg-green-500",
  failed: "bg-red-500",
  cancelled: "bg-muted",
};

export function FilteredInspectionsList({
  inspections,
  filters,
  isLoading = false,
}: FilteredInspectionsListProps) {
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredInspections = useMemo(() => {
    return inspections.filter((inspection) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          inspection.inspector_name.toLowerCase().includes(searchLower) ||
          inspection.type.toLowerCase().includes(searchLower) ||
          inspection.location?.toLowerCase().includes(searchLower) ||
          inspection.notes?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status !== "all" && inspection.status !== filters.status) {
        return false;
      }

      // Type filter
      if (filters.type !== "all" && inspection.type !== filters.type) {
        return false;
      }

      // Priority filter
      if (filters.priority !== "all" && inspection.priority !== filters.priority) {
        return false;
      }

      // Date range filter
      const inspectionDate = new Date(inspection.scheduled_date);
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        if (inspectionDate < fromDate) return false;
      }
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999);
        if (inspectionDate > toDate) return false;
      }

      return true;
    });
  }, [inspections, filters]);

  const handleInspectionClick = (inspection: Inspection) => {
    setSelectedInspection(inspection);
    setDialogOpen(true);
  };

  const hasActiveFilters = 
    filters.search || 
    filters.status !== "all" || 
    filters.type !== "all" || 
    filters.priority !== "all" ||
    filters.dateFrom ||
    filters.dateTo;

  if (isLoading) {
    return (
      <div className="bg-card rounded-3xl p-6">
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">
            {hasActiveFilters ? "Filtered Results" : "All Inspections"}
          </h3>
          <Badge variant="secondary" className="rounded-full">
            {filteredInspections.length} {filteredInspections.length === 1 ? "result" : "results"}
          </Badge>
        </div>

        <ScrollArea className="max-h-[500px]">
          <div className="space-y-3 pr-4">
            {filteredInspections.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="font-medium">No inspections found</p>
                <p className="text-sm mt-1">
                  {hasActiveFilters
                    ? "Try adjusting your filters"
                    : "Create your first inspection from the hero card above"}
                </p>
              </div>
            ) : (
              filteredInspections.map((inspection) => (
                <button
                  key={inspection.id}
                  onClick={() => handleInspectionClick(inspection)}
                  className="w-full text-left bg-muted/30 hover:bg-muted/60 rounded-2xl p-4 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={`${statusColors[inspection.status]} text-white text-xs rounded-full`}>
                        {inspection.status.replace("_", " ")}
                      </Badge>
                      <Badge variant="outline" className="text-xs rounded-full capitalize">
                        {inspection.type}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-xs rounded-full capitalize ${
                          inspection.priority === 'high' ? 'border-red-300 text-red-600' :
                          inspection.priority === 'medium' ? 'border-yellow-300 text-yellow-600' :
                          'border-muted'
                        }`}
                      >
                        {inspection.priority}
                      </Badge>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform flex-shrink-0" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span>{format(new Date(inspection.scheduled_date), "MMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{inspection.inspector_name}</span>
                    </div>
                    {inspection.location && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{inspection.location}</span>
                      </div>
                    )}
                  </div>

                  {inspection.pass_rate !== null && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            inspection.pass_rate >= 80
                              ? "bg-green-500"
                              : inspection.pass_rate >= 60
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${inspection.pass_rate}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium w-10 text-right">
                        {inspection.pass_rate}%
                      </span>
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      <InspectionDetailDialog
        inspection={selectedInspection}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
