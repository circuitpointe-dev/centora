-- Add foreign key constraints for documents table
ALTER TABLE public.documents 
ADD CONSTRAINT documents_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.documents 
ADD CONSTRAINT documents_updated_by_fkey 
FOREIGN KEY (updated_by) REFERENCES public.profiles(id) ON DELETE SET NULL;