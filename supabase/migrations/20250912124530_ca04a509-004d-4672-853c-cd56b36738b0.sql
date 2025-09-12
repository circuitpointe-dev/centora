-- Create a trigger to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, org_id, role, is_super_admin, access_json)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    -- For now, assign to first organization (or create default org if none exists)
    (SELECT id FROM public.organizations ORDER BY created_at ASC LIMIT 1),
    'org_member'::app_role,
    false,
    '{}'::jsonb
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a default organization if none exists
INSERT INTO public.organizations (name, type, created_at)
SELECT 'Demo NGO Organization', 'NGO'::organization_type, now()
WHERE NOT EXISTS (SELECT 1 FROM public.organizations);

-- Add default modules for the organization
INSERT INTO public.organization_modules (org_id, module)
SELECT o.id, 'fundraising'::module_type
FROM public.organizations o
WHERE NOT EXISTS (
  SELECT 1 FROM public.organization_modules om 
  WHERE om.org_id = o.id AND om.module = 'fundraising'
);

INSERT INTO public.organization_modules (org_id, module)
SELECT o.id, 'users'::module_type
FROM public.organizations o
WHERE NOT EXISTS (
  SELECT 1 FROM public.organization_modules om 
  WHERE om.org_id = o.id AND om.module = 'users'
);

-- Create a default department if none exists
INSERT INTO public.departments (org_id, name, description, created_by)
SELECT o.id, 'General', 'Default department for organization members', 
       (SELECT id FROM public.profiles WHERE org_id = o.id ORDER BY created_at ASC LIMIT 1)
FROM public.organizations o
WHERE NOT EXISTS (
  SELECT 1 FROM public.departments d 
  WHERE d.org_id = o.id
);