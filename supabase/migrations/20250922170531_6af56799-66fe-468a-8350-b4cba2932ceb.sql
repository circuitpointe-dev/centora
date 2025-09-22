-- Add sample data for your 4 modules (simplified)
-- Skip if data already exists to prevent duplicates

-- Fundraising Module - Focus Areas
INSERT INTO focus_areas (org_id, name, description, amount, currency, funding_start_date, funding_end_date, color, created_by)
SELECT 
  'c21e6282-30c3-4aa9-b646-339007d22a4f'::uuid,
  'Health & Wellness',
  'Supporting healthcare initiatives and wellness programs',
  50000,
  'USD',
  '2024-01-01'::date,
  '2024-12-31'::date,
  '#10B981',
  '1d0a3763-f207-4234-a0d2-a392b7e4504d'::uuid
WHERE NOT EXISTS (
  SELECT 1 FROM focus_areas 
  WHERE org_id = 'c21e6282-30c3-4aa9-b646-339007d22a4f' AND name = 'Health & Wellness'
)
UNION ALL
SELECT 
  'c21e6282-30c3-4aa9-b646-339007d22a4f'::uuid,
  'Education',
  'Educational programs and scholarship opportunities',
  75000,
  'USD',
  '2024-03-01'::date,
  '2025-02-28'::date,
  '#3B82F6',
  '1d0a3763-f207-4234-a0d2-a392b7e4504d'::uuid
WHERE NOT EXISTS (
  SELECT 1 FROM focus_areas 
  WHERE org_id = 'c21e6282-30c3-4aa9-b646-339007d22a4f' AND name = 'Education'
);

-- Fundraising Module - Donors
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
WHERE NOT EXISTS (
  SELECT 1 FROM donors 
  WHERE org_id = 'c21e6282-30c3-4aa9-b646-339007d22a4f' AND name = 'Gates Foundation'
)
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
WHERE NOT EXISTS (
  SELECT 1 FROM donors 
  WHERE org_id = 'c21e6282-30c3-4aa9-b646-339007d22a4f' AND name = 'Ford Foundation'
);

-- Documents Module - Sample Documents
INSERT INTO documents (org_id, title, description, category, status, file_name, file_path, mime_type, file_size, created_by)
SELECT 
  'c21e6282-30c3-4aa9-b646-339007d22a4f'::uuid,
  'Organization Policy Manual',
  'Comprehensive policy and procedures manual',
  'uncategorized'::document_category,
  'published'::document_status,
  'policy_manual_2024.pdf',
  'policies/policy_manual_2024.pdf',
  'application/pdf',
  2048000,
  '1d0a3763-f207-4234-a0d2-a392b7e4504d'::uuid
WHERE NOT EXISTS (
  SELECT 1 FROM documents 
  WHERE org_id = 'c21e6282-30c3-4aa9-b646-339007d22a4f' AND title = 'Organization Policy Manual'
)
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
WHERE NOT EXISTS (
  SELECT 1 FROM documents 
  WHERE org_id = 'c21e6282-30c3-4aa9-b646-339007d22a4f' AND title = 'Grant Application Template'
);

-- Users Module - Departments  
INSERT INTO departments (org_id, name, description, created_by)
SELECT 
  'c21e6282-30c3-4aa9-b646-339007d22a4f'::uuid,
  'Program Management',
  'Manages and oversees all program activities',
  '1d0a3763-f207-4234-a0d2-a392b7e4504d'::uuid
WHERE NOT EXISTS (
  SELECT 1 FROM departments 
  WHERE org_id = 'c21e6282-30c3-4aa9-b646-339007d22a4f' AND name = 'Program Management'
)
UNION ALL
SELECT 
  'c21e6282-30c3-4aa9-b646-339007d22a4f'::uuid,
  'Finance & Administration',
  'Financial management and administrative support',
  '1d0a3763-f207-4234-a0d2-a392b7e4504d'::uuid
WHERE NOT EXISTS (
  SELECT 1 FROM departments 
  WHERE org_id = 'c21e6282-30c3-4aa9-b646-339007d22a4f' AND name = 'Finance & Administration'
);