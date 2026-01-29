import { Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DocumentCategory {
  name: string;
  count: number;
  color: "accent" | "muted" | "default";
  avatars: string[];
}

interface DocumentCategoriesCardProps {
  categories?: DocumentCategory[];
}

export function DocumentCategoriesCard({
  categories = [
    { name: "Contracts", count: 24, color: "accent", avatars: ["/placeholder.svg", "/placeholder.svg"] },
    { name: "Drawings", count: 45, color: "muted", avatars: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"] },
    { name: "Permits", count: 18, color: "accent", avatars: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"] },
  ],
}: DocumentCategoriesCardProps) {
  const types = ["All", "Recent", "Shared", "Archived", "Templates"];

  const getBarColor = (color: DocumentCategory["color"]) => {
    switch (color) {
      case "accent":
        return "bg-[hsl(65,70%,75%)]";
      case "muted":
        return "bg-muted";
      default:
        return "bg-card";
    }
  };

  return (
    <div className="bg-card rounded-3xl p-6 h-full min-h-[280px]">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Document</h2>
          <h2 className="text-2xl font-bold text-foreground">Categories</h2>
        </div>
        <button className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-full text-sm font-medium hover:bg-foreground/90 transition-colors">
          <Plus className="h-4 w-4" />
          Add folder
        </button>
      </div>

      {/* Categories */}
      <div className="relative mt-8">
        {/* Vertical line */}
        <div className="absolute left-[45%] top-0 bottom-8 w-px bg-border" />
        
        {/* Category bars */}
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.name} className="flex items-center gap-4">
              {/* Category bar */}
              <div className="flex-1 flex items-center">
                <div 
                  className={`${getBarColor(category.color)} rounded-full px-4 py-2 flex items-center gap-2`}
                  style={{ 
                    width: `${Math.min(category.count * 2, 100)}%`,
                    minWidth: "120px"
                  }}
                >
                  <span className="text-sm font-medium text-foreground truncate">{category.name}</span>
                  <span className="text-xs text-foreground/70 ml-auto">{category.count}</span>
                </div>
              </div>
              
              {/* Connector dot */}
              <div className="h-3 w-3 rounded-full bg-card border-2 border-foreground z-10" />
              
              {/* Avatars */}
              <div className="flex -space-x-2">
                {category.avatars.slice(0, 3).map((avatar, i) => (
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

        {/* Type labels */}
        <div className="flex justify-between mt-6 text-xs text-muted-foreground">
          {types.map((type, index) => (
            <span key={type} className={index === 1 ? "font-bold text-foreground" : ""}>
              {type}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
