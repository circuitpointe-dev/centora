// @ts-nocheck
// Deno runtime – Supabase Edge Function
// Name: ai-proposal-draft
// Env: GEMINI_API_KEY (set in Supabase -> Functions -> Secrets)

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

const MODEL = Deno.env.get("GEMINI_MODEL") || "gemini-1.5-flash";
const API_KEY = Deno.env.get("GEMINI_API_KEY") || "";

if (!API_KEY) {
    console.warn("[ai-proposal-draft] Missing GEMINI_API_KEY – set a secret in Supabase");
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

async function callGemini(prompt: string) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
    const body = {
        contents: [
            {
                role: "user",
                parts: [{ text: prompt }],
            },
        ],
        generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 0.9,
            maxOutputTokens: 1200,
            responseMimeType: "application/json",
        },
    };

    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Gemini error ${res.status}: ${txt}`);
    }

    const json = await res.json();
    // Gemini responses: json.candidates[0].content.parts[0].text (as JSON string)
    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    let parsed: DraftSections;
    try {
        parsed = JSON.parse(text);
    } catch {
        // If the model did not respect JSON, wrap in a minimal object
        parsed = {
            executive_summary: text,
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
        if (!API_KEY) {
            return new Response(
                JSON.stringify({ error: "GEMINI_API_KEY not configured" }),
                { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
            );
        }

        const prompt = systemPrompt(input);
        const draft = await callGemini(prompt);

        return new Response(
            JSON.stringify({ draft, model: MODEL }),
            { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
        );
    } catch (e) {
        return new Response(
            JSON.stringify({ error: (e as Error).message }),
            { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
        );
    }
});


