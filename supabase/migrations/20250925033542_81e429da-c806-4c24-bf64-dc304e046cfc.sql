-- Add sample audit logs if table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'audit_logs') THEN
    -- Clear existing sample data and add new ones
    DELETE FROM public.audit_logs WHERE actor_name IN ('System', 'Olivia Brown', 'Jack Jonathan');
    
    -- Add sample audit logs
    INSERT INTO public.audit_logs (actor_name, actor_email, target_user_name, target_user_email, action, metadata, ip_address, created_at) VALUES
    ('System', 'noreply@circuitpointe.com', 'Emily Carter', 'emily.carter@circuitpointe.com', 'PASSWORD_RESET_SENT', '{}', '192.168.1.1', NOW() - INTERVAL '2 hours'),
    ('Olivia Brown', 'olivia.brown@circuitpointe.com', 'Lucas Martin', 'lucas.martin@circuitpointe.com', 'ROLE_CHANGED', '{"from": "Support Agent", "to": "Audit Manager"}', '10.0.0.15', NOW() - INTERVAL '4 hours'),
    ('Olivia Brown', 'olivia.brown@circuitpointe.com', 'Lucas Martin', 'lucas.martin@circuitpointe.com', 'USER_CREATED', '{}', '10.0.0.15', NOW() - INTERVAL '6 hours'),
    ('Jack Jonathan', 'jack.jonathan@circuitpointe.com', 'Jack Jonathan', 'jack.jonathan@circuitpointe.com', 'STATUS_CHANGED', '{"from": "suspended", "to": "active"}', '192.168.1.100', NOW() - INTERVAL '8 hours'),
    ('Darlene Robertson', 'darlene.robertson@circuitpointe.com', 'Emily Carter', 'emily.carter@circuitpointe.com', 'USER_SUSPENDED', '{"reason": "Policy violation"}', '172.16.0.10', NOW() - INTERVAL '12 hours'),
    ('System', 'noreply@circuitpointe.com', 'Noah Williams', 'noah.williams@circuitpointe.com', 'INVITE_SENT', '{}', '203.0.113.5', NOW() - INTERVAL '1 day'),
    ('Lucas Martin', 'lucas.martin@circuitpointe.com', 'Lucas Martin', 'lucas.martin@circuitpointe.com', 'LOGIN', '{}', '198.51.100.42', NOW() - INTERVAL '30 minutes');
  END IF;
END
$$;