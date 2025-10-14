-- Make proposal-attachments bucket public for cover images
UPDATE storage.buckets 
SET public = true 
WHERE id = 'proposal-attachments';

-- Add cover_image column to documents table for template cover images
ALTER TABLE public.documents
ADD COLUMN IF NOT EXISTS cover_image TEXT;