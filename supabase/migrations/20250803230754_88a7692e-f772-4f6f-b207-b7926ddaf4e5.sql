-- Create NGO user directly if it doesn't exist
DO $$
DECLARE
    new_user_id uuid;
    hashed_password text;
BEGIN
    -- Check if NGO user exists
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'user@ngo.com') THEN
        -- Generate a new UUID for the user
        new_user_id := gen_random_uuid();
        
        -- Hash the password
        hashed_password := crypt('Circuit2025$', gen_salt('bf'));
        
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
            'user@ngo.com',
            hashed_password,
            now(),
            '{"provider":"email","providers":["email"]}',
            '{"email":"user@ngo.com","full_name":"NGO User","organization_id":"00000000-0000-0000-0000-000000000001"}',
            now(),
            now(),
            '',
            '',
            '',
            ''
        );
        
        -- Create the profile
        INSERT INTO public.profiles (id, organization_id, full_name, role)
        VALUES (new_user_id, '00000000-0000-0000-0000-000000000001', 'NGO User', 'admin');
    END IF;
END $$;