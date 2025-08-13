-- Clean up storage policies to prevent conflicts
DELETE FROM storage.policies WHERE bucket_id = 'donor-documents';

-- Create clean RLS policies for donor-documents bucket
CREATE POLICY "Allow viewing documents for org members"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'donor-documents' 
  AND EXISTS (
    SELECT 1 FROM donors d 
    WHERE d.id::text = (storage.foldername(name))[2]
    AND is_org_member(d.org_id)
  )
);

CREATE POLICY "Allow uploading documents for org members"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'donor-documents' 
  AND EXISTS (
    SELECT 1 FROM donors d 
    WHERE d.id::text = (storage.foldername(name))[2]
    AND is_org_member(d.org_id)
  )
);

CREATE POLICY "Allow updating documents for org members"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'donor-documents' 
  AND EXISTS (
    SELECT 1 FROM donors d 
    WHERE d.id::text = (storage.foldername(name))[2]
    AND is_org_member(d.org_id)
  )
);

CREATE POLICY "Allow deleting documents for org members"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'donor-documents' 
  AND EXISTS (
    SELECT 1 FROM donors d 
    WHERE d.id::text = (storage.foldername(name))[2]
    AND is_org_member(d.org_id)
  )
);