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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Download,
    Eye,
    FileText,
    CheckCircle,
    Clock,
    XCircle,
    AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
    useComplianceStats,
    useComplianceAuditLogs,
    useCreateAuditLog,
    useGenerateComplianceReport,
    useExportAuditLogs,
    useViewAuditLog,
    type ComplianceAuditLog,
    type AuditFilters
} from '@/hooks/procurement/useComplianceAudit';
import ComplianceDetailModal from './ComplianceDetailModal';

const ComplianceAuditReportPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLogs, setSelectedLogs] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<AuditFilters>({});
    const [showFilters, setShowFilters] = useState(false);
    const [selectedAuditLog, setSelectedAuditLog] = useState<ComplianceAuditLog | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // Backend data hooks
    const { data: stats, isLoading: statsLoading, error: statsError } = useComplianceStats();
    const { data: logsData, isLoading: logsLoading, error: logsError } = useComplianceAuditLogs(
        currentPage,
        8,
        searchTerm,
        filters
    );
    const createAuditLog = useCreateAuditLog();
    const generateReport = useGenerateComplianceReport();
    const exportLogs = useExportAuditLogs();
    const viewLog = useViewAuditLog();

    const logs = logsData?.data || [];
    const totalLogs = logsData?.total || 0;
    const totalPages = Math.ceil(totalLogs / 8);

    const handleSelectLog = (logId: string, checked: boolean) => {
        if (checked) {
            setSelectedLogs(prev => [...prev, logId]);
        } else {
            setSelectedLogs(prev => prev.filter(id => id !== logId));
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedLogs(logs.map(log => log.id));
        } else {
            setSelectedLogs([]);
        }
    };

    const handleViewLog = async (logId: string) => {
        try {
            const logData = await viewLog.mutateAsync(logId);
            setSelectedAuditLog(logData);
            setIsDetailModalOpen(true);
        } catch (error) {
            toast.error('Failed to view audit log');
        }
    };

    const handleCloseModal = () => {
        setIsDetailModalOpen(false);
        setSelectedAuditLog(null);
    };

    const handleExportLogs = async () => {
        try {
            await exportLogs.mutateAsync(filters);
            toast.success('Audit logs exported successfully');
        } catch (error) {
            toast.error('Failed to export audit logs');
        }
    };

    const handleGenerateReport = async (reportType: string) => {
        try {
            await generateReport.mutateAsync({
                report_type: reportType as 'compliance_summary' | 'audit_trail' | 'violation_report' | 'approval_workflow',
                title: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
                description: `Generated compliance report for ${reportType}`,
                parameters: { dateRange: 'last_30_days' }
            });
            toast.success('Compliance report generated successfully');
        } catch (error) {
            toast.error('Failed to generate compliance report');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'completed':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'failed':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getActionIcon = (action: string) => {
        switch (action) {
            case 'approve':
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'reject':
                return <XCircle className="w-4 h-4 text-red-600" />;
            case 'pending':
                return <Clock className="w-4 h-4 text-yellow-600" />;
            default:
                return <FileText className="w-4 h-4 text-gray-600" />;
        }
    };

    if (statsLoading || logsLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading compliance & audit reports...</p>
                </div>
            </div>
        );
    }

    if (statsError || logsError) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="text-destructive">
                            {(statsError as any)?.message || (logsError as any)?.message || 'Failed to load compliance & audit reports'}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="bg-[#f5f7fa] min-h-screen">
            {/* Main Content */}
            <div className="p-8 space-y-8">
                {/* Summary Cards - Pixel Perfect Match */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    {/* Total Actions Card */}
                    <Card className="bg-white border-0 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                    <FileText className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total actions logged</h3>
                                <p className="text-3xl font-bold text-gray-900">{stats?.totalActions || 0}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Approvals Card */}
                    <Card className="bg-white border-0 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                    <img src="/nrk-check-active0.svg" alt="approvals" className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Approvals</h3>
                                <p className="text-3xl font-bold text-gray-900">{stats?.approvals || 0}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pending Actions Card */}
                    <Card className="bg-white border-0 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                                    <img src="/material-symbols-light-pending0.svg" alt="pending" className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending actions</h3>
                                <p className="text-3xl font-bold text-gray-900">{stats?.pendingActions || 0}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Rejections Card */}
                    <Card className="bg-white border-0 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                                    <img src="/material-symbols-cancel0.svg" alt="rejections" className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Rejections</h3>
                                <p className="text-3xl font-bold text-gray-900">{stats?.rejections || 0}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Compliance & Audit Trial Report Section - Pixel Perfect Match */}
                <Card className="bg-white border-0 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Compliance & audit trial report</h2>
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleExportLogs}
                                    className="flex items-center gap-2"
                                    disabled={exportLogs.isPending}
                                >
                                    <img src="/uil-export0.svg" alt="export" className="w-4 h-4" />
                                    Export
                                </Button>
                                <div className="relative">
                                    <Input
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-64 pr-10"
                                    />
                                    <img
                                        src="/search0.svg"
                                        alt="search"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Filters */}
                        {showFilters && (
                            <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                                <Select
                                    value={filters.user_id || ''}
                                    onValueChange={(value) => setFilters(prev => ({ ...prev, user_id: value || undefined }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="User" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="user1">Marcus lee</SelectItem>
                                        <SelectItem value="user2">Sarah Johnson</SelectItem>
                                        <SelectItem value="user3">Mike Wilson</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={filters.document_type || ''}
                                    onValueChange={(value) => setFilters(prev => ({ ...prev, document_type: value || undefined }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Document Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Purchase order">Purchase order</SelectItem>
                                        <SelectItem value="Invoice">Invoice</SelectItem>
                                        <SelectItem value="Contract">Contract</SelectItem>
                                        <SelectItem value="GRN">GRN</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={filters.action || ''}
                                    onValueChange={(value) => setFilters(prev => ({ ...prev, action: value || undefined }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Action" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="approve">Approve</SelectItem>
                                        <SelectItem value="reject">Reject</SelectItem>
                                        <SelectItem value="view">View</SelectItem>
                                        <SelectItem value="download">Download</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={filters.status || ''}
                                    onValueChange={(value) => setFilters(prev => ({ ...prev, status: value || undefined }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="approved">Approved</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">
                                            <Checkbox
                                                checked={selectedLogs.length === logs.length && logs.length > 0}
                                                onCheckedChange={handleSelectAll}
                                            />
                                        </TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead>Document ID</TableHead>
                                        <TableHead>Document type</TableHead>
                                        <TableHead>Timestamp</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {logs.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedLogs.includes(log.id)}
                                                    onCheckedChange={(checked) =>
                                                        handleSelectLog(log.id, checked as boolean)
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{log.user_name}</TableCell>
                                            <TableCell>{log.document_id}</TableCell>
                                            <TableCell>{log.document_type}</TableCell>
                                            <TableCell>
                                                <div className="text-sm text-gray-600">
                                                    {format(new Date(log.created_at), 'MMM d, yyyy, h:mm a')}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`${getStatusColor(log.status)} border`}>
                                                    {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleViewLog(log.id)}
                                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2"
                                                        disabled={viewLog.isPending}
                                                        title="View audit log"
                                                    >
                                                        <img src="/eye0.svg" alt="view" className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination - Pixel Perfect Match */}
                        <div className="flex items-center justify-between mt-6">
                            <p className="text-sm text-gray-600">
                                Showing {((currentPage - 1) * 8) + 1} to {Math.min(currentPage * 8, totalLogs)} of {totalLogs} compliance & audit trial report lists
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="flex items-center gap-2"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="flex items-center gap-2"
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Detail View Modal */}
                <ComplianceDetailModal
                    isOpen={isDetailModalOpen}
                    onClose={handleCloseModal}
                    auditLog={selectedAuditLog}
                />
            </div>
        </div>
    );
};

export default ComplianceAuditReportPage;
