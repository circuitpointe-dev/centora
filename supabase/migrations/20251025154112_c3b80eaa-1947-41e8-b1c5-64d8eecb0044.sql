-- Create compliance_audit_logs table
CREATE TABLE IF NOT EXISTS public.compliance_audit_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    document_id UUID,
    document_type TEXT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'approve', 'reject', 'view', 'download', 'export')),
    status TEXT NOT NULL CHECK (status IN ('approved', 'pending', 'rejected', 'completed', 'failed')),
    description TEXT,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create donor_grants table
CREATE TABLE IF NOT EXISTS public.donor_grants (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    grant_number TEXT NOT NULL,
    grant_name TEXT NOT NULL,
    donor_name TEXT NOT NULL,
    donor_id UUID REFERENCES public.donors(id) ON DELETE SET NULL,
    grant_amount NUMERIC NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'USD',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'suspended', 'terminated')),
    description TEXT,
    compliance_requirements JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create donor_projects table
CREATE TABLE IF NOT EXISTS public.donor_projects (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    grant_id UUID NOT NULL REFERENCES public.donor_grants(id) ON DELETE CASCADE,
    project_name TEXT NOT NULL,
    project_code TEXT NOT NULL,
    budget_amount NUMERIC NOT NULL DEFAULT 0,
    spent_amount NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'on_hold', 'cancelled')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    project_manager TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create donor_compliance_issues table
