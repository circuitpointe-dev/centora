-- Remove demo fallbacks from RPC functions to enforce proper authentication

-- Update list_org_users to require proper authentication
CREATE OR REPLACE FUNCTION public.list_org_users(
  _search text DEFAULT NULL::text,
  _status text DEFAULT NULL::text,
  _department text DEFAULT NULL::text,
  _page integer DEFAULT 1,
  _page_size integer DEFAULT 8
)
RETURNS TABLE(id uuid, full_name text, email text, status text, department text, modules text[], roles text[])
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_org uuid;
  v_is_sa boolean;
  v_caller uuid := auth.uid();
BEGIN
  -- Require authentication
  IF v_caller IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  SELECT p.org_id, COALESCE(p.is_super_admin, false)
  INTO v_org, v_is_sa
  FROM public.profiles p
  WHERE p.id = v_caller;

  -- Require user to have org or be super admin
  IF v_org IS NULL AND NOT v_is_sa THEN
    RAISE EXCEPTION 'User must be associated with an organization';
  END IF;

  RETURN QUERY
  WITH scoped AS (
    SELECT p.id AS profile_id,
           COALESCE(p.full_name, p.email) AS full_name,
           p.email,
           p.status::text AS status,
           p.department_id,
           p.org_id
    FROM public.profiles p
    LEFT JOIN public.departments d ON d.id = p.department_id
    WHERE (v_is_sa OR p.org_id = v_org)
      AND (
        _search IS NULL OR
        to_tsvector('simple', COALESCE(p.full_name,'') || ' ' || p.email || ' ' || COALESCE(d.name,'')) @@ plainto_tsquery('simple', _search)
      )
      AND (
        _status IS NULL OR
        p.status::text = _status
      )
      AND (
        _department IS NULL OR
        COALESCE(d.name, '') = _department OR
        (_department = 'No Department' AND d.name IS NULL)
      )
    ORDER BY COALESCE(p.full_name, p.email)
    OFFSET GREATEST((_page - 1) * _page_size, 0)
    LIMIT _page_size
  )
  SELECT 
    s.profile_id AS id,
    s.full_name,
    s.email,
    s.status,
    COALESCE(d.name,'No Department') AS department,
    COALESCE(ARRAY(SELECT om.module::text FROM public.organization_modules om WHERE om.org_id = s.org_id), ARRAY[]::text[]) AS modules,
    ARRAY[]::text[] AS roles
  FROM scoped s
  LEFT JOIN public.departments d ON d.id = s.department_id;
END;
$function$;

