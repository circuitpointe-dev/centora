-- Create vendor_clarifications table
CREATE TABLE IF NOT EXISTS vendor_clarifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL DEFAULT 'general',
    priority VARCHAR(20) NOT NULL DEFAULT 'medium',
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    due_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    response TEXT,
    responded_at TIMESTAMP WITH TIME ZONE,
    responded_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE vendor_clarifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view clarifications for their org" ON vendor_clarifications
    FOR SELECT USING (
        org_id = (auth.jwt() ->> 'org_id')::uuid
    );

CREATE POLICY "Users can create clarifications for their org" ON vendor_clarifications
    FOR INSERT WITH CHECK (
        org_id = (auth.jwt() ->> 'org_id')::uuid
    );

CREATE POLICY "Users can update clarifications for their org" ON vendor_clarifications
    FOR UPDATE USING (
        org_id = (auth.jwt() ->> 'org_id')::uuid
    );

CREATE POLICY "Users can delete clarifications for their org" ON vendor_clarifications
    FOR DELETE USING (
        org_id = (auth.jwt() ->> 'org_id')::uuid
    );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_vendor_clarifications_org_id ON vendor_clarifications(org_id);
CREATE INDEX IF NOT EXISTS idx_vendor_clarifications_vendor_id ON vendor_clarifications(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_clarifications_status ON vendor_clarifications(status);
CREATE INDEX IF NOT EXISTS idx_vendor_clarifications_created_at ON vendor_clarifications(created_at);
