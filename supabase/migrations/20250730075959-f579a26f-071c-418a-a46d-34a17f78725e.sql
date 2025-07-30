-- Create organization type enum
CREATE TYPE organization_type AS ENUM ('NGO', 'Donor');

-- Create organization status enum
CREATE TYPE organization_status AS ENUM ('pending_verification', 'active', 'suspended');

-- Create organizations table
CREATE TABLE public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type organization_type NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  address TEXT,
  establishment_date DATE,
  currency TEXT DEFAULT 'USD',
  status organization_status DEFAULT 'pending_verification',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create organization_contacts table
CREATE TABLE public.organization_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create organization_modules table
CREATE TABLE public.organization_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  module_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  activated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(organization_id, module_name)
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user's organization
CREATE OR REPLACE FUNCTION public.get_user_organization_id()
RETURNS UUID AS $$
  SELECT organization_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- RLS Policies for organizations
CREATE POLICY "Users can view their own organization" 
ON public.organizations 
FOR SELECT 
USING (id = public.get_user_organization_id());

CREATE POLICY "Users can update their own organization" 
ON public.organizations 
FOR UPDATE 
USING (id = public.get_user_organization_id());

-- RLS Policies for organization_contacts
CREATE POLICY "Users can view their organization contacts" 
ON public.organization_contacts 
FOR SELECT 
USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can manage their organization contacts" 
ON public.organization_contacts 
FOR ALL 
USING (organization_id = public.get_user_organization_id());

-- RLS Policies for organization_modules
CREATE POLICY "Users can view their organization modules" 
ON public.organization_modules 
FOR SELECT 
USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can manage their organization modules" 
ON public.organization_modules 
FOR ALL 
USING (organization_id = public.get_user_organization_id());

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (id = auth.uid());

CREATE POLICY "Users can view profiles in their organization" 
ON public.profiles 
FOR SELECT 
USING (organization_id = public.get_user_organization_id());

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_organization_contacts_updated_at
  BEFORE UPDATE ON public.organization_contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to generate organization slug
CREATE OR REPLACE FUNCTION public.generate_organization_slug(org_name TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 1;
BEGIN
  -- Create base slug from organization name
  base_slug := lower(regexp_replace(org_name, '[^a-zA-Z0-9\s]', '', 'g'));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  
  final_slug := base_slug;
  
  -- Check if slug exists and increment counter if needed
  WHILE EXISTS (SELECT 1 FROM public.organizations WHERE slug = final_slug) LOOP
    final_slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Insert development organizations
INSERT INTO public.organizations (id, name, type, slug, status) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Demo NGO Organization', 'NGO', 'demo-ngo', 'active'),
  ('00000000-0000-0000-0000-000000000002', 'Demo Donor Organization', 'Donor', 'demo-donor', 'active');

-- Insert organization modules for development orgs
INSERT INTO public.organization_modules (organization_id, module_name) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Fundraising'),
  ('00000000-0000-0000-0000-000000000001', 'Document Manager'),
  ('00000000-0000-0000-0000-000000000002', 'Grant Management');

-- Insert development organization contacts
INSERT INTO public.organization_contacts (organization_id, name, email, phone, is_primary) VALUES
  ('00000000-0000-0000-0000-000000000001', 'NGO User', 'user@ngo.com', '+1234567890', true),
  ('00000000-0000-0000-0000-000000000002', 'Donor User', 'user@donor.com', '+1234567891', true);