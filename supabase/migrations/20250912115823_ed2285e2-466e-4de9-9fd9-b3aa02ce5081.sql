-- Fix organization type enum values and complete authentication cleanup

-- Add sample organizations with correct enum values
INSERT INTO organizations (id, name, type, primary_currency, created_by) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Sample NGO Organization', 'NGO', 'USD', '00000000-0000-0000-0000-000000000101'),
  ('00000000-0000-0000-0000-000000000002', 'Sample Donor Foundation', 'Donor', 'USD', '00000000-0000-0000-0000-000000000102')
ON CONFLICT (id) DO NOTHING;

-- Add sample departments
INSERT INTO departments (id, org_id, name, description, created_by) VALUES
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', 'Human Resources', 'HR and talent management', '00000000-0000-0000-0000-000000000101'),
  ('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000001', 'Finance', 'Financial operations and accounting', '00000000-0000-0000-0000-000000000101'),
  ('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000001', 'Programs', 'Program implementation and management', '00000000-0000-0000-0000-000000000101'),
  ('00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000002', 'Grants Management', 'Grant review and disbursement', '00000000-0000-0000-0000-000000000102')
ON CONFLICT (id) DO NOTHING;

-- Add organization modules
INSERT INTO organization_modules (org_id, module) VALUES
  ('00000000-0000-0000-0000-000000000001', 'fundraising'),
  ('00000000-0000-0000-0000-000000000001', 'grants'),
  ('00000000-0000-0000-0000-000000000001', 'documents'),
  ('00000000-0000-0000-0000-000000000001', 'programme'),
  ('00000000-0000-0000-0000-000000000001', 'hr'),
  ('00000000-0000-0000-0000-000000000001', 'users'),
  ('00000000-0000-0000-0000-000000000002', 'fundraising'),
  ('00000000-0000-0000-0000-000000000002', 'grants'),
  ('00000000-0000-0000-0000-000000000002', 'documents'),
  ('00000000-0000-0000-0000-000000000002', 'users')
ON CONFLICT (org_id, module) DO NOTHING;