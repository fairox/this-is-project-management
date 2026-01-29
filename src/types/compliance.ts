
export interface ComplianceCheck {
  id: string;
  category: 'building' | 'environmental' | 'safety' | 'zoning';
  status: 'compliant' | 'non-compliant' | 'pending';
  title: string;
  description: string;
  dueDate: string;
  lastChecked: string;
  assignedTo: string;
  requirements: string[];
  notes?: string;
}

export interface PermitRequirement {
  id: string;
  type: 'building' | 'environmental' | 'zoning' | 'safety';
  status: 'approved' | 'pending' | 'rejected';
  submissionDate: string;
  expiryDate: string;
  description: string;
  conditions?: string[];
  documents: string[];
}

export interface ComplianceReport {
  id: string;
  date: string;
  type: 'monthly' | 'quarterly' | 'annual';
  summary: string;
  findings: {
    category: string;
    status: 'pass' | 'fail' | 'warning';
    details: string;
  }[];
  recommendations: string[];
}
