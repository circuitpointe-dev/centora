-- Add foreign key constraint to ensure data integrity
ALTER TABLE public.opportunities 
ADD CONSTRAINT fk_opportunities_donor_id 
FOREIGN KEY (donor_id) REFERENCES public.donors(id) ON DELETE CASCADE;