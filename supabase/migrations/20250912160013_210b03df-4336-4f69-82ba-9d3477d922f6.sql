-- Insert sample document tags
INSERT INTO public.document_tags (org_id, name, color, bg_color, text_color, created_by) VALUES
((SELECT id FROM organizations LIMIT 1), 'HR', '#cb27f5', 'bg-[#f9e6fd]', 'text-[#cb27f5]', (SELECT id FROM profiles LIMIT 1)),
((SELECT id FROM organizations LIMIT 1), 'Contract', '#17a34b', 'bg-[#e8fbef]', 'text-[#17a34b]', (SELECT id FROM profiles LIMIT 1)),
((SELECT id FROM organizations LIMIT 1), 'Finance', '#2563eb', 'bg-blue-100', 'text-blue-800', (SELECT id FROM profiles LIMIT 1)),
((SELECT id FROM organizations LIMIT 1), 'Report', '#eab308', 'bg-yellow-100', 'text-yellow-800', (SELECT id FROM profiles LIMIT 1)),
((SELECT id FROM organizations LIMIT 1), 'Marketing', '#ec4899', 'bg-pink-100', 'text-pink-800', (SELECT id FROM profiles LIMIT 1)),
((SELECT id FROM organizations LIMIT 1), 'Brief', '#6366f1', 'bg-indigo-100', 'text-indigo-800', (SELECT id FROM profiles LIMIT 1)),
((SELECT id FROM organizations LIMIT 1), 'Urgent', '#dc2626', 'bg-red-100', 'text-red-800', (SELECT id FROM profiles LIMIT 1)),
((SELECT id FROM organizations LIMIT 1), 'Project', '#16a34a', 'bg-green-100', 'text-green-800', (SELECT id FROM profiles LIMIT 1)),
((SELECT id FROM organizations LIMIT 1), 'Specs', '#6b7280', 'bg-gray-200', 'text-gray-800', (SELECT id FROM profiles LIMIT 1)),
((SELECT id FROM organizations LIMIT 1), 'Onboarding', '#9333ea', 'bg-purple-100', 'text-purple-800', (SELECT id FROM profiles LIMIT 1)),
((SELECT id FROM organizations LIMIT 1), 'Legal', '#ea580c', 'bg-orange-100', 'text-orange-800', (SELECT id FROM profiles LIMIT 1)),
((SELECT id FROM organizations LIMIT 1), 'Agreement', '#6b7280', 'bg-gray-200', 'text-gray-800', (SELECT id FROM profiles LIMIT 1)),
((SELECT id FROM organizations LIMIT 1), 'M&E', '#0d9488', 'bg-teal-100', 'text-teal-800', (SELECT id FROM profiles LIMIT 1)),
((SELECT id FROM organizations LIMIT 1), 'Framework', '#6b7280', 'bg-gray-200', 'text-gray-800', (SELECT id FROM profiles LIMIT 1)),
((SELECT id FROM organizations LIMIT 1), 'Budget', '#eab308', 'bg-yellow-100', 'text-yellow-800', (SELECT id FROM profiles LIMIT 1)),
((SELECT id FROM organizations LIMIT 1), 'Template', '#6b7280', 'bg-gray-200', 'text-gray-800', (SELECT id FROM profiles LIMIT 1)),
((SELECT id FROM organizations LIMIT 1), 'Policy', '#dc2626', 'bg-red-100', 'text-red-800', (SELECT id FROM profiles LIMIT 1)),
((SELECT id FROM organizations LIMIT 1), 'Notes', '#6b7280', 'bg-gray-200', 'text-gray-800', (SELECT id FROM profiles LIMIT 1));

