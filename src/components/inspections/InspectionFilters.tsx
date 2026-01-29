import { Search, X, SlidersHorizontal, CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays } from "date-fns";
import { cn } from "@/lib/utils";
import { InspectionExport } from "./InspectionExport";
import { Inspection } from "@/hooks/useInspections";

export interface InspectionFiltersState {
  search: string;
  status: string;
  type: string;
  priority: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
}

interface InspectionFiltersProps {
  filters: InspectionFiltersState;
  onFiltersChange: (filters: InspectionFiltersState) => void;
  filteredInspections?: Inspection[];
}

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "scheduled", label: "Scheduled" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
  { value: "cancelled", label: "Cancelled" },
];

const typeOptions = [
  { value: "all", label: "All Types" },
  { value: "safety", label: "Safety" },
  { value: "structural", label: "Structural" },
  { value: "electrical", label: "Electrical" },
  { value: "plumbing", label: "Plumbing" },
  { value: "fire", label: "Fire Safety" },
  { value: "quality", label: "Quality" },
  { value: "regulatory", label: "Regulatory" },
];

const priorityOptions = [
  { value: "all", label: "All Priorities" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export function InspectionFilters({ filters, onFiltersChange, filteredInspections = [] }: InspectionFiltersProps) {
  const activeFilterCount = [
    filters.status !== "all" && filters.status,
    filters.type !== "all" && filters.type,
    filters.priority !== "all" && filters.priority,
    filters.dateFrom,
    filters.dateTo,
  ].filter(Boolean).length;

  const handleReset = () => {
    onFiltersChange({
      search: "",
      status: "all",
      type: "all",
      priority: "all",
      dateFrom: undefined,
      dateTo: undefined,
    });
  };

  const hasActiveFilters = filters.search || activeFilterCount > 0;

  return (
    <div className="bg-card rounded-3xl p-4 mb-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search inspections..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-10 rounded-full border-0 bg-muted/50 focus-visible:ring-1"
          />
          {filters.search && (
            <button
              onClick={() => onFiltersChange({ ...filters, search: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex gap-2">
          <Select
            value={filters.status}
            onValueChange={(value) => onFiltersChange({ ...filters, status: value })}
          >
            <SelectTrigger className="w-[130px] rounded-full border-0 bg-muted/50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.type}
            onValueChange={(value) => onFiltersChange({ ...filters, type: value })}
          >
            <SelectTrigger className="w-[130px] rounded-full border-0 bg-muted/50">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Advanced Filters Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="rounded-full border-0 bg-muted/50 relative"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-[hsl(65,70%,75%)] text-foreground text-xs">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-4 rounded-2xl" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Filters</h4>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleReset}
                      className="h-8 text-xs"
                    >
                      Reset all
                    </Button>
                  )}
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-sm">Status</Label>
                    <Select
                      value={filters.status}
                      onValueChange={(value) => onFiltersChange({ ...filters, status: value })}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Type</Label>
                    <Select
                      value={filters.type}
                      onValueChange={(value) => onFiltersChange({ ...filters, type: value })}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {typeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Priority</Label>
                    <Select
                      value={filters.priority}
                      onValueChange={(value) => onFiltersChange({ ...filters, priority: value })}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {priorityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label className="text-sm">Date Range</Label>
                    
                    {/* Quick Presets */}
                    <div className="flex flex-wrap gap-1.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs rounded-full px-3"
                        onClick={() => {
                          const today = new Date();
                          onFiltersChange({
                            ...filters,
                            dateFrom: startOfWeek(today, { weekStartsOn: 1 }),
                            dateTo: endOfWeek(today, { weekStartsOn: 1 }),
                          });
                        }}
                      >
                        This Week
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs rounded-full px-3"
                        onClick={() => {
                          const today = new Date();
                          onFiltersChange({
                            ...filters,
                            dateFrom: startOfMonth(today),
                            dateTo: endOfMonth(today),
                          });
                        }}
                      >
                        This Month
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs rounded-full px-3"
                        onClick={() => {
                          const today = new Date();
                          onFiltersChange({
                            ...filters,
                            dateFrom: subDays(today, 30),
                            dateTo: today,
                          });
                        }}
                      >
                        Last 30 Days
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs rounded-full px-3"
                        onClick={() => {
                          const today = new Date();
                          onFiltersChange({
                            ...filters,
                            dateFrom: today,
                            dateTo: undefined,
                          });
                        }}
                      >
                        Upcoming
                      </Button>
                    </div>

                    {/* Custom Date Pickers */}
                    <div className="grid grid-cols-2 gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal rounded-xl text-xs",
                              !filters.dateFrom && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-1 h-3 w-3" />
                            {filters.dateFrom ? format(filters.dateFrom, "MMM d") : "From"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={filters.dateFrom}
                            onSelect={(date) => onFiltersChange({ ...filters, dateFrom: date })}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal rounded-xl text-xs",
                              !filters.dateTo && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-1 h-3 w-3" />
                            {filters.dateTo ? format(filters.dateTo, "MMM d") : "To"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={filters.dateTo}
                            onSelect={(date) => onFiltersChange({ ...filters, dateTo: date })}
                            disabled={(date) => filters.dateFrom ? date < filters.dateFrom : false}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {(filters.dateFrom || filters.dateTo) && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs w-full"
                        onClick={() => onFiltersChange({ ...filters, dateFrom: undefined, dateTo: undefined })}
                      >
                        Clear dates
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Export Button */}
          <InspectionExport inspections={filteredInspections} />

          {/* Reset Button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              className="rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border/50">
          {filters.search && (
            <Badge
              variant="secondary"
              className="rounded-full px-3 py-1 flex items-center gap-1"
            >
              Search: "{filters.search}"
              <button onClick={() => onFiltersChange({ ...filters, search: "" })}>
                <X className="h-3 w-3 ml-1" />
              </button>
            </Badge>
          )}
          {filters.status !== "all" && (
            <Badge
              variant="secondary"
              className="rounded-full px-3 py-1 flex items-center gap-1 capitalize"
            >
              {filters.status.replace("_", " ")}
              <button onClick={() => onFiltersChange({ ...filters, status: "all" })}>
                <X className="h-3 w-3 ml-1" />
              </button>
            </Badge>
          )}
          {filters.type !== "all" && (
            <Badge
              variant="secondary"
              className="rounded-full px-3 py-1 flex items-center gap-1 capitalize"
            >
              {filters.type}
              <button onClick={() => onFiltersChange({ ...filters, type: "all" })}>
                <X className="h-3 w-3 ml-1" />
              </button>
            </Badge>
          )}
          {filters.priority !== "all" && (
            <Badge
              variant="secondary"
              className="rounded-full px-3 py-1 flex items-center gap-1 capitalize"
            >
              {filters.priority} priority
              <button onClick={() => onFiltersChange({ ...filters, priority: "all" })}>
                <X className="h-3 w-3 ml-1" />
              </button>
            </Badge>
          )}
          {(filters.dateFrom || filters.dateTo) && (
            <Badge
              variant="secondary"
              className="rounded-full px-3 py-1 flex items-center gap-1"
            >
              {filters.dateFrom && filters.dateTo
                ? `${format(filters.dateFrom, "MMM d")} - ${format(filters.dateTo, "MMM d")}`
                : filters.dateFrom
                ? `From ${format(filters.dateFrom, "MMM d")}`
                : `Until ${format(filters.dateTo!, "MMM d")}`}
              <button onClick={() => onFiltersChange({ ...filters, dateFrom: undefined, dateTo: undefined })}>
                <X className="h-3 w-3 ml-1" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
