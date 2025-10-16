import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useVendors, useVendorContracts, useVendorDocuments, useVendorPerformance, useUpdateVendor } from '@/hooks/procurement/useVendors';

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
                        <div className="text-sm font-medium text-[#383839]">Documents</div>
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
                                        <tr key={c.id} className="border-b text-sm">
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
                <Card>
                    <CardContent className="p-6 space-y-3">
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
            )}
        </div>
    );
};

export default VendorProfilePage;


