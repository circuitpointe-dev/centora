-- Now set up proper role permissions using the correct enum values: 'admin', 'read', 'write'
-- Create role permissions for the 4 required roles

DO $$
DECLARE
  org_record RECORD;
  admin_role_id UUID;
  contributor_role_id UUID;
  viewer_role_id UUID;
  custom_role_id UUID;
BEGIN
  -- Loop through organizations that have the new roles
  FOR org_record IN 
    SELECT DISTINCT o.id as org_id
    FROM organizations o
    INNER JOIN roles r ON r.org_id = o.id
    WHERE r.name IN ('Admin', 'Contributor', 'Viewer', 'Custom')
  LOOP
    -- Get role IDs for this organization
    SELECT id INTO admin_role_id FROM roles WHERE org_id = org_record.org_id AND name = 'Admin';
    SELECT id INTO contributor_role_id FROM roles WHERE org_id = org_record.org_id AND name = 'Contributor';
    SELECT id INTO viewer_role_id FROM roles WHERE org_id = org_record.org_id AND name = 'Viewer';
    SELECT id INTO custom_role_id FROM roles WHERE org_id = org_record.org_id AND name = 'Custom';

    -- Admin: Full admin access to all user management features
    IF admin_role_id IS NOT NULL THEN
      INSERT INTO role_permissions (org_id, role_id, module_key, feature_id, permissions) VALUES
        (org_record.org_id, admin_role_id, 'users', 'user-accounts', ARRAY['admin']::feature_permission[]),
        (org_record.org_id, admin_role_id, 'users', 'roles-permissions', ARRAY['admin']::feature_permission[]),
        (org_record.org_id, admin_role_id, 'users', 'subscription-billing', ARRAY['admin']::feature_permission[]),
        (org_record.org_id, admin_role_id, 'users', 'role-requests', ARRAY['admin']::feature_permission[])
      ON CONFLICT (org_id, role_id, module_key, feature_id) DO UPDATE SET
        permissions = EXCLUDED.permissions;
    END IF;

    -- Contributor: Write access to user accounts, read-only for others
    IF contributor_role_id IS NOT NULL THEN
      INSERT INTO role_permissions (org_id, role_id, module_key, feature_id, permissions) VALUES
        (org_record.org_id, contributor_role_id, 'users', 'user-accounts', ARRAY['write']::feature_permission[]),
        (org_record.org_id, contributor_role_id, 'users', 'roles-permissions', ARRAY['read']::feature_permission[]),
        (org_record.org_id, contributor_role_id, 'users', 'role-requests', ARRAY['write']::feature_permission[])
      ON CONFLICT (org_id, role_id, module_key, feature_id) DO UPDATE SET
        permissions = EXCLUDED.permissions;
    END IF;

    -- Viewer: Read-only access to everything
    IF viewer_role_id IS NOT NULL THEN
      INSERT INTO role_permissions (org_id, role_id, module_key, feature_id, permissions) VALUES
        (org_record.org_id, viewer_role_id, 'users', 'user-accounts', ARRAY['read']::feature_permission[]),
        (org_record.org_id, viewer_role_id, 'users', 'roles-permissions', ARRAY['read']::feature_permission[]),
        (org_record.org_id, viewer_role_id, 'users', 'role-requests', ARRAY['read']::feature_permission[])
      ON CONFLICT (org_id, role_id, module_key, feature_id) DO UPDATE SET
        permissions = EXCLUDED.permissions;
    END IF;

    -- Custom role gets no default permissions (will be customized per user)

  END LOOP;
END $$;