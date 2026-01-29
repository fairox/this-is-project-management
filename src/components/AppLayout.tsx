import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Navigation } from "./Navigation";
import { MobileLayout } from "./MobileLayout";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileLayout>{children}</MobileLayout>;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        {/* Fixed Navigation at top */}
        <Navigation />
        
        {/* Sidebar - positioned after nav with margin-top */}
        <AppSidebar />
        
        {/* Main content area */}
        <main className="flex-1 overflow-auto mt-16">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
