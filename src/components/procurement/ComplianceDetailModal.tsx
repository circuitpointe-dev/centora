import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { X, Check, XCircle, Edit, Clock, User, DollarSign, Settings, Download, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useApproveMobileApproval, useRejectMobileApproval } from '@/hooks/procurement/useMobileApprovals';
import { useCreateAuditLog } from '@/hooks/procurement/useComplianceAudit';
import type { ComplianceAuditLog } from '@/hooks/procurement/useComplianceAudit';

interface ComplianceDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    auditLog: ComplianceAuditLog | null;
}

interface TimelineStep {
    id: string;
    title: string;
    status: 'completed' | 'current' | 'pending';
    timestamp?: string;
    icon: React.ReactNode;
}

const ComplianceDetailModal: React.FC<ComplianceDetailModalProps> = ({
    isOpen,
    onClose,
    auditLog
}) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const approveApproval = useApproveMobileApproval();
    const rejectApproval = useRejectMobileApproval();
    const createAuditLog = useCreateAuditLog();

    if (!auditLog) return null;

    // Create timeline steps based on audit log status
    const getTimelineSteps = (): TimelineStep[] => {
        const isApproved = auditLog.status === 'approved';
        const isPending = auditLog.status === 'pending';

        const steps: TimelineStep[] = [
            {
                id: 'created',
                title: 'Created',
                status: 'completed',
                timestamp: format(new Date(auditLog.created_at), 'MMM d, yyyy, h:mm a'),
                icon: <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full ml-0.5"></div>
                    <div className="w-1 h-1 bg-white rounded-full ml-0.5"></div>
                </div>
            },
            {
                id: 'manager_approval',
                title: 'Manager approval',
                status: isApproved ? 'completed' : isPending ? 'current' : 'pending',
                timestamp: isApproved ? format(new Date(auditLog.created_at), 'MMM d, yyyy, h:mm a') : undefined,
                icon: <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isApproved ? 'bg-purple-600' :
                        isPending ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                    <User className={`w-4 h-4 ${isApproved ? 'text-white' : 'text-gray-600'}`} />
                </div>
            },
            {
                id: 'finance_approval',
                title: 'Finance approval',
                status: isApproved ? 'completed' : 'pending',
                timestamp: isApproved ? format(new Date(auditLog.created_at), 'MMM d, yyyy, h:mm a') : undefined,
                icon: <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isApproved ? 'bg-purple-600' : 'bg-gray-100'
                    }`}>
                    <DollarSign className={`w-4 h-4 ${isApproved ? 'text-white' : 'text-gray-600'}`} />
                </div>
            },
            {
                id: 'procurement_head',
                title: 'Procurement head',
                status: isApproved ? 'completed' : 'pending',
                timestamp: isApproved ? format(new Date(auditLog.created_at), 'MMM d, yyyy, h:mm a') : undefined,
                icon: <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isApproved ? 'bg-purple-600' : 'bg-gray-100'
                    }`}>
                    <Settings className={`w-4 h-4 ${isApproved ? 'text-white' : 'text-gray-600'}`} />
                </div>
            }
        ];

        return steps;
    };

    const timelineSteps = getTimelineSteps();

    const handleApprove = async () => {
        if (!auditLog) return;

        setIsProcessing(true);
        try {
            // Create audit log for approval action
            await createAuditLog.mutateAsync({
                document_id: auditLog.document_id,
                document_type: auditLog.document_type,
                action: 'approve',
                status: 'approved',
                description: `Approved by ${auditLog.user_name}`,
                metadata: { original_log_id: auditLog.id }
            });

            toast.success('Audit log approved successfully');
            onClose();
        } catch (error) {
            toast.error('Failed to approve audit log');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!auditLog) return;

        setIsProcessing(true);
        try {
            // Create audit log for rejection action
            await createAuditLog.mutateAsync({
                document_id: auditLog.document_id,
                document_type: auditLog.document_type,
                action: 'reject',
                status: 'rejected',
                description: `Rejected by ${auditLog.user_name}`,
                metadata: { original_log_id: auditLog.id }
            });

            toast.success('Audit log rejected successfully');
            onClose();
        } catch (error) {
            toast.error('Failed to reject audit log');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleEdit = () => {
        // Implement edit functionality
        toast.info('Edit functionality coming soon');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <DialogTitle className="text-lg font-semibold">Detail view</DialogTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-8 w-8 p-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Action Timeline - Pixel Perfect Match */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-gray-900">Action Timeline</h3>
                        <div className="flex items-center space-x-4">
                            {timelineSteps.map((step, index) => (
                                <div key={step.id} className="flex items-center">
                                    <div className="flex flex-col items-center">
                                        <div className="flex items-center justify-center w-8 h-8">
                                            {step.icon}
                                        </div>
                                        <div className="mt-2 text-center">
                                            <p className="text-xs font-medium text-gray-900">{step.title}</p>
                                            {step.timestamp && (
                                                <p className="text-xs text-gray-500">{step.timestamp}</p>
                                            )}
                                        </div>
                                    </div>
                                    {index < timelineSteps.length - 1 && (
                                        <div className="flex-1 h-px bg-gray-200 mx-4">
                                            {step.status === 'completed' ? (
                                                <div className="h-full w-full bg-green-200"></div>
                                            ) : (
                                                <div className="h-full w-full bg-gray-200 border-dashed border-t-2"></div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Details Section - Pixel Perfect Match */}
                    <Card className="bg-gray-50 border-0">
                        <CardContent className="p-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">User</label>
                                    <p className="text-sm text-gray-900">{auditLog.user_name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Document ID</label>
                                    <p className="text-sm text-gray-900">{auditLog.document_id}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Document Type</label>
                                    <p className="text-sm text-gray-900">{auditLog.document_type}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Timestamp</label>
                                    <p className="text-sm text-gray-900">
                                        {format(new Date(auditLog.created_at), 'MMM d, yyyy, h:mm a')}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-sm font-medium text-gray-500">Status</label>
                                    <div className="mt-1">
                                        <Badge className={`${getStatusColor(auditLog.status)} border`}>
                                            {auditLog.status.charAt(0).toUpperCase() + auditLog.status.slice(1)}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Manager Comments Section - Only for Approved Status */}
                    {auditLog.status === 'approved' && (
                        <Card className="bg-gray-50 border-0">
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4 text-gray-600" />
                                        <h3 className="text-sm font-medium text-gray-900">Manager Comments - Marcus Daniel</h3>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border">
                                        <p className="text-sm text-gray-700">
                                            "The tax certificate has been reviewed and is approved for compliance. Please proceed with the necessary actions."
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Attachment Section - Only for Approved Status */}
                    {auditLog.status === 'approved' && (
                        <Card className="bg-gray-50 border-0">
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium text-gray-900">Attachment uploaded by manager</h3>
                                    <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                                <img src="/material-symbols-download0.svg" alt="pdf" className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">proof-of-evidence.pdf</p>
                                                <p className="text-xs text-gray-500">PDF Document</p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                                            onClick={() => {
                                                // Implement download functionality
                                                toast.success('Download started');
                                            }}
                                        >
                                            <Download className="w-4 h-4" />
                                            Download
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Action Buttons - Pixel Perfect Match */}
                    <div className="flex items-center justify-between pt-4 border-t">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            Cancel
                        </Button>
                        <div className="flex items-center gap-3">
                            {/* Only show Approve button if not already approved */}
                            {auditLog.status !== 'approved' && (
                                <Button
                                    onClick={handleApprove}
                                    disabled={isProcessing}
                                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                                >
                                    <img src="/lets-icons-check-fill0.svg" alt="approve" className="w-4 h-4" />
                                    Approve
                                </Button>
                            )}
                            <Button
                                onClick={handleReject}
                                disabled={isProcessing || auditLog.status === 'rejected'}
                                variant="destructive"
                                className="flex items-center gap-2"
                            >
                                <img src="/material-symbols-cancel0.svg" alt="reject" className="w-4 h-4" />
                                Reject
                            </Button>
                            <Button
                                onClick={handleEdit}
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <Edit className="w-4 h-4" />
                                Edit
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ComplianceDetailModal;
