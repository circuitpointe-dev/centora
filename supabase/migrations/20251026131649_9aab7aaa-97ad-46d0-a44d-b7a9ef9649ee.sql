-- Fix document_type enum to include all necessary values
-- First, let's check if we need to update the enum or create a new one

-- Drop the conflicting enum types if they exist (cascade to drop dependencies)
DROP TYPE IF EXISTS document_type CASCADE;
DROP TYPE IF EXISTS procurement_document_type CASCADE;

-- Recreate the document_type enum with all necessary values
CREATE TYPE document_type AS ENUM (
  'Contract',
  'Invoice', 
  'GRN',
  'PO',
  'Tender',
  'Quote',
  'Compliance',
  'Receipt',
  'Other'
);

-- Ensure document_status enum exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'document_status') THEN
    CREATE TYPE document_status AS ENUM ('active', 'archived', 'expired', 'draft');
  END IF;
END $$;

-- Recreate the procurement_documents table with proper structure
DROP TABLE IF EXISTS public.procurement_documents CASCADE;

CREATE TABLE public.procurement_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  document_type document_type NOT NULL,
  title TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  vendor_name TEXT,
  project_name TEXT,
  amount DECIMAL(15,2),
  currency TEXT DEFAULT 'USD',
  status document_status NOT NULL DEFAULT 'active',
  description TEXT,
  fiscal_year TEXT,
  document_number TEXT,
  document_date DATE,
  uploaded_by UUID NOT NULL REFERENCES public.profiles(id),
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  archived_at TIMESTAMP WITH TIME ZONE,
  archived_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Constraints
  CONSTRAINT positive_file_size CHECK (file_size > 0),
  CONSTRAINT positive_amount CHECK (amount IS NULL OR amount > 0)
);

-- Enable RLS
ALTER TABLE public.procurement_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view documents in their org" 
ON public.procurement_documents FOR SELECT 
USING (is_org_member(org_id));

CREATE POLICY "Users can create documents in their org" 
ON public.procurement_documents FOR INSERT 
WITH CHECK (is_org_member(org_id) AND uploaded_by = auth.uid());

CREATE POLICY "Users can update documents in their org" 
ON public.procurement_documents FOR UPDATE 
USING (is_org_member(org_id));

CREATE POLICY "Users can delete documents in their org" 
ON public.procurement_documents FOR DELETE 
USING (is_org_member(org_id));

-- Create indexes
CREATE INDEX idx_procurement_documents_org_id ON public.procurement_documents(org_id);
CREATE INDEX idx_procurement_documents_type ON public.procurement_documents(document_type);
CREATE INDEX idx_procurement_documents_status ON public.procurement_documents(status);
CREATE INDEX idx_procurement_documents_vendor ON public.procurement_documents(vendor_name);
CREATE INDEX idx_procurement_documents_uploaded_at ON public.procurement_documents(uploaded_at);

-- Create trigger for updated_at
CREATE TRIGGER update_procurement_documents_updated_at
    BEFORE UPDATE ON public.procurement_documents
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();