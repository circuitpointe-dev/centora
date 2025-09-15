-- Drop all existing profiles policies to fix recursion
DROP POLICY IF EXISTS "Org admins can update member roles only" ON public.profiles;
DROP POLICY IF EXISTS "Super Admins can view and manage all data" ON public.profiles;
DROP POLICY IF EXISTS "Users can create profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_read_same_org" ON public.profiles;
DROP POLICY IF EXISTS "profiles_read_super" ON public.profiles;

-- Create clean, non-recursive policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (id = auth.uid());

CREATE POLICY "Users can view same org profiles" 
ON public.profiles 
FOR SELECT 
USING (org_id = current_org_id() OR is_super_admin());

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (id = auth.uid());

CREATE POLICY "Org admins can update member profiles" 
ON public.profiles 
FOR UPDATE 
USING (is_org_admin(org_id));

CREATE POLICY "Super admins can manage all profiles" 
ON public.profiles 
FOR ALL 
USING (is_super_admin());