import { AppLayout } from "@/components/AppLayout";
import {
  ProjectHeroCard,
  UpcomingMeetingsCard,
  ProjectRoadmapCard,
  DateCard,
  EfficiencyCard,
  TotalTimeCard,
  TeamMemberCard,
  QuickStatsCard,
} from "@/components/projects/bento";
import { Building2, ClipboardCheck, AlertTriangle, Users } from "lucide-react";

const Projects = () => {
  return (
    <AppLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Page Header */}
        <div className="mb-2">
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">Overview of your active construction projects</p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto">
          {/* Row 1 */}
          {/* Project Hero - Takes 2 columns */}
          <div className="md:col-span-2 lg:col-span-2 lg:row-span-2">
            <ProjectHeroCard
              projectName="Metro Tower Complex"
              industry="Construction"
              progress={34}
              managerName="Sarah Chen"
              managerRole="Project Manager"
            />
          </div>

          {/* Upcoming Meetings - Takes 2 columns */}
          <div className="md:col-span-2 lg:col-span-2">
            <UpcomingMeetingsCard callCount={3} selectedDay={11} />
          </div>

          {/* Quick Stats Row - 2 small cards */}
          <div className="lg:col-span-1">
            <QuickStatsCard
              icon={Building2}
              label="Active Projects"
              value={12}
              trend="+2"
            />
          </div>
          <div className="lg:col-span-1">
            <QuickStatsCard
              icon={ClipboardCheck}
              label="Pending Inspections"
              value={8}
              trend="-3"
            />
          </div>

          {/* Row 2 */}
          {/* Project Roadmap - Takes 2 columns */}
          <div className="md:col-span-2 lg:col-span-2">
            <ProjectRoadmapCard />
          </div>

          {/* Date Card + Efficiency Card Stack */}
          <div className="flex flex-col gap-4">
            <DateCard day={19} weekday="Tue" month="January" />
            <EfficiencyCard percentage={40} month="January" />
          </div>

          {/* Total Time + Team Member Stack */}
          <div className="flex flex-col gap-4">
            <TotalTimeCard hours={645} label="Total project time" />
            <TeamMemberCard name="Smart" role="Assistant" />
          </div>

          {/* Row 3 - Additional Stats */}
          <div className="lg:col-span-1">
            <QuickStatsCard
              icon={AlertTriangle}
              label="Risk Alerts"
              value={4}
              trend="-2"
              accentColor
            />
          </div>
          <div className="lg:col-span-1">
            <QuickStatsCard
              icon={Users}
              label="Team Members"
              value={24}
            />
          </div>

          {/* Another Project Card */}
          <div className="md:col-span-2 lg:col-span-2">
            <ProjectHeroCard
              projectName="Harbor Bridge Renovation"
              industry="Infrastructure"
              progress={67}
              managerName="Michael Torres"
              managerRole="Lead Engineer"
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Projects;
