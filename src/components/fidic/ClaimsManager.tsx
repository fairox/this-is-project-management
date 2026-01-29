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
import { AlertTriangle, Clock, Plus, FileText, CheckCircle, XCircle } from 'lucide-react';
import { format, differenceInDays, isPast } from 'date-fns';
import type { Claim, Contract, ClaimStatus } from '@/types/fidic';

interface ClaimsManagerProps {
  claims: Claim[];
  contracts: Contract[];
  isContractor: boolean;
  isEngineer: boolean;
  onSubmitClaim: (data: {
    contract_id: string;
    claim_number: string;
    claimant_type: 'contractor' | 'employer';
    title: string;
    description?: string;
    clause_reference?: string;
    amount_claimed?: number;
    time_extension_days?: number;
  }) => Promise<boolean>;
  onUpdateStatus: (claimId: string, status: ClaimStatus, determination?: string, amountApproved?: number, timeApproved?: number) => Promise<boolean>;
}

const statusColors: Record<ClaimStatus, string> = {
  notice_submitted: 'bg-blue-500',
  detailed_claim_pending: 'bg-yellow-500',
  detailed_claim_submitted: 'bg-purple-500',
  under_review: 'bg-orange-500',
  partially_approved: 'bg-teal-500',
  approved: 'bg-green-500',
  rejected: 'bg-red-500',
  time_barred: 'bg-gray-500',
  withdrawn: 'bg-gray-400',
};

const statusLabels: Record<ClaimStatus, string> = {
  notice_submitted: 'Notice Submitted',
  detailed_claim_pending: 'Detailed Claim Pending',
  detailed_claim_submitted: 'Detailed Claim Submitted',
  under_review: 'Under Review',
  partially_approved: 'Partially Approved',
  approved: 'Approved',
  rejected: 'Rejected',
  time_barred: 'Time Barred',
  withdrawn: 'Withdrawn',
};

