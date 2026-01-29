import { AppLayout } from "@/components/AppLayout";
import { useProjects } from "@/hooks/useProjects";
import {
  ProjectHeroCard,
  UpcomingMeetingsCard,
  QuickStatsCard,
} from "@/components/projects/bento";
import { Building2, ClipboardCheck, AlertTriangle, Users, MapPin, Activity } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Projects = () => {
  const { projects, loading } = useProjects();

  // Helper to parse the description string we seeded
  // Format: "Location: ... | Type: ... | Stage: ..."
  const parseDescription = (desc: string) => {
    if (!desc) return { location: 'Unknown', type: 'General', stage: 'Active' };
    const parts = desc.split('|').map(p => p.trim());
    const location = parts.find(p => p.startsWith('Location:'))?.replace('Location:', '').trim();
    const type = parts.find(p => p.startsWith('Type:'))?.replace('Type:', '').trim();
    const stage = parts.find(p => p.startsWith('Stage:'))?.replace('Stage:', '').trim();
    return { location, type, stage };
  };

  const activeCount = projects.filter(p => p.status === 'active').length;

  if (loading) {
    return <AppLayout><div className="p-8">Loading projects...</div></AppLayout>;
  }

  return (
    <AppLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-end mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground mt-1">Strategic Portfolio Overview ({projects.length} Total)</p>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickStatsCard
            icon={Building2}
            label="Active Projects"
            value={activeCount}
            trend="+2"
          />
          <QuickStatsCard
            icon={ClipboardCheck}
            label="Pending Vetting"
            value={1} // Placeholder
          />
          <QuickStatsCard
            icon={AlertTriangle}
            label="Critical Status"
            value={projects.filter(p => p.status === 'on-hold').length}
            trend="Hold"
            accentColor
          />
          <QuickStatsCard
            icon={Users}
            label="Total Stakeholders"
            value={24}
          />
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto">
          {projects.map((project, idx) => {
            const meta = parseDescription(project.description || '');
            // Make the first card span 2 cols for "Bento" feel
            const isHero = idx === 0;

            return (
              <div key={project.id} className={isHero ? "md:col-span-2" : "col-span-1"}>
                {isHero ? (
                  <ProjectHeroCard
                    projectName={project.name}
                    industry={meta.type || 'Construction'}
                    progress={65} // Placeholder
                    managerName="Lead Architect"
                    managerRole="Project Manager"
                  />
                ) : (
                  <Card className="h-full rounded-3xl border-0 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline" className="mb-2">{meta.type}</Badge>
                        <Badge className={project.status === 'active' ? 'bg-green-500' : 'bg-orange-500'}>
                          {project.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl line-clamp-1" title={project.name}>{project.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-2 text-sm text-muted-foreground mt-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">{meta.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          <span className="truncate">Stage: {meta.stage}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}

          {/* Filler Widgets if needed to balance grid */}
          <div className="col-span-1">
            <UpcomingMeetingsCard callCount={3} selectedDay={29} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Projects;
