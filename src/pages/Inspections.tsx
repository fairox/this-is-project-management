import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { 
  ClipboardCheck, AlertTriangle, CheckCircle2, 
  Clock, Shield, Zap, HardHat, Flame
} from "lucide-react";
import {
  InspectionHeroCard,
  UpcomingInspectionsCard,
  InspectionTimelineCard,
  InspectionStatsCard,
  ComplianceChartCard,
  InspectionTypeCard,
} from "@/components/inspections/bento";
import {
  DateCard,
  TotalTimeCard,
  TeamMemberCard,
} from "@/components/projects/bento";
import { useInspections, useInspectionStats } from "@/hooks/useInspections";
import { InspectionFilters, InspectionFiltersState } from "@/components/inspections/InspectionFilters";
import { FilteredInspectionsList } from "@/components/inspections/FilteredInspectionsList";

const Inspections = () => {
  const { data: stats, isLoading: statsLoading } = useInspectionStats();
  const { data: inspections, isLoading: inspectionsLoading } = useInspections();
  
  const [filters, setFilters] = useState<InspectionFiltersState>({
    search: "",
    status: "all",
    type: "all",
    priority: "all",
    dateFrom: undefined,
    dateTo: undefined,
  });

  const hasActiveFilters = 
    filters.search || 
    filters.status !== "all" || 
    filters.type !== "all" || 
    filters.priority !== "all" ||
    filters.dateFrom ||
    filters.dateTo;

  // Compute filtered inspections for export
  const filteredInspections = useMemo(() => {
    if (!inspections) return [];
    
    return inspections.filter((inspection) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          inspection.inspector_name.toLowerCase().includes(searchLower) ||
          inspection.type.toLowerCase().includes(searchLower) ||
          inspection.location?.toLowerCase().includes(searchLower) ||
          inspection.notes?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      if (filters.status !== "all" && inspection.status !== filters.status) {
        return false;
      }

      if (filters.type !== "all" && inspection.type !== filters.type) {
        return false;
      }

      if (filters.priority !== "all" && inspection.priority !== filters.priority) {
        return false;
      }

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

  return (
    <AppLayout>
      <div className="container mx-auto p-6">
        {/* Search and Filters */}
        <InspectionFilters 
          filters={filters} 
          onFiltersChange={setFilters} 
          filteredInspections={hasActiveFilters ? filteredInspections : (inspections || [])}
        />

        {/* Show filtered list when filters are active */}
        {hasActiveFilters && (
          <div className="mb-4">
            <FilteredInspectionsList 
              inspections={inspections || []} 
              filters={filters}
              isLoading={inspectionsLoading}
            />
          </div>
        )}

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-min">
          
          {/* Row 1 */}
          {/* Hero Card - spans 2 cols, 2 rows */}
          <div className="lg:col-span-2 lg:row-span-2">
            <InspectionHeroCard />
          </div>

          {/* Upcoming Inspections - spans 2 cols */}
          <div className="lg:col-span-2">
            <UpcomingInspectionsCard />
          </div>

          {/* Stats cards - fit beside hero on second row */}
          <div>
            <InspectionStatsCard 
              icon={CheckCircle2}
              label="Completed"
              value={stats?.completed || 0}
              trend={stats ? `+${stats.completed}` : undefined}
              variant="accent"
              isLoading={statsLoading}
            />
          </div>
          <div>
            <InspectionStatsCard 
              icon={AlertTriangle}
              label="Issues Found"
              value={stats?.failed || 0}
              trend={stats?.failed ? `-${stats.failed}` : undefined}
              variant="default"
              isLoading={statsLoading}
            />
          </div>

          {/* Row 3 */}
          {/* Inspection Timeline - spans 2 cols */}
          <div className="lg:col-span-2">
            <InspectionTimelineCard />
          </div>

          {/* Date Card */}
          <div>
            <DateCard />
          </div>

          {/* Total Time Card */}
          <div>
            <TotalTimeCard hours={stats?.total ? stats.total * 2 : 0} label="Inspection hours" />
          </div>

          {/* Row 4 */}
          {/* Inspection Types */}
          <div>
            <InspectionTypeCard 
              title="Safety" 
              icon={Shield}
              typeKey="safety"
              link="/inspections"
              variant="default"
            />
          </div>

          {/* Compliance Chart */}
          <div>
            <ComplianceChartCard />
          </div>

          {/* More Inspection Types */}
          <div>
            <InspectionTypeCard 
              title="Electrical" 
              icon={Zap}
              typeKey="electrical"
              link="/inspections"
              variant="accent"
            />
          </div>

          {/* AI Assistant Card */}
          <div>
            <TeamMemberCard 
              name="Smart"
              role="Inspector AI"
            />
          </div>

          {/* Row 5 */}
          <div>
            <InspectionTypeCard 
              title="Structural" 
              icon={HardHat}
              typeKey="structural"
              link="/inspections"
              variant="dark"
            />
          </div>

          <div>
            <InspectionStatsCard 
              icon={Clock}
              label="Avg. Duration"
              value={2.5}
              suffix="h"
              variant="muted"
            />
          </div>

          <div>
            <InspectionStatsCard 
              icon={ClipboardCheck}
              label="Pending Review"
              value={stats?.scheduled || 0}
              variant="default"
              isLoading={statsLoading}
            />
          </div>

          <div>
            <InspectionStatsCard 
              icon={CheckCircle2}
              label="Pass Rate"
              value={stats?.averagePassRate || 0}
              suffix="%"
              variant="accent"
              isLoading={statsLoading}
            />
          </div>

          {/* Row 6 - Additional inspection types */}
          <div>
            <InspectionTypeCard 
              title="Fire Safety" 
              icon={Flame}
              typeKey="fire"
              link="/inspections"
              variant="accent"
            />
          </div>

          <div>
            <InspectionStatsCard 
              icon={ClipboardCheck}
              label="In Progress"
              value={stats?.inProgress || 0}
              variant="muted"
              isLoading={statsLoading}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Inspections;
