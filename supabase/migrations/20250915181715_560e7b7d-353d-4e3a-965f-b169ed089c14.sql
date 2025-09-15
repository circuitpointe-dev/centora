-- Create the user with admin credentials
DO $$
DECLARE
    new_user_id uuid := gen_random_uuid();
    default_org_id uuid;
BEGIN
    -- Get or create a default organization
    SELECT id INTO default_org_id FROM organizations ORDER BY created_at ASC LIMIT 1;
    
    -- If no organization exists, create one
    IF default_org_id IS NULL THEN
        INSERT INTO organizations (name, type, created_by)
        VALUES ('NGO Organization', 'NGO'::organization_type, new_user_id)
        RETURNING id INTO default_org_id;
        
        -- Add default modules for the organization
        INSERT INTO organization_modules (org_id, module)
        VALUES 
            (default_org_id, 'fundraising'),
            (default_org_id, 'grants'),
            (default_org_id, 'documents'),
            (default_org_id, 'programmes'),
            (default_org_id, 'procurement'),
            (default_org_id, 'inventory'),
            (default_org_id, 'finance'),
            (default_org_id, 'lms'),
            (default_org_id, 'hr'),
            (default_org_id, 'user_mgmt');
    END IF;

    -- Create the user profile directly (auth user will be created via signup)
    INSERT INTO profiles (
        id, 
        email, 
        full_name, 
        org_id, 
        role, 
        is_super_admin, 
        status,
        access_json
    ) VALUES (
        new_user_id,
        'ngo@gmai.com',
        'NGO Admin User',
        default_org_id,
        'org_admin'::app_role,
        true,
        'active'::user_status,
        '{
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
    );

    -- Create module access records for all modules
    INSERT INTO user_module_access (profile_id, org_id, module_key, has_access, created_by)
    VALUES 
        (new_user_id, default_org_id, 'fundraising', true, new_user_id),
        (new_user_id, default_org_id, 'grants', true, new_user_id),
        (new_user_id, default_org_id, 'documents', true, new_user_id),
        (new_user_id, default_org_id, 'programmes', true, new_user_id),
        (new_user_id, default_org_id, 'procurement', true, new_user_id),
        (new_user_id, default_org_id, 'inventory', true, new_user_id),
        (new_user_id, default_org_id, 'finance', true, new_user_id),
        (new_user_id, default_org_id, 'lms', true, new_user_id),
        (new_user_id, default_org_id, 'hr', true, new_user_id),
        (new_user_id, default_org_id, 'user_mgmt', true, new_user_id);

    -- Log the created user ID for reference
    RAISE NOTICE 'Created user profile with ID: %', new_user_id;
    RAISE NOTICE 'User email: ngo@gmai.com';
    RAISE NOTICE 'Please create auth user manually in Supabase Auth dashboard with this email and password: test@1234';
    RAISE NOTICE 'Then update the profile ID to match the auth user ID';
END $$;