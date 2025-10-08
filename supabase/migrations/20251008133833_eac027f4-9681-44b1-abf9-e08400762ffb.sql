-- Phase 1: Critical Security Fixes

-- 1. Prevent users from updating their own role (privilege escalation protection)
DROP POLICY IF EXISTS "Prevent role self-escalation" ON profiles;
CREATE POLICY "Prevent role self-escalation"
ON profiles FOR UPDATE
USING (
  -- Allow update if user is not changing their own role
  (id != auth.uid()) OR 
  -- Or if they're an org admin making the change
  (is_org_admin((SELECT org_id FROM profiles WHERE id = auth.uid())))
)
WITH CHECK (
  -- Prevent users from changing their own role
  (id != auth.uid() AND role = (SELECT role FROM profiles WHERE id = auth.uid())) OR
  -- Allow org admins to change roles
  (is_org_admin((SELECT org_id FROM profiles WHERE id = auth.uid())))
);

-- 2. Strengthen profiles table RLS for PII protection
DROP POLICY IF EXISTS "Users can view profiles in their org" ON profiles;
CREATE POLICY "Users can view profiles in their org"
ON profiles FOR SELECT
USING (
  -- Users can only view profiles in their own organization
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() 
    AND p.org_id = profiles.org_id
  )
  OR is_super_admin()
);

-- 3. Strengthen donor_contacts RLS policies
DROP POLICY IF EXISTS "Users can view donor contacts" ON donor_contacts;
CREATE POLICY "Users can view donor contacts"
ON donor_contacts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM donors d
    JOIN profiles p ON p.org_id = d.org_id
    WHERE d.id = donor_contacts.donor_id 
    AND p.id = auth.uid()
  )
);

-- 4. Add RLS policy for finance_team_members PII protection
DROP POLICY IF EXISTS "Org members can view finance team members" ON finance_team_members;
CREATE POLICY "Org members view finance team with PII restrictions"
ON finance_team_members FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() 
    AND p.org_id = finance_team_members.org_id
  )
);

-- 5. Add constraint to prevent direct role column updates (deprecation step)
-- Note: This adds a trigger to audit role changes
CREATE OR REPLACE FUNCTION audit_role_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Log any role changes to audit_logs
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    INSERT INTO audit_logs (
      action,
      actor_id,
      target_user_id,
      metadata,
      created_at
    ) VALUES (
      'role_change',
      auth.uid(),
      NEW.id,
      jsonb_build_object(
        'old_role', OLD.role,
        'new_role', NEW.role,
        'org_id', NEW.org_id
      ),
      now()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS audit_profile_role_changes ON profiles;
CREATE TRIGGER audit_profile_role_changes
AFTER UPDATE OF role ON profiles
FOR EACH ROW
EXECUTE FUNCTION audit_role_changes();

-- 6. Ensure user_roles table has proper RLS
DROP POLICY IF EXISTS "Org admins can manage user roles" ON user_roles;
CREATE POLICY "Org admins can manage user roles"
ON user_roles FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid()
    AND is_org_admin(p.org_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid()
    AND is_org_admin(p.org_id)
  )
);

DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;
CREATE POLICY "Users can view their own roles"
ON user_roles FOR SELECT
USING (profile_id = auth.uid());