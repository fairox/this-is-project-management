-- Create FIDIC role enum
CREATE TYPE public.fidic_role AS ENUM ('engineer', 'contractor', 'project_architect', 'employer');

-- Create user_roles table for proper role management (security best practice)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role fidic_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles without recursion
CREATE OR REPLACE FUNCTION public.has_fidic_role(_user_id UUID, _role fidic_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Engineers and Employers can view all roles"
  ON public.user_roles FOR SELECT
  USING (
    has_fidic_role(auth.uid(), 'engineer') OR 
    has_fidic_role(auth.uid(), 'employer')
  );

-- Contracts table
CREATE TABLE public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  contract_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  contractor_id UUID REFERENCES auth.users(id),
  engineer_id UUID REFERENCES auth.users(id),
  employer_id UUID REFERENCES auth.users(id),
  accepted_contract_amount NUMERIC(15,2) NOT NULL,
  advance_payment_percentage NUMERIC(5,2) DEFAULT 0,
  retention_percentage NUMERIC(5,2) DEFAULT 5,
  delay_damages_rate NUMERIC(5,3) DEFAULT 0.1,
  delay_damages_cap_percentage NUMERIC(5,2) DEFAULT 10,
  time_for_completion INTEGER NOT NULL, -- days
  commencement_date DATE,
  completion_date DATE,
  actual_completion_date DATE,
  taking_over_date DATE,
  defects_notification_period INTEGER DEFAULT 365, -- days
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'terminated')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- Claims table (FIDIC Clause 20)
CREATE TABLE public.claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE NOT NULL,
  claim_number TEXT NOT NULL,
  claimant_type TEXT NOT NULL CHECK (claimant_type IN ('contractor', 'employer')),
  submitted_by UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  clause_reference TEXT,
  notice_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  detailed_claim_due_date TIMESTAMP WITH TIME ZONE, -- 84 days from notice
  detailed_claim_submitted_at TIMESTAMP WITH TIME ZONE,
  amount_claimed NUMERIC(15,2),
  time_extension_days INTEGER,
  status TEXT NOT NULL DEFAULT 'notice_submitted' CHECK (status IN (
    'notice_submitted', 'detailed_claim_pending', 'detailed_claim_submitted',
    'under_review', 'partially_approved', 'approved', 'rejected', 'time_barred', 'withdrawn'
  )),
  engineer_determination TEXT,
  determination_date TIMESTAMP WITH TIME ZONE,
  amount_approved NUMERIC(15,2),
  time_approved_days INTEGER,
  is_time_barred BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(contract_id, claim_number)
);

ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;

-- Document submissions table (FIDIC Clause 5)
CREATE TABLE public.document_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN (
    'shop_drawing', 'method_statement', 'quality_plan', 'safety_plan',
    'material_approval', 'equipment_approval', 'as_built', 'other'
  )),
  reference_number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  submitted_by UUID REFERENCES auth.users(id) NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  review_deadline TIMESTAMP WITH TIME ZONE, -- 21 days from submission
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN (
    'submitted', 'under_review', 'approved', 'approved_with_comments',
    'rejected', 'no_objection', 'superseded'
  )),
  review_comments TEXT,
  revision_number INTEGER DEFAULT 1,
  parent_submission_id UUID REFERENCES public.document_submissions(id),
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.document_submissions ENABLE ROW LEVEL SECURITY;

-- Disagreements/Disputes table (FIDIC Clause 3.7)
CREATE TABLE public.disagreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE NOT NULL,
  claim_id UUID REFERENCES public.claims(id),
  reference_number TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT,
  raised_by UUID REFERENCES auth.users(id) NOT NULL,
  raised_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  agreement_deadline TIMESTAMP WITH TIME ZONE, -- 42 days
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN (
    'open', 'under_discussion', 'agreement_reached', 'determination_pending',
    'determination_issued', 'referred_to_dab', 'resolved'
  )),
  engineer_determination TEXT,
  determination_date TIMESTAMP WITH TIME ZONE,
  resolution_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(contract_id, reference_number)
);

ALTER TABLE public.disagreements ENABLE ROW LEVEL SECURITY;

-- Contract notices table (general correspondence)
CREATE TABLE public.contract_notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE NOT NULL,
  notice_type TEXT NOT NULL CHECK (notice_type IN (
    'instruction', 'variation', 'suspension', 'termination_warning',
    'extension_of_time', 'taking_over', 'performance_certificate', 'general'
  )),
  reference_number TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT,
  clause_reference TEXT,
  issued_by UUID REFERENCES auth.users(id) NOT NULL,
  issued_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  response_required BOOLEAN DEFAULT FALSE,
  response_deadline TIMESTAMP WITH TIME ZONE,
  acknowledged_by UUID REFERENCES auth.users(id),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contract_notices ENABLE ROW LEVEL SECURITY;

-- RLS Policies for contracts
CREATE POLICY "Contractors can view their contracts"
  ON public.contracts FOR SELECT
  USING (auth.uid() = contractor_id);

