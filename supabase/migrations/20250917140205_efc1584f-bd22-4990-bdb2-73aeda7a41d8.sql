-- Add some reports due in September 2025 to show current month data
WITH inserted_grants AS (
  SELECT id, grant_name FROM grants WHERE grant_name IN ('Community Health Initiative', 'Digital Education Program', 'Clean Water Access Project')
)
INSERT INTO grant_reports (
  grant_id, report_type, due_date, submitted, status, 
  submitted_date, file_name, file_path, created_by, created_at, updated_at
)
SELECT 
  ig.id,
  report_info.report_type,
  report_info.due_date::date,
  report_info.submitted,
  report_info.status::report_status,
  CASE WHEN report_info.submitted THEN report_info.submitted_date::date ELSE NULL END,
  CASE WHEN report_info.submitted THEN report_info.file_name ELSE NULL END,
  CASE WHEN report_info.submitted THEN report_info.file_path ELSE NULL END,
  (SELECT id FROM profiles LIMIT 1),
  now(),
  now()
FROM inserted_grants ig,
(VALUES 
  -- September 2025 reports (current month)
  ('Monthly Report September', '2025-09-30', false, 'upcoming', NULL, NULL, NULL),
  ('Q3 Progress Report', '2025-09-15', true, 'submitted', '2025-09-12', 'q3_progress_sept_2025.pdf', '/reports/q3_progress_sept_2025.pdf'),
  ('Mid-month Update', '2025-09-20', false, 'overdue', NULL, NULL, NULL)
) AS report_info(report_type, due_date, submitted, status, submitted_date, file_name, file_path)
WHERE (
  (ig.grant_name = 'Community Health Initiative' AND report_info.report_type = 'Monthly Report September') OR
  (ig.grant_name = 'Digital Education Program' AND report_info.report_type = 'Q3 Progress Report') OR
  (ig.grant_name = 'Clean Water Access Project' AND report_info.report_type = 'Mid-month Update')
);