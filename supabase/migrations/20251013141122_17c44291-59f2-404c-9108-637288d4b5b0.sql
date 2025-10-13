
-- Insert sample vendors
INSERT INTO vendors (org_id, vendor_name, contact_person, email, phone, currency, is_active, created_by)
VALUES 
  ('c21e6282-30c3-4aa9-b646-339007d22a4f', 'Office Supply Co.', 'John Smith', 'john@officesupply.com', '+1-555-0101', 'USD', true, '1d0a3763-f207-4234-a0d2-a392b7e4504d'),
  ('c21e6282-30c3-4aa9-b646-339007d22a4f', 'Tech Solutions Inc.', 'Sarah Johnson', 'sarah@techsolutions.com', '+1-555-0202', 'USD', true, '1d0a3763-f207-4234-a0d2-a392b7e4504d'),
  ('c21e6282-30c3-4aa9-b646-339007d22a4f', 'Marketing Print Ltd.', 'Mike Davis', 'mike@marketingprint.com', '+1-555-0303', 'USD', true, '1d0a3763-f207-4234-a0d2-a392b7e4504d')
ON CONFLICT DO NOTHING;

-- Get vendor IDs and insert procurement data
DO $$
DECLARE
  v_vendor1 UUID;
  v_vendor2 UUID;
  v_vendor3 UUID;
  v_user UUID := '1d0a3763-f207-4234-a0d2-a392b7e4504d';
  v_org UUID := 'c21e6282-30c3-4aa9-b646-339007d22a4f';
  v_req1 UUID;
  v_req2 UUID;
  v_req3 UUID;
  v_po1 UUID;
  v_po2 UUID;
  v_po3 UUID;
BEGIN
  -- Get vendor IDs
  SELECT id INTO v_vendor1 FROM vendors WHERE vendor_name = 'Office Supply Co.' AND org_id = v_org;
  SELECT id INTO v_vendor2 FROM vendors WHERE vendor_name = 'Tech Solutions Inc.' AND org_id = v_org;
  SELECT id INTO v_vendor3 FROM vendors WHERE vendor_name = 'Marketing Print Ltd.' AND org_id = v_org;

  -- Insert sample requisitions with valid enum values
  INSERT INTO requisitions (org_id, requisition_number, title, description, requested_by, status, priority, total_amount, currency, requested_date, required_date)
  VALUES 
    (v_org, 'REQ-2025-001', 'Office Supplies Q1', 'Pens, papers, folders for Q1 2025', v_user, 'submitted', 'medium', 2500.00, 'USD', CURRENT_DATE - 5, CURRENT_DATE + 10),
    (v_org, 'REQ-2025-002', 'IT Equipment Upgrade', 'New laptops and monitors for dev team', v_user, 'submitted', 'high', 15000.00, 'USD', CURRENT_DATE - 3, CURRENT_DATE + 20),
    (v_org, 'REQ-2025-003', 'Marketing Materials', 'Brochures and promotional items', v_user, 'approved', 'low', 3500.00, 'USD', CURRENT_DATE - 10, CURRENT_DATE + 5)
  ON CONFLICT DO NOTHING;

  -- Get requisition IDs
  SELECT id INTO v_req1 FROM requisitions WHERE requisition_number = 'REQ-2025-001' AND org_id = v_org;
  SELECT id INTO v_req2 FROM requisitions WHERE requisition_number = 'REQ-2025-002' AND org_id = v_org;
  SELECT id INTO v_req3 FROM requisitions WHERE requisition_number = 'REQ-2025-003' AND org_id = v_org;

  -- Insert sample purchase orders with valid enum values
  INSERT INTO purchase_orders (org_id, po_number, requisition_id, vendor_id, title, description, status, priority, total_amount, currency, po_date, expected_delivery_date, created_by)
  VALUES 
    (v_org, 'PO-2025-001', v_req3, v_vendor3, 'Marketing Materials Order', 'Promotional brochures and banners', 'sent', 'medium', 3500.00, 'USD', CURRENT_DATE - 5, CURRENT_DATE + 15, v_user),
    (v_org, 'PO-2025-002', v_req1, v_vendor1, 'Office Supplies Bulk Order', 'Quarterly office supplies', 'acknowledged', 'low', 2500.00, 'USD', CURRENT_DATE - 8, CURRENT_DATE + 10, v_user),
    (v_org, 'PO-2025-003', NULL, v_vendor2, 'Server Equipment', 'Network infrastructure upgrade', 'partially_received', 'high', 12000.00, 'USD', CURRENT_DATE - 15, CURRENT_DATE - 2, v_user)
  ON CONFLICT DO NOTHING;

  -- Get PO IDs
  SELECT id INTO v_po1 FROM purchase_orders WHERE po_number = 'PO-2025-001' AND org_id = v_org;
  SELECT id INTO v_po2 FROM purchase_orders WHERE po_number = 'PO-2025-002' AND org_id = v_org;
  SELECT id INTO v_po3 FROM purchase_orders WHERE po_number = 'PO-2025-003' AND org_id = v_org;

  -- Insert sample invoices (without remaining_amount as it's a generated column)
  INSERT INTO invoices (org_id, invoice_number, po_id, vendor_id, invoice_date, due_date, status, total_amount, paid_amount, currency, payment_terms, created_by)
  VALUES 
    (v_org, 'INV-2025-001', v_po2, v_vendor1, CURRENT_DATE - 7, CURRENT_DATE + 23, 'pending', 2500.00, 0, 'USD', 30, v_user),
    (v_org, 'INV-2025-002', v_po1, v_vendor3, CURRENT_DATE - 20, CURRENT_DATE - 5, 'overdue', 3500.00, 0, 'USD', 15, v_user),
    (v_org, 'INV-2024-099', NULL, v_vendor2, CURRENT_DATE - 45, CURRENT_DATE - 30, 'paid', 8500.00, 8500.00, 'USD', 30, v_user),
    (v_org, 'INV-2024-098', NULL, v_vendor1, CURRENT_DATE - 60, CURRENT_DATE - 45, 'paid', 5200.00, 5200.00, 'USD', 30, v_user)
  ON CONFLICT DO NOTHING;

  -- Insert sample deliveries
  INSERT INTO deliveries (org_id, delivery_number, po_id, status, scheduled_date, actual_date, tracking_number, carrier)
  VALUES 
    (v_org, 'DEL-2025-001', v_po1, 'scheduled', CURRENT_DATE + 10, NULL, 'TRK123456789', 'FedEx'),
    (v_org, 'DEL-2025-002', v_po2, 'scheduled', CURRENT_DATE + 5, NULL, 'TRK987654321', 'UPS'),
    (v_org, 'DEL-2025-003', v_po3, 'in_transit', CURRENT_DATE + 2, NULL, 'TRK456789123', 'DHL')
  ON CONFLICT DO NOTHING;

END $$;
