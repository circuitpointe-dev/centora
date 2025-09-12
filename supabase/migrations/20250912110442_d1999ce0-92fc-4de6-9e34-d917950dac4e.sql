-- Update list_org_users function to support status and department filtering
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
    LEFT JOIN public.departments d ON d.id = p.department_id
    WHERE (v_is_sa OR p.org_id IS NOT DISTINCT FROM v_org)
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

-- Update count_org_users function to support status and department filtering
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