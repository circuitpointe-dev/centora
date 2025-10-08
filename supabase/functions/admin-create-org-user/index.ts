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
    // Create Supabase client with service role for admin operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

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

    // Get the organization to use (first available if not specified)
    let targetOrgId = org_id
    if (!targetOrgId) {
      const { data: org } = await supabase
        .from('organizations')
        .select('id')
        .order('created_at', { ascending: true })
        .limit(1)
        .single()
      
      targetOrgId = org?.id
    }

    if (!targetOrgId) {
      return new Response(
        JSON.stringify({ error: 'No organization found' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Creating user for org:', targetOrgId, 'email:', email)

    // Generate a secure random password
    const randomPassword = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .slice(0, 16) + 'Aa1!' // Ensure password meets complexity requirements

    // 1. Create auth user with generated password
    const { data: authUser, error: createUserError } = await supabase.auth.admin.createUser({
      email,
      password: randomPassword,
      email_confirm: true,
      user_metadata: {
        full_name,
        org_id: targetOrgId
      }
    })

    if (createUserError || !authUser.user) {
      console.error('Failed to create auth user:', createUserError)
      
      // Handle specific error cases
      if (createUserError?.message?.includes('A user with this email address has already been registered')) {
        return new Response(
          JSON.stringify({ 
            error: 'A user with this email address already exists. Please use a different email or check if the user is already registered.',
            code: 'email_exists'
          }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
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
        org_id: targetOrgId,
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

    // Return success response with generated password
    return new Response(
      JSON.stringify({
        ok: true,
        user_id: authUser.user.id,
        org_id: targetOrgId,
        email,
        role_ids,
        temporary_password: randomPassword,
        message: 'User created successfully. Please save the temporary password and share it securely with the user.'
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