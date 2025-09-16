-- Create proposals table
CREATE TABLE public.proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  due_date DATE,
  assigned_to TEXT[],
  reviewer TEXT,
  opportunity_id UUID,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- Create policies for proposals
CREATE POLICY "Org members can view proposals"
ON public.proposals
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.org_id = proposals.org_id
  )
);

CREATE POLICY "Org members can create proposals"
ON public.proposals
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.org_id = proposals.org_id
  ) AND created_by = auth.uid()
);

CREATE POLICY "Creators or admins can update proposals"
ON public.proposals
FOR UPDATE
USING (
  created_by = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.org_id = proposals.org_id AND p.role = 'org_admin'
  )
);

CREATE POLICY "Creators or admins can delete proposals"
ON public.proposals
FOR DELETE
USING (
  created_by = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.org_id = proposals.org_id AND p.role = 'org_admin'
  )
);

-- Create proposal team members table
CREATE TABLE public.proposal_team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  user_id UUID,
  name TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for team members
ALTER TABLE public.proposal_team_members ENABLE ROW LEVEL SECURITY;

-- Create policies for team members
CREATE POLICY "Team members visible to proposal org members"
ON public.proposal_team_members
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM proposals p
    JOIN profiles pr ON pr.org_id = p.org_id
    WHERE p.id = proposal_team_members.proposal_id 
    AND pr.id = auth.uid()
  )
);

CREATE POLICY "Org members can manage team members"
ON public.proposal_team_members
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM proposals p
    JOIN profiles pr ON pr.org_id = p.org_id
    WHERE p.id = proposal_team_members.proposal_id 
    AND pr.id = auth.uid()
    AND (p.created_by = auth.uid() OR pr.role = 'org_admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM proposals p
    JOIN profiles pr ON pr.org_id = p.org_id
    WHERE p.id = proposal_team_members.proposal_id 
    AND pr.id = auth.uid()
    AND (p.created_by = auth.uid() OR pr.role = 'org_admin')
  )
);

-- Add trigger for updated_at
CREATE TRIGGER update_proposals_updated_at
  BEFORE UPDATE ON public.proposals
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();