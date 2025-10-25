-- Create compliance and audit trial report schema
-- This includes audit logs, compliance tracking, and report generation

-- Create audit action types enum
CREATE TYPE audit_action AS ENUM ('create', 'update', 'delete', 'approve', 'reject', 'view', 'download', 'export');
CREATE TYPE audit_status AS ENUM ('approved', 'pending', 'rejected', 'completed', 'failed');
CREATE TYPE compliance_status AS ENUM ('compliant', 'non_compliant', 'pending_review', 'requires_action');

-- Create compliance_audit_logs table
CREATE TABLE IF NOT EXISTS public.compliance_audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    user_name TEXT NOT NULL,
    document_id TEXT NOT NULL,
    document_type TEXT NOT NULL,
    action audit_action NOT NULL,
    status audit_status NOT NULL DEFAULT 'pending',
    description TEXT,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create compliance_reports table
CREATE TABLE IF NOT EXISTS public.compliance_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    report_type TEXT NOT NULL CHECK (report_type IN ('compliance_summary', 'audit_trail', 'violation_report', 'approval_workflow')),
    title TEXT NOT NULL,
    description TEXT,
    parameters JSONB DEFAULT '{}',
    status compliance_status NOT NULL DEFAULT 'pending_review',
    generated_by UUID NOT NULL REFERENCES public.profiles(id),
    generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    reviewed_by UUID REFERENCES public.profiles(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    file_path TEXT,
    file_size BIGINT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create compliance_violations table
CREATE TABLE IF NOT EXISTS public.compliance_violations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    violation_type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    description TEXT NOT NULL,
    document_id TEXT,
    user_id UUID REFERENCES public.profiles(id),
    status compliance_status NOT NULL DEFAULT 'pending_review',
    resolution_notes TEXT,
    resolved_by UUID REFERENCES public.profiles(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.compliance_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_violations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for compliance_audit_logs
CREATE POLICY "Users can view audit logs in their org" 
ON public.compliance_audit_logs FOR SELECT 
USING (is_org_member(org_id));

CREATE POLICY "Users can create audit logs in their org" 
ON public.compliance_audit_logs FOR INSERT 
WITH CHECK (is_org_member(org_id) AND user_id = auth.uid());

-- RLS Policies for compliance_reports
CREATE POLICY "Users can view compliance reports in their org" 
ON public.compliance_reports FOR SELECT 
USING (is_org_member(org_id));

CREATE POLICY "Users can create compliance reports in their org" 
ON public.compliance_reports FOR INSERT 
WITH CHECK (is_org_member(org_id) AND generated_by = auth.uid());

CREATE POLICY "Users can update compliance reports in their org" 
ON public.compliance_reports FOR UPDATE 
USING (is_org_member(org_id));

-- RLS Policies for compliance_violations
CREATE POLICY "Users can view violations in their org" 
ON public.compliance_violations FOR SELECT 
USING (is_org_member(org_id));

CREATE POLICY "Users can create violations in their org" 
ON public.compliance_violations FOR INSERT 
WITH CHECK (is_org_member(org_id));

CREATE POLICY "Users can update violations in their org" 
ON public.compliance_violations FOR UPDATE 
USING (is_org_member(org_id));

-- Create indexes for better performance
CREATE INDEX idx_compliance_audit_logs_org_id ON public.compliance_audit_logs(org_id);
CREATE INDEX idx_compliance_audit_logs_user_id ON public.compliance_audit_logs(user_id);
CREATE INDEX idx_compliance_audit_logs_document_id ON public.compliance_audit_logs(document_id);
CREATE INDEX idx_compliance_audit_logs_action ON public.compliance_audit_logs(action);
CREATE INDEX idx_compliance_audit_logs_status ON public.compliance_audit_logs(status);
CREATE INDEX idx_compliance_audit_logs_created_at ON public.compliance_audit_logs(created_at);

CREATE INDEX idx_compliance_reports_org_id ON public.compliance_reports(org_id);
CREATE INDEX idx_compliance_reports_type ON public.compliance_reports(report_type);
CREATE INDEX idx_compliance_reports_status ON public.compliance_reports(status);

CREATE INDEX idx_compliance_violations_org_id ON public.compliance_violations(org_id);
CREATE INDEX idx_compliance_violations_severity ON public.compliance_violations(severity);
CREATE INDEX idx_compliance_violations_status ON public.compliance_violations(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_compliance_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_compliance_audit_logs_updated_at
    BEFORE UPDATE ON public.compliance_audit_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_compliance_updated_at_column();

CREATE TRIGGER update_compliance_reports_updated_at
    BEFORE UPDATE ON public.compliance_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_compliance_updated_at_column();

CREATE TRIGGER update_compliance_violations_updated_at
    BEFORE UPDATE ON public.compliance_violations
    FOR EACH ROW
    EXECUTE FUNCTION update_compliance_updated_at_column();

-- Insert sample data for testing
INSERT INTO public.compliance_audit_logs (
    org_id, user_id, user_name, document_id, document_type, action, status, description, ip_address, user_agent
) VALUES 
(
    (SELECT id FROM public.organizations LIMIT 1),
    (SELECT id FROM public.profiles LIMIT 1),
    'Marcus lee',
    'PO-1021',
    'Purchase order',
    'approve',
    'approved',
    'Purchase order approved by Marcus lee',
    '192.168.1.100',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
),
(
    (SELECT id FROM public.organizations LIMIT 1),
    (SELECT id FROM public.profiles LIMIT 1),
    'Marcus lee',
    'PO-1021',
    'Purchase order',
    'approve',
    'approved',
    'Purchase order approved by Marcus lee',
    '192.168.1.100',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
),
(
    (SELECT id FROM public.organizations LIMIT 1),
    (SELECT id FROM public.profiles LIMIT 1),
    'Marcus lee',
    'PO-1021',
    'Purchase order',
    'approve',
    'approved',
    'Purchase order approved by Marcus lee',
    '192.168.1.100',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
),
(
    (SELECT id FROM public.organizations LIMIT 1),
    (SELECT id FROM public.profiles LIMIT 1),
    'Marcus lee',
    'PO-1021',
    'Purchase order',
    'approve',
    'approved',
    'Purchase order approved by Marcus lee',
    '192.168.1.100',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
),
(
    (SELECT id FROM public.organizations LIMIT 1),
    (SELECT id FROM public.profiles LIMIT 1),
    'Marcus lee',
    'PO-1021',
    'Purchase order',
    'approve',
    'approved',
    'Purchase order approved by Marcus lee',
    '192.168.1.100',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
),
(
    (SELECT id FROM public.organizations LIMIT 1),
    (SELECT id FROM public.profiles LIMIT 1),
    'Marcus lee',
    'PO-1021',
    'Purchase order',
    'approve',
    'approved',
    'Purchase order approved by Marcus lee',
    '192.168.1.100',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
),
(
    (SELECT id FROM public.organizations LIMIT 1),
    (SELECT id FROM public.profiles LIMIT 1),
    'Marcus lee',
    'PO-1021',
    'Purchase order',
    'approve',
    'pending',
    'Purchase order pending approval by Marcus lee',
    '192.168.1.100',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
),
(
    (SELECT id FROM public.organizations LIMIT 1),
    (SELECT id FROM public.profiles LIMIT 1),
    'Marcus lee',
    'PO-1021',
    'Purchase order',
    'reject',
    'rejected',
    'Purchase order rejected by Marcus lee',
    '192.168.1.100',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
)
ON CONFLICT (id) DO NOTHING;
