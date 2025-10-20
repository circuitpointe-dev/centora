-- Vendor vetting data tables

-- Company information table
CREATE TABLE IF NOT EXISTS public.vendor_company_info (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id uuid NOT NULL,
    vendor_id uuid NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
    company_name text,
    registration_number text,
    address text,
    country text,
    contact_person text,
    email text,
    phone_number text,
    is_complete boolean DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Banking & tax information table
CREATE TABLE IF NOT EXISTS public.vendor_banking_info (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id uuid NOT NULL,
    vendor_id uuid NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
    bank_name text,
    account_holder text,
    account_number text,
    tax_id text,
    is_complete boolean DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Certificate & documents table
CREATE TABLE IF NOT EXISTS public.vendor_certificates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id uuid NOT NULL,
    vendor_id uuid NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
    certificate_type text NOT NULL, -- 'tax_compliance', 'business_license', 'insurance'
    certificate_name text NOT NULL,
    file_url text,
    valid_until date,
    status text DEFAULT 'valid', -- 'valid', 'expired', 'pending'
    is_complete boolean DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vendor_company_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_banking_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_certificates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vendor_company_info
CREATE POLICY "Organizations can view their vendor company info." ON public.vendor_company_info
    FOR SELECT USING (auth.jwt() ->> 'org_id')::uuid = org_id;

CREATE POLICY "Organization members can insert vendor company info." ON public.vendor_company_info
    FOR INSERT WITH CHECK (auth.jwt() ->> 'org_id')::uuid = org_id;

CREATE POLICY "Organization members can update their vendor company info." ON public.vendor_company_info
    FOR UPDATE USING (auth.jwt() ->> 'org_id')::uuid = org_id WITH CHECK (auth.jwt() ->> 'org_id')::uuid = org_id;

CREATE POLICY "Organization members can delete their vendor company info." ON public.vendor_company_info
    FOR DELETE USING (auth.jwt() ->> 'org_id')::uuid = org_id;

-- RLS Policies for vendor_banking_info
CREATE POLICY "Organizations can view their vendor banking info." ON public.vendor_banking_info
    FOR SELECT USING (auth.jwt() ->> 'org_id')::uuid = org_id;

CREATE POLICY "Organization members can insert vendor banking info." ON public.vendor_banking_info
    FOR INSERT WITH CHECK (auth.jwt() ->> 'org_id')::uuid = org_id;

CREATE POLICY "Organization members can update their vendor banking info." ON public.vendor_banking_info
    FOR UPDATE USING (auth.jwt() ->> 'org_id')::uuid = org_id WITH CHECK (auth.jwt() ->> 'org_id')::uuid = org_id;

CREATE POLICY "Organization members can delete their vendor banking info." ON public.vendor_banking_info
    FOR DELETE USING (auth.jwt() ->> 'org_id')::uuid = org_id;

-- RLS Policies for vendor_certificates
CREATE POLICY "Organizations can view their vendor certificates." ON public.vendor_certificates
    FOR SELECT USING (auth.jwt() ->> 'org_id')::uuid = org_id;

CREATE POLICY "Organization members can insert vendor certificates." ON public.vendor_certificates
    FOR INSERT WITH CHECK (auth.jwt() ->> 'org_id')::uuid = org_id;

CREATE POLICY "Organization members can update their vendor certificates." ON public.vendor_certificates
    FOR UPDATE USING (auth.jwt() ->> 'org_id')::uuid = org_id WITH CHECK (auth.jwt() ->> 'org_id')::uuid = org_id;

CREATE POLICY "Organization members can delete their vendor certificates." ON public.vendor_certificates
    FOR DELETE USING (auth.jwt() ->> 'org_id')::uuid = org_id;
