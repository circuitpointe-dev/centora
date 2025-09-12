-- Create documents system tables

-- Document categories enum
CREATE TYPE document_category AS ENUM ('policies', 'finance', 'contracts', 'm-e', 'uncategorized', 'templates', 'compliance');

-- Document status enum  
CREATE TYPE document_status AS ENUM ('draft', 'active', 'archived', 'expired', 'pending_approval');

-- Template status enum
CREATE TYPE template_status AS ENUM ('active', 'draft', 'archived');

-- Signature status enum
CREATE TYPE signature_status AS ENUM ('pending', 'signed', 'declined', 'expired');

-- Main documents table
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL,
  title TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  category document_category NOT NULL DEFAULT 'uncategorized',
  status document_status NOT NULL DEFAULT 'draft',
  description TEXT,
  version VARCHAR(20) DEFAULT '1.0',
  is_template BOOLEAN DEFAULT FALSE,
  template_category TEXT,
  created_by UUID NOT NULL,
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Document tags table
CREATE TABLE public.document_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  bg_color TEXT NOT NULL DEFAULT 'bg-blue-100',
  text_color TEXT NOT NULL DEFAULT 'text-blue-800',
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(org_id, name)
);

-- Document tag associations
CREATE TABLE public.document_tag_associations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL,
  tag_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(document_id, tag_id)
);

-- Policy documents (extends documents for compliance tracking)
CREATE TABLE public.policy_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL,
  effective_date DATE NOT NULL,
  expires_date DATE,
  department TEXT,
  policy_content JSONB, -- For structured policy content (overview, scope, guidelines, etc.)
  acknowledgment_required BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Policy acknowledgments
CREATE TABLE public.policy_acknowledgments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  policy_document_id UUID NOT NULL,
  user_id UUID NOT NULL,
  acknowledged_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT,
  UNIQUE(policy_document_id, user_id)
);

-- Document signatures
CREATE TABLE public.document_signatures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL,
  signer_email TEXT NOT NULL,
  signer_name TEXT,
  status signature_status NOT NULL DEFAULT 'pending',
  signed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  signature_data JSONB, -- Store signature coordinates, etc.
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Document sharing and permissions
CREATE TABLE public.document_shares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL,
  shared_with_email TEXT NOT NULL,
  shared_with_name TEXT,
  permission_level TEXT NOT NULL DEFAULT 'view', -- view, edit, sign
  expires_at TIMESTAMP WITH TIME ZONE,
  access_token TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Document version history
CREATE TABLE public.document_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL,
  version VARCHAR(20) NOT NULL,
  file_path TEXT NOT NULL,
  changes_description TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Enable RLS on all tables
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_tag_associations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policy_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policy_acknowledgments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for documents
CREATE POLICY "Org members can view documents" ON public.documents
  FOR SELECT USING (is_org_member(org_id));

CREATE POLICY "Org members can create documents" ON public.documents
  FOR INSERT WITH CHECK (is_org_member(org_id) AND created_by = auth.uid());

CREATE POLICY "Creators or admins can update documents" ON public.documents
  FOR UPDATE USING ((created_by = auth.uid()) OR is_org_admin(org_id));

CREATE POLICY "Creators or admins can delete documents" ON public.documents
  FOR DELETE USING ((created_by = auth.uid()) OR is_org_admin(org_id));

-- RLS Policies for document tags
CREATE POLICY "Org members can view tags" ON public.document_tags
  FOR SELECT USING (is_org_member(org_id));

CREATE POLICY "Org members can create tags" ON public.document_tags
  FOR INSERT WITH CHECK (is_org_member(org_id) AND created_by = auth.uid());

CREATE POLICY "Creators or admins can manage tags" ON public.document_tags
  FOR ALL USING ((created_by = auth.uid()) OR is_org_admin(org_id));

-- RLS Policies for tag associations
CREATE POLICY "Org members can view tag associations" ON public.document_tag_associations
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM documents d WHERE d.id = document_id AND is_org_member(d.org_id)
  ));

CREATE POLICY "Org members can manage tag associations" ON public.document_tag_associations
  FOR ALL USING (EXISTS (
    SELECT 1 FROM documents d WHERE d.id = document_id AND 
    (is_org_admin(d.org_id) OR d.created_by = auth.uid())
  ));

