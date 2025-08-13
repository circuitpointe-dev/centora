-- Create donor_notes table for communications & notes
CREATE TABLE public.donor_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create donor_engagements table for engagement history
CREATE TABLE public.donor_engagements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_id UUID NOT NULL,
  description TEXT NOT NULL,
  engagement_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create donor_giving_records table for giving history
CREATE TABLE public.donor_giving_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(donor_id, month, year)
);

-- Enable RLS on all new tables
ALTER TABLE public.donor_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_engagements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_giving_records ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for donor_notes
CREATE POLICY "Users can view donor notes" 
ON public.donor_notes 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM donors d 
  WHERE d.id = donor_notes.donor_id AND is_org_member(d.org_id)
));

CREATE POLICY "Users can create donor notes" 
ON public.donor_notes 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM donors d 
  WHERE d.id = donor_notes.donor_id AND is_org_member(d.org_id)
) AND created_by = auth.uid());

CREATE POLICY "Users can delete their own notes or admins can delete any" 
ON public.donor_notes 
FOR DELETE 
USING (created_by = auth.uid() OR EXISTS (
  SELECT 1 FROM donors d 
  WHERE d.id = donor_notes.donor_id AND is_org_admin(d.org_id)
));

-- Create RLS policies for donor_engagements
CREATE POLICY "Users can view donor engagements" 
ON public.donor_engagements 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM donors d 
  WHERE d.id = donor_engagements.donor_id AND is_org_member(d.org_id)
));

CREATE POLICY "Users can manage donor engagements" 
ON public.donor_engagements 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM donors d 
  WHERE d.id = donor_engagements.donor_id AND (is_org_admin(d.org_id) OR d.created_by = auth.uid())
))
WITH CHECK (EXISTS (
  SELECT 1 FROM donors d 
  WHERE d.id = donor_engagements.donor_id AND (is_org_admin(d.org_id) OR d.created_by = auth.uid())
) AND created_by = auth.uid());

-- Create RLS policies for donor_giving_records
CREATE POLICY "Users can view donor giving records" 
ON public.donor_giving_records 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM donors d 
  WHERE d.id = donor_giving_records.donor_id AND is_org_member(d.org_id)
));

CREATE POLICY "Users can manage donor giving records" 
ON public.donor_giving_records 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM donors d 
  WHERE d.id = donor_giving_records.donor_id AND (is_org_admin(d.org_id) OR d.created_by = auth.uid())
))
WITH CHECK (EXISTS (
  SELECT 1 FROM donors d 
  WHERE d.id = donor_giving_records.donor_id AND (is_org_admin(d.org_id) OR d.created_by = auth.uid())
) AND created_by = auth.uid());

-- Create triggers for updated_at columns
CREATE TRIGGER update_donor_notes_updated_at
  BEFORE UPDATE ON public.donor_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at_column();

CREATE TRIGGER update_donor_engagements_updated_at
  BEFORE UPDATE ON public.donor_engagements
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at_column();

CREATE TRIGGER update_donor_giving_records_updated_at
  BEFORE UPDATE ON public.donor_giving_records
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at_column();