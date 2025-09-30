-- Fix RLS policies for signup flow - v2

-- Drop and recreate policies safely
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create proper RLS policies for profiles
CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Fix organizations RLS policies
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can create organizations" ON organizations;
  DROP POLICY IF EXISTS "Users can view their own organization" ON organizations;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Users can create organizations"
  ON organizations
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their own organization"
  ON organizations
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE org_id = organizations.id
    )
  );

-- Fix organization_modules RLS policies
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can insert org modules" ON organization_modules;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Users can insert org modules"
  ON organization_modules
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT p.id FROM profiles p WHERE p.org_id = organization_modules.org_id
    )
  );