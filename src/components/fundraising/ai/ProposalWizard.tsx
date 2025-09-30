import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { generateProposalDraft, AiDraftSections } from '@/hooks/useAiProposalDraft';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Props {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    defaultOpportunity?: { id: string; title: string } | null;
    defaultTitle?: string;
}

export default function ProposalWizard({ open, onOpenChange, defaultOpportunity, defaultTitle }: Props) {
    const [step, setStep] = useState<1 | 2 | 3>(2);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    // Step 1
    const [title, setTitle] = useState(defaultTitle || '');
    const [opportunity, setOpportunity] = useState<{ id: string; title: string } | null>(defaultOpportunity ?? null);
    const { data: opportunities = [] } = useOpportunities();

    // Single prompt input (since title & opportunity are provided earlier)
    const [singlePrompt, setSinglePrompt] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [language, setLanguage] = useState<'English' | 'French'>('English');
    const [tone, setTone] = useState<'Professional' | 'Impact-focused' | 'Technical' | 'Plain'>('Professional');
    const [length, setLength] = useState<'Brief (1–2 pages)' | 'Standard (3–5 pages)' | 'Detailed (6–8 pages)'>('Standard (3–5 pages)');

    const [draft, setDraft] = useState<AiDraftSections | null>(null);
    const nextDisabled = !title.trim() || !opportunity?.id;

    const handleContinue = async () => {
        if (nextDisabled) return;
        setStep(2);
    };

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const meta = `\nLanguage: ${language}\nTone: ${tone}\nLength: ${length}`;
            const aggregatedNotes = `${singlePrompt.trim()}${meta}`;
            const { draft } = await generateProposalDraft({
                opportunity: { id: opportunity?.id, title: opportunity?.title },
                answers: {
                    sector: '',
                    location: '',
                    target_group: '',
                    objectives: '',
                    budget_level: '',
                    extra_notes: aggregatedNotes,
                },
            });
            setDraft(draft);
            setStep(3);
        } catch (e: any) {
            console.error(e);
            alert(e.message || 'Failed to generate draft');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!draft || !opportunity?.id) return;
        setLoading(true);
        try {
            const { data: userRes } = await supabase.auth.getUser();
            const userId = userRes?.user?.id ?? null;
            const payload: any = {
                title: title.trim(),
                opportunity_id: opportunity.id,
                status: 'draft',
                content: { sections: draft, source: 'ai_wizard' },
                created_by: userId,
            };
            const { data, error } = await (supabase as any)
                .from('proposals')
                .insert(payload)
                .select('id')
                .single();
            if (error) throw error;
            onOpenChange(false);
            toast({ title: 'Proposal saved', description: 'AI draft created successfully.' });
            navigate('/dashboard/fundraising/proposal-management');
        } catch (e: any) {
            alert(e.message || 'Failed to save proposal');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[760px]">
                <DialogHeader>
                    <DialogTitle>AI Proposal Wizard</DialogTitle>
                    <DialogDescription>Provide a brief description and generate a complete first draft.</DialogDescription>
                </DialogHeader>

                {step === 1 && (
                    <div className="space-y-4">
                        <div>
                            <Label>Proposal Title</Label>
                            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter proposal title" />
                        </div>
                        <div>
                            <Label>Select Opportunity</Label>
                            <Select
                                value={opportunity?.id || ''}
                                onValueChange={(value) => {
                                    const opp = opportunities.find((o: any) => o.id === value);
                                    if (opp) setOpportunity({ id: opp.id, title: opp.title });
                                }}
                            >
                                <SelectTrigger className="bg-[#f6f6fa]">
                                    <SelectValue placeholder="Choose opportunity" />
                                </SelectTrigger>
                                <SelectContent>
                                    {opportunities.map((op: any) => (
                                        <SelectItem key={op.id} value={op.id}>
                                            {op.title} {op.donor?.name ? `- ${op.donor.name}` : ''}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                            <Button disabled={nextDisabled} onClick={handleContinue}>Continue</Button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-3">
                        <div>
                            <Label>What should this proposal cover?</Label>
                            <Textarea
                                rows={8}
                                value={singlePrompt}
                                onChange={(e) => setSinglePrompt(e.target.value)}
                                placeholder="In 2–5 sentences, describe goals, target group, key activities, approach, risks, and any donor-specific notes."
                            />
                            <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                                <span>Tip: Clear, specific inputs produce better drafts.</span>
                                <span>{singlePrompt.length} chars</span>
                            </div>
                        </div>
                        <div className="border rounded-md p-3 bg-[#fafafe]">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Advanced (optional)</span>
                                <button type="button" onClick={() => setShowAdvanced(v => !v)} className="text-xs text-violet-600 hover:underline">
                                    {showAdvanced ? 'Hide' : 'Show'} options
                                </button>
                            </div>
                            {showAdvanced && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                                    <div>
                                        <Label>Language</Label>
                                        <Select value={language} onValueChange={(v) => setLanguage(v as any)}>
                                            <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="English">English</SelectItem>
                                                <SelectItem value="French">French</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>Tone</Label>
                                        <Select value={tone} onValueChange={(v) => setTone(v as any)}>
                                            <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Professional">Professional</SelectItem>
                                                <SelectItem value="Impact-focused">Impact-focused</SelectItem>
                                                <SelectItem value="Technical">Technical</SelectItem>
                                                <SelectItem value="Plain">Plain</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>Length</Label>
                                        <Select value={length} onValueChange={(v) => setLength(v as any)}>
                                            <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Brief (1–2 pages)">Brief (1–2 pages)</SelectItem>
                                                <SelectItem value="Standard (3–5 pages)">Standard (3–5 pages)</SelectItem>
                                                <SelectItem value="Detailed (6–8 pages)">Detailed (6–8 pages)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                            <Button onClick={handleGenerate} disabled={loading || singlePrompt.trim().length === 0}>{loading ? 'Generating…' : 'Generate Draft'}</Button>
                        </div>
                    </div>
                )}

                {step === 3 && draft && (
                    <div className="space-y-4">
                        <div>
                            <Label>Executive Summary</Label>
                            <Textarea rows={4} value={draft.executive_summary} onChange={(e) => setDraft({ ...draft, executive_summary: e.target.value })} />
                        </div>
                        <div>
                            <Label>Problem Statement</Label>
                            <Textarea rows={4} value={draft.problem_statement} onChange={(e) => setDraft({ ...draft, problem_statement: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <Label>Objectives</Label>
                                <Textarea rows={4} value={draft.objectives.join('\n')} onChange={(e) => setDraft({ ...draft, objectives: e.target.value.split('\n').filter(Boolean) })} />
                            </div>
                            <div>
                                <Label>Activities</Label>
                                <Textarea rows={4} value={draft.activities.join('\n')} onChange={(e) => setDraft({ ...draft, activities: e.target.value.split('\n').filter(Boolean) })} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <Label>Methodology</Label>
                                <Textarea rows={4} value={draft.methodology} onChange={(e) => setDraft({ ...draft, methodology: e.target.value })} />
                            </div>
                            <div>
                                <Label>Monitoring & Evaluation</Label>
                                <Textarea rows={4} value={draft.monitoring_evaluation} onChange={(e) => setDraft({ ...draft, monitoring_evaluation: e.target.value })} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <Label>Budget Narrative</Label>
                                <Textarea rows={4} value={draft.budget_narrative} onChange={(e) => setDraft({ ...draft, budget_narrative: e.target.value })} />
                            </div>
                            <div>
                                <Label>Sustainability</Label>
                                <Textarea rows={4} value={draft.sustainability} onChange={(e) => setDraft({ ...draft, sustainability: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <Label>Risks & Mitigation</Label>
                            <Textarea rows={4} value={draft.risks_mitigation} onChange={(e) => setDraft({ ...draft, risks_mitigation: e.target.value })} />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                            <Button onClick={handleSave} disabled={loading}>{loading ? 'Saving…' : 'Save Proposal'}</Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}


