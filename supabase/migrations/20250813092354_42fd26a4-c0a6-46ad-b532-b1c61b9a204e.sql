-- Create the missing function for updating timestamps
CREATE OR REPLACE FUNCTION public.set_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create focus_areas table for multi-tenant focus area management
CREATE TABLE public.focus_areas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL,
  created_by UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL,
  funding_start_date DATE NOT NULL,
  funding_end_date DATE NOT NULL,
  interest_tags TEXT[] DEFAULT '{}',
  amount NUMERIC(15,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.focus_areas ENABLE ROW LEVEL SECURITY;

-- Create policies for multi-tenant access
CREATE POLICY "Users can view their organization's focus areas" 
ON public.focus_areas 
FOR SELECT 
USING (is_org_member(org_id));

CREATE POLICY "Org members can create focus areas" 
ON public.focus_areas 
FOR INSERT 
WITH CHECK (is_org_member(org_id) AND created_by = auth.uid());

CREATE POLICY "Creators or admins can update focus areas" 
ON public.focus_areas 
FOR UPDATE 
USING ((created_by = auth.uid()) OR is_org_admin(org_id))
WITH CHECK ((created_by = auth.uid()) OR is_org_admin(org_id));

CREATE POLICY "Creators or admins can delete focus areas" 
ON public.focus_areas 
FOR DELETE 
USING ((created_by = auth.uid()) OR is_org_admin(org_id));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_focus_areas_updated_at
BEFORE UPDATE ON public.focus_areas
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at_column();

-- Create index for performance
CREATE INDEX idx_focus_areas_org_id ON public.focus_areas(org_id);
CREATE INDEX idx_focus_areas_created_by ON public.focus_areas(created_by);