import { ChevronDown, Activity } from "lucide-react";

interface ActivityItem {
  tool: string;
  action: string;
  time: string;
}

interface RecentActivityCardProps {
  activities?: ActivityItem[];
  month?: string;
}

export function RecentActivityCard({
  activities = [
    { tool: "Budget Analysis", action: "Report generated", time: "2h ago" },
    { tool: "Document Upload", action: "5 files added", time: "4h ago" },
    { tool: "Timeline Generator", action: "Schedule updated", time: "Yesterday" },
  ],
  month = "January",
}: RecentActivityCardProps) {
  return (
    <div className="bg-card rounded-3xl p-6 h-full min-h-[280px]">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Recent</h2>
          <h2 className="text-2xl font-bold text-foreground">Activity</h2>
        </div>
        <button className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-full text-sm font-medium hover:bg-foreground/90 transition-colors">
          {month}
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {/* Activity indicator */}
      <div className="flex items-center gap-2 text-muted-foreground mb-4">
        <Activity className="h-4 w-4" />
        <span className="text-sm">{activities.length} actions today</span>
      </div>

      {/* Activity list */}
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-3 rounded-2xl bg-muted/50"
          >
            <div>
              <p className="font-medium text-sm text-foreground">{activity.tool}</p>
              <p className="text-xs text-muted-foreground">{activity.action}</p>
            </div>
            <span className="text-xs text-muted-foreground">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
