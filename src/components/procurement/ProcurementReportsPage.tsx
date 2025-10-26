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
    useDownloadDocument,
    useViewDocument,
    type ProcurementDocument,
    type DocumentFilters
} from '@/hooks/procurement/useProcurementReports';
import ComplianceAuditReportPage from './ComplianceAuditReportPage';
import DonorComplianceReportsPage from './DonorComplianceReportsPage';
import SpendAnalysisReportsPage from './SpendAnalysisReportsPage';

const ProcurementReportsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('procurement-document-archive');
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
        8,
        searchTerm,
        filters
    );
    const generateReportMutation = useGenerateReport();
    const archiveDocument = useArchiveDocument();
    const restoreDocument = useRestoreDocument();
    const deleteDocument = useDeleteDocument();
    const uploadDocument = useUploadDocument();
    const downloadDocument = useDownloadDocument();
    const viewDocument = useViewDocument();

    const documents = documentsData?.data || [];
    const totalDocuments = documentsData?.total || 0;
    const totalPages = Math.ceil(totalDocuments / 8);

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

    const handleDownloadDocument = async (documentId: string) => {
        try {
            const documentData = await downloadDocument.mutateAsync(documentId) as ProcurementDocument;
            // Create download link
            const link = window.document.createElement('a');
            link.href = documentData.file_path;
            link.download = documentData.file_name;
            window.document.body.appendChild(link);
            link.click();
            window.document.body.removeChild(link);
            toast.success('Download started');
        } catch (error) {
            toast.error('Failed to download document');
        }
    };

    const handleViewDocument = async (documentId: string) => {
        try {
            const documentData = await viewDocument.mutateAsync(documentId) as ProcurementDocument;
            // Open document in new tab
            window.open(documentData.file_path, '_blank');
            toast.success('Document opened');
        } catch (error) {
            toast.error('Failed to view document');
        }
    };

    const handleViewCategory = async (category: string) => {
        try {
            // Filter documents by category
            setFilters(prev => ({ ...prev, document_type: category }));
            setActiveTab('procurement-document-archive');
            toast.success(`Viewing ${category} documents`);
        } catch (error) {
            toast.error('Failed to filter documents');
        }
    };

    const handleDownloadCategory = async (category: string) => {
        try {
            // Generate bulk download for category
            const categoryDocuments = documents.filter(doc => doc.document_type === category);
            if (categoryDocuments.length === 0) {
                toast.info(`No ${category} documents to download`);
                return;
            }

            // Create zip download (simulated)
            toast.success(`Downloading ${categoryDocuments.length} ${category} documents`);
        } catch (error) {
            toast.error('Failed to download documents');
        }
    };

    const handleGenerateReport = async (reportType: string) => {
        try {
            await generateReportMutation.mutateAsync({
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
            case 'Contract':
                return '/flat-color-icons-folder0.svg';
            case 'Invoice':
                return '/flat-color-icons-folder1.svg';
            case 'GRN':
                return '/flat-color-icons-folder2.svg';
            case 'PO':
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
        <div className="bg-[#f5f7fa] min-h-screen">
            {/* Main Content */}
            <div className="p-8 space-y-8">
                {/* Tab Navigation - Pixel Perfect Match */}
                <div className="flex gap-1 bg-white rounded-lg p-1 mb-8 w-fit">
                    {[
                        { id: 'procurement-document-archive', label: 'Procurement document archive' },
                        { id: 'compliance-audit', label: 'Compliance & audit trial report' },
                        { id: 'donor-compliance', label: 'Donor compliance reports' },
                        { id: 'spend-analysis', label: 'Spend analysis reports' }
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

                {/* Render Compliance & Audit Trial Report */}
                {activeTab === 'compliance-audit' && <ComplianceAuditReportPage />}

                {/* Render Donor Compliance Reports */}
                {activeTab === 'donor-compliance' && <DonorComplianceReportsPage />}

                {/* Render Spend Analysis Reports */}
                {activeTab === 'spend-analysis' && <SpendAnalysisReportsPage />}

                {/* Document Category Cards - Pixel Perfect Match */}
                {activeTab === 'procurement-document-archive' && (
                    <div className="grid grid-cols-4 gap-6 mb-8">
                        {/* Contract Card */}
                        <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                                        <img src="/flat-color-icons-folder0.svg" alt="contract" className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Contract</h3>
                                    <p className="text-2xl font-bold text-gray-900 mb-4">+{stats?.contractCount || 0}</p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-1"
                                            onClick={() => handleViewCategory('Contract')}
                                        >
                                            <img src="/mdi-eye-outline0.svg" alt="view" className="w-4 h-4" />
                                            View
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-1"
                                            onClick={() => handleDownloadCategory('Contract')}
                                        >
                                            <img src="/material-symbols-download0.svg" alt="download" className="w-4 h-4" />
                                            Download
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Invoice Card */}
                        <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                                        <img src="/flat-color-icons-folder1.svg" alt="invoice" className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Invoices</h3>
                                    <p className="text-2xl font-bold text-gray-900 mb-4">+{stats?.invoiceCount || 0}</p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-1"
                                            onClick={() => handleViewCategory('Invoice')}
                                        >
                                            <img src="/mdi-eye-outline1.svg" alt="view" className="w-4 h-4" />
                                            View
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-1"
                                            onClick={() => handleDownloadCategory('Invoice')}
                                        >
                                            <img src="/material-symbols-download1.svg" alt="download" className="w-4 h-4" />
                                            Download
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* GRN Card */}
                        <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                                        <img src="/flat-color-icons-folder2.svg" alt="grn" className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">GRNs</h3>
                                    <p className="text-2xl font-bold text-gray-900 mb-4">+{stats?.grnCount || 0}</p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-1"
                                            onClick={() => handleViewCategory('GRN')}
                                        >
                                            <img src="/mdi-eye-outline2.svg" alt="view" className="w-4 h-4" />
                                            View
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-1"
                                            onClick={() => handleDownloadCategory('GRN')}
                                        >
                                            <img src="/material-symbols-download2.svg" alt="download" className="w-4 h-4" />
                                            Download
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* PO Card */}
                        <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                                        <img src="/flat-color-icons-folder3.svg" alt="po" className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">POs</h3>
                                    <p className="text-2xl font-bold text-gray-900 mb-4">+{stats?.poCount || 0}</p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-1"
                                            onClick={() => handleViewCategory('PO')}
                                        >
                                            <img src="/mdi-eye-outline3.svg" alt="view" className="w-4 h-4" />
                                            View
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-1"
                                            onClick={() => handleDownloadCategory('PO')}
                                        >
                                            <img src="/material-symbols-download3.svg" alt="download" className="w-4 h-4" />
                                            Download
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Document List Section - Pixel Perfect Match */}
                {activeTab === 'procurement-document-archive' && (
                    <Card className="bg-white border-0 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-gray-900">Procurement document archive</h2>
                                <div className="flex items-center gap-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="flex items-center gap-2"
                                    >
                                        <img src="/ion-filter0.svg" alt="filter" className="w-4 h-4" />
                                        Filter
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
                                        value={filters.document_type || ''}
                                        onValueChange={(value) => setFilters(prev => ({ ...prev, document_type: value || undefined }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Document Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Contract">Contract</SelectItem>
                                            <SelectItem value="Invoice">Invoice</SelectItem>
                                            <SelectItem value="GRN">Goods Received Note</SelectItem>
                                            <SelectItem value="PO">Purchase Order</SelectItem>
                                            <SelectItem value="Tender">Tender</SelectItem>
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
                                            <TableHead>Document</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Vendor</TableHead>
                                            <TableHead>Project</TableHead>
                                            <TableHead>Date</TableHead>
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
                                                    <div>
                                                        <p className="font-medium text-gray-900">{document.title}</p>
                                                        <p className="text-sm text-gray-500">{document.file_name}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <img
                                                            src={getDocumentTypeIcon(document.document_type)}
                                                            alt={document.document_type}
                                                            className="w-5 h-5"
                                                        />
                                                        <span className="font-medium">{document.document_type}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{document.vendor_name || '-'}</TableCell>
                                                <TableCell>{document.project_name || '-'}</TableCell>
                                                <TableCell>
                                                    <div className="text-sm text-gray-600">
                                                        {format(new Date(document.uploaded_at), 'MMM dd, yyyy')}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleViewDocument(document.id)}
                                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2"
                                                            disabled={viewDocument.isPending}
                                                            title="View document"
                                                        >
                                                            <img src="/mdi-eye-outline0.svg" alt="view" className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDownloadDocument(document.id)}
                                                            className="text-green-600 hover:text-green-700 hover:bg-green-50 p-2"
                                                            disabled={downloadDocument.isPending}
                                                            title="Download document"
                                                        >
                                                            <img src="/material-symbols-download0.svg" alt="download" className="w-4 h-4" />
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

                            {/* Pagination - Pixel Perfect Match */}
                            <div className="flex items-center justify-between mt-6">
                                <p className="text-sm text-gray-600">
                                    Showing {((currentPage - 1) * 8) + 1} to {Math.min(currentPage * 8, totalDocuments)} of {totalDocuments} contract folder lists
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
                )}
            </div>
        </div>
    );
};

export default ProcurementReportsPage;