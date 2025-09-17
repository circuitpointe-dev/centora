-- Insert sample data for Finance & Control module

-- Insert sample financial accounts
INSERT INTO public.financial_accounts (org_id, account_name, account_type, account_code, description, balance, created_by) 
SELECT 
  o.id,
  account_data.name::TEXT,
  account_data.type::TEXT,
  account_data.code::TEXT,
  account_data.description::TEXT,
  account_data.balance::NUMERIC,
  p.id
FROM organizations o
CROSS JOIN (
  VALUES 
    ('Cash - Operating Account', 'asset', '1000', 'Main operating account', 125000),
    ('Accounts Receivable', 'asset', '1200', 'Money owed by donors', 45231),
    ('Program Equipment', 'asset', '1500', 'Equipment for programs', 15000),
    ('Accounts Payable', 'liability', '2000', 'Money owed to suppliers', -8500),
    ('Grants Revenue', 'revenue', '4000', 'Revenue from grants', -180000),
    ('Program Expenses', 'expense', '5000', 'Direct program costs', 95000),
    ('Administrative Expenses', 'expense', '5100', 'Administrative costs', 25000),
    ('Fundraising Expenses', 'expense', '5200', 'Costs for fundraising', 12000)
) AS account_data(name, type, code, description, balance)
JOIN profiles p ON p.org_id = o.id
WHERE p.role = 'org_admin'
LIMIT 1;

-- Insert sample financial projects
INSERT INTO public.financial_projects (org_id, project_name, project_code, description, budget_allocated, budget_spent, start_date, end_date, status, manager_name, created_by)
SELECT 
  o.id,
  project_data.name::TEXT,
  project_data.code::TEXT,
  project_data.description::TEXT,
  project_data.allocated::NUMERIC,
  project_data.spent::NUMERIC,
  project_data.start_date::DATE,
  project_data.end_date::DATE,
  project_data.status::TEXT,
  project_data.manager::TEXT,
  p.id
FROM organizations o
CROSS JOIN (
  VALUES 
    ('Clean Water Initiative', 'CWI2024', 'Providing clean water access to rural communities', 75000, 35000, '2024-01-01', '2024-12-31', 'active', 'Sarah Johnson'),
    ('Education Support Program', 'ESP2024', 'Supporting primary education in underserved areas', 45000, 28000, '2024-02-01', '2024-11-30', 'active', 'Michael Chen'),
    ('Healthcare Mobile Clinic', 'HMC2024', 'Mobile healthcare services for remote areas', 60000, 42000, '2024-03-01', '2024-12-31', 'active', 'Dr. Emily Rodriguez'),
    ('Emergency Relief Fund', 'ERF2024', 'Emergency response and disaster relief', 25000, 8000, '2024-04-01', '2025-03-31', 'active', 'James Wilson'),
    ('Community Center Construction', 'CCC2023', 'Building community centers', 120000, 115000, '2023-06-01', '2024-02-29', 'completed', 'Lisa Thompson'),
    ('Agricultural Training Program', 'ATP2024', 'Training farmers in sustainable practices', 35000, 12000, '2024-05-01', '2024-10-31', 'active', 'Robert Martinez')
) AS project_data(name, code, description, allocated, spent, start_date, end_date, status, manager)
JOIN profiles p ON p.org_id = o.id
WHERE p.role = 'org_admin'
LIMIT 1;

-- Insert sample finance team members
INSERT INTO public.finance_team_members (org_id, full_name, email, position, department, salary, hire_date, status, created_by)
SELECT 
  o.id,
  member_data.name::TEXT,
  member_data.email::TEXT,
  member_data.position::TEXT,
  'Finance'::TEXT,
  member_data.salary::NUMERIC,
  member_data.hire_date::DATE,
  'active'::TEXT,
  p.id
