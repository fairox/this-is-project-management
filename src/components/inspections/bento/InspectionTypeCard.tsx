import { LucideIcon, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useInspectionsByType } from "@/hooks/useInspections";
import { Skeleton } from "@/components/ui/skeleton";
import { InspectionListDialog } from "../InspectionListDialog";

interface InspectionTypeCardProps {
  title: string;
  icon: LucideIcon;
  link?: string;
  variant?: "default" | "accent" | "dark";
  typeKey?: string;
}

export function InspectionTypeCard({
  title,
  icon: Icon,
  link = "/inspections",
  variant = "default",
  typeKey,
}: InspectionTypeCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const lookupType = typeKey || title.toLowerCase();
  const { data: inspections, isLoading } = useInspectionsByType(lookupType);
  
  const count = inspections?.length || 0;

  const bgClass = {
    default: "bg-card",
    accent: "bg-[hsl(65,70%,75%)]",
    dark: "bg-foreground text-background",
  }[variant];

  const handleClick = () => {
    setDialogOpen(true);
  };

  return (
    <>
      <button 
        onClick={handleClick}
        className={`${bgClass} rounded-3xl p-6 flex flex-col justify-between h-full min-h-[160px] group transition-all hover:shadow-md hover:scale-[1.02] w-full text-left`}
      >
        <div className="flex items-center justify-between">
          <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
            variant === "dark" ? "bg-background/10" : variant === "accent" ? "bg-foreground/10" : "bg-muted"
          }`}>
            <Icon className={`h-6 w-6 ${variant === "dark" ? "text-background" : "text-foreground"}`} />
          </div>
          {isLoading ? (
            <Skeleton className={`h-8 w-8 rounded ${variant === "dark" ? "bg-background/20" : ""}`} />
          ) : (
            <span className={`text-2xl font-bold ${variant === "dark" ? "text-background" : "text-foreground"}`}>
              {count}
            </span>
          )}
        </div>
        
        <div className="flex items-end justify-between">
          <h3 className={`font-bold text-lg ${variant === "dark" ? "text-background" : "text-foreground"}`}>
            {title}
          </h3>
          <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1 ${
            variant === "dark" ? "bg-background/10" : "bg-muted"
          }`}>
            <ArrowRight className={`h-4 w-4 ${variant === "dark" ? "text-background" : "text-foreground"}`} />
          </div>
        </div>
      </button>

      <InspectionListDialog
        title={title}
        inspections={inspections || []}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        isLoading={isLoading}
      />
    </>
  );
}
