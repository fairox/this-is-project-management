import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

interface Resource {
  id: string;
  name: string;
  role: string;
  allocation: number;
  project: string;
  startDate: string;
  endDate: string;
}

const resources: Resource[] = [
  {
    id: "1",
    name: "John Smith",
    role: "Project Manager",
    allocation: 75,
    project: "Office Tower Development",
    startDate: "2024-01-01",
    endDate: "2024-12-31"
  },
  {
    id: "2",
    name: "Sarah Wilson",
    role: "Site Engineer",
    allocation: 100,
    project: "Office Tower Development",
    startDate: "2024-02-01",
    endDate: "2024-08-31"
  },
  {
    id: "3",
    name: "Mike Johnson",
    role: "Safety Inspector",
    allocation: 50,
    project: "Retail Complex Phase 1",
    startDate: "2024-03-01",
    endDate: "2024-07-31"
  }
];

export function ResourceAllocation() {
  const { toast } = useToast();

  const getAllocationColor = (allocation: number) => {
    if (allocation > 90) return "bg-red-500";
    if (allocation > 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const handleAllocationClick = (resource: Resource) => {
    toast({
      title: "Resource Details",
      description: `${resource.name} (${resource.role}) is allocated ${resource.allocation}% to ${resource.project}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Resource Allocation</h2>
        <Badge variant="outline" className="px-4">
          {resources.length} Resources
        </Badge>
      </div>
      <div className="grid gap-4">
        {resources.map((resource) => (
          <Card
            key={resource.id}
            className="p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleAllocationClick(resource)}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{resource.name}</h3>
                  <p className="text-sm text-gray-500">{resource.role}</p>
                </div>
                <Badge className={getAllocationColor(resource.allocation)}>
                  {resource.allocation}%
                </Badge>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Project</span>
                  <span>{resource.project}</span>
                </div>
                <Progress
                  value={resource.allocation}
                  className="h-2"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{new Date(resource.startDate).toLocaleDateString()}</span>
                <span>{new Date(resource.endDate).toLocaleDateString()}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}