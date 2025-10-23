import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
    Filter,
    Check,
    X,
    ArrowLeft,
    Eye,
    Download,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Clock,
    DollarSign,
    FileText,
    ShoppingCart,
    CreditCard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useApprovalStats, useApprovals, useApproveItem, useRejectItem, useBulkApprove, ApprovalFilters as FilterType } from '@/hooks/procurement/useProcurementApprovals';
import ApprovalActionDialog from './ApprovalActionDialog';
import ApprovalFilters from './ApprovalFilters';
import { useIsMobile } from '@/hooks/use-mobile';

const ProcurementApprovalsPage = () => {
    const navigate = useNavigate();
    const isMobile = useIsMobile();
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [filters, setFilters] = useState<FilterType>({});
    const [actionDialog, setActionDialog] = useState<{
        isOpen: boolean;
        action: 'approve' | 'reject';
        approval: any;
    }>({
        isOpen: false,
        action: 'approve',
        approval: null
    });

    // Backend data hooks
    const { data: stats, isLoading: statsLoading, error: statsError } = useApprovalStats();
    const { data: approvalsData, isLoading: approvalsLoading, error: approvalsError } = useApprovals(currentPage, 10, filters);
    const approveItem = useApproveItem();
    const rejectItem = useRejectItem();
    const bulkApprove = useBulkApprove();

    const approvals = approvalsData?.data || [];
    const totalPages = approvalsData?.totalPages || 1;

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

    // Filter approvals based on search term
    const filteredApprovals = useMemo(() => {
        if (!searchTerm) return approvals;

        return approvals.filter(approval =>
            approval.display_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            approval.requestor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            approval.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [approvals, searchTerm]);

    const handleApprove = (approval: any) => {
        setActionDialog({
            isOpen: true,
            action: 'approve',
            approval
        });
    };

    const handleReject = (approval: any) => {
        setActionDialog({
            isOpen: true,
            action: 'reject',
            approval
        });
    };

    const handleView = (id: string) => {
        console.log('Viewing:', id);
        // TODO: Implement view logic
    };

    const handleBulkApprove = () => {
        if (selectedItems.length === 0) return;
        bulkApprove.mutate({ ids: selectedItems });
        setSelectedItems([]);
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedItems(filteredApprovals.map(approval => approval.id));
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedItems(prev => [...prev, id]);
        } else {
            setSelectedItems(prev => prev.filter(item => item !== id));
        }
    };

    const handleActionConfirm = (comment: string) => {
        if (actionDialog.action === 'approve') {
            approveItem.mutate({ id: actionDialog.approval.id, comment });
        } else {
            rejectItem.mutate({ id: actionDialog.approval.id, reason: comment });
        }
        setActionDialog({ isOpen: false, action: 'approve', approval: null });
    };

    const handleFiltersChange = (newFilters: FilterType) => {
        setFilters(newFilters);
        setCurrentPage(1); // Reset to first page when filters change
    };

    const handleClearFilters = () => {
        setFilters({});
        setCurrentPage(1);
    };

    // Loading state
    if (statsLoading || approvalsLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading approvals...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (statsError || approvalsError) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <AlertCircle className="h-8 w-8 mx-auto mb-4 text-destructive" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Error Loading Approvals</h3>
                    <p className="text-muted-foreground">
                        {statsError?.message || approvalsError?.message || 'Failed to load approval data'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/dashboard/procurement/dashboard')}
                        className="gap-2 hover:bg-gray-100 w-fit"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Back to Dashboard</span>
                        <span className="sm:hidden">Back</span>
                    </Button>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                            <span className="hidden sm:inline">Dashboard / </span>Pending approvals
                        </h1>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <FileText className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{stats?.requisitions || 0}</div>
                                <div className="text-sm text-gray-600">Requisitions</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <ShoppingCart className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{stats?.purchase_orders || 0}</div>
                                <div className="text-sm text-gray-600">Purchase orders</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <CreditCard className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{stats?.payments || 0}</div>
                                <div className="text-sm text-gray-600">Payments</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* My approval lists */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold">My approval lists</CardTitle>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-64"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                >
                                    <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                                        <div className="bg-current rounded-sm"></div>
                                        <div className="bg-current rounded-sm"></div>
                                        <div className="bg-current rounded-sm"></div>
                                        <div className="bg-current rounded-sm"></div>
                                    </div>
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                >
                                    <div className="w-4 h-4 flex flex-col gap-0.5">
                                        <div className="w-full h-0.5 bg-current rounded"></div>
                                        <div className="w-full h-0.5 bg-current rounded"></div>
                                        <div className="w-full h-0.5 bg-current rounded"></div>
                                    </div>
                                </Button>
                            </div>
                            <ApprovalFilters
                                filters={filters}
                                onFiltersChange={handleFiltersChange}
                                onClearFilters={handleClearFilters}
                            />

                            <Button
                                className="gap-2 bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
                                onClick={handleBulkApprove}
                                disabled={selectedItems.length === 0 || bulkApprove.isPending}
                                size={isMobile ? "default" : "sm"}
                            >
                                {bulkApprove.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Check className="h-4 w-4" />
                                )}
                                Approve ({selectedItems.length})
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredApprovals.length === 0 ? (
                        <div className="text-center py-12">
                            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No approvals found</h3>
                            <p className="text-gray-600">
                                {searchTerm || Object.keys(filters).length > 0
                                    ? 'Try adjusting your search or filters'
                                    : 'No pending approvals at this time'
                                }
                            </p>
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">
                                            <Checkbox
                                                checked={selectedItems.length === filteredApprovals.length && filteredApprovals.length > 0}
                                                onCheckedChange={handleSelectAll}
                                            />
                                        </TableHead>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Requestor</TableHead>
                                        <TableHead>Date submitted</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Risk</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredApprovals.map((approval) => (
                                        <TableRow key={approval.id} className="hover:bg-gray-50">
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedItems.includes(approval.id)}
                                                    onCheckedChange={(checked) => handleSelectItem(approval.id, checked as boolean)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="link"
                                                    className="p-0 h-auto font-medium text-blue-600 hover:text-blue-800"
                                                    onClick={() => handleView(approval.id)}
                                                >
                                                    {approval.id}
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {getTypeIcon(approval.type)}
                                                    <Badge className={getTypeColor(approval.type)}>
                                                        {approval.type.replace('_', ' ').toUpperCase()}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">{approval.requestor_name}</TableCell>
                                            <TableCell>{format(new Date(approval.date_submitted), 'MMM dd, yyyy')}</TableCell>
                                            <TableCell className="font-medium">
                                                {approval.currency} {approval.amount.toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getRiskColor(approval.risk_level)}>
                                                    {approval.risk_level.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleView(approval.id)}
                                                        className="gap-1 hover:bg-blue-50"
                                                    >
                                                        <Eye className="h-3 w-3" />
                                                        View
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleApprove(approval)}
                                                        className="gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                        disabled={approveItem.isPending}
                                                    >
                                                        {approveItem.isPending ? (
                                                            <Loader2 className="h-3 w-3 animate-spin" />
                                                        ) : (
                                                            <Check className="h-3 w-3" />
                                                        )}
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleReject(approval)}
                                                        className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        disabled={rejectItem.isPending}
                                                    >
                                                        {rejectItem.isPending ? (
                                                            <Loader2 className="h-3 w-3 animate-spin" />
                                                        ) : (
                                                            <X className="h-3 w-3" />
                                                        )}
                                                        Reject
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Pagination */}
                            <div className="flex items-center justify-between mt-6">
                                <div className="text-sm text-gray-600">
                                    Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, approvalsData?.total || 0)} of {approvalsData?.total || 0} approval lists
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        {!isMobile && <span className="ml-1">Previous</span>}
                                    </Button>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: Math.min(isMobile ? 3 : 5, totalPages) }, (_, i) => {
                                            const page = i + 1;
                                            return (
                                                <Button
                                                    key={page}
                                                    variant={currentPage === page ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => setCurrentPage(page)}
                                                    className="w-8 h-8 p-0"
                                                >
                                                    {page}
                                                </Button>
                                            );
                                        })}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        {!isMobile && <span className="mr-1">Next</span>}
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Action Dialog */}
            <ApprovalActionDialog
                isOpen={actionDialog.isOpen}
                onClose={() => setActionDialog({ isOpen: false, action: 'approve', approval: null })}
                action={actionDialog.action}
                approval={actionDialog.approval}
                onConfirm={handleActionConfirm}
                isLoading={approveItem.isPending || rejectItem.isPending}
            />
        </div>
    );
};

export default ProcurementApprovalsPage;
