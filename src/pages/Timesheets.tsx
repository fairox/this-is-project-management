import { useState } from 'react';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, List, Clock, Download, Send, Loader2, Users } from 'lucide-react';
import { TimesheetCalendar } from '@/components/timesheets/TimesheetCalendar';
import { TimeEntryDialog } from '@/components/timesheets/TimeEntryDialog';
import { TimesheetApproval } from '@/components/timesheets/TimesheetApproval';
import { TimesheetExport } from '@/components/timesheets/TimesheetExport';
import { TimesheetSummary } from '@/components/timesheets/TimesheetSummary';
import { UserRoleManager } from '@/components/timesheets/UserRoleManager';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import { useTimesheets, TimeEntry } from '@/hooks/useTimesheets';

type ViewMode = 'daily' | 'weekly';

const Timesheets = () => {
  const { user, loading: authLoading } = useAuth();
  const {
    entries,
    timesheets,
    projects,
    profile,
    loading: dataLoading,
    addEntry,
    updateEntry,
    submitWeek,
    approveTimesheet,
    rejectTimesheet,
  } = useTimesheets();

  const [viewMode, setViewMode] = useState<ViewMode>('weekly');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
  const [activeTab, setActiveTab] = useState('my-time');

  // Show loading state
  if (authLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  // Show auth form if not logged in
  if (!user) {
    return (
      <AppLayout>
        <div className="container mx-auto p-4 md:p-6">
          <div className="max-w-md mx-auto mt-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Timesheets</h1>
              <p className="text-muted-foreground">
                Sign in to track your working hours
              </p>
            </div>
            <AuthForm />
          </div>
        </div>
      </AppLayout>
    );
  }

  const myEntries = entries.filter((e) => e.user_id === user.id);

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const currentWeekEntries = myEntries.filter((e) => {
    const entryDate = new Date(e.date);
    return entryDate >= weekStart && entryDate <= weekEnd;
  });

  const handleAddEntry = (date: Date) => {
    setSelectedDate(date);
    setEditingEntry(null);
    setDialogOpen(true);
  };

  const handleEditEntry = (entry: TimeEntry) => {
    setSelectedDate(new Date(entry.date));
    setEditingEntry(entry);
    setDialogOpen(true);
  };

  const handleSaveEntry = async (entryData: Partial<TimeEntry>) => {
    if (editingEntry) {
      await updateEntry(editingEntry.id, entryData);
    } else {
      await addEntry(entryData);
    }
    setDialogOpen(false);
  };

  const handleSubmitTimesheet = () => {
    submitWeek(selectedDate);
  };

  const draftCount = currentWeekEntries.filter((e) => e.status === 'draft').length;
  const pendingCount = timesheets.filter((ts) => ts.status === 'submitted').length;

  const isManager = profile?.role === 'manager' || profile?.role === 'admin';
  const isAdmin = profile?.role === 'admin';

  // Convert entries to legacy format for components
  const legacyEntries = myEntries.map((e) => ({
    id: e.id,
    employeeId: e.user_id,
    employeeName: profile?.full_name || 'Unknown',
    projectId: e.project_id || '',
    projectName: e.project_name || 'No Project',
    date: e.date,
    hoursWorked: Number(e.hours_worked),
    description: e.description || '',
    status: e.status,
    clockIn: e.clock_in || undefined,
    clockOut: e.clock_out || undefined,
    breakMinutes: e.break_minutes || 0,
    overtime: Number(e.overtime_hours) || 0,
  }));

  const legacyTimesheets = timesheets.map((ts) => ({
    id: ts.id,
    employeeId: ts.user_id,
    employeeName: ts.employee_name || profile?.full_name || 'Unknown',
    weekStartDate: ts.week_start_date,
    weekEndDate: ts.week_end_date,
    entries: [],
    totalHours: Number(ts.total_hours),
    overtimeHours: Number(ts.overtime_hours),
    status: ts.status,
    submittedAt: ts.submitted_at || undefined,
    approvedBy: ts.approved_by || undefined,
    approvedAt: ts.approved_at || undefined,
    rejectionReason: ts.rejection_reason || undefined,
  }));

  return (
    <AppLayout>
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Timesheets</h1>
            <p className="text-muted-foreground">
              Track your working hours and manage time entries
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'daily' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('daily')}
            >
              <List className="h-4 w-4 mr-1" />
              Daily
            </Button>
            <Button
              variant={viewMode === 'weekly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('weekly')}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Weekly
            </Button>
          </div>
        </div>

        {dataLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <TimesheetSummary
              entries={currentWeekEntries.map((e) => ({
                id: e.id,
                employeeId: e.user_id,
                employeeName: profile?.full_name || '',
                projectId: e.project_id || '',
                projectName: e.project_name || '',
                date: e.date,
                hoursWorked: Number(e.hours_worked),
                description: e.description || '',
                status: e.status,
                overtime: Number(e.overtime_hours) || 0,
              }))}
              timesheets={legacyTimesheets}
            />

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-4' : 'grid-cols-3'}`}>
                <TabsTrigger value="my-time" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="hidden sm:inline">My Time</span>
                  <span className="sm:hidden">Time</span>
                </TabsTrigger>
                <TabsTrigger value="approvals" className="flex items-center gap-2">
                  Approvals
                  {pendingCount > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {pendingCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="reports" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Reports</span>
                </TabsTrigger>
                {isAdmin && (
                  <TabsTrigger value="users" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="hidden sm:inline">Users</span>
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="my-time" className="space-y-4 mt-4">
                <div className="flex justify-end">
                  <Button onClick={handleSubmitTimesheet} disabled={draftCount === 0}>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Week ({draftCount} entries)
                  </Button>
                </div>
                <TimesheetCalendar
                  entries={legacyEntries}
                  viewMode={viewMode}
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  onAddEntry={handleAddEntry}
                  onEditEntry={(entry) => {
                    const fullEntry = myEntries.find((e) => e.id === entry.id);
                    if (fullEntry) handleEditEntry(fullEntry);
                  }}
                />
              </TabsContent>

              <TabsContent value="approvals" className="mt-4">
                {isManager ? (
                  <TimesheetApproval
                    timesheets={legacyTimesheets}
                    onApprove={approveTimesheet}
                    onReject={rejectTimesheet}
                  />
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Only managers can approve timesheets.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="reports" className="mt-4">
                <TimesheetExport
                  entries={legacyEntries}
                  employees={[
                    {
                      id: user.id,
                      name: profile?.full_name || 'Unknown',
                      role: profile?.role || 'employee',
                      department: profile?.department || 'General',
                      hourlyRate: profile?.hourly_rate || 0,
                    },
                  ]}
                />
              </TabsContent>

              {isAdmin && (
                <TabsContent value="users" className="mt-4">
                  <UserRoleManager />
                </TabsContent>
              )}
            </Tabs>
          </>
        )}

        <TimeEntryDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSave={handleSaveEntry}
          entry={
            editingEntry
              ? {
                  id: editingEntry.id,
                  employeeId: editingEntry.user_id,
                  employeeName: profile?.full_name || '',
                  projectId: editingEntry.project_id || '',
                  projectName: editingEntry.project_name || '',
                  date: editingEntry.date,
                  hoursWorked: Number(editingEntry.hours_worked),
                  description: editingEntry.description || '',
                  status: editingEntry.status,
                  clockIn: editingEntry.clock_in || undefined,
                  clockOut: editingEntry.clock_out || undefined,
                  breakMinutes: editingEntry.break_minutes || 0,
                  overtime: Number(editingEntry.overtime_hours) || 0,
                }
              : null
          }
          selectedDate={selectedDate}
          projects={projects}
        />
      </div>
    </AppLayout>
  );
};

export default Timesheets;
