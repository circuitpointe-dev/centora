import React, { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useVendors } from '@/hooks/procurement/useVendors';

const pageSize = 12;

const VendorClassificationPage: React.FC = () => {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<string>('');
    const [page, setPage] = useState(1);

    const { data, isLoading, error } = useVendors({ page, limit: pageSize, search, status });
    const vendors = data?.vendors || [];
    const total = data?.total || 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const classified = useMemo(() => {
        const groups: Record<string, typeof vendors> = {};
        const key = 'All Vendors';
        if (vendors.length > 0) {
            groups[key] = vendors;
        }
        return groups;
    }, [vendors]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading classification...</p>
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
                <h1 className="text-2xl font-semibold text-[#383839]">Vendor classification</h1>
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
            </div>

            {Object.keys(classified).length === 0 ? (
                <Card><CardContent className="p-6 text-sm text-[#6b7280]">No vendors found.</CardContent></Card>
            ) : (
                <div className="space-y-6">
                    {Object.entries(classified).map(([category, items]) => (
                        <Card key={category}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <img src="/category-folder.svg" className="w-6 h-6" />
                                        <div className="text-sm font-medium text-[#383839]">{category}</div>
                                    </div>
                                    <Badge variant="secondary">{items.length} vendors</Badge>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {items.map(v => (
                                        <div key={v.id} className="border rounded-md p-4">
                                            <div className="text-sm font-medium text-[#383839]">{v.name}</div>
                                            <div className="text-xs text-[#6b7280]">{v.email || '-'}</div>
                                            <div className="text-xs text-[#6b7280]">{v.city || ''}{v.city && v.country ? ', ' : ''}{v.country || ''}</div>
                                            <div className="mt-2 text-xs text-[#6b7280]">Status: {v.status || '-'}</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <div className="flex items-center justify-between text-sm text-[#6b7280]">
                <div>Showing {vendors.length ? (pageSize * (page - 1) + 1) : 0} to {Math.min(pageSize * page, total)} of {total} vendors</div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
                    <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
                </div>
            </div>
        </div>
    );
};

export default VendorClassificationPage;


