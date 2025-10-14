-- Create procurement_deliveries table
CREATE TABLE IF NOT EXISTS procurement_deliveries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    reference VARCHAR(50) NOT NULL,
    po_number VARCHAR(50),
    vendor_name VARCHAR(255) NOT NULL,
    delivery_date DATE NOT NULL,
    expected_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'due_soon', 'overdue', 'delivered', 'cancelled')),
    priority VARCHAR(10) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    amount DECIMAL(15,2),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    description TEXT,
    contact_person VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    delivery_address TEXT,
    tracking_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    confirmed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    attachments TEXT[] DEFAULT '{}',
    
    -- Constraints
    CONSTRAINT positive_amount CHECK (amount IS NULL OR amount > 0),
    CONSTRAINT valid_delivery_date CHECK (delivery_date >= created_at::date),
    CONSTRAINT valid_expected_date CHECK (expected_date IS NULL OR expected_date >= delivery_date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_procurement_deliveries_org_id ON procurement_deliveries(org_id);
CREATE INDEX IF NOT EXISTS idx_procurement_deliveries_status ON procurement_deliveries(status);
CREATE INDEX IF NOT EXISTS idx_procurement_deliveries_delivery_date ON procurement_deliveries(delivery_date);
CREATE INDEX IF NOT EXISTS idx_procurement_deliveries_expected_date ON procurement_deliveries(expected_date);
CREATE INDEX IF NOT EXISTS idx_procurement_deliveries_vendor_name ON procurement_deliveries(vendor_name);
CREATE INDEX IF NOT EXISTS idx_procurement_deliveries_reference ON procurement_deliveries(reference);
CREATE INDEX IF NOT EXISTS idx_procurement_deliveries_created_at ON procurement_deliveries(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_procurement_deliveries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_procurement_deliveries_updated_at
    BEFORE UPDATE ON procurement_deliveries
    FOR EACH ROW
    EXECUTE FUNCTION update_procurement_deliveries_updated_at();

-- Enable Row Level Security
ALTER TABLE procurement_deliveries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view deliveries from their organization" ON procurement_deliveries
    FOR SELECT USING (
        org_id IN (
            SELECT org_id FROM profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can insert deliveries for their organization" ON procurement_deliveries
    FOR INSERT WITH CHECK (
        org_id IN (
            SELECT org_id FROM profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can update deliveries from their organization" ON procurement_deliveries
    FOR UPDATE USING (
        org_id IN (
            SELECT org_id FROM profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can delete deliveries from their organization" ON procurement_deliveries
    FOR DELETE USING (
        org_id IN (
            SELECT org_id FROM profiles WHERE id = auth.uid()
        )
    );

-- Insert sample data for development
INSERT INTO procurement_deliveries (
    org_id,
    reference,
    po_number,
    vendor_name,
    delivery_date,
    expected_date,
    status,
    priority,
    amount,
    currency,
    description,
    contact_person,
    contact_email,
    delivery_address,
    created_by
) VALUES 
-- Get a sample org_id and user_id for development
(
    (SELECT id FROM organizations LIMIT 1),
    'PO-2211',
    'PO-2211',
    'Optima tech',
    '2025-07-02',
    '2025-07-02',
    'due_soon',
    'high',
    15000.00,
    'USD',
    'Office equipment and supplies for Q3 expansion',
    'John Smith',
    'john.smith@optima-tech.com',
    '123 Business St, Suite 100, New York, NY 10001',
    (SELECT id FROM profiles LIMIT 1)
),
(
    (SELECT id FROM organizations LIMIT 1),
    'PO-2212',
    'PO-2212',
    'Alpha systems',
    '2025-07-10',
    '2025-07-10',
    'overdue',
    'high',
    25000.00,
    'USD',
    'IT hardware and software licenses for new employees',
    'Sarah Johnson',
    'sarah.johnson@alpha-systems.com',
    '456 Tech Ave, Building B, San Francisco, CA 94105',
    (SELECT id FROM profiles LIMIT 1)
),
(
    (SELECT id FROM organizations LIMIT 1),
    'PO-2213',
    'PO-2213',
    'Beta solutions',
    '2025-07-15',
    '2025-07-15',
    'overdue',
    'medium',
    18000.00,
    'USD',
    'Marketing materials and promotional items',
    'Mike Davis',
    'mike.davis@beta-solutions.com',
    '789 Marketing Blvd, Floor 3, Chicago, IL 60601',
    (SELECT id FROM profiles LIMIT 1)
),
(
    (SELECT id FROM organizations LIMIT 1),
    'PO-2214',
    'PO-2214',
    'Gamma innovations',
    '2025-07-20',
    '2025-07-20',
    'due_soon',
    'medium',
    12000.00,
    'USD',
    'Training materials and certification courses',
    'Lisa Wong',
    'lisa.wong@gamma-innovations.com',
    '321 Learning St, Room 205, Boston, MA 02101',
    (SELECT id FROM profiles LIMIT 1)
),
(
    (SELECT id FROM organizations LIMIT 1),
    'PO-2215',
    'PO-2215',
    'Delta enterprises',
    '2025-07-25',
    '2025-07-25',
    'due_soon',
    'low',
    8500.00,
    'USD',
    'Monthly maintenance contract for cloud infrastructure',
    'David Lee',
    'david.lee@delta-enterprises.com',
    '654 Cloud Way, Data Center 1, Seattle, WA 98101',
    (SELECT id FROM profiles LIMIT 1)
),
(
    (SELECT id FROM organizations LIMIT 1),
    'PO-2216',
    'PO-2216',
    'Epsilon group',
    '2025-07-30',
    '2025-07-30',
    'due_soon',
    'medium',
    22000.00,
    'USD',
    'Emergency equipment replacement due to system failure',
    'Maria Garcia',
    'maria.garcia@epsilon-group.com',
    '987 Emergency Rd, Warehouse 2, Houston, TX 77001',
    (SELECT id FROM profiles LIMIT 1)
),
(
    (SELECT id FROM organizations LIMIT 1),
    'PO-2217',
    'PO-2217',
    'Zeta corp',
    '2025-08-05',
    '2025-08-05',
    'due_soon',
    'low',
    9500.00,
    'USD',
    'Quarterly software subscription renewal',
    'James Wilson',
    'james.wilson@zeta-corp.com',
    '147 Software St, Office 401, Austin, TX 78701',
    (SELECT id FROM profiles LIMIT 1)
),
(
    (SELECT id FROM organizations LIMIT 1),
    'PO-2218',
    'PO-2218',
    'Theta technologies',
    '2025-08-10',
    '2025-08-10',
    'overdue',
    'high',
    30000.00,
    'USD',
    'Consulting services for Q3 digital transformation project',
    'Robert Brown',
    'robert.brown@theta-technologies.com',
    '258 Consulting Ave, Suite 500, Miami, FL 33101',
    (SELECT id FROM profiles LIMIT 1)
);
