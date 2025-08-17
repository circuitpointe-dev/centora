-- Add User Management module to existing organizations that don't have it
INSERT INTO organization_modules (org_id, module)
SELECT o.id, 'users'::organization_module
FROM organizations o
WHERE NOT EXISTS (
  SELECT 1 FROM organization_modules om 
  WHERE om.org_id = o.id AND om.module = 'users'
);