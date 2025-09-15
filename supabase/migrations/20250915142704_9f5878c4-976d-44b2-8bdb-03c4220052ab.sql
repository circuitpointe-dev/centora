-- Create signature_requests table
CREATE TABLE IF NOT EXISTS public.signature_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'signed', 'expired', 'cancelled')),
  message TEXT,
  deadline TIMESTAMP WITH TIME ZONE,
  signed_at TIMESTAMP WITH TIME ZONE,
  signature_data JSONB,
  org_id UUID NOT NULL REFERENCES public.organizations(id),
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create document_signatures table (if not exists)
CREATE TABLE IF NOT EXISTS public.document_signatures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  signer_email TEXT NOT NULL,
  signer_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'signed', 'declined', 'expired')),
  expires_at TIMESTAMP WITH TIME ZONE,
  signed_at TIMESTAMP WITH TIME ZONE,
  signature_data JSONB,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create policy_acknowledgments table (if not exists)
CREATE TABLE IF NOT EXISTS public.policy_acknowledgments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  policy_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'acknowledged', 'expired')),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, policy_id)
);

-- Add expiry_date column to documents if not exists
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'documents' AND column_name = 'expiry_date') THEN
    ALTER TABLE public.documents ADD COLUMN expiry_date TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- Add is_template column to documents if not exists
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'documents' AND column_name = 'is_template') THEN
    ALTER TABLE public.documents ADD COLUMN is_template BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- Add template_category column to documents if not exists
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'documents' AND column_name = 'template_category') THEN
    ALTER TABLE public.documents ADD COLUMN template_category TEXT;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE public.signature_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policy_acknowledgments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for signature_requests
CREATE POLICY "Users can view signature requests from their org" 
ON public.signature_requests FOR SELECT 
USING (
  org_id IN (
    SELECT org_id FROM public.profiles 
    WHERE id = auth.uid()
  )
);

CREATE POLICY "Users can create signature requests" 
ON public.signature_requests FOR INSERT 
WITH CHECK (
  org_id IN (
    SELECT org_id FROM public.profiles 
    WHERE id = auth.uid()
  )
);

CREATE POLICY "Users can update signature requests from their org" 
ON public.signature_requests FOR UPDATE 
USING (
  org_id IN (
    SELECT org_id FROM public.profiles 
    WHERE id = auth.uid()
  )
);

-- Create RLS policies for document_signatures
CREATE POLICY "Users can view document signatures" 
ON public.document_signatures FOR SELECT 
USING (
  document_id IN (
    SELECT id FROM public.documents 
    WHERE org_id IN (
      SELECT org_id FROM public.profiles 
      WHERE id = auth.uid()
    )
  )
);

CREATE POLICY "Users can create document signatures" 
ON public.document_signatures FOR INSERT 
WITH CHECK (
  document_id IN (
    SELECT id FROM public.documents 
    WHERE org_id IN (
      SELECT org_id FROM public.profiles 
      WHERE id = auth.uid()
    )
  )
);

CREATE POLICY "Users can update document signatures" 
ON public.document_signatures FOR UPDATE 
USING (
  document_id IN (
    SELECT id FROM public.documents 
    WHERE org_id IN (
      SELECT org_id FROM public.profiles 
      WHERE id = auth.uid()
    )
  )
);

-- Create RLS policies for policy_acknowledgments
CREATE POLICY "Users can view policy acknowledgments" 
ON public.policy_acknowledgments FOR SELECT 
USING (
  policy_id IN (
    SELECT id FROM public.documents 
    WHERE org_id IN (
      SELECT org_id FROM public.profiles 
      WHERE id = auth.uid()
    )
  )
);

CREATE POLICY "Users can create policy acknowledgments" 
ON public.policy_acknowledgments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own acknowledgments" 
ON public.policy_acknowledgments FOR UPDATE 
USING (auth.uid() = user_id);

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_signature_requests_updated_at
  BEFORE UPDATE ON public.signature_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_document_signatures_updated_at
  BEFORE UPDATE ON public.document_signatures
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_policy_acknowledgments_updated_at
  BEFORE UPDATE ON public.policy_acknowledgments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();