-- Drop all existing RLS policies for donor-documents bucket
DROP POLICY IF EXISTS "Users can view donor documents from their org" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload donor documents to their org" ON storage.objects;
DROP POLICY IF EXISTS "Users can update donor documents from their org" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete donor documents from their org" ON storage.objects;
DROP POLICY IF EXISTS "Org members can view donor documents" ON storage.objects;
DROP POLICY IF EXISTS "Org members can upload donor documents" ON storage.objects;
DROP POLICY IF EXISTS "Org members can update donor documents" ON storage.objects;
DROP POLICY IF EXISTS "Org members can delete donor documents" ON storage.objects;

-- Create 4 clean, correct RLS policies for donor-documents bucket
-- Policy 1: Allow org members to view files for donors in their organization
CREATE POLICY "Allow org members to view donor documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'donor-documents' 
  AND EXISTS (
    SELECT 1 FROM donors d
    WHERE d.id::text = (string_to_array(name, '/'))[2]
    AND d.org_id::text = (string_to_array(name, '/'))[1]
    AND d.org_id IN (
      SELECT org_id FROM profiles WHERE id = auth.uid()
    )
  )
);

-- Policy 2: Allow org members to upload files for donors in their organization
CREATE POLICY "Allow org members to upload donor documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'donor-documents'
  AND EXISTS (
    SELECT 1 FROM donors d
    WHERE d.id::text = (string_to_array(name, '/'))[2]
    AND d.org_id::text = (string_to_array(name, '/'))[1]
    AND d.org_id IN (
      SELECT org_id FROM profiles WHERE id = auth.uid()
    )
  )
);

-- Policy 3: Allow org members to update files for donors in their organization
CREATE POLICY "Allow org members to update donor documents"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'donor-documents'
  AND EXISTS (
    SELECT 1 FROM donors d
    WHERE d.id::text = (string_to_array(name, '/'))[2]
    AND d.org_id::text = (string_to_array(name, '/'))[1]
    AND d.org_id IN (
      SELECT org_id FROM profiles WHERE id = auth.uid()
    )
  )
);

-- Policy 4: Allow org members to delete files for donors in their organization
CREATE POLICY "Allow org members to delete donor documents"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'donor-documents'
  AND EXISTS (
    SELECT 1 FROM donors d
    WHERE d.id::text = (string_to_array(name, '/'))[2]
    AND d.org_id::text = (string_to_array(name, '/'))[1]
    AND d.org_id IN (
      SELECT org_id FROM profiles WHERE id = auth.uid()
    )
  )
);