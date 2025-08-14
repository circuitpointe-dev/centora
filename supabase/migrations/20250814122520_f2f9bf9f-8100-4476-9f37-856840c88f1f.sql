-- Create enum for funding cycle status
CREATE TYPE funding_cycle_status AS ENUM ('ongoing', 'upcoming', 'closed');

-- Create donor_funding_cycles table
CREATE TABLE public.donor_funding_cycles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_id UUID NOT NULL,
  org_id UUID NOT NULL,
  name TEXT NOT NULL,
  status funding_cycle_status NOT NULL DEFAULT 'upcoming',
  start_month INTEGER NOT NULL CHECK (start_month >= 1 AND start_month <= 12),
  end_month INTEGER NOT NULL CHECK (end_month >= 1 AND end_month <= 12),
  year INTEGER NOT NULL CHECK (year >= 2000 AND year <= 2100),
  description TEXT,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.donor_funding_cycles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view funding cycles in their org" 
ON public.donor_funding_cycles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM donors d 
    WHERE d.id = donor_funding_cycles.donor_id 
    AND is_org_member(d.org_id)
  )
);

CREATE POLICY "Users can create funding cycles in their org" 
ON public.donor_funding_cycles 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM donors d 
    WHERE d.id = donor_funding_cycles.donor_id 
    AND is_org_member(d.org_id)
  ) 
  AND created_by = auth.uid()
);

CREATE POLICY "Creators or admins can update funding cycles" 
ON public.donor_funding_cycles 
FOR UPDATE 
USING (
  (created_by = auth.uid()) OR 
  (EXISTS (
    SELECT 1 FROM donors d 
    WHERE d.id = donor_funding_cycles.donor_id 
    AND is_org_admin(d.org_id)
  ))
)
WITH CHECK (
  (created_by = auth.uid()) OR 
  (EXISTS (
    SELECT 1 FROM donors d 
    WHERE d.id = donor_funding_cycles.donor_id 
    AND is_org_admin(d.org_id)
  ))
);

CREATE POLICY "Creators or admins can delete funding cycles" 
ON public.donor_funding_cycles 
FOR DELETE 
USING (
  (created_by = auth.uid()) OR 
  (EXISTS (
    SELECT 1 FROM donors d 
    WHERE d.id = donor_funding_cycles.donor_id 
    AND is_org_admin(d.org_id)
  ))
);

-- Create updated_at trigger
CREATE TRIGGER update_donor_funding_cycles_updated_at
BEFORE UPDATE ON public.donor_funding_cycles
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at_column();