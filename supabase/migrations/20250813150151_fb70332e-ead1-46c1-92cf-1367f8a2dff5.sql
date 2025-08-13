-- Create a security definer function to check if user can access donor document
CREATE OR REPLACE FUNCTION public.can_access_donor_document(file_path text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  path_parts text[];
  extracted_org_id uuid;
  extracted_donor_id uuid;
  user_org_id uuid;
BEGIN
  -- Split the path to get org_id and donor_id
  path_parts := string_to_array(file_path, '/');
  
  -- Check if path has at least 3 parts (org_id/donor_id/filename)
  IF array_length(path_parts, 1) < 3 THEN
    RETURN false;
  END IF;
  
  -- Extract org_id and donor_id from path
  BEGIN
    extracted_org_id := path_parts[1]::uuid;
    extracted_donor_id := path_parts[2]::uuid;
  EXCEPTION
    WHEN invalid_text_representation THEN
      RETURN false;
  END;
  
  -- Get user's org_id
  SELECT org_id INTO user_org_id
  FROM profiles 
  WHERE id = auth.uid();
  
  -- Check if user belongs to the same org and donor exists
  RETURN EXISTS (
    SELECT 1 FROM donors d
    WHERE d.id = extracted_donor_id
    AND d.org_id = extracted_org_id
    AND d.org_id = user_org_id
  );
END;
$$;

-- Drop existing policies and create new ones using the function
DROP POLICY IF EXISTS "Allow org members to view donor documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow org members to upload donor documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow org members to update donor documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow org members to delete donor documents" ON storage.objects;

-- Create new policies using the security definer function
CREATE POLICY "Org members can view donor documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'donor-documents' 
  AND public.can_access_donor_document(name)
);

CREATE POLICY "Org members can upload donor documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'donor-documents'
  AND public.can_access_donor_document(name)
);

CREATE POLICY "Org members can update donor documents"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'donor-documents'
  AND public.can_access_donor_document(name)
);

CREATE POLICY "Org members can delete donor documents"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'donor-documents'
  AND public.can_access_donor_document(name)
);