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
    Archive,
    Trash2,
    Upload,
    Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
    useProcurementArchiveStats,
    useProcurementDocuments,
    useArchiveDocument,
    useRestoreDocument,
    useDeleteDocument,
    useUploadDocument,
    useGenerateReport,
    type ProcurementDocument,
    type DocumentFilters
} from '@/hooks/procurement/useProcurementReports';

const ProcurementReportsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<DocumentFilters>({});
    const [showFilters, setShowFilters] = useState(false);
    const [showUploadDialog, setShowUploadDialog] = useState(false);

    // Backend data hooks
    const { data: stats, isLoading: statsLoading, error: statsError } = useProcurementArchiveStats();
    const { data: documentsData, isLoading: documentsLoading, error: documentsError } = useProcurementDocuments(
        currentPage,
        10,
        searchTerm,
        filters
    );
    const generateReportMutation = useGenerateReport();
    const archiveDocument = useArchiveDocument();
    const restoreDocument = useRestoreDocument();
    const deleteDocument = useDeleteDocument();
    const uploadDocument = useUploadDocument();
    const generateReport = useGenerateReport();

    const documents = documentsData?.data || [];
    const totalDocuments = documentsData?.total || 0;
    const totalPages = Math.ceil(totalDocuments / 10);

    const handleSelectDocument = (documentId: string, checked: boolean) => {
        if (checked) {
            setSelectedDocuments(prev => [...prev, documentId]);
        } else {
            setSelectedDocuments(prev => prev.filter(id => id !== documentId));
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedDocuments(documents.map(doc => doc.id));
        } else {
            setSelectedDocuments([]);
        }
    };

    const handleArchiveDocument = async (documentId: string) => {
        try {
            await archiveDocument.mutateAsync(documentId);
            toast.success('Document archived successfully');
        } catch (error) {
            toast.error('Failed to archive document');
        }
    };

    const handleRestoreDocument = async (documentId: string) => {
        try {
            await restoreDocument.mutateAsync(documentId);
            toast.success('Document restored successfully');
        } catch (error) {
            toast.error('Failed to restore document');
        }
    };

    const handleDeleteDocument = async (documentId: string) => {
        if (window.confirm('Are you sure you want to delete this document?')) {
            try {
                await deleteDocument.mutateAsync(documentId);
                toast.success('Document deleted successfully');
            } catch (error) {
                toast.error('Failed to delete document');
            }
        }
    };

    const handleGenerateReport = async (reportType: string) => {
        try {
            await generateReport.mutateAsync({
                report_type: reportType as 'summary' | 'detailed' | 'analytics' | 'compliance' | 'audit',
                title: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
                parameters: { dateRange: 'last_30_days' },
                status: 'generating'
            });
            toast.success('Report generation started');
        } catch (error) {
            toast.error('Failed to generate report');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'archived':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'expired':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'draft':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getDocumentTypeIcon = (type: string) => {
        switch (type) {
            case 'PO':
                return '/flat-color-icons-folder0.svg';
            case 'Invoice':
                return '/flat-color-icons-folder1.svg';
            case 'GRN':
                return '/flat-color-icons-folder2.svg';
            case 'Tender':
                return '/flat-color-icons-folder3.svg';
            default:
                return '/flat-color-icons-folder0.svg';
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatCurrency = (amount: number, currency: string = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    };

    if (statsLoading || documentsLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading procurement reports...</p>
                </div>
            </div>
        );
    }

    if (statsError || documentsError) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="text-destructive">
                            {(statsError as any)?.message || (documentsError as any)?.message || 'Failed to load procurement reports'}
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
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <img src="/flat-color-icons-folder0.svg" alt="total documents" className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Documents</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats?.totalDocuments || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <img src="/material-symbols-download0.svg" alt="total size" className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Size</p>
                                <p className="text-2xl font-semibold text-gray-900">{formatFileSize(stats?.totalSize || 0)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <img src="/material-symbols-download1.svg" alt="recent uploads" className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Recent Uploads</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats?.recentUploads || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <img src="/material-symbols-download2.svg" alt="archived" className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Archived</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats?.archivedDocuments || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Document Archive Section */}
            <Card className="bg-white border-0 shadow-sm">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Document Archive</h2>
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2"
                            >
                                <Filter className="w-4 h-4" />
                                Filters
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowUploadDialog(true)}
                                className="flex items-center gap-2"
                            >
                                <Upload className="w-4 h-4" />
                                Upload
                            </Button>
                            <div className="relative">
                                <Input
                                    placeholder="Search documents..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-64 pr-10"
                                />
                                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    {showFilters && (
                        <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                            <Select
                                value={filters.document_type || ''}
                                onValueChange={(value) => setFilters(prev => ({ ...prev, document_type: value || undefined }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Document Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PO">Purchase Order</SelectItem>
                                    <SelectItem value="Invoice">Invoice</SelectItem>
                                    <SelectItem value="GRN">Goods Received Note</SelectItem>
                                    <SelectItem value="Tender">Tender</SelectItem>
                                    <SelectItem value="Contract">Contract</SelectItem>
                                    <SelectItem value="Quote">Quote</SelectItem>
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
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                    <SelectItem value="expired">Expired</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                </SelectContent>
                            </Select>

                            <Input
                                placeholder="Vendor Name"
                                value={filters.vendor || ''}
                                onChange={(e) => setFilters(prev => ({ ...prev, vendor: e.target.value || undefined }))}
                            />

                            <Input
                                placeholder="Fiscal Year"
                                value={filters.fiscal_year || ''}
                                onChange={(e) => setFilters(prev => ({ ...prev, fiscal_year: e.target.value || undefined }))}
                            />
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">
                                        <Checkbox
                                            checked={selectedDocuments.length === documents.length && documents.length > 0}
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Document</TableHead>
                                    <TableHead>Vendor</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Uploaded</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {documents.map((document) => (
                                    <TableRow key={document.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedDocuments.includes(document.id)}
                                                onCheckedChange={(checked) =>
                                                    handleSelectDocument(document.id, checked as boolean)
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={getDocumentTypeIcon(document.category)}
                                                    alt={document.category}
                                                    className="w-5 h-5"
                                                />
                                                <span className="font-medium">{document.category}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium text-gray-900">{document.title}</p>
                                                <p className="text-sm text-gray-500">{document.file_name}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>{document.description || '-'}</TableCell>
                                        <TableCell>
                                            {document.file_size ? `${(document.file_size / 1024).toFixed(2)} KB` : '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`${getStatusColor(document.status)} border`}>
                                                {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm text-gray-600">
                                                {format(new Date(document.created_at), 'MMM dd, yyyy')}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </Button>
                                                {document.status === 'active' ? (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleArchiveDocument(document.id)}
                                                        className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                                                    >
                                                        <Archive className="w-4 h-4" />
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleRestoreDocument(document.id)}
                                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    >
                                                        Restore
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteDocument(document.id)}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
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
                            Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalDocuments)} of {totalDocuments} documents
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

            {/* Report Generation Section */}
            <Card className="bg-white border-0 shadow-sm">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Generate Reports</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button
                            variant="outline"
                            onClick={() => handleGenerateReport('summary')}
                            className="h-20 flex flex-col items-center justify-center gap-2"
                        >
                            <img src="/material-symbols-download3.svg" alt="summary" className="w-6 h-6" />
                            <span className="text-sm">Summary Report</span>
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => handleGenerateReport('detailed')}
                            className="h-20 flex flex-col items-center justify-center gap-2"
                        >
                            <img src="/material-symbols-download4.svg" alt="detailed" className="w-6 h-6" />
                            <span className="text-sm">Detailed Report</span>
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => handleGenerateReport('analytics')}
                            className="h-20 flex flex-col items-center justify-center gap-2"
                        >
                            <img src="/material-symbols-download5.svg" alt="analytics" className="w-6 h-6" />
                            <span className="text-sm">Analytics Report</span>
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => handleGenerateReport('compliance')}
                            className="h-20 flex flex-col items-center justify-center gap-2"
                        >
                            <img src="/material-symbols-download6.svg" alt="compliance" className="w-6 h-6" />
                            <span className="text-sm">Compliance Report</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProcurementReportsPage;
