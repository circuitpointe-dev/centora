-- Create spend analysis reports schema
-- This includes spend tracking, vendor analysis, and category breakdowns

-- Create spend categories enum
CREATE TYPE spend_category AS ENUM ('IT', 'Software', 'Office', 'Professional', 'Equipment', 'Services', 'Consulting');
CREATE TYPE spend_status AS ENUM ('approved', 'pending', 'rejected', 'cancelled');
CREATE TYPE vendor_status AS ENUM ('active', 'inactive', 'suspended', 'blacklisted');

-- Create spend_analysis_vendors table
CREATE TABLE IF NOT EXISTS public.spend_analysis_vendors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    vendor_name TEXT NOT NULL,
    vendor_code TEXT NOT NULL,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    status vendor_status NOT NULL DEFAULT 'active',
    total_spend DECIMAL(15,2) NOT NULL DEFAULT 0,
    last_transaction_date DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create spend_analysis_transactions table
CREATE TABLE IF NOT EXISTS public.spend_analysis_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES public.spend_analysis_vendors(id) ON DELETE CASCADE,
    transaction_date DATE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    category spend_category NOT NULL,
    description TEXT,
    status spend_status NOT NULL DEFAULT 'approved',
    project_id TEXT,
    department TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create spend_analysis_categories table
CREATE TABLE IF NOT EXISTS public.spend_analysis_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    category_name spend_category NOT NULL,
    budget_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    spent_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create spend_analysis_periods table
CREATE TABLE IF NOT EXISTS public.spend_analysis_periods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    period_name TEXT NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_spend DECIMAL(15,2) NOT NULL DEFAULT 0,
    previous_period_spend DECIMAL(15,2) NOT NULL DEFAULT 0,
    growth_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.spend_analysis_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spend_analysis_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spend_analysis_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spend_analysis_periods ENABLE ROW LEVEL SECURITY;

-- RLS Policies for spend_analysis_vendors
CREATE POLICY "Users can view vendors in their org" 
ON public.spend_analysis_vendors FOR SELECT 
USING (is_org_member(org_id));

CREATE POLICY "Users can create vendors in their org" 
ON public.spend_analysis_vendors FOR INSERT 
WITH CHECK (is_org_member(org_id));

CREATE POLICY "Users can update vendors in their org" 
ON public.spend_analysis_vendors FOR UPDATE 
USING (is_org_member(org_id));

-- RLS Policies for spend_analysis_transactions
CREATE POLICY "Users can view transactions in their org" 
ON public.spend_analysis_transactions FOR SELECT 
USING (is_org_member(org_id));

CREATE POLICY "Users can create transactions in their org" 
ON public.spend_analysis_transactions FOR INSERT 
WITH CHECK (is_org_member(org_id));

CREATE POLICY "Users can update transactions in their org" 
ON public.spend_analysis_transactions FOR UPDATE 
USING (is_org_member(org_id));

-- RLS Policies for spend_analysis_categories
CREATE POLICY "Users can view categories in their org" 
ON public.spend_analysis_categories FOR SELECT 
USING (is_org_member(org_id));

CREATE POLICY "Users can create categories in their org" 
ON public.spend_analysis_categories FOR INSERT 
WITH CHECK (is_org_member(org_id));

CREATE POLICY "Users can update categories in their org" 
ON public.spend_analysis_categories FOR UPDATE 
USING (is_org_member(org_id));

-- RLS Policies for spend_analysis_periods
CREATE POLICY "Users can view periods in their org" 
ON public.spend_analysis_periods FOR SELECT 
USING (is_org_member(org_id));

CREATE POLICY "Users can create periods in their org" 
ON public.spend_analysis_periods FOR INSERT 
WITH CHECK (is_org_member(org_id));

CREATE POLICY "Users can update periods in their org" 
ON public.spend_analysis_periods FOR UPDATE 
USING (is_org_member(org_id));

-- Create indexes for better performance
CREATE INDEX idx_spend_vendors_org_id ON public.spend_analysis_vendors(org_id);
CREATE INDEX idx_spend_vendors_status ON public.spend_analysis_vendors(status);
CREATE INDEX idx_spend_vendors_total_spend ON public.spend_analysis_vendors(total_spend);

CREATE INDEX idx_spend_transactions_org_id ON public.spend_analysis_transactions(org_id);
CREATE INDEX idx_spend_transactions_vendor_id ON public.spend_analysis_transactions(vendor_id);
CREATE INDEX idx_spend_transactions_date ON public.spend_analysis_transactions(transaction_date);
CREATE INDEX idx_spend_transactions_category ON public.spend_analysis_transactions(category);
CREATE INDEX idx_spend_transactions_status ON public.spend_analysis_transactions(status);

CREATE INDEX idx_spend_categories_org_id ON public.spend_analysis_categories(org_id);
CREATE INDEX idx_spend_categories_name ON public.spend_analysis_categories(category_name);
CREATE INDEX idx_spend_categories_period ON public.spend_analysis_categories(period_start, period_end);

CREATE INDEX idx_spend_periods_org_id ON public.spend_analysis_periods(org_id);
CREATE INDEX idx_spend_periods_dates ON public.spend_analysis_periods(period_start, period_end);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_spend_analysis_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_spend_vendors_updated_at
    BEFORE UPDATE ON public.spend_analysis_vendors
    FOR EACH ROW
    EXECUTE FUNCTION update_spend_analysis_updated_at_column();

