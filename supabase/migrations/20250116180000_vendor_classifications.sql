-- Vendor classifications data tables

-- Risk assessment table
CREATE TABLE IF NOT EXISTS public.vendor_risk_assessments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id uuid NOT NULL,
    vendor_id uuid NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
    risk_level text NOT NULL, -- 'Low', 'Medium', 'High', 'Critical'
    risk_score numeric NOT NULL DEFAULT 0, -- 0-100
    assessment_date date NOT NULL DEFAULT CURRENT_DATE,
    assessed_by text,
    risk_factors text[], -- Array of risk factors
    mitigation_plan text,
    next_review_date date,
    is_active boolean DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Performance metrics table
CREATE TABLE IF NOT EXISTS public.vendor_performance_metrics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id uuid NOT NULL,
    vendor_id uuid NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
    performance_score numeric NOT NULL DEFAULT 0, -- 0-100
    quality_score numeric DEFAULT 0,
    delivery_score numeric DEFAULT 0,
    cost_score numeric DEFAULT 0,
    communication_score numeric DEFAULT 0,
    assessment_period_start date NOT NULL,
    assessment_period_end date NOT NULL,
    assessed_by text,
    notes text,
    is_active boolean DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Vendor categories table
CREATE TABLE IF NOT EXISTS public.vendor_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id uuid NOT NULL,
    vendor_id uuid NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
    category_type text NOT NULL, -- 'Primary', 'Secondary', 'Preferred', 'Blacklisted'
    category_name text NOT NULL,
    subcategory text,
    assigned_date date NOT NULL DEFAULT CURRENT_DATE,
    assigned_by text,
    reason text,
    is_active boolean DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Compliance status table
CREATE TABLE IF NOT EXISTS public.vendor_compliance_status (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id uuid NOT NULL,
    vendor_id uuid NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
    compliance_type text NOT NULL, -- 'ISO', 'Environmental', 'Safety', 'Legal', 'Financial'
    compliance_status text NOT NULL, -- 'Compliant', 'Non-Compliant', 'Pending', 'Expired'
    certificate_number text,
    issued_date date,
    expiry_date date,
    issuing_authority text,
    document_url text,
    notes text,
    is_active boolean DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vendor_risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_compliance_status ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vendor_risk_assessments
CREATE POLICY "Organizations can view their vendor risk assessments." ON public.vendor_risk_assessments
    FOR SELECT USING (auth.jwt() ->> 'org_id')::uuid = org_id;

CREATE POLICY "Organization members can insert vendor risk assessments." ON public.vendor_risk_assessments
    FOR INSERT WITH CHECK (auth.jwt() ->> 'org_id')::uuid = org_id;

CREATE POLICY "Organization members can update their vendor risk assessments." ON public.vendor_risk_assessments
    FOR UPDATE USING (auth.jwt() ->> 'org_id')::uuid = org_id WITH CHECK (auth.jwt() ->> 'org_id')::uuid = org_id;

CREATE POLICY "Organization members can delete their vendor risk assessments." ON public.vendor_risk_assessments
    FOR DELETE USING (auth.jwt() ->> 'org_id')::uuid = org_id;

-- RLS Policies for vendor_performance_metrics
CREATE POLICY "Organizations can view their vendor performance metrics." ON public.vendor_performance_metrics
    FOR SELECT USING (auth.jwt() ->> 'org_id')::uuid = org_id;

CREATE POLICY "Organization members can insert vendor performance metrics." ON public.vendor_performance_metrics
    FOR INSERT WITH CHECK (auth.jwt() ->> 'org_id')::uuid = org_id;

CREATE POLICY "Organization members can update their vendor performance metrics." ON public.vendor_performance_metrics
    FOR UPDATE USING (auth.jwt() ->> 'org_id')::uuid = org_id WITH CHECK (auth.jwt() ->> 'org_id')::uuid = org_id;

CREATE POLICY "Organization members can delete their vendor performance metrics." ON public.vendor_performance_metrics
    FOR DELETE USING (auth.jwt() ->> 'org_id')::uuid = org_id;

-- RLS Policies for vendor_categories
CREATE POLICY "Organizations can view their vendor categories." ON public.vendor_categories
    FOR SELECT USING (auth.jwt() ->> 'org_id')::uuid = org_id;

CREATE POLICY "Organization members can insert vendor categories." ON public.vendor_categories
    FOR INSERT WITH CHECK (auth.jwt() ->> 'org_id')::uuid = org_id;

CREATE POLICY "Organization members can update their vendor categories." ON public.vendor_categories
    FOR UPDATE USING (auth.jwt() ->> 'org_id')::uuid = org_id WITH CHECK (auth.jwt() ->> 'org_id')::uuid = org_id;

CREATE POLICY "Organization members can delete their vendor categories." ON public.vendor_categories
    FOR DELETE USING (auth.jwt() ->> 'org_id')::uuid = org_id;

-- RLS Policies for vendor_compliance_status
CREATE POLICY "Organizations can view their vendor compliance status." ON public.vendor_compliance_status
    FOR SELECT USING (auth.jwt() ->> 'org_id')::uuid = org_id;

CREATE POLICY "Organization members can insert vendor compliance status." ON public.vendor_compliance_status
    FOR INSERT WITH CHECK (auth.jwt() ->> 'org_id')::uuid = org_id;

CREATE POLICY "Organization members can update their vendor compliance status." ON public.vendor_compliance_status
    FOR UPDATE USING (auth.jwt() ->> 'org_id')::uuid = org_id WITH CHECK (auth.jwt() ->> 'org_id')::uuid = org_id;

CREATE POLICY "Organization members can delete their vendor compliance status." ON public.vendor_compliance_status
    FOR DELETE USING (auth.jwt() ->> 'org_id')::uuid = org_id;
