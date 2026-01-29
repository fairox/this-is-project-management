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
import { Scale, Clock, Plus, Gavel, AlertTriangle, CheckCircle } from 'lucide-react';
import { format, differenceInDays, isPast } from 'date-fns';
import type { Disagreement, Contract, DisagreementStatus } from '@/types/fidic';

interface DisagreementManagerProps {
  disagreements: Disagreement[];
  contracts: Contract[];
  isEngineer: boolean;
  onRaiseDisagreement: (data: {
    contract_id: string;
    reference_number: string;
    subject: string;
    description?: string;
    claim_id?: string;
  }) => Promise<boolean>;
  onIssueDetermination: (disagreementId: string, determination: string, status?: DisagreementStatus) => Promise<boolean>;
}

const statusColors: Record<DisagreementStatus, string> = {
  open: 'bg-blue-500',
  under_discussion: 'bg-yellow-500',
  agreement_reached: 'bg-green-500',
  determination_pending: 'bg-orange-500',
  determination_issued: 'bg-purple-500',
  referred_to_dab: 'bg-red-500',
  resolved: 'bg-green-600',
};

const statusLabels: Record<DisagreementStatus, string> = {
  open: 'Open',
  under_discussion: 'Under Discussion',
  agreement_reached: 'Agreement Reached',
  determination_pending: 'Determination Pending',
  determination_issued: 'Determination Issued',
  referred_to_dab: 'Referred to DAB',
  resolved: 'Resolved',
};

export function DisagreementManager({
  disagreements,
  contracts,
  isEngineer,
  onRaiseDisagreement,
  onIssueDetermination,
}: DisagreementManagerProps) {
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [selectedDisagreement, setSelectedDisagreement] = useState<Disagreement | null>(null);
  const [determination, setDetermination] = useState('');
  const [formData, setFormData] = useState({
    contract_id: '',
    reference_number: '',
    subject: '',
    description: '',
  });

  const handleSubmit = async () => {
    const success = await onRaiseDisagreement({
      contract_id: formData.contract_id,
      reference_number: formData.reference_number,
      subject: formData.subject,
      description: formData.description || undefined,
    });

    if (success) {
      setIsNewOpen(false);
      setFormData({
        contract_id: '',
        reference_number: '',
        subject: '',
        description: '',
      });
    }
  };

  const handleDetermination = async () => {
    if (!selectedDisagreement || !determination) return;
    await onIssueDetermination(selectedDisagreement.id, determination, 'determination_issued');
    setSelectedDisagreement(null);
    setDetermination('');
  };

  const getDaysRemaining = (deadline: string | null) => {
    if (!deadline) return null;
    return differenceInDays(new Date(deadline), new Date());
  };

  const pendingDetermination = disagreements.filter(d =>
    d.status === 'open' || d.status === 'under_discussion' || d.status === 'determination_pending'
  );

  const approachingDeadline = disagreements.filter(d => {
    const daysLeft = getDaysRemaining(d.agreement_deadline);
    return daysLeft !== null && daysLeft < 14 && daysLeft > 0 && d.status !== 'resolved' && d.status !== 'agreement_reached';
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Disagreement & Dispute Resolution</h3>
          <p className="text-sm text-muted-foreground">FIDIC Clause 3.7 - Agreement or Determination (42-day period)</p>
        </div>
        <Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Raise Disagreement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Raise Disagreement</DialogTitle>
              <DialogDescription>
                Record a disagreement requiring Engineer's determination under Clause 3.7
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
              <div>
                <Label>Reference Number</Label>
                <Input
                  value={formData.reference_number}
                  onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
                  placeholder="DIS-001"
                />
              </div>
              <div>
                <Label>Subject</Label>
                <Input
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Brief description of the disagreement"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of the matter in dispute"
                  rows={4}
                />
              </div>
              <Button onClick={handleSubmit} className="w-full">
                <Scale className="h-4 w-4 mr-2" />
                Submit Disagreement
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="rounded-3xl border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{disagreements.length}</CardTitle>
            <CardDescription>Total Disagreements</CardDescription>
          </CardHeader>
        </Card>
        <Card className="rounded-3xl border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-orange-600">{pendingDetermination.length}</CardTitle>
            <CardDescription>Pending Determination</CardDescription>
          </CardHeader>
        </Card>
        <Card className="rounded-3xl border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-yellow-600">{approachingDeadline.length}</CardTitle>
            <CardDescription>Deadline Approaching</CardDescription>
          </CardHeader>
        </Card>
        <Card className="rounded-3xl border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-green-600">
              {disagreements.filter(d => d.status === 'resolved' || d.status === 'agreement_reached').length}
            </CardTitle>
            <CardDescription>Resolved</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Disagreements Table */}
      <Card className="rounded-3xl border-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Contract</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Agreement Deadline</TableHead>
                <TableHead>Raised</TableHead>
                {isEngineer && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {disagreements.map((item) => {
                const daysLeft = getDaysRemaining(item.agreement_deadline);
                const isOverdue = item.agreement_deadline && isPast(new Date(item.agreement_deadline)) &&
                  item.status !== 'resolved' && item.status !== 'agreement_reached' && item.status !== 'determination_issued';

                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.reference_number}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Scale className="h-4 w-4 text-muted-foreground" />
                        {item.subject}
                      </div>
                    </TableCell>
                    <TableCell>{item.contract_title}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[item.status]}>
                        {statusLabels[item.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.agreement_deadline && (
                        <div className="flex items-center gap-1">
                          {isOverdue ? (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          ) : daysLeft !== null && daysLeft < 14 ? (
                            <Clock className="h-4 w-4 text-yellow-500" />
                          ) : (
                            <Clock className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className={isOverdue ? 'text-red-500' : daysLeft !== null && daysLeft < 14 ? 'text-yellow-600' : ''}>
                            {isOverdue ? 'Determination Required' : `${daysLeft} days`}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {format(new Date(item.raised_at), 'MMM d, yyyy')}
                    </TableCell>
                    {isEngineer && (
                      <TableCell>
                        {(item.status === 'open' || item.status === 'under_discussion' || item.status === 'determination_pending') && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => setSelectedDisagreement(item)}>
                                <Gavel className="h-4 w-4 mr-1" />
                                Determine
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Engineer's Determination</DialogTitle>
                                <DialogDescription>
                                  Issue a fair determination for {item.reference_number}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Subject</Label>
                                  <p className="text-sm text-muted-foreground">{item.subject}</p>
                                </div>
                                {item.description && (
                                  <div>
                                    <Label>Description</Label>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                  </div>
                                )}
                                <div>
                                  <Label>Engineer's Determination</Label>
                                  <Textarea
                                    value={determination}
                                    onChange={(e) => setDetermination(e.target.value)}
                                    placeholder="Enter your fair determination..."
                                    rows={5}
                                  />
                                </div>
                                <Button onClick={handleDetermination} className="w-full">
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Issue Determination
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
              {disagreements.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No disagreements recorded
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
