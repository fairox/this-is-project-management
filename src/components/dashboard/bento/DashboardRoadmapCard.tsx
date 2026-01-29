import { Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Task {
  name: string;
  progress: number;
  color: "accent" | "muted" | "default";
  avatars: string[];
}

interface DashboardRoadmapCardProps {
  tasks?: Task[];
}

export function DashboardRoadmapCard({
  tasks = [
    { name: "Intro", progress: 100, color: "accent", avatars: ["/placeholder.svg", "/placeholder.svg"] },
    { name: "Audit", progress: 59, color: "muted", avatars: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"] },
    { name: "Research", progress: 75, color: "accent", avatars: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"] },
  ],
}: DashboardRoadmapCardProps) {
  const days = ["Mon 12", "Tue 13", "Wed 14", "Thu 15", "Fri 16"];

  const getBarColor = (color: Task["color"]) => {
    switch (color) {
      case "accent":
        return "bg-[hsl(65,70%,75%)]";
      case "muted":
        return "bg-muted";
      default:
        return "bg-card";
    }
  };

  const getStripeClass = (color: Task["color"]) => {
    if (color === "muted") {
      return "bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(0,0,0,0.05)_4px,rgba(0,0,0,0.05)_8px)]";
    }
    return "";
  };

  return (
    <div className="bg-card rounded-3xl p-6 h-full min-h-[280px]">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Project</h2>
          <h2 className="text-2xl font-bold text-foreground">Roadmap</h2>
        </div>
        <button className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-full text-sm font-medium hover:bg-foreground/90 transition-colors">
          <Plus className="h-4 w-4" />
          Add task
        </button>
      </div>

      {/* Roadmap Chart */}
      <div className="relative mt-8">
        {/* Vertical timeline line */}
        <div className="absolute left-[45%] top-0 bottom-8 w-px bg-border" />

        {/* Task bars */}
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.name} className="flex items-center gap-4">
              {/* Task bar */}
              <div className="flex-1 flex items-center">
                <div
                  className={`${getBarColor(task.color)} ${getStripeClass(task.color)} rounded-full px-4 py-2 flex items-center gap-2`}
                  style={{
                    width: `${Math.min(task.progress, 100)}%`,
                    minWidth: "80px",
                  }}
                >
                  <span className="text-sm font-medium text-foreground truncate">{task.name}</span>
                  <span className="text-xs text-foreground/70 ml-auto">{task.progress}%</span>
                </div>
              </div>

              {/* Connector dot */}
              <div className="h-3 w-3 rounded-full bg-card border-2 border-foreground z-10" />

              {/* Avatars */}
              <div className="flex -space-x-2">
                {task.avatars.slice(0, 3).map((avatar, i) => (
                  <Avatar key={i} className="h-8 w-8 border-2 border-card">
                    <AvatarImage src={avatar} />
                    <AvatarFallback className="bg-muted text-xs">
                      {String.fromCharCode(65 + i)}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Day labels */}
        <div className="flex justify-between mt-6 text-xs text-muted-foreground">
          {days.map((day, index) => (
            <span key={day} className={index === 3 ? "font-bold text-foreground" : ""}>
              {day}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
