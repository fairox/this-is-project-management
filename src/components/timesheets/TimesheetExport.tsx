import { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { CalendarIcon, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { TimeEntry, Employee } from '@/types/timesheet';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface TimesheetExportProps {
  entries: TimeEntry[];
  employees: Employee[];
}

export function TimesheetExport({ entries, employees }: TimesheetExportProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('csv');

  const exportToCSV = () => {
    const filteredEntries = entries.filter((entry) => {
      const entryDate = new Date(entry.date);
      const matchesEmployee =
        selectedEmployee === 'all' || entry.employeeId === selectedEmployee;
      const matchesDateRange =
        (!startDate || entryDate >= startDate) &&
        (!endDate || entryDate <= endDate);
      return matchesEmployee && matchesDateRange;
    });

    if (filteredEntries.length === 0) {
      toast({
        title: 'No data to export',
        description: 'There are no entries matching your filter criteria.',
        variant: 'destructive',
      });
      return;
    }

    const headers = [
      'Date',
      'Employee',
      'Project',
      'Clock In',
      'Clock Out',
      'Break (min)',
      'Hours Worked',
      'Overtime',
      'Status',
      'Description',
    ];

    const rows = filteredEntries.map((entry) => [
      entry.date,
      entry.employeeName,
      entry.projectName,
      entry.clockIn || '',
      entry.clockOut || '',
      entry.breakMinutes?.toString() || '0',
      entry.hoursWorked.toString(),
      entry.overtime?.toString() || '0',
      entry.status,
      `"${entry.description.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join(
      '\n'
    );

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `timesheet-report-${format(new Date(), 'yyyy-MM-dd')}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Export successful',
      description: `Exported ${filteredEntries.length} entries to CSV.`,
    });
  };

  const generateSummaryReport = () => {
    const filteredEntries = entries.filter((entry) => {
      const entryDate = new Date(entry.date);
      const matchesEmployee =
        selectedEmployee === 'all' || entry.employeeId === selectedEmployee;
      const matchesDateRange =
        (!startDate || entryDate >= startDate) &&
        (!endDate || entryDate <= endDate);
      return matchesEmployee && matchesDateRange;
    });

    // Group by employee
    const summary = filteredEntries.reduce((acc, entry) => {
      if (!acc[entry.employeeId]) {
        acc[entry.employeeId] = {
          name: entry.employeeName,
          totalHours: 0,
          overtimeHours: 0,
          entries: 0,
        };
      }
      acc[entry.employeeId].totalHours += entry.hoursWorked;
      acc[entry.employeeId].overtimeHours += entry.overtime || 0;
      acc[entry.employeeId].entries += 1;
      return acc;
    }, {} as Record<string, { name: string; totalHours: number; overtimeHours: number; entries: number }>);

    const summaryRows = Object.values(summary).map((emp) => [
      emp.name,
      emp.entries.toString(),
      emp.totalHours.toFixed(1),
      emp.overtimeHours.toFixed(1),
    ]);

    const headers = ['Employee', 'Entries', 'Total Hours', 'Overtime Hours'];
    const csvContent = [
      `Timesheet Summary Report`,
      `Period: ${startDate ? format(startDate, 'MMM d, yyyy') : 'All'} - ${endDate ? format(endDate, 'MMM d, yyyy') : 'All'}`,
      '',
      headers.join(','),
      ...summaryRows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `timesheet-summary-${format(new Date(), 'yyyy-MM-dd')}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Summary exported',
      description: 'Summary report has been downloaded.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Reports
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !startDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'PPP') : 'Select date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !endDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, 'PPP') : 'Select date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Employee</Label>
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger>
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              {employees.map((emp) => (
                <SelectItem key={emp.id} value={emp.id}>
                  {emp.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={exportToCSV} className="flex-1">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export Detailed CSV
          </Button>
          <Button variant="outline" onClick={generateSummaryReport} className="flex-1">
            <FileText className="h-4 w-4 mr-2" />
            Export Summary Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
