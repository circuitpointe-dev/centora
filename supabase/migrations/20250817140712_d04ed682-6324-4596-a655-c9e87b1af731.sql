-- Phase 1: Foundation Schema - Create enums, helper functions, and new tables

-- Create new enums
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'deactivated');
CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'rejected', 'expired');
CREATE TYPE feature_permission AS ENUM ('read', 'write', 'admin');

-- Create SECURITY DEFINER helper functions
CREATE OR REPLACE FUNCTION current_org_id()
RETURNS UUID
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT org_id FROM profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(is_super_admin, false) FROM profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION org_match(check_org_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT current_org_id() = check_org_id OR is_super_admin();
$$;

-- Create departments table
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(org_id, name)
);

-- Create roles table
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(org_id, name)
);

-- Create role_permissions table (normalized permissions instead of JSONB)
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  module_key TEXT NOT NULL,
  feature_id TEXT NOT NULL,
  permissions feature_permission[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(role_id, module_key, feature_id)
);

-- Create user_roles table (many-to-many for profiles and roles)
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  assigned_by UUID NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(profile_id, role_id)
);

-- Create user_invitations table
CREATE TABLE user_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  role_ids UUID[] NOT NULL DEFAULT '{}',
  access JSONB,
  status invitation_status NOT NULL DEFAULT 'pending',
  token TEXT NOT NULL UNIQUE,
  invited_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '7 days'),
  redeemed_at TIMESTAMP WITH TIME ZONE
);

-- Create unique index for pending invitations per org/email
CREATE UNIQUE INDEX idx_pending_invitations 
ON user_invitations (org_id, lower(email)) 
WHERE status = 'pending';

-- Extend profiles table (keeping existing role column for backward compatibility)
ALTER TABLE profiles 
ADD COLUMN status user_status NOT NULL DEFAULT 'active',
ADD COLUMN department_id UUID REFERENCES departments(id) ON DELETE SET NULL;

-- Enable RLS on all new tables
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for departments
CREATE POLICY "Org members can view departments" ON departments
  FOR SELECT USING (org_match(org_id));

CREATE POLICY "Org admins can manage departments" ON departments
  FOR ALL USING (org_match(org_id) AND is_org_admin(org_id))
  WITH CHECK (org_match(org_id) AND is_org_admin(org_id));

-- RLS Policies for roles
CREATE POLICY "Org members can view roles" ON roles
  FOR SELECT USING (org_match(org_id));

CREATE POLICY "Org admins can manage roles" ON roles
  FOR ALL USING (org_match(org_id) AND is_org_admin(org_id))
  WITH CHECK (org_match(org_id) AND is_org_admin(org_id));

-- RLS Policies for role_permissions
CREATE POLICY "Org members can view role permissions" ON role_permissions
  FOR SELECT USING (org_match(org_id));

CREATE POLICY "Org admins can manage role permissions" ON role_permissions
  FOR ALL USING (org_match(org_id) AND is_org_admin(org_id))
  WITH CHECK (org_match(org_id) AND is_org_admin(org_id));

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles" ON user_roles
  FOR SELECT USING (profile_id = auth.uid() OR EXISTS(
    SELECT 1 FROM profiles p WHERE p.id = profile_id AND org_match(p.org_id)
  ));

CREATE POLICY "Org admins can manage user roles" ON user_roles
  FOR ALL USING (EXISTS(
    SELECT 1 FROM profiles p WHERE p.id = profile_id AND org_match(p.org_id) AND is_org_admin(p.org_id)
  ))
  WITH CHECK (EXISTS(
    SELECT 1 FROM profiles p WHERE p.id = profile_id AND org_match(p.org_id) AND is_org_admin(p.org_id)
  ));

-- RLS Policies for user_invitations
CREATE POLICY "Org members can view invitations" ON user_invitations
  FOR SELECT USING (org_match(org_id));

CREATE POLICY "Org admins can manage invitations" ON user_invitations
  FOR ALL USING (org_match(org_id) AND is_org_admin(org_id))
  WITH CHECK (org_match(org_id) AND is_org_admin(org_id));

-- Create updated_at triggers for new tables
CREATE TRIGGER update_departments_updated_at
  BEFORE UPDATE ON departments
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER update_roles_updated_at
  BEFORE UPDATE ON roles
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER update_role_permissions_updated_at
  BEFORE UPDATE ON role_permissions
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER update_user_invitations_updated_at
  BEFORE UPDATE ON user_invitations
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();