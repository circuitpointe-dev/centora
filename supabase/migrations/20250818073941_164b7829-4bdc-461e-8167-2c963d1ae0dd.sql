-- Seed the features table with module features
INSERT INTO features (module, feature_name, feature_key, permissions) VALUES
-- Fundraising module features
('fundraising', 'Dashboard', 'dashboard', ARRAY['read']::feature_permission[]),
('fundraising', 'Active grants', 'active-grants', ARRAY['create', 'read', 'update', 'delete', 'export', 'upload']::feature_permission[]),
('fundraising', 'Grantee submissions', 'grantee-submissions', ARRAY['create', 'read', 'update', 'delete', 'export', 'upload']::feature_permission[]),
('fundraising', 'Templates', 'templates', ARRAY['create', 'read', 'update', 'delete', 'export']::feature_permission[]),
('fundraising', 'Grants archive', 'grants-archive', ARRAY['read', 'export']::feature_permission[]),

-- Documents module features
('documents', 'Documents', 'documents', ARRAY['create', 'read', 'update', 'delete', 'upload']::feature_permission[]),
('documents', 'Templates', 'templates', ARRAY['create', 'read', 'update', 'delete', 'export']::feature_permission[]),
('documents', 'E-Signature', 'e-signature', ARRAY['create', 'read', 'update']::feature_permission[]),
('documents', 'Compliance', 'compliance', ARRAY['read']::feature_permission[]),

-- Grants module features
('grants', 'Grants manager', 'grants-manager', ARRAY['create', 'read', 'update', 'delete', 'export', 'upload']::feature_permission[]),
('grants', 'Report submissions', 'reports-submissions', ARRAY['read', 'update', 'export']::feature_permission[])

ON CONFLICT (module, feature_key) DO UPDATE SET
  feature_name = EXCLUDED.feature_name,
  permissions = EXCLUDED.permissions;

-- Create RPC function to get organization modules with features
CREATE OR REPLACE FUNCTION public.get_org_modules_with_features()
RETURNS TABLE(
  module text,
  module_name text,
  features jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _org_id UUID;
BEGIN
  _org_id := current_org_id();
  
  IF _org_id IS NULL THEN
    RAISE EXCEPTION 'User not associated with any organization';
  END IF;

  RETURN QUERY
  SELECT 
    om.module::text,
    CASE om.module
      WHEN 'fundraising' THEN 'Fundraising'
      WHEN 'documents' THEN 'Documents'
      WHEN 'grants' THEN 'Grants'
      WHEN 'opportunity_tracking' THEN 'Opportunity Tracking'
      WHEN 'user_management' THEN 'User Management'
      ELSE initcap(om.module::text)
    END as module_name,
    jsonb_agg(
      jsonb_build_object(
        'id', f.feature_key,
        'name', f.feature_name,
        'permissions', f.permissions
      )
    ) as features
  FROM organization_modules om
  JOIN features f ON f.module = om.module::text
  WHERE om.org_id = _org_id
  GROUP BY om.module;
END;
$function$;