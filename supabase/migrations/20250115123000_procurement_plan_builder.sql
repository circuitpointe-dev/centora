-- Procurement plan builder core tables
create table if not exists public.procurement_plans (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  title text not null,
  total_planned_spend numeric,
  total_items int,
  pending_items int,
  created_at timestamptz not null default now()
);

create table if not exists public.procurement_plan_items (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  plan_id uuid not null references public.procurement_plans(id) on delete cascade,
  item text not null,
  description text,
  est_cost numeric,
  budget_source text,
  status text,
  planned_date text,
  created_at timestamptz not null default now()
);

alter table public.procurement_plans enable row level security;
alter table public.procurement_plan_items enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename='procurement_plans' and policyname='org access') then
    create policy "org access" on public.procurement_plans using (org_id = (current_setting('request.jwt.claims', true)::jsonb ->> 'org_id')::uuid);
  end if;
  if not exists (select 1 from pg_policies where tablename='procurement_plan_items' and policyname='org access') then
    create policy "org access" on public.procurement_plan_items using (org_id = (current_setting('request.jwt.claims', true)::jsonb ->> 'org_id')::uuid);
  end if;
end $$;


