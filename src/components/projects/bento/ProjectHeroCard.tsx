import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Bell, Info, ChevronDown, Send, FileText } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProjectHeroCardProps {
  projectName: string;
  industry: string;
  progress: number;
  managerName: string;
  managerRole: string;
  managerAvatar?: string;
}

export function ProjectHeroCard({
  projectName = "Metro Tower Complex",
  industry = "Construction",
  progress = 34,
  managerName = "Sarah Chen",
  managerRole = "Project Manager",
  managerAvatar,
}: ProjectHeroCardProps) {
  return (
    <div className="bg-[hsl(65,70%,75%)] rounded-3xl p-6 flex flex-col h-full min-h-[320px] relative overflow-hidden">
      {/* Top Row - Avatar & Actions */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-background/20">
            <AvatarImage src={managerAvatar} />
            <AvatarFallback className="bg-background/20 text-foreground font-medium">
              {managerName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{managerName}</p>
            <p className="text-sm text-foreground/70">{managerRole}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="h-10 w-10 rounded-full bg-card shadow-sm flex items-center justify-center hover:shadow-md transition-all">
            <Bell className="h-4 w-4" />
          </button>
          <button className="h-10 w-10 rounded-full bg-card shadow-sm flex items-center justify-center hover:shadow-md transition-all">
            <Info className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Project Name */}
      <h2 className="text-3xl font-bold text-foreground mb-2 tracking-tight">{projectName}</h2>
      <p className="text-sm text-foreground/70 mb-6">
        Industry: <span className="font-medium text-foreground">{industry}</span>
      </p>

      {/* Progress Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-foreground/70">Project progress</span>
          <span className="text-sm font-semibold text-foreground">{progress}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-foreground/20 overflow-hidden">
          <div 
            className="h-full rounded-full bg-foreground transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center gap-3 mt-auto">
        <Select defaultValue="report1">
          <SelectTrigger className="flex-1 h-12 bg-card/80 backdrop-blur-sm border-0 rounded-full shadow-sm">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <SelectValue placeholder="Select a report" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="report1">Weekly Progress</SelectItem>
            <SelectItem value="report2">Budget Analysis</SelectItem>
            <SelectItem value="report3">Risk Assessment</SelectItem>
            <SelectItem value="report4">Quality Report</SelectItem>
          </SelectContent>
        </Select>
        <Button size="icon" className="h-12 w-12 bg-foreground hover:bg-foreground/90">
          <Send className="h-5 w-5 text-background" />
        </Button>
      </div>
    </div>
  );
}
