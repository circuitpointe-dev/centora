-- Create document_settings table
CREATE TABLE IF NOT EXISTS document_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  auto_save BOOLEAN NOT NULL DEFAULT true,
  max_file_size INTEGER NOT NULL DEFAULT 50,
  allowed_formats TEXT NOT NULL DEFAULT 'pdf,doc,docx,xls,xlsx,ppt,pptx,txt,jpg,png',
  retention_period INTEGER NOT NULL DEFAULT 7,
  virus_scanning BOOLEAN NOT NULL DEFAULT true,
  file_encryption BOOLEAN NOT NULL DEFAULT true,
  audit_logging BOOLEAN NOT NULL DEFAULT true,
  default_access_level TEXT NOT NULL DEFAULT 'organization',
  allow_sharing BOOLEAN NOT NULL DEFAULT true,
  allow_bulk_operations BOOLEAN NOT NULL DEFAULT true,
  allow_template_creation BOOLEAN NOT NULL DEFAULT true,
  require_upload_approval BOOLEAN NOT NULL DEFAULT false,
  daily_backup BOOLEAN NOT NULL DEFAULT true,
  cloud_sync BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(org_id)
);

-- Enable RLS
ALTER TABLE document_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Org members can view document settings"
  ON document_settings FOR SELECT
  USING (is_org_member(org_id));

CREATE POLICY "Org admins can manage document settings"
  ON document_settings FOR ALL
  USING (is_org_admin(org_id));

-- Trigger for updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON document_settings
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();