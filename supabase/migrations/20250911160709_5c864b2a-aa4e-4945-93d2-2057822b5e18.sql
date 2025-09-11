-- Insert sample users for the 4 roles (Admin, Contributor, Viewer, Custom)
-- Only insert if no users exist in the organization

DO $$
DECLARE
  sample_org_id UUID;
  admin_role_id UUID;
  contributor_role_id UUID;
  viewer_role_id UUID;
  custom_role_id UUID;
  admin_user_id UUID := '00000000-0000-0000-0000-000000000001';
  contributor_user_id UUID := '00000000-0000-0000-0000-000000000002';
  viewer_user_id UUID := '00000000-0000-0000-0000-000000000003';
  custom_user_id UUID := '00000000-0000-0000-0000-000000000004';
BEGIN
  -- Get the first organization (or create one if none exists)
  SELECT id INTO sample_org_id FROM organizations LIMIT 1;
  
  IF sample_org_id IS NULL THEN
    INSERT INTO organizations (name, type, created_by, primary_currency)
    VALUES ('Sample Organization', 'nonprofit', admin_user_id, 'USD')
    RETURNING id INTO sample_org_id;
    
    -- Add modules to the organization
    INSERT INTO organization_modules (org_id, module) VALUES 
    (sample_org_id, 'users'),
    (sample_org_id, 'fundraising'),
    (sample_org_id, 'programmes');
  END IF;

  -- Get role IDs
  SELECT id INTO admin_role_id FROM roles WHERE org_id = sample_org_id AND name = 'Admin';
  SELECT id INTO contributor_role_id FROM roles WHERE org_id = sample_org_id AND name = 'Contributor';
  SELECT id INTO viewer_role_id FROM roles WHERE org_id = sample_org_id AND name = 'Viewer';
  SELECT id INTO custom_role_id FROM roles WHERE org_id = sample_org_id AND name = 'Custom';

  -- Only add sample users if no users exist for this org
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE org_id = sample_org_id) THEN
    
    -- Create sample departments
    INSERT INTO departments (org_id, name, description, created_by) VALUES
    (sample_org_id, 'Administration', 'Administrative team', admin_user_id),
    (sample_org_id, 'Programs', 'Program management team', admin_user_id),
    (sample_org_id, 'Finance', 'Finance and accounting team', admin_user_id),
    (sample_org_id, 'IT Support', 'Information technology support', admin_user_id)
    ON CONFLICT DO NOTHING;

    -- Insert sample profiles
    INSERT INTO profiles (id, email, full_name, org_id, role, status, department_id) VALUES
    (admin_user_id, 'admin@sample.org', 'John Administrator', sample_org_id, 'org_admin', 'active', 
     (SELECT id FROM departments WHERE org_id = sample_org_id AND name = 'Administration' LIMIT 1)),
    (contributor_user_id, 'contributor@sample.org', 'Jane Contributor', sample_org_id, 'org_member', 'active',
     (SELECT id FROM departments WHERE org_id = sample_org_id AND name = 'Programs' LIMIT 1)),
    (viewer_user_id, 'viewer@sample.org', 'Bob Viewer', sample_org_id, 'org_member', 'active',
     (SELECT id FROM departments WHERE org_id = sample_org_id AND name = 'Finance' LIMIT 1)),
    (custom_user_id, 'custom@sample.org', 'Alice Custom', sample_org_id, 'org_member', 'inactive',
     (SELECT id FROM departments WHERE org_id = sample_org_id AND name = 'IT Support' LIMIT 1))
    ON CONFLICT (id) DO NOTHING;

    -- Assign roles to users
    INSERT INTO user_roles (profile_id, role_id, assigned_by) VALUES
    (admin_user_id, admin_role_id, admin_user_id),
    (contributor_user_id, contributor_role_id, admin_user_id),
    (viewer_user_id, viewer_role_id, admin_user_id),
    (custom_user_id, custom_role_id, admin_user_id)
    ON CONFLICT DO NOTHING;

    -- Set module access for users based on their roles
    -- Admin gets full access
    INSERT INTO user_module_access (profile_id, org_id, module_key, has_access, created_by) VALUES
    (admin_user_id, sample_org_id, 'users', true, admin_user_id),
    (admin_user_id, sample_org_id, 'fundraising', true, admin_user_id),
    (admin_user_id, sample_org_id, 'programmes', true, admin_user_id)
    ON CONFLICT DO NOTHING;

    -- Contributor gets access to fundraising and programmes
    INSERT INTO user_module_access (profile_id, org_id, module_key, has_access, created_by) VALUES
    (contributor_user_id, sample_org_id, 'users', false, admin_user_id),
    (contributor_user_id, sample_org_id, 'fundraising', true, admin_user_id),
    (contributor_user_id, sample_org_id, 'programmes', true, admin_user_id)
    ON CONFLICT DO NOTHING;

    -- Viewer gets read-only access to all modules
    INSERT INTO user_module_access (profile_id, org_id, module_key, has_access, created_by) VALUES
    (viewer_user_id, sample_org_id, 'users', true, admin_user_id),
    (viewer_user_id, sample_org_id, 'fundraising', true, admin_user_id),
    (viewer_user_id, sample_org_id, 'programmes', true, admin_user_id)
    ON CONFLICT DO NOTHING;

    -- Custom user gets no access initially
    INSERT INTO user_module_access (profile_id, org_id, module_key, has_access, created_by) VALUES
    (custom_user_id, sample_org_id, 'users', false, admin_user_id),
    (custom_user_id, sample_org_id, 'fundraising', false, admin_user_id),
    (custom_user_id, sample_org_id, 'programmes', false, admin_user_id)
    ON CONFLICT DO NOTHING;

    -- Add detailed permissions for users module
    INSERT INTO user_permissions (profile_id, org_id, module_key, feature_id, permissions, created_by) VALUES
    -- Admin permissions
    (admin_user_id, sample_org_id, 'users', 'user-accounts', ARRAY['admin'], admin_user_id),
    (admin_user_id, sample_org_id, 'fundraising', 'donor-management', ARRAY['admin'], admin_user_id),
    (admin_user_id, sample_org_id, 'programmes', 'programme-management', ARRAY['admin'], admin_user_id),
    
    -- Contributor permissions
    (contributor_user_id, sample_org_id, 'fundraising', 'donor-management', ARRAY['write'], admin_user_id),
    (contributor_user_id, sample_org_id, 'programmes', 'programme-management', ARRAY['write'], admin_user_id),
    
    -- Viewer permissions
    (viewer_user_id, sample_org_id, 'users', 'user-accounts', ARRAY['read'], admin_user_id),
    (viewer_user_id, sample_org_id, 'fundraising', 'donor-management', ARRAY['read'], admin_user_id),
    (viewer_user_id, sample_org_id, 'programmes', 'programme-management', ARRAY['read'], admin_user_id)
    ON CONFLICT DO NOTHING;

  END IF;
END $$;