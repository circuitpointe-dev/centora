-- Insert grant compliance records
WITH inserted_grants AS (
  SELECT id, grant_name FROM grants
)
INSERT INTO grant_compliance (
  grant_id, requirement, due_date, status, evidence_document, created_by, created_at, updated_at
)
SELECT 
  ig.id,
  compliance_info.requirement,
  compliance_info.due_date::date,
  compliance_info.status::compliance_status,
  compliance_info.evidence_document,
  (SELECT id FROM profiles LIMIT 1),
  now(),
  now()
FROM inserted_grants ig,
(VALUES 
  -- Community Health Initiative compliance
  ('Ethical Approval Documentation', '2025-02-28', 'completed', 'ethics_approval_community_health.pdf'),
  ('Local Partnership Agreements', '2025-03-15', 'in_progress', NULL),
  ('Health Ministry Permits', '2025-04-30', 'overdue', NULL),
  -- Digital Education Program compliance
  ('Data Protection Compliance', '2025-03-01', 'completed', 'data_protection_digital_ed.pdf'),
  ('School Partnership MOUs', '2025-04-15', 'in_progress', NULL),
  -- Clean Water Access Project compliance
  ('Environmental Impact Assessment', '2025-04-30', 'overdue', NULL),
  ('Community Consultation Records', '2025-05-15', 'in_progress', NULL),
  -- Women Entrepreneurship Fund compliance (closed)
  ('Final Audit Report', '2025-08-31', 'completed', 'audit_women_entrepreneurship.pdf'),
  -- Youth Leadership Development compliance
  ('Youth Protection Policies', '2025-03-31', 'completed', 'youth_protection_policies.pdf'),
  ('Training Curriculum Approval', '2025-05-30', 'in_progress', NULL)
) AS compliance_info(requirement, due_date, status, evidence_document)
WHERE (
  (ig.grant_name = 'Community Health Initiative' AND compliance_info.requirement IN ('Ethical Approval Documentation', 'Local Partnership Agreements', 'Health Ministry Permits')) OR
  (ig.grant_name = 'Digital Education Program' AND compliance_info.requirement IN ('Data Protection Compliance', 'School Partnership MOUs')) OR
  (ig.grant_name = 'Clean Water Access Project' AND compliance_info.requirement IN ('Environmental Impact Assessment', 'Community Consultation Records')) OR
  (ig.grant_name = 'Women Entrepreneurship Fund' AND compliance_info.requirement IN ('Final Audit Report')) OR
  (ig.grant_name = 'Youth Leadership Development' AND compliance_info.requirement IN ('Youth Protection Policies', 'Training Curriculum Approval'))
);