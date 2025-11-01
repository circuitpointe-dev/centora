-- Seed HR demo data for Compensation & Policies
-- Ensure minimal HR tables exist for seeding (no-ops if already created by base schema)
create table if not exists public.hr_employees (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id) on delete cascade,
  profile_id uuid,
  employee_id text not null,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  department text,
  position text,
  employment_type text,
  hire_date date,
  termination_date date,
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(org_id, employee_id)
);

create table if not exists public.hr_employee_documents (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id) on delete cascade,
  employee_id uuid,
  document_type text not null,
  document_name text not null,
  document_number text,
  issue_date date,
  expiry_date date,
  document_url text,
  is_expiring_soon boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

do $$
declare v_org uuid;
begin
  select id into v_org from public.organizations order by created_at asc limit 1;
  if v_org is null then
    raise notice 'No organizations found; skipping seed.';
    return;
  end if;

  -- Employees
  insert into public.hr_employees (org_id, employee_id, first_name, last_name, email, department, position, employment_type, hire_date, status)
  values
    (v_org, 'EMP-001', 'Jane', 'Doe', 'jane.doe@example.com', 'Engineering', 'Software Engineer', 'full-time', current_date - interval '400 days', 'active'),
    (v_org, 'EMP-002', 'Ryan', 'Cole', 'ryan.cole@example.com', 'Engineering', 'DevOps Engineer', 'full-time', current_date - interval '300 days', 'active'),
    (v_org, 'EMP-003', 'Maria', 'Garcia', 'maria.garcia@example.com', 'HR', 'HR Manager', 'full-time', current_date - interval '500 days', 'active'),
    (v_org, 'EMP-004', 'Alex', 'Brown', 'alex.brown@example.com', 'Sales', 'Account Executive', 'full-time', current_date - interval '600 days', 'inactive')
  on conflict do nothing;

  -- Docs
  insert into public.hr_employee_documents (org_id, employee_id, document_type, document_name, document_number, issue_date, expiry_date)
  select v_org, e.id, d.type, d.name, d.num, d.issue_date, d.expiry_date
  from (
    values
      ('EMP-001','license','Work permit','WP-2024-8834', current_date - interval '330 days', current_date + interval '30 days'),
      ('EMP-002','id','ID Card','ID-2024-8834', current_date - interval '365 days', current_date + interval '365 days'),
      ('EMP-003','certification','Professional License','LIC-2024-8834', current_date - interval '700 days', current_date + interval '60 days'),
      ('EMP-004','passport','Passport','PPT-2024-8834', current_date - interval '1200 days', current_date - interval '10 days')
  ) as d(emp_code, type, name, num, issue_date, expiry_date)
  join public.hr_employees e on e.org_id = v_org and e.employee_id = d.emp_code
  on conflict do nothing;

  -- Benchmarks
  insert into public.hr_salary_benchmarks (org_id, role_level, location, market_p25, market_p50, market_p75, internal_band)
  values
    (v_org, 'SE II (L5)', 'Lagos', '7.2m NGN', '8.5m NGN', '9.8m NGN', '7.0m NGN - 9.5m NGN'),
    (v_org, 'Product manager (L6)', 'Nairobi', '3.2m KES', '4.1m KES', '5.0m KES', '7.0m NGN - 9.5m NGN'),
    (v_org, 'Data analyst (L4)', 'Accra', '85k GHS', '105k GHS', '125k GHS', '7.0m NGN - 9.5m NGN'),
    (v_org, 'Operation lead (L5)', 'Kampala', '85.0m UGX', '100.0m UGX', '115.0m UGX', '7.0m NGN - 9.5m NGN')
  on conflict do nothing;

  -- Policies
  insert into public.hr_policies (org_id, title, category, version, updated_at_date)
  values
    (v_org, 'Code of conduct', 'Ethics', 'v3', current_date - interval '120 days'),
    (v_org, 'Data privacy policy', 'Compliance', 'v2', current_date - interval '70 days'),
    (v_org, 'Incident response plan', 'Security', 'v4', current_date - interval '50 days'),
    (v_org, 'Remote work guidelines', 'HR', 'v3', current_date - interval '10 days'),
    (v_org, 'Diversity and inclusion policy', 'Culture', 'v1', current_date - interval '20 days')
  on conflict do nothing;

  -- Acknowledgments (sample)
  insert into public.hr_policy_acknowledgments (org_id, policy_id, employee_id, status, acknowledged_at)
  select v_org, p.id, e.id, 'acknowledged', now()
  from public.hr_policies p
  join public.hr_employees e on e.org_id = v_org and e.employee_id in ('EMP-001','EMP-002')
  where p.org_id = v_org and p.title = 'Code of conduct'
  on conflict do nothing;

  insert into public.hr_policy_acknowledgments (org_id, policy_id, employee_id, status)
  select v_org, p.id, e.id, 'pending'
  from public.hr_policies p
  join public.hr_employees e on e.org_id = v_org and e.employee_id = 'EMP-002'
  where p.org_id = v_org and p.title = 'Data privacy policy'
  on conflict do nothing;
end $$;


