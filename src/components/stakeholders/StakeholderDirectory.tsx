
import { useState } from "react";
import { Stakeholder } from "@/types";
import { Filter } from "lucide-react";
import { AddStakeholderDialog } from "./AddStakeholderDialog";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StakeholderCard } from "./StakeholderCard";
import { StakeholderDetails } from "./StakeholderDetails";

const mockStakeholders: Stakeholder[] = [
  {
    id: "1",
    name: "John Smith",
    role: "contractor",
    organization: "Smith Construction Ltd",
    email: "john@smithconstruction.com",
    phone: "+1234567890",
    projects: ["1", "2"],
    status: "active",
    onboardingStatus: "completed",
    lastContact: "2024-03-20",
    notes: "Primary contractor for Office Tower project"
  },
  {
    id: "2",
    name: "Sarah Wilson",
    role: "architect",
    organization: "Wilson Architects",
    email: "sarah@wilsonarchitects.com",
    phone: "+1234567891",
    projects: ["1"],
    status: "active",
    onboardingStatus: "in-progress",
    lastContact: "2024-03-19",
    notes: "Lead architect for Office Tower project"
  }
];

const mockProjects = [
  { id: "1", name: "Office Tower" },
  { id: "2", name: "Shopping Mall" }
];

export function StakeholderDirectory() {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>(mockStakeholders);
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const { toast } = useToast();
  const [selectedStakeholder, setSelectedStakeholder] = useState<Stakeholder | null>(null);

  const filteredStakeholders = selectedProject === "all" 
    ? stakeholders
    : stakeholders.filter(s => s.projects.includes(selectedProject));

  const handleAddStakeholder = (newStakeholder: Stakeholder) => {
    setStakeholders([...stakeholders, newStakeholder]);
    toast({
      title: "Stakeholder Added",
      description: "New stakeholder has been successfully added to the directory."
    });
  };

  const handleOnboardingUpdate = (stakeholderId: string, onboardingStatus: Stakeholder['onboardingStatus']) => {
    const updatedStakeholders = stakeholders.map(s => 
      s.id === stakeholderId ? { ...s, onboardingStatus } : s
    );
    setStakeholders(updatedStakeholders);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Stakeholder Directory</h2>
          <p className="text-sm text-gray-500">Manage project stakeholders and their communications</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {mockProjects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <AddStakeholderDialog onAdd={handleAddStakeholder} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredStakeholders.map((stakeholder) => (
          <StakeholderCard
            key={stakeholder.id}
            stakeholder={stakeholder}
            onViewDetails={setSelectedStakeholder}
            projects={mockProjects}
          />
        ))}
      </div>

      <StakeholderDetails
        stakeholder={selectedStakeholder}
        onOpenChange={(open) => !open && setSelectedStakeholder(null)}
        onOnboardingUpdate={handleOnboardingUpdate}
      />
    </div>
  );
}
