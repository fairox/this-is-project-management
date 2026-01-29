import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { AlertOctagon, Shield } from "lucide-react";

interface SafetyIncident {
  id: string;
  type: string;
  description: string;
  location: string;
  dateReported: string;
  severity: 'low' | 'medium' | 'high';
  status: 'reported' | 'investigating' | 'resolved';
}

export function SafetyReport() {
  const { toast } = useToast();
  const [incidents] = useState<SafetyIncident[]>([
    {
      id: "1",
      type: "Near Miss",
      description: "Worker almost slipped on wet surface",
      location: "Building A, Floor 2",
      dateReported: new Date().toISOString(),
      severity: "medium",
      status: "investigating",
    },
  ]);

  const getSeverityColor = (severity: SafetyIncident['severity']) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Safety Incident Reports
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Report New Incident</h3>
            <div className="space-y-4">
              <Input placeholder="Incident Type" />
              <Input placeholder="Location" />
              <Textarea placeholder="Description of the incident..." />
              <Button className="w-full">
                <AlertOctagon className="h-4 w-4 mr-2" />
                Submit Report
              </Button>
            </div>
          </Card>

          <div className="space-y-4">
            {incidents.map((incident) => (
              <Card key={incident.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{incident.type}</h3>
                  <Badge className={getSeverityColor(incident.severity)}>
                    {incident.severity}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{incident.description}</p>
                <div className="text-sm text-gray-500">
                  <p>Location: {incident.location}</p>
                  <p>Reported: {new Date(incident.dateReported).toLocaleDateString()}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}