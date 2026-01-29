import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Menu, X, Home, Briefcase, ClipboardCheck, FileText, Wrench, 
  FileCheck, Clock, Bell, Settings, LogOut, User 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { APP_VERSION, APP_NAME } from "@/lib/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface MobileLayoutProps {
  children: React.ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Briefcase, label: "Projects", path: "/projects" },
    { icon: ClipboardCheck, label: "Inspections", path: "/inspections" },
    { icon: FileText, label: "Documents", path: "/documents" },
    { icon: Clock, label: "Timesheets", path: "/timesheets" },
    { icon: Wrench, label: "Tools", path: "/tools" },
    { icon: FileCheck, label: "Contracts", path: "/contracts" }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-card shadow-sm h-16 flex items-center justify-between px-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-[hsl(65,70%,75%)] flex items-center justify-center">
            <Home className="h-5 w-5 text-foreground" />
          </div>
          <h1 className="font-bold text-primary truncate text-base">{APP_NAME}</h1>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full touch-manipulation">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-0 rounded-r-3xl bg-background">
            <div className="flex flex-col h-full">
              {/* Header with user profile */}
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-primary">{APP_NAME}</h2>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setOpen(false)} 
                    className="touch-manipulation h-10 w-10 rounded-full"
                  >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </div>
                
                {/* User Profile Card */}
                <div className="rounded-2xl bg-[hsl(65,70%,75%)] p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-background/20">
                      <AvatarImage src="/lovable-uploads/169f31b7-148d-45f3-aa09-967fbcae3b16.png" />
                      <AvatarFallback className="bg-background/20 text-foreground font-semibold">
                        PM
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">Project Manager</p>
                      <p className="text-sm text-foreground/70 truncate">Admin Access</p>
                    </div>
                  </div>
                  
                  {/* Quick action buttons */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => toast.info("Notifications", { description: "You have 3 unread notifications" })}
                      className="h-9 w-9 rounded-full bg-card flex items-center justify-center hover:bg-card/80 transition-all"
                    >
                      <Bell className="h-4 w-4 text-foreground" />
                    </button>
                    <button
                      onClick={() => toast.info("Settings", { description: "Opening settings..." })}
                      className="h-9 w-9 rounded-full bg-card flex items-center justify-center hover:bg-card/80 transition-all"
                    >
                      <Settings className="h-4 w-4 text-foreground" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Navigation label */}
              <div className="px-6 py-2">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  Management
                </span>
              </div>
              
              {/* Navigation Items */}
              <nav className="flex-1 overflow-auto py-2 px-3">
                {menuItems.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className={cn(
                        "flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-left transition-all touch-manipulation min-h-[52px] mb-1",
                        active 
                          ? "bg-[hsl(65,70%,75%)] font-medium shadow-sm" 
                          : "hover:bg-muted/50"
                      )}
                    >
                      <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center transition-colors",
                        active ? "bg-foreground/10" : "bg-muted"
                      )}>
                        <item.icon className={cn(
                          "h-5 w-5", 
                          active ? "text-foreground" : "text-muted-foreground"
                        )} />
                      </div>
                      <span className={cn(
                        "text-base",
                        active ? "text-foreground" : "text-muted-foreground"
                      )}>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Footer */}
              <div className="p-4 space-y-3">
                <div className="rounded-2xl bg-card p-3">
                  <button
                    onClick={() => toast.info("Signing out...")}
                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm">Sign Out</span>
                  </button>
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  Version {APP_VERSION}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </header>
      <main className="flex-1 overflow-auto p-4 pb-20">
        {children}
      </main>
      <footer className="fixed bottom-0 left-0 right-0 bg-card shadow-[0_-4px_16px_-4px_hsl(0_0%_0%_/_0.08)] py-3 px-4 text-xs text-center text-muted-foreground rounded-t-2xl">
        {APP_NAME} • v{APP_VERSION}
      </footer>
    </div>
  );
}
