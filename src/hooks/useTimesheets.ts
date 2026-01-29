import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { format, startOfWeek, endOfWeek } from 'date-fns';

export interface TimeEntry {
  id: string;
  user_id: string;
  project_id: string | null;
  date: string;
  hours_worked: number;
  overtime_hours: number;
  description: string | null;
  clock_in: string | null;
  clock_out: string | null;
  break_minutes: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  // Joined data
  project_name?: string;
  employee_name?: string;
}

export interface Timesheet {
  id: string;
  user_id: string;
  week_start_date: string;
  week_end_date: string;
  total_hours: number;
  overtime_hours: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submitted_at: string | null;
  approved_by: string | null;
  approved_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  employee_name?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  role: 'employee' | 'manager' | 'admin';
  department: string | null;
  hourly_rate: number;
}

export function useTimesheets() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }

    setProfile(data as Profile);
  }, [user]);

  const fetchProjects = useCallback(async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'active');

    if (error) {
      console.error('Error fetching projects:', error);
      return;
    }

    setProjects(data as Project[]);
  }, []);

  const fetchEntries = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('time_entries')
      .select(`
        *,
        projects(name)
      `)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching entries:', error);
      return;
    }

    const formattedEntries = data.map((entry: TimeEntry & { projects: { name: string } | null }) => ({
      ...entry,
      project_name: entry.projects?.name || 'No Project',
    }));

    setEntries(formattedEntries);
  }, [user]);

  const fetchTimesheets = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('timesheets')
      .select('*')
      .order('week_start_date', { ascending: false });

    if (error) {
      console.error('Error fetching timesheets:', error);
      return;
    }

    setTimesheets(data as Timesheet[]);
  }, [user]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchProfile(), fetchProjects(), fetchEntries(), fetchTimesheets()]);
    setLoading(false);
  }, [fetchProfile, fetchProjects, fetchEntries, fetchTimesheets]);

  useEffect(() => {
    if (user) {
      fetchAll();
    }
  }, [user, fetchAll]);

  // Real-time subscriptions for timesheets and time entries
  useEffect(() => {
    if (!user) return;

    // Subscribe to timesheet changes
    const timesheetsChannel = supabase
      .channel('timesheets-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'timesheets',
        },
        (payload) => {
          console.log('Timesheet change received:', payload);

          if (payload.eventType === 'UPDATE') {
            const updated = payload.new as Timesheet;
            setTimesheets((prev) =>
              prev.map((ts) => (ts.id === updated.id ? updated : ts))
            );

            // Show toast for status changes
            if (updated.status === 'approved') {
              toast({
                title: 'Timesheet Approved',
                description: 'A timesheet has been approved.',
              });
            } else if (updated.status === 'rejected') {
              toast({
                title: 'Timesheet Rejected',
                description: updated.rejection_reason || 'A timesheet has been rejected.',
                variant: 'destructive',
              });
            }
          } else if (payload.eventType === 'INSERT') {
            setTimesheets((prev) => [payload.new as Timesheet, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            const deleted = payload.old as { id: string };
            setTimesheets((prev) => prev.filter((ts) => ts.id !== deleted.id));
          }
        }
      )
      .subscribe();

    // Subscribe to time entry changes
    const entriesChannel = supabase
      .channel('time-entries-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'time_entries',
        },
        (payload) => {
          console.log('Time entry change received:', payload);

          if (payload.eventType === 'UPDATE') {
            const updated = payload.new as TimeEntry;
            setEntries((prev) =>
              prev.map((e) => (e.id === updated.id ? { ...updated, project_name: e.project_name } : e))
            );
          } else if (payload.eventType === 'INSERT') {
            // Refetch to get project name join
            fetchEntries();
          } else if (payload.eventType === 'DELETE') {
            const deleted = payload.old as { id: string };
            setEntries((prev) => prev.filter((e) => e.id !== deleted.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(timesheetsChannel);
      supabase.removeChannel(entriesChannel);
    };
  }, [user, fetchEntries]);

  const addEntry = async (entryData: Partial<TimeEntry>) => {
    if (!user) return;

    const { error } = await supabase.from('time_entries').insert({
      user_id: user.id,
      project_id: entryData.project_id,
      date: entryData.date,
      hours_worked: entryData.hours_worked,
      overtime_hours: entryData.overtime_hours || 0,
      description: entryData.description,
      clock_in: entryData.clock_in,
      clock_out: entryData.clock_out,
      break_minutes: entryData.break_minutes || 0,
      status: 'draft',
    });

    if (error) {
      toast({
        title: 'Error adding entry',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Entry added',
      description: 'Your time entry has been saved.',
    });

    await fetchEntries();
  };

  const updateEntry = async (id: string, entryData: Partial<TimeEntry>) => {
    const { error } = await supabase
      .from('time_entries')
      .update({
        project_id: entryData.project_id,
        date: entryData.date,
        hours_worked: entryData.hours_worked,
        overtime_hours: entryData.overtime_hours,
        description: entryData.description,
        clock_in: entryData.clock_in,
        clock_out: entryData.clock_out,
        break_minutes: entryData.break_minutes,
      })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error updating entry',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Entry updated',
      description: 'Your time entry has been updated.',
    });

    await fetchEntries();
  };

  const deleteEntry = async (id: string) => {
    const { error } = await supabase.from('time_entries').delete().eq('id', id);

    if (error) {
      toast({
        title: 'Error deleting entry',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Entry deleted',
      description: 'Your time entry has been removed.',
    });

    await fetchEntries();
  };

  const submitWeek = async (selectedDate: Date) => {
    if (!user) return;

    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });

    const weekEntries = entries.filter((e) => {
      const entryDate = new Date(e.date);
      return (
        entryDate >= weekStart &&
        entryDate <= weekEnd &&
        e.user_id === user.id &&
        e.status === 'draft'
      );
    });

    if (weekEntries.length === 0) {
      toast({
        title: 'No entries to submit',
        description: 'Add some time entries first.',
        variant: 'destructive',
      });
      return;
    }

    // Update entries to submitted
    const { error: updateError } = await supabase
      .from('time_entries')
      .update({ status: 'submitted' })
      .in(
        'id',
        weekEntries.map((e) => e.id)
      );

    if (updateError) {
      toast({
        title: 'Error submitting entries',
        description: updateError.message,
        variant: 'destructive',
      });
      return;
    }

    // Calculate totals
    const totalHours = weekEntries.reduce((sum, e) => sum + Number(e.hours_worked), 0);
    const overtimeHours = weekEntries.reduce((sum, e) => sum + Number(e.overtime_hours || 0), 0);

    // Create or update timesheet
    const { error: timesheetError } = await supabase.from('timesheets').insert({
      user_id: user.id,
      week_start_date: format(weekStart, 'yyyy-MM-dd'),
      week_end_date: format(weekEnd, 'yyyy-MM-dd'),
      total_hours: totalHours,
      overtime_hours: overtimeHours,
      status: 'submitted',
      submitted_at: new Date().toISOString(),
    });

    if (timesheetError) {
      console.error('Error creating timesheet:', timesheetError);
    }

    toast({
      title: 'Timesheet submitted',
      description: 'Your timesheet has been submitted for approval.',
    });

    await fetchAll();
  };

  const approveTimesheet = async (timesheetId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('timesheets')
      .update({
        status: 'approved',
        approved_by: user.id,
        approved_at: new Date().toISOString(),
      })
      .eq('id', timesheetId);

    if (error) {
      toast({
        title: 'Error approving timesheet',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Timesheet approved',
      description: 'The timesheet has been approved.',
    });

    await fetchTimesheets();
  };

  const rejectTimesheet = async (timesheetId: string, reason: string) => {
    const { error } = await supabase
      .from('timesheets')
      .update({
        status: 'rejected',
        rejection_reason: reason,
      })
      .eq('id', timesheetId);

    if (error) {
      toast({
        title: 'Error rejecting timesheet',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Timesheet rejected',
      description: 'The timesheet has been rejected.',
      variant: 'destructive',
    });

    await fetchTimesheets();
  };

  return {
    entries,
    timesheets,
    projects,
    profile,
    loading,
    addEntry,
    updateEntry,
    deleteEntry,
    submitWeek,
    approveTimesheet,
    rejectTimesheet,
    refetch: fetchAll,
  };
}
