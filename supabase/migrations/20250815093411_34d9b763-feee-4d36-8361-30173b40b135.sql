-- Fix the security issue by setting search_path for the function
CREATE OR REPLACE FUNCTION public.create_initial_donor_note()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only create initial note if notes field is not null and not empty
  IF NEW.notes IS NOT NULL AND TRIM(NEW.notes) != '' THEN
    INSERT INTO donor_notes (donor_id, content, created_by)
    VALUES (NEW.id, NEW.notes, NEW.created_by);
  END IF;
  
  RETURN NEW;
END;
$$;