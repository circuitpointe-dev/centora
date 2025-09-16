-- Update proposals table to support full proposal creation functionality
ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS opportunity_id UUID REFERENCES opportunities(id);
ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS overview_fields JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS narrative_fields JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS budget_currency TEXT DEFAULT 'USD';
ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS budget_amount NUMERIC;
ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS logframe_fields JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS comments JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS submission_status TEXT DEFAULT 'draft';

-- Create proposal team members table
CREATE TABLE IF NOT EXISTS public.proposal_team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL
);

-- Enable RLS on proposal_team_members
ALTER TABLE public.proposal_team_members ENABLE ROW LEVEL SECURITY;

-- Create policies for proposal_team_members
CREATE POLICY "Org members can view proposal team members" 
ON public.proposal_team_members 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM proposals p 
  WHERE p.id = proposal_team_members.proposal_id 
  AND is_org_member(p.org_id)
));

CREATE POLICY "Proposal creators or admins can manage team members" 
ON public.proposal_team_members 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM proposals p 
  WHERE p.id = proposal_team_members.proposal_id 
  AND (is_org_admin(p.org_id) OR p.created_by = auth.uid())
))
WITH CHECK (EXISTS (
  SELECT 1 FROM proposals p 
  WHERE p.id = proposal_team_members.proposal_id 
  AND (is_org_admin(p.org_id) OR p.created_by = auth.uid())
) AND created_by = auth.uid());

-- Create proposal comments table for better structure
CREATE TABLE IF NOT EXISTS public.proposal_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on proposal_comments
ALTER TABLE public.proposal_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for proposal_comments
CREATE POLICY "Org members can view proposal comments" 
ON public.proposal_comments 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM proposals p 
  WHERE p.id = proposal_comments.proposal_id 
  AND is_org_member(p.org_id)
));

CREATE POLICY "Org members can create proposal comments" 
ON public.proposal_comments 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM proposals p 
  WHERE p.id = proposal_comments.proposal_id 
  AND is_org_member(p.org_id)
) AND created_by = auth.uid());

CREATE POLICY "Comment creators or admins can update/delete comments" 
ON public.proposal_comments 
FOR ALL 
USING (created_by = auth.uid() OR EXISTS (
  SELECT 1 FROM proposals p 
  WHERE p.id = proposal_comments.proposal_id 
  AND is_org_admin(p.org_id)
));

-- Create trigger for updated_at on proposal_comments
CREATE TRIGGER update_proposal_comments_updated_at
BEFORE UPDATE ON public.proposal_comments
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();