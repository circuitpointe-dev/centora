-- Improve user stats and department creation to support demo mode and accurate counts

-- 1) Fix get_user_stats to include pending invitations and support demo fallback
CREATE OR REPLACE FUNCTION public.get_user_stats()
RETURNS TABLE(active_users bigint, inactive_users bigint, deactivated_users bigint, pending_invitations bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_org uuid;
  v_is_sa boolean;
BEGIN
  SELECT org_id, is_super_admin INTO v_org, v_is_sa FROM public.profiles WHERE id = auth.uid();

  -- Demo fallback: if caller has no profile/org, use the first org and treat as SA for scoping
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
    (SELECT COUNT(*) FROM scoped WHERE status = 'active')::bigint AS active_users,
    (SELECT COUNT(*) FROM scoped WHERE status = 'inactive')::bigint AS inactive_users,
    (SELECT COUNT(*) FROM scoped WHERE status = 'deactivated')::bigint AS deactivated_users,
    (SELECT COUNT(*) FROM public.user_invitations ui 
       WHERE (v_is_sa OR ui.org_id IS NOT DISTINCT FROM v_org) 
         AND ui.status = 'pending')::bigint AS pending_invitations;
END;
$$;

-- 2) Update create_department to allow demo fallback and a safe creator fallback
CREATE OR REPLACE FUNCTION public.create_department(_name text, _description text DEFAULT NULL::text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _org_id UUID;
  _department_id UUID;
  _creator UUID;
  v_is_sa boolean := false;
BEGIN
  -- Determine org
  SELECT org_id INTO _org_id FROM profiles WHERE id = auth.uid();
  IF _org_id IS NULL THEN
    SELECT id INTO _org_id FROM organizations ORDER BY created_at ASC LIMIT 1;
    v_is_sa := true; -- demo fallback
  END IF;

  -- Ensure caller has permission: allow SA fallback or org admins
  IF NOT (v_is_sa OR is_org_admin(_org_id)) THEN
    RAISE EXCEPTION 'Only organization administrators can create departments';
  END IF;

  -- Pick a creator id if none (needed for created_by)
  SELECT id INTO _creator FROM profiles WHERE org_id = _org_id ORDER BY created_at ASC LIMIT 1;

  INSERT INTO departments (org_id, name, description, created_by)
  VALUES (_org_id, _name, _description, COALESCE(auth.uid(), _creator))
  RETURNING id INTO _department_id;

  RETURN _department_id;
END;
$$;