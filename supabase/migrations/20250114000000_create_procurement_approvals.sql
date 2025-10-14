-- Create procurement_approvals table
CREATE TABLE IF NOT EXISTS procurement_approvals (
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
    
    -- Constraints
    CONSTRAINT positive_amount CHECK (amount > 0),
    CONSTRAINT valid_due_date CHECK (due_date IS NULL OR due_date >= date_submitted)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_procurement_approvals_org_id ON procurement_approvals(org_id);
CREATE INDEX IF NOT EXISTS idx_procurement_approvals_status ON procurement_approvals(status);
CREATE INDEX IF NOT EXISTS idx_procurement_approvals_type ON procurement_approvals(type);
CREATE INDEX IF NOT EXISTS idx_procurement_approvals_risk_level ON procurement_approvals(risk_level);
CREATE INDEX IF NOT EXISTS idx_procurement_approvals_requestor_id ON procurement_approvals(requestor_id);
CREATE INDEX IF NOT EXISTS idx_procurement_approvals_date_submitted ON procurement_approvals(date_submitted);
CREATE INDEX IF NOT EXISTS idx_procurement_approvals_created_at ON procurement_approvals(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_procurement_approvals_updated_at()
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

-- Enable Row Level Security
ALTER TABLE procurement_approvals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view approvals from their organization" ON procurement_approvals
    FOR SELECT USING (
        org_id IN (
            SELECT org_id FROM profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can insert approvals for their organization" ON procurement_approvals
    FOR INSERT WITH CHECK (
        org_id IN (
            SELECT org_id FROM profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can update approvals from their organization" ON procurement_approvals
    FOR UPDATE USING (
        org_id IN (
            SELECT org_id FROM profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can delete approvals from their organization" ON procurement_approvals
    FOR DELETE USING (
        org_id IN (
            SELECT org_id FROM profiles WHERE id = auth.uid()
        )
    );

-- Insert sample data for development
INSERT INTO procurement_approvals (
    org_id,
    type,
    requestor_id,
    requestor_name,
    date_submitted,
    amount,
    currency,
    risk_level,
    status,
    description,
    priority,
    department,
    vendor_name,
    due_date
) VALUES 
-- Get a sample org_id and user_id for development
(
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
),
(
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
),
(
    (SELECT id FROM organizations LIMIT 1),
    'payment',
    (SELECT id FROM profiles LIMIT 1),
    'Samantha Green',
    '2025-07-07',
    58200.00,
    'USD',
    'medium',
    'pending',
    'Consulting services for Q3 digital transformation project',
    'high',
    'Strategy',
    'McKinsey & Company',
    '2025-07-25'
),
(
    (SELECT id FROM organizations LIMIT 1),
    'purchase_order',
    (SELECT id FROM profiles LIMIT 1),
    'Michael Johnson',
    '2025-07-10',
    29750.00,
    'USD',
    'medium',
    'pending',
    'Marketing materials and promotional items for product launch',
    'medium',
    'Marketing',
    'Print Solutions Inc',
    '2025-07-30'
),
(
    (SELECT id FROM organizations LIMIT 1),
    'requisition',
    (SELECT id FROM profiles LIMIT 1),
    'Lisa Wong',
    '2025-07-12',
    48300.00,
    'USD',
    'low',
    'pending',
    'Training materials and certification courses for team development',
    'low',
    'HR',
    'LinkedIn Learning',
    '2025-08-01'
),
(
    (SELECT id FROM organizations LIMIT 1),
    'payment',
    (SELECT id FROM profiles LIMIT 1),
    'James Smith',
    '2025-08-15',
    35000.00,
    'USD',
    'low',
    'pending',
    'Monthly maintenance contract for cloud infrastructure',
    'medium',
    'IT',
    'Amazon Web Services',
    '2025-08-20'
),
(
    (SELECT id FROM organizations LIMIT 1),
    'purchase_order',
    (SELECT id FROM profiles LIMIT 1),
    'Maria Garcia',
    '2025-09-22',
    22500.00,
    'USD',
    'high',
    'pending',
    'Emergency equipment replacement due to system failure',
    'high',
    'Operations',
    'Emergency Tech Solutions',
    '2025-09-25'
),
(
    (SELECT id FROM organizations LIMIT 1),
    'payment',
    (SELECT id FROM profiles LIMIT 1),
    'David Lee',
    '2025-10-30',
    15750.00,
    'USD',
    'low',
    'pending',
    'Quarterly software subscription renewal for productivity tools',
    'low',
    'IT',
    'Microsoft Corporation',
    '2025-11-05'
);
