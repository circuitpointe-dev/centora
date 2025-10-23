import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useInvoiceDetail, useUpdateInvoice, useApproveInvoice, useMarkInvoicePaid, useDeleteInvoice } from '@/hooks/procurement/useInvoices';
import { toast } from 'sonner';

const InvoiceDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        description: '',
        notes: '',
        due_date: ''
    });

    const { data: invoice, isLoading, error } = useInvoiceDetail(id || '');
    const updateInvoice = useUpdateInvoice();
    const approveInvoice = useApproveInvoice();
    const markInvoicePaid = useMarkInvoicePaid();
    const deleteInvoice = useDeleteInvoice();

    React.useEffect(() => {
        if (invoice) {
            setEditData({
                description: invoice.description || '',
                notes: invoice.notes || '',
                due_date: invoice.due_date || ''
            });
        }
    }, [invoice]);

    const handleSave = async () => {
        if (!id) return;
        try {
            await updateInvoice.mutateAsync({
                id,
                updates: editData
            });
            setIsEditing(false);
            toast.success('Invoice updated successfully');
        } catch (error) {
            toast.error('Failed to update invoice');
        }
    };

    const handleApprove = async () => {
        if (!id) return;
        try {
            await approveInvoice.mutateAsync(id);
            toast.success('Invoice approved successfully');
        } catch (error) {
            toast.error('Failed to approve invoice');
        }
    };

    const handleMarkPaid = async () => {
        if (!id) return;
        try {
            await markInvoicePaid.mutateAsync({
                id,
                payment_date: new Date().toISOString().split('T')[0]
            });
            toast.success('Invoice marked as paid');
        } catch (error) {
            toast.error('Failed to mark invoice as paid');
        }
    };

    const handleDelete = async () => {
        if (!id) return;
        if (window.confirm('Are you sure you want to delete this invoice?')) {
            try {
                await deleteInvoice.mutateAsync(id);
                toast.success('Invoice deleted successfully');
                navigate('/dashboard/procurement/execution');
            } catch (error) {
                toast.error('Failed to delete invoice');
            }
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading invoice...</p>
                </div>
            </div>
        );
    }

    if (error || !invoice) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="text-destructive">{(error as any)?.message || 'Invoice not found'}</div>
                            <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Back Navigation */}
            <div className="mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <img src="/arrow-left0.svg" alt="back" className="w-4 h-4" />
                    <span className="text-sm">Back to invoices</span>
                </button>
            </div>

            {/* Main Content */}
            <Card className="bg-white border-0 shadow-sm">
                <CardContent className="p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900">Invoice Detail</h2>
                        <div className="flex items-center gap-3">
                            {invoice.status === 'pending' && (
                                <Button
                                    onClick={handleApprove}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    Approve Invoice
                                </Button>
                            )}
                            {invoice.status === 'approved' && (
                                <Button
                                    onClick={handleMarkPaid}
                                    className="bg-purple-600 hover:bg-purple-700 text-white"
                                >
                                    Mark as Paid
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                {isEditing ? 'Cancel' : 'Edit'}
                            </Button>
                            {isEditing && (
                                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
                                    Save Changes
                                </Button>
                            )}
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>

                    {/* Invoice Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Information</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Invoice Number:</span>
                                        <span className="font-medium">{invoice.invoice_number}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Vendor:</span>
                                        <span className="font-medium">{invoice.vendor_name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Amount:</span>
                                        <span className="font-medium text-lg">{formatCurrency(invoice.total_amount, invoice.currency)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Status:</span>
                                        <Badge className={`${getStatusColor(invoice.status)} border`}>
                                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Invoice Date:</span>
                                        <span className="font-medium">{new Date(invoice.invoice_date).toLocaleDateString()}</span>
                                    </div>
                                    {invoice.due_date && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Due Date:</span>
                                            <span className="font-medium">{new Date(invoice.due_date).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                    {invoice.payment_date && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Payment Date:</span>
                                            <span className="font-medium">{new Date(invoice.payment_date).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Linked Documents */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Linked Documents</h3>
                                <div className="space-y-3">
                                    {invoice.linked_po_number && (
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <span className="text-gray-600">Purchase Order:</span>
                                            <span className="font-medium">{invoice.linked_po_number}</span>
                                        </div>
                                    )}
                                    {invoice.linked_grn_number && (
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <span className="text-gray-600">GRN:</span>
                                            <span className="font-medium">{invoice.linked_grn_number}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Description */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                                {isEditing ? (
                                    <Input
                                        value={editData.description}
                                        onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Enter description..."
                                        className="w-full"
                                    />
                                ) : (
                                    <p className="text-gray-700">{invoice.description || 'No description provided'}</p>
                                )}
                            </div>

                            {/* Notes */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                                {isEditing ? (
                                    <textarea
                                        value={editData.notes}
                                        onChange={(e) => setEditData(prev => ({ ...prev, notes: e.target.value }))}
                                        placeholder="Enter notes..."
                                        className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                                        rows={4}
                                    />
                                ) : (
                                    <p className="text-gray-700">{invoice.notes || 'No notes provided'}</p>
                                )}
                            </div>

                            {/* Attachments */}
                            {invoice.attachments && invoice.attachments.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h3>
                                    <div className="space-y-2">
                                        {invoice.attachments.map((attachment, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <span className="text-gray-700">{attachment}</span>
                                                <Button variant="ghost" size="sm">
                                                    <img src="/material-symbols-download0.svg" alt="download" className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default InvoiceDetailPage;
