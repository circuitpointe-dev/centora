-- Create GRN (Goods Received Notes) tables
CREATE TYPE grn_status AS ENUM ('pending', 'partial', 'completed', 'approved', 'rejected');
CREATE TYPE delivery_status AS ENUM ('pending', 'partial', 'completed', 'overdue');

-- GRN table
CREATE TABLE public.goods_received_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  grn_number TEXT NOT NULL,
  po_id UUID NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  item_description TEXT,
  quantity_ordered INTEGER NOT NULL,
  quantity_received INTEGER NOT NULL DEFAULT 0,
  unit_price DECIMAL(15,2),
  total_amount DECIMAL(15,2),
  currency TEXT NOT NULL DEFAULT 'USD',
  delivery_date DATE NOT NULL,
  received_date DATE,
  status grn_status NOT NULL DEFAULT 'pending',
  delivery_status delivery_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  received_by UUID REFERENCES public.profiles(id),
  approved_by UUID REFERENCES public.profiles(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(org_id, grn_number)
);

-- GRN attachments table
CREATE TABLE public.grn_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  grn_id UUID NOT NULL REFERENCES public.goods_received_notes(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  uploaded_by UUID NOT NULL REFERENCES public.profiles(id),
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- GRN comments table
CREATE TABLE public.grn_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  grn_id UUID NOT NULL REFERENCES public.goods_received_notes(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.goods_received_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grn_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grn_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for goods_received_notes
CREATE POLICY "Users can view GRNs in their org" 
ON public.goods_received_notes FOR SELECT 
USING (is_org_member(org_id));

CREATE POLICY "Users can create GRNs in their org" 
ON public.goods_received_notes FOR INSERT 
WITH CHECK (is_org_member(org_id) AND created_by = auth.uid());

CREATE POLICY "Users can update GRNs in their org" 
ON public.goods_received_notes FOR UPDATE 
USING (is_org_member(org_id));

CREATE POLICY "Users can delete GRNs in their org" 
ON public.goods_received_notes FOR DELETE 
USING (is_org_member(org_id));

-- RLS Policies for grn_attachments
CREATE POLICY "Users can view GRN attachments in their org" 
ON public.grn_attachments FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.goods_received_notes grn 
  WHERE grn.id = grn_attachments.grn_id AND is_org_member(grn.org_id)
));

CREATE POLICY "Users can create GRN attachments in their org" 
ON public.grn_attachments FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.goods_received_notes grn 
  WHERE grn.id = grn_attachments.grn_id AND is_org_member(grn.org_id)
) AND uploaded_by = auth.uid());

-- RLS Policies for grn_comments
CREATE POLICY "Users can view GRN comments in their org" 
ON public.grn_comments FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.goods_received_notes grn 
  WHERE grn.id = grn_comments.grn_id AND is_org_member(grn.org_id)
));

CREATE POLICY "Users can create GRN comments in their org" 
ON public.grn_comments FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.goods_received_notes grn 
  WHERE grn.id = grn_comments.grn_id AND is_org_member(grn.org_id)
) AND created_by = auth.uid());

-- Create indexes for better performance
CREATE INDEX idx_grn_org_id ON public.goods_received_notes(org_id);
CREATE INDEX idx_grn_po_id ON public.goods_received_notes(po_id);
CREATE INDEX idx_grn_vendor_id ON public.goods_received_notes(vendor_id);
CREATE INDEX idx_grn_status ON public.goods_received_notes(status);
CREATE INDEX idx_grn_delivery_status ON public.goods_received_notes(delivery_status);
CREATE INDEX idx_grn_created_at ON public.goods_received_notes(created_at);

-- Create function to auto-generate GRN number
CREATE OR REPLACE FUNCTION generate_grn_number()
RETURNS TEXT AS $$
DECLARE
    next_number INTEGER;
    grn_number TEXT;
BEGIN
    -- Get the next number for the current org
    SELECT COALESCE(MAX(CAST(SUBSTRING(grn_number FROM 'GRN-(\d+)') AS INTEGER)), 0) + 1
    INTO next_number
    FROM public.goods_received_notes
    WHERE org_id = (SELECT org_id FROM public.profiles WHERE id = auth.uid());
    
    grn_number := 'GRN-' || LPAD(next_number::TEXT, 5, '0');
    RETURN grn_number;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate GRN number
CREATE OR REPLACE FUNCTION set_grn_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.grn_number IS NULL OR NEW.grn_number = '' THEN
        NEW.grn_number := generate_grn_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_grn_number
    BEFORE INSERT ON public.goods_received_notes
    FOR EACH ROW
    EXECUTE FUNCTION set_grn_number();

-- Create function to update delivery status based on quantities
CREATE OR REPLACE FUNCTION update_grn_delivery_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Update delivery status based on quantity received vs ordered
    IF NEW.quantity_received = 0 THEN
        NEW.delivery_status := 'pending';
    ELSIF NEW.quantity_received < NEW.quantity_ordered THEN
        NEW.delivery_status := 'partial';
    ELSIF NEW.quantity_received >= NEW.quantity_ordered THEN
        NEW.delivery_status := 'completed';
    END IF;
    
    -- Check if delivery is overdue
    IF NEW.delivery_date < CURRENT_DATE AND NEW.delivery_status != 'completed' THEN
        NEW.delivery_status := 'overdue';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_grn_delivery_status
    BEFORE INSERT OR UPDATE ON public.goods_received_notes
    FOR EACH ROW
    EXECUTE FUNCTION update_grn_delivery_status();
