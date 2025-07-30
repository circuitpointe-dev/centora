-- Fix the RLS policies by properly dropping existing ones first

-- Drop all existing policies for organizations
DROP POLICY IF EXISTS "Allow organization creation during signup" ON public.organizations;
DROP POLICY IF EXISTS "Allow authenticated users to create organizations" ON public.organizations;

-- Create a new policy that allows any authenticated user to create an organization
CREATE POLICY "Allow authenticated users to create organizations" 
ON public.organizations 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Drop all existing policies for organization_contacts
DROP POLICY IF EXISTS "Users can manage their organization contacts" ON public.organization_contacts;
DROP POLICY IF EXISTS "Users can view their organization contacts" ON public.organization_contacts;
DROP POLICY IF EXISTS "Users can create organization contacts" ON public.organization_contacts;
DROP POLICY IF EXISTS "Users can update their organization contacts" ON public.organization_contacts;
DROP POLICY IF EXISTS "Users can delete their organization contacts" ON public.organization_contacts;

-- Recreate organization_contacts policies
CREATE POLICY "Users can create organization contacts" 
ON public.organization_contacts 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can view their organization contacts" 
ON public.organization_contacts 
FOR SELECT 
TO authenticated
USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can update their organization contacts" 
ON public.organization_contacts 
FOR UPDATE 
TO authenticated
USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can delete their organization contacts" 
ON public.organization_contacts 
FOR DELETE 
TO authenticated
USING (organization_id = get_user_organization_id());

-- Drop all existing policies for organization_modules
DROP POLICY IF EXISTS "Users can manage their organization modules" ON public.organization_modules;
DROP POLICY IF EXISTS "Users can view their organization modules" ON public.organization_modules;
DROP POLICY IF EXISTS "Users can create organization modules" ON public.organization_modules;
DROP POLICY IF EXISTS "Users can update their organization modules" ON public.organization_modules;
DROP POLICY IF EXISTS "Users can delete their organization modules" ON public.organization_modules;

-- Recreate organization_modules policies
CREATE POLICY "Users can create organization modules" 
ON public.organization_modules 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can view their organization modules" 
ON public.organization_modules 
FOR SELECT 
TO authenticated
USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can update their organization modules" 
ON public.organization_modules 
FOR UPDATE 
TO authenticated
USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can delete their organization modules" 
ON public.organization_modules 
FOR DELETE 
TO authenticated
USING (organization_id = get_user_organization_id());