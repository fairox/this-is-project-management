export interface TimeEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  projectId: string;
  projectName: string;
  date: string;
  hoursWorked: number;
  description: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  clockIn?: string;
  clockOut?: string;
  breakMinutes?: number;
  overtime?: number;
}

export interface Timesheet {
  id: string;
  employeeId: string;
  employeeName: string;
  weekStartDate: string;
  weekEndDate: string;
  entries: TimeEntry[];
  totalHours: number;
  overtimeHours: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submittedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  hourlyRate: number;
}

export type ViewMode = 'daily' | 'weekly';
