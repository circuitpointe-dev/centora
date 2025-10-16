import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const VendorContractDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const { vendorId, contractId } = useParams<{ vendorId: string; contractId: string }>();

    const { data, isLoading, error } = useQuery({
        queryKey: ['vendor-contract-detail', contractId],
        enabled: !!contractId,
        queryFn: async () => {
            const { data, error } = await (supabase as any)
                .from('vendor_contracts')
                .select('id, vendor_id, contract_code, title, start_date, end_date, value, currency, status, notes, created_at, updated_at')
                .eq('id', contractId)
                .maybeSingle();
            if (error) throw error;
            return data;
        }
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading contract...</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="text-destructive">{(error as any)?.message || 'Contract not found'}</div>
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
                <div>
                    <h1 className="text-2xl font-semibold text-[#383839]">Contract {data.contract_code}</h1>
                    <div className="text-sm text-[#6b7280]">Vendor: {vendorId}</div>
                </div>
                <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
            </div>

            <Card>
                <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <div className="text-xs text-gray-500">Title</div>
                        <div className="text-sm text-[#383839]">{data.title}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500">Status</div>
                        <div className="text-sm text-[#383839]">{data.status}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500">Value</div>
                        <div className="text-sm text-[#383839]">{data.currency || ''} {data.value ?? '-'}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500">Start date</div>
                        <div className="text-sm text-[#383839]">{data.start_date || '-'}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500">End date</div>
                        <div className="text-sm text-[#383839]">{data.end_date || '-'}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500">Last updated</div>
                        <div className="text-sm text-[#383839]">{data.updated_at || data.created_at}</div>
                    </div>
                    <div className="sm:col-span-2 lg:col-span-3">
                        <div className="text-xs text-gray-500">Notes</div>
                        <div className="text-sm text-[#383839]">{data.notes || '-'}</div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default VendorContractDetailPage;


