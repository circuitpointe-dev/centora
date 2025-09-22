-- Create grants table for the Grants module
CREATE TABLE grants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL,
  title text NOT NULL,
  donor_name text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  status text NOT NULL DEFAULT 'pending',
  application_deadline date,
  project_start_date date,
  project_end_date date,
  description text,
  created_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for grants
ALTER TABLE grants ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for grants
CREATE policy "Org members can view grants" 
  ON grants FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() AND p.org_id = grants.org_id
  ));

CREATE policy "Org members can create grants" 
  ON grants FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() AND p.org_id = grants.org_id
    ) AND created_by = auth.uid()
  );

CREATE policy "Creators or admins can update grants" 
  ON grants FOR UPDATE 
  USING (
    (created_by = auth.uid()) OR 
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() AND p.org_id = grants.org_id AND p.role = 'org_admin'
    )
  );

CREATE policy "Creators or admins can delete grants" 
  ON grants FOR DELETE 
  USING (
    (created_by = auth.uid()) OR 
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() AND p.org_id = grants.org_id AND p.role = 'org_admin'
    )
  );

-- Create trigger for updating timestamps
CREATE TRIGGER update_grants_updated_at
  BEFORE UPDATE ON grants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();