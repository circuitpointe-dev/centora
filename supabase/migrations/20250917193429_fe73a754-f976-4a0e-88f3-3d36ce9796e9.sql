-- Insert sample data for Finance & Control module

-- Insert sample financial accounts
DO $$
DECLARE
    org_record RECORD;
    admin_id UUID;
BEGIN
    -- Get the first organization and admin
    SELECT o.id as org_id, p.id as profile_id
    INTO org_record 
    FROM organizations o
    JOIN profiles p ON p.org_id = o.id
    WHERE p.role = 'org_admin'
    LIMIT 1;
    
    IF org_record IS NOT NULL THEN
        -- Insert financial accounts
        INSERT INTO public.financial_accounts (org_id, account_name, account_type, account_code, description, balance, created_by) VALUES
        (org_record.org_id, 'Cash - Operating Account', 'asset', '1000', 'Main operating account', 125000, org_record.profile_id),
        (org_record.org_id, 'Accounts Receivable', 'asset', '1200', 'Money owed by donors', 45231, org_record.profile_id),
        (org_record.org_id, 'Program Equipment', 'asset', '1500', 'Equipment for programs', 15000, org_record.profile_id),
        (org_record.org_id, 'Accounts Payable', 'liability', '2000', 'Money owed to suppliers', -8500, org_record.profile_id),
        (org_record.org_id, 'Grants Revenue', 'revenue', '4000', 'Revenue from grants', -180000, org_record.profile_id),
        (org_record.org_id, 'Program Expenses', 'expense', '5000', 'Direct program costs', 95000, org_record.profile_id),
        (org_record.org_id, 'Administrative Expenses', 'expense', '5100', 'Administrative costs', 25000, org_record.profile_id),
        (org_record.org_id, 'Fundraising Expenses', 'expense', '5200', 'Costs for fundraising', 12000, org_record.profile_id);

        -- Insert financial projects
        INSERT INTO public.financial_projects (org_id, project_name, project_code, description, budget_allocated, budget_spent, start_date, end_date, status, manager_name, created_by) VALUES
        (org_record.org_id, 'Clean Water Initiative', 'CWI2024', 'Providing clean water access to rural communities', 75000, 35000, '2024-01-01', '2024-12-31', 'active', 'Sarah Johnson', org_record.profile_id),
        (org_record.org_id, 'Education Support Program', 'ESP2024', 'Supporting primary education in underserved areas', 45000, 28000, '2024-02-01', '2024-11-30', 'active', 'Michael Chen', org_record.profile_id),
        (org_record.org_id, 'Healthcare Mobile Clinic', 'HMC2024', 'Mobile healthcare services for remote areas', 60000, 42000, '2024-03-01', '2024-12-31', 'active', 'Dr. Emily Rodriguez', org_record.profile_id),
        (org_record.org_id, 'Emergency Relief Fund', 'ERF2024', 'Emergency response and disaster relief', 25000, 8000, '2024-04-01', '2025-03-31', 'active', 'James Wilson', org_record.profile_id),
        (org_record.org_id, 'Community Center Construction', 'CCC2023', 'Building community centers', 120000, 115000, '2023-06-01', '2024-02-29', 'completed', 'Lisa Thompson', org_record.profile_id),
        (org_record.org_id, 'Agricultural Training Program', 'ATP2024', 'Training farmers in sustainable practices', 35000, 12000, '2024-05-01', '2024-10-31', 'active', 'Robert Martinez', org_record.profile_id);

        -- Insert finance team members
        INSERT INTO public.finance_team_members (org_id, full_name, email, position, department, salary, hire_date, status, created_by) VALUES
        (org_record.org_id, 'Sarah Johnson', 'sarah.johnson@foundation.org', 'Chief Financial Officer', 'Finance', 85000, '2022-03-15', 'active', org_record.profile_id),
        (org_record.org_id, 'Michael Chen', 'michael.chen@foundation.org', 'Senior Accountant', 'Finance', 62000, '2023-01-10', 'active', org_record.profile_id),
        (org_record.org_id, 'Emily Rodriguez', 'emily.rodriguez@foundation.org', 'Financial Analyst', 'Finance', 55000, '2023-06-01', 'active', org_record.profile_id),
        (org_record.org_id, 'James Wilson', 'james.wilson@foundation.org', 'Budget Coordinator', 'Finance', 48000, '2023-08-15', 'active', org_record.profile_id),
        (org_record.org_id, 'Lisa Thompson', 'lisa.thompson@foundation.org', 'Accounts Payable Specialist', 'Finance', 42000, '2022-11-20', 'active', org_record.profile_id),
        (org_record.org_id, 'Robert Martinez', 'robert.martinez@foundation.org', 'Financial Controller', 'Finance', 72000, '2021-09-01', 'active', org_record.profile_id),
        (org_record.org_id, 'Anna Davis', 'anna.davis@foundation.org', 'Payroll Specialist', 'Finance', 45000, '2023-04-10', 'active', org_record.profile_id),
        (org_record.org_id, 'David Kim', 'david.kim@foundation.org', 'Tax Compliance Officer', 'Finance', 58000, '2022-07-25', 'active', org_record.profile_id);

        -- Insert budgets
        INSERT INTO public.budgets (org_id, budget_name, fiscal_year, start_date, end_date, total_budget, allocated_budget, spent_amount, status, created_by) VALUES
        (org_record.org_id, 'FY 2024 Operating Budget', 2024, '2024-01-01', '2024-12-31', 500000, 450000, 287500, 'active', org_record.profile_id);
        
    END IF;
END $$;