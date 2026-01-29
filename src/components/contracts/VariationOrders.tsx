
import { useState } from "react";
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
import { PlusCircle, FileText } from "lucide-react";

export function VariationOrders() {
  const [variations] = useState([
    {
      id: "1",
      title: "Foundation Reinforcement",
      type: "Scope Change",
      status: "Pending",
      requestedBy: "John Smith",
      costImpact: 25000,
      timeImpact: "14 days"
    },
    {
      id: "2",
      title: "Material Substitution",
      type: "Material Change",
      status: "Approved",
      requestedBy: "Alice Johnson",
      costImpact: 15000,
      timeImpact: "7 days"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Variation Orders</h2>
        </div>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          New Variation Order
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Requested By</TableHead>
            <TableHead>Cost Impact</TableHead>
            <TableHead>Time Impact</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {variations.map((variation) => (
            <TableRow key={variation.id}>
              <TableCell className="font-medium">{variation.title}</TableCell>
              <TableCell>{variation.type}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(variation.status)}>
                  {variation.status}
                </Badge>
              </TableCell>
              <TableCell>{variation.requestedBy}</TableCell>
              <TableCell>${variation.costImpact.toLocaleString()}</TableCell>
              <TableCell>{variation.timeImpact}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
