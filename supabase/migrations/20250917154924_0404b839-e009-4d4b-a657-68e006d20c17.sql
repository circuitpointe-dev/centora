-- Update grants to use an existing org_id so they're accessible
UPDATE grants 
SET org_id = 'c21e6282-30c3-4aa9-b646-339007d22a4f'
WHERE org_id = 'eba51716-57f2-4d35-a4a8-148d11a40ef0';

-- Also update related tables to maintain consistency
UPDATE grant_compliance 
SET created_by = '1d0a3763-f207-4234-a0d2-a392b7e4504d'
WHERE grant_id IN (SELECT id FROM grants WHERE org_id = 'c21e6282-30c3-4aa9-b646-339007d22a4f');

UPDATE grant_disbursements 
SET created_by = '1d0a3763-f207-4234-a0d2-a392b7e4504d'
WHERE grant_id IN (SELECT id FROM grants WHERE org_id = 'c21e6282-30c3-4aa9-b646-339007d22a4f');

UPDATE grant_reports 
SET created_by = '1d0a3763-f207-4234-a0d2-a392b7e4504d'
WHERE grant_id IN (SELECT id FROM grants WHERE org_id = 'c21e6282-30c3-4aa9-b646-339007d22a4f');