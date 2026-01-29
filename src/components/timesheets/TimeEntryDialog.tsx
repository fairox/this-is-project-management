import { useEffect } from 'react';
import { format } from 'date-fns';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TimeEntry } from '@/types/timesheet';

const timeEntrySchema = z.object({
  projectId: z.string().min(1, 'Please select a project'),
  clockIn: z.string().min(1, 'Clock in time is required'),
  clockOut: z.string().min(1, 'Clock out time is required'),
  breakMinutes: z.coerce.number().min(0).max(480),
  description: z.string().optional(),
});

type TimeEntryFormData = z.infer<typeof timeEntrySchema>;

interface Project {
  id: string;
  name: string;
}

interface TimeEntryDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (entry: unknown) => void;
  entry?: TimeEntry | null;
  selectedDate: Date;
  projects?: Project[];
}

export function TimeEntryDialog({
  open,
  onClose,
  onSave,
  entry,
  selectedDate,
  projects = [],
}: TimeEntryDialogProps) {
  const form = useForm<TimeEntryFormData>({
    resolver: zodResolver(timeEntrySchema),
    defaultValues: {
      projectId: '',
      clockIn: '09:00',
      clockOut: '17:00',
      breakMinutes: 60,
      description: '',
    },
  });

  useEffect(() => {
    if (entry) {
      form.reset({
        projectId: entry.projectId,
        clockIn: entry.clockIn || '09:00',
        clockOut: entry.clockOut || '17:00',
        breakMinutes: entry.breakMinutes || 60,
        description: entry.description,
      });
    } else {
      form.reset({
        projectId: '',
        clockIn: '09:00',
        clockOut: '17:00',
        breakMinutes: 60,
        description: '',
      });
    }
  }, [entry, form, open]);

  const calculateHours = (clockIn: string, clockOut: string, breakMinutes: number): number => {
    const [inHour, inMin] = clockIn.split(':').map(Number);
    const [outHour, outMin] = clockOut.split(':').map(Number);
    const totalMinutes = (outHour * 60 + outMin) - (inHour * 60 + inMin) - breakMinutes;
    return Math.max(0, totalMinutes / 60);
  };

  const onSubmit = (data: TimeEntryFormData) => {
    const hoursWorked = calculateHours(data.clockIn, data.clockOut, data.breakMinutes);
    const overtime = Math.max(0, hoursWorked - 8);

    onSave({
      project_id: data.projectId,
      date: format(selectedDate, 'yyyy-MM-dd'),
      clock_in: data.clockIn,
      clock_out: data.clockOut,
      break_minutes: data.breakMinutes,
      hours_worked: Math.round(hoursWorked * 10) / 10,
      overtime_hours: Math.round(overtime * 10) / 10,
      description: data.description || '',
    });
    onClose();
  };

  const watchedValues = form.watch();
  const previewHours = calculateHours(
    watchedValues.clockIn || '09:00',
    watchedValues.clockOut || '17:00',
    watchedValues.breakMinutes || 60
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {entry ? 'Edit Time Entry' : 'Add Time Entry'}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </p>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="clockIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clock In</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clockOut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clock Out</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="breakMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Break (min)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} max={480} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="bg-muted p-3 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Calculated Hours:</span>
                <span className="font-medium">{previewHours.toFixed(1)}h</span>
              </div>
              {previewHours > 8 && (
                <div className="flex justify-between text-sm text-orange-600">
                  <span>Overtime:</span>
                  <span className="font-medium">{(previewHours - 8).toFixed(1)}h</span>
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What did you work on?"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {entry ? 'Update' : 'Add'} Entry
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
