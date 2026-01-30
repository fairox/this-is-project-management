import { AppLayout } from "@/components/AppLayout";
import { Building2, ClipboardCheck, FileText, ScrollText, Clock, Wrench, AlertTriangle, Users } from "lucide-react";
import {
  DashboardHeroCard,
  DashboardMeetingsCard,
  DashboardRoadmapCard,
  DashboardQuickStatsCard,
  DashboardDateCard,
  DashboardEfficiencyCard,
  DashboardTotalTimeCard,
  DashboardTeamCard,
  DashboardNavCard,
} from "@/components/dashboard/bento";

import { AppLayout } from "@/components/AppLayout";
import { Building2, ClipboardCheck, FileText, ScrollText, Clock, Wrench, AlertTriangle, Users } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import {
  DashboardHeroCard,
  DashboardMeetingsCard,
  DashboardRoadmapCard,
  DashboardQuickStatsCard,
  DashboardDateCard,
  DashboardEfficiencyCard,
  DashboardTotalTimeCard,
  DashboardTeamCard,
  DashboardNavCard,
} from "@/components/dashboard/bento";

const Dashboard = () => {
  const { projects, loading } = useProjects();

  const activeProjects = projects.filter(p => p.status === 'active');
  const onHoldProjects = projects.filter(p => p.status === 'on-hold');
  const completedProjects = projects.filter(p => p.status === 'completed');

  // Calculate generic "progress" or "value" if available (mocking value summation for now as it needs contracts)
  // In a real scenario, we'd join with contracts to get the total value.

  if (loading) {
    return <AppLayout><div className="p-8">Loading dashboard...</div></AppLayout>;
  }

  return (
    <AppLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Page Header */}
        <div className="mb-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your construction project management</p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto">
          {/* Row 1 */}
          {/* Hero Card - spans 2 cols, 2 rows */}
          <div className="md:col-span-2 lg:col-span-2 lg:row-span-2">
            <DashboardHeroCard
              companyName="Project Pact"
              industry="Construction Management"
              progress={65} // Placeholder average progress
              managerName="Admin User"
              managerRole="Project Director"
            />
          </div>

          {/* Meetings Card - spans 2 cols */}
          <div className="md:col-span-2 lg:col-span-2">
            <DashboardMeetingsCard callCount={3} />
          </div>

          {/* Quick Stats Row */}
          <div>
            <DashboardQuickStatsCard
              icon={Building2}
              label="Active Projects"
              value={activeProjects.length}
              trend={activeProjects.length > 0 ? `+${activeProjects.length}` : "0"}
            />
          </div>
          <div>
            <DashboardQuickStatsCard
              icon={ClipboardCheck}
              label="Pending Inspections"
              value={5} // Placeholder until we link inspections
              trend="-1"
            />
          </div>

          {/* Row 2 */}
          {/* Project Roadmap - spans 2 cols */}
          <div className="md:col-span-2 lg:col-span-2">
            <DashboardRoadmapCard />
          </div>

          {/* Date + Efficiency Stack */}
          <div className="flex flex-col gap-4">
            <DashboardDateCard day={new Date().getDate()} weekday={new Date().toLocaleDateString('en-US', { weekday: 'short' })} month={new Date().toLocaleDateString('en-US', { month: 'long' })} />
            <DashboardEfficiencyCard percentage={85} month={new Date().toLocaleDateString('en-US', { month: 'long' })} />
          </div>

          {/* Total Time + Team Stack */}
          <div className="flex flex-col gap-4">
            <DashboardTotalTimeCard hours={1240} label="Total project time" />
            <DashboardTeamCard name="Smart" role="AI Assistant" />
          </div>

          {/* Row 3 - Navigation Cards */}
          <div>
            <DashboardNavCard
              title="Projects"
              description={`${projects.length} Total Projects`}
              icon={Building2}
              link="/projects"
              variant="accent"
            />
          </div>
          <div>
            <DashboardNavCard
              title="Inspections"
              description="Track site inspections"
              icon={ClipboardCheck}
              link="/inspections"
              variant="default"
            />
          </div>
          <div>
            <DashboardNavCard
              title="Documents"
              description="File repository"
              icon={FileText}
              link="/documents"
              variant="default"
            />
          </div>
          <div>
            <DashboardNavCard
              title="Contracts"
              description="FIDIC administration"
              icon={ScrollText}
              link="/contracts"
              variant="dark"
            />
          </div>

          {/* Row 4 - More Stats & Nav */}
          <div>
            <DashboardQuickStatsCard
              icon={AlertTriangle}
              label="On Hold / Risk"
              value={onHoldProjects.length}
              trend={onHoldProjects.length > 0 ? `+${onHoldProjects.length}` : "0"}
              accentColor
            />
          </div>
          <div>
            <DashboardQuickStatsCard
              icon={Users}
              label="Total Users"
              value={8} // Placeholder
            />
          </div>
          <div>
            <DashboardNavCard
              title="Timesheets"
              description="Track working hours"
              icon={Clock}
              link="/timesheets"
              variant="accent"
            />
          </div>
          <div>
            <DashboardNavCard
              title="Tools"
              description="Management utilities"
              icon={Wrench}
              link="/tools"
              variant="default"
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
