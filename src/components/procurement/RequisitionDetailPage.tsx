import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useParams } from "react-router-dom";
import {
    useRequisitionDetail,
    useRequisitionWorkflow,
    useRequisitionDocuments,
    useRequisitionActivity,
    useUpdateRequisitionFields,
    useSubmitRequisitionForApproval,
} from "../../hooks/procurement/useRequisitionDetail";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type RequisitionDetailPageProps = { requisitionId?: string };

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const map: Record<string, string> = {
        pending: "bg-[#fef3c7] text-[#d97706]",
        approved: "bg-[#d1fae5] text-[#059669]",
        rejected: "bg-[#fee2e2] text-[#dc2626]",
        submitted: "bg-[#e0e7ff] text-[#3730a3]",
    };
    const cls = map[status] || "bg-gray-100 text-gray-600";
    return <Badge className={`${cls} hover:opacity-90`}>{status[0].toUpperCase() + status.slice(1)}</Badge>;
};

const RequisitionDetailPage: React.FC<RequisitionDetailPageProps> = ({ requisitionId }) => {
    const params = useParams();
    const idFromRoute = (params.feature || "").replace("requisition-detail-", "");
    const id = requisitionId || idFromRoute;

    const { data: detail } = useRequisitionDetail(id);
    const { data: workflow } = useRequisitionWorkflow(id);
    const { data: documents } = useRequisitionDocuments(id);
    const { data: activity } = useRequisitionActivity(id);
    const d: any = detail || {};
    const updateFields = useUpdateRequisitionFields();
    const submitForApproval = useSubmitRequisitionForApproval();
    const [editing, setEditing] = React.useState(false);
    const [draft, setDraft] = React.useState<any>({});

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-[#383839]">Procurement planning</h1>
            </div>

            {/* Back link */}
            <button
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                onClick={() => window.history.back()}
            >
                <img src="/arrow-left0.svg" alt="Back" className="w-4 h-4 mr-2" />
                Back to procurement planning
            </button>

            {/* Summary card */}
            <Card>
                <CardHeader className="border-b">
                    <CardTitle className="flex items-center justify-between">
                        <span>Requisition detail ({d.reference || id.substring(0, 8).toUpperCase()})</span>
                        <div className="flex gap-2">
                            {!editing && (
                                <Button variant="outline" size="sm" onClick={() => { setEditing(true); setDraft({ item_name: d.item_name, description: d.description, unit_cost: d.unit_cost, category: d.category, budget_source: d.budget_source }); }}>Edit</Button>
                            )}
                            {editing && (
                                <>
                                    <Button size="sm" className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white" onClick={async () => {
                                        try { await updateFields.mutateAsync({ id: id!, updates: draft }); setEditing(false); toast.success('Requisition updated'); } catch (e: any) { toast.error(e.message || 'Update failed'); }
                                    }}>Save</Button>
                                    <Button variant="outline" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
                                </>
                            )}
                            <Button variant="outline" size="sm" onClick={async () => { try { await submitForApproval.mutateAsync({ id: id! }); toast.success('Submitted for approval'); } catch (e: any) { toast.error(e.message || 'Submit failed'); } }}>Submit for approval</Button>
                            <Button variant="outline" size="sm">
                                <img src="/material-symbols-download0.svg" className="w-4 h-4 mr-2" alt="Export" />
                                Export
                            </Button>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-1">
                        <div className="text-xs text-gray-500">Status</div>
                        <StatusBadge status={d.status || "pending"} />
                    </div>
                    <div className="space-y-1">
                        <div className="text-xs text-gray-500">Estimate cost</div>
                        <div className="text-xl font-semibold">{d.currency || 'USD'} {Intl.NumberFormat('en-US').format(d.estimated_cost || 0)}</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-xs text-gray-500">Budget source</div>
                        {editing ? (
                            <Input value={draft.budget_source || ''} onChange={e => setDraft((v: any) => ({ ...v, budget_source: e.target.value }))} />
                        ) : <div className="text-sm text-gray-900">{d.budget_source || 'N/A'}</div>}
                    </div>
                    <div className="space-y-1">
                        <div className="text-xs text-gray-500">Requester</div>
                        <div className="text-sm text-gray-900">{d.requester_name || 'N/A'}</div>
                    </div>
                </CardContent>
            </Card>

            {/* Approval workflow */}
            <Card>
                <CardHeader>
                    <CardTitle>Approval Workflow</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {workflow?.map((step) => (
                            <div key={step.id} className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center">
                                    <img src="/group0.svg" alt="step" className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-900">{step.label}</div>
                                    <div className="text-xs text-gray-500">{step.status} {step.acted_at ? `• ${new Date(step.acted_at).toLocaleString()}` : ''}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Item details */}
            <Card>
                <CardHeader>
                    <CardTitle>Item Details</CardTitle>
                </CardHeader>
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DetailRow label="Item name" value={d.item_name} editing={editing} onChange={(val) => setDraft((v: any) => ({ ...v, item_name: val }))} />
                    <DetailRow label="Description" value={d.description} editing={editing} onChange={(val) => setDraft((v: any) => ({ ...v, description: val }))} />
                    <DetailRow label="Unit cost" value={`${d.currency || 'USD'} ${Intl.NumberFormat('en-US').format(d.unit_cost || 0)}`} editing={false} />
                    <DetailRow label="Category" value={d.category} editing={editing} onChange={(val) => setDraft((v: any) => ({ ...v, category: val }))} />
                    <DetailRow label="Date Submitted" value={d.date_submitted ? new Date(d.date_submitted).toLocaleDateString() : ''} editing={false} />
                </CardContent>
            </Card>

            {/* Supporting documents */}
            <Card>
                <CardHeader>
                    <CardTitle>Supporting Documents</CardTitle>
                </CardHeader>
                <CardContent className="p-6 flex flex-wrap gap-3">
                    {documents?.map((doc) => (
                        <Button key={doc.id} variant="outline" size="sm" asChild>
                            <a href={doc.url} target="_blank" rel="noreferrer">
                                <img src="/material-symbols-download1.svg" className="w-4 h-4 mr-2" alt="doc" />
                                {doc.title}
                            </a>
                        </Button>
                    ))}
                </CardContent>
            </Card>

            {/* Activity log */}
            <Card>
                <CardHeader>
                    <CardTitle>Activity log</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                    {activity?.map((a) => (
                        <div key={a.id} className="flex items-center justify-between text-sm">
                            <div className="text-gray-700">{a.event}</div>
                            <div className="text-gray-400">{new Date(a.created_at).toLocaleString()}</div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
};

const DetailRow: React.FC<{ label: string; value?: string | number | null; editing?: boolean; onChange?: (v: string) => void }> = ({ label, value, editing, onChange }) => (
    <div className="grid grid-cols-2 gap-2 items-center">
        <div className="text-xs text-gray-500">{label}</div>
        {editing ? (
            <Input value={(value as string) || ''} onChange={(e) => onChange?.(e.target.value)} />
        ) : (
            <div className="text-sm text-gray-900 text-right md:text-left">{value ?? '—'}</div>
        )}
    </div>
);

export default RequisitionDetailPage;


