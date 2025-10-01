-- Add sample donors
INSERT INTO donors (org_id, name, status, affiliation, organization_url, currency, created_by, notes)
SELECT 
  o.id as org_id,
  'UN Foundation' as name,
  'active'::donor_status as status,
  'International Development' as affiliation,
  'https://unfoundation.org' as organization_url,
  'USD' as currency,
  p.id as created_by,
  'Major international development donor' as notes
FROM organizations o
CROSS JOIN profiles p
WHERE o.created_at = (SELECT MIN(created_at) FROM organizations)
  AND p.org_id = o.id
  AND NOT EXISTS (SELECT 1 FROM donors WHERE name = 'UN Foundation' AND org_id = o.id)
LIMIT 1;

INSERT INTO donors (org_id, name, status, affiliation, organization_url, currency, created_by, notes)
SELECT 
  o.id as org_id,
  'Gates Foundation' as name,
  'active'::donor_status as status,
  'Global Health & Development' as affiliation,
  'https://gatesfoundation.org' as organization_url,
  'USD' as currency,
  p.id as created_by,
  'Focus on health and poverty alleviation' as notes
FROM organizations o
CROSS JOIN profiles p
WHERE o.created_at = (SELECT MIN(created_at) FROM organizations)
  AND p.org_id = o.id
  AND NOT EXISTS (SELECT 1 FROM donors WHERE name = 'Gates Foundation' AND org_id = o.id)
LIMIT 1;

INSERT INTO donors (org_id, name, status, affiliation, organization_url, currency, created_by, notes)
SELECT 
  o.id as org_id,
  'UK Foreign Office' as name,
  'active'::donor_status as status,
  'Government Agency' as affiliation,
  'https://gov.uk' as organization_url,
  'GBP' as currency,
  p.id as created_by,
  'UK government development funding' as notes
FROM organizations o
CROSS JOIN profiles p
WHERE o.created_at = (SELECT MIN(created_at) FROM organizations)
  AND p.org_id = o.id
  AND NOT EXISTS (SELECT 1 FROM donors WHERE name = 'UK Foreign Office' AND org_id = o.id)
LIMIT 1;

-- Add sample opportunities
INSERT INTO opportunities (org_id, title, donor_id, type, deadline, status, amount, currency, created_by, sector, notes)
SELECT 
  o.id as org_id,
  'DFID Governance Reform Initiative' as title,
  d.id as donor_id,
  'RFP' as type,
  (CURRENT_DATE + INTERVAL '45 days')::date as deadline,
  'To Review' as status,
  500000 as amount,
  'GBP' as currency,
  p.id as created_by,
  'Governance' as sector,
  'Focus on public sector reform and accountability' as notes
FROM organizations o
CROSS JOIN profiles p
CROSS JOIN donors d
WHERE o.created_at = (SELECT MIN(created_at) FROM organizations)
  AND p.org_id = o.id
  AND d.org_id = o.id
  AND d.name = 'UK Foreign Office'
  AND NOT EXISTS (SELECT 1 FROM opportunities WHERE title = 'DFID Governance Reform Initiative')
LIMIT 1;

INSERT INTO opportunities (org_id, title, donor_id, type, deadline, status, amount, currency, created_by, sector, notes)
SELECT 
  o.id as org_id,
  'Global Health Innovation Fund' as title,
  d.id as donor_id,
  'CFP' as type,
  (CURRENT_DATE + INTERVAL '60 days')::date as deadline,
  'In Progress' as status,
  1000000 as amount,
  'USD' as currency,
  p.id as created_by,
  'Health' as sector,
  'Supporting innovative health solutions in developing countries' as notes
FROM organizations o
CROSS JOIN profiles p
CROSS JOIN donors d
WHERE o.created_at = (SELECT MIN(created_at) FROM organizations)
  AND p.org_id = o.id
  AND d.org_id = o.id
  AND d.name = 'Gates Foundation'
  AND NOT EXISTS (SELECT 1 FROM opportunities WHERE title = 'Global Health Innovation Fund')
LIMIT 1;

INSERT INTO opportunities (org_id, title, donor_id, type, deadline, status, amount, currency, created_by, sector, notes)
SELECT 
  o.id as org_id,
  'UN Sustainable Development Initiative' as title,
  d.id as donor_id,
  'LOI' as type,
  (CURRENT_DATE + INTERVAL '30 days')::date as deadline,
  'To Review' as status,
  750000 as amount,
  'USD' as currency,
  p.id as created_by,
  'Education' as sector,
  'Education and capacity building in rural areas' as notes
FROM organizations o
CROSS JOIN profiles p
CROSS JOIN donors d
WHERE o.created_at = (SELECT MIN(created_at) FROM organizations)
  AND p.org_id = o.id
  AND d.org_id = o.id
  AND d.name = 'UN Foundation'
  AND NOT EXISTS (SELECT 1 FROM opportunities WHERE title = 'UN Sustainable Development Initiative')
LIMIT 1;