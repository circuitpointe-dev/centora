-- Simple roles creation without constraints initially
CREATE TABLE IF NOT EXISTS public.system_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_system BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.client_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(org_id, name)
);

-- Enable RLS
ALTER TABLE public.system_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view system roles" ON public.system_roles
  FOR SELECT USING (true);

CREATE POLICY "Super admins can manage system roles" ON public.system_roles
  FOR ALL USING (is_super_admin());

CREATE POLICY "Users can view org roles" ON public.client_roles
  FOR SELECT USING (org_match(org_id));

CREATE POLICY "Org admins can manage org roles" ON public.client_roles
  FOR ALL USING (is_org_admin(org_id) OR is_super_admin());

-- Insert default roles
INSERT INTO public.system_roles (name, description) VALUES
  ('Super Admin', 'Full platform access with all permissions'),
  ('Platform Admin', 'Platform-wide administrative access'),
  ('System Auditor', 'Read-only access to system logs and analytics')
ON CONFLICT (name) DO NOTHING;

-- Insert client roles for existing orgs
DO $$
DECLARE
  org_record RECORD;
BEGIN
  FOR org_record IN SELECT id FROM public.organizations LOOP
    INSERT INTO public.client_roles (org_id, name, description) VALUES
      (org_record.id, 'Admin', 'Full organizational access and user management'),
      (org_record.id, 'Manager', 'Department management and reporting access'),
      (org_record.id, 'Staff', 'Standard access to assigned modules and features'),
      (org_record.id, 'Viewer', 'Read-only access to organizational data')
    ON CONFLICT (org_id, name) DO NOTHING;
  END LOOP;
END
$$;