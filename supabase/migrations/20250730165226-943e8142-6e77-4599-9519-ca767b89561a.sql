-- Fix RLS policy for profiles table - add INSERT policy
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (id = auth.uid());

-- Update organizations table to allow INSERT during registration
CREATE POLICY "Allow organization creation during signup" 
ON public.organizations 
FOR INSERT 
WITH CHECK (true);