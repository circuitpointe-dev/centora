-- Create donor_compliance_notes table
CREATE TABLE IF NOT EXISTS public.donor_compliance_notes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID NOT NULL,
    grant_id UUID NOT NULL REFERENCES public.donor_grants(id) ON DELETE CASCADE,
    document_id UUID NOT NULL,
    compliance_date DATE NOT NULL,
    audit_status TEXT NOT NULL DEFAULT 'pending',
    responsible_officer TEXT NOT NULL,
    notes TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.donor_compliance_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Org members can view compliance notes"
    ON public.donor_compliance_notes
    FOR SELECT
    USING (
        org_id IN (
            SELECT org_id FROM profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Org admins can manage compliance notes"
    ON public.donor_compliance_notes
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND org_id = donor_compliance_notes.org_id
            AND (role = 'org_admin'::app_role OR is_super_admin = true)
        )
    );

-- Create updated_at trigger using the correct function
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.donor_compliance_notes
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- Create indexes
CREATE INDEX idx_donor_compliance_notes_org_id ON public.donor_compliance_notes(org_id);
CREATE INDEX idx_donor_compliance_notes_grant_id ON public.donor_compliance_notes(grant_id);
CREATE INDEX idx_donor_compliance_notes_compliance_date ON public.donor_compliance_notes(compliance_date);