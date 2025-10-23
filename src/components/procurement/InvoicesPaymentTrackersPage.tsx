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
    Eye,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
    useInvoiceStats,
    useInvoices,
    useApproveInvoice,
    useMarkInvoicePaid,
    useDeleteInvoice,
    type Invoice,
    type InvoiceFilters
} from '@/hooks/procurement/useInvoices';

const InvoicesPaymentTrackersPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<InvoiceFilters>({});
    const [showFilters, setShowFilters] = useState(false);

    // Backend data hooks
    const { data: stats, isLoading: statsLoading, error: statsError } = useInvoiceStats();
    const { data: invoicesData, isLoading: invoicesLoading, error: invoicesError } = useInvoices(
        currentPage,
        8,
        searchTerm,
        filters
    );
    const approveInvoice = useApproveInvoice();
    const markInvoicePaid = useMarkInvoicePaid();
    const deleteInvoice = useDeleteInvoice();

    const invoices = invoicesData?.data || [];
    const totalInvoices = invoicesData?.total || 0;
    const totalPages = Math.ceil(totalInvoices / 8);

    const handleSelectInvoice = (invoiceId: string, checked: boolean) => {
        if (checked) {
            setSelectedInvoices(prev => [...prev, invoiceId]);
        } else {
            setSelectedInvoices(prev => prev.filter(id => id !== invoiceId));
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedInvoices(invoices.map(invoice => invoice.id));
        } else {
            setSelectedInvoices([]);
        }
    };

    const handleApproveInvoice = async (invoiceId: string) => {
        try {
            await approveInvoice.mutateAsync(invoiceId);
            toast.success('Invoice approved successfully');
        } catch (error) {
            toast.error('Failed to approve invoice');
        }
    };

    const handleMarkPaid = async (invoiceId: string) => {
        try {
            await markInvoicePaid.mutateAsync({
                id: invoiceId,
                payment_date: new Date().toISOString().split('T')[0]
            });
            toast.success('Invoice marked as paid');
        } catch (error) {
            toast.error('Failed to mark invoice as paid');
        }
    };

    const handleDeleteInvoice = async (invoiceId: string) => {
        try {
            await deleteInvoice.mutateAsync(invoiceId);
            toast.success('Invoice deleted successfully');
        } catch (error) {
            toast.error('Failed to delete invoice');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'matched':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'paid':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'disputed':
                return 'bg-red-100 text-red-800 border-red-200';
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

    if (statsLoading || invoicesLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading invoices...</p>
                </div>
            </div>
        );
    }

    if (statsError || invoicesError) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="text-destructive">
                            {(statsError as any)?.message || (invoicesError as any)?.message || 'Failed to load invoices'}
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
                                <img src="/uil-invoice0.svg" alt="pending" className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Pending invoices</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats?.pendingInvoices || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <img src="/uil-invoice1.svg" alt="matched" className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Matched invoices</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats?.matchedInvoices || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <img src="/uil-invoice2.svg" alt="approved" className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Approved invoices</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats?.approvedInvoices || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <img src="/uil-invoice3.svg" alt="paid" className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Paid invoices</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats?.paidInvoices || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Invoices List */}
            <Card className="bg-white border-0 shadow-sm">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Invoices list</h2>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Input
                                    placeholder="Search..."
                                    className="w-64 pr-10"
                                />
                                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                            <Button variant="outline" className="flex items-center gap-2">
                                <img src="/uil-export0.svg" alt="export" className="w-4 h-4" />
                                Export report
                            </Button>
                            <Button className="bg-[#7c3aed] text-white flex items-center gap-2">
                                <img src="/solar-upload-bold0.svg" alt="upload" className="w-4 h-4" />
                                Upload invoice
                            </Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">
                                        <Checkbox
                                            checked={selectedInvoices.length === invoices.length && invoices.length > 0}
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead>Invoice #</TableHead>
                                    <TableHead>Vendor</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Linked PO #</TableHead>
                                    <TableHead>Linked GRN #</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoices.map((invoice) => (
                                    <TableRow key={invoice.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedInvoices.includes(invoice.id)}
                                                onCheckedChange={(checked) =>
                                                    handleSelectInvoice(invoice.id, checked as boolean)
                                                }
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                                        <TableCell>{invoice.vendor_name}</TableCell>
                                        <TableCell>{formatCurrency(invoice.amount, invoice.currency)}</TableCell>
                                        <TableCell>{invoice.linked_po_number || '—'}</TableCell>
                                        <TableCell>{invoice.linked_grn_number || '—'}</TableCell>
                                        <TableCell>
                                            <Badge className={`${getStatusColor(invoice.status)} border`}>
                                                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => navigate(`/dashboard/procurement/invoice-detail/${invoice.id}`)}
                                                >
                                                    <img src="/eye0.svg" alt="view" className="w-4 h-4" />
                                                </Button>
                                                {invoice.status === 'pending' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleApproveInvoice(invoice.id)}
                                                    >
                                                        Approve
                                                    </Button>
                                                )}
                                                {invoice.status === 'approved' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleMarkPaid(invoice.id)}
                                                    >
                                                        Mark Paid
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteInvoice(invoice.id)}
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
                            Showing {((currentPage - 1) * 8) + 1} to {Math.min(currentPage * 8, totalInvoices)} of {totalInvoices} invoices
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

export default InvoicesPaymentTrackersPage;
