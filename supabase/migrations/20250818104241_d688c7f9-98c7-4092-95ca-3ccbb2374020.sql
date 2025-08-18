-- Create user permissions table for explicit per-user permission overrides
CREATE TABLE public.user_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL,
  org_id UUID NOT NULL,
  module_key TEXT NOT NULL,
  feature_id TEXT NOT NULL,
  permissions TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL,
  UNIQUE(profile_id, module_key, feature_id)
);

-- Create user module access table for module-level access control
CREATE TABLE public.user_module_access (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL,
  org_id UUID NOT NULL,
  module_key TEXT NOT NULL,
  has_access BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL,
  UNIQUE(profile_id, module_key)
);

-- Enable RLS
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_module_access ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_permissions
CREATE POLICY "Org admins can manage user permissions" 
ON public.user_permissions 
FOR ALL 
USING (org_match(org_id) AND is_org_admin(org_id))
WITH CHECK (org_match(org_id) AND is_org_admin(org_id));

CREATE POLICY "Users can view their own permissions" 
ON public.user_permissions 
FOR SELECT 
USING (profile_id = auth.uid());

-- RLS policies for user_module_access
CREATE POLICY "Org admins can manage user module access" 
ON public.user_module_access 
FOR ALL 
USING (org_match(org_id) AND is_org_admin(org_id))
WITH CHECK (org_match(org_id) AND is_org_admin(org_id));

CREATE POLICY "Users can view their own module access" 
ON public.user_module_access 
FOR SELECT 
USING (profile_id = auth.uid());

