import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useVendors, useCreateVendor, useUpdateVendor, useDeleteVendor, Vendor, useVendorStats } from '@/hooks/procurement/useVendors';
import VendorClarificationModal from './VendorClarificationModal';
import { toast } from 'sonner';

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
    const { data: stats } = useVendorStats();
    const createVendor = useCreateVendor();
    const updateVendor = useUpdateVendor();
    const deleteVendor = useDeleteVendor();

    const vendors = data?.vendors || [];
    const nextExpiry = (vendorId: string) => (data as any)?.nextExpiryByVendor?.[vendorId] || '-';
    const total = data?.total || 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const [draft, setDraft] = useState<Partial<Vendor>>({ vendor_name: '', email: '', phone: '', is_active: true, contact_person: '' });

    const exportCsv = () => {
        const rows = [
            ['Name', 'Contact Person', 'Email', 'Phone', 'City', 'Country', 'Status', 'Rating'],
            ...vendors.map(v => [v.vendor_name, v.contact_person || '', v.email || '', v.phone || '', v.city || '', v.country || '', v.is_active ? 'Active' : 'Inactive', String(v.rating || '')])
        ];
        const csv = rows.map(r => r.map(val => `"${String(val ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `vendors-${new Date().toISOString().slice(0, 10)}.csv`; a.click(); URL.revokeObjectURL(url);
    };

    const handleCreate = async () => {
        try {
            if (!draft.vendor_name?.trim()) {
                toast.error('Vendor name is required');
                return;
            }

            console.log('Creating vendor with data:', draft);
            await createVendor.mutateAsync(draft as any);
            toast.success('Vendor created successfully');
            setIsCreateOpen(false);
            setDraft({ vendor_name: '', email: '', phone: '', is_active: true, contact_person: '', city: '', country: '', rating: undefined } as any);
        } catch (error) {
            console.error('Error creating vendor:', error);
            toast.error((error as any)?.message || 'Failed to create vendor');
        }
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
                    vendor_name: r.name || r.vendor || r.vendor_name || '',
                    contact_person: r.contact || r.contact_person || undefined,
                    email: r.email || undefined,
                    phone: r.phone || undefined,
                    is_active: r.status?.toLowerCase() !== 'inactive',
                    city: r.city || undefined,
                    country: r.country || undefined,
                }))
                .filter(r => r.vendor_name);
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

    const statusBadge = (isActive: boolean) => {
        if (isActive) return <Badge className="bg-[#d1fae5] text-[#059669] hover:bg-[#d1fae5]">Active</Badge>;
        return <Badge className="bg-[#f3f4f6] text-[#6b7280] hover:bg-[#f3f4f6]">Inactive</Badge>;
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

            {/* KPI Cards - pixel-perfect per Figma with exact SVGs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="rounded-[12px] border border-[#EEF2F6] h-[136px]" style={{ boxShadow: '0px 12px 40px rgba(17, 12, 46, 0.06)' }}>
                    <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center">
                        <div className="mb-3 h-12 w-12 rounded-full bg-[#E6FAEF] flex items-center justify-center">
                            <img src="/group0.svg" alt="Active vendors" className="h-6 w-6" />
                        </div>
                        <div className="text-[32px] leading-[40px] font-semibold text-[#111827]">{stats?.activeVendors ?? 0}</div>
                        <div className="mt-1 text-sm text-[#6B7280]">Active vendors</div>
                    </CardContent>
                </Card>
                <Card className="rounded-[12px] border border-[#EEF2F6] h-[136px]" style={{ boxShadow: '0px 12px 40px rgba(17, 12, 46, 0.06)' }}>
                    <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center">
                        <div className="mb-3 h-12 w-12 rounded-full bg-[#FFF7E6] flex items-center justify-center">
                            <img src="/layer-12.svg" alt="Expiring contracts" className="h-6 w-6" />
                        </div>
                        <div className="text-[32px] leading-[40px] font-semibold text-[#111827]">{stats?.expiringContracts30d ?? 0}</div>
                        <div className="mt-1 text-sm text-[#6B7280]">Expiring contracts (30 days)</div>
                    </CardContent>
                </Card>
                <Card className="rounded-[12px] border border-[#EEF2F6] h-[136px]" style={{ boxShadow: '0px 12px 40px rgba(17, 12, 46, 0.06)' }}>
                    <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center">
                        <div className="mb-3 h-12 w-12 rounded-full bg-[#FDE7E7] flex items-center justify-center">
                            <img src="/layer-13.svg" alt="High risk" className="h-6 w-6" />
                        </div>
                        <div className="text-[32px] leading-[40px] font-semibold text-[#111827]">{stats?.highRiskVendors ?? 0}</div>
                        <div className="mt-1 text-sm text-[#6B7280]">High risk vendors</div>
                    </CardContent>
                </Card>
            </div>

            {/* Toolbar title per Figma */}
            <div className="flex items-center justify-between mt-6">
                <div className="text-sm font-medium text-[#383839]">Vendor management lists</div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="relative">
                        <Input placeholder="Search…" value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} className="w-full sm:w-64" />
                    </div>
                    <div className="flex items-center gap-2">
                        <select value={status} onChange={e => { setPage(1); setStatus(e.target.value); }} className="h-9 rounded-md border border-[#e5e7eb] bg-white px-3 text-sm">
                            <option value="">All status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <Button variant="outline" size="sm" onClick={exportCsv}>Export</Button>
                    <Button size="sm" className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white" onClick={() => setIsCreateOpen(true)}>
                        Add vendor
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next expiry</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {vendors.map(v => (
                                    <tr key={v.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/dashboard/procurement/vendors/${v.id}`)}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#383839]">{v.vendor_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6b7280]">{v.rating ?? '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6b7280]">{nextExpiry(v.id)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6b7280]">
                                            {v.rating != null ? (
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${v.rating >= 70 ? 'bg-red-100 text-red-800' :
                                                    v.rating >= 40 ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-green-100 text-green-800'
                                                    }`}>
                                                    {v.rating >= 70 ? 'High' : v.rating >= 40 ? 'Medium' : 'Low'}
                                                </span>
                                            ) : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{statusBadge(v.is_active)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/procurement/vendors/${v.id}`); }}>
                                                <img src="/eye0.svg" alt="view" className="w-4 h-4 mr-1" />
                                                View
                                            </Button>
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
                                        <div className="font-medium text-[#383839]">{v.vendor_name}</div>
                                        {v.contact_person && <div className="text-xs text-[#6b7280]">{v.contact_person}</div>}
                                        <div className="text-xs text-[#6b7280]">{v.email || '-'}</div>
                                        <div className="text-xs text-[#6b7280]">{v.phone || '-'}</div>
                                    </div>
                                    {statusBadge(v.is_active)}
                                </div>
                                <div className="flex items-center gap-2 mt-3">
                                    <Button variant="outline" size="sm" onClick={() => navigate(`/dashboard/procurement/vendors/${v.id}`)}>View</Button>
                                    <Button variant="outline" size="sm" onClick={() => setEditingVendor(v)}>Edit</Button>
                                    <Button variant="outline" size="sm" onClick={() => setClarificationModal({ isOpen: true, vendorId: v.id, vendorName: v.vendor_name })}>Clarify</Button>
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
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-[#383839]">New vendor</h3>
                                <p className="text-sm text-[#6B7280] mt-1">Add a new vendor to your procurement system</p>
                            </div>
                            <button
                                onClick={() => setIsCreateOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Basic Information Section */}
                            <div>
                                <h4 className="text-sm font-medium text-[#383839] mb-4 flex items-center">
                                    <div className="w-2 h-2 bg-[#7c3aed] rounded-full mr-2"></div>
                                    Basic Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#374151] mb-2">
                                            Vendor Name <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            value={draft.vendor_name || ''}
                                            onChange={e => setDraft(v => ({ ...v, vendor_name: e.target.value }))}
                                            placeholder="Enter vendor company name"
                                            className="h-11 border-gray-200 focus:border-[#7c3aed] focus:ring-[#7c3aed]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#374151] mb-2">Contact Person</label>
                                        <Input
                                            value={draft.contact_person || ''}
                                            onChange={e => setDraft(v => ({ ...v, contact_person: e.target.value }))}
                                            placeholder="Enter primary contact name"
                                            className="h-11 border-gray-200 focus:border-[#7c3aed] focus:ring-[#7c3aed]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information Section */}
                            <div>
                                <h4 className="text-sm font-medium text-[#383839] mb-4 flex items-center">
                                    <div className="w-2 h-2 bg-[#7c3aed] rounded-full mr-2"></div>
                                    Contact Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#374151] mb-2">Email Address</label>
                                        <Input
                                            type="email"
                                            value={draft.email || ''}
                                            onChange={e => setDraft(v => ({ ...v, email: e.target.value }))}
                                            placeholder="vendor@company.com"
                                            className="h-11 border-gray-200 focus:border-[#7c3aed] focus:ring-[#7c3aed]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#374151] mb-2">Phone Number</label>
                                        <Input
                                            value={draft.phone || ''}
                                            onChange={e => setDraft(v => ({ ...v, phone: e.target.value }))}
                                            placeholder="+1 (555) 123-4567"
                                            className="h-11 border-gray-200 focus:border-[#7c3aed] focus:ring-[#7c3aed]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Location Information Section */}
                            <div>
                                <h4 className="text-sm font-medium text-[#383839] mb-4 flex items-center">
                                    <div className="w-2 h-2 bg-[#7c3aed] rounded-full mr-2"></div>
                                    Location Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#374151] mb-2">City</label>
                                        <Input
                                            value={draft.city || ''}
                                            onChange={e => setDraft(v => ({ ...v, city: e.target.value }))}
                                            placeholder="Enter city"
                                            className="h-11 border-gray-200 focus:border-[#7c3aed] focus:ring-[#7c3aed]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#374151] mb-2">Country</label>
                                        <Input
                                            value={draft.country || ''}
                                            onChange={e => setDraft(v => ({ ...v, country: e.target.value }))}
                                            placeholder="Enter country"
                                            className="h-11 border-gray-200 focus:border-[#7c3aed] focus:ring-[#7c3aed]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Additional Information Section */}
                            <div>
                                <h4 className="text-sm font-medium text-[#383839] mb-4 flex items-center">
                                    <div className="w-2 h-2 bg-[#7c3aed] rounded-full mr-2"></div>
                                    Additional Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#374151] mb-2">Initial Rating</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={(draft as any).rating || ''}
                                            onChange={e => setDraft(v => ({ ...v, rating: Number(e.target.value) } as any))}
                                            className="w-full h-11 rounded-md border border-gray-200 bg-white px-3 text-sm focus:border-[#7c3aed] focus:ring-[#7c3aed]"
                                            placeholder="0-100"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                            <div className="text-sm text-[#6B7280]">
                                <span className="text-red-500">*</span> Required fields
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsCreateOpen(false)}
                                    className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => {
                                        console.log('Create button clicked');
                                        handleCreate();
                                    }}
                                    className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-6 py-2 shadow-sm"
                                    disabled={createVendor.isPending || !draft.vendor_name?.trim()}
                                >
                                    {createVendor.isPending ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Creating...
                                        </div>
                                    ) : (
                                        'Create Vendor'
                                    )}
                                </Button>
                            </div>
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
                                <label className="block text-sm text-gray-600 mb-1">Vendor Name *</label>
                                <Input value={editingVendor.vendor_name || ''} onChange={e => setEditingVendor(v => ({ ...(v as Vendor), vendor_name: e.target.value }))} />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Contact Person</label>
                                <Input value={editingVendor.contact_person || ''} onChange={e => setEditingVendor(v => ({ ...(v as Vendor), contact_person: e.target.value }))} />
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">City</label>
                                    <Input value={editingVendor.city || ''} onChange={e => setEditingVendor(v => ({ ...(v as Vendor), city: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Country</label>
                                    <Input value={editingVendor.country || ''} onChange={e => setEditingVendor(v => ({ ...(v as Vendor), country: e.target.value }))} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Status</label>
                                <select
                                    value={editingVendor.is_active ? 'active' : 'inactive'}
                                    onChange={e => setEditingVendor(v => ({ ...(v as Vendor), is_active: e.target.value === 'active' }))}
                                    className="w-full h-9 rounded-md border border-[#e5e7eb] bg-white px-3 text-sm"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
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


