export type FidicRole = 'engineer' | 'contractor' | 'project_architect' | 'employer';

export interface UserRole {
  id: string;
  user_id: string;
  role: FidicRole;
  created_at: string;
}

export interface Contract {
  id: string;
  project_id: string | null;
  contract_number: string;
  title: string;
  contractor_id: string | null;
  engineer_id: string | null;
  employer_id: string | null;
  accepted_contract_amount: number;
  advance_payment_percentage: number;
  retention_percentage: number;
  delay_damages_rate: number;
  delay_damages_cap_percentage: number;
  time_for_completion: number;
  commencement_date: string | null;
  completion_date: string | null;
  actual_completion_date: string | null;
  taking_over_date: string | null;
  defects_notification_period: number;
  status: 'draft' | 'active' | 'completed' | 'terminated';
  created_at: string;
  updated_at: string;
  // Joined data
  project_name?: string;
  contractor_name?: string;
  engineer_name?: string;
}

export type ClaimStatus = 
  | 'notice_submitted'
  | 'detailed_claim_pending'
  | 'detailed_claim_submitted'
  | 'under_review'
  | 'partially_approved'
  | 'approved'
  | 'rejected'
  | 'time_barred'
  | 'withdrawn';

export interface Claim {
  id: string;
  contract_id: string;
  claim_number: string;
  claimant_type: 'contractor' | 'employer';
  submitted_by: string;
  title: string;
  description: string | null;
  clause_reference: string | null;
  notice_date: string;
  detailed_claim_due_date: string | null;
  detailed_claim_submitted_at: string | null;
  amount_claimed: number | null;
  time_extension_days: number | null;
  status: ClaimStatus;
  engineer_determination: string | null;
  determination_date: string | null;
  amount_approved: number | null;
  time_approved_days: number | null;
  is_time_barred: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  contract_title?: string;
  submitter_name?: string;
}

export type DocumentType = 
  | 'shop_drawing'
  | 'method_statement'
  | 'quality_plan'
  | 'safety_plan'
  | 'material_approval'
  | 'equipment_approval'
  | 'as_built'
  | 'other';

export type DocumentStatus = 
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'approved_with_comments'
  | 'rejected'
  | 'no_objection'
  | 'superseded';

export interface DocumentSubmission {
  id: string;
  contract_id: string;
  document_type: DocumentType;
  reference_number: string;
  title: string;
  description: string | null;
  submitted_by: string;
  submitted_at: string;
  review_deadline: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  status: DocumentStatus;
  review_comments: string | null;
  revision_number: number;
  parent_submission_id: string | null;
  file_url: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  contract_title?: string;
  submitter_name?: string;
  reviewer_name?: string;
}

export type DisagreementStatus = 
  | 'open'
  | 'under_discussion'
  | 'agreement_reached'
  | 'determination_pending'
  | 'determination_issued'
  | 'referred_to_dab'
  | 'resolved';

export interface Disagreement {
  id: string;
  contract_id: string;
  claim_id: string | null;
  reference_number: string;
  subject: string;
  description: string | null;
  raised_by: string;
  raised_at: string;
  agreement_deadline: string | null;
  status: DisagreementStatus;
  engineer_determination: string | null;
  determination_date: string | null;
  resolution_summary: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  contract_title?: string;
  raiser_name?: string;
}

export type NoticeType = 
  | 'instruction'
  | 'variation'
  | 'suspension'
  | 'termination_warning'
  | 'extension_of_time'
  | 'taking_over'
  | 'performance_certificate'
  | 'general';

export interface ContractNotice {
  id: string;
  contract_id: string;
  notice_type: NoticeType;
  reference_number: string;
  subject: string;
  content: string | null;
  clause_reference: string | null;
  issued_by: string;
  issued_at: string;
  response_required: boolean;
  response_deadline: string | null;
  acknowledged_by: string | null;
  acknowledged_at: string | null;
  created_at: string;
  // Joined data
  contract_title?: string;
  issuer_name?: string;
}
