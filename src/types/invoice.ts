
export interface Invoice {
  id: string;
  number: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  client: string;
  project: string;
}

export interface InvoiceNote {
  id: string;
  invoiceId: string;
  content: string;
  createdAt: string;
  author: string;
}
