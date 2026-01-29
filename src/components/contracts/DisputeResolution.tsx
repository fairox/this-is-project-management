
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, MessageSquare } from "lucide-react";

export function DisputeResolution() {
  const disputes = [
    {
      id: "1",
      title: "Payment Schedule Dispute",
      type: "Payment",
      status: "In Mediation",
      priority: "High",
      party: "Subcontractor A",
      dateReported: "2024-03-15"
    },
    {
      id: "2",
      title: "Work Quality Issue",
      type: "Quality",
      status: "Under Review",
      priority: "Medium",
      party: "Contractor B",
      dateReported: "2024-03-18"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Dispute Resolution</h2>
        </div>
        <Button>
          <MessageSquare className="h-4 w-4 mr-2" />
          Report New Dispute
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Involved Party</TableHead>
            <TableHead>Date Reported</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {disputes.map((dispute) => (
            <TableRow key={dispute.id}>
              <TableCell className="font-medium">{dispute.title}</TableCell>
              <TableCell>{dispute.type}</TableCell>
              <TableCell>{dispute.status}</TableCell>
              <TableCell>
                <Badge className={getPriorityColor(dispute.priority)}>
                  {dispute.priority}
                </Badge>
              </TableCell>
              <TableCell>{dispute.party}</TableCell>
              <TableCell>{dispute.dateReported}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
