import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getItems, updateItem } from "@/lib/localStorage";
import { Project, AuditEntry } from "@/types";
import { Badge } from "@/components/ui/badge";
import { EditProjectDialog } from "@/components/projects/EditProjectDialog";
import { toast } from "sonner";

export function ProjectOverview() {
  const projects = getItems<Project>('projects');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'under-review':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string | undefined) => {
    if (!status) return 'pending';
    return status.replace('-', ' ');
  };

  const handleProjectUpdate = (projectId: string, updates: Partial<Project>) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const auditEntry: AuditEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      userId: 'current-user', // In a real app, this would come from auth
      userName: 'Current User', // In a real app, this would come from auth
      action: 'update',
      changes: Object.entries(updates).map(([field, newValue]) => ({
        field,
        oldValue: project[field as keyof Project],
        newValue,
      })),
    };

    const updatedProject = {
      ...project,
      ...updates,
      auditTrail: [...(project.auditTrail || []), auditEntry],
    };

    updateItem('projects', updatedProject);
    toast.success("Project updated successfully");
    
    // Force a re-render by updating the state
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Active Projects</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold">{project.name}</h3>
              <Badge className={getStatusColor(project.vettingStatus || 'pending')}>
                {formatStatus(project.vettingStatus)}
              </Badge>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className="font-medium">{project.status}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Due Date</span>
                <span className="font-medium">{project.endDate}</span>
              </div>
              {project.reviewNotes && (
                <div className="text-sm mt-4">
                  <span className="text-gray-500 block">Review Notes:</span>
                  <p className="mt-1">{project.reviewNotes}</p>
                </div>
              )}
              <div className="pt-4">
                <EditProjectDialog
                  project={project}
                  onSave={(updates) => handleProjectUpdate(project.id, updates)}
                />
              </div>
              {project.auditTrail && project.auditTrail.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Recent Changes</h4>
                  <div className="space-y-2">
                    {project.auditTrail.slice(-2).map((entry) => (
                      <div key={entry.id} className="text-xs text-gray-500">
                        {new Date(entry.timestamp).toLocaleDateString()} - {entry.userName} made changes
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}