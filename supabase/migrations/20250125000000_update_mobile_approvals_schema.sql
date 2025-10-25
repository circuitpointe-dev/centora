-- Update mobile approvals schema to match component requirements
-- Add missing fields and ensure proper data types

-- First, let's ensure we have the procurement_approvals table with all required fields
ALTER TABLE public.procurement_approvals 
ADD COLUMN IF NOT EXISTS display_id TEXT,
ADD COLUMN IF NOT EXISTS priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
ADD COLUMN IF NOT EXISTS dispute_reason TEXT;

-- Update existing records to have display_id if missing
UPDATE public.procurement_approvals 
SET display_id = 'PO-' || LPAD(EXTRACT(EPOCH FROM created_at)::TEXT, 8, '0')
WHERE display_id IS NULL;

-- Create a function to generate display IDs
CREATE OR REPLACE FUNCTION generate_display_id(approval_type TEXT)
RETURNS TEXT AS $$
DECLARE
    prefix TEXT;
    sequence_num INTEGER;
BEGIN
    CASE approval_type
        WHEN 'purchase_order' THEN prefix := 'PO-';
        WHEN 'payment' THEN prefix := 'PAY-';
        WHEN 'requisition' THEN prefix := 'REQ-';
        ELSE prefix := 'APP-';
    END CASE;
    
    -- Get next sequence number for this type
    SELECT COALESCE(MAX(CAST(SUBSTRING(display_id FROM LENGTH(prefix) + 1) AS INTEGER)), 0) + 1
    INTO sequence_num
    FROM public.procurement_approvals
    WHERE display_id LIKE prefix || '%';
    
    RETURN prefix || LPAD(sequence_num::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate display_id
CREATE OR REPLACE FUNCTION set_display_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.display_id IS NULL THEN
        NEW.display_id := generate_display_id(NEW.type);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_set_display_id ON public.procurement_approvals;
CREATE TRIGGER trigger_set_display_id
    BEFORE INSERT ON public.procurement_approvals
    FOR EACH ROW
    EXECUTE FUNCTION set_display_id();

-- Add RLS policies if they don't exist
DO $$
BEGIN
    -- Check if policies exist, if not create them
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'procurement_approvals' 
        AND policyname = 'Users can view procurement approvals in their org'
    ) THEN
        CREATE POLICY "Users can view procurement approvals in their org" 
        ON public.procurement_approvals FOR SELECT 
        USING (is_org_member(org_id));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'procurement_approvals' 
        AND policyname = 'Users can create procurement approvals in their org'
    ) THEN
        CREATE POLICY "Users can create procurement approvals in their org" 
        ON public.procurement_approvals FOR INSERT 
        WITH CHECK (is_org_member(org_id) AND requestor_id = auth.uid());
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'procurement_approvals' 
        AND policyname = 'Users can update procurement approvals in their org'
    ) THEN
        CREATE POLICY "Users can update procurement approvals in their org" 
        ON public.procurement_approvals FOR UPDATE 
        USING (is_org_member(org_id));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'procurement_approvals' 
        AND policyname = 'Users can delete procurement approvals in their org'
    ) THEN
        CREATE POLICY "Users can delete procurement approvals in their org" 
        ON public.procurement_approvals FOR DELETE 
        USING (is_org_member(org_id));
    END IF;
END $$;

-- Insert sample data for testing
INSERT INTO public.procurement_approvals (
    org_id, type, requestor_id, requestor_name, amount, currency, 
    status, priority, description, vendor_name, date_submitted
) VALUES 
(
    (SELECT id FROM public.organizations LIMIT 1),
    'purchase_order',
    (SELECT id FROM public.profiles LIMIT 1),
    'John Doe',
    42000.00,
    'USD',
    'pending',
    'high',
    'Office supplies and equipment for Q1 2024',
    'Acme Corp',
    CURRENT_DATE
),
(
    (SELECT id FROM public.organizations LIMIT 1),
    'payment',
    (SELECT id FROM public.profiles LIMIT 1),
    'Jane Smith',
    15000.00,
    'USD',
    'pending',
    'medium',
    'Monthly software subscription renewal',
    'Tech Solutions Inc',
    CURRENT_DATE
),
(
    (SELECT id FROM public.organizations LIMIT 1),
    'requisition',
    (SELECT id FROM public.profiles LIMIT 1),
    'Mike Johnson',
    8500.00,
    'USD',
    'approved',
    'low',
    'Marketing materials for upcoming campaign',
    'Creative Agency Ltd',
    CURRENT_DATE - INTERVAL '2 days'
),
(
    (SELECT id FROM public.organizations LIMIT 1),
    'purchase_order',
    (SELECT id FROM public.profiles LIMIT 1),
    'Sarah Wilson',
    25000.00,
    'USD',
    'rejected',
    'urgent',
    'Emergency equipment purchase',
    'Emergency Supplies Co',
    CURRENT_DATE - INTERVAL '1 day'
)
ON CONFLICT (id) DO NOTHING;

