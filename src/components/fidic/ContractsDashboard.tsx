import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Plus, Building, Calendar, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import type { Contract } from '@/types/fidic';

interface ContractsDashboardProps {
  contracts: Contract[];
  isEngineer: boolean;
  isEmployer: boolean;
  onCreateContract: (data: {
    contract_number: string;
    title: string;
    accepted_contract_amount: number;
    time_for_completion: number;
    project_id?: string;
    advance_payment_percentage?: number;
    retention_percentage?: number;
    delay_damages_rate?: number;
    commencement_date?: string;
  }) => Promise<boolean>;
}

const statusColors: Record<string, string> = {
  draft: 'bg-gray-500',
  active: 'bg-green-500',
  completed: 'bg-blue-500',
  terminated: 'bg-red-500',
};

export function ContractsDashboard({
  contracts,
  isEngineer,
  isEmployer,
  onCreateContract,
}: ContractsDashboardProps) {
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [formData, setFormData] = useState({
    contract_number: '',
    title: '',
    accepted_contract_amount: '',
    time_for_completion: '',
    advance_payment_percentage: '10',
    retention_percentage: '5',
    delay_damages_rate: '0.1',
    commencement_date: '',
  });

  const canCreate = isEngineer || isEmployer;

  const handleSubmit = async () => {
    const success = await onCreateContract({
      contract_number: formData.contract_number,
      title: formData.title,
      accepted_contract_amount: parseFloat(formData.accepted_contract_amount),
      time_for_completion: parseInt(formData.time_for_completion),
      advance_payment_percentage: parseFloat(formData.advance_payment_percentage),
      retention_percentage: parseFloat(formData.retention_percentage),
      delay_damages_rate: parseFloat(formData.delay_damages_rate),
      commencement_date: formData.commencement_date || undefined,
    });

    if (success) {
      setIsNewOpen(false);
      setFormData({
        contract_number: '',
        title: '',
        accepted_contract_amount: '',
        time_for_completion: '',
        advance_payment_percentage: '10',
        retention_percentage: '5',
        delay_damages_rate: '0.1',
        commencement_date: '',
      });
    }
  };

  const totalValue = contracts.reduce((sum, c) => sum + Number(c.accepted_contract_amount), 0);
  const activeContracts = contracts.filter(c => c.status === 'active');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Contracts Overview</h3>
          <p className="text-sm text-muted-foreground">FIDIC Red Book 2017 Contract Administration</p>
        </div>
        {canCreate && (
          <Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Contract
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Contract</DialogTitle>
                <DialogDescription>
                  Set up a new FIDIC Red Book construction contract
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Contract Number</Label>
                    <Input
                      value={formData.contract_number}
                      onChange={(e) => setFormData({ ...formData, contract_number: e.target.value })}
                      placeholder="CON-001"
                    />
                  </div>
                  <div>
                    <Label>Commencement Date</Label>
                    <Input
                      type="date"
                      value={formData.commencement_date}
                      onChange={(e) => setFormData({ ...formData, commencement_date: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Contract Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Construction of ..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Accepted Contract Amount ($)</Label>
                    <Input
                      type="number"
                      value={formData.accepted_contract_amount}
                      onChange={(e) => setFormData({ ...formData, accepted_contract_amount: e.target.value })}
                      placeholder="1000000"
                    />
                  </div>
                  <div>
                    <Label>Time for Completion (days)</Label>
                    <Input
                      type="number"
                      value={formData.time_for_completion}
                      onChange={(e) => setFormData({ ...formData, time_for_completion: e.target.value })}
                      placeholder="365"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Advance Payment (%)</Label>
                    <Input
                      type="number"
                      value={formData.advance_payment_percentage}
                      onChange={(e) => setFormData({ ...formData, advance_payment_percentage: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Retention (%)</Label>
                    <Input
                      type="number"
                      value={formData.retention_percentage}
                      onChange={(e) => setFormData({ ...formData, retention_percentage: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Delay Damages (%/day)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.delay_damages_rate}
                      onChange={(e) => setFormData({ ...formData, delay_damages_rate: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={handleSubmit} className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Create Contract
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="rounded-3xl border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{contracts.length}</CardTitle>
            <CardDescription>Total Contracts</CardDescription>
          </CardHeader>
        </Card>
        <Card className="rounded-3xl border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-green-600">{activeContracts.length}</CardTitle>
            <CardDescription>Active</CardDescription>
          </CardHeader>
        </Card>
        <Card className="rounded-3xl border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">${(totalValue / 1000000).toFixed(1)}M</CardTitle>
            <CardDescription>Total Value</CardDescription>
          </CardHeader>
        </Card>
        <Card className="rounded-3xl border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">
              {contracts.filter(c => c.status === 'completed').length}
            </CardTitle>
            <CardDescription>Completed</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Contracts Table */}
      <Card className="rounded-3xl border-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contract #</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Contract Amount</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Commencement</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">{contract.contract_number}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      {contract.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[contract.status]}>
                      {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      {Number(contract.accepted_contract_amount).toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>{contract.time_for_completion} days</TableCell>
                  <TableCell>
                    {contract.commencement_date ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {format(new Date(contract.commencement_date), 'MMM d, yyyy')}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Not set</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {contracts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No contracts created yet
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
