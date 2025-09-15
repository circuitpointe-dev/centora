-- Create e-signature field data storage table
CREATE TABLE public.esignature_fields (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  field_type TEXT NOT NULL CHECK (field_type IN ('signature', 'name', 'date', 'email', 'text')),
  field_label TEXT NOT NULL,
  position_x NUMERIC NOT NULL,
  position_y NUMERIC NOT NULL,
  width NUMERIC NOT NULL DEFAULT 140,
  height NUMERIC NOT NULL DEFAULT 32,
  page_number INTEGER NOT NULL DEFAULT 1,
  is_required BOOLEAN NOT NULL DEFAULT true,
  field_value TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on esignature_fields table
ALTER TABLE public.esignature_fields ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for esignature_fields
CREATE POLICY "Document creators or admins can manage esignature fields"
ON public.esignature_fields
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.documents d
    WHERE d.id = esignature_fields.document_id 
    AND (is_org_admin(d.org_id) OR d.created_by = auth.uid())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.documents d
    WHERE d.id = esignature_fields.document_id 
    AND (is_org_admin(d.org_id) OR d.created_by = auth.uid())
  )
);

CREATE POLICY "Org members can view esignature fields"
ON public.esignature_fields
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.documents d
    WHERE d.id = esignature_fields.document_id 
    AND is_org_member(d.org_id)
  )
);

-- Create trigger for automatic updated_at timestamp
CREATE TRIGGER update_esignature_fields_updated_at
  BEFORE UPDATE ON public.esignature_fields
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();