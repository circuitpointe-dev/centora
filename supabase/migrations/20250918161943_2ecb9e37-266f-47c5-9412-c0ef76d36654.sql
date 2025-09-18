-- Add comprehensive sample data for grants management testing

-- First add some additional sample grants with different statuses and better data
INSERT INTO grants (org_id, grant_name, donor_name, amount, currency, start_date, end_date, status, program_area, region, description, created_by) VALUES
-- Additional active grants
((SELECT id FROM organizations LIMIT 1), 'Youth Empowerment Program', 'Gates Foundation', 75000, 'USD', '2024-06-01', '2025-05-31', 'active', 'Education', 'Africa', 'Comprehensive youth development and skill building initiative', (SELECT id FROM profiles LIMIT 1)),
((SELECT id FROM organizations LIMIT 1), 'Rural Water Access Project', 'World Bank', 150000, 'USD', '2024-04-15', '2026-04-14', 'active', 'Health', 'Asia', 'Providing clean water access to rural communities', (SELECT id FROM profiles LIMIT 1)),
((SELECT id FROM organizations LIMIT 1), 'Digital Literacy Campaign', 'USAID', 80000, 'USD', '2024-08-01', '2025-07-31', 'active', 'Education', 'Americas', 'Expanding digital skills in underserved communities', (SELECT id FROM profiles LIMIT 1)),
((SELECT id FROM organizations LIMIT 1), 'Maternal Health Initiative', 'UNICEF', 120000, 'USD', '2024-05-20', '2025-11-19', 'active', 'Health', 'Africa', 'Improving maternal and child health outcomes', (SELECT id FROM profiles LIMIT 1)),

-- Closed grants for archive
((SELECT id FROM organizations LIMIT 1), 'Clean Water Initiative', 'WaterAid Foundation', 100000, 'USD', '2023-01-15', '2024-03-15', 'closed', 'Health', 'Africa', 'Successful water sanitation project completed', (SELECT id FROM profiles LIMIT 1)),
((SELECT id FROM organizations LIMIT 1), 'Education for All', 'Education Trust', 85000, 'USD', '2022-09-01', '2024-02-28', 'closed', 'Education', 'Asia', 'Primary education access improvement project', (SELECT id FROM profiles LIMIT 1)),
((SELECT id FROM organizations LIMIT 1), 'Rural Healthcare', 'Medical Relief Org', 95000, 'USD', '2023-06-01', '2024-01-20', 'closed', 'Health', 'Americas', 'Healthcare delivery in remote areas', (SELECT id FROM profiles LIMIT 1)),

-- Pending grants
((SELECT id FROM organizations LIMIT 1), 'Community Development Fund', 'Ford Foundation', 200000, 'USD', '2024-10-01', '2026-09-30', 'pending', 'Community Development', 'Africa', 'Large scale community empowerment initiative', (SELECT id FROM profiles LIMIT 1)),
((SELECT id FROM organizations LIMIT 1), 'Environmental Conservation', 'Green Fund', 90000, 'USD', '2024-11-01', '2025-10-31', 'pending', 'Environment', 'Europe', 'Forest conservation and reforestation project', (SELECT id FROM profiles LIMIT 1));

-- Add more compliance records for the new grants
INSERT INTO grant_compliance (grant_id, requirement, due_date, status, evidence_document, created_by) 
SELECT 
    g.id,
    'Project Implementation Report',
    g.start_date + INTERVAL '6 months',
    CASE 
        WHEN g.status = 'closed' THEN 'completed'::compliance_status
        WHEN g.status = 'active' THEN 'in_progress'::compliance_status
        ELSE 'in_progress'::compliance_status
    END,
    CASE WHEN g.status = 'closed' THEN 'implementation_report_' || g.id || '.pdf' ELSE NULL END,
    (SELECT id FROM profiles LIMIT 1)
FROM grants g 
WHERE g.grant_name IN ('Youth Empowerment Program', 'Rural Water Access Project', 'Digital Literacy Campaign', 'Maternal Health Initiative', 'Clean Water Initiative', 'Education for All');

