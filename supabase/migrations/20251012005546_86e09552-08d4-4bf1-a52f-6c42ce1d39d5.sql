-- Add missing foreign key constraint for donor_funding_cycles
ALTER TABLE donor_funding_cycles 
ADD CONSTRAINT donor_funding_cycles_donor_id_fkey 
FOREIGN KEY (donor_id) 
REFERENCES donors(id) 
ON DELETE CASCADE;