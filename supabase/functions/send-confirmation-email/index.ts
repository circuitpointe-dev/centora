import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ConfirmationEmailRequest {
  email: string;
  organizationName: string;
  confirmationUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, organizationName, confirmationUrl }: ConfirmationEmailRequest = await req.json();

    console.log("Sending confirmation email to:", email);

    const emailResponse = await resend.emails.send({
      from: "Orbit ERP <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to Orbit ERP - Confirm Your Account",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
            .content { background: #f8fafc; padding: 30px; border-radius: 8px; margin: 20px 0; }
            .button { 
              display: inline-block; 
              background: #2563eb; 
              color: white; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 6px; 
              margin: 20px 0;
            }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Orbit ERP</div>
            </div>
            
            <div class="content">
              <h2>Welcome to Orbit ERP, ${organizationName}!</h2>
              
              <p>Thank you for registering with Orbit ERP. To complete your account setup and start managing your organization, please confirm your email address by clicking the button below:</p>
              
              <div style="text-align: center;">
                <a href="${confirmationUrl}" class="button">Confirm Your Account</a>
              </div>
              
              <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #2563eb;">${confirmationUrl}</p>
              
              <p><strong>Important:</strong> This confirmation link will expire in 24 hours for security purposes.</p>
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
              
              <h3>What's Next?</h3>
              <p>Once you confirm your email, you'll be able to:</p>
              <ul>
                <li>Access your personalized dashboard</li>
                <li>Set up your organization modules</li>
                <li>Invite team members</li>
                <li>Start managing your business operations</li>
              </ul>
            </div>
            
            <div class="footer">
              <p>If you didn't create an account with Orbit ERP, you can safely ignore this email.</p>
              <p>Need help? Contact our support team at support@orbiterp.com</p>
              <p>&copy; 2024 Orbit ERP. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-confirmation-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);