-- Create procurement_requisitions table
CREATE TABLE IF NOT EXISTS procurement_requisitions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    req_id VARCHAR(50) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(15,2),
    estimated_cost DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    date_submitted DATE NOT NULL DEFAULT CURRENT_DATE,
    budget_source VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed', 'cancelled')),
    priority VARCHAR(10) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    category VARCHAR(100),
    department VARCHAR(100),
    requested_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    due_date DATE,
    justification TEXT,
    notes TEXT,
    attachments TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT positive_quantity CHECK (quantity > 0),
    CONSTRAINT positive_estimated_cost CHECK (estimated_cost > 0),
    CONSTRAINT valid_due_date CHECK (due_date IS NULL OR due_date >= date_submitted)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_procurement_requisitions_org_id ON procurement_requisitions(org_id);
CREATE INDEX IF NOT EXISTS idx_procurement_requisitions_status ON procurement_requisitions(status);
CREATE INDEX IF NOT EXISTS idx_procurement_requisitions_req_id ON procurement_requisitions(req_id);
CREATE INDEX IF NOT EXISTS idx_procurement_requisitions_date_submitted ON procurement_requisitions(date_submitted);
CREATE INDEX IF NOT EXISTS idx_procurement_requisitions_requested_by ON procurement_requisitions(requested_by);
CREATE INDEX IF NOT EXISTS idx_procurement_requisitions_budget_source ON procurement_requisitions(budget_source);
CREATE INDEX IF NOT EXISTS idx_procurement_requisitions_created_at ON procurement_requisitions(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_procurement_requisitions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_procurement_requisitions_updated_at
    BEFORE UPDATE ON procurement_requisitions
    FOR EACH ROW
    EXECUTE FUNCTION update_procurement_requisitions_updated_at();

-- Enable Row Level Security
ALTER TABLE procurement_requisitions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view requisitions from their organization" ON procurement_requisitions
    FOR SELECT USING (
        org_id IN (
            SELECT org_id FROM profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can insert requisitions for their organization" ON procurement_requisitions
    FOR INSERT WITH CHECK (
        org_id IN (
            SELECT org_id FROM profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can update requisitions from their organization" ON procurement_requisitions
    FOR UPDATE USING (
        org_id IN (
            SELECT org_id FROM profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can delete requisitions from their organization" ON procurement_requisitions
    FOR DELETE USING (
        org_id IN (
            SELECT org_id FROM profiles WHERE id = auth.uid()
        )
    );

-- Insert sample data for development
INSERT INTO procurement_requisitions (
    org_id,
    req_id,
    item_name,
    description,
    quantity,
    unit_price,
    estimated_cost,
    currency,
    date_submitted,
    budget_source,
    status,
    priority,
    category,
    department,
    requested_by,
    justification
) VALUES 
-- Get a sample org_id and user_id for development
(
    (SELECT id FROM organizations LIMIT 1),
    'REQ-001',
    'Laptops',
    'High-performance laptops for development team',
    10,
    4200.00,
    42000.00,
    'USD',
    '2025-07-02',
    'Grant A',
    'pending',
    'high',
    'IT Equipment',
    'IT',
    (SELECT id FROM profiles LIMIT 1),
    'Required for new development team members to increase productivity'
),
(
    (SELECT id FROM organizations LIMIT 1),
    'REQ-002',
    'Desktops',
    'Desktop computers for office workstations',
    5,
    3000.00,
    15000.00,
    'USD',
    '2025-07-03',
    'General fund',
    'completed',
    'medium',
    'IT Equipment',
    'IT',
    (SELECT id FROM profiles LIMIT 1),
    'Replacement for outdated office computers'
),
(
    (SELECT id FROM organizations LIMIT 1),
    'REQ-003',
    'Monitors',
    '27-inch 4K monitors for better productivity',
    20,
    400.00,
    8000.00,
    'USD',
    '2025-07-04',
    'Donor B',
    'completed',
    'medium',
    'IT Equipment',
    'IT',
    (SELECT id FROM profiles LIMIT 1),
    'Upgrade monitors for improved visual experience'
),
(
    (SELECT id FROM organizations LIMIT 1),
    'REQ-004',
    'Printers',
    'Multifunction printers for office use',
    15,
    250.00,
    3750.00,
    'USD',
    '2025-07-05',
    'Grant A',
    'pending',
    'low',
    'Office Equipment',
    'Administration',
    (SELECT id FROM profiles LIMIT 1),
    'Replace old printers with new multifunction devices'
),
(
    (SELECT id FROM organizations LIMIT 1),
    'REQ-005',
    'Projectors',
    'High-resolution projectors for presentations',
    3,
    3000.00,
    9000.00,
    'USD',
    '2025-07-06',
    'Donor B',
    'completed',
    'medium',
    'Presentation Equipment',
    'Marketing',
    (SELECT id FROM profiles LIMIT 1),
    'Required for client presentations and meetings'
),
(
    (SELECT id FROM organizations LIMIT 1),
    'REQ-006',
    'Tablets',
    'Tablets for field work and mobile access',
    25,
    500.00,
    12500.00,
    'USD',
    '2025-07-07',
    'Grant A',
    'pending',
    'high',
    'Mobile Devices',
    'Field Operations',
    (SELECT id FROM profiles LIMIT 1),
    'Essential for field data collection and reporting'
),
(
    (SELECT id FROM organizations LIMIT 1),
    'REQ-007',
    'Smartphones',
    'Business smartphones for communication',
    30,
    600.00,
    18000.00,
    'USD',
    '2025-07-08',
    'Grant A',
    'pending',
    'medium',
    'Mobile Devices',
    'Operations',
    (SELECT id FROM profiles LIMIT 1),
    'Replace outdated phones for better communication'
),
(
    (SELECT id FROM organizations LIMIT 1),
    'REQ-008',
    'Accessories',
    'Various IT accessories and peripherals',
    50,
    100.00,
    5000.00,
    'USD',
    '2025-07-09',
    'General fund',
    'completed',
    'low',
    'IT Accessories',
    'IT',
    (SELECT id FROM profiles LIMIT 1),
    'Standard accessories for new equipment setup'
),
(
    (SELECT id FROM organizations LIMIT 1),
    'REQ-009',
    'Software Licenses',
    'Annual software licenses for productivity tools',
    1,
    5000.00,
    5000.00,
    'USD',
    '2025-07-10',
    'Grant A',
    'pending',
    'high',
    'Software',
    'IT',
    (SELECT id FROM profiles LIMIT 1),
    'Essential software licenses for team productivity'
),
(
    (SELECT id FROM organizations LIMIT 1),
    'REQ-010',
    'Office Furniture',
    'Ergonomic chairs and desks for new office',
    20,
    800.00,
    16000.00,
    'USD',
    '2025-07-11',
    'Donor B',
    'approved',
    'medium',
    'Furniture',
    'Administration',
    (SELECT id FROM profiles LIMIT 1),
    'Furniture for new office expansion'
);
