-- Create enum types for opportunities
CREATE TYPE opportunity_type AS ENUM ('RFP', 'LOI', 'CFP');
CREATE TYPE opportunity_status AS ENUM ('To Review', 'In Progress', 'Submitted', 'Awarded', 'Declined');

-- Create opportunities table
CREATE TABLE public.opportunities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL,
  title TEXT NOT NULL,
  donor_id UUID NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  amount NUMERIC,
  currency TEXT NOT NULL DEFAULT 'USD',
  type opportunity_type NOT NULL,
  deadline DATE NOT NULL,
  status opportunity_status NOT NULL DEFAULT 'To Review',
  pipeline TEXT,
  assigned_to TEXT,
  sector TEXT,
  start_date DATE,
  end_date DATE,
  notes TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

-- Create policies for opportunities
CREATE POLICY "Users can view opportunities in their org" 
ON public.opportunities 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM donors d 
    WHERE d.id = opportunities.donor_id 
    AND is_org_member(d.org_id)
  )
);

CREATE POLICY "Users can create opportunities in their org" 
ON public.opportunities 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM donors d 
    WHERE d.id = opportunities.donor_id 
    AND is_org_member(d.org_id)
  ) AND created_by = auth.uid()
);

CREATE POLICY "Creators or admins can update opportunities" 
ON public.opportunities 
FOR UPDATE 
USING (
  (created_by = auth.uid()) OR 
  EXISTS (
    SELECT 1 FROM donors d 
    WHERE d.id = opportunities.donor_id 
    AND is_org_admin(d.org_id)
  )
);

CREATE POLICY "Creators or admins can delete opportunities" 
ON public.opportunities 
FOR DELETE 
USING (
  (created_by = auth.uid()) OR 
  EXISTS (
    SELECT 1 FROM donors d 
    WHERE d.id = opportunities.donor_id 
    AND is_org_admin(d.org_id)
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_opportunities_updated_at
BEFORE UPDATE ON public.opportunities
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at_column();

-- Add indexes for performance
CREATE INDEX idx_opportunities_org_id ON public.opportunities (org_id);
CREATE INDEX idx_opportunities_donor_id ON public.opportunities (donor_id);
CREATE INDEX idx_opportunities_status ON public.opportunities (status);
CREATE INDEX idx_opportunities_deadline ON public.opportunities (deadline);