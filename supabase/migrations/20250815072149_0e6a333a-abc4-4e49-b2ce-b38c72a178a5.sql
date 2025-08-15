-- Add currency field to donors table
ALTER TABLE donors ADD COLUMN currency TEXT DEFAULT 'USD' NOT NULL;

-- Update the create_donor_with_details function to include currency
CREATE OR REPLACE FUNCTION public.create_donor_with_details(
  _org_id uuid, 
  _created_by uuid, 
  _name text, 
  _status donor_status DEFAULT 'potential'::donor_status, 
  _affiliation text DEFAULT NULL::text, 
  _organization_url text DEFAULT NULL::text, 
  _funding_periods text DEFAULT '[]'::text, 
  _notes text DEFAULT NULL::text, 
  _contacts text DEFAULT '[]'::text, 
  _focus_area_ids uuid[] DEFAULT ARRAY[]::uuid[],
  _currency text DEFAULT 'USD'::text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _donor_id UUID;
  _contact JSONB;
  _contacts_jsonb JSONB;
  _funding_period JSONB;
  _funding_periods_jsonb JSONB;
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

  -- Parse funding periods JSON string to JSONB
  BEGIN
    _funding_periods_jsonb := _funding_periods::JSONB;
  EXCEPTION 
    WHEN invalid_text_representation THEN
      RAISE EXCEPTION 'Invalid JSON format for funding periods: %', _funding_periods;
  END;

  -- Create donor with currency
  INSERT INTO donors (
    org_id, 
    name, 
    status,
    affiliation, 
    organization_url, 
    notes, 
    currency,
    created_by
  ) VALUES (
    _org_id,
    _name,
    _status,
    _affiliation,
    _organization_url,
    _notes,
    _currency,
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

  -- Create funding periods if any
  IF jsonb_typeof(_funding_periods_jsonb) = 'array' AND jsonb_array_length(_funding_periods_jsonb) > 0 THEN
    FOR _funding_period IN SELECT * FROM jsonb_array_elements(_funding_periods_jsonb)
    LOOP
      INSERT INTO donor_funding_periods (
        donor_id,
        name,
        start_date,
        end_date,
        created_by
      ) VALUES (
        _donor_id,
        (_funding_period->>'name')::TEXT,
        (_funding_period->>'start_date')::DATE,
        (_funding_period->>'end_date')::DATE,
        _created_by
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
$function$;