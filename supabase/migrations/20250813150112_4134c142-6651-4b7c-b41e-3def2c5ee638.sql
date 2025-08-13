-- Check if donor-documents bucket exists and create it if not
INSERT INTO storage.buckets (id, name, public) 
VALUES ('donor-documents', 'donor-documents', false)
ON CONFLICT (id) DO NOTHING;