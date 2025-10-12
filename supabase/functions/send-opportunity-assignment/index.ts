import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.54.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AssignmentRequest {
  assigneeId: string;
  opportunityTitle: string;
  opportunityId: string;
  deadline: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { assigneeId, opportunityTitle, opportunityId, deadline }: AssignmentRequest = await req.json();

    console.log("Processing assignment notification for:", { assigneeId, opportunityTitle });

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get assignee details
    const { data: assignee, error: userError } = await supabaseClient
      .from("profiles")
      .select("full_name, email")
      .eq("id", assigneeId)
      .single();

    if (userError || !assignee) {
      console.error("Error fetching assignee:", userError);
      throw new Error("Assignee not found");
    }

    if (!assignee.email) {
      console.error("Assignee has no email");
      throw new Error("Assignee has no email address");
    }

    console.log("Sending email to:", assignee.email);

    // Send email notification
    const emailResponse = await resend.emails.send({
      from: "Centora ERP <onboarding@resend.dev>",
      to: [assignee.email],
      subject: `New Opportunity Assigned: ${opportunityTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7C3AED;">New Opportunity Assignment</h2>
          <p>Hi ${assignee.full_name || "there"},</p>
          <p>You have been assigned to a new opportunity:</p>
          
          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1F2937;">${opportunityTitle}</h3>
            <p style="margin: 8px 0;"><strong>Deadline:</strong> ${new Date(deadline).toLocaleDateString()}</p>
          </div>
          
          <p>Please review the opportunity details and take necessary action.</p>
          
          <a href="${Deno.env.get("SUPABASE_URL")?.replace("https://kspzfifdwfpirgqstzhz.supabase.co", "https://preview--centora.lovable.app")}/dashboard/fundraising/opportunities" 
             style="display: inline-block; background-color: #7C3AED; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            View Opportunity
          </a>
          
          <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
            This is an automated notification from Centora ERP.
          </p>
        </div>
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
    console.error("Error in send-opportunity-assignment function:", error);
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
