-- Seed the 4 required roles for the User Management system
-- First, let's get the current user's org_id to create roles
-- We'll create a general function to seed roles for any organization

-- Create a function to seed the 4 required roles for an organization
CREATE OR REPLACE FUNCTION seed_required_roles(_org_id UUID, _created_by UUID DEFAULT NULL)
RETURNS VOID AS $$
BEGIN
  -- Set default created_by to the first org_admin if not provided
  IF _created_by IS NULL THEN
    SELECT id INTO _created_by FROM profiles 
    WHERE org_id = _org_id AND role = 'org_admin' 
    LIMIT 1;
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

-- Seed roles for existing organizations
DO $$
DECLARE
  org_record RECORD;
BEGIN
  FOR org_record IN SELECT id FROM organizations LOOP
    PERFORM seed_required_roles(org_record.id);
  END LOOP;
END $$;

-- Create default permissions for the roles
-- First, ensure we have basic feature permissions in the features table
INSERT INTO features (module, feature_key, feature_name, permissions) VALUES
  ('users', 'user-accounts', 'User Accounts', ARRAY['create', 'read', 'update', 'delete']::feature_permission[]),
  ('users', 'roles-permissions', 'Roles & Permissions', ARRAY['create', 'read', 'update', 'delete']::feature_permission[]),
  ('users', 'subscription-billing', 'Subscription & Billing', ARRAY['read', 'update']::feature_permission[]),
  ('users', 'role-requests', 'Role Requests', ARRAY['create', 'read', 'update', 'delete']::feature_permission[])
ON CONFLICT (module, feature_key) DO UPDATE SET 
  permissions = EXCLUDED.permissions;

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

  -- Admin: Full access to all user management features
  INSERT INTO role_permissions (org_id, role_id, module_key, feature_id, permissions) VALUES
    (_org_id, admin_role_id, 'users', 'user-accounts', ARRAY['create', 'read', 'update', 'delete']::feature_permission[]),
    (_org_id, admin_role_id, 'users', 'roles-permissions', ARRAY['create', 'read', 'update', 'delete']::feature_permission[]),
    (_org_id, admin_role_id, 'users', 'subscription-billing', ARRAY['read', 'update']::feature_permission[]),
    (_org_id, admin_role_id, 'users', 'role-requests', ARRAY['create', 'read', 'update', 'delete']::feature_permission[])
  ON CONFLICT (org_id, role_id, module_key, feature_id) DO UPDATE SET
    permissions = EXCLUDED.permissions;

  -- Contributor: Edit access to assigned features (limited user management)
  INSERT INTO role_permissions (org_id, role_id, module_key, feature_id, permissions) VALUES
    (_org_id, contributor_role_id, 'users', 'user-accounts', ARRAY['read', 'update']::feature_permission[]),
    (_org_id, contributor_role_id, 'users', 'roles-permissions', ARRAY['read']::feature_permission[]),
    (_org_id, contributor_role_id, 'users', 'role-requests', ARRAY['create', 'read']::feature_permission[])
  ON CONFLICT (org_id, role_id, module_key, feature_id) DO UPDATE SET
    permissions = EXCLUDED.permissions;

  -- Viewer: Read-only access
  INSERT INTO role_permissions (org_id, role_id, module_key, feature_id, permissions) VALUES
    (_org_id, viewer_role_id, 'users', 'user-accounts', ARRAY['read']::feature_permission[]),
    (_org_id, viewer_role_id, 'users', 'roles-permissions', ARRAY['read']::feature_permission[]),
    (_org_id, viewer_role_id, 'users', 'role-requests', ARRAY['read']::feature_permission[])
  ON CONFLICT (org_id, role_id, module_key, feature_id) DO UPDATE SET
    permissions = EXCLUDED.permissions;

  -- Custom role gets no default permissions (will be set per user)
END;
$$ LANGUAGE plpgsql;

-- Apply default permissions to all organizations
DO $$
DECLARE
  org_record RECORD;
BEGIN
  FOR org_record IN SELECT id FROM organizations LOOP
    PERFORM setup_default_role_permissions(org_record.id);
  END LOOP;
END $$;