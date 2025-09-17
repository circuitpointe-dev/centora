-- Clear existing sample data
DELETE FROM grant_reports;
DELETE FROM grant_compliance;
DELETE FROM grant_disbursements;
DELETE FROM grants;

-- Get the first organization and user IDs for sample data
-- Insert comprehensive sample grants with all related data
WITH sample_org AS (
  SELECT id as org_id FROM organizations LIMIT 1
),
sample_user AS (
  SELECT id as user_id FROM profiles LIMIT 1
),
inserted_grants AS (
  INSERT INTO grants (
    org_id, grant_name, donor_name, amount, currency, 
    start_date, end_date, status, program_area, region, 
    description, created_by, created_at, updated_at, next_report_due
  )
  SELECT 
    s.org_id,
    grant_info.name,
    grant_info.donor,
    grant_info.amount,
    'USD',
    grant_info.start_date::date,
    grant_info.end_date::date,
    grant_info.status::grant_status,
    grant_info.program_area,
    grant_info.region,
    grant_info.description,
    u.user_id,
    now(),
    now(),
    CASE WHEN grant_info.next_report_due IS NOT NULL THEN grant_info.next_report_due::date ELSE NULL END
  FROM sample_org s, sample_user u,
  (VALUES 
    ('Community Health Initiative', 'Gates Foundation', 250000, '2025-01-15', '2025-12-31', 'active', 'Health', 'Sub-Saharan Africa', 'Improving maternal and child health outcomes in rural communities through mobile health clinics and community health worker training programs.', '2025-03-31'),
    ('Digital Education Program', 'Google.org', 180000, '2025-02-01', '2025-08-31', 'active', 'Education', 'Southeast Asia', 'Providing digital literacy training and computer access to underserved schools in rural areas, reaching over 5,000 students.', '2025-04-15'),
    ('Clean Water Access Project', 'Water.org', 320000, '2025-03-01', '2025-09-30', 'active', 'Water & Sanitation', 'Latin America', 'Installing water purification systems and sanitation facilities in 25 rural communities, benefiting approximately 12,000 people.', '2025-05-30'),
    ('Women Entrepreneurship Fund', 'Ford Foundation', 150000, '2025-01-01', '2025-06-30', 'closed', 'Economic Development', 'South Asia', 'Supporting women-led small businesses through microfinance, training, and mentorship programs in urban and peri-urban areas.', NULL),
    ('Climate Resilience Initiative', 'UN Environment', 280000, '2025-04-01', '2026-03-31', 'pending', 'Environment', 'East Africa', 'Building climate adaptation capacity through sustainable agriculture practices and renewable energy solutions for smallholder farmers.', '2025-06-15'),
    ('Youth Leadership Development', 'Open Society Foundations', 120000, '2025-02-15', '2025-11-30', 'active', 'Youth Development', 'Middle East', 'Empowering young leaders through civic engagement training, leadership workshops, and community project implementation.', '2025-04-30')
  ) AS grant_info(name, donor, amount, start_date, end_date, status, program_area, region, description, next_report_due)
  RETURNING id, grant_name, status
)
-- Insert grant reports for each grant
INSERT INTO grant_reports (
  grant_id, report_type, due_date, submitted, status, 
  submitted_date, file_name, file_path, created_by, created_at, updated_at
)
SELECT 
  ig.id,
  report_info.report_type,
  report_info.due_date::date,
  report_info.submitted,
  report_info.status::report_status,
  CASE WHEN report_info.submitted THEN report_info.submitted_date::date ELSE NULL END,
  CASE WHEN report_info.submitted THEN report_info.file_name ELSE NULL END,
  CASE WHEN report_info.submitted THEN report_info.file_path ELSE NULL END,
  (SELECT user_id FROM sample_user),
  now(),
  now()
FROM inserted_grants ig, sample_user u,
(VALUES 
  -- Community Health Initiative reports
  ('Quarterly Report Q1', '2025-04-30', true, 'submitted', '2025-04-28', 'community_health_q1_2025.pdf', '/reports/community_health_q1_2025.pdf'),
  ('Monthly Report January', '2025-02-15', true, 'submitted', '2025-02-10', 'community_health_jan_2025.pdf', '/reports/community_health_jan_2025.pdf'),
  ('Monthly Report February', '2025-03-15', false, 'overdue', NULL, NULL, NULL),
  -- Digital Education Program reports  
  ('Monthly Report February', '2025-03-20', true, 'submitted', '2025-03-18', 'digital_education_feb_2025.pdf', '/reports/digital_education_feb_2025.pdf'),
  ('Quarterly Report Q1', '2025-05-15', false, 'upcoming', NULL, NULL, NULL),
  -- Clean Water Access Project reports
  ('Baseline Assessment', '2025-04-15', false, 'overdue', NULL, NULL, NULL),
  ('Monthly Report March', '2025-04-30', false, 'upcoming', NULL, NULL, NULL),
  -- Women Entrepreneurship Fund (closed grant)
  ('Final Report', '2025-07-31', true, 'submitted', '2025-07-20', 'women_entrepreneurship_final_2025.pdf', '/reports/women_entrepreneurship_final_2025.pdf'),
  ('Impact Assessment', '2025-08-15', true, 'submitted', '2025-08-10', 'women_entrepreneurship_impact_2025.pdf', '/reports/women_entrepreneurship_impact_2025.pdf'),
  -- Youth Leadership Development
  ('Progress Report', '2025-05-30', false, 'upcoming', NULL, NULL, NULL),
  ('Monthly Report April', '2025-05-15', false, 'upcoming', NULL, NULL, NULL)
) AS report_info(report_type, due_date, submitted, status, submitted_date, file_name, file_path)
WHERE (
  (ig.grant_name = 'Community Health Initiative' AND report_info.report_type IN ('Quarterly Report Q1', 'Monthly Report January', 'Monthly Report February')) OR
  (ig.grant_name = 'Digital Education Program' AND report_info.report_type IN ('Monthly Report February', 'Quarterly Report Q1')) OR  
  (ig.grant_name = 'Clean Water Access Project' AND report_info.report_type IN ('Baseline Assessment', 'Monthly Report March')) OR
  (ig.grant_name = 'Women Entrepreneurship Fund' AND report_info.report_type IN ('Final Report', 'Impact Assessment')) OR
  (ig.grant_name = 'Youth Leadership Development' AND report_info.report_type IN ('Progress Report', 'Monthly Report April'))
);