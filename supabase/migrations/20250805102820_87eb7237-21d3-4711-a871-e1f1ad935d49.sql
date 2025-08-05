-- Create organizations table
CREATE TABLE public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('NGO', 'Donor')),
  slug TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending_verification' CHECK (status IN ('pending_verification', 'active', 'suspended')),
  address TEXT,
  establishment_date DATE,
  currency TEXT DEFAULT 'USD',
  contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id),
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create organization_modules table
CREATE TABLE public.organization_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id),
  module_name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(organization_id, module_name)
);

-- Enable RLS
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_modules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizations
CREATE POLICY "Users can view their own organization" 
ON public.organizations 
FOR SELECT 
USING (id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (id = auth.uid());

-- RLS Policies for organization_modules
CREATE POLICY "Users can view their organization's modules" 
ON public.organization_modules 
FOR SELECT 
USING (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to generate unique slug
CREATE OR REPLACE FUNCTION public.generate_unique_slug(base_name TEXT)
RETURNS TEXT AS $$
DECLARE
  slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Convert to lowercase and replace spaces with hyphens
  slug := lower(regexp_replace(base_name, '[^a-zA-Z0-9\s]', '', 'g'));
  slug := regexp_replace(slug, '\s+', '-', 'g');
  
  -- Check if slug exists, if so add counter
  WHILE EXISTS (SELECT 1 FROM public.organizations WHERE organizations.slug = slug) LOOP
    counter := counter + 1;
    slug := lower(regexp_replace(base_name, '[^a-zA-Z0-9\s]', '', 'g'));
    slug := regexp_replace(slug, '\s+', '-', 'g') || '-' || counter::TEXT;
  END LOOP;
  
  RETURN slug;
END;
$$ LANGUAGE plpgsql;

-- Create RPC function for organization registration
CREATE OR REPLACE FUNCTION public.register_organization_and_user(
  p_org_name TEXT,
  p_org_type TEXT,
  p_user_email TEXT,
  p_user_password TEXT,
  p_full_name TEXT,
  p_selected_modules TEXT[],
  p_address TEXT DEFAULT NULL,
  p_establishment_date DATE DEFAULT NULL,
  p_currency TEXT DEFAULT 'USD',
  p_contact_phone TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  org_id UUID;
  org_slug TEXT;
  module_name TEXT;
BEGIN
  -- Generate unique slug
  org_slug := public.generate_unique_slug(p_org_name);
  
  -- Insert organization
  INSERT INTO public.organizations (
    name, type, slug, address, establishment_date, currency, contact_phone
  ) VALUES (
    p_org_name, p_org_type, org_slug, p_address, p_establishment_date, p_currency, p_contact_phone
  ) RETURNING id INTO org_id;
  
  -- Insert organization modules
  FOREACH module_name IN ARRAY p_selected_modules
  LOOP
    INSERT INTO public.organization_modules (organization_id, module_name)
    VALUES (org_id, module_name);
  END LOOP;
  
  RETURN json_build_object('organization_id', org_id, 'slug', org_slug);
EXCEPTION
  WHEN others THEN
    RETURN json_build_object('error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create RPC function to complete registration
CREATE OR REPLACE FUNCTION public.complete_registration_transaction(
  p_user_id UUID,
  p_org_id UUID
)
RETURNS JSON AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, organization_id, full_name, role)
  SELECT p_user_id, p_org_id, 
         COALESCE((auth.jwt() ->> 'user_metadata')::jsonb ->> 'full_name', 'Admin'),
         'admin'
  WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_user_id);
  
  RETURN json_build_object('success', true);
EXCEPTION
  WHEN others THEN
    RETURN json_build_object('error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;