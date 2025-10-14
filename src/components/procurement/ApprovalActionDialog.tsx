import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Check, X, AlertTriangle, Info } from 'lucide-react';
import { format } from 'date-fns';

interface ApprovalActionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    action: 'approve' | 'reject';
    approval: {
        id: string;
        type: string;
        requestor_name: string;
        amount: number;
        currency: string;
        description: string;
        risk_level: string;
        date_submitted: string;
    } | null;
    onConfirm: (comment: string) => void;
    isLoading?: boolean;
}

const ApprovalActionDialog: React.FC<ApprovalActionDialogProps> = ({
    isOpen,
    onClose,
    action,
    approval,
    onConfirm,
    isLoading = false
}) => {
    const [comment, setComment] = useState('');

    if (!approval) return null;

    const isApprove = action === 'approve';
    const isReject = action === 'reject';

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'high':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'requisition':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'purchase_order':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'payment':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const handleSubmit = () => {
        onConfirm(comment);
        setComment('');
    };

    const handleClose = () => {
        setComment('');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {isApprove ? (
                            <Check className="h-5 w-5 text-green-600" />
                        ) : (
                            <X className="h-5 w-5 text-red-600" />
                        )}
                        {isApprove ? 'Approve Request' : 'Reject Request'}
                    </DialogTitle>
                    <DialogDescription>
                        {isApprove
                            ? 'Please review the details below and add any comments before approving this request.'
                            : 'Please provide a reason for rejecting this request. This will be shared with the requestor.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Request Details */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">Request ID</span>
                            <span className="text-sm font-mono bg-white px-2 py-1 rounded border">
                                {approval.id}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">Type</span>
                            <Badge className={getTypeColor(approval.type)}>
                                {approval.type.replace('_', ' ').toUpperCase()}
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">Requestor</span>
                            <span className="text-sm font-medium">{approval.requestor_name}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">Amount</span>
                            <span className="text-sm font-bold">
                                {approval.currency} {approval.amount.toLocaleString()}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">Risk Level</span>
                            <Badge className={getRiskColor(approval.risk_level)}>
                                {approval.risk_level.toUpperCase()}
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">Date Submitted</span>
                            <span className="text-sm">
                                {format(new Date(approval.date_submitted), 'MMM dd, yyyy')}
                            </span>
                        </div>

                        <div>
                            <span className="text-sm font-medium text-gray-600 block mb-1">Description</span>
                            <p className="text-sm text-gray-700 bg-white p-2 rounded border">
                                {approval.description}
                            </p>
                        </div>
                    </div>

                    {/* Comment Section */}
                    <div className="space-y-2">
                        <Label htmlFor="comment">
                            {isApprove ? 'Approval Comments (Optional)' : 'Rejection Reason *'}
                        </Label>
                        <Textarea
                            id="comment"
                            placeholder={
                                isApprove
                                    ? 'Add any comments about this approval...'
                                    : 'Please explain why this request is being rejected...'
                            }
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="min-h-[100px]"
                            required={isReject}
                        />
                        {isReject && !comment && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                                <AlertTriangle className="h-4 w-4" />
                                Rejection reason is required
                            </p>
                        )}
                    </div>

                    {/* Warning for high-risk approvals */}
                    {isApprove && approval.risk_level === 'high' && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm">
                                    <p className="font-medium text-yellow-800">High Risk Approval</p>
                                    <p className="text-yellow-700">
                                        This request has been flagged as high risk. Please ensure you have reviewed all details carefully.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Info for rejections */}
                    {isReject && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm">
                                    <p className="font-medium text-blue-800">Rejection Notice</p>
                                    <p className="text-blue-700">
                                        The requestor will be notified of this rejection and the reason provided.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading || (isReject && !comment.trim())}
                        className={isApprove ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                {isApprove ? 'Approving...' : 'Rejecting...'}
                            </div>
                        ) : (
                            <>
                                {isApprove ? (
                                    <>
                                        <Check className="h-4 w-4 mr-2" />
                                        Approve Request
                                    </>
                                ) : (
                                    <>
                                        <X className="h-4 w-4 mr-2" />
                                        Reject Request
                                    </>
                                )}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ApprovalActionDialog;
