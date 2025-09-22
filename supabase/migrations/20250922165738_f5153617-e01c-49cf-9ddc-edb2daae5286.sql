-- Add sample data for the 4 modules: Fundraising, Documents, Grants, Users
-- Get the organization ID and test user ID
WITH org_data AS (
  SELECT id as org_id FROM organizations ORDER BY created_at ASC LIMIT 1
),
test_user AS (
  SELECT id as user_id FROM profiles WHERE email = 'test@circuitpointe.com' LIMIT 1
)

-- 1. FUNDRAISING MODULE: Add sample focus areas
INSERT INTO focus_areas (org_id, name, description, amount, currency, funding_start_date, funding_end_date, color, created_by)
SELECT 
  o.org_id,
  name,
  description,
  amount::numeric,
  'USD',
  funding_start_date::date,
  funding_end_date::date,
  color,
  COALESCE(u.user_id, o.org_id) -- fallback to org_id if no test user
FROM org_data o
CROSS JOIN test_user u
CROSS JOIN (VALUES 
  ('Health & Wellness', 'Supporting healthcare initiatives and wellness programs', 50000, '2024-01-01', '2024-12-31', '#10B981'),
  ('Education', 'Educational programs and scholarship opportunities', 75000, '2024-03-01', '2025-02-28', '#3B82F6'),
  ('Environment', 'Environmental conservation and sustainability projects', 40000, '2024-06-01', '2025-05-31', '#059669'),
  ('Technology Access', 'Digital literacy and technology access programs', 30000, '2024-01-15', '2024-12-15', '#8B5CF6')
) AS fa(name, description, amount, funding_start_date, funding_end_date, color);

-- 2. FUNDRAISING MODULE: Add sample donors
INSERT INTO donors (org_id, name, affiliation, organization_url, status, currency, notes, created_by)
SELECT 
  o.org_id,
  name,
  affiliation,
  organization_url,
  status::donor_status,
  'USD',
  notes,
  COALESCE(u.user_id, o.org_id)
FROM org_data o
CROSS JOIN test_user u
CROSS JOIN (VALUES 
  ('Gates Foundation', 'Bill & Melinda Gates Foundation', 'https://gatesfoundation.org', 'active', 'Major global health and development funder'),
  ('Ford Foundation', 'Ford Foundation', 'https://fordfoundation.org', 'active', 'Focus on social justice and inequality'),
  ('Rockefeller Foundation', 'The Rockefeller Foundation', 'https://rockefellerfoundation.org', 'potential', 'Innovation and resilience funding'),
  ('Local Community Trust', 'Community Development Trust', NULL, 'active', 'Local community-focused grants')
) AS d(name, affiliation, organization_url, status, notes);

-- 3. GRANTS MODULE: Add sample grants
INSERT INTO grants (org_id, title, donor_name, amount, currency, status, application_deadline, project_start_date, project_end_date, description, created_by)
SELECT 
  o.org_id,
  title,
  donor_name,
  amount::numeric,
  'USD',
  status::grant_status,
  application_deadline::date,
  project_start_date::date,
  project_end_date::date,
  description,
  COALESCE(u.user_id, o.org_id)
FROM org_data o
CROSS JOIN test_user u
CROSS JOIN (VALUES 
  ('Digital Health Initiative', 'Gates Foundation', 150000, 'active', '2024-03-15', '2024-04-01', '2025-03-31', 'Implementing digital health solutions in rural communities'),
  ('Educational Technology Access', 'Ford Foundation', 85000, 'active', '2024-02-28', '2024-03-15', '2024-12-31', 'Providing technology access to underserved schools'),
  ('Community Resilience Program', 'Rockefeller Foundation', 120000, 'pending', '2024-12-01', '2025-01-15', '2025-12-31', 'Building community resilience against climate change'),
  ('Youth Leadership Development', 'Local Community Trust', 25000, 'active', '2024-01-31', '2024-02-15', '2024-11-30', 'Developing leadership skills in young people')
) AS g(title, donor_name, amount, status, application_deadline, project_start_date, project_end_date, description);

-- 4. DOCUMENTS MODULE: Add sample documents (metadata only - files would need to be uploaded separately)
INSERT INTO documents (org_id, title, description, category, status, file_name, file_path, mime_type, file_size, created_by)
SELECT 
  o.org_id,
  title,
  description,
  category::document_category,
  status::document_status,
  file_name,
  file_path,
  mime_type,
  file_size,
  COALESCE(u.user_id, o.org_id)
FROM org_data o
CROSS JOIN test_user u
CROSS JOIN (VALUES 
  ('Organization Policy Manual', 'Comprehensive policy and procedures manual', 'policy', 'published', 'policy_manual_2024.pdf', 'policies/policy_manual_2024.pdf', 'application/pdf', 2048000),
  ('Grant Application Template', 'Standard template for grant applications', 'template', 'published', 'grant_application_template.docx', 'templates/grant_application_template.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 512000),
  ('Financial Report Q3 2024', 'Third quarter financial performance report', 'report', 'published', 'financial_report_q3_2024.pdf', 'reports/financial_report_q3_2024.pdf', 'application/pdf', 1024000),
  ('Board Meeting Minutes - Sept 2024', 'Minutes from September 2024 board meeting', 'meeting_minutes', 'draft', 'board_minutes_sept_2024.pdf', 'meetings/board_minutes_sept_2024.pdf', 'application/pdf', 256000)
) AS d(title, description, category, status, file_name, file_path, mime_type, file_size);

-- 5. USERS MODULE: Add sample departments
INSERT INTO departments (org_id, name, description, created_by)
SELECT 
  o.org_id,
  name,
  description,
  COALESCE(u.user_id, o.org_id)
FROM org_data o
CROSS JOIN test_user u
CROSS JOIN (VALUES 
  ('Program Management', 'Manages and oversees all program activities'),
  ('Finance & Administration', 'Financial management and administrative support'),
  ('Communications & Outreach', 'External communications and community outreach'),
  ('Human Resources', 'Staff recruitment, development, and support'),
  ('Information Technology', 'IT infrastructure and digital solutions')
) AS dept(name, description)
ON CONFLICT (org_id, name) DO NOTHING;