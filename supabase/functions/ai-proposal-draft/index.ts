// @ts-nocheck
// Deno runtime – Supabase Edge Function
// Name: ai-proposal-draft
// Uses Lovable AI Gateway (free Gemini models)

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

type DraftInput = {
    opportunity?: {
        id?: string;
        title?: string;
        donor?: string;
        summary?: string;
        url?: string;
    };
    answers: {
        sector?: string;
        location?: string;
        target_group?: string;
        objectives?: string;
        budget_level?: string;
        extra_notes?: string;
    };
};

type DraftSections = {
    executive_summary: string;
    problem_statement: string;
    objectives: string[];
    activities: string[];
    methodology: string;
    monitoring_evaluation: string;
    budget_narrative: string;
    sustainability: string;
    risks_mitigation: string;
};

const MODEL = "google/gemini-2.5-flash";
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY") || "";

if (!LOVABLE_API_KEY) {
    console.error("[ai-proposal-draft] Missing LOVABLE_API_KEY - edge function will fail");
} else {
    console.log(`[ai-proposal-draft] API key configured, using model: ${MODEL}`);
}

const systemPrompt = (
    input: DraftInput,
) => `You are a grants specialist writing winning NGO proposals. Return a compact JSON with these keys only:
{
  "executive_summary": string,
  "problem_statement": string,
  "objectives": string[],
  "activities": string[],
  "methodology": string,
  "monitoring_evaluation": string,
  "budget_narrative": string,
  "sustainability": string,
  "risks_mitigation": string
}

Guidelines:
- Be concise and donor-aligned; avoid fluff.
- Use clear bullets where helpful.
- Objectives should be measurable; activities should map to objectives.

Context:
Opportunity: ${input.opportunity?.title ?? "(none)"}
Donor: ${input.opportunity?.donor ?? "(unknown)"}
Summary: ${input.opportunity?.summary ?? ""}
URL: ${input.opportunity?.url ?? ""}

Inputs:
Sector: ${input.answers?.sector ?? ""}
Location: ${input.answers?.location ?? ""}
Target group: ${input.answers?.target_group ?? ""}
Objectives: ${input.answers?.objectives ?? ""}
Budget level: ${input.answers?.budget_level ?? ""}
Notes: ${input.answers?.extra_notes ?? ""}
`;

async function callLovableAI(prompt: string) {
    const url = "https://ai.gateway.lovable.dev/v1/chat/completions";
    const body = {
        model: MODEL,
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
    };

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const txt = await res.text();
        console.error(`[ai-proposal-draft] Lovable AI error: ${res.status} - ${txt}`);
        console.error(`[ai-proposal-draft] Request was: ${JSON.stringify({ model: MODEL, messagesCount: 1 })}`);
        
        if (res.status === 429) {
            throw new Error("Rate limit exceeded. Please try again in a moment.");
        }
        if (res.status === 402) {
            throw new Error("AI credits exhausted. Please add credits to your workspace.");
        }
        if (res.status === 401 || res.status === 403) {
            throw new Error("API authentication failed. Please check your API key configuration.");
        }
        throw new Error(`AI Gateway error ${res.status}: ${txt}`);
    }

    const json = await res.json();
    const text = json?.choices?.[0]?.message?.content ?? "";
    
    let parsed: DraftSections;
    try {
        parsed = JSON.parse(text);
    } catch (e) {
        console.error("[ai-proposal-draft] Failed to parse JSON response:", text);
        // If the model did not respect JSON, wrap in a minimal object
        parsed = {
            executive_summary: text || "Failed to generate content. Please try again.",
            problem_statement: "",
            objectives: [],
            activities: [],
            methodology: "",
            monitoring_evaluation: "",
            budget_narrative: "",
            sustainability: "",
            risks_mitigation: "",
        };
    }
    return parsed;
}

serve(async (req) => {
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        "Vary": "Origin",
    } as const;

    if (req.method === "OPTIONS") {
        return new Response("ok", { status: 200, headers: corsHeaders });
    }

    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
    }

    try {
        const input = (await req.json()) as DraftInput;
        console.log(`[ai-proposal-draft] Received request for opportunity: ${input.opportunity?.title}`);
        
        if (!LOVABLE_API_KEY) {
            console.error("[ai-proposal-draft] LOVABLE_API_KEY not configured");
            return new Response(
                JSON.stringify({ error: "AI service not configured. Please contact support." }),
                { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
            );
        }

        const prompt = systemPrompt(input);
        const draft = await callLovableAI(prompt);
        
        console.log(`[ai-proposal-draft] Successfully generated draft with ${Object.keys(draft).length} sections`);

        return new Response(
            JSON.stringify({ draft, model: MODEL }),
            { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
        );
    } catch (e) {
        console.error(`[ai-proposal-draft] Error:`, e);
        return new Response(
            JSON.stringify({ error: (e as Error).message }),
            { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
        );
    }
});


