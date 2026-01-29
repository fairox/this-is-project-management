import { Bell, Info, Send, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useInspectionStats, useCreateInspection } from "@/hooks/useInspections";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateInspectionDialog } from "../CreateInspectionDialog";

interface InspectionHeroCardProps {
  inspectorName?: string;
  inspectorRole?: string;
  inspectorAvatar?: string;
}

export function InspectionHeroCard({
  inspectorName = "Sarah Chen",
  inspectorRole = "Lead Inspector",
  inspectorAvatar = "/lovable-uploads/169f31b7-148d-45f3-aa09-967fbcae3b16.png",
}: InspectionHeroCardProps) {
  const [selectedType, setSelectedType] = useState<string>("");
  const { data: stats, isLoading: statsLoading } = useInspectionStats();
  const createInspection = useCreateInspection();

  const completedCount = stats?.completed || 0;
  const totalCount = stats?.total || 0;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const inspectionTypes = [
    { value: "safety", label: "Safety Inspection" },
    { value: "structural", label: "Structural Inspection" },
    { value: "electrical", label: "Electrical Inspection" },
    { value: "plumbing", label: "Plumbing Inspection" },
    { value: "fire", label: "Fire Safety Inspection" },
    { value: "quality", label: "Quality Inspection" },
    { value: "regulatory", label: "Regulatory Inspection" },
  ];

  const handleNotifications = () => {
    toast.info("Notifications opened", { description: "You have 3 unread notifications" });
  };

  const handleInfo = () => {
    toast.info("Help & Information", { description: "View inspection guidelines and documentation" });
  };

  const handleStartInspection = () => {
    if (selectedType) {
      const typeName = inspectionTypes.find(t => t.value === selectedType)?.label;

      // Create a new inspection in the database
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      createInspection.mutate({
        type: selectedType as "safety" | "structural" | "electrical" | "plumbing" | "fire" | "quality" | "regulatory",
        status: 'scheduled',
        scheduled_date: tomorrow.toISOString().split('T')[0],
        completed_date: null,
        inspector_id: null,
        inspector_name: inspectorName,
        notes: `New ${typeName} scheduled`,
        priority: 'medium',
        location: null,
        checklist_items: [],
        photos: [],
        pass_rate: null,
        project_id: null,
      });

      setSelectedType("");
    } else {
      toast.warning("Select an inspection type first");
    }
  };

  return (
    <div className="bg-[hsl(65,70%,75%)] rounded-3xl p-6 flex flex-col h-full min-h-[320px] relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-background/20">
            <AvatarImage src={inspectorAvatar} alt={inspectorName} />
            <AvatarFallback className="bg-background/20 text-foreground">SC</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{inspectorName}</p>
            <p className="text-sm text-foreground/70">{inspectorRole}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <CreateInspectionDialog
            trigger={
              <button className="h-10 w-10 rounded-full bg-card flex items-center justify-center hover:bg-card/80 transition-colors hover:scale-105">
                <Plus className="h-4 w-4 text-foreground" />
              </button>
            }
          />
          <button
            onClick={handleNotifications}
            className="h-10 w-10 rounded-full bg-card flex items-center justify-center hover:bg-card/80 transition-colors hover:scale-105"
          >
            <Bell className="h-4 w-4 text-foreground" />
          </button>
          <button
            onClick={handleInfo}
            className="h-10 w-10 rounded-full bg-card flex items-center justify-center hover:bg-card/80 transition-colors hover:scale-105"
          >
            <Info className="h-4 w-4 text-foreground" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <h2 className="text-3xl font-bold text-foreground mb-2">Site Inspections</h2>
        <p className="text-foreground/70 text-sm mb-6">Category: Quality & Safety</p>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-foreground/70">Inspection progress</span>
            {statsLoading ? (
              <Skeleton className="h-4 w-12" />
            ) : (
              <span className="font-semibold text-foreground">{progressPercent}%</span>
            )}
          </div>
          <div className="h-2 bg-foreground/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-foreground rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1 text-foreground/60">
            <span>{completedCount} completed</span>
            <span>{totalCount} total</span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex gap-3 items-center">
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="flex-1 h-14 bg-card/90 backdrop-blur-sm border-0 rounded-full shadow-sm text-base">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <SelectValue placeholder="Select inspection type" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-card border shadow-lg z-50">
            {inspectionTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <button
          onClick={handleStartInspection}
          disabled={createInspection.isPending}
          className="h-14 w-14 rounded-full bg-foreground flex items-center justify-center hover:bg-foreground/90 transition-all hover:scale-105 disabled:opacity-50"
        >
          <Send className="h-5 w-5 text-background" />
        </button>
      </div>
    </div>
  );
}
