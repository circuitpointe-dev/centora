-- HR Management Schema
-- Tables for headcount, recruitment, performance, training, etc.

-- Employees/Staff Table (main headcount tracking)
CREATE TABLE IF NOT EXISTS public.hr_employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  employee_id TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  department TEXT,
  position TEXT,
  employment_type TEXT CHECK (employment_type IN ('full-time', 'part-time', 'contract', 'intern', 'volunteer')),
  hire_date DATE NOT NULL,
  termination_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'terminated', 'on_leave')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, employee_id)
);

-- Headcount History (for trend tracking)
CREATE TABLE IF NOT EXISTS public.hr_headcount_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  total_headcount INTEGER NOT NULL,
  new_hires INTEGER DEFAULT 0,
  terminations INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, record_date)
);

-- Recruitment/Job Postings
CREATE TABLE IF NOT EXISTS public.hr_job_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  position_title TEXT NOT NULL,
  department TEXT,
  employment_type TEXT CHECK (employment_type IN ('full-time', 'part-time', 'contract', 'intern')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'filled', 'cancelled')),
  posted_date DATE DEFAULT CURRENT_DATE,
  closing_date DATE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job Applications/Recruitment Funnel
CREATE TABLE IF NOT EXISTS public.hr_job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  job_posting_id UUID REFERENCES public.hr_job_postings(id) ON DELETE CASCADE,
  candidate_name TEXT NOT NULL,
  candidate_email TEXT NOT NULL,
  candidate_phone TEXT,
  stage TEXT DEFAULT 'applied' CHECK (stage IN ('applied', 'screen', 'interview', 'offer', 'hired', 'rejected')),
  resume_url TEXT,
  cover_letter TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'withdrawn', 'rejected', 'hired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leave Requests
CREATE TABLE IF NOT EXISTS public.hr_leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES public.hr_employees(id) ON DELETE CASCADE,
  leave_type TEXT NOT NULL CHECK (leave_type IN ('annual', 'sick', 'maternity', 'paternity', 'unpaid', 'other')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days_requested INTEGER NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Offers (Job Offers)
CREATE TABLE IF NOT EXISTS public.hr_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  application_id UUID REFERENCES public.hr_job_applications(id) ON DELETE CASCADE,
  position_title TEXT NOT NULL,
  department TEXT,
  salary_amount DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  start_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  offer_date DATE DEFAULT CURRENT_DATE,
  expiry_date DATE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance Reviews/Appraisals
CREATE TABLE IF NOT EXISTS public.hr_performance_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES public.hr_employees(id) ON DELETE CASCADE,
  review_period_start DATE NOT NULL,
  review_period_end DATE NOT NULL,
  review_type TEXT CHECK (review_type IN ('annual', 'quarterly', 'mid-year', 'probation')),
  overall_rating TEXT CHECK (overall_rating IN ('exceeds', 'meets', 'below', 'needs_improvement')),
  reviewer_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Training/Learning Records
CREATE TABLE IF NOT EXISTS public.hr_training_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES public.hr_employees(id) ON DELETE CASCADE,
  training_name TEXT NOT NULL,
  training_type TEXT,
  provider TEXT,
  start_date DATE,
  end_date DATE,
  completion_status TEXT DEFAULT 'pending' CHECK (completion_status IN ('pending', 'in_progress', 'completed', 'not_completed')),
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  certificate_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Employee Documents (for expiring docs tracking)
CREATE TABLE IF NOT EXISTS public.hr_employee_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES public.hr_employees(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('license', 'certification', 'contract', 'visa', 'other')),
  document_name TEXT NOT NULL,
  document_number TEXT,
  issue_date DATE,
  expiry_date DATE,
  document_url TEXT,
  is_expiring_soon BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attrition Tracking
CREATE TABLE IF NOT EXISTS public.hr_attrition (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES public.hr_employees(id) ON DELETE SET NULL,
  exit_date DATE NOT NULL,
  exit_reason TEXT CHECK (exit_reason IN ('voluntary', 'involuntary', 'retirement', 'other')),
  exit_type TEXT,
  department TEXT,
  position TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_hr_employees_org_id ON public.hr_employees(org_id);
CREATE INDEX IF NOT EXISTS idx_hr_employees_status ON public.hr_employees(status);
CREATE INDEX IF NOT EXISTS idx_hr_headcount_history_org_date ON public.hr_headcount_history(org_id, record_date);
CREATE INDEX IF NOT EXISTS idx_hr_job_applications_stage ON public.hr_job_applications(stage);
CREATE INDEX IF NOT EXISTS idx_hr_leave_requests_status ON public.hr_leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_hr_offers_status ON public.hr_offers(status);
CREATE INDEX IF NOT EXISTS idx_hr_employee_documents_expiry ON public.hr_employee_documents(expiry_date);

-- RLS Policies
ALTER TABLE public.hr_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_headcount_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_performance_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_training_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_employee_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_attrition ENABLE ROW LEVEL SECURITY;

-- RLS: Users can only access their organization's HR data
CREATE POLICY "Users can view own org HR data" ON public.hr_employees
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can insert own org HR data" ON public.hr_employees
  FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can update own org HR data" ON public.hr_employees
  FOR UPDATE USING (
    org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid())
  );

-- Similar policies for all other HR tables
CREATE POLICY "Users can view own org headcount history" ON public.hr_headcount_history
  FOR SELECT USING (org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can view own org job postings" ON public.hr_job_postings
  FOR SELECT USING (org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can view own org job applications" ON public.hr_job_applications
  FOR SELECT USING (org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can view own org leave requests" ON public.hr_leave_requests
  FOR SELECT USING (org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can view own org offers" ON public.hr_offers
  FOR SELECT USING (org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can view own org performance reviews" ON public.hr_performance_reviews
  FOR SELECT USING (org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can view own org training records" ON public.hr_training_records
  FOR SELECT USING (org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can view own org employee documents" ON public.hr_employee_documents
  FOR SELECT USING (org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can view own org attrition" ON public.hr_attrition
  FOR SELECT USING (org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid()));

-- Functions for updating updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_hr_employees_updated_at BEFORE UPDATE ON public.hr_employees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hr_job_postings_updated_at BEFORE UPDATE ON public.hr_job_postings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hr_job_applications_updated_at BEFORE UPDATE ON public.hr_job_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hr_leave_requests_updated_at BEFORE UPDATE ON public.hr_leave_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hr_offers_updated_at BEFORE UPDATE ON public.hr_offers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

