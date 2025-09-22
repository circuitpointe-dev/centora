-- Add sample data for the 4 modules: Fundraising, Documents, Grants, Users
-- 1. FUNDRAISING MODULE: Add sample focus areas
INSERT INTO focus_areas (org_id, name, description, amount, currency, funding_start_date, funding_end_date, color, created_by)
SELECT 
  'c21e6282-30c3-4aa9-b646-339007d22a4f'::uuid,
  'Health & Wellness',
  'Supporting healthcare initiatives and wellness programs',
  50000::numeric,
  'USD',
  '2024-01-01'::date,
  '2024-12-31'::date,
  '#10B981',
  '1d0a3763-f207-4234-a0d2-a392b7e4504d'::uuid
UNION ALL
SELECT 
  'c21e6282-30c3-4aa9-b646-339007d22a4f'::uuid,
  'Education',
  'Educational programs and scholarship opportunities',
  75000::numeric,
  'USD',
  '2024-03-01'::date,
  '2025-02-28'::date,
  '#3B82F6',
  '1d0a3763-f207-4234-a0d2-a392b7e4504d'::uuid
UNION ALL
SELECT 
  'c21e6282-30c3-4aa9-b646-339007d22a4f'::uuid,
  'Environment',
  'Environmental conservation and sustainability projects',
  40000::numeric,
  'USD',
  '2024-06-01'::date,
  '2025-05-31'::date,
  '#059669',
  '1d0a3763-f207-4234-a0d2-a392b7e4504d'::uuid
UNION ALL
SELECT 
  'c21e6282-30c3-4aa9-b646-339007d22a4f'::uuid,
  'Technology Access',
  'Digital literacy and technology access programs',
  30000::numeric,
  'USD',
  '2024-01-15'::date,
  '2024-12-15'::date,
  '#8B5CF6',
  '1d0a3763-f207-4234-a0d2-a392b7e4504d'::uuid;

-- 2. FUNDRAISING MODULE: Add sample donors
INSERT INTO donors (org_id, name, affiliation, organization_url, status, currency, notes, created_by)
SELECT 
  'c21e6282-30c3-4aa9-b646-339007d22a4f'::uuid,
  'Gates Foundation',
  'Bill & Melinda Gates Foundation',
  'https://gatesfoundation.org',
  'active'::donor_status,
  'USD',
  'Major global health and development funder',
  '1d0a3763-f207-4234-a0d2-a392b7e4504d'::uuid
UNION ALL
SELECT 
  'c21e6282-30c3-4aa9-b646-339007d22a4f'::uuid,
  'Ford Foundation',
  'Ford Foundation',
  'https://fordfoundation.org',
  'active'::donor_status,
  'USD',
  'Focus on social justice and inequality',
  '1d0a3763-f207-4234-a0d2-a392b7e4504d'::uuid
UNION ALL
SELECT 
  'c21e6282-30c3-4aa9-b646-339007d22a4f'::uuid,
  'Rockefeller Foundation',
  'The Rockefeller Foundation',
  'https://rockefellerfoundation.org',
  'potential'::donor_status,
  'USD',
  'Innovation and resilience funding',
  '1d0a3763-f207-4234-a0d2-a392b7e4504d'::uuid
UNION ALL
SELECT 
  'c21e6282-30c3-4aa9-b646-339007d22a4f'::uuid,
  'Local Community Trust',
  'Community Development Trust',
  NULL,
  'active'::donor_status,
  'USD',
  'Local community-focused grants',
  '1d0a3763-f207-4234-a0d2-a392b7e4504d'::uuid;

-- 3. GRANTS MODULE: Add sample grants
INSERT INTO grants (org_id, title, donor_name, amount, currency, status, application_deadline, project_start_date, project_end_date, description, created_by)
SELECT 
  'c21e6282-30c3-4aa9-b646-339007d22a4f'::uuid,
  'Digital Health Initiative',
  'Gates Foundation',
  150000::numeric,
  'USD',
  'active'::grant_status,
  '2024-03-15'::date,
  '2024-04-01'::date,
  '2025-03-31'::date,
  'Implementing digital health solutions in rural communities',
  '1d0a3763-f207-4234-a0d2-a392b7e4504d'::uuid
UNION ALL
SELECT 
  'c21e6282-30c3-4aa9-b646-339007d22a4f'::uuid,
  'Educational Technology Access',
  'Ford Foundation',
  85000::numeric,
  'USD',
  'active'::grant_status,
  '2024-02-28'::date,
  '2024-03-15'::date,
  '2024-12-31'::date,
  'Providing technology access to underserved schools',
  '1d0a3763-f207-4234-a0d2-a392b7e4504d'::uuid
