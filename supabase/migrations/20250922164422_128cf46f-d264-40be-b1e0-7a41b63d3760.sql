-- Enable all 10 modules for the organization during development
INSERT INTO public.organization_modules (org_id, module) 
SELECT 
  (SELECT id FROM organizations LIMIT 1) as org_id,
  module_name
FROM (
  VALUES 
    ('grants'),
    ('finance'),
    ('users'),
    ('inventory'),
    ('fundraising'),
    ('learning'),
    ('programme'),
    ('hr'),
    ('procurement'),
    ('documents')
) AS modules(module_name)
ON CONFLICT (org_id, module) DO NOTHING;