-- Create development organizations for testing
INSERT INTO public.organizations (id, name, type, email, slug, status, establishment_date, currency) 
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Development NGO', 'NGO', 'user@ngo.com', 'development-ngo', 'active', '2020-01-01', 'USD'),
  ('00000000-0000-0000-0000-000000000002', 'Development Donor', 'Donor', 'user@donor.com', 'development-donor', 'active', '2020-01-01', 'USD')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  email = EXCLUDED.email,
  slug = EXCLUDED.slug,
  status = EXCLUDED.status;

-- Add all available modules for both development organizations (using actual module names from moduleConfigs)
INSERT INTO public.organization_modules (organization_id, module_name, is_active)
VALUES 
  -- NGO modules
  ('00000000-0000-0000-0000-000000000001', 'fundraising', true),
  ('00000000-0000-0000-0000-000000000001', 'grants', true),
  ('00000000-0000-0000-0000-000000000001', 'documents', true),
  ('00000000-0000-0000-0000-000000000001', 'programme', true),
  ('00000000-0000-0000-0000-000000000001', 'procurement', true),
  ('00000000-0000-0000-0000-000000000001', 'inventory', true),
  ('00000000-0000-0000-0000-000000000001', 'finance', true),
  ('00000000-0000-0000-0000-000000000001', 'learning', true),
  ('00000000-0000-0000-0000-000000000001', 'hr', true),
  ('00000000-0000-0000-0000-000000000001', 'users', true),
  -- Donor modules  
  ('00000000-0000-0000-0000-000000000002', 'fundraising', true),
  ('00000000-0000-0000-0000-000000000002', 'grants', true),
  ('00000000-0000-0000-0000-000000000002', 'documents', true),
  ('00000000-0000-0000-0000-000000000002', 'programme', true),
  ('00000000-0000-0000-0000-000000000002', 'procurement', true),
  ('00000000-0000-0000-0000-000000000002', 'inventory', true),
  ('00000000-0000-0000-0000-000000000002', 'finance', true),
  ('00000000-0000-0000-0000-000000000002', 'learning', true),
  ('00000000-0000-0000-0000-000000000002', 'hr', true),
  ('00000000-0000-0000-0000-000000000002', 'users', true)
ON CONFLICT (organization_id, module_name) DO UPDATE SET
  is_active = EXCLUDED.is_active;

-- Add organization contacts for both development organizations
INSERT INTO public.organization_contacts (organization_id, name, email, is_primary)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'NGO User', 'user@ngo.com', true),
  ('00000000-0000-0000-0000-000000000002', 'Donor User', 'user@donor.com', true)
ON CONFLICT (organization_id, email) DO UPDATE SET
  name = EXCLUDED.name,
  is_primary = EXCLUDED.is_primary;