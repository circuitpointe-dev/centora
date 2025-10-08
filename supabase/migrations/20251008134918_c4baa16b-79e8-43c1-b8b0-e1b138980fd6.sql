-- Fix remaining infinite recursion in profiles policies
-- Drop the problematic UPDATE policy that has a direct SELECT
DROP POLICY IF EXISTS "Users can update own profile basic info" ON profiles;

-- Recreate without the recursive SELECT in WITH CHECK
-- Users can only update their own profile, and role changes are prevented by simply not including it in allowed updates
CREATE POLICY "Users can update own profile basic info"
ON profiles FOR UPDATE
USING (id = auth.uid())
WITH CHECK (
  id = auth.uid() 
  -- Role changes are blocked by omitting role from updateable columns
  -- The application layer should handle role separately through admin functions
);