-- RLS Policies for policy documents
CREATE POLICY "Org members can view policy documents" ON public.policy_documents
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM documents d WHERE d.id = document_id AND is_org_member(d.org_id)
  ));

CREATE POLICY "Document creators or admins can manage policy documents" ON public.policy_documents
  FOR ALL USING (EXISTS (
    SELECT 1 FROM documents d WHERE d.id = document_id AND 
    (is_org_admin(d.org_id) OR d.created_by = auth.uid())
  ));

-- RLS Policies for policy acknowledgments
CREATE POLICY "Users can view their own acknowledgments" ON public.policy_acknowledgments
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can acknowledge policies" ON public.policy_acknowledgments
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Org admins can view all acknowledgments" ON public.policy_acknowledgments
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM policy_documents pd 
    JOIN documents d ON d.id = pd.document_id 
    WHERE pd.id = policy_document_id AND is_org_admin(d.org_id)
  ));

-- RLS Policies for document signatures
CREATE POLICY "Org members can view signatures" ON public.document_signatures
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM documents d WHERE d.id = document_id AND is_org_member(d.org_id)
  ));

CREATE POLICY "Document creators or admins can manage signatures" ON public.document_signatures
  FOR ALL USING (EXISTS (
    SELECT 1 FROM documents d WHERE d.id = document_id AND 
    (is_org_admin(d.org_id) OR d.created_by = auth.uid())
  ));

-- RLS Policies for document shares
CREATE POLICY "Document creators or admins can manage shares" ON public.document_shares
  FOR ALL USING (EXISTS (
    SELECT 1 FROM documents d WHERE d.id = document_id AND 
    (is_org_admin(d.org_id) OR d.created_by = auth.uid())
  ));

-- RLS Policies for document versions
CREATE POLICY "Org members can view versions" ON public.document_versions
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM documents d WHERE d.id = document_id AND is_org_member(d.org_id)
  ));

CREATE POLICY "Document creators or admins can manage versions" ON public.document_versions
  FOR ALL USING (EXISTS (
    SELECT 1 FROM documents d WHERE d.id = document_id AND 
    (is_org_admin(d.org_id) OR d.created_by = auth.uid())
  ));

-- Storage policies for documents bucket
CREATE POLICY "Org members can view documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents' AND 
    auth.uid()::text = (storage.foldername(name))[1] OR
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.org_id::text = (storage.foldername(name))[1]
    )
  );

CREATE POLICY "Org members can upload documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'documents' AND
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.org_id::text = (storage.foldername(name))[1]
    )
  );

CREATE POLICY "Document owners can update/delete" ON storage.objects
  FOR ALL USING (bucket_id = 'documents' AND 
    auth.uid()::text = (storage.foldername(name))[2] OR
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.org_id::text = (storage.foldername(name))[1] AND p.role = 'org_admin'
    )
  );

-- Create indexes for performance
CREATE INDEX idx_documents_org_id ON public.documents(org_id);
CREATE INDEX idx_documents_category ON public.documents(category);
CREATE INDEX idx_documents_created_by ON public.documents(created_by);
CREATE INDEX idx_documents_is_template ON public.documents(is_template);
CREATE INDEX idx_document_tags_org_id ON public.document_tags(org_id);
CREATE INDEX idx_document_tag_associations_document_id ON public.document_tag_associations(document_id);
CREATE INDEX idx_policy_documents_document_id ON public.policy_documents(document_id);
CREATE INDEX idx_policy_acknowledgments_policy_document_id ON public.policy_acknowledgments(policy_document_id);
CREATE INDEX idx_policy_acknowledgments_user_id ON public.policy_acknowledgments(user_id);
CREATE INDEX idx_document_signatures_document_id ON public.document_signatures(document_id);
CREATE INDEX idx_document_shares_document_id ON public.document_shares(document_id);
CREATE INDEX idx_document_versions_document_id ON public.document_versions(document_id);

-- Create triggers for updated_at
CREATE TRIGGER set_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_policy_documents_updated_at
  BEFORE UPDATE ON public.policy_documents
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_document_signatures_updated_at
  BEFORE UPDATE ON public.document_signatures
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();