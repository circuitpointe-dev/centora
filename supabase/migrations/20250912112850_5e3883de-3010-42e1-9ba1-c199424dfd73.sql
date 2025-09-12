-- Create admin_update_user function for updating user profiles
CREATE OR REPLACE FUNCTION public.admin_update_user(
  _profile_id uuid,
  _full_name text DEFAULT NULL,
  _department_id uuid DEFAULT NULL,
  _status text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _org_id uuid;
  _caller_org_id uuid;
  _is_sa boolean := false;
BEGIN
  -- Get the target user's org_id
  SELECT org_id INTO _org_id FROM profiles WHERE id = _profile_id;
  
  IF _org_id IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Get caller's org and super admin status
  SELECT p.org_id, COALESCE(p.is_super_admin, false)
  INTO _caller_org_id, _is_sa
  FROM profiles p
  WHERE p.id = auth.uid();
  
  -- Check permissions: super admin OR org admin of same org
  IF NOT (_is_sa OR (_caller_org_id = _org_id AND is_org_admin(_org_id))) THEN
    RAISE EXCEPTION 'Insufficient permissions to update user';
  END IF;
  
  -- Update the profile with provided non-null values
  UPDATE profiles 
  SET 
    full_name = CASE WHEN _full_name IS NOT NULL THEN _full_name ELSE full_name END,
    department_id = CASE WHEN _department_id IS NOT NULL THEN _department_id ELSE department_id END,
    status = CASE WHEN _status IS NOT NULL THEN _status::user_status ELSE status END,
    updated_at = now()
  WHERE id = _profile_id;
  
  RETURN FOUND;
END;
$function$;

-- Create admin_update_user_status function for updating user status
CREATE OR REPLACE FUNCTION public.admin_update_user_status(
  _profile_id uuid,
  _status text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _org_id uuid;
  _caller_org_id uuid;
  _is_sa boolean := false;
BEGIN
  -- Get the target user's org_id
  SELECT org_id INTO _org_id FROM profiles WHERE id = _profile_id;
  
  IF _org_id IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Get caller's org and super admin status
  SELECT p.org_id, COALESCE(p.is_super_admin, false)
  INTO _caller_org_id, _is_sa
  FROM profiles p
  WHERE p.id = auth.uid();
  
  -- Check permissions: super admin OR org admin of same org
  IF NOT (_is_sa OR (_caller_org_id = _org_id AND is_org_admin(_org_id))) THEN
    RAISE EXCEPTION 'Insufficient permissions to update user status';
  END IF;
  
  -- Update the user status
  UPDATE profiles 
  SET 
    status = _status::user_status,
    updated_at = now()
  WHERE id = _profile_id;
  
  RETURN FOUND;
END;
$function$;