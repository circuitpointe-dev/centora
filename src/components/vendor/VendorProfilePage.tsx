import React, { useRef, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useVendors, useVendorContracts, useVendorDocuments, useVendorPerformance, useUpdateVendor, useCreateVendorDocument, useCreateVendorContract, useCreateVendorPerformance, useUploadVendorDocument, useBulkCreateVendorContracts, useBulkCreateVendorDocuments } from '@/hooks/procurement/useVendors';

const VendorProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'overview' | 'vetting' | 'contracts' | 'performance'>('overview');

    const { data, isLoading, error } = useVendors({ page: 1, limit: 1, search: id || '', status: '' });
    const vendor = (data?.vendors || []).find(v => v.id === id) || (data?.vendors || [])[0];

    const { data: contractsData } = useVendorContracts(vendor?.id || null, { page: 1, limit: 10 });
    const { data: documents } = useVendorDocuments(vendor?.id || null);
    const { data: perf } = useVendorPerformance(vendor?.id || null, {});
    const updateVendor = useUpdateVendor();

    // Performance charts data
    const performanceChartData = useMemo(() => {
        if (!perf || perf.length === 0) return [];
        return perf.map((p: any) => ({
            period: `${p.period_start} - ${p.period_end}`,
            delivery: p.delivery_score || 0,
            quality: p.quality_score || 0,
            cost: p.cost_score || 0,
            overall: p.overall_score || 0
        }));
    }, [perf]);

    const performanceKPIs = useMemo(() => {
        if (!perf || perf.length === 0) return { avgDelivery: 0, avgQuality: 0, avgCost: 0, avgOverall: 0 };
        const totals = perf.reduce((acc: any, p: any) => ({
            delivery: acc.delivery + (p.delivery_score || 0),
            quality: acc.quality + (p.quality_score || 0),
            cost: acc.cost + (p.cost_score || 0),
            overall: acc.overall + (p.overall_score || 0)
        }), { delivery: 0, quality: 0, cost: 0, overall: 0 });
        const count = perf.length;
        return {
            avgDelivery: Math.round(totals.delivery / count * 10) / 10,
            avgQuality: Math.round(totals.quality / count * 10) / 10,
            avgCost: Math.round(totals.cost / count * 10) / 10,
            avgOverall: Math.round(totals.overall / count * 10) / 10
        };
    }, [perf]);
    const createDoc = useCreateVendorDocument();
    const createContract = useCreateVendorContract();
    const createPerf = useCreateVendorPerformance();
    const uploadDoc = useUploadVendorDocument();
    const bulkCreateContracts = useBulkCreateVendorContracts();
    const bulkCreateDocs = useBulkCreateVendorDocuments();

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const contractsCsvRef = useRef<HTMLInputElement | null>(null);
    const documentsCsvRef = useRef<HTMLInputElement | null>(null);
    const [docDraft, setDocDraft] = useState<{ title: string; type?: string; url?: string; status?: string; expires_at?: string }>({ title: '' });
    const [docFile, setDocFile] = useState<File | null>(null);
    const [isDocOpen, setIsDocOpen] = useState(false);
    const [isContractOpen, setIsContractOpen] = useState(false);
    const [contractDraft, setContractDraft] = useState<{ title: string; start_date?: string; end_date?: string; value?: number; currency?: string; status?: string }>({ title: '' });
    const [isPerfOpen, setIsPerfOpen] = useState(false);
    const [perfDraft, setPerfDraft] = useState<{ period_start: string; period_end: string; delivery_score?: number; quality_score?: number; cost_score?: number; overall_score?: number; notes?: string }>({ period_start: '', period_end: '' });

    const generateContractCode = () => {
        const now = new Date();
        const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
        const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
        return `CON-${ymd}-${suffix}`;
    };

    const parseCsv = (text: string) => {
        const lines = text.split(/\r?\n/).filter(l => l.trim().length);
        if (lines.length === 0) return [] as any[];
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const rows: any[] = [];
        for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',');
            if (!cols.length) continue;
            const obj: any = {};
            headers.forEach((h, idx) => {
                obj[h] = (cols[idx] ?? '').trim();
            });
            rows.push(obj);
        }
        return rows;
    };

    const handleBulkContracts = async (file: File) => {
        if (!vendor?.id) return;
        try {
            const text = await file.text();
            const records = parseCsv(text);
            const contracts = records
                .map(r => ({
                    title: r.title || r.name || '',
                    start_date: r.start_date || r.start || undefined,
                    end_date: r.end_date || r.end || undefined,
                    value: r.value ? Number(r.value) : undefined,
                    currency: r.currency || undefined,
                    status: r.status || 'Active'
                }))
                .filter(r => r.title);

            if (contracts.length === 0) {
                toast.error('No valid contracts found in CSV');
                return;
            }

            await bulkCreateContracts.mutateAsync({ vendor_id: vendor.id, contracts });
            toast.success(`Successfully imported ${contracts.length} contracts`);
        } catch (error) {
            toast.error((error as any)?.message || 'Failed to import contracts');
        }
    };

    const handleBulkDocuments = async (file: File) => {
        if (!vendor?.id) return;
        try {
            const text = await file.text();
            const records = parseCsv(text);
            const documents = records
                .map(r => ({
                    title: r.title || r.name || '',
                    type: r.type || undefined,
                    url: r.url || r.link || '',
                    status: r.status || 'Active',
                    expires_at: r.expires_at || r.expires || undefined
                }))
                .filter(r => r.title && r.url);

            if (documents.length === 0) {
                toast.error('No valid documents found in CSV');
                return;
            }

            await bulkCreateDocs.mutateAsync({ vendor_id: vendor.id, documents });
            toast.success(`Successfully imported ${documents.length} documents`);
        } catch (error) {
            toast.error((error as any)?.message || 'Failed to import documents');
        }
    };

    const handleCreateDoc = async () => {
        if (!vendor?.id || !docDraft.title) return;
        try {
            let url = docDraft.url;
            if (!url && docFile) {
                const res = await uploadDoc.mutateAsync({ vendor_id: vendor.id, file: docFile });
                url = res.url;
            }
            if (!url) return;
            await createDoc.mutateAsync({ vendor_id: vendor.id, title: docDraft.title, type: docDraft.type, url, status: docDraft.status, expires_at: docDraft.expires_at });
            toast.success('Document uploaded successfully');
            setIsDocOpen(false);
            setDocDraft({ title: '' });
            setDocFile(null);
        } catch (error) {
            toast.error((error as any)?.message || 'Failed to upload document');
        }
    };

    const handleCreateContract = async () => {
        if (!vendor?.id || !contractDraft.title) return;
        try {
            const code = generateContractCode();
            await createContract.mutateAsync({ vendor_id: vendor.id, contract_code: code, title: contractDraft.title, start_date: contractDraft.start_date, end_date: contractDraft.end_date, value: Number(contractDraft.value || 0) || undefined, currency: contractDraft.currency, status: contractDraft.status || 'Active' });
            toast.success('Contract created successfully');
            setIsContractOpen(false);
            setContractDraft({ title: '' });
        } catch (error) {
            toast.error((error as any)?.message || 'Failed to create contract');
        }
    };

    const handleCreatePerf = async () => {
        if (!vendor?.id || !perfDraft.period_start || !perfDraft.period_end) return;
        try {
            await createPerf.mutateAsync({ vendor_id: vendor.id, ...perfDraft });
            toast.success('Performance entry added successfully');
            setIsPerfOpen(false);
            setPerfDraft({ period_start: '', period_end: '' });
        } catch (error) {
            toast.error((error as any)?.message || 'Failed to add performance entry');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading vendor...</p>
                </div>
            </div>
        );
    }
    if (error || !vendor) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="text-destructive">{(error as any)?.message || 'Vendor not found'}</div>
                            <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-[#383839]">{vendor.name}</h1>
                <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
            </div>

            <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-lg w-full lg:w-fit">
                {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'vetting', label: 'Vetting' },
                    { id: 'contracts', label: 'Contracts' },
                    { id: 'performance', label: 'Performance' },
                ].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-[#7c3aed] shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>{tab.label}</button>
                ))}
            </div>

            {activeTab === 'overview' && (
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <div className="text-xs text-gray-500">Email</div>
                                <div className="text-sm text-[#383839]">{vendor.email || '-'}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">Phone</div>
                                <div className="text-sm text-[#383839]">{vendor.phone || '-'}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">Category</div>
                                <div className="text-sm text-[#383839]">{vendor.category || '-'}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">Status</div>
                                <div className="text-sm text-[#383839]">{vendor.status || '-'}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">Location</div>
                                <div className="text-sm text-[#383839]">{[vendor.city, vendor.country].filter(Boolean).join(', ') || '-'}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">Risk score</div>
                                <div className="text-sm text-[#383839]">{vendor.risk_score ?? '-'}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeTab === 'vetting' && (
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-[#383839]">Documents</div>
                            <div className="flex gap-2">
                                <input ref={documentsCsvRef} type="file" accept=".csv" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleBulkDocuments(f); }} />
                                <Button variant="outline" size="sm" onClick={() => documentsCsvRef.current?.click()}>Bulk import</Button>
                                <Button size="sm" onClick={() => setIsDocOpen(true)} className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white">Upload document</Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {(documents || []).map((d: any) => (
                                <div key={d.id} className="border rounded-md p-3 flex items-center justify-between">
                                    <div>
                                        <div className="text-sm text-[#383839]">{d.title}</div>
                                        <div className="text-xs text-[#6b7280]">{d.type} • {d.status}</div>
                                    </div>
                                    <a href={d.url} target="_blank" className="text-xs text-[#7c3aed]">View</a>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeTab === 'contracts' && (
                <Card>
                    <CardContent className="p-0">
                        <div className="p-4 flex items-center justify-end gap-2">
                            <input ref={contractsCsvRef} type="file" accept=".csv" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleBulkContracts(f); }} />
                            <Button variant="outline" size="sm" onClick={() => contractsCsvRef.current?.click()}>Bulk import</Button>
                            <Button size="sm" onClick={() => setIsContractOpen(true)} className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white">New contract</Button>
                        </div>
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr className="text-left text-xs text-gray-500">
                                        <th className="px-4 py-3">Code</th>
                                        <th className="px-4 py-3">Title</th>
                                        <th className="px-4 py-3">Start</th>
                                        <th className="px-4 py-3">End</th>
                                        <th className="px-4 py-3">Value</th>
                                        <th className="px-4 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(contractsData?.contracts || []).map((c: any) => (
                                        <tr key={c.id} className="border-b text-sm hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/dashboard/procurement/vendors/${vendor.id}/contracts/${c.id}`)}>
                                            <td className="px-4 py-3 text-gray-700">{c.contract_code}</td>
                                            <td className="px-4 py-3 text-gray-700">{c.title}</td>
                                            <td className="px-4 py-3 text-gray-700">{c.start_date || '-'}</td>
                                            <td className="px-4 py-3 text-gray-700">{c.end_date || '-'}</td>
                                            <td className="px-4 py-3 text-gray-700">{c.currency || ''} {c.value || '-'}</td>
                                            <td className="px-4 py-3 text-gray-700">{c.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeTab === 'performance' && (
                <div className="space-y-6">
                    {/* Performance KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-semibold text-[#383839]">{performanceKPIs.avgDelivery}</div>
                                <div className="text-xs text-[#6b7280]">Avg Delivery Score</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-semibold text-[#383839]">{performanceKPIs.avgQuality}</div>
                                <div className="text-xs text-[#6b7280]">Avg Quality Score</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-semibold text-[#383839]">{performanceKPIs.avgCost}</div>
                                <div className="text-xs text-[#6b7280]">Avg Cost Score</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-semibold text-[#383839]">{performanceKPIs.avgOverall}</div>
                                <div className="text-xs text-[#6b7280]">Avg Overall Score</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Performance Trends Chart */}
                    {performanceChartData.length > 0 && (
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-[#383839]">Performance Trends</h3>
                                    <Button size="sm" onClick={() => setIsPerfOpen(true)} className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white">Add performance</Button>
                                </div>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={performanceChartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="period" />
                                            <YAxis />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="delivery" stroke="#8884d8" strokeWidth={2} />
                                            <Line type="monotone" dataKey="quality" stroke="#82ca9d" strokeWidth={2} />
                                            <Line type="monotone" dataKey="cost" stroke="#ffc658" strokeWidth={2} />
                                            <Line type="monotone" dataKey="overall" stroke="#ff7300" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Performance Details */}
                    <Card>
                        <CardContent className="p-6 space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-[#383839]">Performance History</h3>
                                <Button size="sm" onClick={() => setIsPerfOpen(true)} className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white">Add performance</Button>
                            </div>
                            {(perf || []).map((p: any) => (
                                <div key={p.id} className="border rounded-md p-3 grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                                    <div><span className="text-gray-500 text-xs">Period</span><div>{p.period_start} → {p.period_end}</div></div>
                                    <div><span className="text-gray-500 text-xs">Delivery</span><div>{p.delivery_score ?? '-'}</div></div>
                                    <div><span className="text-gray-500 text-xs">Quality</span><div>{p.quality_score ?? '-'}</div></div>
                                    <div><span className="text-gray-500 text-xs">Cost</span><div>{p.cost_score ?? '-'}</div></div>
                                    <div><span className="text-gray-500 text-xs">Overall</span><div>{p.overall_score ?? '-'}</div></div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Upload Document Modal */}
            {isDocOpen && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Upload document</h3>
                            <button onClick={() => setIsDocOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                        </div>
                        <div className="p-4 space-y-3">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Title</label>
                                <Input value={docDraft.title} onChange={e => setDocDraft(v => ({ ...v, title: e.target.value }))} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Type</label>
                                    <Input value={docDraft.type || ''} onChange={e => setDocDraft(v => ({ ...v, type: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Status</label>
                                    <Input value={docDraft.status || ''} onChange={e => setDocDraft(v => ({ ...v, status: e.target.value }))} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">File URL</label>
                                    <Input value={docDraft.url || ''} onChange={e => setDocDraft(v => ({ ...v, url: e.target.value }))} placeholder="https://..." />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Or upload file</label>
                                    <input type="file" accept="application/pdf,image/*" onChange={e => setDocFile(e.target.files?.[0] || null)} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Expires at</label>
                                <Input type="date" value={docDraft.expires_at || ''} onChange={e => setDocDraft(v => ({ ...v, expires_at: e.target.value }))} />
                            </div>
                        </div>
                        <div className="p-4 border-t flex items-center justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsDocOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreateDoc} className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white" disabled={createDoc.isPending || uploadDoc.isPending}>Save</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* New Contract Modal */}
            {isContractOpen && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h3 className="text-lg font-semibold">New contract</h3>
                            <button onClick={() => setIsContractOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                        </div>
                        <div className="p-4 space-y-3">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Title</label>
                                <Input value={contractDraft.title} onChange={e => setContractDraft(v => ({ ...v, title: e.target.value }))} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Start date</label>
                                    <Input type="date" value={contractDraft.start_date || ''} onChange={e => setContractDraft(v => ({ ...v, start_date: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">End date</label>
                                    <Input type="date" value={contractDraft.end_date || ''} onChange={e => setContractDraft(v => ({ ...v, end_date: e.target.value }))} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Value</label>
                                    <Input type="number" value={String(contractDraft.value || '')} onChange={e => setContractDraft(v => ({ ...v, value: Number(e.target.value) }))} />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Currency</label>
                                    <Input value={contractDraft.currency || ''} onChange={e => setContractDraft(v => ({ ...v, currency: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Status</label>
                                    <Input value={contractDraft.status || 'Active'} onChange={e => setContractDraft(v => ({ ...v, status: e.target.value }))} />
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t flex items-center justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsContractOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreateContract} className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white" disabled={createContract.isPending}>Create</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Performance Modal */}
            {isPerfOpen && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Add performance</h3>
                            <button onClick={() => setIsPerfOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Period start</label>
                                    <Input type="date" value={perfDraft.period_start} onChange={e => setPerfDraft(v => ({ ...v, period_start: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Period end</label>
                                    <Input type="date" value={perfDraft.period_end} onChange={e => setPerfDraft(v => ({ ...v, period_end: e.target.value }))} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Delivery</label>
                                    <Input type="number" value={String(perfDraft.delivery_score ?? '')} onChange={e => setPerfDraft(v => ({ ...v, delivery_score: Number(e.target.value) }))} />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Quality</label>
                                    <Input type="number" value={String(perfDraft.quality_score ?? '')} onChange={e => setPerfDraft(v => ({ ...v, quality_score: Number(e.target.value) }))} />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Cost</label>
                                    <Input type="number" value={String(perfDraft.cost_score ?? '')} onChange={e => setPerfDraft(v => ({ ...v, cost_score: Number(e.target.value) }))} />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Overall</label>
                                    <Input type="number" value={String(perfDraft.overall_score ?? '')} onChange={e => setPerfDraft(v => ({ ...v, overall_score: Number(e.target.value) }))} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Notes</label>
                                <Input value={perfDraft.notes || ''} onChange={e => setPerfDraft(v => ({ ...v, notes: e.target.value }))} />
                            </div>
                        </div>
                        <div className="p-4 border-t flex items-center justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsPerfOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreatePerf} className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white" disabled={createPerf.isPending}>Save</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorProfilePage;


