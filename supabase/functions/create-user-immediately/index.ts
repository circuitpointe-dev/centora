import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateUserRequest {
  org_id: string;
  email: string;
  full_name: string;
  department_id?: string;
  role_ids?: string[];
  access?: any;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the service role key from secrets
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!serviceRoleKey) {
      throw new Error('Service role key not configured');
    }

    // Create admin client with service role key and forward caller auth for RPC
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      serviceRoleKey,
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization') ?? '' },
        },
      }
    );

    const body: CreateUserRequest = await req.json();
    const { org_id, email, full_name, department_id, role_ids = [], access } = body;

    console.log('Creating user immediately:', { email, full_name, org_id });

    // Generate a secure random password
    const randomPassword = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .slice(0, 16) + 'Aa1!' // Ensure password meets complexity requirements

    // Step 1: Create user in auth with generated password
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: randomPassword,
      email_confirm: true, // Skip email confirmation
    });

    if (authError) {
      console.error('Auth user creation failed:', authError);
      throw new Error(`Failed to create auth user: ${authError.message}`);
    }

    console.log('Auth user created:', authUser.user.id);

    // Step 2: Create invitation record
    const { data: invitation, error: inviteError } = await supabaseAdmin.rpc('create_user_invitation', {
      _org_id: org_id,
      _email: email,
      _full_name: full_name,
      _department_id: department_id || null,
      _role_ids: role_ids,
      _access: access || {},
      _invited_by: null, // Will use auth.uid() from the authorization header
    });

    if (inviteError) {
      console.error('Invitation creation failed:', inviteError);
      // Cleanup: delete the auth user if invitation creation fails
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      throw new Error(`Failed to create invitation: ${inviteError.message}`);
    }

    console.log('Invitation created:', invitation);

    // Step 3: Accept the invitation immediately with the new user's ID
    const { data: acceptResult, error: acceptError } = await supabaseAdmin.rpc('accept_invitation', {
      _token: invitation.token,
      _user_id: authUser.user.id,
    });

    if (acceptError) {
      console.error('Invitation acceptance failed:', acceptError);
      // Cleanup: delete the auth user and invitation if acceptance fails
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      throw new Error(`Failed to accept invitation: ${acceptError.message}`);
    }

    console.log('Invitation accepted successfully:', acceptResult);

    return new Response(
      JSON.stringify({
        success: true,
        user_id: authUser.user.id,
        temporary_password: randomPassword,
        message: 'User created and activated successfully. Please save the temporary password and share it securely with the user.',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'An unexpected error occurred',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});