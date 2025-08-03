-- Create development auth users directly
-- Note: This creates the users in auth.users with hashed passwords

-- Insert development users into auth.users
INSERT INTO auth.users (
  instance_id,
  id,
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
) VALUES 
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111111',
    'authenticated',
    'authenticated',
    'user@ngo.com',
    crypt('Circuit2025$', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"email":"user@ngo.com","full_name":"NGO User","organization_id":"00000000-0000-0000-0000-000000000001"}',
    now(),
    now(),
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '22222222-2222-2222-2222-222222222222',
    'authenticated',
    'authenticated',
    'user@donor.com',
    crypt('Circuit2025$', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"email":"user@donor.com","full_name":"Donor User","organization_id":"00000000-0000-0000-0000-000000000002"}',
    now(),
    now(),
    '',
    '',
    '',
    ''
  )
ON CONFLICT (email) DO UPDATE SET
  encrypted_password = EXCLUDED.encrypted_password,
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  updated_at = now();

-- Create corresponding profiles
INSERT INTO public.profiles (id, organization_id, full_name, role)
VALUES 
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'NGO User', 'admin'),
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000002', 'Donor User', 'admin')
ON CONFLICT (id) DO UPDATE SET
  organization_id = EXCLUDED.organization_id,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  updated_at = now();