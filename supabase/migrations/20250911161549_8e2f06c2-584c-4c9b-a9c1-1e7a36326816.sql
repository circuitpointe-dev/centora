-- Fix functions to work in demo (no-auth) mode and remove ambiguous id error
-- 1) Update list_org_users to avoid ambiguous id and support fallback org if auth.uid() is null
CREATE OR REPLACE FUNCTION public.list_org_users(
  _search text DEFAULT NULL::text,
  _page integer DEFAULT 1,
  _page_size integer DEFAULT 8
)
RETURNS TABLE(
  id uuid,
  full_name text,
  email text,
  status text,
  department text,
  modules text[],
  roles text[]
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_org uuid;
  v_is_sa boolean;
  v_caller uuid := auth.uid();
BEGIN
  -- Try to get caller org; if none, fall back to first org (demo mode)
  SELECT p.org_id, COALESCE(p.is_super_admin, false)
  INTO v_org, v_is_sa
  FROM public.profiles p
  WHERE p.id = v_caller;

  IF v_org IS NULL THEN
    SELECT o.id INTO v_org FROM public.organizations o ORDER BY o.created_at ASC LIMIT 1;
    v_is_sa := true; -- demo fallback to allow viewing
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
    WHERE (v_is_sa OR p.org_id IS NOT DISTINCT FROM v_org)
      AND (
        _search IS NULL OR
        to_tsvector('simple', COALESCE(p.full_name,'') || ' ' || p.email) @@ plainto_tsquery('simple', _search)
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
    COALESCE(d.name,'') AS department,
    COALESCE(ARRAY(SELECT om.module::text FROM public.organization_modules om WHERE om.org_id = s.org_id), ARRAY[]::text[]) AS modules,
    ARRAY[]::text[] AS roles
  FROM scoped s
  LEFT JOIN public.departments d ON d.id = s.department_id;
END;
$function$;

-- 2) Update count_org_users with same fallback logic
CREATE OR REPLACE FUNCTION public.count_org_users(
  _search text DEFAULT NULL::text
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
  SELECT p.org_id, COALESCE(p.is_super_admin, false)
  INTO v_org, v_is_sa
  FROM public.profiles p
  WHERE p.id = v_caller;

  IF v_org IS NULL THEN
    SELECT o.id INTO v_org FROM public.organizations o ORDER BY o.created_at ASC LIMIT 1;
    v_is_sa := true; -- demo fallback
  END IF;

  SELECT COUNT(*)::bigint INTO v_count
  FROM public.profiles p
  LEFT JOIN public.departments d ON d.id = p.department_id
  WHERE (v_is_sa OR p.org_id IS NOT DISTINCT FROM v_org)
    AND (
      _search IS NULL OR
      to_tsvector('simple', COALESCE(p.full_name,'') || ' ' || p.email || ' ' || COALESCE(d.name,'')) @@ plainto_tsquery('simple', _search)
    );

  RETURN v_count;
END;
$function$;

-- 3) Update get_departments to use fallback org when not authenticated
CREATE OR REPLACE FUNCTION public.get_departments()
RETURNS TABLE(id uuid, name text, description text, created_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _org_id uuid;
BEGIN
  SELECT org_id INTO _org_id FROM profiles WHERE id = auth.uid();

  IF _org_id IS NULL THEN
    SELECT id INTO _org_id FROM organizations ORDER BY created_at ASC LIMIT 1;
  END IF;

  RETURN QUERY
  SELECT d.id, d.name, d.description, d.created_at
  FROM departments d
  WHERE d.org_id = _org_id
  ORDER BY d.name;
END;
$function$;

-- 4) Update get_user_stats to use fallback org when not authenticated
CREATE OR REPLACE FUNCTION public.get_user_stats()
RETURNS TABLE(active_users bigint, inactive_users bigint, deactivated_users bigint, pending_invitations bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_org uuid;
  v_is_sa boolean;
BEGIN
  SELECT org_id, is_super_admin INTO v_org, v_is_sa FROM public.profiles WHERE id = auth.uid();

  IF v_org IS NULL THEN
    SELECT id INTO v_org FROM public.organizations ORDER BY created_at ASC LIMIT 1;
    v_is_sa := true;
  END IF;

  RETURN QUERY
  WITH scoped AS (
    SELECT p.* FROM public.profiles p
    WHERE (v_is_sa OR p.org_id IS NOT DISTINCT FROM v_org)
  )
  SELECT
    (SELECT COUNT(*) FROM scoped WHERE status = 'active') AS active_users,
    (SELECT COUNT(*) FROM scoped WHERE status = 'inactive') AS inactive_users,
    (SELECT COUNT(*) FROM scoped WHERE status = 'deactivated') AS deactivated_users,
    0::bigint AS pending_invitations;
END;
$function$;