export interface Project {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'on-hold';
  vettingStatus: 'pending' | 'under-review' | 'approved' | 'rejected';
  progress: number;
  startDate: string;
  endDate: string;
  budget: number;
  description: string;
  priority: 'low' | 'medium' | 'high';
  hasRequiredPermits: 'yes' | 'no' | 'pending';
  comments?: Comment[];
  tasks?: Task[];
  reviewNotes?: string;
  reviewedBy?: string;
  reviewDate?: string;
  auditTrail?: AuditEntry[];
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  changes: {
    field: string;
    oldValue: unknown;
    newValue: unknown;
  }[];
}

export interface Comment {
  id: string;
  projectId: string;
  userId: string;
  content: string;
  timestamp: string;
  userName: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  status: 'todo' | 'in-progress' | 'completed';
  assignedTo: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Inspection {
  id: string;
  projectId: string;
  type: 'quality' | 'safety' | 'regulatory';
  status: 'pending' | 'completed' | 'failed';
  date: string;
  inspector: string;
  notes: string;
}

export interface Document {
  id: string;
  projectId: string;
  name: string;
  type: 'contract' | 'permit' | 'drawing' | 'report';
  uploadDate: string;
  size: number;
  url: string;
  version?: string;
  classification?: 'confidential' | 'internal' | 'public';
  expiryDate?: string;
  signatures?: Signature[];
  status: 'active' | 'archived' | 'expired';
}

export interface Signature {
  id: string;
  userId: string;
  userName: string;
  timestamp: string;
  status: 'pending' | 'signed' | 'rejected';
}

export interface Stakeholder {
  id: string;
  name: string;
  role: 'developer' | 'contractor' | 'authority' | 'supervisor' | 'architect' | 'engineer';
  organization: string;
  email: string;
  phone: string;
  projects: string[];
  status: 'active' | 'inactive';
  onboardingStatus: 'pending' | 'in-progress' | 'completed';
  lastContact: string;
  notes: string;
}

export interface StakeholderCommunication {
  id: string;
  stakeholderId: string;
  projectId: string;
  type: 'meeting' | 'email' | 'call' | 'site-visit';
  date: string;
  summary: string;
  nextSteps?: string;
  attachments?: string[];
}
