-- Drop existing indexes if they exist
DROP INDEX IF EXISTS public.idx_procurement_requisitions_org_id;
DROP INDEX IF EXISTS public.idx_procurement_requisitions_status;
DROP INDEX IF EXISTS public.idx_procurement_requisitions_priority;
DROP INDEX IF EXISTS public.idx_procurement_requisitions_requested_by;
DROP INDEX IF EXISTS public.idx_procurement_requisitions_date_submitted;
DROP INDEX IF EXISTS public.idx_procurement_requisitions_budget_source;
DROP INDEX IF EXISTS public.idx_procurement_requisitions_category;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Org members can view requisitions" ON public.procurement_requisitions;
DROP POLICY IF EXISTS "Org members can create requisitions" ON public.procurement_requisitions;
DROP POLICY IF EXISTS "Creators or admins can update requisitions" ON public.procurement_requisitions;
DROP POLICY IF EXISTS "Creators or admins can delete requisitions" ON public.procurement_requisitions;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_procurement_requisitions_updated_at ON public.procurement_requisitions;

-- Drop the table if it exists and recreate it
DROP TABLE IF EXISTS public.procurement_requisitions CASCADE;

-- Create procurement_requisitions table
CREATE TABLE public.procurement_requisitions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  req_id TEXT NOT NULL,
  item_name TEXT NOT NULL,
  description TEXT,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC,
  estimated_cost NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  date_submitted DATE NOT NULL DEFAULT CURRENT_DATE,
  budget_source TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed', 'cancelled')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  category TEXT,
  department TEXT,
  requested_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  due_date DATE,
  justification TEXT,
  notes TEXT,
  attachments TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_req_id_per_org UNIQUE (org_id, req_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_procurement_requisitions_org_id ON public.procurement_requisitions(org_id);
CREATE INDEX idx_procurement_requisitions_status ON public.procurement_requisitions(status);
CREATE INDEX idx_procurement_requisitions_priority ON public.procurement_requisitions(priority);
CREATE INDEX idx_procurement_requisitions_requested_by ON public.procurement_requisitions(requested_by);
CREATE INDEX idx_procurement_requisitions_date_submitted ON public.procurement_requisitions(date_submitted);
CREATE INDEX idx_procurement_requisitions_budget_source ON public.procurement_requisitions(budget_source);
CREATE INDEX idx_procurement_requisitions_category ON public.procurement_requisitions(category);

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_procurement_requisitions_updated_at
  BEFORE UPDATE ON public.procurement_requisitions
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Enable Row Level Security
ALTER TABLE public.procurement_requisitions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Org members can view requisitions"
  ON public.procurement_requisitions
  FOR SELECT
  USING (is_org_member(org_id));

CREATE POLICY "Org members can create requisitions"
  ON public.procurement_requisitions
  FOR INSERT
  WITH CHECK (is_org_member(org_id) AND requested_by = auth.uid());

CREATE POLICY "Creators or admins can update requisitions"
  ON public.procurement_requisitions
  FOR UPDATE
  USING (requested_by = auth.uid() OR is_org_admin(org_id));

CREATE POLICY "Creators or admins can delete requisitions"
  ON public.procurement_requisitions
  FOR DELETE
  USING (requested_by = auth.uid() OR is_org_admin(org_id));

-- Insert sample data
INSERT INTO public.procurement_requisitions (
  org_id,
  req_id,
  item_name,
  description,
  quantity,
  unit_price,
  estimated_cost,
  currency,
  status,
  priority,
  category,
  budget_source,
  requested_by,
  due_date,
  justification
)
SELECT 
  o.id,
  'REQ-001',
  'Office Supplies',
  'Various office supplies including stationery, paper, and pens',
  50,
  25.00,
  1250.00,
  'USD',
  'pending',
  'medium',
  'Office Equipment',
  'Operations Budget',
  p.id,
  CURRENT_DATE + INTERVAL '30 days',
  'Regular monthly office supplies replenishment'
FROM public.organizations o
CROSS JOIN LATERAL (
  SELECT id FROM public.profiles WHERE org_id = o.id LIMIT 1
) p
LIMIT 1;

INSERT INTO public.procurement_requisitions (
  org_id,
  req_id,
  item_name,
  description,
  quantity,
  unit_price,
  estimated_cost,
  currency,
  status,
  priority,
  category,
  budget_source,
  requested_by,
  due_date,
  justification
)
SELECT 
  o.id,
  'REQ-002',
  'Laptop Computers',
  'High-performance laptops for development team',
  5,
  1500.00,
  7500.00,
  'USD',
  'approved',
  'high',
  'IT Equipment',
  'Technology Budget',
  p.id,
  CURRENT_DATE + INTERVAL '15 days',
  'Team expansion requires additional computing resources'
FROM public.organizations o
CROSS JOIN LATERAL (
  SELECT id FROM public.profiles WHERE org_id = o.id LIMIT 1
) p
LIMIT 1;