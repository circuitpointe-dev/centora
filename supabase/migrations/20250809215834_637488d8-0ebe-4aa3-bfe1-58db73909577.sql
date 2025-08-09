
-- Enums
create type public.organization_type as enum ('NGO', 'DONOR');
create type public.app_role as enum ('org_admin', 'org_member');
create type public.module_key as enum (
  'fundraising',
  'grants',
  'documents',
  'programme',
  'procurement',
  'inventory',
  'finance',
  'learning',
  'hr',
  'users'
);

-- Organizations
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type public.organization_type not null,
  primary_currency text not null default 'USD',
  -- Extended address fields (all optional for now)
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  postal_code text,
  country text,
  phone text,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

alter table public.organizations enable row level security;

-- Profiles (1:1 with auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  org_id uuid not null references public.organizations(id) on delete cascade,
  email text not null,
  full_name text,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

-- Organization modules (org subscriptions)
create table public.organization_modules (
  org_id uuid not null references public.organizations(id) on delete cascade,
  module public.module_key not null,
  created_at timestamptz not null default now(),
  primary key (org_id, module)
);

alter table public.organization_modules enable row level security;

-- Helper functions for RLS
create or replace function public.is_org_member(_org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.org_id = _org_id
      and p.id = auth.uid()
  );
$$;

create or replace function public.is_org_admin(_org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.org_id = _org_id
      and p.id = auth.uid()
      and p.role = 'org_admin'
  );
$$;

-- RLS policies

-- Organizations
create policy "Org members can view their organization"
on public.organizations
for select
to authenticated
using (public.is_org_member(id));

create policy "Org admins can update their organization"
on public.organizations
for update
to authenticated
using (public.is_org_admin(id));

create policy "Org admins can delete their organization"
on public.organizations
for delete
to authenticated
using (public.is_org_admin(id));

-- Note: No INSERT policy. Inserts will be done via Edge Function using Service Role.

-- Profiles
create policy "Users can view their own profile"
on public.profiles
for select
to authenticated
using (id = auth.uid());

create policy "Org admins can view profiles in their org"
on public.profiles
for select
to authenticated
using (public.is_org_admin(org_id));

create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (id = auth.uid());

create policy "Org admins can update profiles in their org"
on public.profiles
for update
to authenticated
using (public.is_org_admin(org_id));

-- Note: No INSERT policy. Inserts will be done via Edge Function using Service Role.

-- Organization modules
create policy "Org members can view org modules"
on public.organization_modules
for select
to authenticated
using (public.is_org_member(org_id));

create policy "Org admins can manage org modules"
on public.organization_modules
for all
to authenticated
using (public.is_org_admin(org_id))
with check (public.is_org_admin(org_id));
