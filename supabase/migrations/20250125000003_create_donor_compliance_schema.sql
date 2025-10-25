-- Create donor compliance reports schema
-- This includes grants, projects, compliance tracking, and vendor spend data

-- Create grant status types
CREATE TYPE grant_status AS ENUM ('active', 'completed', 'suspended', 'terminated');
CREATE TYPE compliance_status AS ENUM ('compliant', 'flagged', 'pending_review', 'non_compliant');
CREATE TYPE project_status AS ENUM ('active', 'completed', 'on_hold', 'cancelled');

-- Create donor_grants table
CREATE TABLE IF NOT EXISTS public.donor_grants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    grant_number TEXT NOT NULL,
    grant_name TEXT NOT NULL,
    donor_name TEXT NOT NULL,
    donor_id TEXT,
    grant_amount DECIMAL(15,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status grant_status NOT NULL DEFAULT 'active',
    description TEXT,
    compliance_requirements JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create donor_projects table
CREATE TABLE IF NOT EXISTS public.donor_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    grant_id UUID NOT NULL REFERENCES public.donor_grants(id) ON DELETE CASCADE,
    project_name TEXT NOT NULL,
    project_code TEXT NOT NULL,
    budget_amount DECIMAL(15,2) NOT NULL,
    spent_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    status project_status NOT NULL DEFAULT 'active',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    project_manager TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create donor_compliance_issues table
CREATE TABLE IF NOT EXISTS public.donor_compliance_issues (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    grant_id UUID NOT NULL REFERENCES public.donor_grants(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.donor_projects(id) ON DELETE CASCADE,
    issue_type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    description TEXT NOT NULL,
    status compliance_status NOT NULL DEFAULT 'pending_review',
    responsible_officer TEXT,
    due_date DATE,
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create donor_vendor_spend table
CREATE TABLE IF NOT EXISTS public.donor_vendor_spend (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES public.donor_projects(id) ON DELETE CASCADE,
    vendor_name TEXT NOT NULL,
    vendor_id TEXT,
    amount_spent DECIMAL(15,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    spend_date DATE NOT NULL,
    description TEXT,
    compliance_status compliance_status NOT NULL DEFAULT 'compliant',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create donor_compliance_notes table
CREATE TABLE IF NOT EXISTS public.donor_compliance_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    grant_id UUID NOT NULL REFERENCES public.donor_grants(id) ON DELETE CASCADE,
    document_id TEXT NOT NULL,
    compliance_date DATE NOT NULL,
    audit_status TEXT NOT NULL,
    responsible_officer TEXT NOT NULL,
    notes TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.donor_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_compliance_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_vendor_spend ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_compliance_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for donor_grants
CREATE POLICY "Users can view grants in their org" 
ON public.donor_grants FOR SELECT 
USING (is_org_member(org_id));

CREATE POLICY "Users can create grants in their org" 
ON public.donor_grants FOR INSERT 
WITH CHECK (is_org_member(org_id));

CREATE POLICY "Users can update grants in their org" 
ON public.donor_grants FOR UPDATE 
USING (is_org_member(org_id));

-- RLS Policies for donor_projects
CREATE POLICY "Users can view projects in their org" 
ON public.donor_projects FOR SELECT 
USING (is_org_member(org_id));

CREATE POLICY "Users can create projects in their org" 
ON public.donor_projects FOR INSERT 
WITH CHECK (is_org_member(org_id));

CREATE POLICY "Users can update projects in their org" 
ON public.donor_projects FOR UPDATE 
USING (is_org_member(org_id));

-- RLS Policies for donor_compliance_issues
CREATE POLICY "Users can view compliance issues in their org" 
ON public.donor_compliance_issues FOR SELECT 
USING (is_org_member(org_id));

CREATE POLICY "Users can create compliance issues in their org" 
ON public.donor_compliance_issues FOR INSERT 
WITH CHECK (is_org_member(org_id));

CREATE POLICY "Users can update compliance issues in their org" 
ON public.donor_compliance_issues FOR UPDATE 
USING (is_org_member(org_id));

-- RLS Policies for donor_vendor_spend
CREATE POLICY "Users can view vendor spend in their org" 
ON public.donor_vendor_spend FOR SELECT 
USING (is_org_member(org_id));

CREATE POLICY "Users can create vendor spend in their org" 
ON public.donor_vendor_spend FOR INSERT 
WITH CHECK (is_org_member(org_id));

CREATE POLICY "Users can update vendor spend in their org" 
ON public.donor_vendor_spend FOR UPDATE 
USING (is_org_member(org_id));

-- RLS Policies for donor_compliance_notes
CREATE POLICY "Users can view compliance notes in their org" 
ON public.donor_compliance_notes FOR SELECT 
USING (is_org_member(org_id));

CREATE POLICY "Users can create compliance notes in their org" 
ON public.donor_compliance_notes FOR INSERT 
WITH CHECK (is_org_member(org_id));

CREATE POLICY "Users can update compliance notes in their org" 
ON public.donor_compliance_notes FOR UPDATE 
USING (is_org_member(org_id));

-- Create indexes for better performance
CREATE INDEX idx_donor_grants_org_id ON public.donor_grants(org_id);
CREATE INDEX idx_donor_grants_status ON public.donor_grants(status);
CREATE INDEX idx_donor_grants_donor_name ON public.donor_grants(donor_name);

CREATE INDEX idx_donor_projects_org_id ON public.donor_projects(org_id);
CREATE INDEX idx_donor_projects_grant_id ON public.donor_projects(grant_id);
CREATE INDEX idx_donor_projects_status ON public.donor_projects(status);

CREATE INDEX idx_donor_compliance_issues_org_id ON public.donor_compliance_issues(org_id);
CREATE INDEX idx_donor_compliance_issues_grant_id ON public.donor_compliance_issues(grant_id);
CREATE INDEX idx_donor_compliance_issues_status ON public.donor_compliance_issues(status);

CREATE INDEX idx_donor_vendor_spend_org_id ON public.donor_vendor_spend(org_id);
CREATE INDEX idx_donor_vendor_spend_project_id ON public.donor_vendor_spend(project_id);
CREATE INDEX idx_donor_vendor_spend_vendor_name ON public.donor_vendor_spend(vendor_name);

CREATE INDEX idx_donor_compliance_notes_org_id ON public.donor_compliance_notes(org_id);
CREATE INDEX idx_donor_compliance_notes_grant_id ON public.donor_compliance_notes(grant_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_donor_compliance_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_donor_grants_updated_at
    BEFORE UPDATE ON public.donor_grants
    FOR EACH ROW
    EXECUTE FUNCTION update_donor_compliance_updated_at_column();

CREATE TRIGGER update_donor_projects_updated_at
    BEFORE UPDATE ON public.donor_projects
    FOR EACH ROW
    EXECUTE FUNCTION update_donor_compliance_updated_at_column();

CREATE TRIGGER update_donor_compliance_issues_updated_at
    BEFORE UPDATE ON public.donor_compliance_issues
    FOR EACH ROW
    EXECUTE FUNCTION update_donor_compliance_updated_at_column();

CREATE TRIGGER update_donor_vendor_spend_updated_at
    BEFORE UPDATE ON public.donor_vendor_spend
    FOR EACH ROW
    EXECUTE FUNCTION update_donor_compliance_updated_at_column();

CREATE TRIGGER update_donor_compliance_notes_updated_at
    BEFORE UPDATE ON public.donor_compliance_notes
    FOR EACH ROW
    EXECUTE FUNCTION update_donor_compliance_updated_at_column();

-- Insert sample data for testing
INSERT INTO public.donor_grants (
    org_id, grant_number, grant_name, donor_name, donor_id, grant_amount, currency, start_date, end_date, status, description
) VALUES 
(
    (SELECT id FROM public.organizations LIMIT 1),
    'GRANT-2025-001',
    'Education Initiative Grant',
    'Global Education Foundation',
    'GEF-001',
    5000000.00,
    'USD',
    '2025-01-01',
    '2025-12-31',
    'active',
    'Comprehensive education program for underserved communities'
),
(
    (SELECT id FROM public.organizations LIMIT 1),
    'GRANT-2025-002',
    'Healthcare Access Program',
    'World Health Organization',
    'WHO-001',
    3000000.00,
    'USD',
    '2025-02-01',
    '2025-11-30',
    'active',
    'Healthcare access improvement program'
);

INSERT INTO public.donor_projects (
    org_id, grant_id, project_name, project_code, budget_amount, spent_amount, status, start_date, end_date, project_manager
) VALUES 
(
    (SELECT id FROM public.organizations LIMIT 1),
    (SELECT id FROM public.donor_grants WHERE grant_number = 'GRANT-2025-001'),
    'Project 1',
    'PROJ-001',
    2000000.00,
    1200000.00,
    'active',
    '2025-01-01',
    '2025-06-30',
    'John Smith'
),
(
    (SELECT id FROM public.organizations LIMIT 1),
    (SELECT id FROM public.donor_grants WHERE grant_number = 'GRANT-2025-001'),
    'Project 2',
    'PROJ-002',
    1500000.00,
    950000.00,
    'active',
    '2025-02-01',
    '2025-07-31',
    'Sarah Johnson'
),
(
    (SELECT id FROM public.organizations LIMIT 1),
    (SELECT id FROM public.donor_grants WHERE grant_number = 'GRANT-2025-002'),
    'Project 3',
    'PROJ-003',
    1800000.00,
    2500000.00,
    'active',
    '2025-03-01',
    '2025-08-31',
    'Mike Wilson'
),
(
    (SELECT id FROM public.organizations LIMIT 1),
    (SELECT id FROM public.donor_grants WHERE grant_number = 'GRANT-2025-002'),
    'Project 4',
    'PROJ-004',
    1200000.00,
    800000.00,
    'active',
    '2025-04-01',
    '2025-09-30',
    'Lisa Brown'
);

INSERT INTO public.donor_compliance_issues (
    org_id, grant_id, project_id, issue_type, severity, description, status, responsible_officer, due_date
) VALUES 
(
    (SELECT id FROM public.organizations LIMIT 1),
    (SELECT id FROM public.donor_grants WHERE grant_number = 'GRANT-2025-001'),
    (SELECT id FROM public.donor_projects WHERE project_code = 'PROJ-001'),
    'Budget Variance',
    'medium',
    'Project spending exceeds budget allocation',
    'flagged',
    'Alex Smith',
    '2025-12-31'
),
(
    (SELECT id FROM public.organizations LIMIT 1),
    (SELECT id FROM public.donor_grants WHERE grant_number = 'GRANT-2025-002'),
    (SELECT id FROM public.donor_projects WHERE project_code = 'PROJ-003'),
    'Documentation Gap',
    'high',
    'Missing compliance documentation for vendor payments',
    'flagged',
    'Alex Smith',
    '2025-11-30'
);

INSERT INTO public.donor_vendor_spend (
    org_id, project_id, vendor_name, vendor_id, amount_spent, currency, spend_date, description, compliance_status
) VALUES 
(
    (SELECT id FROM public.organizations LIMIT 1),
    (SELECT id FROM public.donor_projects WHERE project_code = 'PROJ-001'),
    'Acme corp',
    'VENDOR-001',
    1280000.00,
    'USD',
    '2025-07-15',
    'Equipment and supplies',
    'compliant'
),
(
    (SELECT id FROM public.organizations LIMIT 1),
    (SELECT id FROM public.donor_projects WHERE project_code = 'PROJ-002'),
    'Beta LLC',
    'VENDOR-002',
    950000.00,
    'USD',
    '2025-08-20',
    'Training and development',
    'flagged'
),
(
    (SELECT id FROM public.organizations LIMIT 1),
    (SELECT id FROM public.donor_projects WHERE project_code = 'PROJ-003'),
    'Gamma Inc',
    'VENDOR-003',
    2500000.00,
    'USD',
    '2025-09-10',
    'Technology infrastructure',
    'compliant'
);

INSERT INTO public.donor_compliance_notes (
    org_id, grant_id, document_id, compliance_date, audit_status, responsible_officer, notes
) VALUES 
(
    (SELECT id FROM public.organizations LIMIT 1),
    (SELECT id FROM public.donor_grants WHERE grant_number = 'GRANT-2025-001'),
    '98765-43210',
    '2023-11-15',
    'Pending',
    'Alex Smith',
    'Review In Progress, Minor Issues Identified'
);
