-- Create vendor_contracts table
CREATE TABLE IF NOT EXISTS vendor_contracts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    contract_code VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    start_date DATE,
    end_date DATE,
    value DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Expired', 'Overdue', 'Terminated')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT positive_value CHECK (value IS NULL OR value > 0),
    CONSTRAINT valid_date_range CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vendor_contracts_org_id ON vendor_contracts(org_id);
CREATE INDEX IF NOT EXISTS idx_vendor_contracts_vendor_id ON vendor_contracts(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_contracts_status ON vendor_contracts(status);
CREATE INDEX IF NOT EXISTS idx_vendor_contracts_contract_code ON vendor_contracts(contract_code);
CREATE INDEX IF NOT EXISTS idx_vendor_contracts_created_at ON vendor_contracts(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_vendor_contracts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_vendor_contracts_updated_at
    BEFORE UPDATE ON vendor_contracts
    FOR EACH ROW
    EXECUTE FUNCTION update_vendor_contracts_updated_at();

-- Enable Row Level Security
ALTER TABLE vendor_contracts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view contracts from their organization" ON vendor_contracts
    FOR SELECT USING (
        org_id IN (
            SELECT org_id FROM profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can insert contracts for their organization" ON vendor_contracts
    FOR INSERT WITH CHECK (
        org_id IN (
            SELECT org_id FROM profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can update contracts from their organization" ON vendor_contracts
    FOR UPDATE USING (
        org_id IN (
            SELECT org_id FROM profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can delete contracts from their organization" ON vendor_contracts
    FOR DELETE USING (
        org_id IN (
            SELECT org_id FROM profiles WHERE id = auth.uid()
        )
    );

-- Insert sample data for development
INSERT INTO vendor_contracts (
    org_id,
    vendor_id,
    contract_code,
    title,
    start_date,
    end_date,
    value,
    currency,
    status,
    description
) VALUES 
-- Get a sample org_id and vendor_id for development
(
    (SELECT id FROM organizations LIMIT 1),
    (SELECT id FROM vendors LIMIT 1),
    'CON-202501-001',
    'IT Support Services Contract',
    '2025-01-01',
    '2025-12-31',
    50000.00,
    'USD',
    'Active',
    'Comprehensive IT support services including maintenance, updates, and 24/7 helpdesk'
),
(
    (SELECT id FROM organizations LIMIT 1),
    (SELECT id FROM vendors LIMIT 1),
    'CON-202501-002',
    'Office Supplies Agreement',
    '2025-01-15',
    '2025-06-15',
    15000.00,
    'USD',
    'Active',
    'Monthly office supplies delivery including paper, pens, and other stationery'
),
(
    (SELECT id FROM organizations LIMIT 1),
    (SELECT id FROM vendors LIMIT 1),
    'CON-202501-003',
    'Cleaning Services Contract',
    '2024-12-01',
    '2024-12-31',
    8000.00,
    'USD',
    'Expired',
    'Daily office cleaning services contract that has expired'
);
