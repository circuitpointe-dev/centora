-- Create the NGO user if it doesn't exist
DO $$
BEGIN
    -- Check if NGO user exists
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'user@ngo.com') THEN
        PERFORM create_dev_user('user@ngo.com', 'Circuit2025$', '00000000-0000-0000-0000-000000000001', 'NGO User');
    END IF;
END $$;