FROM organizations o
CROSS JOIN (
  VALUES 
    ('Sarah Johnson', 'sarah.johnson@foundation.org', 'Chief Financial Officer', 85000, '2022-03-15'),
    ('Michael Chen', 'michael.chen@foundation.org', 'Senior Accountant', 62000, '2023-01-10'),
    ('Emily Rodriguez', 'emily.rodriguez@foundation.org', 'Financial Analyst', 55000, '2023-06-01'),
    ('James Wilson', 'james.wilson@foundation.org', 'Budget Coordinator', 48000, '2023-08-15'),
    ('Lisa Thompson', 'lisa.thompson@foundation.org', 'Accounts Payable Specialist', 42000, '2022-11-20'),
    ('Robert Martinez', 'robert.martinez@foundation.org', 'Financial Controller', 72000, '2021-09-01'),
    ('Anna Davis', 'anna.davis@foundation.org', 'Payroll Specialist', 45000, '2023-04-10'),
    ('David Kim', 'david.kim@foundation.org', 'Tax Compliance Officer', 58000, '2022-07-25')
) AS member_data(name, email, position, salary, hire_date)
JOIN profiles p ON p.org_id = o.id
WHERE p.role = 'org_admin'
LIMIT 1;

-- Insert sample budgets
INSERT INTO public.budgets (org_id, budget_name, fiscal_year, start_date, end_date, total_budget, allocated_budget, spent_amount, status, created_by)
SELECT 
  o.id,
  'FY 2024 Operating Budget'::TEXT,
  2024,
  '2024-01-01'::DATE,
  '2024-12-31'::DATE,
  500000::NUMERIC,
  450000::NUMERIC,
  287500::NUMERIC,
  'active'::TEXT,
  p.id
FROM organizations o
JOIN profiles p ON p.org_id = o.id
WHERE p.role = 'org_admin'
LIMIT 1;

-- Insert recent financial transactions
INSERT INTO public.financial_transactions (org_id, transaction_date, description, reference_number, debit_account_id, credit_account_id, amount, category, created_by)
SELECT 
  o.id,
  CURRENT_DATE - INTERVAL '2 hours',
  'Grant payment received from Foundation X',
  'GR-2024-001',
  (SELECT id FROM financial_accounts WHERE account_code = '1000' AND org_id = o.id LIMIT 1),
  (SELECT id FROM financial_accounts WHERE account_code = '4000' AND org_id = o.id LIMIT 1),
  25000,
  'Grant Revenue',
  p.id
FROM organizations o
JOIN profiles p ON p.org_id = o.id
WHERE p.role = 'org_admin'
LIMIT 1

UNION ALL

SELECT 
  o.id,
  CURRENT_DATE - INTERVAL '4 hours',
  'Program supplies purchase',
  'EX-2024-023',
  (SELECT id FROM financial_accounts WHERE account_code = '5000' AND org_id = o.id LIMIT 1),
  (SELECT id FROM financial_accounts WHERE account_code = '1000' AND org_id = o.id LIMIT 1),
  3500,
  'Program Expenses',
  p.id
FROM organizations o
JOIN profiles p ON p.org_id = o.id
WHERE p.role = 'org_admin'
LIMIT 1

UNION ALL

SELECT 
  o.id,
  CURRENT_DATE - INTERVAL '6 hours',
  'Office rent payment',
  'EX-2024-024',
  (SELECT id FROM financial_accounts WHERE account_code = '5100' AND org_id = o.id LIMIT 1),
  (SELECT id FROM financial_accounts WHERE account_code = '1000' AND org_id = o.id LIMIT 1),
  2800,
  'Administrative Expenses',
  p.id
FROM organizations o
JOIN profiles p ON p.org_id = o.id
WHERE p.role = 'org_admin'
LIMIT 1

UNION ALL

SELECT 
  o.id,
  CURRENT_DATE - INTERVAL '1 day',
  'Fundraising event costs',
  'EX-2024-025',
  (SELECT id FROM financial_accounts WHERE account_code = '5200' AND org_id = o.id LIMIT 1),
  (SELECT id FROM financial_accounts WHERE account_code = '1000' AND org_id = o.id LIMIT 1),
  1200,
  'Fundraising Expenses',
  p.id
FROM organizations o
JOIN profiles p ON p.org_id = o.id
WHERE p.role = 'org_admin'
LIMIT 1;