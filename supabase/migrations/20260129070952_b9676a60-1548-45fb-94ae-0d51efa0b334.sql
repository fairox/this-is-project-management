-- Create inspections table for live inspection data
CREATE TABLE public.inspections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('safety', 'structural', 'electrical', 'plumbing', 'fire', 'quality', 'regulatory')),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'failed', 'cancelled')),
  scheduled_date DATE NOT NULL,
  completed_date DATE,
  inspector_id UUID,
  inspector_name TEXT NOT NULL,
  notes TEXT,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  location TEXT,
  checklist_items JSONB DEFAULT '[]'::jsonb,
  photos TEXT[] DEFAULT '{}',
  pass_rate NUMERIC(5,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_inspections_project ON public.inspections(project_id);
CREATE INDEX idx_inspections_scheduled_date ON public.inspections(scheduled_date);
CREATE INDEX idx_inspections_status ON public.inspections(status);
CREATE INDEX idx_inspections_type ON public.inspections(type);

-- Enable Row Level Security
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for inspections
CREATE POLICY "Authenticated users can view inspections"
  ON public.inspections FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Managers and admins can create inspections"
  ON public.inspections FOR INSERT
  WITH CHECK (public.is_app_manager_or_admin(auth.uid()));

CREATE POLICY "Managers and admins can update inspections"
  ON public.inspections FOR UPDATE
  USING (public.is_app_manager_or_admin(auth.uid()));

CREATE POLICY "Admins can delete inspections"
  ON public.inspections FOR DELETE
  USING (public.is_app_admin(auth.uid()));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_inspections_updated_at
  BEFORE UPDATE ON public.inspections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample inspection data for demonstration
INSERT INTO public.inspections (type, status, scheduled_date, inspector_name, notes, priority, location, pass_rate) VALUES
  ('safety', 'completed', CURRENT_DATE - INTERVAL '3 days', 'Sarah Chen', 'All safety protocols verified', 'high', 'Building A - Floor 3', 100),
  ('structural', 'in_progress', CURRENT_DATE, 'Mike Johnson', 'Foundation inspection ongoing', 'high', 'Building B - Foundation', 59),
  ('electrical', 'scheduled', CURRENT_DATE + INTERVAL '2 days', 'Tom Wilson', 'Electrical systems check', 'medium', 'Building A - All Floors', NULL),
  ('plumbing', 'scheduled', CURRENT_DATE + INTERVAL '5 days', 'Lisa Park', 'Plumbing installation review', 'medium', 'Building C - Basement', NULL),
  ('fire', 'completed', CURRENT_DATE - INTERVAL '7 days', 'David Brown', 'Fire safety equipment tested', 'high', 'All Buildings', 94),
  ('quality', 'completed', CURRENT_DATE - INTERVAL '5 days', 'Sarah Chen', 'Material quality verified', 'medium', 'Warehouse', 88),
  ('regulatory', 'scheduled', CURRENT_DATE + INTERVAL '10 days', 'Jennifer Lee', 'Compliance audit scheduled', 'high', 'Main Office', NULL);