-- Create development users using the auth functions
-- First, we need to create the users in auth.users using a proper approach

-- Let's create a function to safely create development users
CREATE OR REPLACE FUNCTION create_dev_user(user_email text, user_password text, org_id uuid, user_name text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
    new_user_id uuid;
    hashed_password text;
BEGIN
    -- Generate a new UUID for the user
    new_user_id := gen_random_uuid();
    
    -- Hash the password using the auth schema's method
    hashed_password := crypt(user_password, gen_salt('bf'));
    
    -- Insert into auth.users
    INSERT INTO auth.users (
        id,
        instance_id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) VALUES (
        new_user_id,
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        user_email,
        hashed_password,
        now(),
        '{"provider":"email","providers":["email"]}',
        json_build_object('email', user_email, 'full_name', user_name, 'organization_id', org_id::text),
        now(),
        now(),
        '',
        '',
        '',
        ''
    );
    
    -- Create the profile
    INSERT INTO public.profiles (id, organization_id, full_name, role)
    VALUES (new_user_id, org_id, user_name, 'admin');
    
    RETURN new_user_id;
END;
$$;

-- Now create the development users
SELECT create_dev_user('user@ngo.com', 'Circuit2025$', '00000000-0000-0000-0000-000000000001', 'NGO User');
SELECT create_dev_user('user@donor.com', 'Circuit2025$', '00000000-0000-0000-0000-000000000002', 'Donor User');