-- Add foreign key constraints for compliance tables

-- Add foreign key constraint between policy_documents and documents
ALTER TABLE public.policy_documents 
ADD CONSTRAINT fk_policy_documents_document_id 
FOREIGN KEY (document_id) REFERENCES public.documents(id) ON DELETE CASCADE;

-- Add foreign key constraint between policy_acknowledgments and profiles
ALTER TABLE public.policy_acknowledgments 
ADD CONSTRAINT fk_policy_acknowledgments_user_id 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Update RLS policies for better access control
-- Policy for policy_documents to ensure proper document access
DROP POLICY IF EXISTS "Document creators or admins can manage policy documents" ON public.policy_documents;
CREATE POLICY "Document creators or admins can manage policy documents" ON public.policy_documents
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.documents d 
    WHERE d.id = policy_documents.document_id 
    AND (is_org_admin(d.org_id) OR d.created_by = auth.uid())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.documents d 
    WHERE d.id = policy_documents.document_id 
    AND (is_org_admin(d.org_id) OR d.created_by = auth.uid())
  )
);

-- Update policy_acknowledgments RLS for better user access
DROP POLICY IF EXISTS "Users can view policy acknowledgments" ON public.policy_acknowledgments;
CREATE POLICY "Users can view policy acknowledgments" ON public.policy_acknowledgments
FOR SELECT 
USING (
  -- Users can see acknowledgments from their org's documents
  EXISTS (
    SELECT 1 FROM public.documents d 
    WHERE d.id = policy_acknowledgments.document_id 
    AND d.org_id IN (
      SELECT p.org_id FROM public.profiles p WHERE p.id = auth.uid()
    )
  )
  OR 
  -- Users can see their own acknowledgments
  auth.uid() = user_id
);