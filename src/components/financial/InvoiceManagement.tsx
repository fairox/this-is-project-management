
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileText, DollarSign, Calendar } from "lucide-react";
import { InvoiceTable } from "./InvoiceTable";
import { Invoice } from "@/types/invoice";

export function InvoiceManagement() {
  const { toast } = useToast();
  const [invoices] = useState<Invoice[]>([
    {
      id: "1",
      number: "INV-2024-001",
      amount: 25000,
      dueDate: "2024-04-15",
      status: "pending",
      client: "ABC Corporation",
      project: "Office Tower Development"
    },
    {
      id: "2",
      number: "INV-2024-002",
      amount: 15000,
      dueDate: "2024-04-30",
      status: "paid",
      client: "XYZ Limited",
      project: "Retail Complex Phase 1"
    },
    {
      id: "3",
      number: "INV-2024-003",
      amount: 35000,
      dueDate: "2024-03-15",
      status: "overdue",
      client: "123 Industries",
      project: "Residential Units B3"
    }
  ]);

  const handleViewInvoice = (invoice: Invoice) => {
    toast({
      title: "Invoice Details",
      description: `Viewing invoice ${invoice.number} for ${invoice.client}`,
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-semibold">Invoice Management</h2>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2">
            <DollarSign className="h-4 w-4" />
            New Invoice
          </Button>
        </div>
      </div>

      <InvoiceTable invoices={invoices} onViewInvoice={handleViewInvoice} />
    </Card>
  );
}
