-- Create RLS policies for document storage (bucket already exists)
CREATE POLICY "Users can upload documents to their org folder" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND org_id::text = (storage.foldername(name))[2]
  )
);

CREATE POLICY "Users can view documents in their org" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'documents' 
  AND EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() 
    AND p.org_id::text = (storage.foldername(name))[2]
  )
);

CREATE POLICY "Document creators and admins can update documents" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'documents' 
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() 
      AND p.org_id::text = (storage.foldername(name))[2]
      AND is_org_admin(p.org_id)
    )
  )
);

CREATE POLICY "Document creators and admins can delete documents" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'documents' 
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() 
      AND p.org_id::text = (storage.foldername(name))[2]
      AND is_org_admin(p.org_id)
    )
  )
);