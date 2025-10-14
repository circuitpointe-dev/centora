-- Add display_id column to procurement_approvals
ALTER TABLE procurement_approvals ADD COLUMN display_id TEXT;

-- Create a sequence for generating approval numbers
CREATE SEQUENCE IF NOT EXISTS procurement_approval_seq START 1;

-- Function to generate display ID
CREATE OR REPLACE FUNCTION generate_procurement_display_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_num INTEGER;
  display_id TEXT;
BEGIN
  next_num := nextval('procurement_approval_seq');
  display_id := 'REQ-' || LPAD(next_num::TEXT, 3, '0');
  RETURN display_id;
END;
$$;

-- Update existing records with display IDs
DO $$
DECLARE
  rec RECORD;
  counter INTEGER := 1;
BEGIN
  FOR rec IN SELECT id FROM procurement_approvals ORDER BY created_at LOOP
    UPDATE procurement_approvals 
    SET display_id = 'REQ-' || LPAD(counter::TEXT, 3, '0')
    WHERE id = rec.id;
    counter := counter + 1;
  END LOOP;
  
  -- Set the sequence to continue from where we left off
  PERFORM setval('procurement_approval_seq', counter);
END $$;

-- Make display_id NOT NULL after populating existing records
ALTER TABLE procurement_approvals ALTER COLUMN display_id SET NOT NULL;

-- Create trigger to auto-generate display_id for new records
CREATE OR REPLACE FUNCTION set_procurement_display_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.display_id IS NULL THEN
    NEW.display_id := generate_procurement_display_id();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_procurement_display_id
  BEFORE INSERT ON procurement_approvals
  FOR EACH ROW
  EXECUTE FUNCTION set_procurement_display_id();