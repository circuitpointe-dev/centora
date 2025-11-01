-- Seed additional HR Compensation & Policies data for abubakarsa242@gmail.com
-- Adds more policies, acknowledgments (including overdue), and documents
do $$
declare v_email text := 'abubakarsa242@gmail.com';
declare v_org uuid;
declare v_policy_code_conduct uuid;
declare v_policy_privacy uuid;
declare v_policy_incident uuid;
declare v_policy_remote uuid;
declare v_policy_diversity uuid;
declare v_policy_sales uuid;
declare v_policy_support uuid;
declare v_policy_dev uuid;
declare v_policy_finance uuid;
declare v_emp_101 uuid;
declare v_emp_102 uuid;
declare v_emp_103 uuid;
declare v_emp_104 uuid;
begin
  select org_id into v_org from public.profiles where email = v_email limit 1;
  if v_org is null then
    raise notice 'No org found for %; skipping additional seed.', v_email;
    return;
  end if;

  -- Get policy IDs
  select id into v_policy_code_conduct from public.hr_policies where org_id = v_org and title = 'Code of conduct' limit 1;
  select id into v_policy_privacy from public.hr_policies where org_id = v_org and title = 'Data privacy policy' limit 1;
  select id into v_policy_incident from public.hr_policies where org_id = v_org and title = 'Incident response plan' limit 1;
  select id into v_policy_remote from public.hr_policies where org_id = v_org and title = 'Remote work guidelines' limit 1;
  select id into v_policy_diversity from public.hr_policies where org_id = v_org and title = 'Diversity and inclusion policy' limit 1;

  -- Add more policies (insert separately to avoid returning multiple rows issue)
  insert into public.hr_policies (org_id, title, category, version, updated_at_date)
  values (v_org, 'Customer feedback policy', 'Support', 'v1', current_date - interval '90 days')
  on conflict do nothing;

  insert into public.hr_policies (org_id, title, category, version, updated_at_date)
  values (v_org, 'Project updates guidelines', 'Development', 'v2', current_date - interval '45 days')
  on conflict do nothing;

  insert into public.hr_policies (org_id, title, category, version, updated_at_date)
  values (v_org, 'Budget review process', 'Finance', 'v1', current_date - interval '60 days')
  on conflict do nothing;

  -- Get policy IDs
  select id into v_policy_sales from public.hr_policies where org_id = v_org and title = 'Customer feedback policy' limit 1;
  select id into v_policy_dev from public.hr_policies where org_id = v_org and title = 'Project updates guidelines' limit 1;
  select id into v_policy_finance from public.hr_policies where org_id = v_org and title = 'Budget review process' limit 1;

  -- Get employee IDs
  select id into v_emp_101 from public.hr_employees where org_id = v_org and employee_id = 'EMP-101' limit 1;
  select id into v_emp_102 from public.hr_employees where org_id = v_org and employee_id = 'EMP-102' limit 1;
  select id into v_emp_103 from public.hr_employees where org_id = v_org and employee_id = 'EMP-103' limit 1;
  select id into v_emp_104 from public.hr_employees where org_id = v_org and employee_id = 'EMP-104' limit 1;

  -- Create additional employees if needed for more acknowledgments
  insert into public.hr_employees (org_id, employee_id, first_name, last_name, email, department, position, employment_type, hire_date, status)
  values
    (v_org, 'EMP-105', 'Sarah', 'Johnson', 'sarah.johnson@example.com', 'Sales', 'Sales Manager', 'full-time', current_date - interval '200 days', 'active'),
    (v_org, 'EMP-106', 'Tom', 'Williams', 'tom.williams@example.com', 'Support', 'Support Lead', 'full-time', current_date - interval '180 days', 'active'),
    (v_org, 'EMP-107', 'Lisa', 'Anderson', 'lisa.anderson@example.com', 'Development', 'Product Manager', 'full-time', current_date - interval '150 days', 'active'),
    (v_org, 'EMP-108', 'Mike', 'Davis', 'mike.davis@example.com', 'Finance', 'Finance Manager', 'full-time', current_date - interval '300 days', 'active')
  on conflict do nothing;

  -- Add acknowledgments for Code of conduct (Sales) - 124 assigned, 121 acknowledged, 3 overdue
  insert into public.hr_policy_acknowledgments (org_id, policy_id, employee_id, status, acknowledged_at, last_reminded_at)
  select v_org, v_policy_code_conduct, e.id, 
    case 
      when e.employee_id in ('EMP-105', 'EMP-108', 'EMP-109') then 'overdue'
      when e.employee_id in ('EMP-106') then 'pending'
      else 'acknowledged'
    end,
    case when e.employee_id not in ('EMP-105', 'EMP-108', 'EMP-109', 'EMP-106') then now() - interval '60 days' else null end,
    case when e.employee_id in ('EMP-105', 'EMP-108', 'EMP-109') then now() - interval '15 days' else null end
  from public.hr_employees e
  where e.org_id = v_org and e.employee_id like 'EMP-%'
  limit 124
  on conflict (policy_id, employee_id) do nothing;

  -- Add acknowledgments for Customer feedback (Support) - 88 assigned, 71 acknowledged, 17 overdue
  insert into public.hr_policy_acknowledgments (org_id, policy_id, employee_id, status, acknowledged_at, last_reminded_at)
  select v_org, v_policy_sales, e.id,
    case 
      when row_number() over () <= 17 then 'overdue'
      when row_number() over () <= 71 then 'acknowledged'
      else 'pending'
    end,
    case when row_number() over () > 17 and row_number() over () <= 71 then now() - interval '30 days' else null end,
    case when row_number() over () <= 17 then now() - interval '15 days' else null end
  from public.hr_employees e
  where e.org_id = v_org and e.employee_id like 'EMP-%'
  limit 88
  on conflict (policy_id, employee_id) do nothing;

  -- Add acknowledgments for Project updates (Development) - 24 assigned, 24 acknowledged, 0 overdue
  insert into public.hr_policy_acknowledgments (org_id, policy_id, employee_id, status, acknowledged_at, last_reminded_at)
  select v_org, v_policy_dev, e.id, 'acknowledged', now() - interval '20 days', null
  from public.hr_employees e
  where e.org_id = v_org and e.employee_id like 'EMP-%'
  limit 24
  on conflict (policy_id, employee_id) do nothing;

  -- Add acknowledgments for Budget review (Finance) - 42 assigned, 39 acknowledged, 3 overdue
  insert into public.hr_policy_acknowledgments (org_id, policy_id, employee_id, status, acknowledged_at, last_reminded_at)
  select v_org, v_policy_finance, e.id,
    case 
      when row_number() over () <= 3 then 'overdue'
      when row_number() over () <= 39 then 'acknowledged'
      else 'pending'
    end,
    case when row_number() over () > 3 and row_number() over () <= 39 then now() - interval '45 days' else null end,
    case when row_number() over () <= 3 then now() - interval '20 days' else null end
  from public.hr_employees e
  where e.org_id = v_org and e.employee_id like 'EMP-%'
  limit 42
  on conflict (policy_id, employee_id) do nothing;

  -- Add more employee documents (expiring/expired)
  insert into public.hr_employee_documents (org_id, employee_id, document_type, document_name, document_number, issue_date, expiry_date)
  select v_org, e.id, d.type, d.name, d.num, d.issue_date, d.expiry_date
  from (
    values
      ('EMP-105','passport','Passport','PPT-2023-4567', current_date - interval '700 days', current_date + interval '45 days'),
      ('EMP-106','license','Work permit','WP-2024-5678', current_date - interval '200 days', current_date + interval '20 days'),
      ('EMP-107','certification','Professional License','LIC-2024-6789', current_date - interval '150 days', current_date - interval '5 days'),
      ('EMP-108','id','ID Card','ID-2024-7890', current_date - interval '300 days', current_date + interval '180 days')
  ) as d(emp_code, type, name, num, issue_date, expiry_date)
  join public.hr_employees e on e.org_id = v_org and e.employee_id = d.emp_code
  on conflict do nothing;

  raise notice 'Additional HR seed data added for org %.', v_org;
end $$;

