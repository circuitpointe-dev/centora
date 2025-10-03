-- Seed some sample proposal templates
-- This migration adds real templates to the database for testing

-- Insert sample proposal templates
INSERT INTO documents (
  id,
  title,
  description,
  file_name,
  file_path,
  mime_type,
  file_size,
  category,
  template_category,
  is_template,
  status,
  org_id,
  created_by,
  created_at,
  updated_at
) 
SELECT 
  gen_random_uuid(),
  'Education Initiative Proposal Template',
  'A comprehensive template for education-focused project proposals including objectives, methodology, and budget sections.',
  'education-proposal-template.docx',
  'templates/education-proposal-template.docx',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  45000,
  'templates',
  'proposal',
  true,
  'active',
  o.id,
  p.id,
  NOW(),
  NOW()
FROM organizations o
CROSS JOIN profiles p
WHERE p.org_id = o.id
  AND NOT EXISTS (SELECT 1 FROM documents WHERE title = 'Education Initiative Proposal Template' AND is_template = true)
LIMIT 1;

INSERT INTO documents (
  id,
  title,
  description,
  file_name,
  file_path,
  mime_type,
  file_size,
  category,
  template_category,
  is_template,
  status,
  org_id,
  created_by,
  created_at,
  updated_at
) 
SELECT 
  gen_random_uuid(),
  'Health Program Proposal Template',
  'Template for health and medical program proposals with detailed sections for impact assessment and sustainability.',
  'health-proposal-template.docx',
  'templates/health-proposal-template.docx',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  52000,
  'templates',
  'proposal',
  true,
  'active',
  o.id,
  p.id,
  NOW(),
  NOW()
FROM organizations o
CROSS JOIN profiles p
WHERE p.org_id = o.id
  AND NOT EXISTS (SELECT 1 FROM documents WHERE title = 'Health Program Proposal Template' AND is_template = true)
LIMIT 1;

INSERT INTO documents (
  id,
  title,
  description,
  file_name,
  file_path,
  mime_type,
  file_size,
  category,
  template_category,
  is_template,
  status,
  org_id,
  created_by,
  created_at,
  updated_at
) 
SELECT 
  gen_random_uuid(),
  'Community Development Proposal Template',
  'A structured template for community development projects including stakeholder analysis and risk assessment.',
  'community-proposal-template.docx',
  'templates/community-proposal-template.docx',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  48000,
  'templates',
  'proposal',
  true,
  'active',
  o.id,
  p.id,
  NOW(),
  NOW()
FROM organizations o
CROSS JOIN profiles p
WHERE p.org_id = o.id
  AND NOT EXISTS (SELECT 1 FROM documents WHERE title = 'Community Development Proposal Template' AND is_template = true)
LIMIT 1;

INSERT INTO documents (
  id,
  title,
  description,
  file_name,
  file_path,
  mime_type,
  file_size,
  category,
  template_category,
  is_template,
  status,
  org_id,
  created_by,
  created_at,
  updated_at
) 
SELECT 
  gen_random_uuid(),
  'Environmental Project Proposal Template',
  'Template for environmental conservation and sustainability projects with focus on impact measurement.',
  'environment-proposal-template.docx',
  'templates/environment-proposal-template.docx',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  41000,
  'templates',
  'proposal',
  true,
  'active',
  o.id,
  p.id,
  NOW(),
  NOW()
FROM organizations o
CROSS JOIN profiles p
WHERE p.org_id = o.id
  AND NOT EXISTS (SELECT 1 FROM documents WHERE title = 'Environmental Project Proposal Template' AND is_template = true)
LIMIT 1;

INSERT INTO documents (
  id,
  title,
  description,
  file_name,
  file_path,
  mime_type,
  file_size,
  category,
  template_category,
  is_template,
  status,
  org_id,
  created_by,
  created_at,
  updated_at
) 
SELECT 
  gen_random_uuid(),
  'Grant Application Template',
  'General purpose grant application template suitable for various funding opportunities.',
  'grant-application-template.docx',
  'templates/grant-application-template.docx',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  38000,
  'templates',
  'proposal',
  true,
  'active',
  o.id,
  p.id,
  NOW(),
  NOW()
FROM organizations o
CROSS JOIN profiles p
WHERE p.org_id = o.id
  AND NOT EXISTS (SELECT 1 FROM documents WHERE title = 'Grant Application Template' AND is_template = true)
LIMIT 1;
