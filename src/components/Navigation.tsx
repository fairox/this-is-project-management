import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { Building2, ClipboardCheck, FileText, Home, Wrench, PanelLeft } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Navigation() {
  const { toggleSidebar, state } = useSidebar();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md shadow-sm">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Left side - Sidebar toggle + Logo */}
        <div className="flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="h-10 w-10 rounded-full hover:bg-muted transition-all"
              >
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Sidebar</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {state === "expanded" ? "Collapse sidebar" : "Expand sidebar"} (⌘B)
            </TooltipContent>
          </Tooltip>
          
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/" className="text-xl font-bold text-primary flex items-center gap-2">
                  <div className="h-9 w-9 rounded-full bg-[hsl(65,70%,75%)] flex items-center justify-center">
                    <Home className="h-5 w-5 text-foreground" />
                  </div>
                  <span className="hidden sm:inline">Design X Threshold CPM</span>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem className="hidden lg:block">
                <NavigationMenuTrigger className="rounded-full">Services</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[400px] bg-card">
                    <div className="grid grid-cols-2 gap-4">
                      <Link to="/projects" className="group grid gap-1 hover:bg-muted rounded-2xl p-4 transition-all">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-muted group-hover:bg-[hsl(65,70%,75%)] transition-colors flex items-center justify-center">
                            <Building2 className="h-4 w-4" />
                          </div>
                          <div className="font-medium">Projects</div>
                        </div>
                        <div className="text-sm text-muted-foreground ml-10">Manage construction projects</div>
                      </Link>
                      <Link to="/inspections" className="group grid gap-1 hover:bg-muted rounded-2xl p-4 transition-all">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-muted group-hover:bg-[hsl(65,70%,75%)] transition-colors flex items-center justify-center">
                            <ClipboardCheck className="h-4 w-4" />
                          </div>
                          <div className="font-medium">Inspections</div>
                        </div>
                        <div className="text-sm text-muted-foreground ml-10">Track site inspections</div>
                      </Link>
                      <Link to="/contracts" className="group grid gap-1 hover:bg-muted rounded-2xl p-4 transition-all">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-muted group-hover:bg-[hsl(65,70%,75%)] transition-colors flex items-center justify-center">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div className="font-medium">Contracts</div>
                        </div>
                        <div className="text-sm text-muted-foreground ml-10">Manage contracts</div>
                      </Link>
                      <Link to="/tools" className="group grid gap-1 hover:bg-muted rounded-2xl p-4 transition-all">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-muted group-hover:bg-[hsl(65,70%,75%)] transition-colors flex items-center justify-center">
                            <Wrench className="h-4 w-4" />
                          </div>
                          <div className="font-medium">Tools</div>
                        </div>
                        <div className="text-sm text-muted-foreground ml-10">Management tools</div>
                      </Link>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        {/* Right side - Quick links */}
        <div className="flex items-center gap-1">
          <Link 
            to="/" 
            className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1 px-3 py-2 rounded-full hover:bg-muted"
          >
            <Home className="h-4 w-4" />
            <span className="hidden md:inline">Home</span>
          </Link>
          <Link 
            to="/projects" 
            className="text-sm font-medium hover:text-primary transition-colors px-3 py-2 rounded-full hover:bg-muted hidden sm:block"
          >
            Projects
          </Link>
          <Link 
            to="/inspections" 
            className="text-sm font-medium hover:text-primary transition-colors px-3 py-2 rounded-full hover:bg-muted hidden md:block"
          >
            Inspections
          </Link>
          <Link 
            to="/contracts" 
            className="text-sm font-medium hover:text-primary transition-colors px-3 py-2 rounded-full hover:bg-muted hidden lg:block"
          >
            Contracts
          </Link>
          <Link 
            to="/tools" 
            className="text-sm font-medium hover:text-primary transition-colors px-3 py-2 rounded-full hover:bg-muted hidden lg:block"
          >
            Tools
          </Link>
        </div>
      </div>
    </div>
  );
}
