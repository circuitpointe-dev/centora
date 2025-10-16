import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface VendorClarificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    vendorId: string;
    vendorName: string;
}

const VendorClarificationModal: React.FC<VendorClarificationModalProps> = ({
    isOpen,
    onClose,
    vendorId,
    vendorName
}) => {
    const [clarification, setClarification] = useState({
        type: 'general',
        priority: 'medium',
        subject: '',
        message: '',
        dueDate: ''
    });

    const qc = useQueryClient();

    const createClarification = useMutation({
        mutationFn: async (payload: any) => {
            const { error } = await (supabase as any)
                .from('vendor_clarifications')
                .insert(payload);
            if (error) throw error;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['vendor-clarifications', vendorId] });
            toast.success('Clarification request sent successfully');
            onClose();
            setClarification({
                type: 'general',
                priority: 'medium',
                subject: '',
                message: '',
                dueDate: ''
            });
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to send clarification request');
        }
    });

    const handleSubmit = async () => {
        if (!clarification.subject || !clarification.message) {
            toast.error('Please fill in all required fields');
            return;
        }

        await createClarification.mutateAsync({
            vendor_id: vendorId,
            type: clarification.type,
            priority: clarification.priority,
            subject: clarification.subject,
            message: clarification.message,
            due_date: clarification.dueDate || null,
            status: 'pending',
            created_at: new Date().toISOString()
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-[#383839]">Request Clarification</h3>
                        <p className="text-sm text-[#6b7280]">Vendor: {vendorName}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                                value={clarification.type}
                                onChange={(e) => setClarification(prev => ({ ...prev, type: e.target.value }))}
                                className="w-full h-9 rounded-md border border-gray-300 bg-white px-3 text-sm"
                            >
                                <option value="general">General</option>
                                <option value="contract">Contract</option>
                                <option value="performance">Performance</option>
                                <option value="documentation">Documentation</option>
                                <option value="payment">Payment</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                            <select
                                value={clarification.priority}
                                onChange={(e) => setClarification(prev => ({ ...prev, priority: e.target.value }))}
                                className="w-full h-9 rounded-md border border-gray-300 bg-white px-3 text-sm"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                        <Input
                            value={clarification.subject}
                            onChange={(e) => setClarification(prev => ({ ...prev, subject: e.target.value }))}
                            placeholder="Enter clarification subject"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                        <textarea
                            value={clarification.message}
                            onChange={(e) => setClarification(prev => ({ ...prev, message: e.target.value }))}
                            placeholder="Enter detailed clarification request"
                            className="w-full h-32 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date (Optional)</label>
                        <Input
                            type="date"
                            value={clarification.dueDate}
                            onChange={(e) => setClarification(prev => ({ ...prev, dueDate: e.target.value }))}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge variant={clarification.priority === 'urgent' ? 'destructive' : clarification.priority === 'high' ? 'default' : 'secondary'}>
                            {clarification.priority.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">{clarification.type}</Badge>
                    </div>
                </div>

                <div className="p-6 border-t flex items-center justify-end gap-3">
                    <Button variant="outline" onClick={onClose} disabled={createClarification.isPending}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white"
                        disabled={createClarification.isPending}
                    >
                        {createClarification.isPending ? 'Sending...' : 'Send Request'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default VendorClarificationModal;
