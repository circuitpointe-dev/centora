-- HR Onboarding checklists
CREATE TABLE IF NOT EXISTS public.hr_onboarding_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES public.hr_employees(id) ON DELETE SET NULL,
  role TEXT,
  start_date DATE,
  manager TEXT,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  blockers INTEGER DEFAULT 0,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress','completed','blocked')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.hr_onboarding_checklists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own org onboarding" ON public.hr_onboarding_checklists
  FOR SELECT USING (org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Users can manage own org onboarding" ON public.hr_onboarding_checklists
  FOR ALL USING (org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid()));

-- Seed sample onboarding for Abubakar org
DO $$
DECLARE v_org UUID; v_email TEXT := 'abubakarsa242@gmail.com';
BEGIN
  SELECT org_id INTO v_org FROM public.profiles WHERE email = v_email LIMIT 1;
  IF v_org IS NULL THEN RAISE NOTICE 'No org for %, skip onboarding seed', v_email; RETURN; END IF;

  -- Create a few sample rows tied to existing hr_employees if present
  INSERT INTO public.hr_onboarding_checklists (org_id, employee_id, role, start_date, manager, progress, blockers, status)
  SELECT v_org, e.id, 'Software engineer', CURRENT_DATE - INTERVAL '90 days', 'Alicia Smith', 62, 2, 'in_progress'
  FROM public.hr_employees e WHERE e.org_id = v_org LIMIT 1
  ON CONFLICT DO NOTHING;

  INSERT INTO public.hr_onboarding_checklists (org_id, employee_id, role, start_date, manager, progress, blockers, status)
  SELECT v_org, e.id, 'Product manager', CURRENT_DATE - INTERVAL '50 days', 'John Doe', 75, 2, 'in_progress'
  FROM public.hr_employees e WHERE e.org_id = v_org OFFSET 1 LIMIT 1
  ON CONFLICT DO NOTHING;

  INSERT INTO public.hr_onboarding_checklists (org_id, employee_id, role, start_date, manager, progress, blockers, status)
  SELECT v_org, e.id, 'Designer', CURRENT_DATE - INTERVAL '30 days', 'Alice Brown', 100, 0, 'completed'
  FROM public.hr_employees e WHERE e.org_id = v_org OFFSET 2 LIMIT 1
  ON CONFLICT DO NOTHING;
END $$;
