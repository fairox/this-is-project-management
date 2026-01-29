import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, TrendingUp, Calendar, CheckCircle } from 'lucide-react';
import { TimeEntry, Timesheet } from '@/types/timesheet';

interface TimesheetSummaryProps {
  entries: TimeEntry[];
  timesheets: Timesheet[];
  weeklyTarget?: number;
}

export function TimesheetSummary({
  entries,
  timesheets,
  weeklyTarget = 40,
}: TimesheetSummaryProps) {
  const totalHoursThisWeek = entries.reduce((sum, e) => sum + e.hoursWorked, 0);
  const totalOvertimeThisWeek = entries.reduce((sum, e) => sum + (e.overtime || 0), 0);
  const approvedTimesheets = timesheets.filter((ts) => ts.status === 'approved').length;
  const pendingTimesheets = timesheets.filter((ts) => ts.status === 'submitted').length;
  
  const progressPercentage = Math.min((totalHoursThisWeek / weeklyTarget) * 100, 100);

  const stats = [
    {
      title: 'Hours This Week',
      value: `${totalHoursThisWeek.toFixed(1)}h`,
      subtitle: `of ${weeklyTarget}h target`,
      icon: Clock,
      progress: progressPercentage,
    },
    {
      title: 'Overtime',
      value: `${totalOvertimeThisWeek.toFixed(1)}h`,
      subtitle: 'This week',
      icon: TrendingUp,
      badge: totalOvertimeThisWeek > 0 ? 'warning' : null,
    },
    {
      title: 'Pending Approval',
      value: pendingTimesheets,
      subtitle: 'Timesheets awaiting review',
      icon: Calendar,
      badge: pendingTimesheets > 0 ? 'info' : null,
    },
    {
      title: 'Approved',
      value: approvedTimesheets,
      subtitle: 'Timesheets this month',
      icon: CheckCircle,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.badge && (
                <Badge
                  variant={stat.badge === 'warning' ? 'destructive' : 'secondary'}
                  className="text-xs"
                >
                  {stat.badge === 'warning' ? 'OT' : 'Pending'}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
            {stat.progress !== undefined && (
              <Progress value={stat.progress} className="mt-2 h-2" />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
