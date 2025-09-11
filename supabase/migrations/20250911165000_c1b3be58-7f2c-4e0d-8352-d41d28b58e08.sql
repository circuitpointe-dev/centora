-- Fix the get_departments function with ambiguous column reference
CREATE OR REPLACE FUNCTION public.get_departments()
RETURNS TABLE(id uuid, name text, description text, created_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _org_id uuid;
BEGIN
  SELECT p.org_id INTO _org_id FROM profiles p WHERE p.id = auth.uid();

  IF _org_id IS NULL THEN
    SELECT o.id INTO _org_id FROM organizations o ORDER BY o.created_at ASC LIMIT 1;
  END IF;

  RETURN QUERY
  SELECT d.id, d.name, d.description, d.created_at
  FROM departments d
  WHERE d.org_id = _org_id
  ORDER BY d.name;
END;
$$;