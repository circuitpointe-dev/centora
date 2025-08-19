// src/lib/supabase-client.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const SUPABASE_URL = "https://kspzfifdwfpirgqstzhz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzcHpmaWZkd2ZwaXJncXN0emh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NzQ3MzEsImV4cCI6MjA3MDM1MDczMX0.CyJAA3SOpVwptQcX0_FqVsVbqcWwMVvDMyD5fjM0pm8";

export const typedSupabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY, 
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);