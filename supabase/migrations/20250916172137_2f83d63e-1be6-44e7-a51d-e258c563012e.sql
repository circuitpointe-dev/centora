-- Create proposal_attachments table
CREATE TABLE IF NOT EXISTS proposal_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  uploaded_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on proposal_attachments
ALTER TABLE proposal_attachments ENABLE ROW LEVEL SECURITY;

-- RLS policies for proposal_attachments
CREATE POLICY "Org members can view proposal attachments" 
ON proposal_attachments FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM proposals p
    WHERE p.id = proposal_attachments.proposal_id 
    AND is_org_member(p.org_id)
  )
);

CREATE POLICY "Org members can create proposal attachments" 
ON proposal_attachments FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM proposals p
    WHERE p.id = proposal_attachments.proposal_id 
    AND is_org_member(p.org_id)
  ) AND uploaded_by = auth.uid()
);

CREATE POLICY "Creators or admins can delete proposal attachments" 
ON proposal_attachments FOR DELETE 
USING (
  uploaded_by = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM proposals p
    WHERE p.id = proposal_attachments.proposal_id 
    AND is_org_admin(p.org_id)
  )
);

-- Create storage bucket for proposal attachments
INSERT INTO storage.buckets (id, name, public) VALUES ('proposal-attachments', 'proposal-attachments', false) ON CONFLICT (id) DO NOTHING;

-- Storage policies for proposal attachments
CREATE POLICY "Users can view proposal attachments they have access to" 
ON storage.objects FOR SELECT 
USING (
  bucket_id = 'proposal-attachments' AND 
  EXISTS (
    SELECT 1 FROM proposal_attachments pa
    JOIN proposals p ON pa.proposal_id = p.id
    WHERE pa.file_path = name AND is_org_member(p.org_id)
  )
);

CREATE POLICY "Users can upload proposal attachments" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'proposal-attachments' AND 
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can delete their own proposal attachments" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'proposal-attachments' AND 
  EXISTS (
    SELECT 1 FROM proposal_attachments pa
    JOIN proposals p ON pa.proposal_id = p.id
    WHERE pa.file_path = name AND 
    (pa.uploaded_by = auth.uid() OR is_org_admin(p.org_id))
  )
);