import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  try {
    // Create Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get the auth header from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify the user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authorization' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user's org_id
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('org_id')
      .eq('id', user.id)
      .single()

    if (profileError || !profile?.org_id) {
      return new Response(
        JSON.stringify({ error: 'User organization not found' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get all proposal IDs for this org
    const { data: proposals, error: proposalError } = await supabaseClient
      .from('proposals')
      .select('id')
      .eq('org_id', profile.org_id)

    if (proposalError) {
      throw proposalError
    }

    const proposalIds = proposals?.map(p => p.id) || []
    let deletedTeamMembers = 0

    // Delete team members if there are proposals
    if (proposalIds.length > 0) {
      const { error: teamError, count } = await supabaseClient
        .from('proposal_team_members')
        .delete({ count: 'exact' })
        .in('proposal_id', proposalIds)

      if (!teamError && count) {
        deletedTeamMembers = count
      }
    }

    // Delete all proposals for this org
    const { error: deleteError, count } = await supabaseClient
      .from('proposals')
      .delete({ count: 'exact' })
      .eq('org_id', profile.org_id)

    if (deleteError) {
      throw deleteError
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        deletedProposals: count || 0,
        deletedTeamMembers
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