UNION ALL
SELECT 
  'c21e6282-30c3-4aa9-b646-339007d22a4f'::uuid,
  'Community Resilience Program',
  'Rockefeller Foundation',
  120000::numeric,
  'USD',
  'pending'::grant_status,
  '2024-12-01'::date,
  '2025-01-15'::date,
  '2025-12-31'::date,
  'Building community resilience against climate change',
  '1d0a3763-f207-4234-a0d2-a392b7e4504d'::uuid
UNION ALL
SELECT 
  'c21e6282-30c3-4aa9-b646-339007d22a4f'::uuid,
  'Youth Leadership Development',
  'Local Community Trust',
  25000::numeric,
  'USD',
  'active'::grant_status,
  '2024-01-31'::date,
  '2024-02-15'::date,
  '2024-11-30'::date,
  'Developing leadership skills in young people',
  '1d0a3763-f207-4234-a0d2-a392b7e4504d'::uuid;

-- 4. DOCUMENTS MODULE: Add sample documents (metadata only)
INSERT INTO documents (org_id, title, description, category, status, file_name, file_path, mime_type, file_size, created_by)
SELECT 
  'c21e6282-30c3-4aa9-b646-339007d22a4f'::uuid,
  'Organization Policy Manual',
  'Comprehensive policy and procedures manual',
  'policy'::document_category,
  'published'::document_status,
  'policy_manual_2024.pdf',
  'policies/policy_manual_2024.pdf',
  'application/pdf',
  2048000,
  '1d0a3763-f207-4234-a0d2-a392b7e4504d'::uuid
UNION ALL
SELECT 
  'c21e6282-30c3-4aa9-b646-339007d22a4f'::uuid,
  'Grant Application Template',
  'Standard template for grant applications',
  'template'::document_category,
  'published'::document_status,
  'grant_application_template.docx',
  'templates/grant_application_template.docx',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  512000,
  '1d0a3763-f207-4234-a0d2-a392b7e4504d'::uuid
UNION ALL
SELECT 
  'c21e6282-30c3-4aa9-b646-339007d22a4f'::uuid,
  'Financial Report Q3 2024',
  'Third quarter financial performance report',
  'report'::document_category,
  'published'::document_status,
  'financial_report_q3_2024.pdf',
  'reports/financial_report_q3_2024.pdf',
  'application/pdf',
  1024000,
  '1d0a3763-f207-4234-a0d2-a392b7e4504d'::uuid
UNION ALL
SELECT 
  'c21e6282-30c3-4aa9-b646-339007d22a4f'::uuid,
  'Board Meeting Minutes - Sept 2024',
  'Minutes from September 2024 board meeting',
  'meeting_minutes'::document_category,
  'draft'::document_status,
  'board_minutes_sept_2024.pdf',
  'meetings/board_minutes_sept_2024.pdf',
  'application/pdf',
  256000,
  '1d0a3763-f207-4234-a0d2-a392b7e4504d'::uuid;

-- 5. USERS MODULE: Add sample departments
INSERT INTO departments (org_id, name, description, created_by)
SELECT 
  'c21e6282-30c3-4aa9-b646-339007d22a4f'::uuid,
  'Program Management',
  'Manages and oversees all program activities',
  '1d0a3763-f207-4234-a0d2-a392b7e4504d'::uuid
UNION ALL
SELECT 
  'c21e6282-30c3-4aa9-b646-339007d22a4f'::uuid,
  'Finance & Administration',
  'Financial management and administrative support',
  '1d0a3763-f207-4234-a0d2-a392b7e4504d'::uuid
UNION ALL
SELECT 
  'c21e6282-30c3-4aa9-b646-339007d22a4f'::uuid,
  'Communications & Outreach',
  'External communications and community outreach',
  '1d0a3763-f207-4234-a0d2-a392b7e4504d'::uuid
UNION ALL
SELECT 
  'c21e6282-30c3-4aa9-b646-339007d22a4f'::uuid,
  'Human Resources',
  'Staff recruitment, development, and support',
  '1d0a3763-f207-4234-a0d2-a392b7e4504d'::uuid
UNION ALL
SELECT 
  'c21e6282-30c3-4aa9-b646-339007d22a4f'::uuid,
  'Information Technology',
  'IT infrastructure and digital solutions',
  '1d0a3763-f207-4234-a0d2-a392b7e4504d'::uuid
ON CONFLICT (org_id, name) DO NOTHING;