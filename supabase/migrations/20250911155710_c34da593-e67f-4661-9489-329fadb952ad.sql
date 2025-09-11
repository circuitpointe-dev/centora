-- Simple role permissions setup without ON CONFLICT
-- Just insert permissions if they don't already exist

DO $$
DECLARE
  org_record RECORD;
  admin_role_id UUID;
  contributor_role_id UUID;
  viewer_role_id UUID;
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

    -- Admin: Full admin access
    IF admin_role_id IS NOT NULL THEN
      -- Only insert if not exists
      INSERT INTO role_permissions (org_id, role_id, module_key, feature_id, permissions)
      SELECT org_record.org_id, admin_role_id, 'users', 'user-accounts', ARRAY['admin']::feature_permission[]
      WHERE NOT EXISTS (
        SELECT 1 FROM role_permissions 
        WHERE org_id = org_record.org_id AND role_id = admin_role_id 
        AND module_key = 'users' AND feature_id = 'user-accounts'
      );
      
      INSERT INTO role_permissions (org_id, role_id, module_key, feature_id, permissions)
      SELECT org_record.org_id, admin_role_id, 'users', 'roles-permissions', ARRAY['admin']::feature_permission[]
      WHERE NOT EXISTS (
        SELECT 1 FROM role_permissions 
        WHERE org_id = org_record.org_id AND role_id = admin_role_id 
        AND module_key = 'users' AND feature_id = 'roles-permissions'
      );
    END IF;

    -- Contributor: Write access to user accounts
    IF contributor_role_id IS NOT NULL THEN
      INSERT INTO role_permissions (org_id, role_id, module_key, feature_id, permissions)
      SELECT org_record.org_id, contributor_role_id, 'users', 'user-accounts', ARRAY['write']::feature_permission[]
      WHERE NOT EXISTS (
        SELECT 1 FROM role_permissions 
        WHERE org_id = org_record.org_id AND role_id = contributor_role_id 
        AND module_key = 'users' AND feature_id = 'user-accounts'
      );
    END IF;

    -- Viewer: Read-only access
    IF viewer_role_id IS NOT NULL THEN
      INSERT INTO role_permissions (org_id, role_id, module_key, feature_id, permissions)
      SELECT org_record.org_id, viewer_role_id, 'users', 'user-accounts', ARRAY['read']::feature_permission[]
      WHERE NOT EXISTS (
        SELECT 1 FROM role_permissions 
        WHERE org_id = org_record.org_id AND role_id = viewer_role_id 
        AND module_key = 'users' AND feature_id = 'user-accounts'
      );
    END IF;

  END LOOP;
END $$;