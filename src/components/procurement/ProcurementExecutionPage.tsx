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
    Upload,
    Plus,
    Award,
    Clock,
    AlertCircle,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'sonner';
// Removed tenders imports - tenders table doesn't exist
import { usePurchaseOrders, usePurchaseOrderStats } from '@/hooks/procurement/usePurchaseOrders';
import { useGRNStats, useGRNs, useCreateGRN, useUpdateGRN, useApproveGRN, useRejectGRN, useDeleteGRN, type GRN } from '@/hooks/procurement/useGoodsReceivedNotes';
import CreateGRNDialog from './CreateGRNDialog';
import InvoicesPaymentTrackersPage from './InvoicesPaymentTrackersPage';
import MobileApprovalsPage from './MobileApprovalsPage';
import ComplianceAuditTrialReportPage from './ComplianceAuditTrialReportPage';
import ProcurementDocumentArchivePage from './ProcurementDocumentArchivePage';

const ProcurementExecutionPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTenders, setSelectedTenders] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState('purchase-orders');
    const [isLoading, setIsLoading] = useState(false);
    const [grnSearchTerm, setGrnSearchTerm] = useState('');
    const [selectedGRNs, setSelectedGRNs] = useState<string[]>([]);
    const [showCreateGRN, setShowCreateGRN] = useState(false);

    // Backend data hooks
    const { data: purchaseOrdersData, isLoading: purchaseOrdersLoading, error: purchaseOrdersError } = usePurchaseOrders(1, 10, searchTerm);
    const { data: poStats, isLoading: poStatsLoading, error: poStatsError } = usePurchaseOrderStats();

    // GRN hooks
    const { data: grnStats, isLoading: grnStatsLoading, error: grnStatsError } = useGRNStats();
    const { data: grnsData, isLoading: grnsLoading, error: grnsError } = useGRNs(1, 10, grnSearchTerm);
    const createGRN = useCreateGRN();
    const updateGRN = useUpdateGRN();
    const approveGRN = useApproveGRN();
    const rejectGRN = useRejectGRN();
    const deleteGRN = useDeleteGRN();

    // Removed tenders reference
    const purchaseOrders = purchaseOrdersData?.data || [];
    const grns = grnsData?.data || [];

    const handleSelectTender = (tenderId: string, checked: boolean) => {
        if (checked) {
            setSelectedTenders(prev => [...prev, tenderId]);
        } else {
            setSelectedTenders(prev => prev.filter(id => id !== tenderId));
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedTenders([]);
        } else {
            setSelectedTenders([]);
        }
    };

    const handleUploadBid = () => {
        // TODO: Implement upload bid functionality
        toast.info('Upload bid functionality coming soon');
    };

    const handleAddTender = () => {
        // TODO: Navigate to add tender page
        toast.info('Add tender functionality coming soon');
    };

    // GRN handlers
    const handleSelectGRN = (grnId: string, checked: boolean) => {
        if (checked) {
            setSelectedGRNs(prev => [...prev, grnId]);
        } else {
            setSelectedGRNs(prev => prev.filter(id => id !== grnId));
        }
    };

    const handleSelectAllGRNs = (checked: boolean) => {
        if (checked) {
            setSelectedGRNs(grns.map((grn, index) => grn.id || `grn-${index}`));
        } else {
            setSelectedGRNs([]);
        }
    };

    const handleCreateGRN = async (grnData: any) => {
        try {
            await createGRN.mutateAsync(grnData);
            setShowCreateGRN(false);
        } catch (error) {
            console.error('Error creating GRN:', error);
        }
    };

    const handleApproveGRN = async (grnId: string) => {
        try {
            await approveGRN.mutateAsync(grnId);
        } catch (error) {
            console.error('Error approving GRN:', error);
        }
    };

    const handleRejectGRN = async (grnId: string, reason: string) => {
        try {
            await rejectGRN.mutateAsync({ id: grnId, reason });
        } catch (error) {
            console.error('Error rejecting GRN:', error);
        }
    };

    const handleDeleteGRN = async (grnId: string) => {
        try {
            await deleteGRN.mutateAsync(grnId);
        } catch (error) {
            console.error('Error deleting GRN:', error);
        }
    };

    const handleExportGRNs = () => {
        // TODO: Implement GRN export functionality
        toast.info('Export GRNs functionality coming soon');
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'bg-green-100 text-green-800';
        if (score >= 60) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    const getComplianceStatus = (status: string) => {
        switch (status) {
            case 'compliant':
                return { color: 'bg-green-100 text-green-800', text: 'Compliant' };
            case 'pending':
                return { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' };
            case 'non-compliant':
                return { color: 'bg-red-100 text-red-800', text: 'Non-compliant' };
            default:
                return { color: 'bg-gray-100 text-gray-800', text: 'Unknown' };
        }
    };

    const getGRNStatus = (status: string) => {
        switch (status) {
            case 'approved':
                return { color: 'bg-green-100 text-green-800', text: 'Approved' };
            case 'pending':
                return { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' };
            case 'partial':
                return { color: 'bg-orange-100 text-orange-800', text: 'Partial' };
            case 'completed':
                return { color: 'bg-blue-100 text-blue-800', text: 'Completed' };
            case 'rejected':
                return { color: 'bg-red-100 text-red-800', text: 'Rejected' };
            default:
                return { color: 'bg-gray-100 text-gray-800', text: 'Unknown' };
        }
    };

    const getDeliveryStatus = (status: string) => {
        switch (status) {
            case 'completed':
                return { color: 'bg-green-100 text-green-800', text: 'Completed' };
            case 'partial':
                return { color: 'bg-yellow-100 text-yellow-800', text: 'Partial' };
            case 'pending':
                return { color: 'bg-blue-100 text-blue-800', text: 'Pending' };
            case 'overdue':
                return { color: 'bg-red-100 text-red-800', text: 'Overdue' };
            default:
                return { color: 'bg-gray-100 text-gray-800', text: 'Unknown' };
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f7fa]">
            <div className="p-8">
                {/* Tabs */}
                <div className="flex gap-1 bg-white rounded-lg p-1 mb-8 w-fit">
                    {[
                        { id: 'purchase-orders', label: 'Purchase orders' },
                        { id: 'goods-received', label: 'Goods received notes' },
                        { id: 'invoices', label: 'Invoices & payment trackers' },
                        { id: 'mobile-approvals', label: 'Mobile approvals' },
                        { id: 'document-archive', label: 'Document archive' },
                        { id: 'compliance-audit-trial', label: 'Compliance & audit trial report' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab.id
                                ? 'bg-[#7c3aed] text-white'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {activeTab === 'goods-received' ? (
                        <>
                            <Card className="bg-white border-0 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
                                            <span className="text-3xl font-bold text-yellow-600">{grnStats?.pendingGRNs || 0}</span>
                                        </div>
                                        <div className="text-sm text-gray-600">Pending GRNs</div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white border-0 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                                            <span className="text-3xl font-bold text-blue-600">{grnStats?.partialDeliveries || 0}</span>
                                        </div>
                                        <div className="text-sm text-gray-600">Partial deliveries</div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white border-0 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                                            <span className="text-3xl font-bold text-green-600">{grnStats?.completedDeliveries || 0}</span>
                                        </div>
                                        <div className="text-sm text-gray-600">Completed deliveries</div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white border-0 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-3">
                                            <span className="text-3xl font-bold text-red-600">{grnStats?.overdueDeliveries || 0}</span>
                                        </div>
                                        <div className="text-sm text-gray-600">Overdue deliveries</div>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    ) : (
                        <>
                            <Card className="bg-white border-0 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                                            <span className="text-3xl font-bold text-purple-600">{poStats?.activePOs || 0}</span>
                                        </div>
                                        <div className="text-sm text-gray-600">Active POs</div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white border-0 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
                                            <span className="text-3xl font-bold text-yellow-600">{poStats?.draftPOs || 0}</span>
                                        </div>
                                        <div className="text-sm text-gray-600">Draft POs</div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white border-0 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                                            <span className="text-3xl font-bold text-green-600">{poStats?.sentPOs || 0}</span>
                                        </div>
                                        <div className="text-sm text-gray-600">Sent POs</div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white border-0 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                                            <span className="text-3xl font-bold text-blue-600">
                                                ${poStats?.totalValue ? (poStats.totalValue / 1000000).toFixed(1) + 'M' : '0M'}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600">Total value of POs</div>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>

                {/* Purchase Orders Section */}
                {activeTab === 'purchase-orders' && (
                    <Card className="bg-white border-0 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">POs list</h3>
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search...."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                        <img src="/search0.svg" alt="search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="flex items-center gap-2"
                                    >
                                        <img src="/uil-export0.svg" alt="export" className="w-4 h-4" />
                                        Export POs
                                    </Button>
                                    <Button
                                        className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white flex items-center gap-2"
                                    >
                                        <img src="/material-symbols-add-rounded0.svg" alt="add" className="w-4 h-4" />
                                        + Add new PO
                                    </Button>
                                </div>
                            </div>

                            {/* Purchase Orders Table */}
                            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50">
                                            <TableHead className="font-semibold text-gray-900">PO#</TableHead>
                                            <TableHead className="font-semibold text-gray-900">Vendor</TableHead>
                                            <TableHead className="font-semibold text-gray-900">Amount</TableHead>
                                            <TableHead className="font-semibold text-gray-900">Created</TableHead>
                                            <TableHead className="font-semibold text-gray-900">Status</TableHead>
                                            <TableHead className="font-semibold text-gray-900">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {purchaseOrdersLoading ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="py-8 text-center text-gray-500">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Loading purchase orders...
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : purchaseOrders.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="py-8 text-center text-gray-500">
                                                    No purchase orders found
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            purchaseOrders.map((po, index) => (
                                                <TableRow key={po.id} className="hover:bg-gray-50">
                                                    <TableCell className="font-medium text-gray-900">{po.po_number}</TableCell>
                                                    <TableCell className="text-gray-700">{(po as any).vendor?.full_name || 'Unknown'}</TableCell>
                                                    <TableCell className="font-medium text-gray-900">
                                                        {new Intl.NumberFormat('en-US', {
                                                            style: 'currency',
                                                            currency: po.currency
                                                        }).format(po.total_amount)}
                                                    </TableCell>
                                                    <TableCell className="text-gray-700">
                                                        {new Date(po.po_date).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${po.status === 'sent' ? 'bg-green-100 text-green-800' :
                                                            po.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                                                po.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                                    'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {po.status.charAt(0).toUpperCase() + po.status.slice(1).replace('_', ' ')}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex items-center gap-1"
                                                            onClick={() => navigate(`/dashboard/procurement/purchase-orders/${po.id}`)}
                                                        >
                                                            <img src={`/eye${index % 9}.svg`} alt="view" className="w-4 h-4" />
                                                            View
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                                <div className="text-sm text-gray-700">
                                    Showing 1 to {purchaseOrders.length} of {purchaseOrdersData?.total || 0} purchase orders
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" disabled>
                                        Previous
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Goods Received Notes Section */}
                {activeTab === 'goods-received' && (
                    <Card className="bg-white border-0 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">GRNs list</h3>
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            value={grnSearchTerm}
                                            onChange={(e) => setGrnSearchTerm(e.target.value)}
                                            className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                        <img src="/search0.svg" alt="search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={handleExportGRNs}
                                        className="flex items-center gap-2"
                                    >
                                        <img src="/uil-export0.svg" alt="export" className="w-4 h-4" />
                                        Export GRNs
                                    </Button>
                                    <Button
                                        onClick={() => setShowCreateGRN(true)}
                                        className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white flex items-center gap-2"
                                    >
                                        <img src="/material-symbols-add-rounded0.svg" alt="add" className="w-4 h-4" />
                                        + Add New GRNs
                                    </Button>
                                </div>
                            </div>

                            {/* GRN Table */}
                            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50">
                                            <TableHead className="font-semibold text-gray-900">GRN#</TableHead>
                                            <TableHead className="font-semibold text-gray-900">PO#</TableHead>
                                            <TableHead className="font-semibold text-gray-900">Vendor</TableHead>
                                            <TableHead className="font-semibold text-gray-900">Item</TableHead>
                                            <TableHead className="font-semibold text-gray-900">Delivery date</TableHead>
                                            <TableHead className="font-semibold text-gray-900">Qty received / Qty ordered</TableHead>
                                            <TableHead className="font-semibold text-gray-900">Status</TableHead>
                                            <TableHead className="font-semibold text-gray-900">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {grnsLoading ? (
                                            <TableRow>
                                                <TableCell colSpan={8} className="py-8 text-center text-gray-500">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Loading GRNs...
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : grns.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={8} className="py-8 text-center text-gray-500">
                                                    No GRNs found
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            grns.map((grn, index) => (
                                                <TableRow key={grn.id} className="hover:bg-gray-50">
                                                    <TableCell className="font-medium text-gray-900">{grn.grn_number}</TableCell>
                                                    <TableCell className="text-gray-700">{grn.po_number}</TableCell>
                                                    <TableCell className="text-gray-700">{grn.vendor_name}</TableCell>
                                                    <TableCell className="text-gray-700">{grn.item_name}</TableCell>
                                                    <TableCell className="text-gray-700">
                                                        {new Date(grn.delivery_date).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </TableCell>
                                                    <TableCell className="text-gray-700">
                                                        {grn.quantity_received} / {grn.quantity_ordered}
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGRNStatus(grn.status).color}`}>
                                                            {getGRNStatus(grn.status).text}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex items-center gap-1"
                                                            onClick={() => navigate(`/dashboard/procurement/grns/${grn.id}`)}
                                                        >
                                                            <img src="/eye0.svg" alt="view" className="w-4 h-4" />
                                                            View
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {grnsData && grnsData.totalPages > 1 && (
                                <div className="flex items-center justify-between mt-6">
                                    <div className="text-sm text-gray-700">
                                        Showing 1 to {grnsData.limit} of {grnsData.total} GRNs lists.
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={grnsData.page === 1}
                                            className="flex items-center gap-1"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={grnsData.page === grnsData.totalPages}
                                            className="flex items-center gap-1"
                                        >
                                            Next
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Invoices tab content */}
                {activeTab === 'invoices' && (
                    <InvoicesPaymentTrackersPage />
                )}

                {/* Mobile Approvals tab content */}
                {activeTab === 'mobile-approvals' && (
                    <MobileApprovalsPage />
                )}

                {/* Document Archive tab content */}
                {activeTab === 'document-archive' && (
                    <ProcurementDocumentArchivePage />
                )}

                {/* Compliance & Audit Trial Report tab content */}
                {activeTab === 'compliance-audit-trial' && (
                    <ComplianceAuditTrialReportPage />
                )}

                {/* Create GRN Dialog */}
                <CreateGRNDialog
                    open={showCreateGRN}
                    onOpenChange={setShowCreateGRN}
                    onSubmit={handleCreateGRN}
                />
            </div>
        </div>
    );
};

export default ProcurementExecutionPage;