-- Update create_dev_users function to use correct module names from moduleConfig.ts
DROP FUNCTION IF EXISTS public.create_dev_users();

CREATE OR REPLACE FUNCTION public.create_dev_users()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  v_ngo_org_id UUID;
  v_donor_org_id UUID;
  v_ngo_user_id UUID;
  v_donor_user_id UUID;
  v_module TEXT;
  -- Use exact module names from moduleConfig.ts
  v_modules TEXT[] := ARRAY['fundraising', 'grants', 'documents', 'programme', 'procurement', 'inventory', 'finance', 'learning', 'hr', 'users'];
BEGIN
  -- Skip if development users already exist
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'user@ngo.com') THEN
    RETURN json_build_object('success', true, 'message', 'Development users already exist');
  END IF;

  -- Create NGO organization
  INSERT INTO public.organizations (name, type, address, primary_currency, contact_phone, status)
  VALUES ('Test NGO Organization', 'NGO', '123 NGO Street, City', 'USD', '+1234567890', 'active')
  RETURNING id INTO v_ngo_org_id;

  -- Create Donor organization
  INSERT INTO public.organizations (name, type, address, primary_currency, contact_phone, status)
  VALUES ('Test Donor Organization', 'Donor', '456 Donor Avenue, City', 'USD', '+0987654321', 'active')
  RETURNING id INTO v_donor_org_id;

  -- Create NGO user
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, email_change, email_change_token_new, recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated',
    'user@ngo.com', crypt('Circuit2025$', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}', '{"full_name":"NGO Test User"}', now(), now(),
    '', '', '', ''
  ) RETURNING id INTO v_ngo_user_id;

  -- Create Donor user
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, email_change, email_change_token_new, recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated',
    'user@donor.com', crypt('Circuit2025$', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}', '{"full_name":"Donor Test User"}', now(), now(),
    '', '', '', ''
  ) RETURNING id INTO v_donor_user_id;

  -- Create profiles
  INSERT INTO public.profiles (id, organization_id, full_name, role)
  VALUES 
    (v_ngo_user_id, v_ngo_org_id, 'NGO Test User', 'admin'),
    (v_donor_user_id, v_donor_org_id, 'Donor Test User', 'admin');

  -- Add all modules to both organizations using correct module names
  FOREACH v_module IN ARRAY v_modules
  LOOP
    INSERT INTO public.organization_modules (organization_id, module_name)
    VALUES (v_ngo_org_id, v_module), (v_donor_org_id, v_module);
  END LOOP;

  -- Add pricing tiers
  INSERT INTO public.organization_pricing (organization_id, pricing_tier_id)
  SELECT v_ngo_org_id, id FROM public.pricing_tiers WHERE name = 'enterprise_branding'
  UNION ALL
  SELECT v_donor_org_id, id FROM public.pricing_tiers WHERE name = 'enterprise_branding';

  RETURN json_build_object('success', true, 'message', 'Development users created successfully');
END;
$function$;

-- Execute the function to create dev users
SELECT public.create_dev_users();