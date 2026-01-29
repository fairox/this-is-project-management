
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileCheck, FileX, Clock, CheckCircle } from "lucide-react";
import { Stakeholder } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  required: boolean;
}

const defaultOnboardingSteps: OnboardingStep[] = [
  {
    id: '1',
    title: 'Documentation Review',
    description: 'Review and verify all required documentation',
    status: 'pending',
    required: true
  },
  {
    id: '2',
    title: 'Project Briefing',
    description: 'Schedule and conduct initial project briefing',
    status: 'pending',
    required: true
  },
  {
    id: '3',
    title: 'Access Setup',
    description: 'Set up system access and permissions',
    status: 'pending',
    required: true
  },
  {
    id: '4',
    title: 'Safety Training',
    description: 'Complete required safety training and certifications',
    status: 'pending',
    required: true
  }
];

interface StakeholderOnboardingProps {
  stakeholder: Stakeholder;
  onUpdate: (stakeholderId: string, onboardingStatus: Stakeholder['onboardingStatus']) => void;
}

export function StakeholderOnboarding({ stakeholder, onUpdate }: StakeholderOnboardingProps) {
  const [steps, setSteps] = useState<OnboardingStep[]>(defaultOnboardingSteps);
  const { toast } = useToast();

  const getStatusIcon = (status: OnboardingStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'pending':
        return <FileX className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: OnboardingStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
    }
  };

  const updateStepStatus = (stepId: string, newStatus: OnboardingStep['status']) => {
    const updatedSteps = steps.map(step =>
      step.id === stepId ? { ...step, status: newStatus } : step
    );
    setSteps(updatedSteps);

    // Check if all required steps are completed
    const allRequiredCompleted = updatedSteps
      .filter(step => step.required)
      .every(step => step.status === 'completed');

    const inProgress = updatedSteps.some(step => step.status === 'in-progress');
    const newOnboardingStatus: Stakeholder['onboardingStatus'] = 
      allRequiredCompleted ? 'completed' : inProgress ? 'in-progress' : 'pending';

    onUpdate(stakeholder.id, newOnboardingStatus);

    toast({
      title: "Onboarding Status Updated",
      description: `Step marked as ${newStatus}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Onboarding Progress</h3>
        <Badge className={getStatusColor(stakeholder.onboardingStatus)}>
          {stakeholder.onboardingStatus.replace('-', ' ')}
        </Badge>
      </div>

      <div className="grid gap-4">
        {steps.map((step) => (
          <Card key={step.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {getStatusIcon(step.status)}
                  <h4 className="font-medium">{step.title}</h4>
                </div>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateStepStatus(step.id, 'in-progress')}
                  disabled={step.status === 'completed'}
                >
                  Start
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateStepStatus(step.id, 'completed')}
                  disabled={step.status === 'completed'}
                >
                  Complete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
