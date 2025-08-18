-- Update accept_invitation function to accept optional user_id parameter
CREATE OR REPLACE FUNCTION public.accept_invitation(_token text, _user_id uuid DEFAULT auth.uid())
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  _invitation RECORD;
  _role_id UUID;
  _profile_id UUID;
BEGIN
  -- Get invitation details
  SELECT * INTO _invitation
  FROM user_invitations
  WHERE token = _token 
    AND status = 'pending' 
    AND expires_at > now();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid or expired invitation token';
  END IF;

  -- Use provided user_id or fall back to auth.uid()
  _profile_id := COALESCE(_user_id, auth.uid());
  
  IF _profile_id IS NULL THEN
    RAISE EXCEPTION 'No user ID provided and no authenticated user';
  END IF;

  -- Create or update profile
  INSERT INTO profiles (id, org_id, email, full_name, department_id, status, role)
  VALUES (
    _profile_id, 
    _invitation.org_id, 
    _invitation.email, 
    _invitation.full_name, 
    _invitation.department_id, 
    'active',
    'org_member' -- default role for backward compatibility
  )
  ON CONFLICT (id) DO UPDATE SET
    org_id = _invitation.org_id,
    department_id = _invitation.department_id,
    status = 'active';

  -- Assign roles from invitation
  FOREACH _role_id IN ARRAY _invitation.role_ids
  LOOP
    INSERT INTO user_roles (profile_id, role_id, assigned_by)
    VALUES (_profile_id, _role_id, _invitation.invited_by)
    ON CONFLICT (profile_id, role_id) DO NOTHING;
  END LOOP;

  -- Set user access permissions if provided
  IF _invitation.access IS NOT NULL AND _invitation.access != '{}'::jsonb THEN
    PERFORM set_user_access_map(_profile_id, _invitation.access);
  END IF;

  -- Mark invitation as accepted
  UPDATE user_invitations
  SET status = 'accepted', redeemed_at = now()
  WHERE id = _invitation.id;

  RETURN _profile_id;
END;
$function$;