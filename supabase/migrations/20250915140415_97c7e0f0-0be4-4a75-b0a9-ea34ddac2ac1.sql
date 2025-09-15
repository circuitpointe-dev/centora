-- Drop existing foreign key constraints if they exist (will fail silently if they don't exist)
ALTER TABLE public.documents DROP CONSTRAINT IF EXISTS documents_created_by_fkey;
ALTER TABLE public.documents DROP CONSTRAINT IF EXISTS documents_updated_by_fkey;

-- Add foreign key constraints properly
ALTER TABLE public.documents 
ADD CONSTRAINT documents_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE public.documents 
ADD CONSTRAINT documents_updated_by_fkey 
FOREIGN KEY (updated_by) REFERENCES public.profiles(id) ON DELETE SET NULL ON UPDATE CASCADE;