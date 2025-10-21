import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    ArrowLeft,
    Calendar,
    User,
    Building,
    DollarSign,
    AlertTriangle,
    FileText,
    Clock,
    CheckCircle2,
    XCircle,
    Download,
    Eye,
    Edit,
    ShoppingCart,
    CreditCard
} from 'lucide-react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const ApprovalDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isApproving, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);

    const { data: approval, isLoading, error } = useQuery({
        queryKey: ['procurement-approval', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('procurement_approvals')
                .select(`
                    *,
                    requestor:profiles!requestor_id(full_name, email),
                    approver:profiles!approved_by(full_name, email)
                `)
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: !!id
    });

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'requisition':
                return <FileText className="h-4 w-4" />;
            case 'purchase_order':
                return <ShoppingCart className="h-4 w-4" />;
            case 'payment':
                return <CreditCard className="h-4 w-4" />;
            default:
                return <FileText className="h-4 w-4" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'requisition':
                return 'bg-purple-100 text-purple-800';
            case 'purchase_order':
                return 'bg-yellow-100 text-yellow-800';
            case 'payment':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'high':
                return 'bg-red-100 text-red-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'low':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'low':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircle2 className="h-5 w-5 text-green-600" />;
            case 'rejected':
                return <XCircle className="h-5 w-5 text-red-600" />;
            case 'pending':
                return <Clock className="h-5 w-5 text-yellow-600" />;
            default:
                return <Clock className="h-5 w-5 text-gray-600" />;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading approval details...</p>
                </div>
            </div>
        );
    }

    if (error || !approval) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="text-destructive">{(error as any)?.message || 'Approval not found'}</div>
                            <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/dashboard/procurement/approvals')}
                        className="gap-2 hover:bg-gray-100"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Approvals
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Approval Details</h1>
                        <p className="text-sm text-gray-600">ID: {approval.id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {approval.status === 'pending' && (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsRejecting(true)}
                                className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                <XCircle className="h-4 w-4" />
                                Reject
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => setIsApproving(true)}
                                className="gap-1 bg-green-600 hover:bg-green-700 text-white"
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                Approve
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                {getTypeIcon(approval.type)}
                                Basic Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Type</label>
                                    <div className="mt-1">
                                        <Badge className={getTypeColor(approval.type)}>
                                            {approval.type.replace('_', ' ').toUpperCase()}
                                        </Badge>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Status</label>
                                    <div className="mt-1 flex items-center gap-2">
                                        {getStatusIcon(approval.status)}
                                        <span className="capitalize">{approval.status}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Priority</label>
                                    <div className="mt-1">
                                        <Badge className={getPriorityColor(approval.priority)}>
                                            {approval.priority.toUpperCase()}
                                        </Badge>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Risk Level</label>
                                    <div className="mt-1">
                                        <Badge className={getRiskColor(approval.risk_level)}>
                                            {approval.risk_level.toUpperCase()}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Financial Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Financial Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Amount</label>
                                    <div className="mt-1 text-2xl font-bold text-gray-900">
                                        {approval.currency} {approval.amount.toLocaleString()}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Currency</label>
                                    <div className="mt-1 text-lg font-medium text-gray-900">
                                        {approval.currency}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Description
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 whitespace-pre-wrap">{approval.description}</p>
                        </CardContent>
                    </Card>

                    {/* Attachments */}
                    {approval.attachments && approval.attachments.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Download className="h-5 w-5" />
                                    Attachments
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {approval.attachments.map((attachment, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm font-medium text-gray-700">{attachment}</span>
                                            <Button variant="outline" size="sm">
                                                <Download className="h-4 w-4 mr-2" />
                                                Download
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Requestor Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Requestor
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Name</label>
                                <div className="mt-1 text-sm font-medium text-gray-900">
                                    {approval.requestor?.full_name || approval.requestor_name}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Email</label>
                                <div className="mt-1 text-sm text-gray-600">
                                    {approval.requestor?.email || 'N/A'}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Department</label>
                                <div className="mt-1 text-sm text-gray-600">
                                    {approval.department || 'N/A'}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dates */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Important Dates
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Date Submitted</label>
                                <div className="mt-1 text-sm text-gray-900">
                                    {format(new Date(approval.date_submitted), 'MMM dd, yyyy')}
                                </div>
                            </div>
                            {approval.due_date && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Due Date</label>
                                    <div className="mt-1 text-sm text-gray-900">
                                        {format(new Date(approval.due_date), 'MMM dd, yyyy')}
                                    </div>
                                </div>
                            )}
                            {approval.approved_at && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Approved At</label>
                                    <div className="mt-1 text-sm text-gray-900">
                                        {format(new Date(approval.approved_at), 'MMM dd, yyyy HH:mm')}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Vendor Information */}
                    {approval.vendor_name && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building className="h-5 w-5" />
                                    Vendor
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm font-medium text-gray-900">
                                    {approval.vendor_name}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Approval History */}
                    {approval.status !== 'pending' && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5" />
                                    Approval History
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Approved By</label>
                                    <div className="mt-1 text-sm text-gray-900">
                                        {approval.approver?.full_name || 'System'}
                                    </div>
                                </div>
                                {approval.approval_comment && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Comment</label>
                                        <div className="mt-1 text-sm text-gray-700">
                                            {approval.approval_comment}
                                        </div>
                                    </div>
                                )}
                                {approval.rejection_reason && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Rejection Reason</label>
                                        <div className="mt-1 text-sm text-red-700">
                                            {approval.rejection_reason}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApprovalDetailPage;
