-- Create compliance audit trial types
CREATE TYPE compliance_audit_action AS ENUM (
  'created',
  'updated', 
  'approved',
  'rejected',
  'disputed',
  'viewed',
  'exported'
);

CREATE TYPE compliance_audit_status AS ENUM (
  'approved',
  'pending',
  'rejected',
  'disputed'
);

CREATE TYPE compliance_document_type AS ENUM (
  'purchase_order',
  'requisition',
  'invoice',
  'grn',
  'payment',
  'approval'
);

-- Create compliance_audit_trials table
CREATE TABLE compliance_audit_trials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT,
  document_id TEXT NOT NULL,
  document_type compliance_document_type NOT NULL,
  action compliance_audit_action NOT NULL,
  status compliance_audit_status NOT NULL DEFAULT 'pending',
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_compliance_audit_trials_org_id ON compliance_audit_trials(org_id);
CREATE INDEX idx_compliance_audit_trials_user_id ON compliance_audit_trials(user_id);
CREATE INDEX idx_compliance_audit_trials_document_id ON compliance_audit_trials(document_id);
CREATE INDEX idx_compliance_audit_trials_document_type ON compliance_audit_trials(document_type);
CREATE INDEX idx_compliance_audit_trials_status ON compliance_audit_trials(status);
CREATE INDEX idx_compliance_audit_trials_timestamp ON compliance_audit_trials(timestamp);
CREATE INDEX idx_compliance_audit_trials_org_timestamp ON compliance_audit_trials(org_id, timestamp);

-- Enable Row Level Security
ALTER TABLE compliance_audit_trials ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view compliance audit trials for their organization"
  ON compliance_audit_trials FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM user_organizations 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert compliance audit trials for their organization"
  ON compliance_audit_trials FOR INSERT
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM user_organizations 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update compliance audit trials for their organization"
  ON compliance_audit_trials FOR UPDATE
  USING (
    org_id IN (
      SELECT org_id FROM user_organizations 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete compliance audit trials for their organization"
  ON compliance_audit_trials FOR DELETE
  USING (
    org_id IN (
      SELECT org_id FROM user_organizations 
      WHERE user_id = auth.uid()
    )
  );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_compliance_audit_trials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_compliance_audit_trials_updated_at
  BEFORE UPDATE ON compliance_audit_trials
  FOR EACH ROW
  EXECUTE FUNCTION update_compliance_audit_trials_updated_at();

-- Create function to log compliance audit trail
CREATE OR REPLACE FUNCTION log_compliance_audit_trail(
  p_org_id UUID,
  p_user_id UUID,
  p_user_name TEXT,
  p_document_id TEXT,
  p_document_type compliance_document_type,
  p_action compliance_audit_action,
  p_status compliance_audit_status DEFAULT 'pending',
  p_details TEXT DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  audit_id UUID;
BEGIN
  INSERT INTO compliance_audit_trials (
    org_id,
    user_id,
    user_name,
    document_id,
    document_type,
    action,
    status,
    details,
    ip_address,
    user_agent
  ) VALUES (
    p_org_id,
    p_user_id,
    p_user_name,
    p_document_id,
    p_document_type,
    p_action,
    p_status,
    p_details,
    p_ip_address,
    p_user_agent
  ) RETURNING id INTO audit_id;
  
  RETURN audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION log_compliance_audit_trail TO authenticated;

-- Create function to get compliance audit trail statistics
CREATE OR REPLACE FUNCTION get_compliance_audit_stats(p_org_id UUID)
RETURNS TABLE (
  total_actions BIGINT,
  approvals BIGINT,
  pending_actions BIGINT,
  rejections BIGINT,
  disputes BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_actions,
    COUNT(*) FILTER (WHERE status = 'approved') as approvals,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_actions,
    COUNT(*) FILTER (WHERE status = 'rejected') as rejections,
    COUNT(*) FILTER (WHERE status = 'disputed') as disputes
  FROM compliance_audit_trials
  WHERE org_id = p_org_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_compliance_audit_stats TO authenticated;
