-- Insert sample organizations if none exist
INSERT INTO organizations (id, name, type, created_at) 
VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'Sample NGO Organization', 'NGO', now())
ON CONFLICT (id) DO NOTHING;

-- Insert sample grants
INSERT INTO grants (
  id, org_id, grant_name, donor_name, amount, currency, 
  start_date, end_date, status, program_area, region, 
  description, created_by, created_at, updated_at
) VALUES 
  (
    '11111111-1111-1111-1111-111111111111',
    '550e8400-e29b-41d4-a716-446655440000',
    'Rural Health Initiative',
    'Global Health Foundation',
    250000,
    'USD',
    '2024-01-01',
    '2025-12-31',
    'active',
    'Health',
    'East Africa',
    'Improving healthcare access in rural communities through mobile clinics and telemedicine',
    (SELECT id FROM profiles LIMIT 1),
    now(),
    now()
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '550e8400-e29b-41d4-a716-446655440000',
    'Education for All Program',
    'Education Excellence Fund',
    180000,
    'USD',
    '2024-03-01',
    '2026-02-28',
    'active',
    'Education',
    'South Asia',
    'Providing quality education to underserved children through innovative learning methods',
    (SELECT id FROM profiles LIMIT 1),
    now(),
    now()
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    '550e8400-e29b-41d4-a716-446655440000',
    'Clean Water Access Project',
    'Water & Sanitation Alliance',
    320000,
    'USD',
    '2024-06-01',
    '2027-05-31',
    'active',
    'Water & Sanitation',
    'West Africa',
    'Building sustainable water infrastructure in rural communities',
    (SELECT id FROM profiles LIMIT 1),
    now(),
    now()
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    '550e8400-e29b-41d4-a716-446655440000',
    'Climate Resilience Initiative',
    'Environmental Impact Foundation',
    450000,
    'USD',
    '2024-09-01',
    '2027-08-31',
    'pending',
    'Environment',
    'Central America',
    'Supporting communities to adapt to climate change through sustainable practices',
    (SELECT id FROM profiles LIMIT 1),
    now(),
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- Insert sample grant reports
INSERT INTO grant_reports (
  id, grant_id, report_type, due_date, status, submitted, 
  submitted_date, file_name, file_path, created_by, created_at, updated_at
) VALUES 
  -- Reports for Rural Health Initiative
  (
    'r1111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'quarterly',
    '2024-04-30',
    'submitted',
    true,
    '2024-04-28',
    'Q1_2024_Health_Report.pdf',
    'reports/rural-health/Q1_2024_Health_Report.pdf',
    (SELECT id FROM profiles LIMIT 1),
    now(),
    now()
  ),
  (
    'r1111112-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'quarterly',
    '2024-07-31',
    'submitted',
    true,
    '2024-07-29',
    'Q2_2024_Health_Report.pdf',
    'reports/rural-health/Q2_2024_Health_Report.pdf',
    (SELECT id FROM profiles LIMIT 1),
    now(),
    now()
  ),
  (
    'r1111113-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'quarterly',
    '2024-10-31',
    'overdue',
    false,
    null,
    null,
    null,
    (SELECT id FROM profiles LIMIT 1),
    now(),
    now()
  ),
  (
    'r1111114-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'annual',
    '2025-01-31',
    'upcoming',
    false,
    null,
    null,
    null,
    (SELECT id FROM profiles LIMIT 1),
    now(),
    now()
  ),
  
  -- Reports for Education Program
  (
    'r2222221-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222',
    'quarterly',
    '2024-06-30',
    'submitted',
    true,
    '2024-06-28',
    'Q2_2024_Education_Report.pdf',
    'reports/education/Q2_2024_Education_Report.pdf',
    (SELECT id FROM profiles LIMIT 1),
    now(),
    now()
  ),
  (
    'r2222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222',
    'quarterly',
    '2024-09-30',
    'in_progress',
    false,
    null,
    null,
    null,
    (SELECT id FROM profiles LIMIT 1),
    now(),
    now()
  ),
  (
    'r2222223-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222',
    'financial',
    '2024-12-31',
    'upcoming',
    false,
    null,
    null,
    null,
    (SELECT id FROM profiles LIMIT 1),
    now(),
    now()
  ),
  
  -- Reports for Water Project
  (
    'r3333331-3333-3333-3333-333333333333',
    '33333333-3333-3333-3333-333333333333',
    'quarterly',
    '2024-09-30',
    'submitted',
    true,
    '2024-09-25',
    'Q3_2024_Water_Report.pdf',
    'reports/water/Q3_2024_Water_Report.pdf',
    (SELECT id FROM profiles LIMIT 1),
    now(),
    now()
  ),
  (
    'r3333332-3333-3333-3333-333333333333',
    '33333333-3333-3333-3333-333333333333',
    'narrative',
    '2024-12-31',
    'in_progress',
    false,
    null,
    null,
    null,
    (SELECT id FROM profiles LIMIT 1),
    now(),
    now()
  ),
  
  -- Reports for Climate Initiative
  (
    'r4444441-4444-4444-4444-444444444444',
    '44444444-4444-4444-4444-444444444444',
    'quarterly',
    '2024-12-31',
    'upcoming',
    false,
    null,
    null,
    null,
    (SELECT id FROM profiles LIMIT 1),
    now(),
    now()
  ),
  (
    'r4444442-4444-4444-4444-444444444444',
    '44444444-4444-4444-4444-444444444444',
    'financial',
    '2025-03-31',
    'upcoming',
    false,
    null,
    null,
    null,
    (SELECT id FROM profiles LIMIT 1),
    now(),
    now()
  )
ON CONFLICT (id) DO NOTHING;