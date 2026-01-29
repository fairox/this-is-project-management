
import { CheckCircle2, Clock } from "lucide-react";
import { Invoice } from "@/types/invoice";

interface InvoiceStatusProps {
  status: Invoice['status'];
}

export function InvoiceStatus({ status }: InvoiceStatusProps) {
  const getStatusIcon = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'overdue':
        return <Clock className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className="flex items-center gap-2">
      {getStatusIcon(status)}
      <span className="capitalize">{status}</span>
    </div>
  );
}
