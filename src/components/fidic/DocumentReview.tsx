import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileUp, Clock, CheckCircle, XCircle, AlertTriangle, Plus, FileText } from 'lucide-react';
import { format, differenceInDays, isPast } from 'date-fns';
import type { DocumentSubmission, Contract, DocumentType, DocumentStatus } from '@/types/fidic';

interface DocumentReviewProps {
  documents: DocumentSubmission[];
  contracts: Contract[];
  isContractor: boolean;
  isEngineer: boolean;
  isProjectArchitect: boolean;
  onSubmitDocument: (data: {
    contract_id: string;
    document_type: string;
    reference_number: string;
    title: string;
    description?: string;
    file_url?: string;
  }) => Promise<boolean>;
  onReviewDocument: (docId: string, status: DocumentStatus, comments?: string) => Promise<boolean>;
}

const documentTypeLabels: Record<DocumentType, string> = {
  shop_drawing: 'Shop Drawing',
  method_statement: 'Method Statement',
  quality_plan: 'Quality Plan',
  safety_plan: 'Safety Plan',
  material_approval: 'Material Approval',
  equipment_approval: 'Equipment Approval',
  as_built: 'As-Built Drawing',
  other: 'Other',
};

const statusColors: Record<DocumentStatus, string> = {
  submitted: 'bg-blue-500',
  under_review: 'bg-yellow-500',
  approved: 'bg-green-500',
  approved_with_comments: 'bg-teal-500',
  rejected: 'bg-red-500',
  no_objection: 'bg-green-600',
  superseded: 'bg-gray-500',
};

const statusLabels: Record<DocumentStatus, string> = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  approved: 'Approved',
  approved_with_comments: 'Approved w/ Comments',
  rejected: 'Rejected',
  no_objection: 'No Objection',
  superseded: 'Superseded',
};

export function DocumentReview({
  documents,
  contracts,
  isContractor,
  isEngineer,
  isProjectArchitect,
  onSubmitDocument,
  onReviewDocument,
}: DocumentReviewProps) {
  const [isNewDocOpen, setIsNewDocOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentSubmission | null>(null);
  const [reviewComments, setReviewComments] = useState('');
  const [formData, setFormData] = useState({
    contract_id: '',
    document_type: '',
    reference_number: '',
    title: '',
    description: '',
  });

  const canReview = isEngineer || isProjectArchitect;

  const handleSubmit = async () => {
    const success = await onSubmitDocument({
      contract_id: formData.contract_id,
      document_type: formData.document_type,
      reference_number: formData.reference_number,
      title: formData.title,
      description: formData.description || undefined,
    });

    if (success) {
      setIsNewDocOpen(false);
      setFormData({
        contract_id: '',
        document_type: '',
        reference_number: '',
        title: '',
        description: '',
      });
    }
  };

  const handleReview = async (status: DocumentStatus) => {
    if (!selectedDoc) return;
    await onReviewDocument(selectedDoc.id, status, reviewComments || undefined);
    setSelectedDoc(null);
    setReviewComments('');
  };

  const getDaysRemaining = (deadline: string | null) => {
    if (!deadline) return null;
    return differenceInDays(new Date(deadline), new Date());
  };

  const pendingReview = documents.filter(d => d.status === 'submitted' || d.status === 'under_review');
  const overdue = documents.filter(d => d.review_deadline && isPast(new Date(d.review_deadline)) && d.status === 'submitted');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Document Submissions</h3>
          <p className="text-sm text-muted-foreground">FIDIC Clause 5 - Design (21-day review period)</p>
        </div>
        {isContractor && (
          <Dialog open={isNewDocOpen} onOpenChange={setIsNewDocOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Submit Document
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Submit Document for Review</DialogTitle>
                <DialogDescription>
                  Submit documents for Engineer's review. Response required within 21 days.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Contract</Label>
                  <Select value={formData.contract_id} onValueChange={(v) => setFormData({ ...formData, contract_id: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select contract" />
                    </SelectTrigger>
                    <SelectContent>
                      {contracts.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Document Type</Label>
                    <Select value={formData.document_type} onValueChange={(v) => setFormData({ ...formData, document_type: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(documentTypeLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Reference Number</Label>
                    <Input
                      value={formData.reference_number}
                      onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
                      placeholder="DOC-001"
                    />
                  </div>
                </div>
                <div>
                  <Label>Document Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Document title"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the document"
                    rows={3}
                  />
                </div>
                <Button onClick={handleSubmit} className="w-full">
                  <FileUp className="h-4 w-4 mr-2" />
                  Submit for Review
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{documents.length}</CardTitle>
            <CardDescription>Total Submissions</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-yellow-600">{pendingReview.length}</CardTitle>
            <CardDescription>Pending Review</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-red-600">{overdue.length}</CardTitle>
            <CardDescription>Overdue (Auto-Approve)</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-green-600">
              {documents.filter(d => d.status === 'approved' || d.status === 'no_objection').length}
            </CardTitle>
            <CardDescription>Approved</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Documents Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Contract</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Review Deadline</TableHead>
                {canReview && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => {
                const daysLeft = getDaysRemaining(doc.review_deadline);
                const isOverdue = doc.review_deadline && isPast(new Date(doc.review_deadline)) && doc.status === 'submitted';

                return (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.reference_number}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {documentTypeLabels[doc.document_type]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {doc.title}
                      </div>
                    </TableCell>
                    <TableCell>{doc.contract_title}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[doc.status]}>
                        {statusLabels[doc.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {doc.review_deadline && doc.status === 'submitted' && (
                        <div className="flex items-center gap-1">
                          {isOverdue ? (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          ) : daysLeft !== null && daysLeft < 7 ? (
                            <Clock className="h-4 w-4 text-yellow-500" />
                          ) : (
                            <Clock className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className={isOverdue ? 'text-red-500' : daysLeft !== null && daysLeft < 7 ? 'text-yellow-600' : ''}>
                            {isOverdue ? 'Overdue - No Objection' : `${daysLeft} days`}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    {canReview && (
                      <TableCell>
                        {doc.status === 'submitted' && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => setSelectedDoc(doc)}>
                                Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Review Document</DialogTitle>
                                <DialogDescription>
                                  Review {doc.title} ({doc.reference_number})
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Review Comments</Label>
                                  <Textarea
                                    value={reviewComments}
                                    onChange={(e) => setReviewComments(e.target.value)}
                                    placeholder="Enter review comments..."
                                    rows={4}
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <Button className="flex-1" onClick={() => handleReview('approved')}>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve
                                  </Button>
                                  <Button className="flex-1" variant="secondary" onClick={() => handleReview('approved_with_comments')}>
                                    Approve w/ Comments
                                  </Button>
                                  <Button className="flex-1" variant="destructive" onClick={() => handleReview('rejected')}>
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
              {documents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No documents submitted yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
