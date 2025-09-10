import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface SendVerificationRequest {
  email: string;
  organizationName?: string;
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

    const { email, organizationName }: SendVerificationRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    console.log(`Generated verification code for ${email}: ${verificationCode}`);

    // Clean up any existing expired codes for this email
    await supabase
      .from("email_verifications")
      .delete()
      .eq("email", email)
      .lt("expires_at", new Date().toISOString());

    // Store verification code in database
    const { error: dbError } = await supabase
      .from("email_verifications")
      .insert({
        email: email,
        verification_code: verificationCode,
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
      });

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(
        JSON.stringify({ error: "Failed to store verification code" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send email with verification code (with fallback to Resend test sender)
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">Verify Your Email Address</h1>
          
          <p>Hello${organizationName ? ` from ${organizationName}` : ''},</p>
          
          <p>Thank you for signing up with Centora ERP! Please use the verification code below to complete your registration:</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h2 style="margin: 0; font-size: 32px; letter-spacing: 4px; color: #4F46E5;">${verificationCode}</h2>
          </div>
          
          <p>This code will expire in <strong>15 minutes</strong>.</p>
          
          <p>If you didn't request this verification code, please ignore this email.</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          
          <p style="color: #666; font-size: 12px; text-align: center;">
            This email was sent from Centora ERP. If you have any questions, please contact our support team.
          </p>
        </div>
      `;

    let fromAddress = "Centora ERP <test@circuitpointe.com>";
    let emailResponse = await resend.emails.send({
      from: fromAddress,
      to: [email],
      subject: "Verify your email address",
      html: htmlContent,
    });

    if (emailResponse.error) {
      console.error("Primary email sending error:", emailResponse.error);
      const errorJson = JSON.stringify(emailResponse.error);
      const shouldFallback = errorJson.includes("domain is not verified") || errorJson.includes("domain not verified");
      if (shouldFallback) {
        console.warn("Falling back to Resend test sender: onboarding@resend.dev");
        fromAddress = "Centora ERP <onboarding@resend.dev>";
        const fallbackResponse = await resend.emails.send({
          from: fromAddress,
          to: [email],
          subject: "Verify your email address",
          html: htmlContent,
        });
        if (fallbackResponse.error) {
          console.error("Fallback email sending error:", fallbackResponse.error);
          return new Response(
            JSON.stringify({ error: "Failed to send verification email" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      } else {
        return new Response(
          JSON.stringify({ error: "Failed to send verification email" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    console.log("Verification email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        message: "Verification code sent successfully",
        expires_in: 15 * 60 // 15 minutes in seconds
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in send-verification-code function:", error);
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