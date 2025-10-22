-- Create tenders table
CREATE TABLE IF NOT EXISTS tenders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    vendor_name VARCHAR(255) NOT NULL,
    items TEXT NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    delivery_terms VARCHAR(100),
    score INTEGER CHECK (score >= 0 AND score <= 100),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'awarded', 'rejected', 'expired')),
    compliance_status VARCHAR(20) DEFAULT 'pending' CHECK (compliance_status IN ('compliant', 'pending', 'non-compliant')),
    description TEXT,
    requirements TEXT[],
    attachments TEXT[],
    due_date DATE,
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    awarded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    awarded_at TIMESTAMP WITH TIME ZONE,
    award_comment TEXT,
    rejected_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    rejected_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    
    -- Constraints
    CONSTRAINT positive_price CHECK (price > 0),
    CONSTRAINT valid_due_date CHECK (due_date IS NULL OR due_date >= created_at::date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tenders_org_id ON tenders(org_id);
CREATE INDEX IF NOT EXISTS idx_tenders_vendor_id ON tenders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_tenders_status ON tenders(status);
CREATE INDEX IF NOT EXISTS idx_tenders_compliance_status ON tenders(compliance_status);
CREATE INDEX IF NOT EXISTS idx_tenders_created_at ON tenders(created_at);
CREATE INDEX IF NOT EXISTS idx_tenders_due_date ON tenders(due_date);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_tenders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_tenders_updated_at
    BEFORE UPDATE ON tenders
    FOR EACH ROW
    EXECUTE FUNCTION update_tenders_updated_at();

-- Enable Row Level Security
ALTER TABLE tenders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view tenders from their organization" ON tenders
    FOR SELECT USING (
        org_id IN (
            SELECT org_id FROM profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can insert tenders for their organization" ON tenders
    FOR INSERT WITH CHECK (
        org_id IN (
            SELECT org_id FROM profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can update tenders from their organization" ON tenders
    FOR UPDATE USING (
        org_id IN (
            SELECT org_id FROM profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can delete tenders from their organization" ON tenders
    FOR DELETE USING (
        org_id IN (
            SELECT org_id FROM profiles WHERE id = auth.uid()
        )
    );

-- Insert sample data for development
INSERT INTO tenders (
    org_id,
    vendor_id,
    vendor_name,
    items,
    price,
    currency,
    delivery_terms,
    score,
    status,
    compliance_status,
    description,
    due_date,
    created_by
) VALUES 
-- Get a sample org_id and user_id for development
(
    (SELECT id FROM organizations LIMIT 1),
    (SELECT id FROM profiles LIMIT 1),
    'Acme corp',
    'Laptops',
    1000.00,
    'USD',
    '30 days',
    82,
    'active',
    'compliant',
    'High-performance laptops for office use',
    '2025-02-15',
    (SELECT id FROM profiles LIMIT 1)
),
(
    (SELECT id FROM organizations LIMIT 1),
    (SELECT id FROM profiles LIMIT 1),
    'Beta Solutions',
    'Office furniture',
    900.00,
    'USD',
    '30 days',
    67,
    'active',
    'pending',
    'Ergonomic office furniture set',
    '2025-02-14',
    (SELECT id FROM profiles LIMIT 1)
),
(
    (SELECT id FROM organizations LIMIT 1),
    (SELECT id FROM profiles LIMIT 1),
    'Gamma Industries',
    'Laptops',
    800.00,
    'USD',
    '30 days',
    45,
    'active',
    'compliant',
    'Budget laptops for general use',
    '2025-02-13',
    (SELECT id FROM profiles LIMIT 1)
),
(
    (SELECT id FROM organizations LIMIT 1),
    (SELECT id FROM profiles LIMIT 1),
    'Delta Technologies',
    'Software licenses',
    2500.00,
    'USD',
    '15 days',
    95,
    'awarded',
    'compliant',
    'Enterprise software licensing',
    '2025-01-30',
    (SELECT id FROM profiles LIMIT 1)
),
(
    (SELECT id FROM organizations LIMIT 1),
    (SELECT id FROM profiles LIMIT 1),
    'Epsilon Services',
    'Consulting services',
    5000.00,
    'USD',
    '60 days',
    78,
    'active',
    'pending',
    'IT consulting and implementation',
    '2025-03-15',
    (SELECT id FROM profiles LIMIT 1)
);
