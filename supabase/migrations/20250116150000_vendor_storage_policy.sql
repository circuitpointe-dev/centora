-- Create vendor-documents storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'vendor-documents',
    'vendor-documents',
    true,
    10485760, -- 10MB
    ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
) ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can upload files to their org's vendor documents
CREATE POLICY "Users can upload vendor documents" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'vendor-documents' AND
        auth.uid() IS NOT NULL AND
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.org_id = (auth.jwt() ->> 'org_id')::uuid
        )
    );

-- Policy: Users can view files from their org's vendor documents
CREATE POLICY "Users can view vendor documents" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'vendor-documents' AND
        auth.uid() IS NOT NULL AND
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.org_id = (auth.jwt() ->> 'org_id')::uuid
        )
    );

-- Policy: Users can delete files from their org's vendor documents
CREATE POLICY "Users can delete vendor documents" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'vendor-documents' AND
        auth.uid() IS NOT NULL AND
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.org_id = (auth.jwt() ->> 'org_id')::uuid
        )
    );
