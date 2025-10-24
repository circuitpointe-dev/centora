import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
    useComplianceAuditTrialStats,
    useComplianceAuditTrials,
    useExportComplianceAuditTrials
} from '@/hooks/procurement/useComplianceAuditTrial';

const ComplianceAuditTrialReportPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDocumentType, setSelectedDocumentType] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTrials, setSelectedTrials] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);

    const pageSize = 8;

    // Data fetching
    const { data: stats, isLoading: statsLoading, error: statsError } = useComplianceAuditTrialStats();
    const {
        data: trialsData,
        isLoading: trialsLoading,
        error: trialsError
    } = useComplianceAuditTrials(
        currentPage,
        pageSize,
        searchTerm || undefined,
        selectedDocumentType || undefined,
        selectedStatus || undefined,
        dateFrom || undefined,
        dateTo || undefined
    );

    const exportMutation = useExportComplianceAuditTrials();

    const isLoading = statsLoading || trialsLoading;
    const error = statsError || trialsError;

    // Handle checkbox selection
    const handleSelectAll = (checked: boolean) => {
        if (checked && trialsData?.data) {
            setSelectedTrials(trialsData.data.map(trial => trial.id));
        } else {
            setSelectedTrials([]);
        }
    };

    const handleSelectTrial = (trialId: string, checked: boolean) => {
        if (checked) {
            setSelectedTrials(prev => [...prev, trialId]);
        } else {
            setSelectedTrials(prev => prev.filter(id => id !== trialId));
        }
    };

    // Handle export
    const handleExport = () => {
        exportMutation.mutate({
            document_type: selectedDocumentType || undefined,
            status: selectedStatus || undefined,
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
        });
    };

    // Handle search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
    };

    // Handle pagination
    const totalPages = trialsData ? Math.ceil(trialsData.total / pageSize) : 0;
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, trialsData?.total || 0);

    // Get status badge variant
    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'approved':
                return 'default';
            case 'pending':
                return 'secondary';
            case 'rejected':
                return 'destructive';
            case 'disputed':
                return 'outline';
            default:
                return 'secondary';
        }
    };

    // Get status badge color
    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'disputed':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading compliance audit trial data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="text-red-500 mb-4">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <p className="text-red-600 mb-2">Error loading compliance audit trial data</p>
                    <p className="text-gray-600 text-sm">Please try refreshing the page</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-6 mb-8">
                <Card className="bg-white border-0 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-blue-100 rounded-full p-3">
                                <img src="/group0.svg" alt="Total Actions" className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-semibold text-gray-900 mb-1">
                                {stats?.total_actions.toLocaleString() || '0'}
                            </div>
                            <div className="text-sm text-gray-600">Total actions logged</div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-purple-100 rounded-full p-3">
                                <img src="/nrk-check-active0.svg" alt="Approvals" className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-semibold text-gray-900 mb-1">
                                {stats?.approvals.toLocaleString() || '0'}
                            </div>
                            <div className="text-sm text-gray-600">Approvals</div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-yellow-100 rounded-full p-3">
                                <img src="/material-symbols-light-pending0.svg" alt="Pending" className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-semibold text-gray-900 mb-1">
                                {stats?.pending_actions.toLocaleString() || '0'}
                            </div>
                            <div className="text-sm text-gray-600">Pending actions</div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-red-100 rounded-full p-3">
                                <img src="/material-symbols-cancel0.svg" alt="Rejections" className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-semibold text-gray-900 mb-1">
                                {stats?.rejections.toLocaleString() || '0'}
                            </div>
                            <div className="text-sm text-gray-600">Rejections</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Compliance & Audit Trial Report Section */}
            <Card className="bg-white border-0 shadow-sm">
                <CardContent className="p-6">
                    {/* Header with Search and Export */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-8">
                            <h2 className="text-lg font-medium text-gray-900">Compliance & audit trial report</h2>
                            <form onSubmit={handleSearch} className="flex items-center gap-2">
                                <div className="relative">
                                    <Input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                    <img
                                        src="/search1.svg"
                                        alt="Search"
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="px-4 py-2"
                                >
                                    Filters
                                </Button>
                            </form>
                        </div>
                        <Button
                            onClick={handleExport}
                            disabled={exportMutation.isPending}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            <img src="/uil-export0.svg" alt="Export" className="w-4 h-4" />
                            Export
                        </Button>
                    </div>

                    {/* Filters */}
                    {showFilters && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <div className="grid grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                                    <select
                                        value={selectedDocumentType}
                                        onChange={(e) => setSelectedDocumentType(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                        <option value="">All Types</option>
                                        <option value="purchase_order">Purchase Order</option>
                                        <option value="requisition">Requisition</option>
                                        <option value="invoice">Invoice</option>
                                        <option value="grn">GRN</option>
                                        <option value="payment">Payment</option>
                                        <option value="approval">Approval</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="approved">Approved</option>
                                        <option value="pending">Pending</option>
                                        <option value="rejected">Rejected</option>
                                        <option value="disputed">Disputed</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
                                    <Input
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
                                    <Input
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Table */}
                    <div className="bg-white rounded-lg border border-gray-200">
                        {/* Table Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    checked={selectedTrials.length === trialsData?.data.length && trialsData?.data.length > 0}
                                    onCheckedChange={handleSelectAll}
                                />
                                <span className="text-sm font-medium text-gray-900">User</span>
                            </div>
                            <div className="text-sm font-medium text-gray-900 w-24">Document ID</div>
                            <div className="text-sm font-medium text-gray-900 w-32">Document type</div>
                            <div className="text-sm font-medium text-gray-900 w-40">Timestamp</div>
                            <div className="text-sm font-medium text-gray-900 w-28">Status</div>
                            <div className="text-sm font-medium text-gray-900 w-20">Actions</div>
                        </div>

                        {/* Table Body */}
                        <div className="divide-y divide-gray-200">
                            {trialsData?.data.map((trial, index) => (
                                <div key={trial.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                                    <div className="flex items-center gap-2 w-32">
                                        <Checkbox
                                            checked={selectedTrials.includes(trial.id)}
                                            onCheckedChange={(checked) => handleSelectTrial(trial.id, checked as boolean)}
                                        />
                                        <span className="text-sm text-gray-600">{trial.user_name || 'Unknown'}</span>
                                    </div>
                                    <div className="text-sm text-gray-600 w-24">{trial.document_id}</div>
                                    <div className="text-sm text-gray-900 w-32 capitalize">
                                        {trial.document_type.replace('_', ' ')}
                                    </div>
                                    <div className="text-sm text-gray-900 w-40">
                                        {new Date(trial.timestamp).toLocaleString()}
                                    </div>
                                    <div className="w-28">
                                        <Badge
                                            variant={getStatusBadgeVariant(trial.status)}
                                            className={`${getStatusBadgeColor(trial.status)} text-xs px-2 py-1`}
                                        >
                                            {trial.status}
                                        </Badge>
                                    </div>
                                    <div className="w-20">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-1 px-3 py-1 text-xs"
                                        >
                                            <img src={`/eye${index % 8}.svg`} alt="View" className="w-4 h-4" />
                                            View
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-6">
                        <div className="text-sm text-gray-700">
                            Showing {startItem} to {endItem} of {trialsData?.total || 0} compliance & audit trial report lists
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2"
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ComplianceAuditTrialReportPage;
