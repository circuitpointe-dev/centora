-- Fix security warnings by setting search_path for functions
CREATE OR REPLACE FUNCTION update_donor_totals()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Update the affected donor's total donations and last donation date
  UPDATE donors 
  SET 
    total_donations = (
      SELECT COALESCE(SUM(amount), 0)
      FROM donor_giving_records 
      WHERE donor_id = COALESCE(NEW.donor_id, OLD.donor_id)
    ),
    last_donation_date = (
      SELECT MAX(make_date(year, month, 1))
      FROM donor_giving_records 
      WHERE donor_id = COALESCE(NEW.donor_id, OLD.donor_id)
    )
  WHERE id = COALESCE(NEW.donor_id, OLD.donor_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Fix search_path for get_last_donation_info function
CREATE OR REPLACE FUNCTION get_last_donation_info(donor_uuid uuid)
RETURNS TABLE(
  amount numeric,
  currency text,
  donation_date date
) 
LANGUAGE plpgsql 
STABLE 
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dgr.amount,
    dgr.currency,
    make_date(dgr.year, dgr.month, 1) as donation_date
  FROM donor_giving_records dgr
  WHERE dgr.donor_id = donor_uuid
  ORDER BY dgr.year DESC, dgr.month DESC
  LIMIT 1;
END;
$$;