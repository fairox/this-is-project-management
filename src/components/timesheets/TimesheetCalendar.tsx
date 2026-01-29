import { useState } from 'react';
import { format, startOfWeek, endOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { TimeEntry, ViewMode } from '@/types/timesheet';
import { cn } from '@/lib/utils';

interface TimesheetCalendarProps {
  entries: TimeEntry[];
  viewMode: ViewMode;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onAddEntry: (date: Date) => void;
  onEditEntry: (entry: TimeEntry) => void;
}

export function TimesheetCalendar({
  entries,
  viewMode,
  selectedDate,
  onDateChange,
  onAddEntry,
  onEditEntry,
}: TimesheetCalendarProps) {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getEntriesForDate = (date: Date) => {
    return entries.filter((entry) => isSameDay(parseISO(entry.date), date));
  };

  const getTotalHoursForDate = (date: Date) => {
    return getEntriesForDate(date).reduce((sum, e) => sum + e.hoursWorked, 0);
  };

  const getStatusColor = (status: TimeEntry['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'submitted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const days = direction === 'prev' ? -7 : 7;
    onDateChange(addDays(selectedDate, days));
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    const days = direction === 'prev' ? -1 : 1;
    onDateChange(addDays(selectedDate, days));
  };

  if (viewMode === 'daily') {
    const dayEntries = getEntriesForDate(selectedDate);
    const totalHours = getTotalHoursForDate(selectedDate);

    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => navigateDay('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="text-lg">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </CardTitle>
              <Button variant="outline" size="icon" onClick={() => navigateDay('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                {totalHours} hours
              </Badge>
              <Button size="sm" onClick={() => onAddEntry(selectedDate)}>
                <Plus className="h-4 w-4 mr-1" />
                Add Entry
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {dayEntries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No time entries for this day</p>
              <Button variant="link" onClick={() => onAddEntry(selectedDate)}>
                Add your first entry
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {dayEntries.map((entry) => (
                <div
                  key={entry.id}
                  onClick={() => onEditEntry(entry)}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="font-medium">{entry.projectName}</div>
                      <div className="text-sm text-muted-foreground">{entry.description}</div>
                      {entry.clockIn && entry.clockOut && (
                        <div className="text-xs text-muted-foreground">
                          {entry.clockIn} - {entry.clockOut}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge className={cn('text-xs', getStatusColor(entry.status))}>
                        {entry.status}
                      </Badge>
                      <span className="text-sm font-medium">{entry.hoursWorked}h</span>
                      {entry.overtime && entry.overtime > 0 && (
                        <span className="text-xs text-orange-600">+{entry.overtime}h OT</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Weekly view
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigateWeek('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-lg">
              {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
            </CardTitle>
            <Button variant="outline" size="icon" onClick={() => navigateWeek('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Badge variant="secondary" className="text-sm">
            {entries.reduce((sum, e) => sum + e.hoursWorked, 0)} total hours
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const dayEntries = getEntriesForDate(day);
            const totalHours = getTotalHoursForDate(day);
            const isToday = isSameDay(day, new Date());
            const isSelected = isSameDay(day, selectedDate);

            return (
              <div
                key={day.toISOString()}
                onClick={() => onDateChange(day)}
                className={cn(
                  'p-3 border rounded-lg cursor-pointer transition-colors min-h-[120px]',
                  isToday && 'border-primary',
                  isSelected && 'bg-muted',
                  'hover:bg-muted/50'
                )}
              >
                <div className="text-center mb-2">
                  <div className="text-xs text-muted-foreground">
                    {format(day, 'EEE')}
                  </div>
                  <div className={cn('text-lg font-medium', isToday && 'text-primary')}>
                    {format(day, 'd')}
                  </div>
                </div>
                {totalHours > 0 && (
                  <div className="text-center">
                    <Badge variant="outline" className="text-xs">
                      {totalHours}h
                    </Badge>
                  </div>
                )}
                <div className="mt-2 space-y-1">
                  {dayEntries.slice(0, 2).map((entry) => (
                    <div
                      key={entry.id}
                      className={cn(
                        'text-xs p-1 rounded truncate',
                        getStatusColor(entry.status)
                      )}
                    >
                      {entry.projectName}
                    </div>
                  ))}
                  {dayEntries.length > 2 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{dayEntries.length - 2} more
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2 h-6 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddEntry(day);
                  }}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