INSERT INTO grant_compliance (grant_id, requirement, due_date, status, evidence_document, created_by) 
SELECT 
    g.id,
    'Financial Audit Documentation',
    g.end_date - INTERVAL '2 months',
    CASE 
        WHEN g.status = 'closed' THEN 'completed'::compliance_status
        WHEN g.status = 'active' AND CURRENT_DATE > g.start_date + INTERVAL '3 months' THEN 'overdue'::compliance_status
        ELSE 'in_progress'::compliance_status
    END,
    CASE WHEN g.status = 'closed' THEN 'audit_' || g.id || '.pdf' ELSE NULL END,
    (SELECT id FROM profiles LIMIT 1)
FROM grants g 
WHERE g.grant_name IN ('Youth Empowerment Program', 'Rural Water Access Project', 'Clean Water Initiative', 'Education for All', 'Rural Healthcare');

INSERT INTO grant_compliance (grant_id, requirement, due_date, status, created_by) 
SELECT 
    g.id,
    'Beneficiary Impact Assessment',
    g.start_date + INTERVAL '9 months',
    CASE 
        WHEN g.status = 'closed' THEN 'completed'::compliance_status
        WHEN g.status = 'active' THEN 'in_progress'::compliance_status
        ELSE 'in_progress'::compliance_status
    END,
    (SELECT id FROM profiles LIMIT 1)
FROM grants g 
WHERE g.grant_name IN ('Digital Literacy Campaign', 'Maternal Health Initiative', 'Rural Healthcare');

-- Add more disbursement records
INSERT INTO grant_disbursements (grant_id, milestone, amount, currency, due_date, disbursed_on, status, created_by)
SELECT 
    g.id,
    'Initial Payment',
    g.amount * 0.3,
    g.currency,
    g.start_date,
    CASE WHEN g.status IN ('active', 'closed') THEN g.start_date ELSE NULL END,
    CASE 
        WHEN g.status IN ('active', 'closed') THEN 'released'::disbursement_status
        ELSE 'pending'::disbursement_status
    END,
    (SELECT id FROM profiles LIMIT 1)
FROM grants g 
WHERE g.grant_name IN ('Youth Empowerment Program', 'Rural Water Access Project', 'Digital Literacy Campaign', 'Maternal Health Initiative', 'Clean Water Initiative', 'Education for All', 'Rural Healthcare');

INSERT INTO grant_disbursements (grant_id, milestone, amount, currency, due_date, disbursed_on, status, created_by)
SELECT 
    g.id,
    'Mid-term Payment',
    g.amount * 0.4,
    g.currency,
    g.start_date + INTERVAL '6 months',
    CASE WHEN g.status = 'closed' THEN g.start_date + INTERVAL '6 months' 
         WHEN g.status = 'active' AND CURRENT_DATE > g.start_date + INTERVAL '6 months' THEN g.start_date + INTERVAL '6 months'
         ELSE NULL END,
    CASE 
        WHEN g.status = 'closed' THEN 'released'::disbursement_status
        WHEN g.status = 'active' AND CURRENT_DATE > g.start_date + INTERVAL '6 months' THEN 'released'::disbursement_status
        ELSE 'pending'::disbursement_status
    END,
    (SELECT id FROM profiles LIMIT 1)
FROM grants g 
WHERE g.grant_name IN ('Youth Empowerment Program', 'Rural Water Access Project', 'Digital Literacy Campaign', 'Maternal Health Initiative', 'Clean Water Initiative', 'Education for All', 'Rural Healthcare');

INSERT INTO grant_disbursements (grant_id, milestone, amount, currency, due_date, status, created_by)
SELECT 
    g.id,
    'Final Payment',
    g.amount * 0.3,
    g.currency,
    g.end_date,
    CASE 
        WHEN g.status = 'closed' THEN 'released'::disbursement_status
        ELSE 'pending'::disbursement_status
    END,
    (SELECT id FROM profiles LIMIT 1)
FROM grants g 
WHERE g.grant_name IN ('Youth Empowerment Program', 'Rural Water Access Project', 'Digital Literacy Campaign', 'Maternal Health Initiative', 'Clean Water Initiative', 'Education for All', 'Rural Healthcare');

