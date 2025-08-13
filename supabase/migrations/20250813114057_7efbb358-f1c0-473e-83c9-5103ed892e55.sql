-- Create enum for donor status
CREATE TYPE donor_status AS ENUM ('active', 'inactive', 'potential');

-- Create donors table
CREATE TABLE public.donors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL,
  name TEXT NOT NULL,
  affiliation TEXT,
  organization_url TEXT,
  funding_start_date DATE,
  funding_end_date DATE,
  notes TEXT,
  status donor_status NOT NULL DEFAULT 'potential',
  total_donations NUMERIC DEFAULT 0,
  last_donation_date DATE,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(org_id, name)
);

-- Create donor contacts table
CREATE TABLE public.donor_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_id UUID NOT NULL REFERENCES public.donors(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create donor focus areas junction table
CREATE TABLE public.donor_focus_areas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_id UUID NOT NULL REFERENCES public.donors(id) ON DELETE CASCADE,
  focus_area_id UUID NOT NULL REFERENCES public.focus_areas(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(donor_id, focus_area_id)
);

-- Create donor documents table
CREATE TABLE public.donor_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_id UUID NOT NULL REFERENCES public.donors(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  uploaded_by UUID NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for donor documents
INSERT INTO storage.buckets (id, name, public) VALUES ('donor-documents', 'donor-documents', false);

-- Enable RLS on all tables
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_focus_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_documents ENABLE ROW LEVEL SECURITY;

-- RLS policies for donors table
CREATE POLICY "Org members can view donors" 
ON public.donors 
FOR SELECT 
USING (is_org_member(org_id));

CREATE POLICY "Org members can create donors" 
ON public.donors 
FOR INSERT 
WITH CHECK (is_org_member(org_id) AND created_by = auth.uid());

CREATE POLICY "Creators or admins can update donors" 
ON public.donors 
FOR UPDATE 
USING ((created_by = auth.uid()) OR is_org_admin(org_id))
WITH CHECK ((created_by = auth.uid()) OR is_org_admin(org_id));

CREATE POLICY "Creators or admins can delete donors" 
ON public.donors 
FOR DELETE 
USING ((created_by = auth.uid()) OR is_org_admin(org_id));

-- RLS policies for donor_contacts table
CREATE POLICY "Users can view donor contacts" 
ON public.donor_contacts 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.donors d 
    WHERE d.id = donor_contacts.donor_id 
    AND is_org_member(d.org_id)
  )
);

CREATE POLICY "Users can manage donor contacts" 
ON public.donor_contacts 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.donors d 
    WHERE d.id = donor_contacts.donor_id 
    AND (is_org_admin(d.org_id) OR d.created_by = auth.uid())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.donors d 
    WHERE d.id = donor_contacts.donor_id 
    AND (is_org_admin(d.org_id) OR d.created_by = auth.uid())
  )
);

-- RLS policies for donor_focus_areas table
CREATE POLICY "Users can view donor focus areas" 
ON public.donor_focus_areas 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.donors d 
    WHERE d.id = donor_focus_areas.donor_id 
    AND is_org_member(d.org_id)
  )
);

CREATE POLICY "Users can manage donor focus areas" 
ON public.donor_focus_areas 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.donors d 
    WHERE d.id = donor_focus_areas.donor_id 
    AND (is_org_admin(d.org_id) OR d.created_by = auth.uid())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.donors d 
    WHERE d.id = donor_focus_areas.donor_id 
    AND (is_org_admin(d.org_id) OR d.created_by = auth.uid())
  )
);

-- RLS policies for donor_documents table
CREATE POLICY "Users can view donor documents" 
ON public.donor_documents 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.donors d 
    WHERE d.id = donor_documents.donor_id 
    AND is_org_member(d.org_id)
  )
);

CREATE POLICY "Users can manage donor documents" 
ON public.donor_documents 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.donors d 
    WHERE d.id = donor_documents.donor_id 
    AND (is_org_admin(d.org_id) OR d.created_by = auth.uid())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.donors d 
    WHERE d.id = donor_documents.donor_id 
    AND (is_org_admin(d.org_id) OR d.created_by = auth.uid())
  )
);

-- Storage policies for donor documents
CREATE POLICY "Users can view their org's donor documents" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'donor-documents' AND
  EXISTS (
    SELECT 1 FROM public.donors d 
    WHERE is_org_member(d.org_id) 
    AND (storage.foldername(name))[1] = d.org_id::text
  )
);

CREATE POLICY "Users can upload donor documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'donor-documents' AND
  EXISTS (
    SELECT 1 FROM public.donors d 
    WHERE (is_org_admin(d.org_id) OR d.created_by = auth.uid())
    AND (storage.foldername(name))[1] = d.org_id::text
  )
);

CREATE POLICY "Users can update their org's donor documents" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'donor-documents' AND
  EXISTS (
    SELECT 1 FROM public.donors d 
    WHERE (is_org_admin(d.org_id) OR d.created_by = auth.uid())
    AND (storage.foldername(name))[1] = d.org_id::text
  )
);

CREATE POLICY "Users can delete their org's donor documents" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'donor-documents' AND
  EXISTS (
    SELECT 1 FROM public.donors d 
    WHERE (is_org_admin(d.org_id) OR d.created_by = auth.uid())
    AND (storage.foldername(name))[1] = d.org_id::text
  )
);

-- Add triggers for updated_at columns
CREATE TRIGGER update_donors_updated_at
BEFORE UPDATE ON public.donors
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at_column();

CREATE TRIGGER update_donor_contacts_updated_at
BEFORE UPDATE ON public.donor_contacts
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at_column();