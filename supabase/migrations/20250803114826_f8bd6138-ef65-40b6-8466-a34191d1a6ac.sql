-- Enhanced atomic registration function
CREATE OR REPLACE FUNCTION public.register_organization_and_user_atomic(
  p_org_name text,
  p_org_type organization_type,
  p_user_email text,
  p_user_password text,
  p_full_name text,
  p_selected_modules text[] DEFAULT ARRAY['Fundraising', 'Documents Manager'],
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
    new_user_id uuid;
    auth_response jsonb;
BEGIN
    -- Start transaction explicitly
    BEGIN
        -- 1. Generate organization slug
        new_slug := public.generate_organization_slug(p_org_name);

        -- 2. Create the organization record first
        INSERT INTO public.organizations (name, type, email, slug, address, establishment_date, currency)
        VALUES (p_org_name, p_org_type, p_user_email, new_slug, p_address, p_establishment_date, p_currency)
        RETURNING id INTO new_org_id;

        -- 3. Create user via Supabase auth (this is the critical part)
        SELECT auth.signup(p_user_email, p_user_password, jsonb_build_object(
            'full_name', p_full_name,
            'organization_id', new_org_id
        )) INTO auth_response;

        -- Check if user creation was successful
        IF auth_response ? 'error' THEN
            RAISE EXCEPTION 'User creation failed: %', auth_response->>'error';
        END IF;

        new_user_id := (auth_response->'user'->>'id')::uuid;

        -- 4. Create the profile record
        INSERT INTO public.profiles (id, organization_id, full_name, role)
        VALUES (new_user_id, new_org_id, p_full_name, 'admin');

        -- 5. Update organization with primary user
        UPDATE public.organizations 
        SET primary_user_id = new_user_id
        WHERE id = new_org_id;

        -- 6. Create the contact record
        INSERT INTO public.organization_contacts (organization_id, name, email, phone, is_primary)
        VALUES (new_org_id, p_full_name, p_user_email, p_contact_phone, TRUE);

        -- 7. Create the module records
        IF array_length(p_selected_modules, 1) > 0 THEN
            INSERT INTO public.organization_modules (organization_id, module_name)
            SELECT new_org_id, unnest(p_selected_modules);
        END IF;

        -- Return success with organization details
        RETURN jsonb_build_object(
            'success', true,
            'organization_id', new_org_id,
            'user_id', new_user_id,
            'slug', new_slug,
            'message', 'Registration completed successfully'
        );

    EXCEPTION
        WHEN OTHERS THEN
            -- Rollback everything on any error
            RAISE EXCEPTION 'Registration failed: %', SQLERRM;
    END;
END;
$function$;