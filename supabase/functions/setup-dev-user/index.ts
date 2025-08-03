import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.53.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface DevUserRequest {
  email: string;
  password: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, password }: DevUserRequest = await req.json();

    // Only allow development users
    const isDevelopmentUser = email === 'user@ngo.com' || email === 'user@donor.com';
    
    if (!isDevelopmentUser) {
      return new Response(
        JSON.stringify({ error: 'Not a development user' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    // Validate password
    if (password !== 'Circuit2025$') {
      return new Response(
        JSON.stringify({ error: 'Invalid password' }),
        { 
          status: 401, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    // Check if user already exists in auth.users
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(user => user.email === email);
    
    let userId: string;
    
    if (existingUser) {
      userId = existingUser.id;
    } else {
      // Create the user in auth.users
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Skip email confirmation for dev users
      });

      if (createError || !newUser.user) {
        throw createError || new Error('Failed to create user');
      }

      userId = newUser.user.id;

      // Determine organization details
      const orgData = email === 'user@ngo.com' 
        ? {
            organizationId: '00000000-0000-0000-0000-000000000001',
            fullName: 'NGO User'
          }
        : {
            organizationId: '00000000-0000-0000-0000-000000000002',
            fullName: 'Donor User'
          };

      // Create profile for the user
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          organization_id: orgData.organizationId,
          full_name: orgData.fullName,
          role: 'admin'
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Don't throw, as the user is already created
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Development user ready' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in setup-dev-user function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);