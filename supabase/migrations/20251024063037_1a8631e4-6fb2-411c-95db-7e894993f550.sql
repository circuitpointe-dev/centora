-- Create enum for document type if it doesn't exist
DO $$ BEGIN
  CREATE TYPE procurement_document_type AS ENUM ('contract', 'invoice', 'grn', 'po', 'policy', 'report', 'other');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create enum for document status if it doesn't exist
DO $$ BEGIN
  CREATE TYPE procurement_document_status AS ENUM ('active', 'archived', 'expired', 'draft');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the procurement_documents table
CREATE TABLE IF NOT EXISTS public.procurement_documents (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    document_number TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    document_type procurement_document_type NOT NULL DEFAULT 'other',
    status procurement_document_status NOT NULL DEFAULT 'active',
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
    vendor_name TEXT,
    project_name TEXT,
    amount NUMERIC(15, 2),
    currency TEXT DEFAULT 'USD',
    document_date DATE NOT NULL,
    expiry_date DATE,
    uploaded_by UUID NOT NULL REFERENCES auth.users(id),
    uploaded_by_name TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_procurement_documents_org_id ON public.procurement_documents(org_id);
CREATE INDEX IF NOT EXISTS idx_procurement_documents_document_type ON public.procurement_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_procurement_documents_status ON public.procurement_documents(status);
CREATE INDEX IF NOT EXISTS idx_procurement_documents_vendor_id ON public.procurement_documents(vendor_id);
CREATE INDEX IF NOT EXISTS idx_procurement_documents_document_date ON public.procurement_documents(document_date);

-- Enable RLS
ALTER TABLE public.procurement_documents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view documents from their organization"
ON public.procurement_documents
FOR SELECT
USING (org_match(org_id));

CREATE POLICY "Users can create documents in their organization"
ON public.procurement_documents
FOR INSERT
WITH CHECK (org_match(org_id));

CREATE POLICY "Users can update documents in their organization"
ON public.procurement_documents
FOR UPDATE
USING (org_match(org_id));

CREATE POLICY "Users can delete documents in their organization"
ON public.procurement_documents
FOR DELETE
USING (org_match(org_id));

-- Create trigger for updated_at
CREATE TRIGGER update_procurement_documents_updated_at
    BEFORE UPDATE ON public.procurement_documents
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- Insert sample data for demonstration
INSERT INTO public.procurement_documents (org_id, document_number, title, file_name, file_path, file_size, mime_type, document_type, vendor_name, project_name, document_date, uploaded_by, uploaded_by_name)
SELECT 
    o.id as org_id,
    'CTR-' || LPAD((row_number() OVER ())::TEXT, 5, '0') as document_number,
    CASE (row_number() OVER ()) % 8
        WHEN 1 THEN 'Solar initiative'
        WHEN 2 THEN 'Wind farm expansion'
        WHEN 3 THEN 'Hydro project'
        WHEN 4 THEN 'Geothermal energy'
        WHEN 5 THEN 'Biomass facility'
        WHEN 6 THEN 'Tidal energy project'
        WHEN 7 THEN 'Nuclear energy upgrade'
        ELSE 'Energy efficiency program'
    END as title,
    'contract_' || (row_number() OVER ()) || '.pdf' as file_name,
    '/documents/contracts/contract_' || (row_number() OVER ()) || '.pdf' as file_path,
    (1024 * 1024 * (1 + (random() * 5)::INT))::BIGINT as file_size,
    'application/pdf' as mime_type,
    'contract' as document_type,
    CASE (row_number() OVER ()) % 8
        WHEN 1 THEN 'Mark Jones'
        WHEN 2 THEN 'Lisa Smith'
        WHEN 3 THEN 'Tom Brown'
        WHEN 4 THEN 'Emily Davis'
        WHEN 5 THEN 'Sarah Johnson'
        WHEN 6 THEN 'James Wilson'
        WHEN 7 THEN 'Karen Garcia'
        ELSE 'Chris Martinez'
    END as vendor_name,
    CASE (row_number() OVER ()) % 8
        WHEN 1 THEN 'Solar initiative'
        WHEN 2 THEN 'Wind farm expansion'
        WHEN 3 THEN 'Hydro project'
        WHEN 4 THEN 'Geothermal energy'
        WHEN 5 THEN 'Biomass facility'
        WHEN 6 THEN 'Tidal energy project'
        WHEN 7 THEN 'Nuclear energy upgrade'
        ELSE 'Energy efficiency program'
    END as project_name,
    DATE '2025-12-23' + (row_number() OVER () * INTERVAL '23 days') as document_date,
    p.id as uploaded_by,
    COALESCE(p.full_name, p.email) as uploaded_by_name
FROM public.organizations o
CROSS JOIN generate_series(1, 30) s
JOIN public.profiles p ON p.org_id = o.id
WHERE NOT EXISTS (SELECT 1 FROM public.procurement_documents LIMIT 1)
LIMIT 30;