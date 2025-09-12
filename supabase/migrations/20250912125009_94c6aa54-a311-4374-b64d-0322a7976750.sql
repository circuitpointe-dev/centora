-- Create a trigger to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  default_org_id uuid;
  default_dept_id uuid;
BEGIN
  -- Get or create a default organization
  SELECT id INTO default_org_id 
  FROM public.organizations 
  ORDER BY created_at ASC 
  LIMIT 1;
  
  -- If no organization exists, create one
  IF default_org_id IS NULL THEN
    INSERT INTO public.organizations (name, type, created_by)
    VALUES ('Demo NGO Organization', 'NGO'::organization_type, NEW.id)
    RETURNING id INTO default_org_id;
    
    -- Add default modules for the new organization
    INSERT INTO public.organization_modules (org_id, module)
    VALUES 
      (default_org_id, 'fundraising'),
      (default_org_id, 'users');
  END IF;

  -- Create the user profile
  INSERT INTO public.profiles (id, email, full_name, org_id, role, is_super_admin, access_json)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    default_org_id,
    'org_member'::app_role,
    false,
    '{}'::jsonb
  );

  -- Create a default department if none exists for this organization
  SELECT id INTO default_dept_id
  FROM public.departments 
  WHERE org_id = default_org_id
  LIMIT 1;
  
  IF default_dept_id IS NULL THEN
    INSERT INTO public.departments (org_id, name, description, created_by)
    VALUES (default_org_id, 'General', 'Default department for organization members', NEW.id);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();