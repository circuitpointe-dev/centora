-- Create procurement documents schema for reports and archive
-- This includes document types, archive functionality, and report generation

-- Create document types enum
CREATE TYPE document_type AS ENUM ('Contract', 'Invoice', 'GRN', 'PO', 'Tender', 'Quote', 'Compliance');
CREATE TYPE document_status AS ENUM ('active', 'archived', 'expired', 'draft');
CREATE TYPE report_type AS ENUM ('summary', 'detailed', 'analytics', 'compliance', 'audit');

-- Create procurement_documents table
CREATE TABLE IF NOT EXISTS public.procurement_documents (
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

-- Create procurement_reports table
CREATE TABLE IF NOT EXISTS public.procurement_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    report_type report_type NOT NULL,
    title TEXT NOT NULL,
    parameters JSONB DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'generating' CHECK (status IN ('generating', 'completed', 'failed')),
    file_path TEXT,
    file_size BIGINT,
    generated_by UUID NOT NULL REFERENCES public.profiles(id),
    generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.procurement_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procurement_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for procurement_documents
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

-- RLS Policies for procurement_reports
CREATE POLICY "Users can view reports in their org" 
ON public.procurement_reports FOR SELECT 
USING (is_org_member(org_id));

CREATE POLICY "Users can create reports in their org" 
ON public.procurement_reports FOR INSERT 
WITH CHECK (is_org_member(org_id) AND generated_by = auth.uid());

CREATE POLICY "Users can update reports in their org" 
ON public.procurement_reports FOR UPDATE 
USING (is_org_member(org_id));

CREATE POLICY "Users can delete reports in their org" 
ON public.procurement_reports FOR DELETE 
USING (is_org_member(org_id));

-- Create indexes for better performance
CREATE INDEX idx_procurement_documents_org_id ON public.procurement_documents(org_id);
CREATE INDEX idx_procurement_documents_type ON public.procurement_documents(document_type);
CREATE INDEX idx_procurement_documents_status ON public.procurement_documents(status);
CREATE INDEX idx_procurement_documents_vendor ON public.procurement_documents(vendor_name);
CREATE INDEX idx_procurement_documents_uploaded_at ON public.procurement_documents(uploaded_at);

CREATE INDEX idx_procurement_reports_org_id ON public.procurement_reports(org_id);
CREATE INDEX idx_procurement_reports_type ON public.procurement_reports(report_type);
CREATE INDEX idx_procurement_reports_status ON public.procurement_reports(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_procurement_documents_updated_at
    BEFORE UPDATE ON public.procurement_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_procurement_reports_updated_at
    BEFORE UPDATE ON public.procurement_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO public.procurement_documents (
    org_id, document_type, title, file_name, file_path, file_size, mime_type,
    vendor_name, project_name, amount, currency, status, description, fiscal_year, uploaded_by
) VALUES 
(
    (SELECT id FROM public.organizations LIMIT 1),
    'Contract',
    'Solar Initiative Contract - CTR-10011',
    'solar_contract_2024.pdf',
    '/documents/contracts/solar_contract_2024.pdf',
    2048576,
    'application/pdf',
    'Mark Jones',
    'Solar initiative',
    150000.00,
    'USD',
    'active',
    'Main contract for solar panel installation project',
    '2024',
    (SELECT id FROM public.profiles LIMIT 1)
),
(
    (SELECT id FROM public.organizations LIMIT 1),
    'Invoice',
    'Equipment Invoice - INV-20022',
    'equipment_invoice_2024.pdf',
    '/documents/invoices/equipment_invoice_2024.pdf',
    1024768,
    'application/pdf',
    'Tech Solutions Inc',
    'Equipment procurement',
    25000.00,
    'USD',
    'active',
    'Invoice for computer equipment and software licenses',
    '2024',
    (SELECT id FROM public.profiles LIMIT 1)
),
(
    (SELECT id FROM public.organizations LIMIT 1),
    'GRN',
    'Goods Received Note - GRN-30033',
    'grn_office_supplies.pdf',
    '/documents/grns/grn_office_supplies.pdf',
    512384,
    'application/pdf',
    'Office Supplies Co',
    'Office supplies delivery',
    5000.00,
    'USD',
    'active',
    'GRN for office supplies and stationery',
    '2024',
    (SELECT id FROM public.profiles LIMIT 1)
),
(
    (SELECT id FROM public.organizations LIMIT 1),
    'PO',
    'Purchase Order - PO-40044',
    'po_cleaning_services.pdf',
    '/documents/pos/po_cleaning_services.pdf',
    256192,
    'application/pdf',
    'Clean Pro Services',
    'Cleaning services',
    3000.00,
    'USD',
    'active',
    'Purchase order for monthly cleaning services',
    '2024',
    (SELECT id FROM public.profiles LIMIT 1)
),
(
    (SELECT id FROM public.organizations LIMIT 1),
    'Contract',
    'IT Support Contract - CTR-10012',
    'it_support_contract.pdf',
    '/documents/contracts/it_support_contract.pdf',
    1536000,
    'application/pdf',
    'IT Solutions Ltd',
    'IT support services',
    75000.00,
    'USD',
    'active',
    'Annual IT support and maintenance contract',
    '2024',
    (SELECT id FROM public.profiles LIMIT 1)
),
(
    (SELECT id FROM public.organizations LIMIT 1),
    'Invoice',
    'Software License Invoice - INV-20023',
    'software_license_invoice.pdf',
    '/documents/invoices/software_license_invoice.pdf',
    768000,
    'application/pdf',
    'Software Corp',
    'Software licensing',
    12000.00,
    'USD',
    'active',
    'Annual software license renewal',
    '2024',
    (SELECT id FROM public.profiles LIMIT 1)
),
(
    (SELECT id FROM public.organizations LIMIT 1),
    'GRN',
    'Goods Received Note - GRN-30034',
    'grn_equipment.pdf',
    '/documents/grns/grn_equipment.pdf',
    384000,
    'application/pdf',
    'Equipment Suppliers',
    'Equipment delivery',
    18000.00,
    'USD',
    'active',
    'GRN for office equipment delivery',
    '2024',
    (SELECT id FROM public.profiles LIMIT 1)
),
(
    (SELECT id FROM public.organizations LIMIT 1),
    'PO',
    'Purchase Order - PO-40045',
    'po_consulting_services.pdf',
    '/documents/pos/po_consulting_services.pdf',
    192000,
    'application/pdf',
    'Consulting Group',
    'Consulting services',
    8000.00,
    'USD',
    'active',
    'Purchase order for business consulting services',
    '2024',
    (SELECT id FROM public.profiles LIMIT 1)
)
ON CONFLICT (id) DO NOTHING;

