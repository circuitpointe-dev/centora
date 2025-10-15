-- Requisition detail supportive tables
create table if not exists public.procurement_requisition_workflow (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  requisition_id uuid not null,
  sequence int not null,
  label text not null,
  status text not null default 'pending',
  acted_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists prw_org_req_idx on public.procurement_requisition_workflow(org_id, requisition_id, sequence);

create table if not exists public.procurement_requisition_documents (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  requisition_id uuid not null,
  title text not null,
  url text not null,
  created_at timestamptz not null default now()
);

create index if not exists prd_org_req_idx on public.procurement_requisition_documents(org_id, requisition_id);

create table if not exists public.procurement_requisition_activity (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  requisition_id uuid not null,
  event text not null,
  created_at timestamptz not null default now()
);

create index if not exists pra_org_req_idx on public.procurement_requisition_activity(org_id, requisition_id, created_at desc);

-- Minimal RLS (assumes org_id scoping via policies configured similarly elsewhere)
alter table public.procurement_requisition_workflow enable row level security;
alter table public.procurement_requisition_documents enable row level security;
alter table public.procurement_requisition_activity enable row level security;

-- Replace with your actual auth/org policies; examples below assume a current_setting('request.jwt.claims') ->> 'org_id'
do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'procurement_requisition_workflow' and policyname = 'org access'
  ) then
    create policy "org access" on public.procurement_requisition_workflow
      using (org_id = (current_setting('request.jwt.claims', true)::jsonb ->> 'org_id')::uuid);
  end if;
  if not exists (
    select 1 from pg_policies where tablename = 'procurement_requisition_documents' and policyname = 'org access'
  ) then
    create policy "org access" on public.procurement_requisition_documents
      using (org_id = (current_setting('request.jwt.claims', true)::jsonb ->> 'org_id')::uuid);
  end if;
  if not exists (
    select 1 from pg_policies where tablename = 'procurement_requisition_activity' and policyname = 'org access'
  ) then
    create policy "org access" on public.procurement_requisition_activity
      using (org_id = (current_setting('request.jwt.claims', true)::jsonb ->> 'org_id')::uuid);
  end if;
end $$;


