-- Ensure unique admin email and stronger referential integrity for atomic registration cleanup

-- 1) Unique email for profiles (aligns with Auth unique email)
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_email_unique UNIQUE (email);

-- 2) Add foreign keys with cascade to avoid orphans if org is deleted
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_org_id_fkey
  FOREIGN KEY (org_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE public.organization_modules
  ADD CONSTRAINT organization_modules_org_id_fkey
  FOREIGN KEY (org_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

-- 3) Keep updated_at current on profiles updates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_profiles_updated_at'
  ) THEN
    CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;