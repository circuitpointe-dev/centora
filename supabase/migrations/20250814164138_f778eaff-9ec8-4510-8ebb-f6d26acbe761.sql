-- Create ENUM types
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');

-- Create opportunity_notes table
CREATE TABLE opportunity_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create opportunity_tasks table
CREATE TABLE opportunity_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  assigned_to TEXT,
  priority task_priority DEFAULT 'medium',
  completed BOOLEAN DEFAULT false,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create opportunity_attachments table
CREATE TABLE opportunity_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  uploaded_by UUID NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE opportunity_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity_attachments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for opportunity_notes
CREATE POLICY "Users can view opportunity notes in their org" 
ON opportunity_notes FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM opportunities o 
  JOIN donors d ON o.donor_id = d.id 
  WHERE o.id = opportunity_notes.opportunity_id 
  AND is_org_member(d.org_id)
));

CREATE POLICY "Users can create opportunity notes in their org" 
ON opportunity_notes FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM opportunities o 
  JOIN donors d ON o.donor_id = d.id 
  WHERE o.id = opportunity_notes.opportunity_id 
  AND is_org_member(d.org_id)
) AND created_by = auth.uid());

CREATE POLICY "Users can delete their own notes or admins can delete any" 
ON opportunity_notes FOR DELETE 
USING (created_by = auth.uid() OR EXISTS (
  SELECT 1 FROM opportunities o 
  JOIN donors d ON o.donor_id = d.id 
  WHERE o.id = opportunity_notes.opportunity_id 
  AND is_org_admin(d.org_id)
));

-- RLS Policies for opportunity_tasks
CREATE POLICY "Users can view opportunity tasks in their org" 
ON opportunity_tasks FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM opportunities o 
  JOIN donors d ON o.donor_id = d.id 
  WHERE o.id = opportunity_tasks.opportunity_id 
  AND is_org_member(d.org_id)
));

CREATE POLICY "Users can manage opportunity tasks in their org" 
ON opportunity_tasks FOR ALL 
USING (EXISTS (
  SELECT 1 FROM opportunities o 
  JOIN donors d ON o.donor_id = d.id 
  WHERE o.id = opportunity_tasks.opportunity_id 
  AND (is_org_admin(d.org_id) OR o.created_by = auth.uid())
))
WITH CHECK (EXISTS (
  SELECT 1 FROM opportunities o 
  JOIN donors d ON o.donor_id = d.id 
  WHERE o.id = opportunity_tasks.opportunity_id 
  AND (is_org_admin(d.org_id) OR o.created_by = auth.uid())
) AND created_by = auth.uid());

-- RLS Policies for opportunity_attachments
CREATE POLICY "Users can view opportunity attachments in their org" 
ON opportunity_attachments FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM opportunities o 
  JOIN donors d ON o.donor_id = d.id 
  WHERE o.id = opportunity_attachments.opportunity_id 
  AND is_org_member(d.org_id)
));

CREATE POLICY "Users can manage opportunity attachments in their org" 
ON opportunity_attachments FOR ALL 
USING (EXISTS (
  SELECT 1 FROM opportunities o 
  JOIN donors d ON o.donor_id = d.id 
  WHERE o.id = opportunity_attachments.opportunity_id 
  AND (is_org_admin(d.org_id) OR o.created_by = auth.uid())
))
WITH CHECK (EXISTS (
  SELECT 1 FROM opportunities o 
  JOIN donors d ON o.donor_id = d.id 
  WHERE o.id = opportunity_attachments.opportunity_id 
  AND (is_org_admin(d.org_id) OR o.created_by = auth.uid())
) AND uploaded_by = auth.uid());

-- Create storage bucket for opportunity attachments
INSERT INTO storage.buckets (id, name, public) VALUES ('opportunity-attachments', 'opportunity-attachments', false);

-- Create storage policies
CREATE POLICY "Users can view opportunity attachments" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'opportunity-attachments' AND EXISTS (
  SELECT 1 FROM opportunity_attachments oa 
  JOIN opportunities o ON oa.opportunity_id = o.id 
  JOIN donors d ON o.donor_id = d.id 
  WHERE oa.file_path = name 
  AND is_org_member(d.org_id)
));

CREATE POLICY "Users can upload opportunity attachments" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'opportunity-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own opportunity attachments" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'opportunity-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add indexes for performance
CREATE INDEX idx_opportunity_notes_opportunity_id ON opportunity_notes(opportunity_id);
CREATE INDEX idx_opportunity_tasks_opportunity_id ON opportunity_tasks(opportunity_id);
CREATE INDEX idx_opportunity_attachments_opportunity_id ON opportunity_attachments(opportunity_id);

-- Add updated_at triggers
CREATE TRIGGER update_opportunity_notes_updated_at
  BEFORE UPDATE ON opportunity_notes
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER update_opportunity_tasks_updated_at
  BEFORE UPDATE ON opportunity_tasks
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();