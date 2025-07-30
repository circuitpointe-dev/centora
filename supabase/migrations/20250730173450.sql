-- Fix the RLS policy for organization creation during signup
-- The issue is likely that the user is not authenticated when creating the organization
-- Let's create a more permissive policy for organization creation

-- Drop the existing policy and recreate it
DROP POLICY IF EXISTS "Allow organization creation during signup" ON public.organizations;

-- Create a new policy that allows any authenticated user to create an organization
CREATE POLICY "Allow authenticated users to create organizations" 
ON public.organizations 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Also ensure the profiles table has the correct policy for creation
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Recreate the profile insertion policy
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (id = auth.uid());

-- Ensure organization_contacts has proper policy
DROP POLICY IF EXISTS "Users can manage their organization contacts" ON public.organization_contacts;

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

-- Ensure organization_modules has proper policy
DROP POLICY IF EXISTS "Users can manage their organization modules" ON public.organization_modules;

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