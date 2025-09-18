-- Add sample grants for the user's organization (37a63ffa-6542-427d-9996-1a128709fa68)
-- User ID: 2b857fb7-bf6e-4594-835d-6657832a70f7

INSERT INTO grants (
  id, org_id, grant_name, donor_name, amount, currency, start_date, end_date, 
  status, program_area, region, description, created_by, created_at, updated_at
) VALUES 
(
  gen_random_uuid(),
  '37a63ffa-6542-427d-9996-1a128709fa68',
  'Digital Education Initiative',
  'Gates Foundation',
  500000.00,
  'USD',
  '2024-01-01',
  '2025-12-31',
  'active',
  'Education',
  'West Africa',
  'Providing digital learning tools and infrastructure to underserved communities',
  '2b857fb7-bf6e-4594-835d-6657832a70f7',
  now(),
  now()
),
(
  gen_random_uuid(),
  '37a63ffa-6542-427d-9996-1a128709fa68',
  'Community Health Program',
  'World Health Organization',
  750000.00,
  'USD',
  '2024-03-01',
  '2026-02-28',
  'active',
  'Health',
  'Nigeria',
  'Strengthening primary healthcare systems in rural communities',
  '2b857fb7-bf6e-4594-835d-6657832a70f7',
  now(),
  now()
),
(
  gen_random_uuid(),
  '37a63ffa-6542-427d-9996-1a128709fa68',
  'Clean Water Access Project',
  'UNICEF',
  300000.00,
  'USD',
  '2023-06-01',
  '2024-05-31',
  'closed',
  'Water & Sanitation',
  'Northern Nigeria',
  'Installing clean water systems in 50 rural communities',
  '2b857fb7-bf6e-4594-835d-6657832a70f7',
  now(),
  now()
),
(
  gen_random_uuid(),
  '37a63ffa-6542-427d-9996-1a128709fa68',
  'Women Empowerment Initiative',
  'UN Women',
  200000.00,
  'USD',
  '2024-05-01',
  '2025-04-30',
  'active',
  'Gender Equality',
  'Southwest Nigeria',
  'Skills training and microfinance for rural women entrepreneurs',
  '2b857fb7-bf6e-4594-835d-6657832a70f7',
  now(),
  now()
),
(
  gen_random_uuid(),
  '37a63ffa-6542-427d-9996-1a128709fa68',
  'Youth Employment Program',
  'African Development Bank',
  450000.00,
  'USD',
  '2024-08-01',
  '2026-07-31',
  'pending',
  'Employment',
  'Lagos State',
  'Creating job opportunities for young people through skills development',
  '2b857fb7-bf6e-4594-835d-6657832a70f7',
  now(),
  now()
);

-- Get the grant IDs we just created for adding related data
WITH new_grants AS (
  SELECT id, grant_name FROM grants 
  WHERE org_id = '37a63ffa-6542-427d-9996-1a128709fa68' 
  AND created_by = '2b857fb7-bf6e-4594-835d-6657832a70f7'
  ORDER BY created_at DESC
  LIMIT 5
)

-- Add compliance records for these grants
INSERT INTO grant_compliance (grant_id, requirement, due_date, status, created_by)
SELECT 
  ng.id,
  'Annual Financial Report',
  '2024-12-31',
  'completed',
  '2b857fb7-bf6e-4594-835d-6657832a70f7'
FROM new_grants ng
WHERE ng.grant_name = 'Digital Education Initiative'

UNION ALL

SELECT 
  ng.id,
  'Quarterly Progress Report',
  '2024-12-31',
  'in_progress',
  '2b857fb7-bf6e-4594-835d-6657832a70f7'
FROM new_grants ng
WHERE ng.grant_name = 'Community Health Program'

UNION ALL

SELECT 
  ng.id,
  'Final Project Report',
  '2024-06-30',
  'completed',
  '2b857fb7-bf6e-4594-835d-6657832a70f7'
FROM new_grants ng
WHERE ng.grant_name = 'Clean Water Access Project';

-- Add disbursement records
WITH new_grants AS (
  SELECT id, grant_name FROM grants 
  WHERE org_id = '37a63ffa-6542-427d-9996-1a128709fa68' 
  AND created_by = '2b857fb7-bf6e-4594-835d-6657832a70f7'
  ORDER BY created_at DESC
  LIMIT 5
)

INSERT INTO grant_disbursements (grant_id, milestone, amount, currency, due_date, status, created_by)
SELECT 
  ng.id,
  'Initial disbursement',
  250000.00,
  'USD',
  '2024-01-15',
  'released',
  '2b857fb7-bf6e-4594-835d-6657832a70f7'
FROM new_grants ng
WHERE ng.grant_name = 'Digital Education Initiative'

UNION ALL

SELECT 
  ng.id,
  'Second disbursement',
  375000.00,
  'USD',
  '2024-06-01',
  'released',
  '2b857fb7-bf6e-4594-835d-6657832a70f7'
FROM new_grants ng
WHERE ng.grant_name = 'Community Health Program'

UNION ALL

SELECT 
  ng.id,
  'Final disbursement',
  300000.00,
  'USD',
  '2023-12-01',
  'released',
  '2b857fb7-bf6e-4594-835d-6657832a70f7'
FROM new_grants ng
WHERE ng.grant_name = 'Clean Water Access Project';

-- Add report records
WITH new_grants AS (
  SELECT id, grant_name FROM grants 
  WHERE org_id = '37a63ffa-6542-427d-9996-1a128709fa68' 
  AND created_by = '2b857fb7-bf6e-4594-835d-6657832a70f7'
  ORDER BY created_at DESC
  LIMIT 5
)

INSERT INTO grant_reports (grant_id, report_type, due_date, status, submitted, created_by)
SELECT 
  ng.id,
  'Quarterly Report',
  '2024-12-31',
  'upcoming',
  false,
  '2b857fb7-bf6e-4594-835d-6657832a70f7'
FROM new_grants ng
WHERE ng.grant_name = 'Digital Education Initiative'

UNION ALL

SELECT 
  ng.id,
  'Annual Report',
  '2025-01-15',
  'upcoming',
  false,
  '2b857fb7-bf6e-4594-835d-6657832a70f7'
FROM new_grants ng
WHERE ng.grant_name = 'Community Health Program'

UNION ALL

SELECT 
  ng.id,
  'Final Report',
  '2024-07-15',
  'submitted',
  true,
  '2b857fb7-bf6e-4594-835d-6657832a70f7'
FROM new_grants ng
WHERE ng.grant_name = 'Clean Water Access Project';