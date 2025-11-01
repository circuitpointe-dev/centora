-- HR Compensation & Policies schema

-- Salary Benchmarks
create table if not exists public.hr_salary_benchmarks (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id) on delete cascade,
  role_level text not null,
  location text,
  market_p25 text,
  market_p50 text,
  market_p75 text,
  internal_band text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- HR Policies
create table if not exists public.hr_policies (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id) on delete cascade,
  title text not null,
  category text,
  version text,
  updated_at_date date,
  document_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Policy Acknowledgments (aggregate per policy/org or per employee)
create table if not exists public.hr_policy_acknowledgments (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id) on delete cascade,
  policy_id uuid references public.hr_policies(id) on delete cascade,
  employee_id uuid,
  status text default 'pending' check (status in ('pending','acknowledged','overdue','exempt')),
  acknowledged_at timestamptz,
  last_reminded_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(policy_id, employee_id)
);

-- Add FK to hr_employees if it exists
do $$ begin
  if exists (select 1 from information_schema.tables where table_schema='public' and table_name='hr_employees') then
    alter table public.hr_policy_acknowledgments
      add constraint fk_hr_policy_ack_employee foreign key (employee_id)
      references public.hr_employees(id) on delete cascade;
  end if;
end $$;

-- Indexes
create index if not exists idx_hr_salary_benchmarks_org on public.hr_salary_benchmarks(org_id);
create index if not exists idx_hr_policies_org on public.hr_policies(org_id);
create index if not exists idx_hr_policy_ack_org on public.hr_policy_acknowledgments(org_id);

-- RLS
alter table public.hr_salary_benchmarks enable row level security;
alter table public.hr_policies enable row level security;
alter table public.hr_policy_acknowledgments enable row level security;

create policy "org can read salary benchmarks" on public.hr_salary_benchmarks
  for select using (org_id in (select org_id from public.profiles where id = auth.uid()));
create policy "org can manage salary benchmarks" on public.hr_salary_benchmarks
  for all using (org_id in (select org_id from public.profiles where id = auth.uid()));

create policy "org can read policies" on public.hr_policies
  for select using (org_id in (select org_id from public.profiles where id = auth.uid()));
create policy "org can manage policies" on public.hr_policies
  for all using (org_id in (select org_id from public.profiles where id = auth.uid()));

create policy "org can read policy acks" on public.hr_policy_acknowledgments
  for select using (org_id in (select org_id from public.profiles where id = auth.uid()));
create policy "org can manage policy acks" on public.hr_policy_acknowledgments
  for all using (org_id in (select org_id from public.profiles where id = auth.uid()));

-- updated_at triggers
do $$ begin
  if exists (select 1 from pg_proc where proname = 'update_updated_at_column') then
    create trigger trg_hr_salary_benchmarks_updated before update on public.hr_salary_benchmarks
      for each row execute function update_updated_at_column();
    create trigger trg_hr_policies_updated before update on public.hr_policies
      for each row execute function update_updated_at_column();
    create trigger trg_hr_policy_ack_updated before update on public.hr_policy_acknowledgments
      for each row execute function update_updated_at_column();
  end if;
end $$;


