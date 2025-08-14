-- Create function to calculate donor totals and last donation
CREATE OR REPLACE FUNCTION update_donor_totals()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update donor totals when giving records change
CREATE TRIGGER update_donor_totals_trigger
  AFTER INSERT OR UPDATE OR DELETE ON donor_giving_records
  FOR EACH ROW
  EXECUTE FUNCTION update_donor_totals();

-- Update existing donor totals for current data
UPDATE donors 
SET 
  total_donations = (
    SELECT COALESCE(SUM(amount), 0)
    FROM donor_giving_records 
    WHERE donor_id = donors.id
  ),
  last_donation_date = (
    SELECT MAX(make_date(year, month, 1))
    FROM donor_giving_records 
    WHERE donor_id = donors.id
  );

-- Create function to get last donation info
CREATE OR REPLACE FUNCTION get_last_donation_info(donor_uuid uuid)
RETURNS TABLE(
  amount numeric,
  currency text,
  donation_date date
) AS $$
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
$$ LANGUAGE plpgsql STABLE;