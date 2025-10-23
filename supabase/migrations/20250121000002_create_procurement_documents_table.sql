-- Create procurement documents and reports tables
CREATE TYPE document_type AS ENUM ('PO', 'Invoice', 'GRN', 'Tender', 'Contract', 'Quote', 'Receipt', 'Other');
CREATE TYPE document_status AS ENUM ('active', 'archived', 'expired', 'draft');
CREATE TYPE report_type AS ENUM ('summary', 'detailed', 'analytics', 'compliance', 'audit');
CREATE TYPE report_status AS ENUM ('generating', 'completed', 'failed');

-- Procurement documents table
CREATE TABLE public.procurement_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  document_type document_type NOT NULL,
  document_number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  vendor_name TEXT,
  amount DECIMAL(15,2),
  currency TEXT DEFAULT 'USD',
  status document_status NOT NULL DEFAULT 'active',
  file_path TEXT,
  file_size BIGINT,
  file_type TEXT,
  uploaded_by UUID NOT NULL REFERENCES public.profiles(id),
  uploaded_by_name TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  tags TEXT[],
  category TEXT,
  department TEXT,
  fiscal_year TEXT,
  retention_date TIMESTAMP WITH TIME ZONE
);

-- Procurement reports table
CREATE TABLE public.procurement_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  report_type report_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  parameters JSONB,
  generated_by UUID NOT NULL REFERENCES public.profiles(id),
  generated_by_name TEXT,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  file_path TEXT,
  file_size BIGINT,
  file_type TEXT,
  status report_status NOT NULL DEFAULT 'generating',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.procurement_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procurement_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for procurement documents
CREATE POLICY "Users can view procurement documents in their org" 
ON public.procurement_documents FOR SELECT 
USING (is_org_member(org_id));

CREATE POLICY "Users can create procurement documents in their org" 
ON public.procurement_documents FOR INSERT 
WITH CHECK (is_org_member(org_id) AND uploaded_by = auth.uid());

CREATE POLICY "Users can update procurement documents in their org" 
ON public.procurement_documents FOR UPDATE 
USING (is_org_member(org_id));

CREATE POLICY "Users can delete procurement documents in their org" 
ON public.procurement_documents FOR DELETE 
USING (is_org_member(org_id));

-- RLS Policies for procurement reports
CREATE POLICY "Users can view procurement reports in their org" 
ON public.procurement_reports FOR SELECT 
USING (is_org_member(org_id));

CREATE POLICY "Users can create procurement reports in their org" 
ON public.procurement_reports FOR INSERT 
WITH CHECK (is_org_member(org_id) AND generated_by = auth.uid());

CREATE POLICY "Users can update procurement reports in their org" 
ON public.procurement_reports FOR UPDATE 
USING (is_org_member(org_id));

CREATE POLICY "Users can delete procurement reports in their org" 
ON public.procurement_reports FOR DELETE 
USING (is_org_member(org_id));

-- Create indexes for better performance
CREATE INDEX idx_procurement_documents_org_id ON public.procurement_documents(org_id);
CREATE INDEX idx_procurement_documents_type ON public.procurement_documents(document_type);
CREATE INDEX idx_procurement_documents_status ON public.procurement_documents(status);
CREATE INDEX idx_procurement_documents_uploaded_at ON public.procurement_documents(uploaded_at);
CREATE INDEX idx_procurement_documents_vendor ON public.procurement_documents(vendor_name);
CREATE INDEX idx_procurement_documents_category ON public.procurement_documents(category);
CREATE INDEX idx_procurement_documents_department ON public.procurement_documents(department);
CREATE INDEX idx_procurement_documents_fiscal_year ON public.procurement_documents(fiscal_year);

CREATE INDEX idx_procurement_reports_org_id ON public.procurement_reports(org_id);
CREATE INDEX idx_procurement_reports_type ON public.procurement_reports(report_type);
CREATE INDEX idx_procurement_reports_status ON public.procurement_reports(status);
CREATE INDEX idx_procurement_reports_generated_at ON public.procurement_reports(generated_at);

-- Create function to auto-generate document number
CREATE OR REPLACE FUNCTION generate_document_number(doc_type document_type)
RETURNS TEXT AS $$
DECLARE
    next_number INTEGER;
    document_number TEXT;
    prefix TEXT;
BEGIN
    -- Set prefix based on type
    CASE doc_type
        WHEN 'PO' THEN prefix := 'PO-';
        WHEN 'Invoice' THEN prefix := 'INV-';
        WHEN 'GRN' THEN prefix := 'GRN-';
        WHEN 'Tender' THEN prefix := 'TEN-';
        WHEN 'Contract' THEN prefix := 'CON-';
        WHEN 'Quote' THEN prefix := 'QUO-';
        WHEN 'Receipt' THEN prefix := 'REC-';
        ELSE prefix := 'DOC-';
    END CASE;
    
    -- Get the next number for the current org and type
    SELECT COALESCE(MAX(CAST(SUBSTRING(document_number FROM prefix || '(\d+)') AS INTEGER)), 0) + 1
    INTO next_number
    FROM public.procurement_documents
    WHERE org_id = (SELECT org_id FROM public.profiles WHERE id = auth.uid())
    AND document_type = doc_type;
    
    document_number := prefix || LPAD(next_number::TEXT, 5, '0');
    RETURN document_number;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate document number
CREATE OR REPLACE FUNCTION set_document_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.document_number IS NULL OR NEW.document_number = '' THEN
        NEW.document_number := generate_document_number(NEW.document_type);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_document_number
    BEFORE INSERT ON public.procurement_documents
    FOR EACH ROW
    EXECUTE FUNCTION set_document_number();

-- Create function to update document status based on retention date
CREATE OR REPLACE FUNCTION update_document_status()
RETURNS TRIGGER AS $$
BEGIN
    -- If retention_date is set and has passed, mark as expired
    IF NEW.retention_date IS NOT NULL AND NEW.retention_date < NOW() THEN
        NEW.status := 'expired';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_document_status
    BEFORE INSERT OR UPDATE ON public.procurement_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_document_status();
