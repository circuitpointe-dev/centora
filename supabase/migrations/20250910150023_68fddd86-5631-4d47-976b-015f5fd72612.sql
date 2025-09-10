-- Create email verification table
CREATE TABLE public.email_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  verification_code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '15 minutes'),
  verified_at TIMESTAMP WITH TIME ZONE NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;

-- Create policies for email verifications
CREATE POLICY "Anyone can create verification records" 
ON public.email_verifications 
FOR INSERT 
WITH CHECK (true);

-- Users can only read their own verification records
CREATE POLICY "Users can read their own verification records" 
ON public.email_verifications 
FOR SELECT 
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Only the system can update verification records
CREATE POLICY "System can update verification records" 
ON public.email_verifications 
FOR UPDATE 
USING (true);

-- Add index on email for faster lookups
CREATE INDEX idx_email_verifications_email ON public.email_verifications(email);

-- Add index on verification code for faster lookups
CREATE INDEX idx_email_verifications_code ON public.email_verifications(verification_code);

-- Create trigger for updated_at
CREATE TRIGGER update_email_verifications_updated_at
  BEFORE UPDATE ON public.email_verifications
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Create function to clean up expired verification codes
CREATE OR REPLACE FUNCTION public.cleanup_expired_verifications()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.email_verifications 
  WHERE expires_at < now() AND verified_at IS NULL;
END;
$$;