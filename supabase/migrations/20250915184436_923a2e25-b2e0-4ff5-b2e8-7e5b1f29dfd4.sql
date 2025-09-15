-- Grant full permissions to abubakar.abdulrazak@circuitpointe.com
UPDATE profiles 
SET is_super_admin = true 
WHERE email = 'abubakar.abdulrazak@circuitpointe.com';

-- Get the user's ID and org_id for setting up module access
DO $$
DECLARE
  user_profile RECORD;
  modules TEXT[] := ARRAY['fundraising', 'grants', 'documents', 'programmes', 'procurement', 'inventory', 'finance', 'lms', 'hr', 'user_mgmt'];
  current_module TEXT;
BEGIN
  -- Get user details
  SELECT id, org_id INTO user_profile FROM profiles WHERE email = 'abubakar.abdulrazak@circuitpointe.com';
  
  IF user_profile.id IS NOT NULL THEN
    -- Clear existing permissions
    DELETE FROM user_permissions WHERE profile_id = user_profile.id;
    DELETE FROM user_module_access WHERE profile_id = user_profile.id;
    
    -- Grant access to all modules with full CRUD permissions
    FOREACH current_module IN ARRAY modules
    LOOP
      -- Insert module access
      INSERT INTO user_module_access (profile_id, org_id, module_key, has_access, created_by)
      VALUES (user_profile.id, user_profile.org_id, current_module, true, user_profile.id)
      ON CONFLICT (profile_id, module_key) DO UPDATE SET has_access = true;
      
      -- Insert full CRUD permissions for each feature
      INSERT INTO user_permissions (profile_id, org_id, module_key, feature_id, permissions, created_by)
      VALUES 
        (user_profile.id, user_profile.org_id, current_module, 'create', ARRAY['create', 'read', 'update', 'delete'], user_profile.id),
        (user_profile.id, user_profile.org_id, current_module, 'read', ARRAY['create', 'read', 'update', 'delete'], user_profile.id),
        (user_profile.id, user_profile.org_id, current_module, 'update', ARRAY['create', 'read', 'update', 'delete'], user_profile.id),
        (user_profile.id, user_profile.org_id, current_module, 'delete', ARRAY['create', 'read', 'update', 'delete'], user_profile.id)
      ON CONFLICT (profile_id, module_key, feature_id) DO UPDATE SET permissions = ARRAY['create', 'read', 'update', 'delete'];
    END LOOP;
    
    -- Update access_json for backward compatibility
    UPDATE profiles 
    SET access_json = '{
      "fundraising": {"_module": true, "create": ["create", "read", "update", "delete"], "read": ["create", "read", "update", "delete"], "update": ["create", "read", "update", "delete"], "delete": ["create", "read", "update", "delete"]},
      "grants": {"_module": true, "create": ["create", "read", "update", "delete"], "read": ["create", "read", "update", "delete"], "update": ["create", "read", "update", "delete"], "delete": ["create", "read", "update", "delete"]},
      "documents": {"_module": true, "create": ["create", "read", "update", "delete"], "read": ["create", "read", "update", "delete"], "update": ["create", "read", "update", "delete"], "delete": ["create", "read", "update", "delete"]},
      "programmes": {"_module": true, "create": ["create", "read", "update", "delete"], "read": ["create", "read", "update", "delete"], "update": ["create", "read", "update", "delete"], "delete": ["create", "read", "update", "delete"]},
      "procurement": {"_module": true, "create": ["create", "read", "update", "delete"], "read": ["create", "read", "update", "delete"], "update": ["create", "read", "update", "delete"], "delete": ["create", "read", "update", "delete"]},
      "inventory": {"_module": true, "create": ["create", "read", "update", "delete"], "read": ["create", "read", "update", "delete"], "update": ["create", "read", "update", "delete"], "delete": ["create", "read", "update", "delete"]},
      "finance": {"_module": true, "create": ["create", "read", "update", "delete"], "read": ["create", "read", "update", "delete"], "update": ["create", "read", "update", "delete"], "delete": ["create", "read", "update", "delete"]},
      "lms": {"_module": true, "create": ["create", "read", "update", "delete"], "read": ["create", "read", "update", "delete"], "update": ["create", "read", "update", "delete"], "delete": ["create", "read", "update", "delete"]},
      "hr": {"_module": true, "create": ["create", "read", "update", "delete"], "read": ["create", "read", "update", "delete"], "update": ["create", "read", "update", "delete"], "delete": ["create", "read", "update", "delete"]},
      "user_mgmt": {"_module": true, "create": ["create", "read", "update", "delete"], "read": ["create", "read", "update", "delete"], "update": ["create", "read", "update", "delete"], "delete": ["create", "read", "update", "delete"]}
    }'::jsonb
    WHERE id = user_profile.id;
    
    RAISE NOTICE 'Successfully granted full permissions to user: %', user_profile.id;
  ELSE
    RAISE EXCEPTION 'User with email abubakar.abdulrazak@circuitpointe.com not found';
  END IF;
END $$;