-- Insert sample documents
INSERT INTO public.documents (org_id, title, file_name, file_path, category, description, created_by, file_size, mime_type) VALUES
((SELECT id FROM organizations LIMIT 1), 'Company Policy and Procedures Handbook', 'Company_Policy_and_Procedures_Handbook.pdf', 'documents/sample/handbook.pdf', 'policies', 'Comprehensive handbook covering all company policies and procedures', (SELECT id FROM profiles LIMIT 1), 2048576, 'application/pdf'),
((SELECT id FROM organizations LIMIT 1), 'Q3 Financial Report', 'Q3_Financial_Report.xlsx', 'documents/sample/q3_report.xlsx', 'finance', 'Quarterly financial performance report', (SELECT id FROM profiles LIMIT 1), 1024768, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
((SELECT id FROM organizations LIMIT 1), 'Marketing Campaign Brief', 'Marketing_Campaign_Brief.docx', 'documents/sample/marketing_brief.docx', 'uncategorized', 'Brief for upcoming marketing campaign', (SELECT id FROM profiles LIMIT 1), 512384, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
((SELECT id FROM organizations LIMIT 1), 'Project Alpha Specification', 'Project_Alpha_Specification.pdf', 'documents/sample/project_spec.pdf', 'contracts', 'Technical specifications for Project Alpha', (SELECT id FROM profiles LIMIT 1), 3072768, 'application/pdf'),
((SELECT id FROM organizations LIMIT 1), 'Onboarding Presentation', 'Onboarding_Presentation.pptx', 'documents/sample/onboarding.pptx', 'policies', 'New employee onboarding presentation', (SELECT id FROM profiles LIMIT 1), 4096512, 'application/vnd.openxmlformats-officedocument.presentationml.presentation'),
((SELECT id FROM organizations LIMIT 1), 'Legal Agreement V2', 'Legal_Agreement_V2.pdf', 'documents/sample/legal_agreement.pdf', 'contracts', 'Updated legal agreement document', (SELECT id FROM profiles LIMIT 1), 1536384, 'application/pdf'),
((SELECT id FROM organizations LIMIT 1), 'Monitoring and Evaluation Framework', 'Monitoring_and_Evaluation_Framework.docx', 'documents/sample/me_framework.docx', 'm-e', 'Framework for monitoring and evaluation activities', (SELECT id FROM profiles LIMIT 1), 768512, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
((SELECT id FROM organizations LIMIT 1), 'Annual Budget Proposal', 'Annual_Budget_Proposal.xlsx', 'documents/sample/budget_proposal.xlsx', 'finance', 'Proposed budget for the upcoming fiscal year', (SELECT id FROM profiles LIMIT 1), 2048768, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
((SELECT id FROM organizations LIMIT 1), 'Vendor Contract Template', 'Vendor_Contract_Template.pdf', 'documents/sample/vendor_template.pdf', 'contracts', 'Standard template for vendor contracts', (SELECT id FROM profiles LIMIT 1), 1024256, 'application/pdf'),
((SELECT id FROM organizations LIMIT 1), 'Employee Code of Conduct', 'Employee_Code_of_Conduct.pdf', 'documents/sample/code_conduct.pdf', 'policies', 'Code of conduct guidelines for all employees', (SELECT id FROM profiles LIMIT 1), 1536768, 'application/pdf'),
((SELECT id FROM organizations LIMIT 1), 'Impact Assessment Report Q2', 'Impact_Assessment_Report_Q2.pdf', 'documents/sample/impact_q2.pdf', 'm-e', 'Q2 impact assessment and evaluation report', (SELECT id FROM profiles LIMIT 1), 2560384, 'application/pdf'),
((SELECT id FROM organizations LIMIT 1), 'Miscellaneous Notes', 'Miscellaneous_Notes.txt', 'documents/sample/misc_notes.txt', 'uncategorized', 'Various project notes and observations', (SELECT id FROM profiles LIMIT 1), 8192, 'text/plain');

-- Create tag associations for documents
INSERT INTO public.document_tag_associations (document_id, tag_id) VALUES
-- Company Policy and Procedures Handbook (HR, Contract)
((SELECT id FROM documents WHERE file_name = 'Company_Policy_and_Procedures_Handbook.pdf'), (SELECT id FROM document_tags WHERE name = 'HR')),
((SELECT id FROM documents WHERE file_name = 'Company_Policy_and_Procedures_Handbook.pdf'), (SELECT id FROM document_tags WHERE name = 'Contract')),
-- Q3 Financial Report (Finance, Report)
((SELECT id FROM documents WHERE file_name = 'Q3_Financial_Report.xlsx'), (SELECT id FROM document_tags WHERE name = 'Finance')),
((SELECT id FROM documents WHERE file_name = 'Q3_Financial_Report.xlsx'), (SELECT id FROM document_tags WHERE name = 'Report')),
-- Marketing Campaign Brief (Marketing, Brief, Urgent)
((SELECT id FROM documents WHERE file_name = 'Marketing_Campaign_Brief.docx'), (SELECT id FROM document_tags WHERE name = 'Marketing')),
((SELECT id FROM documents WHERE file_name = 'Marketing_Campaign_Brief.docx'), (SELECT id FROM document_tags WHERE name = 'Brief')),
((SELECT id FROM documents WHERE file_name = 'Marketing_Campaign_Brief.docx'), (SELECT id FROM document_tags WHERE name = 'Urgent')),
-- Project Alpha Specification (Project, Specs)
((SELECT id FROM documents WHERE file_name = 'Project_Alpha_Specification.pdf'), (SELECT id FROM document_tags WHERE name = 'Project')),
((SELECT id FROM documents WHERE file_name = 'Project_Alpha_Specification.pdf'), (SELECT id FROM document_tags WHERE name = 'Specs')),
-- Onboarding Presentation (HR, Onboarding)
((SELECT id FROM documents WHERE file_name = 'Onboarding_Presentation.pptx'), (SELECT id FROM document_tags WHERE name = 'HR')),
((SELECT id FROM documents WHERE file_name = 'Onboarding_Presentation.pptx'), (SELECT id FROM document_tags WHERE name = 'Onboarding')),
-- Legal Agreement V2 (Legal, Agreement)
((SELECT id FROM documents WHERE file_name = 'Legal_Agreement_V2.pdf'), (SELECT id FROM document_tags WHERE name = 'Legal')),
((SELECT id FROM documents WHERE file_name = 'Legal_Agreement_V2.pdf'), (SELECT id FROM document_tags WHERE name = 'Agreement')),
-- Monitoring and Evaluation Framework (M&E, Framework)
((SELECT id FROM documents WHERE file_name = 'Monitoring_and_Evaluation_Framework.docx'), (SELECT id FROM document_tags WHERE name = 'M&E')),
((SELECT id FROM documents WHERE file_name = 'Monitoring_and_Evaluation_Framework.docx'), (SELECT id FROM document_tags WHERE name = 'Framework')),
-- Annual Budget Proposal (Finance, Budget)
((SELECT id FROM documents WHERE file_name = 'Annual_Budget_Proposal.xlsx'), (SELECT id FROM document_tags WHERE name = 'Finance')),
((SELECT id FROM documents WHERE file_name = 'Annual_Budget_Proposal.xlsx'), (SELECT id FROM document_tags WHERE name = 'Budget')),
-- Vendor Contract Template (Legal, Template)
((SELECT id FROM documents WHERE file_name = 'Vendor_Contract_Template.pdf'), (SELECT id FROM document_tags WHERE name = 'Legal')),
((SELECT id FROM documents WHERE file_name = 'Vendor_Contract_Template.pdf'), (SELECT id FROM document_tags WHERE name = 'Template')),
-- Employee Code of Conduct (HR, Policy)
((SELECT id FROM documents WHERE file_name = 'Employee_Code_of_Conduct.pdf'), (SELECT id FROM document_tags WHERE name = 'HR')),
((SELECT id FROM documents WHERE file_name = 'Employee_Code_of_Conduct.pdf'), (SELECT id FROM document_tags WHERE name = 'Policy')),
-- Impact Assessment Report Q2 (M&E, Report)
((SELECT id FROM documents WHERE file_name = 'Impact_Assessment_Report_Q2.pdf'), (SELECT id FROM document_tags WHERE name = 'M&E')),
((SELECT id FROM documents WHERE file_name = 'Impact_Assessment_Report_Q2.pdf'), (SELECT id FROM document_tags WHERE name = 'Report')),
-- Miscellaneous Notes (Notes)
((SELECT id FROM documents WHERE file_name = 'Miscellaneous_Notes.txt'), (SELECT id FROM document_tags WHERE name = 'Notes'));

-- Insert sample policy documents
INSERT INTO public.policy_documents (document_id, effective_date, expires_date, department, policy_content, acknowledgment_required) VALUES
-- Data Protection Policy
((SELECT id FROM documents WHERE title = 'Employee Code of Conduct'), '2024-01-15', '2025-01-15', 'IT & Technology', 
'{
  "overview": "This policy outlines the requirements for protecting sensitive data and ensuring GDPR compliance across all organizational activities.",
  "scope": "Applies to all employees, contractors, and third-party vendors who handle personal or sensitive data.",
  "keyGuidelines": [
    "Encrypt all sensitive data in transit and at rest",
    "Implement strong access controls and multi-factor authentication",
    "Conduct regular security audits and vulnerability assessments",
    "Report data breaches immediately to the Data Protection Officer"
  ],
  "conflictsOfInterest": "Any conflicts between data protection requirements and business objectives must be escalated to the Data Protection Officer for resolution.",
  "consequences": "Violations may result in disciplinary action, including termination, legal consequences, and regulatory fines."
}', true),

-- IT Security Policy
((SELECT id FROM documents WHERE title = 'Company Policy and Procedures Handbook'), '2024-03-01', '2025-03-01', 'IT & Technology',
'{
  "overview": "Comprehensive IT security guidelines to protect organizational information assets and maintain system integrity.",
  "scope": "All employees and contractors using company IT resources and systems.",
  "keyGuidelines": [
    "Use strong passwords and enable two-factor authentication",
    "Keep software and systems updated with latest security patches",
    "Do not install unauthorized software on company devices",
    "Report suspicious activities or security incidents immediately"
  ],
  "conflictsOfInterest": "Personal use of company IT resources should not interfere with security protocols or business operations.",
  "consequences": "Security violations may result in loss of system access, disciplinary action, and potential legal consequences."
}', true),

-- Remote Work Policy  
((SELECT id FROM documents WHERE title = 'Onboarding Presentation'), '2024-02-01', '2025-02-01', 'Human Resources',
'{
  "overview": "Guidelines for effective remote work practices and maintaining productivity while working from home.",
  "scope": "All employees eligible for remote work arrangements.",
  "keyGuidelines": [
    "Maintain a secure and professional home office environment",
    "Use only company-approved software and communication tools",
    "Attend all scheduled meetings and maintain regular communication",
    "Ensure confidentiality and data security in remote locations"
  ],
  "conflictsOfInterest": "Remote work arrangements should not conflict with client confidentiality or team collaboration requirements.",
  "consequences": "Non-compliance may result in revocation of remote work privileges and return-to-office requirements."
}', true);

-- Insert some template documents
UPDATE public.documents 
SET is_template = true, template_category = 'Report'
WHERE title IN ('Q3 Financial Report', 'Impact Assessment Report Q2');

UPDATE public.documents 
SET is_template = true, template_category = 'Document'
WHERE title IN ('Vendor Contract Template', 'Employee Code of Conduct');

UPDATE public.documents 
SET is_template = true, template_category = 'Proposal'
WHERE title = 'Project Alpha Specification';

-- Update timestamps to show variety (some created recently, others older)
UPDATE public.documents SET created_at = now() - interval '2 days' WHERE title = 'Company Policy and Procedures Handbook';
UPDATE public.documents SET created_at = now() - interval '5 days' WHERE title = 'Q3 Financial Report';
UPDATE public.documents SET created_at = now() - interval '1 week' WHERE title = 'Marketing Campaign Brief';
UPDATE public.documents SET created_at = now() - interval '2 weeks' WHERE title = 'Project Alpha Specification';
UPDATE public.documents SET created_at = now() - interval '1 month' WHERE title = 'Onboarding Presentation';
UPDATE public.documents SET created_at = now() - interval '1 month' WHERE title = 'Legal Agreement V2';
UPDATE public.documents SET created_at = now() - interval '3 weeks' WHERE title = 'Monitoring and Evaluation Framework';
UPDATE public.documents SET created_at = now() - interval '1 month' WHERE title = 'Annual Budget Proposal';
UPDATE public.documents SET created_at = now() - interval '2 months' WHERE title = 'Vendor Contract Template';
UPDATE public.documents SET created_at = now() - interval '2 months' WHERE title = 'Employee Code of Conduct';
UPDATE public.documents SET created_at = now() - interval '3 months' WHERE title = 'Impact Assessment Report Q2';
UPDATE public.documents SET created_at = now() - interval '4 months' WHERE title = 'Miscellaneous Notes';