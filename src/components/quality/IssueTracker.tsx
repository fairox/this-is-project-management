import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Camera, Upload } from "lucide-react";
import { SiteInspection } from "../mobile/SiteInspection";

interface Issue {
  id: string;
  title: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  photos: string[];
  description: string;
  dateReported: string;
}

export function IssueTracker() {
  const { toast } = useToast();
  const [issues] = useState<Issue[]>([
    {
      id: "1",
      title: "Concrete cracking in foundation",
      status: "open",
      priority: "high",
      photos: [],
      description: "Multiple cracks observed in the northwestern section",
      dateReported: new Date().toISOString(),
    },
  ]);

  const getStatusColor = (status: Issue['status']) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
    }
  };

  const getPriorityColor = (priority: Issue['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Issue Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {issues.map((issue) => (
              <Card key={issue.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{issue.title}</h3>
                  <div className="flex gap-2">
                    <Badge className={getPriorityColor(issue.priority)}>
                      {issue.priority}
                    </Badge>
                    <Badge className={getStatusColor(issue.status)}>
                      {issue.status}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">{issue.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Reported: {new Date(issue.dateReported).toLocaleDateString()}</span>
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Add Photo
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <SiteInspection />
    </div>
  );
}