import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateOrgUserRequest {
  org_id: string
  email: string
  full_name: string
  department_id?: string | null
  role_ids?: string[]
  access_json?: unknown
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing authorization header')
    }

    // Create Supabase client with service role for admin operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Verify the user is authenticated and get their session
    const userClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!)
    const { data: { user }, error: authError } = await userClient.auth.getUser(authHeader.replace('Bearer ', ''))
    
    if (authError || !user) {
      console.error('Auth error:', authError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const body: CreateOrgUserRequest = await req.json()
    const { org_id, email, full_name, department_id, role_ids = [], access_json = {} } = body

    // Validate required fields
    if (!org_id || !email || !full_name) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: org_id, email, full_name' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify caller is admin of the organization
    const { data: callerProfile } = await supabase
      .from('profiles')
      .select('role, org_id')
      .eq('id', user.id)
      .single()

    if (!callerProfile || callerProfile.org_id !== org_id || callerProfile.role !== 'org_admin') {
      return new Response(
        JSON.stringify({ error: 'Insufficient permissions' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Creating user for org:', org_id, 'email:', email)

    // 1. Create auth user with a temporary password
    const { data: authUser, error: createUserError } = await supabase.auth.admin.createUser({
      email,
      password: 'TempPassword123!', // User should reset this on first login
      email_confirm: true,
      user_metadata: {
        full_name
      }
    })

    if (createUserError || !authUser.user) {
      console.error('Failed to create auth user:', createUserError)
      return new Response(
        JSON.stringify({ error: `Failed to create user: ${createUserError?.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Auth user created:', authUser.user.id)

    // 2. Create profile with access_json
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authUser.user.id,
        org_id,
        email,
        full_name,
        department_id: department_id || null,
        access_json,
        status: 'active',
        role: 'org_member'
      })

    if (profileError) {
      console.error('Failed to create profile:', profileError)
      // Clean up auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authUser.user.id)
      return new Response(
        JSON.stringify({ error: `Failed to create profile: ${profileError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Profile created successfully')

    // 3. Create user roles
    if (role_ids.length > 0) {
      const roleInserts = role_ids.map(role_id => ({
        profile_id: authUser.user.id,
        role_id,
        assigned_by: user.id
      }))

      const { error: rolesError } = await supabase
        .from('user_roles')
        .insert(roleInserts)

      if (rolesError) {
        console.error('Failed to assign roles:', rolesError)
        // Continue anyway, roles can be assigned later
      } else {
        console.log('Roles assigned successfully:', role_ids)
      }
    }

    // Return success response
    return new Response(
      JSON.stringify({
        ok: true,
        user_id: authUser.user.id,
        org_id,
        email,
        role_ids,
        message: 'User created successfully'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in admin-create-org-user:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})