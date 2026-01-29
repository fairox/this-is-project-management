
import { Stakeholder } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Building2, UserCheck } from "lucide-react";
import { getRoleColor, getOnboardingStatusColor } from "./stakeholderUtils";

interface StakeholderCardProps {
  stakeholder: Stakeholder;
  onViewDetails: (stakeholder: Stakeholder) => void;
  projects: Array<{ id: string; name: string; }>;
}

export function StakeholderCard({ stakeholder, onViewDetails, projects }: StakeholderCardProps) {
  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{stakeholder.name}</h3>
            <p className="text-sm text-gray-500">{stakeholder.organization}</p>
          </div>
          <Badge className={getRoleColor(stakeholder.role)}>
            {stakeholder.role}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4" />
            <a href={`mailto:${stakeholder.email}`} className="text-blue-600 hover:underline">
              {stakeholder.email}
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4" />
            <a href={`tel:${stakeholder.phone}`} className="text-blue-600 hover:underline">
              {stakeholder.phone}
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="h-4 w-4" />
            <span>
              {stakeholder.projects.length} Project{stakeholder.projects.length !== 1 ? 's' : ''}: {
                stakeholder.projects
                  .map(id => projects.find(p => p.id === id)?.name)
                  .filter(Boolean)
                  .join(", ")
              }
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <UserCheck className="h-4 w-4" />
            <Badge className={getOnboardingStatusColor(stakeholder.onboardingStatus)}>
              {stakeholder.onboardingStatus}
            </Badge>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewDetails(stakeholder)}
          >
            View Details
          </Button>
          <span className="text-sm text-gray-500">
            Last Contact: {new Date(stakeholder.lastContact).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Card>
  );
}
