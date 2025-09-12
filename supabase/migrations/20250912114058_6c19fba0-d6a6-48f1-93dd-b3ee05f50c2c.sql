-- Update create_user_invitation to allow super admin/demo fallback like other RPCs
CREATE OR REPLACE FUNCTION public.create_user_invitation(
  _email text,
  _full_name text,
  _department_id uuid DEFAULT NULL::uuid,
  _role_ids uuid[] DEFAULT '{}'::uuid[],
  _access jsonb DEFAULT NULL::jsonb
)
RETURNS TABLE(id uuid, token text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _org_id UUID;
  _invitation_id UUID;
  _invitation_token TEXT;
  v_is_sa BOOLEAN := false;
BEGIN
  -- Determine caller's org with demo fallback (consistent with other RPCs)
  SELECT p.org_id, COALESCE(p.is_super_admin, false)
  INTO _org_id, v_is_sa
  FROM public.profiles p
  WHERE p.id = auth.uid();

  IF _org_id IS NULL THEN
    SELECT o.id INTO _org_id FROM public.organizations o ORDER BY o.created_at ASC LIMIT 1;
    v_is_sa := true; -- demo fallback to allow working flows in preview
  END IF;

  -- Permission check: allow org admins or super admins
  IF NOT (v_is_sa OR is_org_admin(_org_id)) THEN
    RAISE EXCEPTION 'Only organization administrators can create invitations';
  END IF;

  -- Generate secure random token
  _invitation_token := encode(gen_random_bytes(32), 'base64');

  -- Insert invitation
  INSERT INTO user_invitations (
    org_id, email, full_name, department_id, role_ids, access, token, invited_by
  ) VALUES (
    _org_id, lower(_email), _full_name, _department_id, _role_ids, _access, _invitation_token, auth.uid()
  ) RETURNING user_invitations.id INTO _invitation_id;

  RETURN QUERY SELECT _invitation_id, _invitation_token;
END;
$function$;