CREATE TRIGGER update_spend_transactions_updated_at
    BEFORE UPDATE ON public.spend_analysis_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_spend_analysis_updated_at_column();

CREATE TRIGGER update_spend_categories_updated_at
    BEFORE UPDATE ON public.spend_analysis_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_spend_analysis_updated_at_column();

CREATE TRIGGER update_spend_periods_updated_at
    BEFORE UPDATE ON public.spend_analysis_periods
    FOR EACH ROW
    EXECUTE FUNCTION update_spend_analysis_updated_at_column();

-- Insert sample data for testing
INSERT INTO public.spend_analysis_vendors (
    org_id, vendor_name, vendor_code, contact_person, email, total_spend, last_transaction_date, status
) VALUES 
(
    (SELECT id FROM public.organizations LIMIT 1),
    'Acme corp',
    'VENDOR-001',
    'John Smith',
    'john@acme.com',
    1200000.00,
    '2025-07-15',
    'active'
),
(
    (SELECT id FROM public.organizations LIMIT 1),
    'TechSolutions Ltd',
    'VENDOR-002',
    'Sarah Johnson',
    'sarah@techsolutions.com',
    980000.00,
    '2025-07-20',
    'active'
),
(
    (SELECT id FROM public.organizations LIMIT 1),
    'Global services inc',
    'VENDOR-003',
    'Mike Wilson',
    'mike@globalservices.com',
    850000.00,
    '2025-07-10',
    'active'
),
(
    (SELECT id FROM public.organizations LIMIT 1),
    'Innovation partners',
    'VENDOR-004',
    'Lisa Brown',
    'lisa@innovation.com',
    720000.00,
    '2025-07-25',
    'active'
);

INSERT INTO public.spend_analysis_transactions (
    org_id, vendor_id, transaction_date, amount, currency, category, description, status, project_id, department
) VALUES 
(
    (SELECT id FROM public.organizations LIMIT 1),
    (SELECT id FROM public.spend_analysis_vendors WHERE vendor_code = 'VENDOR-001'),
    '2025-01-15',
    200000.00,
    'USD',
    'IT',
    'Hardware procurement',
    'approved',
    'PROJ-001',
    'IT Department'
),
(
    (SELECT id FROM public.organizations LIMIT 1),
    (SELECT id FROM public.spend_analysis_vendors WHERE vendor_code = 'VENDOR-001'),
    '2025-02-20',
    300000.00,
    'USD',
    'Software',
    'Software licenses',
    'approved',
    'PROJ-002',
    'IT Department'
),
(
    (SELECT id FROM public.organizations LIMIT 1),
    (SELECT id FROM public.spend_analysis_vendors WHERE vendor_code = 'VENDOR-002'),
    '2025-03-10',
    250000.00,
    'USD',
    'Professional',
    'Consulting services',
    'approved',
    'PROJ-003',
    'Operations'
),
(
    (SELECT id FROM public.organizations LIMIT 1),
    (SELECT id FROM public.spend_analysis_vendors WHERE vendor_code = 'VENDOR-002'),
    '2025-04-15',
    180000.00,
    'USD',
    'Office',
    'Office supplies',
    'approved',
    'PROJ-004',
    'Administration'
),
(
    (SELECT id FROM public.organizations LIMIT 1),
    (SELECT id FROM public.spend_analysis_vendors WHERE vendor_code = 'VENDOR-003'),
    '2025-05-20',
    220000.00,
    'USD',
    'IT',
    'Network equipment',
    'approved',
    'PROJ-001',
    'IT Department'
),
(
    (SELECT id FROM public.organizations LIMIT 1),
    (SELECT id FROM public.spend_analysis_vendors WHERE vendor_code = 'VENDOR-003'),
    '2025-06-25',
    150000.00,
    'USD',
    'Software',
    'Cloud services',
    'approved',
    'PROJ-002',
    'IT Department'
),
(
    (SELECT id FROM public.organizations LIMIT 1),
    (SELECT id FROM public.spend_analysis_vendors WHERE vendor_code = 'VENDOR-004'),
    '2025-07-30',
    190000.00,
    'USD',
    'Professional',
    'Training services',
    'approved',
    'PROJ-003',
    'HR Department'
);

INSERT INTO public.spend_analysis_categories (
    org_id, category_name, budget_amount, spent_amount, period_start, period_end
) VALUES 
(
    (SELECT id FROM public.organizations LIMIT 1),
    'IT',
    1000000.00,
    1050000.00,
    '2025-01-01',
    '2025-12-31'
),
(
    (SELECT id FROM public.organizations LIMIT 1),
    'Software',
    800000.00,
    780000.00,
    '2025-01-01',
    '2025-12-31'
),
(
    (SELECT id FROM public.organizations LIMIT 1),
    'Office',
    600000.00,
    580000.00,
    '2025-01-01',
    '2025-12-31'
),
(
    (SELECT id FROM public.organizations LIMIT 1),
    'Professional',
    900000.00,
    920000.00,
    '2025-01-01',
    '2025-12-31'
);

INSERT INTO public.spend_analysis_periods (
    org_id, period_name, period_start, period_end, total_spend, previous_period_spend, growth_percentage
) VALUES 
(
    (SELECT id FROM public.organizations LIMIT 1),
    'Q3 2025',
    '2025-07-01',
    '2025-09-30',
    5800000.00,
    5400000.00,
    8.00
);
