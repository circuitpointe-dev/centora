-- Fix infinite recursion in profiles table RLS policies
-- Drop the problematic policies that cause recursion
DROP POLICY IF EXISTS "profiles_read_same_org" ON public.profiles;
DROP POLICY IF EXISTS "profiles_read_super" ON public.profiles;

-- Create simple, non-recursive policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (id = auth.uid());

CREATE POLICY "Users can view profiles in same org" 
ON public.profiles 
FOR SELECT 
USING (org_id = current_org_id() OR is_super_admin());

CREATE POLICY "Users can create profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK ((auth.uid() = id) OR ((auth.jwt() ->> 'role'::text) = 'org_admin'::text));

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (id = auth.uid());

CREATE POLICY "Org admins can update member roles only" 
ON public.profiles 
FOR UPDATE 
USING (is_org_admin(org_id));

CREATE POLICY "Super Admins can manage all profiles" 
ON public.profiles 
FOR ALL 
USING (is_super_admin());