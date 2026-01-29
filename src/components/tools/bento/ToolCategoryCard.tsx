import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface Tool {
  name: string;
  icon: LucideIcon;
  link: string;
}

interface ToolCategoryCardProps {
  title: string;
  tools: Tool[];
  accentColor?: boolean;
}

export function ToolCategoryCard({
  title,
  tools,
  accentColor = false,
}: ToolCategoryCardProps) {
  return (
    <div className={`rounded-3xl p-6 h-full min-h-[200px] ${
      accentColor ? "bg-foreground text-background" : "bg-card"
    }`}>
      <h3 className={`text-lg font-bold mb-4 ${accentColor ? "text-background" : "text-foreground"}`}>
        {title}
      </h3>
      
      <div className="space-y-2">
        {tools.slice(0, 4).map((tool) => (
          <Link
            key={tool.name}
            to={tool.link}
            className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
              accentColor 
                ? "bg-background/10 hover:bg-background/20" 
                : "bg-muted/50 hover:bg-muted"
            }`}
          >
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              accentColor ? "bg-background/20" : "bg-card shadow-sm"
            }`}>
              <tool.icon className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">{tool.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
