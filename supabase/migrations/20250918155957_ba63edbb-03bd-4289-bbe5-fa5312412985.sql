-- Add some sample data for testing grants management functionality

-- First, let's add some sample donors if they don't exist
INSERT INTO donors (id, org_id, name, status, created_by) 
SELECT 
  gen_random_uuid(),
  (SELECT id FROM organizations LIMIT 1),
  name,
  'active'::donor_status,
  (SELECT id FROM profiles LIMIT 1)
FROM (VALUES 
  ('Gates Foundation'),
  ('Ford Foundation'),
  ('Open Society Foundation'),
  ('Rockefeller Foundation'),
  ('MacArthur Foundation')
) AS sample_donors(name)
WHERE NOT EXISTS (SELECT 1 FROM donors WHERE name = sample_donors.name);

-- Add some sample grants for testing
WITH sample_org AS (SELECT id FROM organizations LIMIT 1),
     sample_user AS (SELECT id FROM profiles LIMIT 1)
INSERT INTO grants (
  id, org_id, grant_name, donor_name, amount, currency, 
  start_date, end_date, status, program_area, region, 
  description, created_by
) 
SELECT 
  gen_random_uuid(),
  sample_org.id,
  grant_name,
  donor_name,
  amount,
  currency,
  start_date,
  end_date,
  status::grant_status,
  program_area,
  region,
  description,
  sample_user.id
FROM sample_org, sample_user, (VALUES 
  ('Education Innovation Grant', 'Gates Foundation', 500000, 'USD', '2024-01-01'::date, '2025-12-31'::date, 'active', 'Education', 'Africa', 'Supporting innovative education technologies in rural communities'),
  ('Health Access Initiative', 'Ford Foundation', 750000, 'USD', '2024-03-01'::date, '2026-02-28'::date, 'active', 'Healthcare', 'Asia', 'Improving healthcare access in underserved populations'),
  ('Environmental Conservation Program', 'Rockefeller Foundation', 1200000, 'USD', '2024-06-01'::date, '2027-05-31'::date, 'active', 'Environment', 'South America', 'Large-scale conservation efforts in the Amazon basin'),
  ('Youth Leadership Development', 'MacArthur Foundation', 300000, 'USD', '2023-09-01'::date, '2024-08-31'::date, 'closed', 'Youth Development', 'North America', 'Empowering young leaders in community development'),
  ('Women Empowerment Fund', 'Open Society Foundation', 425000, 'USD', '2024-04-01'::date, '2025-09-30'::date, 'active', 'Gender Equality', 'Global', 'Supporting women entrepreneurs and leaders worldwide')
) AS sample_grants(grant_name, donor_name, amount, currency, start_date, end_date, status, program_area, region, description)
WHERE NOT EXISTS (SELECT 1 FROM grants WHERE grant_name = sample_grants.grant_name);

-- Add sample compliance records
WITH grant_ids AS (
  SELECT id, grant_name FROM grants WHERE grant_name IN (
    'Education Innovation Grant', 
    'Health Access Initiative', 
    'Environmental Conservation Program',
    'Women Empowerment Fund'
  )
),
sample_user AS (SELECT id FROM profiles LIMIT 1)
INSERT INTO grant_compliance (
  id, grant_id, requirement, due_date, status, created_by
)
SELECT 
  gen_random_uuid(),
  g.id,
  requirement,
  due_date,
  status::compliance_status,
  u.id
FROM grant_ids g, sample_user u, (VALUES 
  ('Education Innovation Grant', 'Financial Audit Report', '2024-12-31'::date, 'completed'),
  ('Education Innovation Grant', 'Impact Assessment', '2024-06-30'::date, 'in_progress'),
  ('Education Innovation Grant', 'Annual Report Submission', '2024-03-31'::date, 'completed'),
  ('Health Access Initiative', 'Quarterly Financial Report', '2024-09-30'::date, 'overdue'),
  ('Health Access Initiative', 'Beneficiary Survey', '2024-10-15'::date, 'in_progress'),
  ('Environmental Conservation Program', 'Environmental Impact Study', '2024-12-15'::date, 'in_progress'),
  ('Environmental Conservation Program', 'Community Engagement Report', '2024-11-30'::date, 'completed'),
  ('Women Empowerment Fund', 'Baseline Study', '2024-07-31'::date, 'completed'),
  ('Women Empowerment Fund', 'Mid-term Evaluation', '2024-12-31'::date, 'in_progress')
) AS compliance_data(grant_name, requirement, due_date, status)
WHERE g.grant_name = compliance_data.grant_name;

