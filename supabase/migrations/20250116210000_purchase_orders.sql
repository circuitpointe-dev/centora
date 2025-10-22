-- Create purchase_orders table
CREATE TABLE IF NOT EXISTS public.purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  po_number TEXT NOT NULL UNIQUE,
  linked_requisition TEXT,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
  vendor_name TEXT NOT NULL,
  po_date DATE NOT NULL DEFAULT CURRENT_DATE,
  delivery_date DATE,
  payment_terms TEXT,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  subtotal NUMERIC(15, 2) DEFAULT 0,
  tax NUMERIC(15, 2) DEFAULT 0,
  discounts NUMERIC(15, 2) DEFAULT 0,
  grand_total NUMERIC(15, 2) DEFAULT 0,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create purchase_order_items table
CREATE TABLE IF NOT EXISTS public.purchase_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  po_id UUID NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  description TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(15, 2) NOT NULL DEFAULT 0,
  total NUMERIC(15, 2) NOT NULL DEFAULT 0,
  budget_source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create purchase_order_approvals table
CREATE TABLE IF NOT EXISTS public.purchase_order_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  po_id UUID NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
  approval_type TEXT NOT NULL CHECK (approval_type IN ('created', 'manager_approval', 'finance_approval', 'procurement_head')),
  approver_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  approver_name TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_at TIMESTAMPTZ,
  comments TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create purchase_order_attachments table
CREATE TABLE IF NOT EXISTS public.purchase_order_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  po_id UUID NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_attachments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for purchase_orders
CREATE POLICY "Users can view purchase orders from their organization" ON public.purchase_orders
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert purchase orders for their organization" ON public.purchase_orders
  FOR INSERT WITH CHECK (
    org_id IN (
      SELECT org_id FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update purchase orders from their organization" ON public.purchase_orders
  FOR UPDATE USING (
    org_id IN (
      SELECT org_id FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete purchase orders from their organization" ON public.purchase_orders
  FOR DELETE USING (
    org_id IN (
      SELECT org_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- RLS Policies for purchase_order_items
CREATE POLICY "Users can view purchase order items from their organization" ON public.purchase_order_items
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert purchase order items for their organization" ON public.purchase_order_items
  FOR INSERT WITH CHECK (
    org_id IN (
      SELECT org_id FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update purchase order items from their organization" ON public.purchase_order_items
  FOR UPDATE USING (
    org_id IN (
      SELECT org_id FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete purchase order items from their organization" ON public.purchase_order_items
  FOR DELETE USING (
    org_id IN (
      SELECT org_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- RLS Policies for purchase_order_approvals
CREATE POLICY "Users can view purchase order approvals from their organization" ON public.purchase_order_approvals
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert purchase order approvals for their organization" ON public.purchase_order_approvals
  FOR INSERT WITH CHECK (
    org_id IN (
      SELECT org_id FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update purchase order approvals from their organization" ON public.purchase_order_approvals
  FOR UPDATE USING (
    org_id IN (
      SELECT org_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- RLS Policies for purchase_order_attachments
CREATE POLICY "Users can view purchase order attachments from their organization" ON public.purchase_order_attachments
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert purchase order attachments for their organization" ON public.purchase_order_attachments
  FOR INSERT WITH CHECK (
    org_id IN (
      SELECT org_id FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete purchase order attachments from their organization" ON public.purchase_order_attachments
  FOR DELETE USING (
    org_id IN (
      SELECT org_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX idx_purchase_orders_org_id ON public.purchase_orders(org_id);
CREATE INDEX idx_purchase_orders_status ON public.purchase_orders(status);
CREATE INDEX idx_purchase_orders_po_number ON public.purchase_orders(po_number);
CREATE INDEX idx_purchase_order_items_po_id ON public.purchase_order_items(po_id);
CREATE INDEX idx_purchase_order_approvals_po_id ON public.purchase_order_approvals(po_id);
CREATE INDEX idx_purchase_order_attachments_po_id ON public.purchase_order_attachments(po_id);

-- Insert sample data
INSERT INTO public.purchase_orders (org_id, po_number, linked_requisition, vendor_name, po_date, delivery_date, payment_terms, currency, status, subtotal, tax, discounts, grand_total, created_by)
SELECT 
  o.id,
  'PO-2025-001',
  'REG-007',
  'Techware Inc.',
  '2025-09-18',
  '2025-09-18',
  'Net 30 / Net 60',
  'USD',
  'approved',
  22000.00,
  0.00,
  500.00,
  21500.00,
  p.id
FROM public.organizations o
CROSS JOIN public.profiles p
WHERE p.org_id = o.id
LIMIT 1;

-- Insert sample purchase order items
INSERT INTO public.purchase_order_items (org_id, po_id, item_name, description, quantity, unit_price, total, budget_source)
SELECT 
  po.org_id,
  po.id,
  'Laptop',
  'HP Elitebook',
  1200,
  1200.00,
  12000.00,
  'Grant A'
FROM public.purchase_orders po
WHERE po.po_number = 'PO-2025-001'
UNION ALL
SELECT 
  po.org_id,
  po.id,
  'Software license',
  'Program management tool',
  20,
  500.00,
  10000.00,
  'Grant B'
FROM public.purchase_orders po
WHERE po.po_number = 'PO-2025-001';

-- Insert sample approvals
INSERT INTO public.purchase_order_approvals (org_id, po_id, approval_type, approver_name, status, approved_at)
SELECT 
  po.org_id,
  po.id,
  'created',
  'System',
  'approved',
  '2025-07-02 09:32:00'
FROM public.purchase_orders po
WHERE po.po_number = 'PO-2025-001'
UNION ALL
SELECT 
  po.org_id,
  po.id,
  'manager_approval',
  'John Manager',
  'approved',
  '2025-07-02 09:32:00'
FROM public.purchase_orders po
WHERE po.po_number = 'PO-2025-001'
UNION ALL
SELECT 
  po.org_id,
  po.id,
  'finance_approval',
  'Jane Finance',
  'approved',
  '2025-07-02 09:32:00'
FROM public.purchase_orders po
WHERE po.po_number = 'PO-2025-001'
UNION ALL
SELECT 
  po.org_id,
  po.id,
  'procurement_head',
  'Mike Procurement',
  'approved',
  '2025-07-02 09:32:00'
FROM public.purchase_orders po
WHERE po.po_number = 'PO-2025-001';

-- Insert sample attachment
INSERT INTO public.purchase_order_attachments (org_id, po_id, file_name, file_url, file_type, file_size)
SELECT 
  po.org_id,
  po.id,
  'tax_certificate.pdf',
  '/attachments/tax_certificate.pdf',
  'application/pdf',
  1024000
FROM public.purchase_orders po
WHERE po.po_number = 'PO-2025-001';