-- Add more report records
INSERT INTO grant_reports (grant_id, report_type, due_date, submitted, status, submitted_date, file_name, file_path, created_by)
SELECT 
    g.id,
    'Quarterly Report',
    g.start_date + INTERVAL '3 months',
    CASE WHEN g.status IN ('active', 'closed') THEN true ELSE false END,
    CASE 
        WHEN g.status = 'closed' THEN 'submitted'::report_status
        WHEN g.status = 'active' AND CURRENT_DATE > g.start_date + INTERVAL '3 months' THEN 'submitted'::report_status
        WHEN g.status = 'active' AND CURRENT_DATE <= g.start_date + INTERVAL '3 months' THEN 'upcoming'::report_status
        ELSE 'upcoming'::report_status
    END,
    CASE 
        WHEN g.status = 'closed' THEN g.start_date + INTERVAL '3 months' - INTERVAL '5 days'
        WHEN g.status = 'active' AND CURRENT_DATE > g.start_date + INTERVAL '3 months' THEN g.start_date + INTERVAL '3 months' - INTERVAL '2 days'
        ELSE NULL 
    END,
    CASE 
        WHEN g.status IN ('active', 'closed') AND CURRENT_DATE > g.start_date + INTERVAL '3 months' THEN 'Q1_report_' || g.id || '.pdf'
        ELSE NULL 
    END,
    CASE 
        WHEN g.status IN ('active', 'closed') AND CURRENT_DATE > g.start_date + INTERVAL '3 months' THEN 'reports/Q1_report_' || g.id || '.pdf'
        ELSE NULL 
    END,
    (SELECT id FROM profiles LIMIT 1)
FROM grants g 
WHERE g.grant_name IN ('Youth Empowerment Program', 'Rural Water Access Project', 'Digital Literacy Campaign', 'Maternal Health Initiative', 'Clean Water Initiative', 'Education for All', 'Rural Healthcare');

INSERT INTO grant_reports (grant_id, report_type, due_date, submitted, status, submitted_date, file_name, created_by)
SELECT 
    g.id,
    'Mid-Year Report',
    g.start_date + INTERVAL '6 months',
    CASE WHEN g.status = 'closed' THEN true ELSE false END,
    CASE 
        WHEN g.status = 'closed' THEN 'submitted'::report_status
        WHEN g.status = 'active' AND CURRENT_DATE > g.start_date + INTERVAL '6 months' THEN 'overdue'::report_status
        ELSE 'upcoming'::report_status
    END,
    CASE WHEN g.status = 'closed' THEN g.start_date + INTERVAL '6 months' - INTERVAL '3 days' ELSE NULL END,
    CASE WHEN g.status = 'closed' THEN 'midyear_report_' || g.id || '.pdf' ELSE NULL END,
    (SELECT id FROM profiles LIMIT 1)
FROM grants g 
WHERE g.grant_name IN ('Youth Empowerment Program', 'Rural Water Access Project', 'Digital Literacy Campaign', 'Maternal Health Initiative', 'Clean Water Initiative', 'Education for All', 'Rural Healthcare');

INSERT INTO grant_reports (grant_id, report_type, due_date, submitted, status, created_by)
SELECT 
    g.id,
    'Final Report',
    g.end_date,
    CASE WHEN g.status = 'closed' THEN true ELSE false END,
    CASE 
        WHEN g.status = 'closed' THEN 'submitted'::report_status
        ELSE 'upcoming'::report_status
    END,
    (SELECT id FROM profiles LIMIT 1)
FROM grants g 
WHERE g.grant_name IN ('Youth Empowerment Program', 'Rural Water Access Project', 'Digital Literacy Campaign', 'Maternal Health Initiative', 'Clean Water Initiative', 'Education for All', 'Rural Healthcare');

-- Update some existing grants to have more realistic data
UPDATE grants 
SET 
    next_report_due = start_date + INTERVAL '3 months',
    track_status = CASE 
        WHEN status = 'active' THEN 'on_track'
        WHEN status = 'closed' THEN 'completed'
        ELSE 'pending'
    END
WHERE grant_name IN ('Youth Empowerment Program', 'Rural Water Access Project', 'Digital Literacy Campaign', 'Maternal Health Initiative', 'Clean Water Initiative', 'Education for All', 'Rural Healthcare');

-- Add some sample grantee submission data by creating a simple table for tracking submissions
CREATE TABLE IF NOT EXISTS grantee_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    grant_id UUID REFERENCES grants(id) ON DELETE CASCADE,
    submission_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending_review',
    submitted_date DATE NOT NULL DEFAULT CURRENT_DATE,
    organization_name TEXT NOT NULL,
    document_path TEXT,
    feedback TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on the new table
