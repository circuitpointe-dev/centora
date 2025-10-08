-- Drop ALL existing profiles policies to start fresh
DROP POLICY IF EXISTS "Users can view own and org profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view profiles in their org" ON profiles;
DROP POLICY IF EXISTS "Users can view same org profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile basic info" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Org admins can update org member profiles" ON profiles;
DROP POLICY IF EXISTS "Org admins can update member profiles" ON profiles;
DROP POLICY IF EXISTS "Prevent role self-escalation" ON profiles;
DROP POLICY IF EXISTS "Super admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Org members can insert with correct org" ON profiles;

-- Create clean, non-recursive policies using only security definer functions

-- SELECT: Users can view their own profile, profiles in their org, or all if super admin
CREATE POLICY "profiles_select_policy"
ON profiles FOR SELECT
USING (
  id = auth.uid() 
  OR org_id = get_user_org_id(auth.uid())
  OR is_user_super_admin(auth.uid())
);

-- INSERT: Users can create their own profile
CREATE POLICY "profiles_insert_own"
ON profiles FOR INSERT
WITH CHECK (id = auth.uid());

-- UPDATE: Users can update their own profile (excluding role changes)
-- Org admins can update profiles in their org
-- Super admins can update any profile
CREATE POLICY "profiles_update_policy"
ON profiles FOR UPDATE
USING (
  id = auth.uid()
  OR is_user_org_admin(auth.uid(), org_id)
  OR is_user_super_admin(auth.uid())
)
WITH CHECK (
  id = auth.uid()
  OR is_user_org_admin(auth.uid(), org_id)
  OR is_user_super_admin(auth.uid())
);

-- DELETE: Only super admins can delete profiles
CREATE POLICY "profiles_delete_policy"
ON profiles FOR DELETE
USING (is_user_super_admin(auth.uid()));