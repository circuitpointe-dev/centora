-- Vendor management core tables

create table if not exists public.vendors (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  name text not null,
  email text,
  phone text,
  category text,
  status text default 'Active',
  rating numeric,
  address text,
  city text,
  country text,
  risk_score numeric default 0,
  vetting_status text default 'Pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vendor_documents (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  title text not null,
  type text,
  url text not null,
  status text default 'Valid',
  expires_at date,
  uploaded_at timestamptz not null default now()
);

create table if not exists public.vendor_contracts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  contract_code text not null,
  title text not null,
  start_date date,
  end_date date,
  value numeric,
  currency text,
  status text default 'Active',
  terms text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vendor_performance (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  period_start date not null,
  period_end date not null,
  delivery_score numeric,
  quality_score numeric,
  cost_score numeric,
  overall_score numeric,
  notes text,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.vendors enable row level security;
alter table public.vendor_documents enable row level security;
alter table public.vendor_contracts enable row level security;
alter table public.vendor_performance enable row level security;

-- Policies: select/insert/update restricted by org_id in JWT claims
do $$ begin
  -- vendors
  if not exists (select 1 from pg_policies where tablename='vendors' and policyname='vendors select') then
    create policy "vendors select" on public.vendors
      for select using (org_id = (current_setting('request.jwt.claims', true)::jsonb ->> 'org_id')::uuid);
  end if;
  if not exists (select 1 from pg_policies where tablename='vendors' and policyname='vendors insert') then
    create policy "vendors insert" on public.vendors
      for insert with check (org_id = (current_setting('request.jwt.claims', true)::jsonb ->> 'org_id')::uuid);
  end if;
  if not exists (select 1 from pg_policies where tablename='vendors' and policyname='vendors update') then
    create policy "vendors update" on public.vendors
      for update using (org_id = (current_setting('request.jwt.claims', true)::jsonb ->> 'org_id')::uuid)
      with check (org_id = (current_setting('request.jwt.claims', true)::jsonb ->> 'org_id')::uuid);
  end if;

  -- vendor_documents
  if not exists (select 1 from pg_policies where tablename='vendor_documents' and policyname='vendor_documents select') then
    create policy "vendor_documents select" on public.vendor_documents
      for select using (org_id = (current_setting('request.jwt.claims', true)::jsonb ->> 'org_id')::uuid);
  end if;
  if not exists (select 1 from pg_policies where tablename='vendor_documents' and policyname='vendor_documents insert') then
    create policy "vendor_documents insert" on public.vendor_documents
      for insert with check (org_id = (current_setting('request.jwt.claims', true)::jsonb ->> 'org_id')::uuid);
  end if;
  if not exists (select 1 from pg_policies where tablename='vendor_documents' and policyname='vendor_documents update') then
    create policy "vendor_documents update" on public.vendor_documents
      for update using (org_id = (current_setting('request.jwt.claims', true)::jsonb ->> 'org_id')::uuid)
      with check (org_id = (current_setting('request.jwt.claims', true)::jsonb ->> 'org_id')::uuid);
  end if;

  -- vendor_contracts
  if not exists (select 1 from pg_policies where tablename='vendor_contracts' and policyname='vendor_contracts select') then
    create policy "vendor_contracts select" on public.vendor_contracts
      for select using (org_id = (current_setting('request.jwt.claims', true)::jsonb ->> 'org_id')::uuid);
  end if;
  if not exists (select 1 from pg_policies where tablename='vendor_contracts' and policyname='vendor_contracts insert') then
    create policy "vendor_contracts insert" on public.vendor_contracts
      for insert with check (org_id = (current_setting('request.jwt.claims', true)::jsonb ->> 'org_id')::uuid);
  end if;
  if not exists (select 1 from pg_policies where tablename='vendor_contracts' and policyname='vendor_contracts update') then
    create policy "vendor_contracts update" on public.vendor_contracts
      for update using (org_id = (current_setting('request.jwt.claims', true)::jsonb ->> 'org_id')::uuid)
      with check (org_id = (current_setting('request.jwt.claims', true)::jsonb ->> 'org_id')::uuid);
  end if;

  -- vendor_performance
  if not exists (select 1 from pg_policies where tablename='vendor_performance' and policyname='vendor_performance select') then
    create policy "vendor_performance select" on public.vendor_performance
      for select using (org_id = (current_setting('request.jwt.claims', true)::jsonb ->> 'org_id')::uuid);
  end if;
  if not exists (select 1 from pg_policies where tablename='vendor_performance' and policyname='vendor_performance insert') then
    create policy "vendor_performance insert" on public.vendor_performance
      for insert with check (org_id = (current_setting('request.jwt.claims', true)::jsonb ->> 'org_id')::uuid);
  end if;
  if not exists (select 1 from pg_policies where tablename='vendor_performance' and policyname='vendor_performance update') then
    create policy "vendor_performance update" on public.vendor_performance
      for update using (org_id = (current_setting('request.jwt.claims', true)::jsonb ->> 'org_id')::uuid)
      with check (org_id = (current_setting('request.jwt.claims', true)::jsonb ->> 'org_id')::uuid);
  end if;
end $$;


