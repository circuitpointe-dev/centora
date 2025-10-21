-- Fix vendor_contracts RLS policies
-- Drop old policies that incorrectly use JWT claims
DROP POLICY IF EXISTS "vendor_contracts select" ON vendor_contracts;
DROP POLICY IF EXISTS "vendor_contracts insert" ON vendor_contracts;
DROP POLICY IF EXISTS "vendor_contracts update" ON vendor_contracts;
DROP POLICY IF EXISTS "vendor_contracts delete" ON vendor_contracts;

-- Drop conflicting policies from other migration
DROP POLICY IF EXISTS "Users can view contracts from their organization" ON vendor_contracts;
DROP POLICY IF EXISTS "Users can insert contracts for their organization" ON vendor_contracts;
DROP POLICY IF EXISTS "Users can update contracts from their organization" ON vendor_contracts;
DROP POLICY IF EXISTS "Users can delete contracts from their organization" ON vendor_contracts;

-- Create correct RLS policies using profiles table
CREATE POLICY "Org members can view vendor contracts" 
ON vendor_contracts FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.org_id = vendor_contracts.org_id
    )
);

CREATE POLICY "Org members can insert vendor contracts" 
ON vendor_contracts FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.org_id = vendor_contracts.org_id
    )
);

CREATE POLICY "Org members can update vendor contracts" 
ON vendor_contracts FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.org_id = vendor_contracts.org_id
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.org_id = vendor_contracts.org_id
    )
);

CREATE POLICY "Org members can delete vendor contracts" 
ON vendor_contracts FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.org_id = vendor_contracts.org_id
    )
);