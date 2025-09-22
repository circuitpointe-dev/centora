-- Add sample data for your 4 modules 
-- Fundraising Module - Focus Areas
INSERT INTO focus_areas (org_id, name, description, amount, currency, funding_start_date, funding_end_date, color, created_by)
VALUES 
  ('c21e6282-30c3-4aa9-b646-339007d22a4f', 'Health & Wellness', 'Supporting healthcare initiatives and wellness programs', 50000, 'USD', '2024-01-01', '2024-12-31', '#10B981', '1d0a3763-f207-4234-a0d2-a392b7e4504d'),
  ('c21e6282-30c3-4aa9-b646-339007d22a4f', 'Education', 'Educational programs and scholarship opportunities', 75000, 'USD', '2024-03-01', '2025-02-28', '#3B82F6', '1d0a3763-f207-4234-a0d2-a392b7e4504d'),
  ('c21e6282-30c3-4aa9-b646-339007d22a4f', 'Environment', 'Environmental conservation and sustainability projects', 40000, 'USD', '2024-06-01', '2025-05-31', '#059669', '1d0a3763-f207-4234-a0d2-a392b7e4504d'),
  ('c21e6282-30c3-4aa9-b646-339007d22a4f', 'Technology Access', 'Digital literacy and technology access programs', 30000, 'USD', '2024-01-15', '2024-12-15', '#8B5CF6', '1d0a3763-f207-4234-a0d2-a392b7e4504d');

-- Fundraising Module - Donors
INSERT INTO donors (org_id, name, affiliation, organization_url, status, currency, notes, created_by)
VALUES 
  ('c21e6282-30c3-4aa9-b646-339007d22a4f', 'Gates Foundation', 'Bill & Melinda Gates Foundation', 'https://gatesfoundation.org', 'active', 'USD', 'Major global health and development funder', '1d0a3763-f207-4234-a0d2-a392b7e4504d'),
  ('c21e6282-30c3-4aa9-b646-339007d22a4f', 'Ford Foundation', 'Ford Foundation', 'https://fordfoundation.org', 'active', 'USD', 'Focus on social justice and inequality', '1d0a3763-f207-4234-a0d2-a392b7e4504d'),
  ('c21e6282-30c3-4aa9-b646-339007d22a4f', 'Rockefeller Foundation', 'The Rockefeller Foundation', 'https://rockefellerfoundation.org', 'potential', 'USD', 'Innovation and resilience funding', '1d0a3763-f207-4234-a0d2-a392b7e4504d'),
  ('c21e6282-30c3-4aa9-b646-339007d22a4f', 'Local Community Trust', 'Community Development Trust', NULL, 'active', 'USD', 'Local community-focused grants', '1d0a3763-f207-4234-a0d2-a392b7e4504d');

-- Documents Module - Sample Documents 
INSERT INTO documents (org_id, title, description, category, status, file_name, file_path, mime_type, file_size, created_by)
VALUES 
  ('c21e6282-30c3-4aa9-b646-339007d22a4f', 'Organization Policy Manual', 'Comprehensive policy and procedures manual', 'uncategorized', 'published', 'policy_manual_2024.pdf', 'policies/policy_manual_2024.pdf', 'application/pdf', 2048000, '1d0a3763-f207-4234-a0d2-a392b7e4504d'),
  ('c21e6282-30c3-4aa9-b646-339007d22a4f', 'Grant Application Template', 'Standard template for grant applications', 'template', 'published', 'grant_application_template.docx', 'templates/grant_application_template.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 512000, '1d0a3763-f207-4234-a0d2-a392b7e4504d'),
  ('c21e6282-30c3-4aa9-b646-339007d22a4f', 'Financial Report Q3 2024', 'Third quarter financial performance report', 'uncategorized', 'published', 'financial_report_q3_2024.pdf', 'reports/financial_report_q3_2024.pdf', 'application/pdf', 1024000, '1d0a3763-f207-4234-a0d2-a392b7e4504d'),
  ('c21e6282-30c3-4aa9-b646-339007d22a4f', 'Board Meeting Minutes - Sept 2024', 'Minutes from September 2024 board meeting', 'uncategorized', 'draft', 'board_minutes_sept_2024.pdf', 'meetings/board_minutes_sept_2024.pdf', 'application/pdf', 256000, '1d0a3763-f207-4234-a0d2-a392b7e4504d');

-- Users Module - Departments (this one has conflict handling)
INSERT INTO departments (org_id, name, description, created_by)
VALUES 
  ('c21e6282-30c3-4aa9-b646-339007d22a4f', 'Program Management', 'Manages and oversees all program activities', '1d0a3763-f207-4234-a0d2-a392b7e4504d'),
  ('c21e6282-30c3-4aa9-b646-339007d22a4f', 'Finance & Administration', 'Financial management and administrative support', '1d0a3763-f207-4234-a0d2-a392b7e4504d'),
  ('c21e6282-30c3-4aa9-b646-339007d22a4f', 'Communications & Outreach', 'External communications and community outreach', '1d0a3763-f207-4234-a0d2-a392b7e4504d'),
  ('c21e6282-30c3-4aa9-b646-339007d22a4f', 'Human Resources', 'Staff recruitment, development, and support', '1d0a3763-f207-4234-a0d2-a392b7e4504d'),
  ('c21e6282-30c3-4aa9-b646-339007d22a4f', 'Information Technology', 'IT infrastructure and digital solutions', '1d0a3763-f207-4234-a0d2-a392b7e4504d')
ON CONFLICT (org_id, name) DO NOTHING;