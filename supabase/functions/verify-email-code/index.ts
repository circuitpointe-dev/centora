import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyCodeRequest {
  email: string;
  code: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { email, code }: VerifyCodeRequest = await req.json();

    if (!email || !code) {
      return new Response(
        JSON.stringify({ error: "Email and verification code are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Verifying code for ${email}: ${code}`);

    // Look up the verification record
    const { data: verificationRecord, error: lookupError } = await supabase
      .from("email_verifications")
      .select("*")
      .eq("email", email)
      .eq("verification_code", code)
      .is("verified_at", null)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (lookupError || !verificationRecord) {
      console.error("Verification lookup error:", lookupError);
      return new Response(
        JSON.stringify({ 
          error: "Invalid or expired verification code",
          code: "INVALID_CODE"
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Mark the verification as completed
    const { error: updateError } = await supabase
      .from("email_verifications")
      .update({ verified_at: new Date().toISOString() })
      .eq("id", verificationRecord.id);

    if (updateError) {
      console.error("Update verification error:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to verify code" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user exists in auth.users table
    const { data: userData, error: userError } = await supabase.auth.admin.getUserByEmail(email);
    
    if (userError || !userData.user) {
      console.error("User lookup error:", userError);
      return new Response(
        JSON.stringify({ 
          error: "User not found. Please complete registration first.",
          code: "USER_NOT_FOUND"
        }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update user's email_confirmed_at if not already confirmed
    if (!userData.user.email_confirmed_at) {
      const { error: confirmError } = await supabase.auth.admin.updateUserById(
        userData.user.id,
        { email_confirm: true }
      );

      if (confirmError) {
        console.error("Email confirmation error:", confirmError);
        // Don't fail the verification if this step fails
      }
    }

    console.log(`Email verified successfully for ${email}`);

    return new Response(
      JSON.stringify({ 
        message: "Email verified successfully",
        verified: true 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in verify-email-code function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);