
-- Add sample procurement requisitions for Circuitpointe organization
INSERT INTO procurement_requisitions (
  org_id,
  requested_by,
  req_id,
  item_name,
  description,
  quantity,
  unit_price,
  estimated_cost,
  currency,
  date_submitted,
  budget_source,
  status,
  priority,
  category,
  department,
  due_date,
  justification,
  attachments
) VALUES 
-- Pending requisitions
('c21e6282-30c3-4aa9-b646-339007d22a4f', '1d0a3763-f207-4234-a0d2-a392b7e4504d', 'REQ-20251020-A1B2', 'Office Furniture Set', 'Ergonomic desk chairs and standing desks for new team members', 8, 450.00, 3600.00, 'USD', '2025-10-20', 'Operations Budget', 'pending', 'high', 'Office Equipment', 'Administration', '2025-11-15', 'New hires require ergonomic workstations for productivity', ARRAY[]::text[]),
('c21e6282-30c3-4aa9-b646-339007d22a4f', '1d0a3763-f207-4234-a0d2-a392b7e4504d', 'REQ-20251020-C3D4', 'Computer Monitors', 'Dual 27-inch 4K monitors for design team', 6, 350.00, 2100.00, 'USD', '2025-10-19', 'Technology Budget', 'pending', 'medium', 'IT Equipment', 'Technology', '2025-11-20', 'Design team needs higher resolution displays', ARRAY[]::text[]),
('c21e6282-30c3-4aa9-b646-339007d22a4f', '1d0a3763-f207-4234-a0d2-a392b7e4504d', 'REQ-20251020-E5F6', 'Marketing Materials', 'Brochures and promotional items for Q4 campaign', 500, 2.50, 1250.00, 'USD', '2025-10-18', 'Marketing Budget', 'pending', 'medium', 'Marketing Materials', 'Marketing', '2025-11-10', 'Q4 marketing campaign launch materials', ARRAY[]::text[]),
('c21e6282-30c3-4aa9-b646-339007d22a4f', '1d0a3763-f207-4234-a0d2-a392b7e4504d', 'REQ-20251020-P7Q8', 'Printer Supplies', 'Toner cartridges and maintenance kits for office printers', 25, 80.00, 2000.00, 'USD', '2025-10-17', 'Operations Budget', 'pending', 'low', 'Office Supplies', 'Administration', '2025-11-05', 'Regular printer maintenance and supplies', ARRAY[]::text[]),
-- Approved requisitions
('c21e6282-30c3-4aa9-b646-339007d22a4f', '1d0a3763-f207-4234-a0d2-a392b7e4504d', 'REQ-20251015-G7H8', 'Software Licenses', 'Annual renewal for project management software', 15, 120.00, 1800.00, 'USD', '2025-10-15', 'Technology Budget', 'approved', 'high', 'Software', 'Technology', '2025-10-30', 'Required for ongoing project tracking', ARRAY[]::text[]),
('c21e6282-30c3-4aa9-b646-339007d22a4f', '1d0a3763-f207-4234-a0d2-a392b7e4504d', 'REQ-20251012-I9J0', 'Training Program', 'Professional development workshop for staff', 20, 200.00, 4000.00, 'USD', '2025-10-12', 'HR Budget', 'approved', 'medium', 'Training', 'Human Resources', '2025-11-25', 'Annual professional development initiative', ARRAY[]::text[]),
-- Completed requisitions  
('c21e6282-30c3-4aa9-b646-339007d22a4f', '1d0a3763-f207-4234-a0d2-a392b7e4504d', 'REQ-20251005-K1L2', 'Office Supplies', 'Stationery, printer paper, and general supplies', 100, 15.00, 1500.00, 'USD', '2025-10-05', 'Operations Budget', 'completed', 'low', 'Office Supplies', 'Administration', '2025-10-20', 'Monthly office supplies replenishment', ARRAY[]::text[]),
('c21e6282-30c3-4aa9-b646-339007d22a4f', '1d0a3763-f207-4234-a0d2-a392b7e4504d', 'REQ-20251008-M3N4', 'Network Equipment', 'Switches and routers for network upgrade', 4, 800.00, 3200.00, 'USD', '2025-10-08', 'Technology Budget', 'completed', 'urgent', 'IT Equipment', 'Technology', '2025-10-18', 'Infrastructure upgrade for improved connectivity', ARRAY[]::text[]);
