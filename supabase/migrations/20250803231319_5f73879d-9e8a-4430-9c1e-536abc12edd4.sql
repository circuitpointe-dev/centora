-- Fix the raw_user_meta_data for the donor user
UPDATE auth.users 
SET raw_user_meta_data = '{"email":"user@donor.com","full_name":"Donor User","organization_id":"00000000-0000-0000-0000-000000000002","email_verified":true}'::jsonb
WHERE email = 'user@donor.com';

-- Also ensure the donor user has email_verified set to true
UPDATE auth.users 
SET email_confirmed_at = COALESCE(email_confirmed_at, now())
WHERE email = 'user@donor.com' AND email_confirmed_at IS NULL;