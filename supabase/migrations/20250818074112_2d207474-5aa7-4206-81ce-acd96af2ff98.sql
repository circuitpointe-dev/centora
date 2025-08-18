-- Enable RLS on features table and add policies
ALTER TABLE features ENABLE ROW LEVEL SECURITY;

-- Features are global config data, all authenticated users can read
CREATE POLICY "All authenticated users can view features" 
ON features 
FOR SELECT 
TO authenticated
USING (true);