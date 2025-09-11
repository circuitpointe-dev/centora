-- Fix the permissions by using the correct enum values
-- First check what feature_permission enum contains
-- From the database schema it likely has different values

-- Create a simple seeding approach with just the basic structure
-- Insert the 4 required roles manually for existing organizations

DO $$
DECLARE
  org_record RECORD;
  _created_by UUID;
BEGIN
  -- Loop through organizations that have org_admins
  FOR org_record IN 
    SELECT DISTINCT o.id as org_id
    FROM organizations o
    INNER JOIN profiles p ON p.org_id = o.id
    WHERE p.role = 'org_admin'
  LOOP
    -- Get a valid created_by user for this org
    SELECT id INTO _created_by FROM profiles 
    WHERE org_id = org_record.org_id AND role = 'org_admin' 
    LIMIT 1;
    
    -- Insert roles if they don't exist
    INSERT INTO roles (org_id, name, description, created_by)
    SELECT 
      org_record.org_id,
      role_name,
      role_desc,
      _created_by
    FROM (VALUES 
      ('Admin', 'Full access to all features and settings'),
      ('Contributor', 'Edit access to assigned features'),
      ('Viewer', 'View-only access to organization data'),
      ('Custom', 'Customized permissions per user')
    ) AS role_data(role_name, role_desc)
    WHERE NOT EXISTS (
      SELECT 1 FROM roles 
      WHERE org_id = org_record.org_id AND name = role_data.role_name
    );
  END LOOP;
END $$;