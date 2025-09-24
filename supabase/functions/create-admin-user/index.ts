import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create admin client using service role
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Create the auth user first
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: 'super@circuitpointe.com',
      password: 'Circuit2025$',
      email_confirm: true,
      user_metadata: {
        full_name: 'Circuit Pointe Super Admin'
      }
    })

    if (authError) {
      throw new Error(`Auth user creation failed: ${authError.message}`)
    }

    const userId = authUser.user.id

    // Get or create default organization
    let { data: orgs, error: orgError } = await supabaseAdmin
      .from('organizations')
      .select('id')
      .order('created_at', { ascending: true })
      .limit(1)

    if (orgError) {
      throw new Error(`Failed to fetch organizations: ${orgError.message}`)
    }

    let orgId: string

    if (!orgs || orgs.length === 0) {
      // Create organization
      const { data: newOrg, error: createOrgError } = await supabaseAdmin
        .from('organizations')
        .insert({
          name: 'Circuit Pointe Organization',
          type: 'NGO',
          created_by: userId
        })
        .select('id')
        .single()

      if (createOrgError) {
        throw new Error(`Failed to create organization: ${createOrgError.message}`)
      }

      orgId = newOrg.id

      // Add all modules to the organization
      const modules = ['fundraising', 'grants', 'documents', 'programmes', 'procurement', 'inventory', 'finance', 'lms', 'hr', 'user_mgmt']
      const { error: moduleError } = await supabaseAdmin
        .from('organization_modules')
        .insert(modules.map(module => ({ org_id: orgId, module })))

      if (moduleError) {
        throw new Error(`Failed to add modules: ${moduleError.message}`)
      }
    } else {
      orgId = orgs[0].id
    }

    // Create the profile with full access
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: userId,
        email: 'super@circuitpointe.com',
        full_name: 'Circuit Pointe Super Admin',
        org_id: orgId,
        role: 'org_admin',
        is_super_admin: true,
        status: 'active',
        access_json: {
          "fundraising": {"_module": true, "create": ["create", "read", "update", "delete"], "read": ["create", "read", "update", "delete"], "update": ["create", "read", "update", "delete"], "delete": ["create", "read", "update", "delete"]},
          "grants": {"_module": true, "create": ["create", "read", "update", "delete"], "read": ["create", "read", "update", "delete"], "update": ["create", "read", "update", "delete"], "delete": ["create", "read", "update", "delete"]},
          "documents": {"_module": true, "create": ["create", "read", "update", "delete"], "read": ["create", "read", "update", "delete"], "update": ["create", "read", "update", "delete"], "delete": ["create", "read", "update", "delete"]},
          "programmes": {"_module": true, "create": ["create", "read", "update", "delete"], "read": ["create", "read", "update", "delete"], "update": ["create", "read", "update", "delete"], "delete": ["create", "read", "update", "delete"]},
          "procurement": {"_module": true, "create": ["create", "read", "update", "delete"], "read": ["create", "read", "update", "delete"], "update": ["create", "read", "update", "delete"], "delete": ["create", "read", "update", "delete"]},
          "inventory": {"_module": true, "create": ["create", "read", "update", "delete"], "read": ["create", "read", "update", "delete"], "update": ["create", "read", "update", "delete"], "delete": ["create", "read", "update", "delete"]},
          "finance": {"_module": true, "create": ["create", "read", "update", "delete"], "read": ["create", "read", "update", "delete"], "update": ["create", "read", "update", "delete"], "delete": ["create", "read", "update", "delete"]},
          "lms": {"_module": true, "create": ["create", "read", "update", "delete"], "read": ["create", "read", "update", "delete"], "update": ["create", "read", "update", "delete"], "delete": ["create", "read", "update", "delete"]},
          "hr": {"_module": true, "create": ["create", "read", "update", "delete"], "read": ["create", "read", "update", "delete"], "update": ["create", "read", "update", "delete"], "delete": ["create", "read", "update", "delete"]},
          "user_mgmt": {"_module": true, "create": ["create", "read", "update", "delete"], "read": ["create", "read", "update", "delete"], "update": ["create", "read", "update", "delete"], "delete": ["create", "read", "update", "delete"]}
        }
      })

    if (profileError) {
      throw new Error(`Failed to create profile: ${profileError.message}`)
    }

    // Create module access records
    const modules = ['fundraising', 'grants', 'documents', 'programmes', 'procurement', 'inventory', 'finance', 'lms', 'hr', 'user_mgmt']
    const { error: accessError } = await supabaseAdmin
      .from('user_module_access')
      .insert(modules.map(module => ({
        profile_id: userId,
        org_id: orgId,
        module_key: module,
        has_access: true,
        created_by: userId
      })))

    if (accessError) {
      throw new Error(`Failed to create module access: ${accessError.message}`)
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Super Admin user created successfully',
        user_id: userId,
        email: 'super@circuitpointe.com'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})