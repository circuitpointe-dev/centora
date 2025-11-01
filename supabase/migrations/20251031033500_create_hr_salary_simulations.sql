-- Salary simulations record table
create table if not exists public.hr_salary_simulations (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id) on delete cascade,
  employee_id uuid references public.hr_employees(id) on delete set null,
  role_level text,
  location text,
  current_salary numeric,
  proposed_salary numeric,
  market_p50 text,
  internal_band text,
  compa_ratio numeric,
  created_at timestamptz default now()
);

alter table public.hr_salary_simulations enable row level security;

create policy "org can manage salary simulations" on public.hr_salary_simulations
  for all using (org_id in (select org_id from public.profiles where id = auth.uid()));


