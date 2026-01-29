
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Building, FileCheck, Leaf, Shield } from "lucide-react";
import { ComplianceCheck } from "@/types/compliance";

const mockComplianceChecks: ComplianceCheck[] = [
  {
    id: "1",
    category: "building",
    status: "compliant",
    title: "Building Height Regulations",
    description: "Verify building height complies with local zoning laws",
    dueDate: "2024-06-30",
    lastChecked: "2024-03-20",
    assignedTo: "John Smith",
    requirements: ["Maximum height: 100ft", "Setback requirements met"],
  },
  {
    id: "2",
    category: "environmental",
    status: "pending",
    title: "Environmental Impact Assessment",
    description: "Review environmental impact of construction activities",
    dueDate: "2024-04-15",
    lastChecked: "2024-03-19",
    assignedTo: "Sarah Johnson",
    requirements: ["Noise level compliance", "Dust control measures"],
  },
  {
    id: "3",
    category: "safety",
    status: "non-compliant",
    title: "Site Safety Inspection",
    description: "Regular safety inspection of construction site",
    dueDate: "2024-03-25",
    lastChecked: "2024-03-18",
    assignedTo: "Mike Wilson",
    requirements: ["PPE requirements", "Emergency exits marked"],
    notes: "Several safety violations found - immediate action required",
  },
];

export function ComplianceManager() {
  const getStatusColor = (status: ComplianceCheck['status']) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-500 text-white';
      case 'non-compliant':
        return 'bg-red-500 text-white';
      default:
        return 'bg-yellow-500 text-white';
    }
  };

  const getCategoryIcon = (category: ComplianceCheck['category']) => {
    switch (category) {
      case 'building':
        return <Building className="h-5 w-5" />;
      case 'environmental':
        return <Leaf className="h-5 w-5" />;
      case 'safety':
        return <Shield className="h-5 w-5" />;
      default:
        return <FileCheck className="h-5 w-5" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Regulatory Compliance Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="checks" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="checks">Compliance Checks</TabsTrigger>
            <TabsTrigger value="permits">Permits</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="checks">
            <div className="space-y-4">
              {mockComplianceChecks.map((check) => (
                <Card key={check.id} className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(check.category)}
                      <h3 className="font-semibold">{check.title}</h3>
                    </div>
                    <Badge className={getStatusColor(check.status)}>
                      {check.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{check.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Due Date:</span>
                      <span className="ml-2">
                        {new Date(check.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Assigned To:</span>
                      <span className="ml-2">{check.assignedTo}</span>
                    </div>
                  </div>
                  {check.notes && (
                    <div className="mt-4 p-2 bg-yellow-50 rounded-md text-sm">
                      {check.notes}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="permits">
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">
                  Permit management system will be implemented here
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">
                  Compliance reporting system will be implemented here
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
