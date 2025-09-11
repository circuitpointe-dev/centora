-- Fix the role seeding by using existing org_admin users as created_by
-- Drop the previous function and create a better one
DROP FUNCTION IF EXISTS seed_required_roles(UUID, UUID);
DROP FUNCTION IF EXISTS setup_default_role_permissions(UUID);

-- Create a function to seed the 4 required roles for an organization
CREATE OR REPLACE FUNCTION seed_required_roles(_org_id UUID)
RETURNS VOID AS $$
DECLARE
  _created_by UUID;
BEGIN
  -- Get the first org_admin for this organization
  SELECT id INTO _created_by FROM profiles 
  WHERE org_id = _org_id AND role = 'org_admin' 
  LIMIT 1;
  
  -- If no org_admin found, skip this organization
  IF _created_by IS NULL THEN
    RETURN;
  END IF;

  -- Insert the 4 required roles if they don't exist
  INSERT INTO roles (org_id, name, description, created_by)
  VALUES 
    (_org_id, 'Admin', 'Full access to all features and settings', _created_by),
    (_org_id, 'Contributor', 'Edit access to assigned features', _created_by),
    (_org_id, 'Viewer', 'View-only access to organization data', _created_by),
    (_org_id, 'Custom', 'Customized permissions per user', _created_by)
  ON CONFLICT (org_id, name) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Function to set default role permissions
CREATE OR REPLACE FUNCTION setup_default_role_permissions(_org_id UUID)
RETURNS VOID AS $$
DECLARE
  admin_role_id UUID;
  contributor_role_id UUID;
  viewer_role_id UUID;
  custom_role_id UUID;
BEGIN
  -- Get role IDs
  SELECT id INTO admin_role_id FROM roles WHERE org_id = _org_id AND name = 'Admin';
  SELECT id INTO contributor_role_id FROM roles WHERE org_id = _org_id AND name = 'Contributor';
  SELECT id INTO viewer_role_id FROM roles WHERE org_id = _org_id AND name = 'Viewer';
  SELECT id INTO custom_role_id FROM roles WHERE org_id = _org_id AND name = 'Custom';

  -- Only proceed if we found the roles
  IF admin_role_id IS NULL THEN
    RETURN;
  END IF;

  -- Admin: Full access to all user management features
  INSERT INTO role_permissions (org_id, role_id, module_key, feature_id, permissions) VALUES
    (_org_id, admin_role_id, 'users', 'user-accounts', ARRAY['create', 'read', 'update', 'delete']::feature_permission[]),
    (_org_id, admin_role_id, 'users', 'roles-permissions', ARRAY['create', 'read', 'update', 'delete']::feature_permission[]),
    (_org_id, admin_role_id, 'users', 'subscription-billing', ARRAY['read', 'update']::feature_permission[]),
    (_org_id, admin_role_id, 'users', 'role-requests', ARRAY['create', 'read', 'update', 'delete']::feature_permission[])
  ON CONFLICT (org_id, role_id, module_key, feature_id) DO UPDATE SET
    permissions = EXCLUDED.permissions;

  -- Contributor: Edit access to assigned features (limited user management)
  IF contributor_role_id IS NOT NULL THEN
    INSERT INTO role_permissions (org_id, role_id, module_key, feature_id, permissions) VALUES
      (_org_id, contributor_role_id, 'users', 'user-accounts', ARRAY['read', 'update']::feature_permission[]),
      (_org_id, contributor_role_id, 'users', 'roles-permissions', ARRAY['read']::feature_permission[]),
      (_org_id, contributor_role_id, 'users', 'role-requests', ARRAY['create', 'read']::feature_permission[])
    ON CONFLICT (org_id, role_id, module_key, feature_id) DO UPDATE SET
      permissions = EXCLUDED.permissions;
  END IF;

  -- Viewer: Read-only access
  IF viewer_role_id IS NOT NULL THEN
    INSERT INTO role_permissions (org_id, role_id, module_key, feature_id, permissions) VALUES
      (_org_id, viewer_role_id, 'users', 'user-accounts', ARRAY['read']::feature_permission[]),
      (_org_id, viewer_role_id, 'users', 'roles-permissions', ARRAY['read']::feature_permission[]),
      (_org_id, viewer_role_id, 'users', 'role-requests', ARRAY['read']::feature_permission[])
    ON CONFLICT (org_id, role_id, module_key, feature_id) DO UPDATE SET
      permissions = EXCLUDED.permissions;
  END IF;

  -- Custom role gets no default permissions (will be set per user)
END;
$$ LANGUAGE plpgsql;

-- Seed roles for existing organizations that have org_admins
DO $$
DECLARE
  org_record RECORD;
BEGIN
  FOR org_record IN 
    SELECT DISTINCT o.id
    FROM organizations o
    INNER JOIN profiles p ON p.org_id = o.id
    WHERE p.role = 'org_admin'
  LOOP
    PERFORM seed_required_roles(org_record.id);
    PERFORM setup_default_role_permissions(org_record.id);
  END LOOP;
END $$;