import { Bell, Info, ChevronDown, Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DocumentsHeroCardProps {
  userName?: string;
  userRole?: string;
  userAvatar?: string;
  libraryName?: string;
  category?: string;
  uploadedCount?: number;
  totalStorage?: number;
  usedStorage?: number;
}

export function DocumentsHeroCard({
  userName = "Document Manager",
  userRole = "File Repository",
  userAvatar = "/lovable-uploads/169f31b7-148d-45f3-aa09-967fbcae3b16.png",
  libraryName = "Project Documents",
  category = "Construction Files",
  uploadedCount = 156,
  totalStorage = 100,
  usedStorage = 34,
}: DocumentsHeroCardProps) {
  const storagePercent = Math.round((usedStorage / totalStorage) * 100);

  return (
    <div className="bg-[hsl(65,70%,75%)] rounded-3xl p-6 flex flex-col h-full min-h-[320px] relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-background/20">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback className="bg-background/20 text-foreground">DM</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{userName}</p>
            <p className="text-sm text-foreground/70">{userRole}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="h-10 w-10 rounded-full bg-card flex items-center justify-center hover:bg-card/80 transition-colors">
            <Bell className="h-4 w-4 text-foreground" />
          </button>
          <button className="h-10 w-10 rounded-full bg-card flex items-center justify-center hover:bg-card/80 transition-colors">
            <Info className="h-4 w-4 text-foreground" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <h2 className="text-3xl font-bold text-foreground mb-2">{libraryName}</h2>
        <p className="text-foreground/70 text-sm mb-6">Category: {category}</p>

        {/* Storage Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-foreground/70">Storage used</span>
            <span className="font-semibold text-foreground">{storagePercent}%</span>
          </div>
          <div className="h-2 bg-foreground/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-foreground rounded-full transition-all duration-500"
              style={{ width: `${storagePercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex gap-3 items-center">
        <button className="flex-1 flex items-center gap-3 bg-card rounded-full px-4 py-3 hover:bg-card/80 transition-colors">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <span className="text-sm font-medium">Browse documents</span>
          <ChevronDown className="h-4 w-4 ml-auto text-muted-foreground" />
        </button>
        <button className="h-12 w-12 rounded-full bg-foreground flex items-center justify-center hover:bg-foreground/90 transition-colors">
          <Upload className="h-5 w-5 text-background" />
        </button>
      </div>
    </div>
  );
}
