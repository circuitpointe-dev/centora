-- Seed Learning & Development data for Abubakar org
-- Ensure required tables exist
CREATE TABLE IF NOT EXISTS public.hr_training_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  employee_id UUID,
  training_name TEXT NOT NULL,
  training_type TEXT,
  provider TEXT,
  start_date DATE,
  end_date DATE,
  completion_status TEXT DEFAULT 'pending' CHECK (completion_status IN ('pending','in_progress','completed','not_completed')),
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  certificate_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$
DECLARE
  v_email TEXT := 'abubakarsa242@gmail.com';
  v_org UUID;
BEGIN
  SELECT org_id INTO v_org FROM public.profiles WHERE email = v_email LIMIT 1;
  IF v_org IS NULL THEN
    RAISE NOTICE 'No org found for %; skipping L&D seed.', v_email;
    RETURN;
  END IF;

  -- Courses
  INSERT INTO public.hr_learning_courses (org_id, course_name, course_type, provider, description, duration_hours, category, level, status, enrollment_open)
  VALUES
    (v_org, 'Advanced React & TypeScript', 'online', 'Centora Academy', 'Modern React patterns, TS best practices.', 16, 'Engineering', 'advanced', 'active', true),
    (v_org, 'Product Discovery Fundamentals', 'online', 'Centora Academy', 'Discovery, validation, and lean experiments.', 10, 'Product', 'intermediate', 'active', true),
    (v_org, 'Data Analysis with Python', 'online', 'Centora Academy', 'Pandas, visualization, and reporting.', 14, 'Data', 'intermediate', 'active', true),
    (v_org, 'Leadership Essentials', 'workshop', 'Centora Academy', 'People leadership and communication.', 8, 'Soft skills', 'beginner', 'active', true)
  ON CONFLICT DO NOTHING;

  -- Training Records (sample completions/progress)
  INSERT INTO public.hr_training_records (org_id, employee_id, training_name, training_type, provider, start_date, end_date, completion_status, completion_percentage, certificate_url)
  SELECT v_org, e.id, r.training_name, r.training_type, r.provider, r.start_date, r.end_date, r.completion_status, r.completion_percentage, r.certificate_url
  FROM (
    VALUES
      ('Advanced React & TypeScript','online','Centora Academy', CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE - INTERVAL '12 days','completed',100,'https://example.com/cert/react-ts.pdf'),
      ('Product Discovery Fundamentals','online','Centora Academy', CURRENT_DATE - INTERVAL '10 days', NULL,'in_progress',60,NULL),
      ('Data Analysis with Python','online','Centora Academy', CURRENT_DATE - INTERVAL '35 days', CURRENT_DATE - INTERVAL '5 days','completed',100,'https://example.com/cert/python.pdf'),
      ('Leadership Essentials','workshop','Centora Academy', CURRENT_DATE - INTERVAL '3 days', NULL,'pending',0,NULL)
  ) as r(training_name, training_type, provider, start_date, end_date, completion_status, completion_percentage, certificate_url)
  JOIN public.hr_employees e ON e.org_id = v_org
  ON CONFLICT DO NOTHING;

  RAISE NOTICE 'Seeded L&D data for org %', v_org;
END $$;
