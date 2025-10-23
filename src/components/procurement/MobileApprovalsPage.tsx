import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
    useMobileApprovalStats,
    useMobileApprovals,
    useApproveMobileApproval,
    useRejectMobileApproval,
    useDisputeMobileApproval,
    useDeleteMobileApproval,
    type MobileApproval,
    type MobileApprovalFilters
} from '@/hooks/procurement/useMobileApprovals';

const MobileApprovalsPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedApprovals, setSelectedApprovals] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<MobileApprovalFilters>({});
    const [showFilters, setShowFilters] = useState(false);

    // Backend data hooks
    const { data: stats, isLoading: statsLoading, error: statsError } = useMobileApprovalStats();
    const { data: approvalsData, isLoading: approvalsLoading, error: approvalsError } = useMobileApprovals(
        currentPage,
        8,
        searchTerm,
        filters
    );
    const approveApproval = useApproveMobileApproval();
    const rejectApproval = useRejectMobileApproval();
    const disputeApproval = useDisputeMobileApproval();
    const deleteApproval = useDeleteMobileApproval();

    const approvals = approvalsData?.data || [];
    const totalApprovals = approvalsData?.total || 0;
    const totalPages = Math.ceil(totalApprovals / 8);

    const handleSelectApproval = (approvalId: string, checked: boolean) => {
        if (checked) {
            setSelectedApprovals(prev => [...prev, approvalId]);
        } else {
            setSelectedApprovals(prev => prev.filter(id => id !== approvalId));
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedApprovals(approvals.map(approval => approval.id));
        } else {
            setSelectedApprovals([]);
        }
    };

    const handleApproveApproval = async (approvalId: string) => {
        try {
            await approveApproval.mutateAsync(approvalId);
            toast.success('Approval approved successfully');
        } catch (error) {
            toast.error('Failed to approve');
        }
    };

    const handleRejectApproval = async (approvalId: string) => {
        const reason = window.prompt('Please provide a reason for rejection:');
        if (reason) {
            try {
                await rejectApproval.mutateAsync({ id: approvalId, reason });
                toast.success('Approval rejected successfully');
            } catch (error) {
                toast.error('Failed to reject');
            }
        }
    };

    const handleDisputeApproval = async (approvalId: string) => {
        const reason = window.prompt('Please provide a reason for dispute:');
        if (reason) {
            try {
                await disputeApproval.mutateAsync({ id: approvalId, reason });
                toast.success('Approval disputed successfully');
            } catch (error) {
                toast.error('Failed to dispute');
            }
        }
    };

    const handleDeleteApproval = async (approvalId: string) => {
        if (window.confirm('Are you sure you want to delete this approval?')) {
            try {
                await deleteApproval.mutateAsync(approvalId);
                toast.success('Approval deleted successfully');
            } catch (error) {
                toast.error('Failed to delete');
            }
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'disputed':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'high':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatCurrency = (amount: number, currency: string = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    };

    if (statsLoading || approvalsLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading mobile approvals...</p>
                </div>
            </div>
        );
    }

    if (statsError || approvalsError) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="text-destructive">
                            {(statsError as any)?.message || (approvalsError as any)?.message || 'Failed to load mobile approvals'}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-6 mb-8">
                <Card className="bg-white border-0 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <img src="/material-symbols-light-pending0.svg" alt="pending" className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Pending approval</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats?.pendingApprovals || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <img src="/mdi-receipt-text-pending0.svg" alt="po pending" className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">POs pending</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats?.poPending || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <img src="/material-symbols-pending-actions-sharp0.svg" alt="payment pending" className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Payment pending</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats?.paymentPending || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                <img src="/tabler-urgent0.svg" alt="urgent" className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Urgent approval</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats?.urgentApprovals || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Mobile Approval List */}
            <Card className="bg-white border-0 shadow-sm">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Mobile approval list</h2>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Input
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-64 pr-10"
                                />
                                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">
                                        <Checkbox
                                            checked={selectedApprovals.length === approvals.length && approvals.length > 0}
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Vendor</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {approvals.map((approval) => (
                                    <TableRow key={approval.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedApprovals.includes(approval.id)}
                                                onCheckedChange={(checked) =>
                                                    handleSelectApproval(approval.id, checked as boolean)
                                                }
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{approval.type}</TableCell>
                                        <TableCell>{approval.display_id}</TableCell>
                                        <TableCell>{approval.vendor_name || '-'}</TableCell>
                                        <TableCell>{formatCurrency(approval.amount, approval.currency)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Badge className={`${getStatusColor(approval.status)} border`}>
                                                    {approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}
                                                </Badge>
                                                {approval.priority === 'high' && (
                                                    <Badge className={`${getPriorityColor(approval.priority)} border text-xs`}>
                                                        High Priority
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {approval.status === 'pending' && (
                                                    <>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleApproveApproval(approval.id)}
                                                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                        >
                                                            <img src="/lets-icons-check-fill0.svg" alt="approve" className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleRejectApproval(approval.id)}
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            <img src="/material-symbols-cancel0.svg" alt="reject" className="w-4 h-4" />
                                                        </Button>
                                                    </>
                                                )}
                                                {approval.status === 'approved' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDisputeApproval(approval.id)}
                                                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                                    >
                                                        Dispute
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteApproval(approval.id)}
                                                    className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-6">
                        <p className="text-sm text-gray-600">
                            Showing {((currentPage - 1) * 8) + 1} to {Math.min(currentPage * 8, totalApprovals)} of {totalApprovals} mobile approval lists
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default MobileApprovalsPage;
