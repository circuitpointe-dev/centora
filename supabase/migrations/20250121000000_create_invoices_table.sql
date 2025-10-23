-- Create invoices table for procurement system
CREATE TYPE invoice_status AS ENUM ('pending', 'matched', 'approved', 'paid', 'disputed', 'cancelled');

-- Invoices table
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  vendor_name TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  linked_po_number TEXT,
  linked_grn_number TEXT,
  status invoice_status NOT NULL DEFAULT 'pending',
  invoice_date DATE NOT NULL,
  due_date DATE,
  payment_date DATE,
  description TEXT,
  notes TEXT,
  attachments TEXT[] DEFAULT '{}',
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(org_id, invoice_number)
);

-- Enable RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- RLS Policies for invoices
CREATE POLICY "Users can view invoices in their org" 
ON public.invoices FOR SELECT 
USING (is_org_member(org_id));

CREATE POLICY "Users can create invoices in their org" 
ON public.invoices FOR INSERT 
WITH CHECK (is_org_member(org_id) AND created_by = auth.uid());

CREATE POLICY "Users can update invoices in their org" 
ON public.invoices FOR UPDATE 
USING (is_org_member(org_id));

CREATE POLICY "Users can delete invoices in their org" 
ON public.invoices FOR DELETE 
USING (is_org_member(org_id));

-- Create indexes for better performance
CREATE INDEX idx_invoices_org_id ON public.invoices(org_id);
CREATE INDEX idx_invoices_vendor_id ON public.invoices(vendor_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_invoices_invoice_date ON public.invoices(invoice_date);
CREATE INDEX idx_invoices_created_at ON public.invoices(created_at);

-- Create function to auto-generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
    next_number INTEGER;
    invoice_number TEXT;
BEGIN
    -- Get the next number for the current org
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 'INV-(\d+)') AS INTEGER)), 0) + 1
    INTO next_number
    FROM public.invoices
    WHERE org_id = (SELECT org_id FROM public.profiles WHERE id = auth.uid());
    
    invoice_number := 'INV-' || LPAD(next_number::TEXT, 5, '0');
    RETURN invoice_number;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate invoice number
CREATE OR REPLACE FUNCTION set_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
        NEW.invoice_number := generate_invoice_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_invoice_number
    BEFORE INSERT ON public.invoices
    FOR EACH ROW
    EXECUTE FUNCTION set_invoice_number();
