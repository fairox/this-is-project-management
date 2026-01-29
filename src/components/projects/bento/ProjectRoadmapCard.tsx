import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus } from "lucide-react";

interface Task {
  id: string;
  name: string;
  progress: number;
  startDay: number;
  endDay: number;
  members: { name: string; avatar?: string }[];
}

const TASKS: Task[] = [
  {
    id: "1",
    name: "Intro",
    progress: 100,
    startDay: 0,
    endDay: 2,
    members: [
      { name: "John Doe" },
      { name: "Jane Smith" },
    ],
  },
  {
    id: "2",
    name: "Audit",
    progress: 59,
    startDay: 1.5,
    endDay: 4,
    members: [
      { name: "Mike Chen" },
      { name: "Sarah Lee" },
      { name: "Tom Brown" },
    ],
  },
  {
    id: "3",
    name: "Research",
    progress: 75,
    startDay: 0.5,
    endDay: 3.5,
    members: [
      { name: "Anna White" },
      { name: "Bob Green" },
      { name: "Chris Black" },
    ],
  },
];

const DAYS = ["Mon 12", "Tue 13", "Wed 14", "Thu 15", "Fri 16"];

export function ProjectRoadmapCard() {
  return (
    <div className="bg-card rounded-3xl p-6 flex flex-col h-full min-h-[320px]">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <h2 className="text-2xl font-bold tracking-tight leading-tight">
          Project<br />Roadmap
        </h2>
        <Button className="h-10 px-4 bg-foreground text-background hover:bg-foreground/90 gap-2">
          <Plus className="h-4 w-4" />
          Add task
        </Button>
      </div>

      {/* Gantt Chart */}
      <div className="flex-1 relative">
        {/* Grid Lines */}
        <div className="absolute inset-0 flex">
          {DAYS.map((_, i) => (
            <div key={i} className="flex-1 border-l border-dashed border-muted-foreground/20 first:border-l-0" />
          ))}
        </div>

        {/* Tasks */}
        <div className="relative space-y-3">
          {TASKS.map((task, index) => {
            const left = (task.startDay / 5) * 100;
            const width = ((task.endDay - task.startDay) / 5) * 100;
            const topOffset = index * 48;

            return (
              <div
                key={task.id}
                className="absolute h-10 flex items-center"
                style={{
                  left: `${left}%`,
                  width: `${width}%`,
                  top: `${topOffset}px`,
                }}
              >
                {/* Task Bar */}
                <div className={`h-full rounded-full flex items-center px-4 gap-2 min-w-0 ${
                  task.progress === 100 
                    ? "bg-[hsl(65,70%,75%)]" 
                    : "bg-muted"
                }`}>
                  <span className="font-medium text-sm truncate">{task.name}</span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{task.progress}%</span>
                  
                  {/* Avatars */}
                  <div className="flex -space-x-2 ml-auto">
                    {task.members.slice(0, 3).map((member, i) => (
                      <Avatar key={i} className="h-6 w-6 border-2 border-card">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="text-[10px] bg-muted-foreground/20">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>

                {/* Connector Line */}
                {index < TASKS.length - 1 && (
                  <div className="absolute right-0 top-full h-6 w-px bg-muted-foreground/30" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline Axis */}
      <div className="flex mt-auto pt-20 border-t border-muted-foreground/10">
        {DAYS.map((day, i) => (
          <div key={day} className="flex-1 text-center">
            <span className={`text-sm ${i === 3 ? "font-bold text-foreground" : "text-muted-foreground"}`}>
              {day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
