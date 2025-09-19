-- Create grantee_submissions table if it doesn't exist with proper structure
CREATE TABLE IF NOT EXISTS public.grantee_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  grant_id UUID NOT NULL REFERENCES grants(id) ON DELETE CASCADE,
  submission_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_review',
  submitted_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  organization_name TEXT NOT NULL,
  document_path TEXT,
  feedback TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.grantee_submissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for grantee_submissions
CREATE POLICY "Users can view grantee submissions in their org" ON public.grantee_submissions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM grants g 
    WHERE g.id = grantee_submissions.grant_id 
    AND is_org_member(g.org_id)
  )
);

CREATE POLICY "Users can create grantee submissions" ON public.grantee_submissions
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM grants g 
    WHERE g.id = grantee_submissions.grant_id 
    AND is_org_member(g.org_id)
  ) AND created_by = auth.uid()
);

CREATE POLICY "Creators or admins can update grantee submissions" ON public.grantee_submissions
FOR UPDATE USING (
  created_by = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM grants g 
    WHERE g.id = grantee_submissions.grant_id 
    AND is_org_admin(g.org_id)
  )
);

CREATE POLICY "Creators or admins can delete grantee submissions" ON public.grantee_submissions
FOR DELETE USING (
  created_by = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM grants g 
    WHERE g.id = grantee_submissions.grant_id 
    AND is_org_admin(g.org_id)
  )
);

-- Add updated_at trigger
CREATE TRIGGER set_grantee_submissions_updated_at
  BEFORE UPDATE ON public.grantee_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();