-- Fix policy_acknowledgments table creation
DROP TABLE IF EXISTS public.policy_acknowledgments;

CREATE TABLE IF NOT EXISTS public.policy_acknowledgments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'acknowledged', 'expired')),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, document_id)
);

-- Enable RLS for policy_acknowledgments
ALTER TABLE public.policy_acknowledgments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for policy_acknowledgments
CREATE POLICY "Users can view policy acknowledgments" 
ON public.policy_acknowledgments FOR SELECT 
USING (
  document_id IN (
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

-- Create trigger for updated_at column
CREATE TRIGGER update_policy_acknowledgments_updated_at
  BEFORE UPDATE ON public.policy_acknowledgments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();