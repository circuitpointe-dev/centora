-- Fix foreign key relationship for proposal_comments
ALTER TABLE proposal_comments 
DROP CONSTRAINT IF EXISTS proposal_comments_created_by_fkey;

ALTER TABLE proposal_comments 
ADD CONSTRAINT proposal_comments_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;

-- Create proposal_versions table for version history
CREATE TABLE IF NOT EXISTS proposal_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  version_number TEXT NOT NULL,
  changes_description TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on proposal_versions
ALTER TABLE proposal_versions ENABLE ROW LEVEL SECURITY;

-- RLS policies for proposal_versions
CREATE POLICY "Org members can view proposal versions" 
ON proposal_versions FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM proposals p
    WHERE p.id = proposal_versions.proposal_id 
    AND is_org_member(p.org_id)
  )
);

CREATE POLICY "Org members can create proposal versions" 
ON proposal_versions FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM proposals p
    WHERE p.id = proposal_versions.proposal_id 
    AND is_org_member(p.org_id)
  ) AND created_by = auth.uid()
);

-- Create submission_tracker table
CREATE TABLE IF NOT EXISTS submission_tracker (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  milestone_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  due_date DATE,
  completed_date DATE,
  notes TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on submission_tracker
ALTER TABLE submission_tracker ENABLE ROW LEVEL SECURITY;

-- RLS policies for submission_tracker
CREATE POLICY "Org members can view submission tracker" 
ON submission_tracker FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM proposals p
    WHERE p.id = submission_tracker.proposal_id 
    AND is_org_member(p.org_id)
  )
);

CREATE POLICY "Creators or admins can manage submission tracker" 
ON submission_tracker FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM proposals p
    WHERE p.id = submission_tracker.proposal_id 
    AND (is_org_admin(p.org_id) OR p.created_by = auth.uid())
  )
) 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM proposals p
    WHERE p.id = submission_tracker.proposal_id 
    AND (is_org_admin(p.org_id) OR p.created_by = auth.uid())
  ) AND created_by = auth.uid()
);

-- Create trigger to update updated_at on submission_tracker
CREATE TRIGGER update_submission_tracker_updated_at
BEFORE UPDATE ON submission_tracker
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();