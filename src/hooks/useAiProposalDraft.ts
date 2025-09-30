import { supabase } from '@/integrations/supabase/client';

export type AiDraftInput = {
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

export type AiDraftSections = {
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

export async function generateProposalDraft(input: AiDraftInput) {
    const { data, error } = await supabase.functions.invoke('ai-proposal-draft', { body: input });
    if (error) throw error;
    return data as { draft: AiDraftSections; model: string };
}


