import { 
  Building2, LayoutDashboard, ClipboardCheck, FileText, Clock, ScrollText, 
  Wrench, ChevronLeft, ChevronRight, Bell, Settings, LogOut, User
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/dashboard",
  },
  {
    title: "Projects",
    icon: Building2,
    url: "/projects",
  },
  {
    title: "Contracts",
    icon: ScrollText,
    url: "/contracts",
  },
  {
    title: "Inspections",
    icon: ClipboardCheck,
    url: "/inspections",
  },
  {
    title: "Documents",
    icon: FileText,
    url: "/documents",
  },
  {
    title: "Timesheets",
    icon: Clock,
    url: "/timesheets",
  },
  {
    title: "Tools",
    icon: Wrench,
    url: "/tools",
  },
];

const quickActions = [
  { title: "Notifications", icon: Bell, action: () => toast.info("Notifications", { description: "You have 3 unread notifications" }) },
  { title: "Settings", icon: Settings, action: () => toast.info("Settings", { description: "Opening settings..." }) },
];

export function AppSidebar() {
  const location = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  
  return (
    <Sidebar 
      collapsible="icon"
      className="border-0 bg-transparent mt-16"
    >
      <SidebarContent className="bg-transparent px-2 py-4">
        {/* User Profile Card */}
        <div className={cn(
          "mx-2 mb-4 rounded-3xl bg-[hsl(65,70%,75%)] p-4 transition-all duration-300",
          isCollapsed && "p-2"
        )}>
          <div className={cn(
            "flex items-center gap-3",
            isCollapsed && "justify-center"
          )}>
            <Avatar className={cn(
              "border-2 border-background/20 transition-all",
              isCollapsed ? "h-10 w-10" : "h-12 w-12"
            )}>
              <AvatarImage src="/lovable-uploads/169f31b7-148d-45f3-aa09-967fbcae3b16.png" />
              <AvatarFallback className="bg-background/20 text-foreground font-semibold">
                PM
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">Project Manager</p>
                <p className="text-sm text-foreground/70 truncate">Admin Access</p>
              </div>
            )}
          </div>
          
          {/* Quick action buttons - only show when expanded */}
          {!isCollapsed && (
            <div className="flex gap-2 mt-3">
              {quickActions.map((action) => (
                <button
                  key={action.title}
                  onClick={action.action}
                  className="h-9 w-9 rounded-full bg-card flex items-center justify-center hover:bg-card/80 transition-all hover:scale-105"
                  title={action.title}
                >
                  <action.icon className="h-4 w-4 text-foreground" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <div className={cn(
          "mx-2 mb-2 flex",
          isCollapsed ? "justify-center" : "justify-end"
        )}>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 rounded-full bg-card hover:bg-muted transition-all"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-muted-foreground px-4 mb-2 text-xs uppercase tracking-wider">
              Management
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                
                if (isCollapsed) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton asChild>
                            <Link 
                              to={item.url} 
                              className={cn(
                                "flex items-center justify-center p-2 mx-auto rounded-2xl transition-all w-12 h-12",
                                isActive 
                                  ? "bg-[hsl(65,70%,75%)] shadow-sm" 
                                  : "hover:bg-muted/50"
                              )}
                            >
                              <item.icon className={cn(
                                "w-5 h-5",
                                isActive ? "text-foreground" : "text-muted-foreground"
                              )} />
                            </Link>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-foreground text-background">
                          {item.title}
                        </TooltipContent>
                      </Tooltip>
                    </SidebarMenuItem>
                  );
                }
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link 
                        to={item.url} 
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 mx-2 rounded-2xl transition-all",
                          isActive 
                            ? "bg-[hsl(65,70%,75%)] shadow-sm font-medium" 
                            : "hover:bg-muted/50"
                        )}
                      >
                        <div className={cn(
                          "h-9 w-9 rounded-full flex items-center justify-center transition-colors",
                          isActive ? "bg-foreground/10" : "bg-muted"
                        )}>
                          <item.icon className={cn(
                            "w-5 h-5",
                            isActive ? "text-foreground" : "text-muted-foreground"
                          )} />
                        </div>
                        <span className={cn(
                          "transition-colors",
                          isActive ? "text-foreground" : "text-muted-foreground"
                        )}>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-2">
        <div className={cn(
          "rounded-2xl bg-card p-3 mx-2",
          isCollapsed && "p-2"
        )}>
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => toast.info("Signing out...")}
                  className="w-full flex items-center justify-center p-2 rounded-xl hover:bg-muted transition-colors"
                >
                  <LogOut className="h-4 w-4 text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-foreground text-background">
                Sign Out
              </TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={() => toast.info("Signing out...")}
              className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Sign Out</span>
            </button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
