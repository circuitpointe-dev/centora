-- Insert sample approval data with correct entity types
DO $$
DECLARE
    v_org_id UUID;
    v_approver_id UUID;
BEGIN
    -- Get first org
    SELECT id INTO v_org_id FROM organizations ORDER BY created_at ASC LIMIT 1;
    
    -- Get first profile from that org
    SELECT id INTO v_approver_id FROM profiles WHERE org_id = v_org_id ORDER BY created_at ASC LIMIT 1;
    
    -- Insert 10 sample requisitions
    INSERT INTO procurement_approvals (org_id, entity_type, entity_id, approver_id, status, comments, created_at)
    VALUES 
        (v_org_id, 'requisition', gen_random_uuid(), v_approver_id, 'pending', 'Office supplies requisition', now() - interval '2 days'),
        (v_org_id, 'requisition', gen_random_uuid(), v_approver_id, 'pending', 'IT equipment requisition', now() - interval '5 days'),
        (v_org_id, 'requisition', gen_random_uuid(), v_approver_id, 'pending', 'Marketing materials requisition', now() - interval '7 days'),
        (v_org_id, 'requisition', gen_random_uuid(), v_approver_id, 'pending', 'Furniture requisition', now() - interval '12 days');
    
    -- Insert 3 purchase orders
    INSERT INTO procurement_approvals (org_id, entity_type, entity_id, approver_id, status, comments, created_at)
    VALUES 
        (v_org_id, 'purchase_order', gen_random_uuid(), v_approver_id, 'pending', 'Server equipment purchase order', now() - interval '3 days'),
        (v_org_id, 'purchase_order', gen_random_uuid(), v_approver_id, 'pending', 'Software licenses purchase order', now() - interval '10 days');
    
    -- Insert 2 payments
    INSERT INTO procurement_approvals (org_id, entity_type, entity_id, approver_id, status, comments, created_at)
    VALUES 
        (v_org_id, 'invoice', gen_random_uuid(), v_approver_id, 'pending', 'Vendor payment approval', now() - interval '15 days'),
        (v_org_id, 'invoice', gen_random_uuid(), v_approver_id, 'pending', 'Utility bill payment', now() - interval '30 days');
END $$;