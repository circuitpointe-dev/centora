-- Create mobile approvals table for procurement system
CREATE TYPE approval_type AS ENUM ('PO', 'Payment', 'Invoice', 'Requisition');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected', 'disputed');
CREATE TYPE approval_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Mobile approvals table
CREATE TABLE public.mobile_approvals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  type approval_type NOT NULL,
  reference_id TEXT NOT NULL,
  vendor_name TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status approval_status NOT NULL DEFAULT 'pending',
  priority approval_priority NOT NULL DEFAULT 'medium',
  description TEXT,
  submitted_by UUID NOT NULL REFERENCES public.profiles(id),
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mobile_approvals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for mobile approvals
CREATE POLICY "Users can view mobile approvals in their org" 
ON public.mobile_approvals FOR SELECT 
USING (is_org_member(org_id));

CREATE POLICY "Users can create mobile approvals in their org" 
ON public.mobile_approvals FOR INSERT 
WITH CHECK (is_org_member(org_id) AND submitted_by = auth.uid());

CREATE POLICY "Users can update mobile approvals in their org" 
ON public.mobile_approvals FOR UPDATE 
USING (is_org_member(org_id));

CREATE POLICY "Users can delete mobile approvals in their org" 
ON public.mobile_approvals FOR DELETE 
USING (is_org_member(org_id));

-- Create indexes for better performance
CREATE INDEX idx_mobile_approvals_org_id ON public.mobile_approvals(org_id);
CREATE INDEX idx_mobile_approvals_type ON public.mobile_approvals(type);
CREATE INDEX idx_mobile_approvals_status ON public.mobile_approvals(status);
CREATE INDEX idx_mobile_approvals_priority ON public.mobile_approvals(priority);
CREATE INDEX idx_mobile_approvals_submitted_at ON public.mobile_approvals(submitted_at);
CREATE INDEX idx_mobile_approvals_created_at ON public.mobile_approvals(created_at);

-- Create function to auto-generate reference ID
CREATE OR REPLACE FUNCTION generate_approval_reference_id(approval_type approval_type)
RETURNS TEXT AS $$
DECLARE
    next_number INTEGER;
    reference_id TEXT;
    prefix TEXT;
BEGIN
    -- Set prefix based on type
    CASE approval_type
        WHEN 'PO' THEN prefix := 'PO-';
        WHEN 'Payment' THEN prefix := 'PAY-';
        WHEN 'Invoice' THEN prefix := 'INV-';
        WHEN 'Requisition' THEN prefix := 'REQ-';
        ELSE prefix := 'APP-';
    END CASE;
    
    -- Get the next number for the current org and type
    SELECT COALESCE(MAX(CAST(SUBSTRING(reference_id FROM prefix || '(\d+)') AS INTEGER)), 0) + 1
    INTO next_number
    FROM public.mobile_approvals
    WHERE org_id = (SELECT org_id FROM public.profiles WHERE id = auth.uid())
    AND type = approval_type;
    
    reference_id := prefix || LPAD(next_number::TEXT, 5, '0');
    RETURN reference_id;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate reference ID
CREATE OR REPLACE FUNCTION set_approval_reference_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.reference_id IS NULL OR NEW.reference_id = '' THEN
        NEW.reference_id := generate_approval_reference_id(NEW.type);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_approval_reference_id
    BEFORE INSERT ON public.mobile_approvals
    FOR EACH ROW
    EXECUTE FUNCTION set_approval_reference_id();
