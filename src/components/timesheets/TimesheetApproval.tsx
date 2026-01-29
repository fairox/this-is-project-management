import { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Check, X, Clock, User } from 'lucide-react';
import { Timesheet } from '@/types/timesheet';
import { cn } from '@/lib/utils';

interface TimesheetApprovalProps {
  timesheets: Timesheet[];
  onApprove: (timesheetId: string) => void;
  onReject: (timesheetId: string, reason: string) => void;
}

export function TimesheetApproval({
  timesheets,
  onApprove,
  onReject,
}: TimesheetApprovalProps) {
  const [selectedTimesheet, setSelectedTimesheet] = useState<Timesheet | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const pendingTimesheets = timesheets.filter((ts) => ts.status === 'submitted');

  const getStatusBadge = (status: Timesheet['status']) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-800',
      submitted: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return <Badge className={cn(styles[status])}>{status}</Badge>;
  };

  const handleReject = () => {
    if (selectedTimesheet && rejectionReason.trim()) {
      onReject(selectedTimesheet.id, rejectionReason);
      setShowRejectDialog(false);
      setSelectedTimesheet(null);
      setRejectionReason('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Pending Approvals
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pendingTimesheets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No timesheets pending approval</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Week</TableHead>
                <TableHead className="text-right">Hours</TableHead>
                <TableHead className="text-right">Overtime</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingTimesheets.map((timesheet) => (
                <TableRow key={timesheet.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{timesheet.employeeName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(timesheet.weekStartDate), 'MMM d')} -{' '}
                    {format(new Date(timesheet.weekEndDate), 'MMM d')}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {timesheet.totalHours}h
                  </TableCell>
                  <TableCell className="text-right">
                    {timesheet.overtimeHours > 0 ? (
                      <span className="text-orange-600">{timesheet.overtimeHours}h</span>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {timesheet.submittedAt &&
                      format(new Date(timesheet.submittedAt), 'MMM d, h:mm a')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => onApprove(timesheet.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          setSelectedTimesheet(timesheet);
                          setShowRejectDialog(true);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* All Timesheets */}
        <div className="mt-8">
          <h3 className="font-semibold mb-4">All Timesheets</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Week</TableHead>
                <TableHead className="text-right">Hours</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Approved By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timesheets.map((timesheet) => (
                <TableRow key={timesheet.id}>
                  <TableCell className="font-medium">{timesheet.employeeName}</TableCell>
                  <TableCell>
                    {format(new Date(timesheet.weekStartDate), 'MMM d')} -{' '}
                    {format(new Date(timesheet.weekEndDate), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">{timesheet.totalHours}h</TableCell>
                  <TableCell>{getStatusBadge(timesheet.status)}</TableCell>
                  <TableCell>
                    {timesheet.approvedBy || '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Reject Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Timesheet</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Please provide a reason for rejecting this timesheet.
              </p>
              <Textarea
                placeholder="Enter rejection reason..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
              >
                Reject Timesheet
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
