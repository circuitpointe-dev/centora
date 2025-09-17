-- Add sample grants data for dashboard
INSERT INTO grants (
  org_id,
  grant_name,
  donor_name,
  amount,
  currency,
  start_date,
  end_date,
  status,
  program_area,
  region,
  description,
  created_by
) VALUES 
-- Get the first organization ID and a user ID for the sample data
((SELECT id FROM organizations LIMIT 1), 'Education Access Initiative', 'Global Education Foundation', 250000, 'USD', '2024-01-15'::date, '2026-01-14'::date, 'active', 'Education', 'East Africa', 'Improving access to quality education in rural communities', (SELECT id FROM profiles LIMIT 1)),
((SELECT id FROM organizations LIMIT 1), 'Clean Water Project', 'Water for All Foundation', 180000, 'USD', '2024-03-01'::date, '2025-12-31'::date, 'active', 'Health', 'Southeast Asia', 'Providing clean water access to underserved communities', (SELECT id FROM profiles LIMIT 1)),
((SELECT id FROM organizations LIMIT 1), 'Youth Empowerment Program', 'Future Leaders Trust', 120000, 'USD', '2024-06-01'::date, '2025-05-31'::date, 'active', 'Youth Development', 'South America', 'Empowering young people through skills training and mentorship', (SELECT id FROM profiles LIMIT 1)),
((SELECT id FROM organizations LIMIT 1), 'Agricultural Innovation Grant', 'Sustainable Farming Initiative', 300000, 'USD', '2024-02-01'::date, '2026-01-31'::date, 'active', 'Agriculture', 'West Africa', 'Supporting smallholder farmers with sustainable farming techniques', (SELECT id FROM profiles LIMIT 1)),
((SELECT id FROM organizations LIMIT 1), 'Women Leadership Development', 'Equality Now Foundation', 95000, 'USD', '2024-04-15'::date, '2025-04-14'::date, 'active', 'Gender Equality', 'Middle East', 'Developing women leaders in local communities', (SELECT id FROM profiles LIMIT 1)),
((SELECT id FROM organizations LIMIT 1), 'Digital Literacy Program', 'Tech for Good Alliance', 75000, 'USD', '2024-08-01'::date, '2025-07-31'::date, 'pending', 'Technology', 'Central Asia', 'Teaching digital skills to bridge the technology gap', (SELECT id FROM profiles LIMIT 1));

-- Add some compliance records for these grants
WITH grant_data AS (
  SELECT id, grant_name FROM grants WHERE grant_name IN (
    'Education Access Initiative', 
    'Clean Water Project', 
    'Youth Empowerment Program',
    'Agricultural Innovation Grant',
    'Women Leadership Development',
    'Digital Literacy Program'
  )
)
INSERT INTO grant_compliance (
  grant_id,
  requirement,
  due_date,
  status,
  created_by
) 
SELECT 
  g.id,
  'Quarterly Financial Report',
  '2025-03-31'::date,
  'completed',
  (SELECT id FROM profiles LIMIT 1)
FROM grant_data g
WHERE g.grant_name = 'Education Access Initiative'

UNION ALL

SELECT 
  g.id,
  'Impact Assessment Report',
  '2025-06-30'::date,
  'in_progress',
  (SELECT id FROM profiles LIMIT 1)
FROM grant_data g
WHERE g.grant_name = 'Clean Water Project'

UNION ALL

SELECT 
  g.id,
  'Annual Audit Submission',
  '2024-12-31'::date,
  'overdue',
  (SELECT id FROM profiles LIMIT 1)
FROM grant_data g
WHERE g.grant_name = 'Youth Empowerment Program';

-- Add some disbursement records
WITH grant_data AS (
  SELECT id, grant_name, amount FROM grants WHERE grant_name IN (
    'Education Access Initiative', 
    'Clean Water Project', 
    'Youth Empowerment Program'
  )
)
INSERT INTO grant_disbursements (
  grant_id,
  milestone,
  amount,
  currency,
  due_date,
  status,
  created_by
)
SELECT 
  g.id,
  'Initial Disbursement (40%)',
  g.amount * 0.4,
  'USD',
  '2024-02-01'::date,
  'released',
  (SELECT id FROM profiles LIMIT 1)
FROM grant_data g
WHERE g.grant_name = 'Education Access Initiative'

UNION ALL

SELECT 
  g.id,
  'Mid-term Disbursement (35%)',
  g.amount * 0.35,
  'USD',
  '2024-08-01'::date,
  'released',
  (SELECT id FROM profiles LIMIT 1)
FROM grant_data g
WHERE g.grant_name = 'Education Access Initiative'

UNION ALL

SELECT 
  g.id,
  'Final Disbursement (25%)',
  g.amount * 0.25,
  'USD',
  '2025-02-01'::date,
  'pending',
  (SELECT id FROM profiles LIMIT 1)
FROM grant_data g
WHERE g.grant_name = 'Education Access Initiative'

UNION ALL

SELECT 
  g.id,
  'Phase 1 (50%)',
  g.amount * 0.5,
  'USD',
  '2024-03-15'::date,
  'released',
  (SELECT id FROM profiles LIMIT 1)
FROM grant_data g
WHERE g.grant_name = 'Clean Water Project';

-- Add some report requirements
WITH grant_data AS (
  SELECT id, grant_name FROM grants WHERE grant_name IN (
    'Education Access Initiative', 
    'Clean Water Project', 
    'Youth Empowerment Program'
  )
)
INSERT INTO grant_reports (
  grant_id,
  report_type,
  due_date,
  submitted,
  status,
  created_by
)
SELECT 
  g.id,
  'Quarterly Progress Report',
  '2025-03-31'::date,
  true,
  'submitted',
  (SELECT id FROM profiles LIMIT 1)
FROM grant_data g
WHERE g.grant_name = 'Education Access Initiative'

UNION ALL

SELECT 
  g.id,
  'Annual Impact Report',
  '2025-01-31'::date,
  false,
  'upcoming',
  (SELECT id FROM profiles LIMIT 1)
FROM grant_data g
WHERE g.grant_name = 'Clean Water Project'

UNION ALL

SELECT 
  g.id,
  'Financial Audit Report',
  '2024-12-15'::date,
  false,
  'overdue',
  (SELECT id FROM profiles LIMIT 1)
FROM grant_data g
WHERE g.grant_name = 'Youth Empowerment Program';