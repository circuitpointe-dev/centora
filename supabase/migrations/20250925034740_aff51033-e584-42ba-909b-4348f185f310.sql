-- Create audit logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id),
  actor_name TEXT,
  actor_email TEXT,
  target_user_id UUID REFERENCES auth.users(id),
  target_user_name TEXT,
  target_user_email TEXT,
  action TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS if table was created
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_policy WHERE polname = 'Super admins can view audit logs') THEN
    ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Super admins can view audit logs" 
    ON public.audit_logs 
    FOR SELECT 
    USING (EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_super_admin = true
    ));
  END IF;
END
$$;

-- Add sample audit logs
INSERT INTO public.audit_logs (actor_name, actor_email, target_user_name, target_user_email, action, metadata, ip_address, created_at) VALUES
('System', 'noreply@circuitpointe.com', 'Emily Carter', 'emily.carter@circuitpointe.com', 'PASSWORD_RESET_SENT', '{}', '192.168.1.1', NOW() - INTERVAL '2 hours'),
('Olivia Brown', 'olivia.brown@circuitpointe.com', 'Lucas Martin', 'lucas.martin@circuitpointe.com', 'ROLE_CHANGED', '{"from": "Support Agent", "to": "Audit Manager"}', '10.0.0.15', NOW() - INTERVAL '4 hours'),
('Olivia Brown', 'olivia.brown@circuitpointe.com', 'Lucas Martin', 'lucas.martin@circuitpointe.com', 'USER_CREATED', '{}', '10.0.0.15', NOW() - INTERVAL '6 hours'),
('Jack Jonathan', 'jack.jonathan@circuitpointe.com', 'Jack Jonathan', 'jack.jonathan@circuitpointe.com', 'STATUS_CHANGED', '{"from": "suspended", "to": "active"}', '192.168.1.100', NOW() - INTERVAL '8 hours');