-- Create organizations first
INSERT INTO public.organizations (id, name, type, primary_currency, created_at) VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Demo NGO Organization', 'NGO', 'USD', now()),
  ('00000000-0000-0000-0000-000000000002', 'Demo Donor Organization', 'DONOR', 'USD', now()),
  ('00000000-0000-0000-0000-000000000003', 'Centora ERP', 'NGO', 'USD', now())
ON CONFLICT (id) DO NOTHING;

-- Create auth users with specific IDs and password
DO $$
DECLARE
    ngo_user_id UUID := '00000000-0000-0000-0000-000000000101';
    donor_user_id UUID := '00000000-0000-0000-0000-000000000102'; 
    superadmin_user_id UUID := '00000000-0000-0000-0000-000000000103';
BEGIN
    -- Create NGO user
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        role
    ) VALUES (
        ngo_user_id,
        '00000000-0000-0000-0000-000000000000',
        'user@ngo.com',
        crypt('Circuit2025$', gen_salt('bf')),
        now(),
        now(), 
        now(),
        '{"provider": "email", "providers": ["email"]}',
        '{"full_name": "NGO User"}',
        false,
        'authenticated'
    ) ON CONFLICT (id) DO NOTHING;

    -- Create Donor user
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        role
    ) VALUES (
        donor_user_id,
        '00000000-0000-0000-0000-000000000000',
        'user@donor.com',
        crypt('Circuit2025$', gen_salt('bf')),
        now(),
        now(),
        now(),
        '{"provider": "email", "providers": ["email"]}',
        '{"full_name": "Donor User"}',
        false,
        'authenticated'
    ) ON CONFLICT (id) DO NOTHING;

    -- Create Super Admin user
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        role
    ) VALUES (
        superadmin_user_id,
        '00000000-0000-0000-0000-000000000000',
        'superadmin@centora.com',
        crypt('Circuit2025$', gen_salt('bf')),
        now(),
        now(),
        now(),
        '{"provider": "email", "providers": ["email"]}',
        '{"full_name": "Super Admin"}',
        true,
        'authenticated'
    ) ON CONFLICT (id) DO NOTHING;
END $$;

-- Create profiles for these users
INSERT INTO public.profiles (
    id,
    org_id,
    email,
    full_name,
    role,
    status,
    is_super_admin,
    access_json,
    created_at,
    updated_at
) VALUES 
  (
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000001', 
    'user@ngo.com',
    'NGO User',
    'org_admin',
    'active',
    false,
    '{}',
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000102',
    '00000000-0000-0000-0000-000000000002',
    'user@donor.com', 
    'Donor User',
    'org_admin',
    'active',
    false,
    '{}',
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000103',
    '00000000-0000-0000-0000-000000000003',
    'superadmin@centora.com',
    'Super Admin',
    'org_admin', 
    'active',
    true,
    '{}',
    now(),
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- Add organization modules for all organizations
INSERT INTO public.organization_modules (org_id, module, created_at) VALUES
  ('00000000-0000-0000-0000-000000000001', 'fundraising', now()),
  ('00000000-0000-0000-0000-000000000001', 'grants', now()),
  ('00000000-0000-0000-0000-000000000001', 'documents', now()),
  ('00000000-0000-0000-0000-000000000001', 'programme', now()),
  ('00000000-0000-0000-0000-000000000001', 'procurement', now()),
  ('00000000-0000-0000-0000-000000000001', 'inventory', now()),
  ('00000000-0000-0000-0000-000000000001', 'finance', now()),
  ('00000000-0000-0000-0000-000000000001', 'learning', now()),
  ('00000000-0000-0000-0000-000000000001', 'hr', now()),
  ('00000000-0000-0000-0000-000000000001', 'users', now()),
  ('00000000-0000-0000-0000-000000000002', 'fundraising', now()),
  ('00000000-0000-0000-0000-000000000002', 'grants', now()),
  ('00000000-0000-0000-0000-000000000002', 'documents', now()),
  ('00000000-0000-0000-0000-000000000002', 'programme', now()),
  ('00000000-0000-0000-0000-000000000002', 'procurement', now()),
  ('00000000-0000-0000-0000-000000000002', 'inventory', now()),
  ('00000000-0000-0000-0000-000000000002', 'finance', now()),
  ('00000000-0000-0000-0000-000000000002', 'learning', now()),
  ('00000000-0000-0000-0000-000000000002', 'hr', now()),
  ('00000000-0000-0000-0000-000000000002', 'users', now()),
  ('00000000-0000-0000-0000-000000000003', 'users', now())
ON CONFLICT (org_id, module) DO NOTHING;