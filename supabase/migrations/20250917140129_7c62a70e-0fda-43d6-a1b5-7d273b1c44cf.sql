-- Insert grant disbursements
WITH inserted_grants AS (
  SELECT id, grant_name, amount FROM grants
)
INSERT INTO grant_disbursements (
  grant_id, milestone, amount, currency, due_date, disbursed_on, status, created_by, created_at, updated_at
)
SELECT 
  ig.id,
  disbursement_info.milestone,
  disbursement_info.amount,
  'USD',
  disbursement_info.due_date::date,
  CASE WHEN disbursement_info.status = 'released' THEN disbursement_info.disbursed_on::date ELSE NULL END,
  disbursement_info.status::disbursement_status,
  (SELECT id FROM profiles LIMIT 1),
  now(),
  now()
FROM inserted_grants ig,
(VALUES 
  -- Community Health Initiative disbursements (250k total)
  ('Project Initiation', 62500, '2025-01-31', '2025-01-30', 'released'),
  ('Q1 Milestone', 62500, '2025-04-30', '2025-04-28', 'released'), 
  ('Q2 Milestone', 62500, '2025-07-31', NULL, 'pending'),
  ('Final Payment', 62500, '2025-12-31', NULL, 'pending'),
  -- Digital Education Program disbursements (180k total)
  ('Initial Payment', 54000, '2025-02-15', '2025-02-14', 'released'),
  ('Mid-term Payment', 72000, '2025-05-31', NULL, 'pending'),
  ('Final Payment', 54000, '2025-08-31', NULL, 'pending'),
  -- Clean Water Access Project disbursements (320k total)
  ('Setup and Planning', 64000, '2025-03-15', '2025-03-14', 'released'),
  ('Phase 1 Implementation', 128000, '2025-06-30', NULL, 'pending'),
  ('Phase 2 Implementation', 96000, '2025-08-31', NULL, 'pending'),
  ('Final Payment', 32000, '2025-09-30', NULL, 'pending'),
  -- Women Entrepreneurship Fund disbursements (150k total - closed)
  ('Program Launch', 37500, '2025-01-31', '2025-01-30', 'released'),
  ('Mid-program Payment', 75000, '2025-03-31', '2025-03-28', 'released'),
  ('Final Payment', 37500, '2025-06-30', '2025-06-25', 'released'),
  -- Youth Leadership Development disbursements (120k total)
  ('Program Setup', 24000, '2025-03-01', '2025-02-28', 'released'),
  ('Training Phase', 48000, '2025-06-30', NULL, 'pending'),
  ('Implementation Phase', 36000, '2025-09-30', NULL, 'pending'),
  ('Final Payment', 12000, '2025-11-30', NULL, 'pending')
) AS disbursement_info(milestone, amount, due_date, disbursed_on, status)
WHERE (
  (ig.grant_name = 'Community Health Initiative' AND disbursement_info.milestone IN ('Project Initiation', 'Q1 Milestone', 'Q2 Milestone', 'Final Payment')) OR
  (ig.grant_name = 'Digital Education Program' AND disbursement_info.milestone IN ('Initial Payment', 'Mid-term Payment', 'Final Payment')) OR
  (ig.grant_name = 'Clean Water Access Project' AND disbursement_info.milestone IN ('Setup and Planning', 'Phase 1 Implementation', 'Phase 2 Implementation', 'Final Payment')) OR
  (ig.grant_name = 'Women Entrepreneurship Fund' AND disbursement_info.milestone IN ('Program Launch', 'Mid-program Payment', 'Final Payment')) OR
  (ig.grant_name = 'Youth Leadership Development' AND disbursement_info.milestone IN ('Program Setup', 'Training Phase', 'Implementation Phase', 'Final Payment'))
);