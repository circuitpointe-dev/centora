-- Add is_super_admin column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN is_super_admin boolean NOT NULL DEFAULT false;

-- Update existing profiles to have correct default value
UPDATE public.profiles 
SET is_super_admin = false 
WHERE is_super_admin IS NULL;