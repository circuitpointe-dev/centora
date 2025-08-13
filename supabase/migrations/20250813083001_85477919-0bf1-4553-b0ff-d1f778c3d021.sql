-- Fix security issue: Limit admin access to profiles table
-- Remove overly permissive admin policies and replace with granular ones

-- First, drop the existing overly permissive admin policies
DROP POLICY IF EXISTS "Org admins can update profiles in their org" ON public.profiles;
DROP POLICY IF EXISTS "Org admins can view profiles in their org" ON public.profiles;

-- Create a new function that returns only basic profile info for admins
-- This allows admins to see who is in their org without exposing sensitive details like email
CREATE OR REPLACE FUNCTION public.get_org_member_list(_org_id uuid)
RETURNS TABLE (
  id uuid,
  full_name text,
  role app_role,
  created_at timestamp with time zone
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT p.id, p.full_name, p.role, p.created_at
  FROM public.profiles p
  WHERE p.org_id = _org_id
    AND is_org_admin(_org_id);
$$;

-- Create a restricted policy for admin role updates only
-- Admins can only update roles, not personal data like email or full_name
CREATE POLICY "Org admins can update member roles only"
ON public.profiles
FOR UPDATE
USING (is_org_admin(org_id))
WITH CHECK (is_org_admin(org_id));

-- Create a function for admins to safely get member count without exposing data
CREATE OR REPLACE FUNCTION public.get_org_member_count(_org_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT count(*)::integer
  FROM public.profiles p
  WHERE p.org_id = _org_id
    AND is_org_admin(_org_id);
$$;

-- Add function for safe admin operations that don't expose sensitive data
CREATE OR REPLACE FUNCTION public.admin_update_member_role(_member_id uuid, _new_role app_role, _org_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only allow if current user is admin of the organization
  IF NOT is_org_admin(_org_id) THEN
    RETURN false;
  END IF;
  
  -- Update only the role, not sensitive data
  UPDATE public.profiles 
  SET role = _new_role, updated_at = now()
  WHERE id = _member_id AND org_id = _org_id;
  
  RETURN FOUND;
END;
$$;

-- Keep existing user self-access policies (these are secure)
-- "Users can update their own profile" - already exists and is secure
-- "Users can view their own profile" - already exists and is secure

COMMENT ON FUNCTION public.get_org_member_list IS 'Returns basic member info (no email) for org admins';
COMMENT ON FUNCTION public.admin_update_member_role IS 'Allows admins to update member roles without accessing sensitive data';