export function ClaimsManager({ claims, contracts, isContractor, isEngineer, onSubmitClaim, onUpdateStatus }: ClaimsManagerProps) {
  const [isNewClaimOpen, setIsNewClaimOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [formData, setFormData] = useState({
    contract_id: '',
    claim_number: '',
    title: '',
    description: '',
    clause_reference: '',
    amount_claimed: '',
    time_extension_days: '',
  });
  const [determination, setDetermination] = useState('');
  const [approvalAmount, setApprovalAmount] = useState('');
  const [approvalDays, setApprovalDays] = useState('');

  const handleSubmit = async () => {
    const success = await onSubmitClaim({
      contract_id: formData.contract_id,
      claim_number: formData.claim_number,
      claimant_type: 'contractor',
      title: formData.title,
      description: formData.description || undefined,
      clause_reference: formData.clause_reference || undefined,
      amount_claimed: formData.amount_claimed ? parseFloat(formData.amount_claimed) : undefined,
      time_extension_days: formData.time_extension_days ? parseInt(formData.time_extension_days) : undefined,
    });

    if (success) {
      setIsNewClaimOpen(false);
      setFormData({
        contract_id: '',
        claim_number: '',
        title: '',
        description: '',
        clause_reference: '',
        amount_claimed: '',
        time_extension_days: '',
      });
    }
  };

  const handleDetermination = async (status: ClaimStatus) => {
    if (!selectedClaim) return;

    await onUpdateStatus(
      selectedClaim.id,
      status,
      determination || undefined,
      approvalAmount ? parseFloat(approvalAmount) : undefined,
      approvalDays ? parseInt(approvalDays) : undefined
    );

    setSelectedClaim(null);
    setDetermination('');
    setApprovalAmount('');
    setApprovalDays('');
  };

  const getDaysRemaining = (dueDate: string | null) => {
    if (!dueDate) return null;
    const due = new Date(dueDate);
    const days = differenceInDays(due, new Date());
    return days;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Claims Management</h3>
          <p className="text-sm text-muted-foreground">FIDIC Clause 20 - Claims, Disputes and Arbitration</p>
        </div>
        {isContractor && (
          <Dialog open={isNewClaimOpen} onOpenChange={setIsNewClaimOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Submit Claim Notice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Submit Claim Notice</DialogTitle>
                <DialogDescription>
                  Submit a notice of claim as per FIDIC Clause 20.2. You have 84 days to submit the detailed claim.
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
                    <Label>Claim Number</Label>
                    <Input
                      value={formData.claim_number}
                      onChange={(e) => setFormData({ ...formData, claim_number: e.target.value })}
                      placeholder="CLM-001"
                    />
                  </div>
                  <div>
                    <Label>FIDIC Clause Reference</Label>
                    <Input
                      value={formData.clause_reference}
                      onChange={(e) => setFormData({ ...formData, clause_reference: e.target.value })}
                      placeholder="e.g., 8.5, 13.7"
                    />
                  </div>
                </div>
                <div>
                  <Label>Claim Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Brief description of the claim"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed description of circumstances giving rise to the claim"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Amount Claimed (if applicable)</Label>
                    <Input
                      type="number"
                      value={formData.amount_claimed}
                      onChange={(e) => setFormData({ ...formData, amount_claimed: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label>Time Extension (days)</Label>
                    <Input
                      type="number"
                      value={formData.time_extension_days}
                      onChange={(e) => setFormData({ ...formData, time_extension_days: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>
                <Button onClick={handleSubmit} className="w-full">Submit Claim Notice</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="rounded-3xl border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{claims.length}</CardTitle>
            <CardDescription>Total Claims</CardDescription>
          </CardHeader>
        </Card>
        <Card className="rounded-3xl border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-yellow-600">
              {claims.filter(c => c.status === 'notice_submitted' || c.status === 'detailed_claim_pending').length}
            </CardTitle>
            <CardDescription>Pending Response</CardDescription>
          </CardHeader>
        </Card>
        <Card className="rounded-3xl border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-orange-600">
              {claims.filter(c => c.detailed_claim_due_date && getDaysRemaining(c.detailed_claim_due_date)! < 14 && getDaysRemaining(c.detailed_claim_due_date)! > 0 && !c.detailed_claim_submitted_at).length}
            </CardTitle>
            <CardDescription>Deadline Soon</CardDescription>
          </CardHeader>
        </Card>
        <Card className="rounded-3xl border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-red-600">
              {claims.filter(c => c.is_time_barred).length}
            </CardTitle>
            <CardDescription>Time Barred</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Claims Table */}
      <Card className="rounded-3xl border-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claim #</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Contract</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Amount</TableHead>
                {isEngineer && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {claims.map((claim) => {
                const daysLeft = getDaysRemaining(claim.detailed_claim_due_date);
                const isOverdue = claim.detailed_claim_due_date && isPast(new Date(claim.detailed_claim_due_date)) && !claim.detailed_claim_submitted_at;

                return (
                  <TableRow key={claim.id}>
                    <TableCell className="font-medium">{claim.claim_number}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {claim.title}
                      </div>
                    </TableCell>
                    <TableCell>{claim.contract_title}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[claim.status]}>
                        {statusLabels[claim.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {claim.detailed_claim_due_date && !claim.detailed_claim_submitted_at && (
                        <div className="flex items-center gap-1">
                          {isOverdue ? (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          ) : daysLeft !== null && daysLeft < 14 ? (
                            <Clock className="h-4 w-4 text-yellow-500" />
                          ) : (
                            <Clock className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className={isOverdue ? 'text-red-500' : daysLeft !== null && daysLeft < 14 ? 'text-yellow-600' : ''}>
                            {isOverdue ? 'Overdue' : `${daysLeft} days`}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {claim.amount_claimed ? `$${claim.amount_claimed.toLocaleString()}` : '-'}
                    </TableCell>
                    {isEngineer && (
                      <TableCell>
                        {(claim.status === 'detailed_claim_submitted' || claim.status === 'under_review') && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => setSelectedClaim(claim)}>
                                Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Engineer's Determination</DialogTitle>
                                <DialogDescription>
                                  Issue determination for claim {claim.claim_number}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Determination</Label>
                                  <Textarea
                                    value={determination}
                                    onChange={(e) => setDetermination(e.target.value)}
                                    placeholder="Enter your determination..."
                                    rows={4}
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Amount Approved</Label>
                                    <Input
                                      type="number"
                                      value={approvalAmount}
                                      onChange={(e) => setApprovalAmount(e.target.value)}
                                      placeholder="0.00"
                                    />
                                  </div>
                                  <div>
                                    <Label>Days Approved</Label>
                                    <Input
                                      type="number"
                                      value={approvalDays}
                                      onChange={(e) => setApprovalDays(e.target.value)}
                                      placeholder="0"
                                    />
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button className="flex-1" onClick={() => handleDetermination('approved')}>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve
                                  </Button>
                                  <Button className="flex-1" variant="secondary" onClick={() => handleDetermination('partially_approved')}>
                                    Partial
                                  </Button>
                                  <Button className="flex-1" variant="destructive" onClick={() => handleDetermination('rejected')}>
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
              {claims.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No claims submitted yet
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
