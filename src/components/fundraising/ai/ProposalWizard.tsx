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
            console.error('AI generation error:', e);
            toast({
                title: 'Generation Failed',
                description: e.message || 'Failed to generate draft. Please try again.',
                variant: 'destructive'
            });
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

            // Get user's org_id
            const { data: profile } = await supabase
                .from('profiles')
                .select('org_id')
                .eq('id', userId!)
                .single();

            if (!profile?.org_id) throw new Error('User organization not found');

            // Format the AI-generated content as narrative fields
            const narrativeFields = [
                { label: 'Executive Summary', value: draft.executive_summary, type: 'textarea' },
                { label: 'Problem Statement', value: draft.problem_statement, type: 'textarea' },
                { label: 'Objectives', value: draft.objectives.join('\n'), type: 'textarea' },
                { label: 'Activities', value: draft.activities.join('\n'), type: 'textarea' },
                { label: 'Methodology', value: draft.methodology, type: 'textarea' },
                { label: 'Monitoring & Evaluation', value: draft.monitoring_evaluation, type: 'textarea' },
                { label: 'Budget Narrative', value: draft.budget_narrative, type: 'textarea' },
                { label: 'Sustainability', value: draft.sustainability, type: 'textarea' },
                { label: 'Risks & Mitigation', value: draft.risks_mitigation, type: 'textarea' },
            ];

            const payload = {
                org_id: profile.org_id,
                name: title.trim(),
                title: title.trim(),
                opportunity_id: opportunity.id,
                status: 'draft',
                narrative_fields: narrativeFields,
                created_by: userId,
            };

            const { data, error } = await supabase
                .from('proposals')
                .insert(payload)
                .select('id')
                .single();

            if (error) throw error;
            onOpenChange(false);
            toast({ title: 'Proposal saved', description: 'AI draft created successfully.' });
            navigate('/dashboard/fundraising/proposal-management');
        } catch (e: any) {
            console.error('Save error:', e);
            toast({ title: 'Error', description: e.message || 'Failed to save proposal', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] xl:w-[75vw] max-w-[1200px] max-h-[90vh] overflow-y-auto">
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
                    <div className="space-y-6">
                        {/* Header with progress indicator */}
                        <div className="flex items-center justify-between border-b pb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Review & Edit Your Proposal</h3>
                                <p className="text-sm text-gray-600">Make any final adjustments before saving</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-gray-600">AI Generated</span>
                            </div>
                        </div>

                        {/* Scrollable content area */}
                        <div className="max-h-[60vh] overflow-y-auto space-y-6 pr-2">
                            {/* Executive Summary */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <Label className="text-base font-medium text-gray-900 mb-2 block">Executive Summary</Label>
                                <Textarea
                                    rows={5}
                                    value={draft.executive_summary}
                                    onChange={(e) => setDraft({ ...draft, executive_summary: e.target.value })}
                                    className="resize-none border-gray-200 focus:border-violet-500 focus:ring-violet-500"
                                    placeholder="Brief overview of the project..."
                                />
                            </div>

                            {/* Problem Statement */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <Label className="text-base font-medium text-gray-900 mb-2 block">Problem Statement</Label>
                                <Textarea
                                    rows={5}
                                    value={draft.problem_statement}
                                    onChange={(e) => setDraft({ ...draft, problem_statement: e.target.value })}
                                    className="resize-none border-gray-200 focus:border-violet-500 focus:ring-violet-500"
                                    placeholder="Describe the problem this project addresses..."
                                />
                            </div>

                            {/* Two column layout for better space utilization */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Objectives */}
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <Label className="text-base font-medium text-gray-900 mb-2 block">Project Objectives</Label>
                                    <Textarea
                                        rows={6}
                                        value={draft.objectives.join('\n')}
                                        onChange={(e) => setDraft({ ...draft, objectives: e.target.value.split('\n').filter(Boolean) })}
                                        className="resize-none border-gray-200 focus:border-violet-500 focus:ring-violet-500"
                                        placeholder="List your project objectives..."
                                    />
                                </div>

                                {/* Activities */}
                                <div className="bg-green-50 rounded-lg p-4">
                                    <Label className="text-base font-medium text-gray-900 mb-2 block">Key Activities</Label>
                                    <Textarea
                                        rows={6}
                                        value={draft.activities.join('\n')}
                                        onChange={(e) => setDraft({ ...draft, activities: e.target.value.split('\n').filter(Boolean) })}
                                        className="resize-none border-gray-200 focus:border-violet-500 focus:ring-violet-500"
                                        placeholder="List key project activities..."
                                    />
                                </div>
                            </div>

                            {/* Methodology */}
                            <div className="bg-purple-50 rounded-lg p-4">
                                <Label className="text-base font-medium text-gray-900 mb-2 block">Methodology</Label>
                                <Textarea
                                    rows={5}
                                    value={draft.methodology}
                                    onChange={(e) => setDraft({ ...draft, methodology: e.target.value })}
                                    className="resize-none border-gray-200 focus:border-violet-500 focus:ring-violet-500"
                                    placeholder="Describe your project methodology..."
                                />
                            </div>

                            {/* Two column layout for M&E and Budget */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Monitoring & Evaluation */}
                                <div className="bg-orange-50 rounded-lg p-4">
                                    <Label className="text-base font-medium text-gray-900 mb-2 block">Monitoring & Evaluation</Label>
                                    <Textarea
                                        rows={5}
                                        value={draft.monitoring_evaluation}
                                        onChange={(e) => setDraft({ ...draft, monitoring_evaluation: e.target.value })}
                                        className="resize-none border-gray-200 focus:border-violet-500 focus:ring-violet-500"
                                        placeholder="Describe your M&E approach..."
                                    />
                                </div>

                                {/* Budget Narrative */}
                                <div className="bg-yellow-50 rounded-lg p-4">
                                    <Label className="text-base font-medium text-gray-900 mb-2 block">Budget Narrative</Label>
                                    <Textarea
                                        rows={5}
                                        value={draft.budget_narrative}
                                        onChange={(e) => setDraft({ ...draft, budget_narrative: e.target.value })}
                                        className="resize-none border-gray-200 focus:border-violet-500 focus:ring-violet-500"
                                        placeholder="Explain your budget allocation..."
                                    />
                                </div>
                            </div>

                            {/* Sustainability */}
                            <div className="bg-teal-50 rounded-lg p-4">
                                <Label className="text-base font-medium text-gray-900 mb-2 block">Sustainability</Label>
                                <Textarea
                                    rows={4}
                                    value={draft.sustainability}
                                    onChange={(e) => setDraft({ ...draft, sustainability: e.target.value })}
                                    className="resize-none border-gray-200 focus:border-violet-500 focus:ring-violet-500"
                                    placeholder="Describe project sustainability..."
                                />
                            </div>

                            {/* Risks & Mitigation */}
                            <div className="bg-red-50 rounded-lg p-4">
                                <Label className="text-base font-medium text-gray-900 mb-2 block">Risks & Mitigation</Label>
                                <Textarea
                                    rows={4}
                                    value={draft.risks_mitigation}
                                    onChange={(e) => setDraft({ ...draft, risks_mitigation: e.target.value })}
                                    className="resize-none border-gray-200 focus:border-violet-500 focus:ring-violet-500"
                                    placeholder="Identify risks and mitigation strategies..."
                                />
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex justify-between items-center pt-4 border-t bg-gray-50 -mx-6 px-6 py-4">
                            <Button variant="outline" onClick={() => setStep(2)} className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Edit
                            </Button>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-500">
                                    {draft.executive_summary.length + draft.problem_statement.length + draft.methodology.length} characters
                                </span>
                                <Button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="bg-violet-600 hover:bg-violet-700 flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            Save Proposal
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}


