-- Clean up all demo data from the database
DELETE FROM proposals WHERE name = 'New Proposal' OR title = 'New Proposal';
DELETE FROM donor_contacts;
DELETE FROM donor_documents; 
DELETE FROM donor_engagements;
DELETE FROM donor_focus_areas;
DELETE FROM donor_funding_cycles;
DELETE FROM donor_funding_periods;
DELETE FROM donor_giving_records;
DELETE FROM donor_notes;
DELETE FROM donors;
DELETE FROM document_shares;
DELETE FROM document_signatures;
DELETE FROM document_tag_associations;
DELETE FROM document_tags;
DELETE FROM document_versions;
DELETE FROM documents;
DELETE FROM calendar_events;
DELETE FROM announcements;

-- Keep only the current user's profile and organization, remove demo users
DELETE FROM profiles WHERE id != auth.uid();
DELETE FROM organizations WHERE id NOT IN (SELECT DISTINCT org_id FROM profiles WHERE org_id IS NOT NULL);

-- Reset any demo data sequences and ensure clean state
UPDATE organizations SET name = 'Your Organization' WHERE name LIKE '%Demo%' OR name LIKE '%Test%';