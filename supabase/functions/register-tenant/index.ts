// supabase/functions/register-tenant/index.ts
// Public Edge Function to register a new tenant (organization) and its admin user
// Uses ORBIT_SERVICE_ROLE_KEY to perform privileged operations

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface RegisterPayload {
  organizationName: string;
  organizationType?: string;
  address?: string;
  primaryCurrency?: string;
  contactName: string;
  phone?: string;
  email: string;
  password: string;
  modules: string[];
  pricingPlan?: string;
  termsAccepted?: boolean;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  const url = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("ORBIT_SERVICE_ROLE_KEY");

  if (!url || !serviceRoleKey) {
    console.error("Missing env: SUPABASE_URL or ORBIT_SERVICE_ROLE_KEY");
    return new Response(
      JSON.stringify({ success: false, code: "SERVER_MISCONFIGURED", message: "Server not configured" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  const adminClient = createClient(url, serviceRoleKey);

  let payload: RegisterPayload | null = null;
  try {
    payload = (await req.json()) as RegisterPayload;
  } catch (e) {
    return new Response(
      JSON.stringify({ success: false, code: "INVALID_JSON", message: "Invalid JSON payload" }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  // Basic validation
  const errors: string[] = [];
  if (!payload.organizationName?.trim()) errors.push("organizationName is required");
  if (!payload.contactName?.trim()) errors.push("contactName is required");
  if (!payload.email?.trim()) errors.push("email is required");
  if (!payload.password?.trim()) errors.push("password is required");
  if (!Array.isArray(payload.modules) || payload.modules.length === 0)
    errors.push("At least one module is required");
  if (payload.termsAccepted === false) errors.push("termsAccepted must be true");

  if (errors.length) {
    return new Response(
      JSON.stringify({
        success: false,
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: errors,
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  const allowedModules = new Set([
    "fundraising",
    "programme",
    "procurement",
    "inventory",
    "finance",
    "learning",
    "documents",
    "hr",
    "users",
    "grants",
  ]);

  const displayToKey: Record<string, string> = {
    "fundraising": "fundraising",
    "grants management": "grants",
    "grants": "grants",
    "document manager": "documents",
    "documents": "documents",
    "programme management": "programme",
    "programme": "programme",
    "procurement": "procurement",
    "inventory management": "inventory",
    "inventory": "inventory",
    "finance & control": "finance",
    "finance": "finance",
    "learning management": "learning",
    "learning": "learning",
    "hr management": "hr",
    "hr": "hr",
    "user management": "users",
    "users": "users",
  };

  const toModuleKey = (val: string) => {
    const v = (val || "").toLowerCase().trim();
    if (allowedModules.has(v)) return v;
    return displayToKey[v];
  };

  const dedupe = (arr: string[]) => Array.from(new Set(arr));

  const selectedModules = dedupe(
    (payload.modules || [])
      .map((m) => toModuleKey(m))
      .filter((m): m is string => !!m && allowedModules.has(m))
  );

  let createdUserId: string | null = null;
  let createdOrgId: string | null = null;

  try {
    // 1) Create auth user (auto-confirmed)
    const { data: userRes, error: createUserError } = await adminClient.auth.admin.createUser({
      email: payload.email,
      password: payload.password,
      email_confirm: false,
      user_metadata: {
        full_name: payload.contactName,
      },
    });

    if (createUserError || !userRes?.user) {
      console.error("createUserError", createUserError);
      const msg = createUserError?.message || "Failed to create user";
      const isDup = (createUserError as any)?.status === 422 || /already registered|duplicate|unique/i.test(msg || "");
      const payload = isDup
        ? {
            success: false,
            code: "DUPLICATE_EMAIL",
            message: "This email is already registered.",
            suggestedAction: "Use a different email address.",
          }
        : {
            success: false,
            code: "REGISTRATION_FAILED",
            message: msg,
          };
      const status = isDup
        ? 409
        : ((createUserError as any)?.status && (createUserError as any)?.status >= 400
            ? (createUserError as any).status
            : 400);
      return new Response(JSON.stringify(payload), {
        status,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    createdUserId = userRes.user.id;

    // 2) Create organization
    const { data: orgRes, error: orgError } = await adminClient
      .from("organizations")
      .insert({
        name: payload.organizationName,
        type: payload.organizationType || "NGO",
        primary_currency: payload.primaryCurrency || "USD",
        address_line1: payload.address || null,
        phone: payload.phone || null,
        created_by: createdUserId,
      })
      .select("id")
      .single();

    if (orgError || !orgRes) {
      console.error("orgError", orgError);
      // Cleanup user
      if (createdUserId) {
        await adminClient.auth.admin.deleteUser(createdUserId);
      }
      const msg = orgError?.message || "Failed to create organization";
      return new Response(
        JSON.stringify({ success: false, code: "REGISTRATION_FAILED", message: msg }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    createdOrgId = orgRes.id as string;

    // 3) Create profile for the admin user
    const { error: profileError } = await adminClient.from("profiles").insert({
      id: createdUserId,
      email: payload.email,
      full_name: payload.contactName,
      role: "org_admin",
      org_id: createdOrgId,
    });

    if (profileError) {
      console.error("profileError", profileError);
      // rollback org and user
      if (createdOrgId) await adminClient.from("organizations").delete().eq("id", createdOrgId);
      if (createdUserId) await adminClient.auth.admin.deleteUser(createdUserId);
      const msg = profileError.message || "Failed to create profile";
      const isDup = /duplicate|unique|profiles_email_unique/i.test(msg || "");
      const payload = isDup
        ? {
            success: false,
            code: "DUPLICATE_EMAIL",
            message: "This email is already registered.",
            suggestedAction: "Use a different email address.",
          }
        : { success: false, code: "REGISTRATION_FAILED", message: msg };
      const status = isDup ? 409 : 400;
      return new Response(JSON.stringify(payload), {
        status,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // 4) Insert modules (always include 'users' module)
    const modulesToInsert = [...new Set([...selectedModules, 'users'])];
    if (modulesToInsert.length > 0) {
      const rows = modulesToInsert.map((m) => ({ org_id: createdOrgId, module: m }));
      const { error: modulesError } = await adminClient.from("organization_modules").insert(rows);
      if (modulesError) {
        console.error("modulesError", modulesError);
        // rollback everything
        await adminClient.from("profiles").delete().eq("id", createdUserId);
        await adminClient.from("organizations").delete().eq("id", createdOrgId);
        if (createdUserId) await adminClient.auth.admin.deleteUser(createdUserId);
        const msg = modulesError.message || "Failed to assign modules";
        return new Response(
          JSON.stringify({ success: false, code: "REGISTRATION_FAILED", message: msg }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }

    // Success
    return new Response(
      JSON.stringify({ success: true, orgId: createdOrgId, userId: createdUserId }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (e: any) {
    console.error("Unhandled error in register-tenant:", e?.message || e);
    // Best-effort cleanup
    if (createdOrgId) await adminClient.from("organizations").delete().eq("id", createdOrgId);
    if (createdUserId) await adminClient.auth.admin.deleteUser(createdUserId);

    return new Response(
      JSON.stringify({ success: false, code: "INTERNAL_ERROR", message: "Unexpected server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
