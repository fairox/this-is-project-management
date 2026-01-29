import { Project, Inspection, Document } from '@/types';

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Office Tower Development',
    status: 'active',
    vettingStatus: 'approved',
    progress: 75,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    budget: 5000000,
    description: 'Modern office tower in downtown area',
    priority: 'high',
    hasRequiredPermits: 'yes',
    reviewNotes: 'Project approved. All requirements met.',
    reviewedBy: 'John Smith',
    reviewDate: '2024-03-15',
    comments: [
      {
        id: '1',
        projectId: '1',
        userId: 'user1',
        userName: 'John Doe',
        content: 'Foundation work completed ahead of schedule',
        timestamp: '2024-03-15T10:00:00Z',
      },
      {
        id: '2',
        projectId: '1',
        userId: 'user2',
        userName: 'Jane Smith',
        content: "Weather conditions might affect next week's timeline",
        timestamp: '2024-03-16T14:30:00Z',
      },
    ],
    tasks: [
      {
        id: '1',
        projectId: '1',
        title: 'Complete foundation inspection',
        status: 'completed',
        assignedTo: 'John Doe',
        dueDate: '2024-03-20',
        priority: 'high',
      },
      {
        id: '2',
        projectId: '1',
        title: 'Start electrical wiring',
        status: 'in-progress',
        assignedTo: 'Sarah Wilson',
        dueDate: '2024-04-15',
        priority: 'medium',
      },
    ],
  },
  {
    id: '2',
    name: 'Retail Complex Phase 1',
    status: 'active',
    vettingStatus: 'under-review',
    progress: 45,
    startDate: '2024-02-15',
    endDate: '2024-08-15',
    budget: 3000000,
    description: 'Shopping complex with parking facilities',
    priority: 'medium',
    hasRequiredPermits: 'pending',
    reviewNotes: 'Reviewing parking layout and permit requirements',
    reviewedBy: 'Jane Wilson',
    reviewDate: '2024-03-14',
    comments: [
      {
        id: '3',
        projectId: '2',
        userId: 'user3',
        userName: 'Mike Johnson',
        content: 'Parking layout needs revision',
        timestamp: '2024-03-14T09:00:00Z',
      },
    ],
    tasks: [
      {
        id: '3',
        projectId: '2',
        title: 'Review parking layout',
        status: 'todo',
        assignedTo: 'Mike Johnson',
        dueDate: '2024-03-25',
        priority: 'high',
      },
    ],
  },
];

export const mockInspections: Inspection[] = [
  {
    id: '1',
    projectId: '1',
    type: 'quality',
    status: 'pending',
    date: '2024-03-15',
    inspector: 'John Doe',
    notes: 'Scheduled quality inspection for foundation work',
  },
  {
    id: '2',
    projectId: '2',
    type: 'safety',
    status: 'completed',
    date: '2024-03-10',
    inspector: 'Jane Smith',
    notes: 'Safety protocols verified and approved',
  },
];

export const mockDocuments: Document[] = [
  {
    id: '1',
    projectId: '1',
    name: 'Building Permit',
    type: 'permit',
    uploadDate: '2024-01-15',
    size: 2500000,
    url: '/documents/permit-123.pdf',
    status: 'active'
  },
  {
    id: '2',
    projectId: '2',
    name: 'Site Plans',
    type: 'drawing',
    uploadDate: '2024-02-01',
    size: 5000000,
    url: '/documents/plans-456.pdf',
    status: 'active'
  },
];
