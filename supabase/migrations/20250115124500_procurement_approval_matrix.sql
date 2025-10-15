-- Approval matrix & workflows tables
create table if not exists public.procurement_approval_rules (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  rule_code text not null,
  entity_type text not null,
  condition text,
  approver_sequence text[],
  escalation_sla text,
  status text default 'Active',
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.procurement_approval_rules enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='procurement_approval_rules' and policyname='org access') then
    create policy "org access" on public.procurement_approval_rules using (org_id = (current_setting('request.jwt.claims', true)::jsonb ->> 'org_id')::uuid);
  end if;
end $$;


