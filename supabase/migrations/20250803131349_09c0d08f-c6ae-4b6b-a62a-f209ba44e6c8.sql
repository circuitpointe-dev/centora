-- Let me first check the current complete_registration_transaction function
-- and fix the user_metadata handling issue

CREATE OR REPLACE FUNCTION public.complete_registration_transaction(p_user_id uuid, p_org_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  v_user_data record;
BEGIN
  -- Get user data from auth.users
  SELECT 
    email,
    raw_user_meta_data
  INTO v_user_data
  FROM auth.users 
  WHERE id = p_user_id;

  -- 1) If they already have a profile, do nothing
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = p_user_id) THEN
    RETURN;
  END IF;

  -- 2) Insert into profiles with proper user_metadata handling
  INSERT INTO public.profiles (
    id,
    organization_id,
    full_name,
    role
  ) VALUES (
    p_user_id,
    p_org_id,
    COALESCE(
      v_user_data.raw_user_meta_data->>'full_name',
      v_user_data.email
    ),
    'admin'
  );

  -- 3) Update the org's primary_user_id
  UPDATE public.organizations
    SET primary_user_id = p_user_id
  WHERE id = p_org_id;

  -- 4) No need to add contact again as it's already handled in register_organization_and_user

EXCEPTION
  WHEN OTHERS THEN
    -- Log the error and re-raise
    RAISE EXCEPTION 'Profile creation failed for user % in org %: %', p_user_id, p_org_id, SQLERRM;
END;
$function$;

-- Also update the register_organization_and_user function to handle duplicates better
CREATE OR REPLACE FUNCTION public.register_organization_and_user(
  p_org_name text, 
  p_org_type organization_type, 
  p_user_email text, 
  p_user_password text, 
  p_full_name text, 
  p_selected_modules text[], 
  p_address text DEFAULT NULL::text, 
  p_establishment_date date DEFAULT NULL::date, 
  p_currency text DEFAULT 'USD'::text, 
  p_contact_phone text DEFAULT NULL::text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'auth', 'extensions'
AS $function$
DECLARE
    new_org_id uuid;
    new_slug text;
    existing_org_id uuid;
BEGIN
    -- Check if organization already exists with this email
    SELECT id INTO existing_org_id 
    FROM public.organizations 
    WHERE email = p_user_email;

    IF existing_org_id IS NOT NULL THEN
        RETURN jsonb_build_object(
            'error', 'Organization with this email already exists',
            'organization_id', existing_org_id
        );
    END IF;

    -- 1. Create the organization record
    new_slug := public.generate_organization_slug(p_org_name);

    INSERT INTO public.organizations (name, type, email, slug, address, establishment_date, currency)
    VALUES (p_org_name, p_org_type, p_user_email, new_slug, p_address, p_establishment_date, p_currency)
    RETURNING id INTO new_org_id;

    -- 2. Create the contact record
    INSERT INTO public.organization_contacts (organization_id, name, email, phone, is_primary)
    VALUES (new_org_id, p_full_name, p_user_email, p_contact_phone, TRUE)
    ON CONFLICT (organization_id, email) DO NOTHING;

    -- 3. Create the module records
    IF array_length(p_selected_modules, 1) > 0 THEN
      INSERT INTO public.organization_modules (organization_id, module_name)
      SELECT new_org_id, unnest(p_selected_modules)
      ON CONFLICT (organization_id, module_name) DO NOTHING;
    END IF;

    -- Return the new organization ID for the frontend
    RETURN jsonb_build_object(
      'organization_id', new_org_id,
      'slug', new_slug
    );

EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object('error', SQLERRM);
END;
$function$;