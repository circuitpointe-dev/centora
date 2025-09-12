-- Create role_requests table for proper role request management
CREATE TABLE public.role_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid NOT NULL,
  org_id uuid NOT NULL,
  requested_role text NOT NULL,
  modules text[] DEFAULT '{}',
  message text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  reviewed_by uuid,
  reviewed_at timestamp with time zone
);

-- Enable RLS
ALTER TABLE public.role_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own role requests" 
ON public.role_requests 
FOR INSERT 
WITH CHECK (profile_id = auth.uid() AND is_org_member(org_id));

CREATE POLICY "Users can view role requests in their org" 
ON public.role_requests 
FOR SELECT 
USING (is_org_member(org_id));

CREATE POLICY "Org admins can update role requests" 
ON public.role_requests 
FOR UPDATE 
USING (is_org_admin(org_id));

CREATE POLICY "Org admins can delete role requests" 
ON public.role_requests 
FOR DELETE 
USING (is_org_admin(org_id));

-- Add trigger for updated_at
CREATE TRIGGER set_role_requests_updated_at
  BEFORE UPDATE ON public.role_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();