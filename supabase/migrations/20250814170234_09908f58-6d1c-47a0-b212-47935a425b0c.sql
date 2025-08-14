-- Fix function search path security warning
CREATE OR REPLACE FUNCTION public.update_donor_totals()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

-- Fix set_updated_at function 
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;