ALTER TABLE grantee_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for grantee submissions
CREATE POLICY "Users can view grantee submissions in their org" ON grantee_submissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM grants g 
            WHERE g.id = grantee_submissions.grant_id 
            AND is_org_member(g.org_id)
        )
    );

CREATE POLICY "Users can create grantee submissions" ON grantee_submissions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM grants g 
            WHERE g.id = grantee_submissions.grant_id 
            AND is_org_member(g.org_id)
        ) AND created_by = auth.uid()
    );

CREATE POLICY "Creators or admins can update grantee submissions" ON grantee_submissions
    FOR UPDATE USING (
        created_by = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM grants g 
            WHERE g.id = grantee_submissions.grant_id 
            AND is_org_admin(g.org_id)
        )
    );

CREATE POLICY "Creators or admins can delete grantee submissions" ON grantee_submissions
    FOR DELETE USING (
        created_by = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM grants g 
            WHERE g.id = grantee_submissions.grant_id 
            AND is_org_admin(g.org_id)
        )
    );

-- Insert sample grantee submissions data
INSERT INTO grantee_submissions (grant_id, submission_type, status, submitted_date, organization_name, document_path, feedback, created_by)
SELECT 
    g.id,
    'Narrative',
    'pending_review',
    CURRENT_DATE - INTERVAL '2 days',
    CASE 
        WHEN g.grant_name = 'Youth Empowerment Program' THEN 'Youth Development NGO'
        WHEN g.grant_name = 'Rural Water Access Project' THEN 'Clean Water Initiative'
        WHEN g.grant_name = 'Digital Literacy Campaign' THEN 'Tech for All Foundation'
        WHEN g.grant_name = 'Maternal Health Initiative' THEN 'Healthcare Partners'
        ELSE 'Sample Organization'
    END,
    'submissions/narrative_' || g.id || '_' || EXTRACT(epoch FROM CURRENT_DATE) || '.pdf',
    NULL,
    (SELECT id FROM profiles LIMIT 1)
FROM grants g 
WHERE g.status = 'active' AND g.grant_name IN ('Youth Empowerment Program', 'Rural Water Access Project', 'Digital Literacy Campaign', 'Maternal Health Initiative');

INSERT INTO grantee_submissions (grant_id, submission_type, status, submitted_date, organization_name, document_path, feedback, created_by)
SELECT 
    g.id,
    'Financial',
    'revision_requested',
    CURRENT_DATE - INTERVAL '5 days',
    CASE 
        WHEN g.grant_name = 'Youth Empowerment Program' THEN 'Youth Development NGO'
        WHEN g.grant_name = 'Rural Water Access Project' THEN 'Clean Water Initiative'
        WHEN g.grant_name = 'Digital Literacy Campaign' THEN 'Tech for All Foundation'
        ELSE 'Sample Organization'
    END,
    'submissions/financial_' || g.id || '_' || EXTRACT(epoch FROM CURRENT_DATE - INTERVAL '5 days') || '.pdf',
    'Please provide additional budget breakdown for personnel costs',
    (SELECT id FROM profiles LIMIT 1)
FROM grants g 
WHERE g.status = 'active' AND g.grant_name IN ('Youth Empowerment Program', 'Rural Water Access Project', 'Digital Literacy Campaign');

INSERT INTO grantee_submissions (grant_id, submission_type, status, submitted_date, organization_name, document_path, feedback, created_by)
SELECT 
    g.id,
    'M&E',
    'approved',
    CURRENT_DATE - INTERVAL '8 days',
    CASE 
        WHEN g.grant_name = 'Youth Empowerment Program' THEN 'Youth Development NGO'
        WHEN g.grant_name = 'Maternal Health Initiative' THEN 'Healthcare Partners'
        ELSE 'Sample Organization'
    END,
    'submissions/me_' || g.id || '_' || EXTRACT(epoch FROM CURRENT_DATE - INTERVAL '8 days') || '.pdf',
    'Excellent monitoring framework. Approved.',
    (SELECT id FROM profiles LIMIT 1)
FROM grants g 
WHERE g.status = 'active' AND g.grant_name IN ('Youth Empowerment Program', 'Maternal Health Initiative');

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_grantee_submissions_updated_at 
    BEFORE UPDATE ON grantee_submissions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();