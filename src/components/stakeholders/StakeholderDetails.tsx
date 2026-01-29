
import { Stakeholder } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommunicationLog } from "./StakeholderCommunication";
import { StakeholderOnboarding } from "./StakeholderOnboarding";
import { getRoleColor } from "./stakeholderUtils";

interface StakeholderDetailsProps {
  stakeholder: Stakeholder | null;
  onOpenChange: (open: boolean) => void;
  onOnboardingUpdate: (stakeholderId: string, onboardingStatus: Stakeholder['onboardingStatus']) => void;
}

export function StakeholderDetails({ stakeholder, onOpenChange, onOnboardingUpdate }: StakeholderDetailsProps) {
  if (!stakeholder) return null;

  return (
    <Dialog open={!!stakeholder} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Stakeholder Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold">{stakeholder.name}</h3>
              <p className="text-sm text-gray-500">{stakeholder.organization}</p>
            </div>
            <Badge className={getRoleColor(stakeholder.role)}>
              {stakeholder.role}
            </Badge>
          </div>

          <Tabs defaultValue="communications" className="w-full">
            <TabsList>
              <TabsTrigger value="communications">Communications</TabsTrigger>
              <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
            </TabsList>
            <TabsContent value="communications">
              <CommunicationLog 
                stakeholderId={stakeholder.id}
                projectId={stakeholder.projects[0]}
              />
            </TabsContent>
            <TabsContent value="onboarding">
              <StakeholderOnboarding
                stakeholder={stakeholder}
                onUpdate={onOnboardingUpdate}
              />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
