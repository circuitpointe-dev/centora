-- Drop existing procurement_approvals table and its policies
DROP TABLE IF EXISTS public.procurement_approvals CASCADE;

-- Drop the old trigger function if it exists
DROP FUNCTION IF EXISTS update_procurement_approvals_updated_at() CASCADE;

-- Create procurement_approvals table with correct schema
CREATE TABLE public.procurement_approvals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('requisition', 'purchase_order', 'payment')),
    requestor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    requestor_name VARCHAR(255) NOT NULL,
    date_submitted DATE NOT NULL DEFAULT CURRENT_DATE,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    risk_level VARCHAR(10) NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    description TEXT NOT NULL,
    priority VARCHAR(10) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    department VARCHAR(100),
    vendor_name VARCHAR(255),
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    approval_comment TEXT,
    rejection_reason TEXT,
    attachments TEXT[] DEFAULT '{}',
    
    CONSTRAINT positive_amount CHECK (amount > 0),
    CONSTRAINT valid_due_date CHECK (due_date IS NULL OR due_date >= date_submitted)
);

-- Create indexes
CREATE INDEX idx_procurement_approvals_org_id ON procurement_approvals(org_id);
CREATE INDEX idx_procurement_approvals_status ON procurement_approvals(status);
CREATE INDEX idx_procurement_approvals_type ON procurement_approvals(type);
CREATE INDEX idx_procurement_approvals_risk_level ON procurement_approvals(risk_level);
CREATE INDEX idx_procurement_approvals_requestor_id ON procurement_approvals(requestor_id);
CREATE INDEX idx_procurement_approvals_date_submitted ON procurement_approvals(date_submitted);
CREATE INDEX idx_procurement_approvals_created_at ON procurement_approvals(created_at);

-- Create trigger function
CREATE FUNCTION update_procurement_approvals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_procurement_approvals_updated_at
    BEFORE UPDATE ON procurement_approvals
    FOR EACH ROW
    EXECUTE FUNCTION update_procurement_approvals_updated_at();

-- Enable RLS
ALTER TABLE procurement_approvals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view approvals from their organization" ON procurement_approvals
    FOR SELECT USING (org_id IN (SELECT org_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert approvals for their organization" ON procurement_approvals
    FOR INSERT WITH CHECK (org_id IN (SELECT org_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update approvals from their organization" ON procurement_approvals
    FOR UPDATE USING (org_id IN (SELECT org_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can delete approvals from their organization" ON procurement_approvals
    FOR DELETE USING (org_id IN (SELECT org_id FROM profiles WHERE id = auth.uid()));

-- Insert sample data
INSERT INTO procurement_approvals (org_id, type, requestor_id, requestor_name, date_submitted, amount, currency, risk_level, status, description, priority, department, vendor_name, due_date)
SELECT 
    (SELECT id FROM organizations LIMIT 1),
    'requisition',
    (SELECT id FROM profiles LIMIT 1),
    'Darlene Robertson',
    '2025-07-02',
    42000.00,
    'USD',
    'high',
    'pending',
    'Office equipment and supplies for Q3 expansion',
    'high',
    'Operations',
    'Office Depot',
    '2025-07-15'
WHERE EXISTS (SELECT 1 FROM organizations) AND EXISTS (SELECT 1 FROM profiles);

INSERT INTO procurement_approvals (org_id, type, requestor_id, requestor_name, date_submitted, amount, currency, risk_level, status, description, priority, department, vendor_name, due_date)
SELECT 
    (SELECT id FROM organizations LIMIT 1),
    'purchase_order',
    (SELECT id FROM profiles LIMIT 1),
    'Marcus Lee',
    '2025-07-05',
    35500.00,
    'USD',
    'medium',
    'pending',
    'IT hardware and software licenses for new employees',
    'medium',
    'IT',
    'Dell Technologies',
    '2025-07-20'
WHERE EXISTS (SELECT 1 FROM organizations) AND EXISTS (SELECT 1 FROM profiles);