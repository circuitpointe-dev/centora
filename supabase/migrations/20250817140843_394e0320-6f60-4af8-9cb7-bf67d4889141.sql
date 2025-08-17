-- Phase 2: Data Migration & Seeding, and RPC Functions

-- First, create default roles and departments for existing organizations
-- Insert default departments for all existing organizations
INSERT INTO departments (org_id, name, description, created_by)
SELECT 
  o.id as org_id,
  'General' as name,
  'Default department for organization members' as description,
  o.created_by as created_by
FROM organizations o
WHERE NOT EXISTS (
  SELECT 1 FROM departments d WHERE d.org_id = o.id AND d.name = 'General'
);

-- Insert default roles for all existing organizations
INSERT INTO roles (org_id, name, description, created_by)
SELECT 
  o.id as org_id,
  role_name,
  role_description,
  o.created_by as created_by
FROM organizations o
CROSS JOIN (
  VALUES 
    ('Org Admin', 'Full administrative access to the organization'),
    ('Editor', 'Can create and edit content, manage projects'),
    ('Viewer', 'Read-only access to view organization data')
) AS default_roles(role_name, role_description)
WHERE NOT EXISTS (
  SELECT 1 FROM roles r WHERE r.org_id = o.id AND r.name = default_roles.role_name
);

-- Migrate existing profiles.role to user_roles table
INSERT INTO user_roles (profile_id, role_id, assigned_by)
SELECT 
  p.id as profile_id,
  r.id as role_id,
  p.id as assigned_by -- self-assigned for migration
FROM profiles p
JOIN roles r ON r.org_id = p.org_id
WHERE p.role = 'org_admin' AND r.name = 'Org Admin'
   OR p.role = 'org_member' AND r.name = 'Editor'
ON CONFLICT (profile_id, role_id) DO NOTHING;

-- Update profiles to set department_id to default General department
UPDATE profiles 
SET department_id = d.id
FROM departments d
WHERE profiles.org_id = d.org_id 
  AND d.name = 'General'
  AND profiles.department_id IS NULL;

-- Create RPC Functions for Admin UI

-- Function to get user statistics for dashboard
CREATE OR REPLACE FUNCTION get_user_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _org_id UUID;
  _result JSON;
BEGIN
  _org_id := current_org_id();
  
  IF _org_id IS NULL THEN
    RAISE EXCEPTION 'User not associated with any organization';
  END IF;

  SELECT json_build_object(
    'active_users', COALESCE(active.count, 0),
    'inactive_users', COALESCE(inactive.count, 0),
    'deactivated_users', COALESCE(deactivated.count, 0),
    'pending_invitations', COALESCE(pending.count, 0)
  ) INTO _result
  FROM (
    SELECT COUNT(*) as count 
    FROM profiles 
    WHERE org_id = _org_id AND status = 'active'
  ) active
  CROSS JOIN (
    SELECT COUNT(*) as count 
    FROM profiles 
    WHERE org_id = _org_id AND status = 'inactive'
  ) inactive
  CROSS JOIN (
    SELECT COUNT(*) as count 
    FROM profiles 
    WHERE org_id = _org_id AND status = 'deactivated'
  ) deactivated
  CROSS JOIN (
    SELECT COUNT(*) as count 
    FROM user_invitations 
    WHERE org_id = _org_id AND status = 'pending' AND expires_at > now()
  ) pending;

  RETURN _result;
END;
$$;

