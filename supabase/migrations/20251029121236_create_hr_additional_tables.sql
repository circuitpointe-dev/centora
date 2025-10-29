-- Additional HR Management Tables
-- Performance Goals, Learning Courses, Board Members, Volunteers, Committees, Reference Checks
-- Note: This assumes hr_employees table exists. If not, apply base HR schema first.

-- Performance Goals/OKRs
CREATE TABLE IF NOT EXISTS public.hr_performance_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  employee_id UUID,
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('OKR', 'KPI', 'Goal', 'Objective')),
  description TEXT,
  company_okr TEXT,
  owner_name TEXT,
  weight TEXT,
  target_value TEXT,
  current_value TEXT,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status TEXT DEFAULT 'on_track' CHECK (status IN ('on_track', 'at_risk', 'off_track', 'completed')),
  next_check_in DATE,
  cycle TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key if hr_employees exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'hr_employees') THEN
    ALTER TABLE public.hr_performance_goals 
    ADD CONSTRAINT fk_hr_performance_goals_employee 
    FOREIGN KEY (employee_id) REFERENCES public.hr_employees(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Learning Courses/Catalog
CREATE TABLE IF NOT EXISTS public.hr_learning_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  course_name TEXT NOT NULL,
  course_type TEXT,
  provider TEXT,
  description TEXT,
  duration_hours INTEGER,
  category TEXT,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'draft')),
  enrollment_open BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Board Members
CREATE TABLE IF NOT EXISTS public.hr_board_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL,
  independence TEXT CHECK (independence IN ('Independent', 'Executive', 'Non-Executive')),
  tenure_years INTEGER,
  attendance_percentage DECIMAL(5,2),
  compliance_status TEXT DEFAULT 'compliant' CHECK (compliance_status IN ('compliant', 'action_required', 'overdue')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'resigned')),
  appointment_date DATE,
  term_end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Volunteers
CREATE TABLE IF NOT EXISTS public.hr_volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  skills TEXT[],
  availability TEXT[],
  assignments_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  join_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Committees
CREATE TABLE IF NOT EXISTS public.hr_committees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  chairperson_id UUID,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'disbanded')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key for chairperson if board_members exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'hr_board_members') THEN
    ALTER TABLE public.hr_committees 
    ADD CONSTRAINT fk_hr_committees_chairperson 
    FOREIGN KEY (chairperson_id) REFERENCES public.hr_board_members(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Committee Members (junction table)
CREATE TABLE IF NOT EXISTS public.hr_committee_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  committee_id UUID,
  member_id UUID,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'chairperson', 'secretary')),
  joined_date DATE DEFAULT CURRENT_DATE,
  UNIQUE(committee_id, member_id)
);

-- Add foreign keys if tables exist
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'hr_committees') THEN
    ALTER TABLE public.hr_committee_members 
    ADD CONSTRAINT fk_hr_committee_members_committee 
    FOREIGN KEY (committee_id) REFERENCES public.hr_committees(id) ON DELETE CASCADE;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'hr_board_members') THEN
    ALTER TABLE public.hr_committee_members 
    ADD CONSTRAINT fk_hr_committee_members_member 
    FOREIGN KEY (member_id) REFERENCES public.hr_board_members(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Reference Checks (detailed)
CREATE TABLE IF NOT EXISTS public.hr_reference_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  application_id UUID,
  candidate_name TEXT NOT NULL,
  candidate_email TEXT NOT NULL,
  requisition TEXT,
  department TEXT,
  total_refs_requested INTEGER DEFAULT 3,
  refs_received INTEGER DEFAULT 0,
  refs_verified INTEGER DEFAULT 0,
  flags INTEGER DEFAULT 0,
  status TEXT DEFAULT 'requested' CHECK (status IN ('requested', 'in_progress', 'received', 'verified', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key if applications table exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'hr_job_applications') THEN
    ALTER TABLE public.hr_reference_checks 
    ADD CONSTRAINT fk_hr_reference_checks_application 
    FOREIGN KEY (application_id) REFERENCES public.hr_job_applications(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Reference Check Details (individual references)
CREATE TABLE IF NOT EXISTS public.hr_reference_check_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_check_id UUID,
  referee_name TEXT NOT NULL,
  referee_email TEXT,
  referee_phone TEXT,
  referee_company TEXT,
  referee_relationship TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'received', 'verified', 'rejected')),
  feedback TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  received_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key for reference check details
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'hr_reference_checks') THEN
    ALTER TABLE public.hr_reference_check_details 
    ADD CONSTRAINT fk_hr_reference_check_details_ref 
    FOREIGN KEY (reference_check_id) REFERENCES public.hr_reference_checks(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_hr_performance_goals_employee ON public.hr_performance_goals(employee_id);
CREATE INDEX IF NOT EXISTS idx_hr_performance_goals_status ON public.hr_performance_goals(status);
CREATE INDEX IF NOT EXISTS idx_hr_board_members_org ON public.hr_board_members(org_id);
CREATE INDEX IF NOT EXISTS idx_hr_volunteers_org ON public.hr_volunteers(org_id);
CREATE INDEX IF NOT EXISTS idx_hr_reference_checks_app ON public.hr_reference_checks(application_id);

-- RLS Policies
ALTER TABLE public.hr_performance_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_learning_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_board_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_committees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_committee_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_reference_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_reference_check_details ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Users can only access their org's data)
CREATE POLICY "Users can view own org performance goals" ON public.hr_performance_goals
  FOR SELECT USING (org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can view own org learning courses" ON public.hr_learning_courses
  FOR SELECT USING (org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can view own org board members" ON public.hr_board_members
  FOR SELECT USING (org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can view own org volunteers" ON public.hr_volunteers
  FOR SELECT USING (org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can view own org committees" ON public.hr_committees
  FOR SELECT USING (org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can view own org reference checks" ON public.hr_reference_checks
  FOR SELECT USING (org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid()));

-- Insert/Update/Delete policies for all tables
CREATE POLICY "Users can manage own org performance goals" ON public.hr_performance_goals
  FOR ALL USING (org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can manage own org learning courses" ON public.hr_learning_courses
  FOR ALL USING (org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can manage own org board members" ON public.hr_board_members
  FOR ALL USING (org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can manage own org volunteers" ON public.hr_volunteers
  FOR ALL USING (org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can manage own org committees" ON public.hr_committees
  FOR ALL USING (org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can manage own org reference checks" ON public.hr_reference_checks
  FOR ALL USING (org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid()));

-- Triggers for updated_at (assuming function exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    CREATE TRIGGER update_hr_performance_goals_updated_at BEFORE UPDATE ON public.hr_performance_goals
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    CREATE TRIGGER update_hr_learning_courses_updated_at BEFORE UPDATE ON public.hr_learning_courses
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    CREATE TRIGGER update_hr_board_members_updated_at BEFORE UPDATE ON public.hr_board_members
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    CREATE TRIGGER update_hr_volunteers_updated_at BEFORE UPDATE ON public.hr_volunteers
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    CREATE TRIGGER update_hr_committees_updated_at BEFORE UPDATE ON public.hr_committees
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    CREATE TRIGGER update_hr_reference_checks_updated_at BEFORE UPDATE ON public.hr_reference_checks
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