CREATE POLICY "Engineers can view assigned contracts"
  ON public.contracts FOR SELECT
  USING (auth.uid() = engineer_id);

CREATE POLICY "Employers can view their contracts"
  ON public.contracts FOR SELECT
  USING (auth.uid() = employer_id);

CREATE POLICY "Engineers can manage contracts"
  ON public.contracts FOR ALL
  USING (has_fidic_role(auth.uid(), 'engineer') OR has_fidic_role(auth.uid(), 'employer'));

-- RLS Policies for claims
CREATE POLICY "Contract parties can view claims"
  ON public.claims FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.contracts c
      WHERE c.id = contract_id
      AND (c.contractor_id = auth.uid() OR c.engineer_id = auth.uid() OR c.employer_id = auth.uid())
    )
  );

CREATE POLICY "Contractors can submit claims"
  ON public.claims FOR INSERT
  WITH CHECK (
    has_fidic_role(auth.uid(), 'contractor') AND submitted_by = auth.uid()
  );

CREATE POLICY "Engineers can update claims"
  ON public.claims FOR UPDATE
  USING (has_fidic_role(auth.uid(), 'engineer'));

-- RLS Policies for document submissions
CREATE POLICY "Contract parties can view documents"
  ON public.document_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.contracts c
      WHERE c.id = contract_id
      AND (c.contractor_id = auth.uid() OR c.engineer_id = auth.uid() OR c.employer_id = auth.uid())
    )
  );

CREATE POLICY "Contractors can submit documents"
  ON public.document_submissions FOR INSERT
  WITH CHECK (has_fidic_role(auth.uid(), 'contractor') AND submitted_by = auth.uid());

CREATE POLICY "Engineers can review documents"
  ON public.document_submissions FOR UPDATE
  USING (has_fidic_role(auth.uid(), 'engineer') OR has_fidic_role(auth.uid(), 'project_architect'));

-- RLS Policies for disagreements
CREATE POLICY "Contract parties can view disagreements"
  ON public.disagreements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.contracts c
      WHERE c.id = contract_id
      AND (c.contractor_id = auth.uid() OR c.engineer_id = auth.uid() OR c.employer_id = auth.uid())
    )
  );

CREATE POLICY "Parties can raise disagreements"
  ON public.disagreements FOR INSERT
  WITH CHECK (raised_by = auth.uid());

CREATE POLICY "Engineers can update disagreements"
  ON public.disagreements FOR UPDATE
  USING (has_fidic_role(auth.uid(), 'engineer'));

-- RLS Policies for notices
CREATE POLICY "Contract parties can view notices"
  ON public.contract_notices FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.contracts c
      WHERE c.id = contract_id
      AND (c.contractor_id = auth.uid() OR c.engineer_id = auth.uid() OR c.employer_id = auth.uid())
    )
  );

CREATE POLICY "Engineers can issue notices"
  ON public.contract_notices FOR INSERT
  WITH CHECK (has_fidic_role(auth.uid(), 'engineer') AND issued_by = auth.uid());

-- Triggers for updated_at
CREATE TRIGGER update_contracts_updated_at
  BEFORE UPDATE ON public.contracts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_claims_updated_at
  BEFORE UPDATE ON public.claims
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_document_submissions_updated_at
  BEFORE UPDATE ON public.document_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_disagreements_updated_at
  BEFORE UPDATE ON public.disagreements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-set claim deadlines trigger
CREATE OR REPLACE FUNCTION public.set_claim_deadlines()
RETURNS TRIGGER AS $$
BEGIN
  -- Set 84-day deadline for detailed claim
  NEW.detailed_claim_due_date := NEW.notice_date + INTERVAL '84 days';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER set_claim_deadlines_trigger
  BEFORE INSERT ON public.claims
  FOR EACH ROW EXECUTE FUNCTION public.set_claim_deadlines();

-- Auto-set document review deadline trigger
CREATE OR REPLACE FUNCTION public.set_document_review_deadline()
RETURNS TRIGGER AS $$
BEGIN
  -- Set 21-day review deadline
  NEW.review_deadline := NEW.submitted_at + INTERVAL '21 days';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER set_document_review_deadline_trigger
  BEFORE INSERT ON public.document_submissions
  FOR EACH ROW EXECUTE FUNCTION public.set_document_review_deadline();

-- Auto-set disagreement agreement deadline trigger
CREATE OR REPLACE FUNCTION public.set_disagreement_deadline()
RETURNS TRIGGER AS $$
BEGIN
  -- Set 42-day agreement deadline
  NEW.agreement_deadline := NEW.raised_at + INTERVAL '42 days';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER set_disagreement_deadline_trigger
  BEFORE INSERT ON public.disagreements
  FOR EACH ROW EXECUTE FUNCTION public.set_disagreement_deadline();

-- Enable realtime for contract administration tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.contracts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.claims;
ALTER PUBLICATION supabase_realtime ADD TABLE public.document_submissions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.disagreements;
ALTER PUBLICATION supabase_realtime ADD TABLE public.contract_notices;