-- Add triggers for updated_at
CREATE TRIGGER update_user_permissions_updated_at
BEFORE UPDATE ON public.user_permissions
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_user_module_access_updated_at
BEFORE UPDATE ON public.user_module_access
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Function to set complete user access map
CREATE OR REPLACE FUNCTION public.set_user_access_map(
  _profile_id UUID,
  _access_map JSONB
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _org_id UUID;
  _module_key TEXT;
  _module_data JSONB;
  _feature_id TEXT;
  _feature_perms TEXT[];
  _has_module_access BOOLEAN;
BEGIN
  -- Get user's org_id and verify admin permissions
  SELECT org_id INTO _org_id FROM profiles WHERE id = _profile_id;
  
  IF _org_id IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  IF NOT is_org_admin(_org_id) THEN
    RAISE EXCEPTION 'Only organization administrators can set user permissions';
  END IF;
  
  -- Protect admin access to users module
  IF _profile_id IN (SELECT id FROM profiles WHERE org_id = _org_id AND role = 'org_admin') THEN
    IF NOT ((_access_map->>'users')::JSONB ? '_module' AND 
            ((_access_map->>'users')::JSONB->>'_module')::BOOLEAN = true) THEN
      RAISE EXCEPTION 'Organization administrators cannot remove their own access to the users module';
    END IF;
  END IF;
  
  -- Clear existing permissions
  DELETE FROM user_permissions WHERE profile_id = _profile_id;
  DELETE FROM user_module_access WHERE profile_id = _profile_id;
  
  -- Process each module in the access map
  FOR _module_key IN SELECT jsonb_object_keys(_access_map)
  LOOP
    _module_data := _access_map->_module_key;
    
    -- Check if module has access
    _has_module_access := COALESCE((_module_data->>'_module')::BOOLEAN, false);
    
    -- Insert module access record
    INSERT INTO user_module_access (profile_id, org_id, module_key, has_access, created_by)
    VALUES (_profile_id, _org_id, _module_key, _has_module_access, auth.uid());
    
    -- Only process features if module has access
    IF _has_module_access THEN
      -- Process each feature in the module
      FOR _feature_id IN SELECT jsonb_object_keys(_module_data) WHERE jsonb_object_keys(_module_data) != '_module'
      LOOP
        _feature_perms := ARRAY(SELECT jsonb_array_elements_text(_module_data->_feature_id));
        
        -- Insert feature permissions
        INSERT INTO user_permissions (profile_id, org_id, module_key, feature_id, permissions, created_by)
        VALUES (_profile_id, _org_id, _module_key, _feature_id, _feature_perms, auth.uid());
      END LOOP;
    END IF;
  END LOOP;
  
  RETURN TRUE;
END;
$$;

-- Function to get effective permissions for a user
CREATE OR REPLACE FUNCTION public.get_effective_permissions(_profile_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _org_id UUID;
  _result JSONB := '{}';
  _role_permissions JSONB := '{}';
  _user_permissions JSONB := '{}';
  _module_record RECORD;
  _permission_record RECORD;
  _module_access RECORD;
BEGIN
  -- Get user's org_id
  SELECT org_id INTO _org_id FROM profiles WHERE id = _profile_id;
  
  IF _org_id IS NULL THEN
    RETURN _result;
  END IF;
  
  -- Build user-specific permissions from user_permissions and user_module_access
  FOR _module_access IN 
    SELECT module_key, has_access 
    FROM user_module_access 
    WHERE profile_id = _profile_id
  LOOP
    IF _module_access.has_access THEN
      _user_permissions := _user_permissions || jsonb_build_object(
        _module_access.module_key, 
        jsonb_build_object('_module', true)
      );
      
      -- Add feature permissions for this module
      FOR _permission_record IN
        SELECT feature_id, permissions
        FROM user_permissions
        WHERE profile_id = _profile_id AND module_key = _module_access.module_key
      LOOP
        _user_permissions := jsonb_set(
          _user_permissions,
          ARRAY[_module_access.module_key, _permission_record.feature_id],
          to_jsonb(_permission_record.permissions)
        );
      END LOOP;
    ELSE
      _user_permissions := _user_permissions || jsonb_build_object(
        _module_access.module_key, 
        jsonb_build_object('_module', false)
      );
    END IF;
  END LOOP;
  
  -- Get role-based permissions (from role_permissions table)
  FOR _module_record IN
    SELECT DISTINCT rp.module_key
    FROM role_permissions rp
    JOIN user_roles ur ON ur.role_id = rp.role_id
    WHERE ur.profile_id = _profile_id
  LOOP
    -- If user doesn't have explicit module access, use role permissions
    IF NOT (_user_permissions ? _module_record.module_key) THEN
      _role_permissions := _role_permissions || jsonb_build_object(_module_record.module_key, '{}');
      
      FOR _permission_record IN
        SELECT rp.feature_id, rp.permissions
        FROM role_permissions rp
        JOIN user_roles ur ON ur.role_id = rp.role_id
        WHERE ur.profile_id = _profile_id AND rp.module_key = _module_record.module_key
      LOOP
        _role_permissions := jsonb_set(
          _role_permissions,
          ARRAY[_module_record.module_key, _permission_record.feature_id],
          to_jsonb(_permission_record.permissions)
        );
      END LOOP;
    END IF;
  END LOOP;
  
  -- Merge role permissions with user permissions (user permissions override)
  _result := _role_permissions || _user_permissions;
  
  RETURN _result;
END;
$$;

-- Function to check if user has specific permission
CREATE OR REPLACE FUNCTION public.user_has_permission(
  _profile_id UUID,
  _module_key TEXT,
  _feature_id TEXT DEFAULT NULL,
  _permission TEXT DEFAULT 'read'
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _permissions JSONB;
  _feature_perms TEXT[];
BEGIN
  _permissions := get_effective_permissions(_profile_id);
  
  -- Check module access first
  IF NOT COALESCE((_permissions->_module_key->>'_module')::BOOLEAN, false) THEN
    RETURN FALSE;
  END IF;
  
  -- If no specific feature requested, just check module access
  IF _feature_id IS NULL THEN
    RETURN TRUE;
  END IF;
  
  -- Check feature permission
  _feature_perms := ARRAY(SELECT jsonb_array_elements_text(_permissions->_module_key->_feature_id));
  
  RETURN _permission = ANY(_feature_perms);
END;
$$;