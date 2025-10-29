-- Seed minimal HR data for live dashboard
-- Safely pick an organization to attach data to
WITH org AS (
  SELECT id AS org_id FROM public.organizations ORDER BY created_at LIMIT 1
), emp AS (
  INSERT INTO public.hr_employees (
    org_id, employee_id, first_name, last_name, email, department, position, employment_type, hire_date, status
  )
  SELECT org.org_id, 'EMP-001', 'Alex', 'Bello', 'alex.bello@example.com', 'Human Resources', 'HR Manager', 'full-time', CURRENT_DATE - INTERVAL '200 days', 'active' FROM org
  UNION ALL
  SELECT org.org_id, 'EMP-002', 'Sam', 'Adeyemi', 'sam.adeyemi@example.com', 'Technology', 'Software Engineer', 'full-time', CURRENT_DATE - INTERVAL '90 days', 'active' FROM org
  UNION ALL
  SELECT org.org_id, 'EMP-003', 'Mary', 'Okafor', 'mary.okafor@example.com', 'Sales', 'Sales Associate', 'full-time', CURRENT_DATE - INTERVAL '400 days', 'terminated' FROM org
  ON CONFLICT DO NOTHING
  RETURNING id, org_id
), hc AS (
  INSERT INTO public.hr_headcount_history (org_id, record_date, total_headcount, new_hires, terminations)
  SELECT (SELECT org_id FROM org), (CURRENT_DATE - INTERVAL '90 days')::date, 240, 2, 1
  UNION ALL
  SELECT (SELECT org_id FROM org), (CURRENT_DATE - INTERVAL '60 days')::date, 245, 3, 1
  UNION ALL
  SELECT (SELECT org_id FROM org), (CURRENT_DATE - INTERVAL '30 days')::date, 250, 4, 2
  UNION ALL
  SELECT (SELECT org_id FROM org), CURRENT_DATE, 256, 3, 1
  ON CONFLICT DO NOTHING
), jp AS (
  INSERT INTO public.hr_job_postings (org_id, position_title, department, employment_type, status, posted_date)
  SELECT (SELECT org_id FROM org), 'Frontend Engineer', 'Technology', 'full-time', 'open', CURRENT_DATE - INTERVAL '14 days'
  UNION ALL
  SELECT (SELECT org_id FROM org), 'People Ops Specialist', 'Human Resources', 'full-time', 'open', CURRENT_DATE - INTERVAL '21 days'
  ON CONFLICT DO NOTHING
  RETURNING id, org_id
), apps AS (
  INSERT INTO public.hr_job_applications (org_id, job_posting_id, candidate_name, candidate_email, stage, status)
  SELECT (SELECT org_id FROM org), (SELECT id FROM jp LIMIT 1), 'Chidi Okeke', 'chidi.okeke@example.com', 'applied', 'active'
  UNION ALL
  SELECT (SELECT org_id FROM org), (SELECT id FROM jp LIMIT 1), 'Amina Yusuf', 'amina.yusuf@example.com', 'screen', 'active'
  UNION ALL
  SELECT (SELECT org_id FROM org), (SELECT id FROM jp LIMIT 1), 'John Mensah', 'john.mensah@example.com', 'interview', 'active'
  UNION ALL
  SELECT (SELECT org_id FROM org), (SELECT id FROM jp LIMIT 1), 'Zainab Bello', 'zainab.bello@example.com', 'offer', 'active'
  ON CONFLICT DO NOTHING
  RETURNING id, org_id
), offers AS (
  INSERT INTO public.hr_offers (org_id, application_id, position_title, department, salary_amount, currency, start_date, status, offer_date, expiry_date)
  SELECT (SELECT org_id FROM org), (SELECT id FROM apps ORDER BY id DESC LIMIT 1), 'Frontend Engineer', 'Technology', 85000.00, 'USD', CURRENT_DATE + INTERVAL '30 days', 'pending', CURRENT_DATE, CURRENT_DATE + INTERVAL '10 days'
  ON CONFLICT DO NOTHING
), leaves AS (
  INSERT INTO public.hr_leave_requests (org_id, employee_id, leave_type, start_date, end_date, days_requested, reason, status)
  SELECT (SELECT org_id FROM org), (SELECT id FROM emp LIMIT 1), 'annual', CURRENT_DATE + INTERVAL '7 days', CURRENT_DATE + INTERVAL '12 days', 5, 'Family event', 'pending'
  UNION ALL
  SELECT (SELECT org_id FROM org), (SELECT id FROM emp LIMIT 1), 'sick', CURRENT_DATE + INTERVAL '2 days', CURRENT_DATE + INTERVAL '3 days', 1, 'Checkup', 'pending'
  ON CONFLICT DO NOTHING
), training AS (
  INSERT INTO public.hr_training_records (org_id, employee_id, training_name, training_type, provider, start_date, end_date, completion_status, completion_percentage)
  SELECT (SELECT org_id FROM org), (SELECT id FROM emp LIMIT 1), 'Security Awareness', 'Compliance', 'Centora Academy', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE - INTERVAL '3 days', 'completed', 100
  UNION ALL
  SELECT (SELECT org_id FROM org), (SELECT id FROM emp LIMIT 1), 'Sales Enablement', 'Performance', 'Centora Academy', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '10 days', 'in_progress', 35
  ON CONFLICT DO NOTHING
), docs AS (
  INSERT INTO public.hr_employee_documents (org_id, employee_id, document_type, document_name, document_number, issue_date, expiry_date, document_url, is_expiring_soon)
  SELECT (SELECT org_id FROM org), (SELECT id FROM emp LIMIT 1), 'license', 'Driver License', 'DL-001', CURRENT_DATE - INTERVAL '2 years', CURRENT_DATE + INTERVAL '20 days', NULL, FALSE
  UNION ALL
  SELECT (SELECT org_id FROM org), (SELECT id FROM emp LIMIT 1), 'certification', 'First Aid Certificate', 'FA-2024', CURRENT_DATE - INTERVAL '1 year', CURRENT_DATE + INTERVAL '15 days', NULL, FALSE
  ON CONFLICT DO NOTHING
)
INSERT INTO public.hr_attrition (org_id, employee_id, exit_date, exit_reason, exit_type, department, position, notes)
SELECT (SELECT org_id FROM org), NULL, CURRENT_DATE - INTERVAL '60 days', 'voluntary', 'resignation', 'Sales', 'Sales Associate', 'Left for new opportunity'
ON CONFLICT DO NOTHING;


