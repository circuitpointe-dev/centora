-- Drop existing tables if they exist (in correct order to handle foreign keys)
DROP TABLE IF EXISTS public.organization_modules CASCADE;
DROP TABLE IF EXISTS public.organization_contacts CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.organizations CASCADE;

-- Drop existing types if they exist
DROP TYPE IF EXISTS public.organization_type CASCADE;
DROP TYPE IF EXISTS public.organization_status CASCADE;

-- Create enums for organization types and status
CREATE TYPE public.organization_type AS ENUM ('NGO', 'Donor');
CREATE TYPE public.organization_status AS ENUM ('pending_verification', 'active', 'suspended');

-- Create organizations table
CREATE TABLE public.organizations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE, -- Added UNIQUE constraint for organization name
    slug TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE, -- Added email to organizations table, ensuring uniqueness
    type organization_type NOT NULL,
    status organization_status NOT NULL DEFAULT 'pending_verification',
    address TEXT,
    establishment_date DATE,
    currency TEXT DEFAULT 'USD',
    primary_user_id UUID, -- This will be set after user is authenticated, no direct FK here yet
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, -- CORRECTED: Added REFERENCES auth.users(id)
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
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
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create function to get user's organization ID
CREATE OR REPLACE FUNCTION public.get_user_organization_id()
RETURNS UUID
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
    SELECT organization_id FROM public.profiles WHERE id = auth.uid();
$$;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_user_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
    SELECT role = 'admin' FROM public.profiles WHERE id = auth.uid();
$$;

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON public.organizations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_organization_contacts_updated_at
    BEFORE UPDATE ON public.organization_contacts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS on all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_modules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizations table
CREATE POLICY "Allow anon users to create organizations"
    ON public.organizations
    FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to view their organization"
    ON public.organizations
    FOR SELECT
    TO authenticated
    USING (id = get_user_organization_id());

CREATE POLICY "Allow admins to update their organization"
    ON public.organizations
    FOR UPDATE
    TO authenticated
    USING (id = get_user_organization_id() AND is_user_admin())
    WITH CHECK (id = get_user_organization_id() AND is_user_admin());

-- RLS Policies for profiles table
CREATE POLICY "Allow authenticated users to create their own profile"
    ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (id = auth.uid());

CREATE POLICY "Allow authenticated users to view their own profile"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (id = auth.uid());

CREATE POLICY "Allow authenticated users to view profiles in their organization"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (organization_id = get_user_organization_id());

CREATE POLICY "Allow authenticated users to update their own profile"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

CREATE POLICY "Allow admins to create profiles for their organization"
    ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (organization_id = get_user_organization_id() AND is_user_admin());

-- RLS Policies for organization_contacts table
CREATE POLICY "Allow authenticated users to create organization contacts"
    ON public.organization_contacts
    FOR INSERT
    TO authenticated
    WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Allow authenticated users to view their organization contacts"
    ON public.organization_contacts
    FOR SELECT
    TO authenticated
    USING (organization_id = get_user_organization_id());

CREATE POLICY "Allow admins to manage their organization contacts"
    ON public.organization_contacts
    FOR ALL
    TO authenticated
    USING (organization_id = get_user_organization_id() AND is_user_admin())
    WITH CHECK (organization_id = get_user_organization_id() AND is_user_admin());

-- RLS Policies for organization_modules table
CREATE POLICY "Allow authenticated users to create organization modules"
    ON public.organization_modules
    FOR INSERT
    TO authenticated
    WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Allow authenticated users to view their organization modules"
    ON public.organization_modules
    FOR SELECT
    TO authenticated
    USING (organization_id = get_user_organization_id());

CREATE POLICY "Allow admins to manage their organization modules"
    ON public.organization_modules
    FOR ALL
    TO authenticated
    USING (organization_id = get_user_organization_id() AND is_user_admin())
    WITH CHECK (organization_id = get_user_organization_id() AND is_user_admin());