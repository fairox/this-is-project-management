
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DigitalInspection } from "./DigitalInspection";
import { IssueTracker } from "./IssueTracker";
import { EnvironmentalCompliance } from "@/features/analytics/components/EnvironmentalCompliance";
import { SafetyReport } from "./SafetyReport";
import { ComplianceManager } from "@/components/compliance/ComplianceManager";

export function QualityControl() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Quality Control Dashboard</h2>
      
      <Tabs defaultValue="inspections" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="inspections">Inspections</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="compliance">Environmental</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
          <TabsTrigger value="regulatory">Regulatory</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inspections">
          <DigitalInspection />
        </TabsContent>
        
        <TabsContent value="issues">
          <IssueTracker />
        </TabsContent>
        
        <TabsContent value="compliance">
          <EnvironmentalCompliance />
        </TabsContent>
        
        <TabsContent value="safety">
          <SafetyReport />
        </TabsContent>

        <TabsContent value="regulatory">
          <ComplianceManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
