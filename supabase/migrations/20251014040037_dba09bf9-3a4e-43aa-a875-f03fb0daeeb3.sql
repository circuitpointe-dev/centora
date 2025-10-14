-- Add cover_image field to proposals table
ALTER TABLE public.proposals
ADD COLUMN cover_image TEXT;

-- Add comment
COMMENT ON COLUMN public.proposals.cover_image IS 'Path to the proposal cover image stored in Supabase storage';