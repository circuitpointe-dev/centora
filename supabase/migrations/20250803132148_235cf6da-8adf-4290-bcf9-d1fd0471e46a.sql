-- Add unique constraints for ON CONFLICT to work
ALTER TABLE public.organization_contacts 
ADD CONSTRAINT organization_contacts_org_email_unique 
UNIQUE (organization_id, email);

ALTER TABLE public.organization_modules 
ADD CONSTRAINT organization_modules_org_module_unique 
UNIQUE (organization_id, module_name);

-- Update auth settings to disable email confirmation for now
UPDATE auth.config 
SET enable_signup = true, 
    enable_email_confirmations = false,
    enable_email_change_confirmations = false
WHERE true;