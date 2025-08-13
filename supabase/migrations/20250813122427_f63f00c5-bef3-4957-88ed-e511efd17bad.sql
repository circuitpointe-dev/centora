-- Drop existing conflicting functions
DROP FUNCTION IF EXISTS public.create_donor_with_details(uuid, uuid, text, text, text, date, date, text, jsonb, uuid[]);
DROP FUNCTION IF EXISTS public.create_donor_with_details(uuid, uuid, text, text, text, date, date, text, text, uuid[]);

-- Create a single, clean atomic donor creation function
CREATE OR REPLACE FUNCTION public.create_donor_with_details(
  _org_id UUID,
  _created_by UUID,
  _name TEXT,
  _affiliation TEXT DEFAULT NULL,
  _organization_url TEXT DEFAULT NULL,
  _funding_start_date DATE DEFAULT NULL,
  _funding_end_date DATE DEFAULT NULL,
  _notes TEXT DEFAULT NULL,
  _contacts TEXT DEFAULT '[]',
  _focus_area_ids UUID[] DEFAULT ARRAY[]::UUID[]
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _donor_id UUID;
  _contact JSONB;
  _contacts_jsonb JSONB;
BEGIN
  -- Check if user is org member
  IF NOT is_org_member(_org_id) THEN
    RAISE EXCEPTION 'User is not a member of the organization';
  END IF;

  -- Check if donor name already exists in organization
  IF EXISTS (
    SELECT 1 FROM donors 
    WHERE org_id = _org_id AND name = _name
  ) THEN
    RAISE EXCEPTION 'A donor with this name already exists';
  END IF;

  -- Parse contacts JSON string to JSONB
  BEGIN
    _contacts_jsonb := _contacts::JSONB;
  EXCEPTION 
    WHEN invalid_text_representation THEN
      RAISE EXCEPTION 'Invalid JSON format for contacts: %', _contacts;
  END;

  -- Create donor
  INSERT INTO donors (
    org_id, 
    name, 
    affiliation, 
    organization_url, 
    funding_start_date, 
    funding_end_date, 
    notes, 
    created_by
  ) VALUES (
    _org_id,
    _name,
    _affiliation,
    _organization_url,
    _funding_start_date,
    _funding_end_date,
    _notes,
    _created_by
  ) RETURNING id INTO _donor_id;

  -- Create contacts if any
  IF jsonb_typeof(_contacts_jsonb) = 'array' AND jsonb_array_length(_contacts_jsonb) > 0 THEN
    FOR _contact IN SELECT * FROM jsonb_array_elements(_contacts_jsonb)
    LOOP
      INSERT INTO donor_contacts (
        donor_id,
        full_name,
        email,
        phone,
        is_primary
      ) VALUES (
        _donor_id,
        (_contact->>'full_name')::TEXT,
        (_contact->>'email')::TEXT,
        (_contact->>'phone')::TEXT,
        COALESCE((_contact->>'is_primary')::BOOLEAN, false)
      );
    END LOOP;
  END IF;

  -- Create focus area relationships
  IF array_length(_focus_area_ids, 1) > 0 THEN
    INSERT INTO donor_focus_areas (donor_id, focus_area_id)
    SELECT _donor_id, unnest(_focus_area_ids);
  END IF;

  RETURN _donor_id;
END;
$$;