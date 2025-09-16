-- Create proposals table for managing fundraising proposals
CREATE TABLE public.proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL,
  name TEXT NOT NULL,
  title TEXT,
  due_date DATE,
  dueDate TEXT,
  reviewer TEXT,
  team JSONB DEFAULT '[]'::JSONB,
  status TEXT NOT NULL DEFAULT 'Draft',
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- Create policies for proposals
CREATE POLICY "Users can view proposals in their org" 
ON public.proposals 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles p 
  WHERE p.id = auth.uid() 
  AND p.org_id = proposals.org_id
));

CREATE POLICY "Users can create proposals in their org" 
ON public.proposals 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles p 
  WHERE p.id = auth.uid() 
  AND p.org_id = proposals.org_id
) AND created_by = auth.uid());

CREATE POLICY "Creators or admins can update proposals" 
ON public.proposals 
FOR UPDATE 
USING (
  created_by = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND p.org_id = proposals.org_id 
    AND p.role = 'org_admin'
  )
);

CREATE POLICY "Creators or admins can delete proposals" 
ON public.proposals 
FOR DELETE 
USING (
  created_by = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND p.org_id = proposals.org_id 
    AND p.role = 'org_admin'
  )
);

-- Create updated_at trigger
CREATE TRIGGER update_proposals_updated_at
BEFORE UPDATE ON public.proposals
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();