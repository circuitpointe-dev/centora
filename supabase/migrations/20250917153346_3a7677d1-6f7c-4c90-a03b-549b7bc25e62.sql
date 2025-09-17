-- Add comprehensive sample grants data for testing and demonstration

-- First, let's get the current organization and user info
-- Insert sample grants with realistic data
INSERT INTO grants (
  id,
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
  track_status,
  next_report_due,
  created_by
) VALUES 
  (
    gen_random_uuid(),
    (SELECT id FROM organizations ORDER BY created_at ASC LIMIT 1),
    'Education Access Initiative',
    'Global Education Foundation',
    250000,
    'USD',
    '2024-01-15',
    '2026-01-14',
    'active',
    'Education',
    'East Africa',
    'Improving access to quality primary education in rural communities through infrastructure development and teacher training programs.',
    'On Track',
    '2024-12-31',
    (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1)
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM organizations ORDER BY created_at ASC LIMIT 1),
    'Healthcare Infrastructure Project',
    'International Health Alliance',
    500000,
    'USD',
    '2024-03-01',
    '2027-02-28',
    'active',
    'Healthcare',
    'West Africa',
    'Building and equipping community health centers to improve healthcare access in underserved areas.',
    'On Track',
    '2024-11-30',
    (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1)
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM organizations ORDER BY created_at ASC LIMIT 1),
    'Water & Sanitation Program',
    'Clean Water Initiative',
    175000,
    'USD',
    '2024-02-01',
    '2025-07-31',
    'active',
    'Water & Sanitation',
    'Central Africa',
    'Providing clean water access and sanitation facilities to rural communities through well drilling and infrastructure development.',
    'Attention Required',
    '2024-10-15',
    (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1)
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM organizations ORDER BY created_at ASC LIMIT 1),
    'Youth Skills Development',
    'Future Leaders Fund',
    125000,
    'USD',
    '2023-09-01',
    '2024-08-31',
    'pending',
    'Skills Training',
    'Southern Africa',
    'Vocational training and skills development program for unemployed youth in urban areas.',
    'Pending Approval',
    '2024-09-30',
    (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1)
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM organizations ORDER BY created_at ASC LIMIT 1),
    'Women Empowerment Initiative',
    'Gender Equality Foundation',
    300000,
    'USD',
    '2023-06-01',
    '2025-05-31',
    'active',
    'Gender Equality',
    'East Africa',
    'Empowering women through microfinance, business training, and leadership development programs.',
    'On Track',
    '2024-12-15',
    (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1)
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM organizations ORDER BY created_at ASC LIMIT 1),
    'Climate Resilience Project',
    'Environmental Action Network',
    400000,
    'USD',
    '2024-04-01',
    '2026-03-31',
    'active',
    'Environment',
    'Horn of Africa',
    'Building climate resilience through sustainable agriculture practices and community adaptation strategies.',
    'On Track',
    '2024-11-01',
    (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1)
  );

-- Add sample compliance requirements for each grant
INSERT INTO grant_compliance (
  id,
  grant_id,
  requirement,
  due_date,
  status,
  evidence_document,
  created_by
) VALUES 
  -- Education Access Initiative compliance
  (
    gen_random_uuid(),
    (SELECT id FROM grants WHERE grant_name = 'Education Access Initiative' LIMIT 1),
    'Baseline Assessment Report',
    '2024-03-15',
    'completed',
    'baseline_assessment_2024.pdf',
    (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1)
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM grants WHERE grant_name = 'Education Access Initiative' LIMIT 1),
    'Quarterly Financial Report Q3',
    '2024-10-31',
    'in_progress',
    NULL,
    (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1)
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM grants WHERE grant_name = 'Education Access Initiative' LIMIT 1),
    'Teacher Training Certification',
    '2024-12-01',
    'in_progress',
    NULL,
    (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1)
  ),
  
  -- Healthcare Infrastructure compliance
  (
    gen_random_uuid(),
    (SELECT id FROM grants WHERE grant_name = 'Healthcare Infrastructure Project' LIMIT 1),
    'Environmental Impact Assessment',
    '2024-05-15',
    'completed',
    'environmental_impact_report.pdf',
    (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1)
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM grants WHERE grant_name = 'Healthcare Infrastructure Project' LIMIT 1),
    'Community Consultation Report',
    '2024-11-30',
    'overdue',
    NULL,
    (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1)
  ),
  
  -- Water & Sanitation compliance
  (
    gen_random_uuid(),
    (SELECT id FROM grants WHERE grant_name = 'Water & Sanitation Program' LIMIT 1),
    'Water Quality Testing Results',
    '2024-09-30',
    'completed',
    'water_quality_results_sept2024.pdf',
    (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1)
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM grants WHERE grant_name = 'Water & Sanitation Program' LIMIT 1),
    'Community Health Training Records',
    '2024-10-15',
    'in_progress',
    NULL,
    (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1)
  );

