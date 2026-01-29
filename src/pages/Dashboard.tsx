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

const Dashboard = () => {
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
              companyName="Design X Threshold"
              industry="Construction"
              progress={34}
              managerName="Sarah Chen"
              managerRole="Project Manager"
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
              value={12}
              trend="+2"
            />
          </div>
          <div>
            <DashboardQuickStatsCard
              icon={ClipboardCheck}
              label="Pending Inspections"
              value={8}
              trend="-3"
            />
          </div>

          {/* Row 2 */}
          {/* Project Roadmap - spans 2 cols */}
          <div className="md:col-span-2 lg:col-span-2">
            <DashboardRoadmapCard />
          </div>

          {/* Date + Efficiency Stack */}
          <div className="flex flex-col gap-4">
            <DashboardDateCard day={19} weekday="Tue" month="January" />
            <DashboardEfficiencyCard percentage={40} month="January" />
          </div>

          {/* Total Time + Team Stack */}
          <div className="flex flex-col gap-4">
            <DashboardTotalTimeCard hours={645} label="Total project time" />
            <DashboardTeamCard name="Smart" role="Assistant" />
          </div>

          {/* Row 3 - Navigation Cards */}
          <div>
            <DashboardNavCard
              title="Projects"
              description="Manage all projects"
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
              label="Risk Alerts"
              value={4}
              trend="-2"
              accentColor
            />
          </div>
          <div>
            <DashboardQuickStatsCard
              icon={Users}
              label="Team Members"
              value={24}
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