-- Function to list organization users with pagination
CREATE OR REPLACE FUNCTION list_org_users(
  _search TEXT DEFAULT NULL,
  _page INT DEFAULT 1,
  _page_size INT DEFAULT 8
)
RETURNS TABLE(
  id UUID,
  full_name TEXT,
  email TEXT,
  status user_status,
  department TEXT,
  modules TEXT[],
  roles TEXT[]
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _org_id UUID;
  _offset INT;
BEGIN
  _org_id := current_org_id();
  
  IF _org_id IS NULL THEN
    RAISE EXCEPTION 'User not associated with any organization';
  END IF;

  _offset := (_page - 1) * _page_size;

  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    p.email,
    p.status,
    COALESCE(d.name, 'No Department') as department,
    COALESCE(
      (SELECT array_agg(DISTINCT om.module::text) 
       FROM organization_modules om 
       WHERE om.org_id = p.org_id), 
      '{}'::text[]
    ) as modules,
    COALESCE(
      (SELECT array_agg(r.name) 
       FROM user_roles ur 
       JOIN roles r ON ur.role_id = r.id 
       WHERE ur.profile_id = p.id),
      '{}'::text[]
    ) as roles
  FROM profiles p
  LEFT JOIN departments d ON p.department_id = d.id
  WHERE p.org_id = _org_id
    AND (_search IS NULL OR 
         p.full_name ILIKE '%' || _search || '%' OR 
         p.email ILIKE '%' || _search || '%' OR
         d.name ILIKE '%' || _search || '%')
  ORDER BY p.full_name
  LIMIT _page_size
  OFFSET _offset;
END;
$$;

-- Function to count organization users (for pagination)
CREATE OR REPLACE FUNCTION count_org_users(_search TEXT DEFAULT NULL)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _org_id UUID;
  _count INT;
BEGIN
  _org_id := current_org_id();
  
  IF _org_id IS NULL THEN
    RAISE EXCEPTION 'User not associated with any organization';
  END IF;

  SELECT COUNT(*)::INT INTO _count
  FROM profiles p
  LEFT JOIN departments d ON p.department_id = d.id
  WHERE p.org_id = _org_id
    AND (_search IS NULL OR 
         p.full_name ILIKE '%' || _search || '%' OR 
         p.email ILIKE '%' || _search || '%' OR
         d.name ILIKE '%' || _search || '%');

  RETURN _count;
END;
$$;

-- Function to create user invitation
CREATE OR REPLACE FUNCTION create_user_invitation(
  _email TEXT,
  _full_name TEXT,
  _department_id UUID DEFAULT NULL,
  _role_ids UUID[] DEFAULT '{}',
  _access JSONB DEFAULT NULL
)
RETURNS TABLE(id UUID, token TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _org_id UUID;
  _invitation_id UUID;
  _invitation_token TEXT;
BEGIN
  _org_id := current_org_id();
  
  IF _org_id IS NULL THEN
    RAISE EXCEPTION 'User not associated with any organization';
  END IF;

  IF NOT is_org_admin(_org_id) THEN
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
$$;

-- Function to accept invitation
CREATE OR REPLACE FUNCTION accept_invitation(_token TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _invitation RECORD;
  _role_id UUID;
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

  -- Update or create profile
  INSERT INTO profiles (id, org_id, email, full_name, department_id, status, role)
  VALUES (
    auth.uid(), 
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
    VALUES (auth.uid(), _role_id, _invitation.invited_by)
    ON CONFLICT (profile_id, role_id) DO NOTHING;
  END LOOP;

  -- Mark invitation as accepted
  UPDATE user_invitations
  SET status = 'accepted', redeemed_at = now()
  WHERE id = _invitation.id;

  RETURN TRUE;
END;
$$;

-- Function to get departments for an organization
CREATE OR REPLACE FUNCTION get_departments()
RETURNS TABLE(
  id UUID,
  name TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _org_id UUID;
BEGIN
  _org_id := current_org_id();
  
  IF _org_id IS NULL THEN
    RAISE EXCEPTION 'User not associated with any organization';
  END IF;

  RETURN QUERY
  SELECT d.id, d.name, d.description, d.created_at
  FROM departments d
  WHERE d.org_id = _org_id
  ORDER BY d.name;
END;
$$;

-- Function to get roles for an organization
CREATE OR REPLACE FUNCTION get_roles()
RETURNS TABLE(
  id UUID,
  name TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _org_id UUID;
BEGIN
  _org_id := current_org_id();
  
  IF _org_id IS NULL THEN
    RAISE EXCEPTION 'User not associated with any organization';
  END IF;

  RETURN QUERY
  SELECT r.id, r.name, r.description, r.created_at
  FROM roles r
  WHERE r.org_id = _org_id
  ORDER BY r.name;
END;
$$;

-- Function to create department
CREATE OR REPLACE FUNCTION create_department(_name TEXT, _description TEXT DEFAULT NULL)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _org_id UUID;
  _department_id UUID;
BEGIN
  _org_id := current_org_id();
  
  IF _org_id IS NULL THEN
    RAISE EXCEPTION 'User not associated with any organization';
  END IF;

  IF NOT is_org_admin(_org_id) THEN
    RAISE EXCEPTION 'Only organization administrators can create departments';
  END IF;

  INSERT INTO departments (org_id, name, description, created_by)
  VALUES (_org_id, _name, _description, auth.uid())
  RETURNING id INTO _department_id;

  RETURN _department_id;
END;
$$;

-- Function to create role
CREATE OR REPLACE FUNCTION create_role(_name TEXT, _description TEXT DEFAULT NULL)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _org_id UUID;
  _role_id UUID;
BEGIN
  _org_id := current_org_id();
  
  IF _org_id IS NULL THEN
    RAISE EXCEPTION 'User not associated with any organization';
  END IF;

  IF NOT is_org_admin(_org_id) THEN
    RAISE EXCEPTION 'Only organization administrators can create roles';
  END IF;

  INSERT INTO roles (org_id, name, description, created_by)
  VALUES (_org_id, _name, _description, auth.uid())
  RETURNING id INTO _role_id;

  RETURN _role_id;
END;
$$;