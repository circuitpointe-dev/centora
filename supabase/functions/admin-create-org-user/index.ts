// Edge function for demo mode - creates organization user without strict auth requirements
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
    // Get the current user from the JWT token
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
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

    // Create client with user's JWT for authorization checks
    const userSupabase = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: {
        headers: { authorization: authHeader }
      }
    })

    // Verify user is authenticated and get their org
    const { data: { user }, error: userError } = await userSupabase.auth.getUser()
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user's profile to check org membership
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('org_id, is_super_admin')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: 'User profile not found' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Only allow org admins or super admins to create users
    if (!profile.is_super_admin) {
      const { data: isAdmin } = await supabase.rpc('is_org_admin', { _org_id: profile.org_id })
      if (!isAdmin) {
        return new Response(
          JSON.stringify({ error: 'Only organization administrators can create users' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Parse request body
    const body: CreateOrgUserRequest = await req.json()
    const { org_id, email, full_name, department_id, role_ids = [], access_json = {} } = body

    // Validate required fields
    if (!email || !full_name) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email, full_name' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Use the user's organization (or specified org for super admins)
    let targetOrgId = profile.is_super_admin && org_id ? org_id : profile.org_id

    if (!targetOrgId) {
      return new Response(
        JSON.stringify({ error: 'No organization found' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Creating user for org:', targetOrgId, 'email:', email)

    // 1. Create auth user with the standard password
    const { data: authUser, error: createUserError } = await supabase.auth.admin.createUser({
      email,
      password: 'P@$$w0rd', // Standard password for new users
      email_confirm: true,
      user_metadata: {
        full_name,
        org_id: targetOrgId
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
    const { error: profileUpsertError } = await supabase
      .from('profiles')
      .upsert({
        id: authUser.user.id,
        org_id: targetOrgId,
        email,
        full_name,
        department_id: department_id || null,
        access_json,
        status: 'active',
        role: 'org_member'
      })

    if (profileUpsertError) {
      console.error('Failed to create profile:', profileUpsertError)
      // Clean up auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authUser.user.id)
      return new Response(
        JSON.stringify({ error: `Failed to create profile: ${profileUpsertError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Profile created successfully')

    // 3. Create user roles
    if (role_ids.length > 0) {
      const roleInserts = role_ids.map(role_id => ({
        profile_id: authUser.user.id,
        role_id,
        assigned_by: authUser.user.id // Self-assigned for demo
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

    // 4. Create user module access records based on access_json
    if (access_json && typeof access_json === 'object' && Object.keys(access_json).length > 0) {
      const moduleAccessRecords = Object.entries(access_json as Record<string, any>)
        .filter(([_, moduleData]) => moduleData && typeof moduleData === 'object' && '_module' in moduleData)
        .map(([moduleKey, moduleData]) => ({
          profile_id: authUser.user.id,
          org_id: targetOrgId,
          module_key: moduleKey,
          has_access: Boolean(moduleData._module),
          created_by: authUser.user.id // Self-assigned for demo
        }))

      if (moduleAccessRecords.length > 0) {
        const { error: moduleAccessError } = await supabase
          .from('user_module_access')
          .insert(moduleAccessRecords)

        if (moduleAccessError) {
          console.error('Failed to create module access records:', moduleAccessError)
          // Continue anyway, module access can be set later
        } else {
          console.log('Module access records created successfully:', moduleAccessRecords.length)
        }
      }
    }

    // Return success response
    return new Response(
      JSON.stringify({
        ok: true,
        user_id: authUser.user.id,
        org_id: targetOrgId,
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