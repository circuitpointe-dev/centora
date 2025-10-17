-- Drop the old rating check constraint
ALTER TABLE vendors DROP CONSTRAINT vendors_rating_check;

-- Add new check constraint for ratings 0-100
ALTER TABLE vendors ADD CONSTRAINT vendors_rating_check 
CHECK (rating >= 0 AND rating <= 100);