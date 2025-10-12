-- Insert sample funding cycles for existing donors
-- Get the org_id and donor_ids first, then insert sample funding cycles

-- Sample 1: UNICEF - Q1 2025 (January to March)
INSERT INTO donor_funding_cycles (
  donor_id,
  org_id,
  name,
  status,
  start_month,
  end_month,
  year,
  description,
  color,
  created_by
)
SELECT 
  id,
  org_id,
  'Q1 2025 Education Grant',
  'ongoing',
  1,
  3,
  2025,
  'First quarter education funding cycle',
  '#10B981',
  created_by
FROM donors 
WHERE name = 'UNICEF' 
LIMIT 1;

-- Sample 2: USAID - Q2 2025 (April to June)
INSERT INTO donor_funding_cycles (
  donor_id,
  org_id,
  name,
  status,
  start_month,
  end_month,
  year,
  description,
  color,
  created_by
)
SELECT 
  id,
  org_id,
  'Q2 2025 Health Program',
  'upcoming',
  4,
  6,
  2025,
  'Second quarter health initiative funding',
  '#F59E0B',
  created_by
FROM donors 
WHERE name = 'USAID' 
LIMIT 1;

-- Sample 3: World Bank - Full Year 2025 (January to December)
INSERT INTO donor_funding_cycles (
  donor_id,
  org_id,
  name,
  status,
  start_month,
  end_month,
  year,
  description,
  color,
  created_by
)
SELECT 
  id,
  org_id,
  'Annual Infrastructure Fund 2025',
  'ongoing',
  1,
  12,
  2025,
  'Full year infrastructure development funding',
  '#10B981',
  created_by
FROM donors 
WHERE name = 'World Bank' 
LIMIT 1;

-- Sample 4: Bill & Melinda Gates Foundation - H2 2025 (July to December)
INSERT INTO donor_funding_cycles (
  donor_id,
  org_id,
  name,
  status,
  start_month,
  end_month,
  year,
  description,
  color,
  created_by
)
SELECT 
  id,
  org_id,
  'H2 2025 Healthcare Initiative',
  'upcoming',
  7,
  12,
  2025,
  'Second half healthcare and vaccination program',
  '#F59E0B',
  created_by
FROM donors 
WHERE name = 'Bill & Melinda Gates Foundation' 
LIMIT 1;

-- Sample 5: UNICEF - 2024 Closed Cycle (September to December 2024)
INSERT INTO donor_funding_cycles (
  donor_id,
  org_id,
  name,
  status,
  start_month,
  end_month,
  year,
  description,
  color,
  created_by
)
SELECT 
  id,
  org_id,
  'Q4 2024 Emergency Response',
  'closed',
  9,
  12,
  2024,
  'Fourth quarter 2024 emergency response funding',
  '#6B7280',
  created_by
FROM donors 
WHERE name = 'UNICEF' 
LIMIT 1;