-- Update count_org_users to require proper authentication
CREATE OR REPLACE FUNCTION public.count_org_users(
  _search text DEFAULT NULL::text,
  _status text DEFAULT NULL::text,
  _department text DEFAULT NULL::text
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_org uuid;
  v_is_sa boolean;
  v_caller uuid := auth.uid();
  v_count bigint;
BEGIN
  -- Require authentication
  IF v_caller IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  SELECT p.org_id, COALESCE(p.is_super_admin, false)
  INTO v_org, v_is_sa
  FROM public.profiles p
  WHERE p.id = v_caller;

  -- Require user to have org or be super admin
  IF v_org IS NULL AND NOT v_is_sa THEN
    RAISE EXCEPTION 'User must be associated with an organization';
  END IF;

  SELECT COUNT(*)::bigint INTO v_count
  FROM public.profiles p
  LEFT JOIN public.departments d ON d.id = p.department_id
  WHERE (v_is_sa OR p.org_id = v_org)
    AND (
      _search IS NULL OR
      to_tsvector('simple', COALESCE(p.full_name,'') || ' ' || p.email || ' ' || COALESCE(d.name,'')) @@ plainto_tsquery('simple', _search)
    )
    AND (
      _status IS NULL OR
      p.status::text = _status
    )
    AND (
      _department IS NULL OR
      COALESCE(d.name, '') = _department OR
      (_department = 'No Department' AND d.name IS NULL)
    );

  RETURN v_count;
END;
$function$;

-- Update get_user_stats to require proper authentication
CREATE OR REPLACE FUNCTION public.get_user_stats()
RETURNS TABLE(active_users bigint, inactive_users bigint, deactivated_users bigint, pending_invitations bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_org uuid;
  v_is_sa boolean;
  v_caller uuid := auth.uid();
BEGIN
  -- Require authentication
  IF v_caller IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  SELECT p.org_id, COALESCE(p.is_super_admin, false)
  INTO v_org, v_is_sa
  FROM public.profiles p
  WHERE p.id = v_caller;

  -- Require user to have org or be super admin
  IF v_org IS NULL AND NOT v_is_sa THEN
    RAISE EXCEPTION 'User must be associated with an organization';
  END IF;

  RETURN QUERY
  WITH scoped AS (
    SELECT p.* FROM public.profiles p
    WHERE (v_is_sa OR p.org_id = v_org)
  )
  SELECT
    (SELECT COUNT(*) FROM scoped WHERE status = 'active')::bigint AS active_users,
    (SELECT COUNT(*) FROM scoped WHERE status = 'inactive')::bigint AS inactive_users,
    (SELECT COUNT(*) FROM scoped WHERE status = 'deactivated')::bigint AS deactivated_users,
    (SELECT COUNT(*) FROM public.user_invitations ui 
       WHERE (v_is_sa OR ui.org_id = v_org) 
         AND ui.status = 'pending')::bigint AS pending_invitations;
END;
$function$;

-- Update get_departments to require proper authentication
CREATE OR REPLACE FUNCTION public.get_departments()
RETURNS TABLE(id uuid, name text, description text, created_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _org_id uuid;
  v_caller uuid := auth.uid();
BEGIN
  -- Require authentication
  IF v_caller IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  SELECT p.org_id INTO _org_id FROM profiles p WHERE p.id = v_caller;

  -- Require user to have org
  IF _org_id IS NULL THEN
    RAISE EXCEPTION 'User must be associated with an organization';
  END IF;

  RETURN QUERY
  SELECT d.id, d.name, d.description, d.created_at
  FROM departments d
  WHERE d.org_id = _org_id
  ORDER BY d.name;
END;
$function$;

-- Add sample organizations
INSERT INTO organizations (id, name, type, primary_currency, created_by) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Sample NGO Organization', 'ngo', 'USD', '00000000-0000-0000-0000-000000000101'),
  ('00000000-0000-0000-0000-000000000002', 'Sample Donor Foundation', 'donor', 'USD', '00000000-0000-0000-0000-000000000102')
ON CONFLICT (id) DO NOTHING;

-- Add sample departments
INSERT INTO departments (id, org_id, name, description, created_by) VALUES
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', 'Human Resources', 'HR and talent management', '00000000-0000-0000-0000-000000000101'),
  ('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000001', 'Finance', 'Financial operations and accounting', '00000000-0000-0000-0000-000000000101'),
  ('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000001', 'Programs', 'Program implementation and management', '00000000-0000-0000-0000-000000000101'),
  ('00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000002', 'Grants Management', 'Grant review and disbursement', '00000000-0000-0000-0000-000000000102')
ON CONFLICT (id) DO NOTHING;

-- Add organization modules
INSERT INTO organization_modules (org_id, module) VALUES
  ('00000000-0000-0000-0000-000000000001', 'fundraising'),
  ('00000000-0000-0000-0000-000000000001', 'grants'),
  ('00000000-0000-0000-0000-000000000001', 'documents'),
  ('00000000-0000-0000-0000-000000000001', 'programme'),
  ('00000000-0000-0000-0000-000000000001', 'hr'),
  ('00000000-0000-0000-0000-000000000001', 'users'),
  ('00000000-0000-0000-0000-000000000002', 'fundraising'),
  ('00000000-0000-0000-0000-000000000002', 'grants'),
  ('00000000-0000-0000-0000-000000000002', 'documents'),
  ('00000000-0000-0000-0000-000000000002', 'users')
ON CONFLICT (org_id, module) DO NOTHING;