CREATE TABLE IF NOT EXISTS public.donor_compliance_issues (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    grant_id UUID NOT NULL REFERENCES public.donor_grants(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.donor_projects(id) ON DELETE SET NULL,
    issue_type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending_review' CHECK (status IN ('compliant', 'flagged', 'pending_review', 'non_compliant')),
    responsible_officer TEXT,
    due_date DATE,
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create donor_vendor_spend table
CREATE TABLE IF NOT EXISTS public.donor_vendor_spend (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES public.donor_projects(id) ON DELETE CASCADE,
    vendor_name TEXT NOT NULL,
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
    amount_spent NUMERIC NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'USD',
    spend_date DATE NOT NULL,
    description TEXT,
    compliance_status TEXT NOT NULL DEFAULT 'compliant' CHECK (compliance_status IN ('compliant', 'flagged', 'pending_review', 'non_compliant')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create spend_analysis_vendors table
CREATE TABLE IF NOT EXISTS public.spend_analysis_vendors (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    vendor_name TEXT NOT NULL,
    vendor_code TEXT NOT NULL,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'blacklisted')),
    total_spend NUMERIC NOT NULL DEFAULT 0,
    last_transaction_date DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create spend_analysis_transactions table
CREATE TABLE IF NOT EXISTS public.spend_analysis_transactions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES public.spend_analysis_vendors(id) ON DELETE CASCADE,
    transaction_date DATE NOT NULL,
    amount NUMERIC NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'USD',
    category TEXT NOT NULL CHECK (category IN ('IT', 'Software', 'Office', 'Professional', 'Equipment', 'Services', 'Consulting')),
    description TEXT,
    status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('approved', 'pending', 'rejected', 'cancelled')),
    project_id UUID,
    department TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create spend_analysis_categories table
CREATE TABLE IF NOT EXISTS public.spend_analysis_categories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    category_name TEXT NOT NULL CHECK (category_name IN ('IT', 'Software', 'Office', 'Professional', 'Equipment', 'Services', 'Consulting')),
    budget_amount NUMERIC NOT NULL DEFAULT 0,
    spent_amount NUMERIC NOT NULL DEFAULT 0,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create spend_analysis_periods table
CREATE TABLE IF NOT EXISTS public.spend_analysis_periods (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    period_name TEXT NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_spend NUMERIC NOT NULL DEFAULT 0,
    previous_period_spend NUMERIC NOT NULL DEFAULT 0,
    growth_percentage NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.compliance_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_compliance_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_vendor_spend ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spend_analysis_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spend_analysis_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spend_analysis_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spend_analysis_periods ENABLE ROW LEVEL SECURITY;

-- RLS Policies for compliance_audit_logs
CREATE POLICY "Org members can view compliance audit logs" ON public.compliance_audit_logs FOR SELECT USING (
    org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Org members can create compliance audit logs" ON public.compliance_audit_logs FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid()) AND user_id = auth.uid()
);

-- RLS Policies for donor_grants
CREATE POLICY "Org members can view donor grants" ON public.donor_grants FOR SELECT USING (
    org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Org admins can manage donor grants" ON public.donor_grants FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND org_id = donor_grants.org_id AND (role = 'org_admin' OR is_super_admin = true))
);

-- RLS Policies for donor_projects
CREATE POLICY "Org members can view donor projects" ON public.donor_projects FOR SELECT USING (
    org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Org admins can manage donor projects" ON public.donor_projects FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND org_id = donor_projects.org_id AND (role = 'org_admin' OR is_super_admin = true))
);

-- RLS Policies for donor_compliance_issues
CREATE POLICY "Org members can view compliance issues" ON public.donor_compliance_issues FOR SELECT USING (
    org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Org admins can manage compliance issues" ON public.donor_compliance_issues FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND org_id = donor_compliance_issues.org_id AND (role = 'org_admin' OR is_super_admin = true))
);

-- RLS Policies for donor_vendor_spend
CREATE POLICY "Org members can view vendor spend" ON public.donor_vendor_spend FOR SELECT USING (
    org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Org admins can manage vendor spend" ON public.donor_vendor_spend FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND org_id = donor_vendor_spend.org_id AND (role = 'org_admin' OR is_super_admin = true))
);

-- RLS Policies for spend_analysis_vendors
CREATE POLICY "Org members can view spend vendors" ON public.spend_analysis_vendors FOR SELECT USING (
    org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Org admins can manage spend vendors" ON public.spend_analysis_vendors FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND org_id = spend_analysis_vendors.org_id AND (role = 'org_admin' OR is_super_admin = true))
);

-- RLS Policies for spend_analysis_transactions
CREATE POLICY "Org members can view spend transactions" ON public.spend_analysis_transactions FOR SELECT USING (
    org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Org admins can manage spend transactions" ON public.spend_analysis_transactions FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND org_id = spend_analysis_transactions.org_id AND (role = 'org_admin' OR is_super_admin = true))
);

-- RLS Policies for spend_analysis_categories
CREATE POLICY "Org members can view spend categories" ON public.spend_analysis_categories FOR SELECT USING (
    org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Org admins can manage spend categories" ON public.spend_analysis_categories FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND org_id = spend_analysis_categories.org_id AND (role = 'org_admin' OR is_super_admin = true))
);

-- RLS Policies for spend_analysis_periods
CREATE POLICY "Org members can view spend periods" ON public.spend_analysis_periods FOR SELECT USING (
    org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Org admins can manage spend periods" ON public.spend_analysis_periods FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND org_id = spend_analysis_periods.org_id AND (role = 'org_admin' OR is_super_admin = true))
);

-- Create indexes for better performance
CREATE INDEX idx_compliance_audit_logs_org_id ON public.compliance_audit_logs(org_id);
CREATE INDEX idx_compliance_audit_logs_user_id ON public.compliance_audit_logs(user_id);
CREATE INDEX idx_compliance_audit_logs_created_at ON public.compliance_audit_logs(created_at DESC);

CREATE INDEX idx_donor_grants_org_id ON public.donor_grants(org_id);
CREATE INDEX idx_donor_grants_donor_id ON public.donor_grants(donor_id);

CREATE INDEX idx_donor_projects_org_id ON public.donor_projects(org_id);
CREATE INDEX idx_donor_projects_grant_id ON public.donor_projects(grant_id);

CREATE INDEX idx_donor_compliance_issues_org_id ON public.donor_compliance_issues(org_id);
CREATE INDEX idx_donor_compliance_issues_grant_id ON public.donor_compliance_issues(grant_id);

CREATE INDEX idx_donor_vendor_spend_org_id ON public.donor_vendor_spend(org_id);
CREATE INDEX idx_donor_vendor_spend_project_id ON public.donor_vendor_spend(project_id);

CREATE INDEX idx_spend_analysis_vendors_org_id ON public.spend_analysis_vendors(org_id);
CREATE INDEX idx_spend_analysis_transactions_org_id ON public.spend_analysis_transactions(org_id);
CREATE INDEX idx_spend_analysis_transactions_vendor_id ON public.spend_analysis_transactions(vendor_id);
CREATE INDEX idx_spend_analysis_categories_org_id ON public.spend_analysis_categories(org_id);
CREATE INDEX idx_spend_analysis_periods_org_id ON public.spend_analysis_periods(org_id);

-- Create updated_at triggers
CREATE TRIGGER update_compliance_audit_logs_updated_at BEFORE UPDATE ON public.compliance_audit_logs
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_donor_grants_updated_at BEFORE UPDATE ON public.donor_grants
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_donor_projects_updated_at BEFORE UPDATE ON public.donor_projects
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_donor_compliance_issues_updated_at BEFORE UPDATE ON public.donor_compliance_issues
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_donor_vendor_spend_updated_at BEFORE UPDATE ON public.donor_vendor_spend
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_spend_analysis_vendors_updated_at BEFORE UPDATE ON public.spend_analysis_vendors
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_spend_analysis_transactions_updated_at BEFORE UPDATE ON public.spend_analysis_transactions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_spend_analysis_categories_updated_at BEFORE UPDATE ON public.spend_analysis_categories
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_spend_analysis_periods_updated_at BEFORE UPDATE ON public.spend_analysis_periods
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();