-- Add sample disbursements for each grant
INSERT INTO grant_disbursements (
  id,
  grant_id,
  milestone,
  amount,
  currency,
  due_date,
  disbursed_on,
  status,
  created_by
) VALUES 
  -- Education Access Initiative disbursements
  (
    gen_random_uuid(),
    (SELECT id FROM grants WHERE grant_name = 'Education Access Initiative' LIMIT 1),
    'Initial Setup & Planning',
    62500,
    'USD',
    '2024-02-01',
    '2024-01-28',
    'released',
    (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1)
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM grants WHERE grant_name = 'Education Access Initiative' LIMIT 1),
    'Teacher Training Phase 1',
    75000,
    'USD',
    '2024-06-01',
    '2024-05-29',
    'released',
    (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1)
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM grants WHERE grant_name = 'Education Access Initiative' LIMIT 1),
    'Infrastructure Development',
    100000,
    'USD',
    '2024-10-01',
    NULL,
    'pending',
    (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1)
  ),
  
  -- Healthcare Infrastructure disbursements
  (
    gen_random_uuid(),
    (SELECT id FROM grants WHERE grant_name = 'Healthcare Infrastructure Project' LIMIT 1),
    'Site Preparation & Permits',
    125000,
    'USD',
    '2024-04-01',
    '2024-03-28',
    'released',
    (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1)
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM grants WHERE grant_name = 'Healthcare Infrastructure Project' LIMIT 1),
    'Construction Phase 1',
    200000,
    'USD',
    '2024-08-01',
    '2024-07-30',
    'released',
    (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1)
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM grants WHERE grant_name = 'Healthcare Infrastructure Project' LIMIT 1),
    'Equipment Procurement',
    175000,
    'USD',
    '2024-12-01',
    NULL,
    'pending',
    (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1)
  ),
  
  -- Water & Sanitation disbursements
  (
    gen_random_uuid(),
    (SELECT id FROM grants WHERE grant_name = 'Water & Sanitation Program' LIMIT 1),
    'Community Engagement & Planning',
    35000,
    'USD',
    '2024-03-01',
    '2024-02-28',
    'released',
    (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1)
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM grants WHERE grant_name = 'Water & Sanitation Program' LIMIT 1),
    'Well Drilling Phase 1',
    70000,
    'USD',
    '2024-07-01',
    '2024-06-28',
    'released',
    (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1)
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM grants WHERE grant_name = 'Water & Sanitation Program' LIMIT 1),
    'Sanitation Infrastructure',
    70000,
    'USD',
    '2024-11-01',
    NULL,
    'pending',
    (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1)
  );

-- Add sample reports for each grant
INSERT INTO grant_reports (
  id,
  grant_id,
  report_type,
  due_date,
  submitted,
  status,
  submitted_date,
  file_name,
  file_path,
  created_by
) VALUES 
  -- Education Access Initiative reports
  (
    gen_random_uuid(),
    (SELECT id FROM grants WHERE grant_name = 'Education Access Initiative' LIMIT 1),
    'Quarterly Progress Report Q1 2024',
    '2024-04-15',
    true,
    'submitted',
    '2024-04-12',
    'education_q1_2024_report.pdf',
    'reports/education/q1_2024.pdf',
    (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1)
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM grants WHERE grant_name = 'Education Access Initiative' LIMIT 1),
    'Mid-Year Financial Report',
    '2024-07-31',
    true,
    'submitted',
    '2024-07-28',
    'education_midyear_financial_2024.pdf',
    'reports/education/midyear_2024.pdf',
    (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1)
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM grants WHERE grant_name = 'Education Access Initiative' LIMIT 1),
    'Quarterly Progress Report Q3 2024',
    '2024-10-15',
    false,
    'upcoming',
    NULL,
    NULL,
    NULL,
    (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1)
  ),
  
  -- Healthcare Infrastructure reports
  (
    gen_random_uuid(),
    (SELECT id FROM grants WHERE grant_name = 'Healthcare Infrastructure Project' LIMIT 1),
    'Quarterly Progress Report Q1 2024',
    '2024-04-15',
    true,
    'submitted',
    '2024-04-10',
    'healthcare_q1_2024_report.pdf',
    'reports/healthcare/q1_2024.pdf',
    (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1)
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM grants WHERE grant_name = 'Healthcare Infrastructure Project' LIMIT 1),
    'Construction Progress Report',
    '2024-09-30',
    false,
    'overdue',
    NULL,
    NULL,
    NULL,
    (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1)
  ),
  
  -- Water & Sanitation reports
  (
    gen_random_uuid(),
    (SELECT id FROM grants WHERE grant_name = 'Water & Sanitation Program' LIMIT 1),
    'Community Impact Assessment',
    '2024-06-30',
    true,
    'submitted',
    '2024-06-25',
    'water_impact_assessment_2024.pdf',
    'reports/water/impact_2024.pdf',
    (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1)
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM grants WHERE grant_name = 'Water & Sanitation Program' LIMIT 1),
    'Technical Progress Report',
    '2024-10-31',
    false,
    'in_progress',
    NULL,
    NULL,
    NULL,
    (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1)
  );