-- Add sample disbursements
WITH grant_ids AS (
  SELECT id, grant_name FROM grants WHERE grant_name IN (
    'Education Innovation Grant', 
    'Health Access Initiative', 
    'Environmental Conservation Program',
    'Women Empowerment Fund'
  )
),
sample_user AS (SELECT id FROM profiles LIMIT 1)
INSERT INTO grant_disbursements (
  id, grant_id, milestone, amount, currency, due_date, status, disbursed_on, created_by
)
SELECT 
  gen_random_uuid(),
  g.id,
  milestone,
  amount,
  currency,
  due_date,
  status::disbursement_status,
  disbursed_on,
  u.id
FROM grant_ids g, sample_user u, (VALUES 
  ('Education Innovation Grant', 'Initial Payment', 125000, 'USD', '2024-02-01'::date, 'released', '2024-01-15'::date),
  ('Education Innovation Grant', 'Q2 Milestone', 125000, 'USD', '2024-05-01'::date, 'released', '2024-04-28'::date),
  ('Education Innovation Grant', 'Q3 Milestone', 125000, 'USD', '2024-08-01'::date, 'pending', null),
  ('Education Innovation Grant', 'Final Payment', 125000, 'USD', '2024-11-01'::date, 'pending', null),
  ('Health Access Initiative', 'Advance Payment', 187500, 'USD', '2024-03-15'::date, 'released', '2024-03-10'::date),
  ('Health Access Initiative', 'Mid-term Payment', 375000, 'USD', '2024-09-01'::date, 'pending', null),
  ('Health Access Initiative', 'Final Payment', 187500, 'USD', '2025-12-01'::date, 'pending', null),
  ('Environmental Conservation Program', 'Year 1 Payment', 400000, 'USD', '2024-07-01'::date, 'released', '2024-06-25'::date),
  ('Environmental Conservation Program', 'Year 2 Payment', 400000, 'USD', '2025-07-01'::date, 'pending', null),
  ('Environmental Conservation Program', 'Year 3 Payment', 400000, 'USD', '2026-07-01'::date, 'pending', null),
  ('Women Empowerment Fund', 'Setup Grant', 85000, 'USD', '2024-04-15'::date, 'released', '2024-04-10'::date),
  ('Women Empowerment Fund', 'Program Implementation', 250000, 'USD', '2024-08-01'::date, 'released', '2024-07-30'::date),
  ('Women Empowerment Fund', 'Final Phase', 90000, 'USD', '2025-06-01'::date, 'pending', null)
) AS disbursement_data(grant_name, milestone, amount, currency, due_date, status, disbursed_on)
WHERE g.grant_name = disbursement_data.grant_name;

-- Add sample grant reports
WITH grant_ids AS (
  SELECT id, grant_name FROM grants WHERE grant_name IN (
    'Education Innovation Grant', 
    'Health Access Initiative', 
    'Environmental Conservation Program',
    'Women Empowerment Fund'
  )
),
sample_user AS (SELECT id FROM profiles LIMIT 1)
INSERT INTO grant_reports (
  id, grant_id, report_type, due_date, submitted, status, submitted_date, created_by
)
SELECT 
  gen_random_uuid(),
  g.id,
  report_type,
  due_date,
  submitted,
  status::report_status,
  submitted_date,
  u.id
FROM grant_ids g, sample_user u, (VALUES 
  ('Education Innovation Grant', 'Quarterly Report Q1', '2024-04-30'::date, true, 'submitted', '2024-04-25'::date),
  ('Education Innovation Grant', 'Quarterly Report Q2', '2024-07-31'::date, true, 'submitted', '2024-07-29'::date),
  ('Education Innovation Grant', 'Quarterly Report Q3', '2024-10-31'::date, false, 'overdue', null),
  ('Health Access Initiative', 'Bi-annual Report', '2024-09-30'::date, false, 'overdue', null),
  ('Health Access Initiative', 'Impact Report', '2024-12-31'::date, false, 'upcoming', null),
  ('Environmental Conservation Program', 'Annual Report 2024', '2024-12-31'::date, false, 'upcoming', null),
  ('Environmental Conservation Program', 'Environmental Impact Report', '2024-11-15'::date, false, 'in_progress', null),
  ('Women Empowerment Fund', 'Mid-term Report', '2024-09-30'::date, true, 'submitted', '2024-09-28'::date),
  ('Women Empowerment Fund', 'Financial Report Q2', '2024-07-31'::date, true, 'submitted', '2024-07-30'::date)
) AS report_data(grant_name, report_type, due_date, submitted, status, submitted_date)
WHERE g.grant_name = report_data.grant_name;