-- Add sample procurement data for testing

-- Insert sample vendors
INSERT INTO public.vendors (id, org_id, vendor_name, contact_person, email, phone, address, city, state, postal_code, country, payment_terms, currency, rating, created_by) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM public.organizations LIMIT 1), 'Office Supplies Plus', 'John Smith', 'john@officesupplies.com', '+1-555-0101', '123 Business St', 'New York', 'NY', '10001', 'USA', 30, 'USD', 4.5, (SELECT id FROM public.profiles LIMIT 1)),
  ('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM public.organizations LIMIT 1), 'Tech Solutions Inc', 'Sarah Johnson', 'sarah@techsolutions.com', '+1-555-0102', '456 Tech Ave', 'San Francisco', 'CA', '94102', 'USA', 45, 'USD', 4.8, (SELECT id FROM public.profiles LIMIT 1)),
  ('550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM public.organizations LIMIT 1), 'Furniture World', 'Mike Wilson', 'mike@furnitureworld.com', '+1-555-0103', '789 Furniture Blvd', 'Chicago', 'IL', '60601', 'USA', 30, 'USD', 4.2, (SELECT id FROM public.profiles LIMIT 1)),
  ('550e8400-e29b-41d4-a716-446655440004', (SELECT id FROM public.organizations LIMIT 1), 'Supply Chain Co', 'Lisa Brown', 'lisa@supplychain.com', '+1-555-0104', '321 Supply St', 'Houston', 'TX', '77001', 'USA', 30, 'USD', 4.0, (SELECT id FROM public.profiles LIMIT 1));

-- Insert sample requisitions
INSERT INTO public.requisitions (id, org_id, requisition_number, title, description, department, requested_by, status, priority, total_amount, currency, requested_date, required_date, created_at) VALUES
  ('650e8400-e29b-41d4-a716-446655440001', (SELECT id FROM public.organizations LIMIT 1), 'REQ-2024-001', 'Office Supplies Request', 'Monthly office supplies including paper, pens, and stationery', 'Administration', (SELECT id FROM public.profiles LIMIT 1), 'approved', 'medium', 2500.00, 'USD', '2024-01-15', '2024-01-25', '2024-01-15 10:30:00+00'),
  ('650e8400-e29b-41d4-a716-446655440002', (SELECT id FROM public.organizations LIMIT 1), 'REQ-2024-002', 'IT Equipment Purchase', 'New laptops and monitors for development team', 'IT', (SELECT id FROM public.profiles LIMIT 1), 'pending_approval', 'high', 15000.00, 'USD', '2024-01-14', '2024-01-30', '2024-01-14 14:20:00+00'),
  ('650e8400-e29b-41d4-a716-446655440003', (SELECT id FROM public.organizations LIMIT 1), 'REQ-2024-003', 'Office Furniture', 'New desks and chairs for office expansion', 'Administration', (SELECT id FROM public.profiles LIMIT 1), 'draft', 'low', 12000.00, 'USD', '2024-01-13', '2024-02-15', '2024-01-13 09:15:00+00'),
  ('650e8400-e29b-41d4-a716-446655440004', (SELECT id FROM public.organizations LIMIT 1), 'REQ-2024-004', 'Marketing Materials', 'Brochures, banners, and promotional items', 'Marketing', (SELECT id FROM public.profiles LIMIT 1), 'approved', 'medium', 3500.00, 'USD', '2024-01-12', '2024-01-28', '2024-01-12 16:45:00+00');

-- Insert sample requisition items
INSERT INTO public.requisition_items (requisition_id, item_description, quantity, unit_price, unit_of_measure, specifications) VALUES
  ('650e8400-e29b-41d4-a716-446655440001', 'A4 Paper (500 sheets)', 20, 25.00, 'ream', 'White, 80gsm'),
  ('650e8400-e29b-41d4-a716-446655440001', 'Blue Ink Pens', 100, 2.50, 'each', 'Medium point, blue ink'),
  ('650e8400-e29b-41d4-a716-446655440001', 'Stapler', 5, 15.00, 'each', 'Heavy duty'),
  ('650e8400-e29b-41d4-a716-446655440002', 'Dell Laptop', 5, 1200.00, 'each', 'Intel i7, 16GB RAM, 512GB SSD'),
  ('650e8400-e29b-41d4-a716-446655440002', 'Dell Monitor 24"', 5, 300.00, 'each', 'Full HD, IPS panel'),
  ('650e8400-e29b-41d4-a716-446655440003', 'Office Desk', 10, 800.00, 'each', 'Wood finish, 120cm x 60cm'),
  ('650e8400-e29b-41d4-a716-446655440003', 'Office Chair', 10, 400.00, 'each', 'Ergonomic, adjustable height'),
  ('650e8400-e29b-41d4-a716-446655440004', 'Company Brochures', 1000, 2.50, 'each', 'Full color, A4 size'),
  ('650e8400-e29b-41d4-a716-446655440004', 'Banner Stand', 5, 150.00, 'each', 'Retractable, 2m height');

-- Insert sample purchase orders
INSERT INTO public.purchase_orders (id, org_id, po_number, requisition_id, vendor_id, title, description, status, priority, total_amount, currency, po_date, expected_delivery_date, created_by, created_at) VALUES
  ('750e8400-e29b-41d4-a716-446655440001', (SELECT id FROM public.organizations LIMIT 1), 'PO-2024-001', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Office Supplies Order', 'Monthly office supplies delivery', 'sent', 'medium', 2500.00, 'USD', '2024-01-16', '2024-01-25', (SELECT id FROM public.profiles LIMIT 1), '2024-01-16 09:00:00+00'),
  ('750e8400-e29b-41d4-a716-446655440002', (SELECT id FROM public.organizations LIMIT 1), 'PO-2024-002', '650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'IT Equipment Order', 'Laptops and monitors for development team', 'acknowledged', 'high', 15000.00, 'USD', '2024-01-15', '2024-01-30', (SELECT id FROM public.profiles LIMIT 1), '2024-01-15 11:30:00+00'),
  ('750e8400-e29b-41d4-a716-446655440003', (SELECT id FROM public.organizations LIMIT 1), 'PO-2024-003', '650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Office Furniture Order', 'Desks and chairs for office expansion', 'draft', 'low', 12000.00, 'USD', '2024-01-14', '2024-02-15', (SELECT id FROM public.profiles LIMIT 1), '2024-01-14 14:45:00+00'),
  ('750e8400-e29b-41d4-a716-446655440004', (SELECT id FROM public.organizations LIMIT 1), 'PO-2024-004', '650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'Marketing Materials Order', 'Brochures and promotional materials', 'sent', 'medium', 3500.00, 'USD', '2024-01-13', '2024-01-28', (SELECT id FROM public.profiles LIMIT 1), '2024-01-13 16:20:00+00');

-- Insert sample purchase order items
INSERT INTO public.purchase_order_items (po_id, item_description, quantity, unit_price, unit_of_measure, specifications) VALUES
  ('750e8400-e29b-41d4-a716-446655440001', 'A4 Paper (500 sheets)', 20, 25.00, 'ream', 'White, 80gsm'),
  ('750e8400-e29b-41d4-a716-446655440001', 'Blue Ink Pens', 100, 2.50, 'each', 'Medium point, blue ink'),
  ('750e8400-e29b-41d4-a716-446655440001', 'Stapler', 5, 15.00, 'each', 'Heavy duty'),
  ('750e8400-e29b-41d4-a716-446655440002', 'Dell Laptop', 5, 1200.00, 'each', 'Intel i7, 16GB RAM, 512GB SSD'),
  ('750e8400-e29b-41d4-a716-446655440002', 'Dell Monitor 24"', 5, 300.00, 'each', 'Full HD, IPS panel'),
  ('750e8400-e29b-41d4-a716-446655440003', 'Office Desk', 10, 800.00, 'each', 'Wood finish, 120cm x 60cm'),
  ('750e8400-e29b-41d4-a716-446655440003', 'Office Chair', 10, 400.00, 'each', 'Ergonomic, adjustable height'),
  ('750e8400-e29b-41d4-a716-446655440004', 'Company Brochures', 1000, 2.50, 'each', 'Full color, A4 size'),
  ('750e8400-e29b-41d4-a716-446655440004', 'Banner Stand', 5, 150.00, 'each', 'Retractable, 2m height');

-- Insert sample invoices
INSERT INTO public.invoices (id, org_id, invoice_number, po_id, vendor_id, invoice_date, due_date, status, total_amount, paid_amount, currency, payment_terms, created_by, created_at) VALUES
  ('850e8400-e29b-41d4-a716-446655440001', (SELECT id FROM public.organizations LIMIT 1), 'INV-2024-001', '750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '2024-01-20', '2024-02-19', 'paid', 2500.00, 2500.00, 'USD', 30, (SELECT id FROM public.profiles LIMIT 1), '2024-01-20 10:00:00+00'),
  ('850e8400-e29b-41d4-a716-446655440002', (SELECT id FROM public.organizations LIMIT 1), 'INV-2024-002', '750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '2024-01-25', '2024-02-24', 'pending', 15000.00, 0.00, 'USD', 30, (SELECT id FROM public.profiles LIMIT 1), '2024-01-25 14:30:00+00'),
  ('850e8400-e29b-41d4-a716-446655440003', (SELECT id FROM public.organizations LIMIT 1), 'INV-2024-003', '750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '2024-01-30', '2024-03-01', 'overdue', 12000.00, 0.00, 'USD', 30, (SELECT id FROM public.profiles LIMIT 1), '2024-01-30 09:15:00+00'),
  ('850e8400-e29b-41d4-a716-446655440004', (SELECT id FROM public.organizations LIMIT 1), 'INV-2024-004', '750e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', '2024-02-01', '2024-03-02', 'pending', 3500.00, 0.00, 'USD', 30, (SELECT id FROM public.profiles LIMIT 1), '2024-02-01 11:45:00+00');

-- Insert sample deliveries
INSERT INTO public.deliveries (id, org_id, po_id, delivery_number, status, scheduled_date, actual_date, received_by, delivery_notes, tracking_number, carrier, created_at) VALUES
  ('950e8400-e29b-41d4-a716-446655440001', (SELECT id FROM public.organizations LIMIT 1), '750e8400-e29b-41d4-a716-446655440001', 'DEL-2024-001', 'delivered', '2024-01-25', '2024-01-24', (SELECT id FROM public.profiles LIMIT 1), 'All items received in good condition', 'TRK001234567', 'FedEx', '2024-01-24 15:30:00+00'),
  ('950e8400-e29b-41d4-a716-446655440002', (SELECT id FROM public.organizations LIMIT 1), '750e8400-e29b-41d4-a716-446655440002', 'DEL-2024-002', 'scheduled', '2024-01-30', NULL, NULL, 'Scheduled delivery for IT equipment', 'TRK001234568', 'UPS', '2024-01-25 10:00:00+00'),
  ('950e8400-e29b-41d4-a716-446655440003', (SELECT id FROM public.organizations LIMIT 1), '750e8400-e29b-41d4-a716-446655440003', 'DEL-2024-003', 'overdue', '2024-02-15', NULL, NULL, 'Furniture delivery delayed due to weather', 'TRK001234569', 'DHL', '2024-02-10 14:20:00+00'),
  ('950e8400-e29b-41d4-a716-446655440004', (SELECT id FROM public.organizations LIMIT 1), '750e8400-e29b-41d4-a716-446655440004', 'DEL-2024-004', 'scheduled', '2024-01-28', NULL, NULL, 'Marketing materials delivery', 'TRK001234570', 'FedEx', '2024-01-26 16:45:00+00');

-- Insert sample procurement approvals
INSERT INTO public.procurement_approvals (id, org_id, entity_type, entity_id, approver_id, status, comments, created_at) VALUES
  ('a50e8400-e29b-41d4-a716-446655440001', (SELECT id FROM public.organizations LIMIT 1), 'requisition', '650e8400-e29b-41d4-a716-446655440001', (SELECT id FROM public.profiles LIMIT 1), 'approved', 'Approved for office supplies', '2024-01-15 11:00:00+00'),
  ('a50e8400-e29b-41d4-a716-446655440002', (SELECT id FROM public.organizations LIMIT 1), 'requisition', '650e8400-e29b-41d4-a716-446655440002', (SELECT id FROM public.profiles LIMIT 1), 'pending', 'Awaiting budget approval', '2024-01-14 15:00:00+00'),
  ('a50e8400-e29b-41d4-a716-446655440003', (SELECT id FROM public.organizations LIMIT 1), 'purchase_order', '750e8400-e29b-41d4-a716-446655440001', (SELECT id FROM public.profiles LIMIT 1), 'approved', 'PO approved for processing', '2024-01-16 10:00:00+00'),
  ('a50e8400-e29b-41d4-a716-446655440004', (SELECT id FROM public.organizations LIMIT 1), 'invoice', '850e8400-e29b-41d4-a716-446655440001', (SELECT id FROM public.profiles LIMIT 1), 'approved', 'Invoice approved for payment', '2024-01-20 12:00:00+00');
