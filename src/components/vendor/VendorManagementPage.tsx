import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useVendors, useCreateVendor, useUpdateVendor, useDeleteVendor, Vendor } from '@/hooks/procurement/useVendors';
import VendorClarificationModal from './VendorClarificationModal';

const pageSize = 10;

const VendorManagementPage: React.FC = () => {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<string>('');
    const [page, setPage] = useState(1);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
    const [clarificationModal, setClarificationModal] = useState<{ isOpen: boolean; vendorId: string; vendorName: string }>({ isOpen: false, vendorId: '', vendorName: '' });
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isBulkUploading, setIsBulkUploading] = useState(false);

    const navigate = useNavigate();
    const { data, isLoading, error } = useVendors({ page, limit: pageSize, search, status });
    const createVendor = useCreateVendor();
    const updateVendor = useUpdateVendor();
    const deleteVendor = useDeleteVendor();

    const vendors = data?.vendors || [];
    const total = data?.total || 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const [draft, setDraft] = useState<Partial<Vendor>>({ name: '', email: '', phone: '', status: 'Active', category: '' });

    const exportCsv = () => {
        const rows = [
            ['Name', 'Email', 'Phone', 'Category', 'Status', 'Rating', 'City', 'Country', 'Risk score', 'Vetting'],
            ...vendors.map(v => [v.name, v.email || '', v.phone || '', v.category || '', v.status || '', String(v.rating || ''), v.city || '', v.country || '', String(v.risk_score || ''), v.vetting_status || ''])
        ];
        const csv = rows.map(r => r.map(val => `"${String(val ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `vendors-${new Date().toISOString().slice(0, 10)}.csv`; a.click(); URL.revokeObjectURL(url);
    };

    const handleCreate = async () => {
        if (!draft.name) return;
        await createVendor.mutateAsync(draft as any);
        setIsCreateOpen(false);
        setDraft({ name: '', email: '', phone: '', status: 'Active', category: '' });
    };

    const handleUpdate = async () => {
        if (!editingVendor) return;
        await updateVendor.mutateAsync({ id: editingVendor.id, updates: editingVendor });
        setEditingVendor(null);
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

    const handleBulkUpload = async (file: File) => {
        setIsBulkUploading(true);
        try {
            const text = await file.text();
            const records = parseCsv(text);
            const mapped = records
                .map(r => ({
                    name: r.name || r.vendor || '',
                    email: r.email || undefined,
                    phone: r.phone || undefined,
                    category: r.category || undefined,
                    status: r.status || 'Active',
                    city: r.city || undefined,
                    country: r.country || undefined,
                }))
                .filter(r => r.name);
            // Insert sequentially to respect RLS with org_id from hook
            for (const rec of mapped) {
                // eslint-disable-next-line no-await-in-loop
                await createVendor.mutateAsync(rec as any);
            }
        } finally {
            setIsBulkUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const statusBadge = (s?: string) => {
        const val = (s || 'Active').toLowerCase();
        if (val === 'active') return <Badge className="bg-[#d1fae5] text-[#059669] hover:bg-[#d1fae5]">Active</Badge>;
        if (val === 'inactive') return <Badge className="bg-[#f3f4f6] text-[#6b7280] hover:bg-[#f3f4f6]">Inactive</Badge>;
        if (val === 'blocked') return <Badge className="bg-[#fee2e2] text-[#dc2626] hover:bg-[#fee2e2]">Blocked</Badge>;
        return <Badge variant="secondary">{s}</Badge>;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading vendors...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="p-6 text-destructive">{(error as any)?.message || 'Failed to load vendors'}</CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-[#383839]">Vendor management</h1>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="relative">
                        <img className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" src="/search0.svg" alt="search" />
                        <Input placeholder="Search vendors..." value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} className="pl-10 w-full sm:w-64" />
                    </div>
                    <div className="flex items-center gap-2">
                        <select value={status} onChange={e => { setPage(1); setStatus(e.target.value); }} className="h- nine rounded-md border border-[#e5e7eb] bg-white px-3 text-sm">
                            <option value="">All status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Blocked">Blocked</option>
                        </select>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <Button variant="outline" size="sm" onClick={exportCsv}><img className="w-4 h-4 mr-2" src="/uil-export0.svg" alt="export" />Export</Button>
                    <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleBulkUpload(f); }} />
                    <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isBulkUploading}>
                        <img className="w-4 h-4 mr-2" src="/bulk-upload0.svg" alt="bulk upload" />
                        {isBulkUploading ? 'Uploading…' : 'Bulk upload'}
                    </Button>
                    <Button size="sm" className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white" onClick={() => setIsCreateOpen(true)}>
                        <img className="w-4 h-4 mr-2" src="/material-symbols-add-rounded0.svg" alt="add" />
                        New vendor
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {vendors.map(v => (
                                    <tr key={v.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/dashboard/vendors/${v.id}`)}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#383839]">{v.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6b7280]">{v.email || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6b7280]">{v.phone || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6b7280]">{v.category || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{statusBadge(v.status)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6b7280]">{v.risk_score ?? '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setEditingVendor(v); }}>Edit</Button>
                                            <Button variant="outline" size="sm" className="ml-2" onClick={(e) => { e.stopPropagation(); setClarificationModal({ isOpen: true, vendorId: v.id, vendorName: v.name }); }}>Clarify</Button>
                                            <Button variant="outline" size="sm" className="ml-2 text-red-600" onClick={async () => { if (confirm('Delete vendor?')) await deleteVendor.mutateAsync(v.id); }}>Delete</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="lg:hidden p-4 space-y-3">
                        {vendors.map(v => (
                            <Card key={v.id} className="p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="font-medium text-[#383839]">{v.name}</div>
                                        <div className="text-xs text-[#6b7280]">{v.email || '-'}</div>
                                        <div className="text-xs text-[#6b7280]">{v.phone || '-'}</div>
                                    </div>
                                    {statusBadge(v.status)}
                                </div>
                                <div className="flex items-center gap-2 mt-3">
                                    <Button variant="outline" size="sm" onClick={() => navigate(`/dashboard/vendors/${v.id}`)}>View</Button>
                                    <Button variant="outline" size="sm" onClick={() => setEditingVendor(v)}>Edit</Button>
                                    <Button variant="outline" size="sm" onClick={() => setClarificationModal({ isOpen: true, vendorId: v.id, vendorName: v.name })}>Clarify</Button>
                                    <Button variant="outline" size="sm" className="text-red-600" onClick={async () => { if (confirm('Delete vendor?')) await deleteVendor.mutateAsync(v.id); }}>Delete</Button>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <div className="px-4 lg:px-6 py-4 border-t bg-gray-50">
                        <div className="flex items-center justify-between text-sm text-[#6b7280]">
                            <div>Showing {vendors.length ? (pageSize * (page - 1) + 1) : 0} to {Math.min(pageSize * page, total)} of {total} vendors</div>
                            <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
                                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Create Vendor Modal */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h3 className="text-lg font-semibold">New vendor</h3>
                            <button onClick={() => setIsCreateOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                        </div>
                        <div className="p-4 space-y-3">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Name</label>
                                <Input value={draft.name || ''} onChange={e => setDraft(v => ({ ...v, name: e.target.value }))} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Email</label>
                                    <Input value={draft.email || ''} onChange={e => setDraft(v => ({ ...v, email: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Phone</label>
                                    <Input value={draft.phone || ''} onChange={e => setDraft(v => ({ ...v, phone: e.target.value }))} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Category</label>
                                    <Input value={draft.category || ''} onChange={e => setDraft(v => ({ ...v, category: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Status</label>
                                    <Input value={draft.status || 'Active'} onChange={e => setDraft(v => ({ ...v, status: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">City</label>
                                    <Input value={draft.city || ''} onChange={e => setDraft(v => ({ ...v, city: e.target.value }))} />
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t flex items-center justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreate} className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white" disabled={createVendor.isPending}>Create</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Vendor Modal */}
            {!!editingVendor && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Edit vendor</h3>
                            <button onClick={() => setEditingVendor(null)} className="text-gray-500 hover:text-gray-700">✕</button>
                        </div>
                        <div className="p-4 space-y-3">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Name</label>
                                <Input value={editingVendor.name || ''} onChange={e => setEditingVendor(v => ({ ...(v as Vendor), name: e.target.value }))} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Email</label>
                                    <Input value={editingVendor.email || ''} onChange={e => setEditingVendor(v => ({ ...(v as Vendor), email: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Phone</label>
                                    <Input value={editingVendor.phone || ''} onChange={e => setEditingVendor(v => ({ ...(v as Vendor), phone: e.target.value }))} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Category</label>
                                    <Input value={editingVendor.category || ''} onChange={e => setEditingVendor(v => ({ ...(v as Vendor), category: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Status</label>
                                    <Input value={editingVendor.status || ''} onChange={e => setEditingVendor(v => ({ ...(v as Vendor), status: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">City</label>
                                    <Input value={editingVendor.city || ''} onChange={e => setEditingVendor(v => ({ ...(v as Vendor), city: e.target.value }))} />
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t flex items-center justify-end gap-2">
                            <Button variant="outline" onClick={() => setEditingVendor(null)}>Cancel</Button>
                            <Button onClick={handleUpdate} className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white" disabled={updateVendor.isPending}>Save</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Clarification Modal */}
            <VendorClarificationModal
                isOpen={clarificationModal.isOpen}
                onClose={() => setClarificationModal({ isOpen: false, vendorId: '', vendorName: '' })}
                vendorId={clarificationModal.vendorId}
                vendorName={clarificationModal.vendorName}
            />
        </div>
    );
};

export default VendorManagementPage;


