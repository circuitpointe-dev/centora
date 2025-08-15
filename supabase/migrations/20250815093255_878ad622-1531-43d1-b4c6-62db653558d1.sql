-- Create function to automatically create initial note when donor has notes field populated
CREATE OR REPLACE FUNCTION public.create_initial_donor_note()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create initial note if notes field is not null and not empty
  IF NEW.notes IS NOT NULL AND TRIM(NEW.notes) != '' THEN
    INSERT INTO donor_notes (donor_id, content, created_by)
    VALUES (NEW.id, NEW.notes, NEW.created_by);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function after donor insert
DROP TRIGGER IF EXISTS trigger_create_initial_donor_note ON donors;
CREATE TRIGGER trigger_create_initial_donor_note
  AFTER INSERT ON donors
  FOR EACH ROW
  EXECUTE FUNCTION create_initial_donor_note();