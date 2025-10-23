import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { usePurchaseOrderDetail } from '@/hooks/procurement/usePurchaseOrders';

const PurchaseOrderDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: po, isLoading, error } = usePurchaseOrderDetail(id || '');

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading purchase order...</p>
                </div>
            </div>
        );
    }

    if (error || !po) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="text-destructive">{(error as any)?.message || 'Purchase order not found'}</div>
                            <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'cancelled':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatCurrency = (amount: number, currency: string = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="min-h-screen bg-[#f5f7fa]">
            <div className="p-8">
                {/* Back Navigation */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <img src="/arrow-left0.svg" alt="back" className="w-4 h-4" />
                        <span className="text-sm">Back to purchase order</span>
                    </button>
                </div>

                {/* Main Content */}
                <Card className="bg-white border-0 shadow-sm">
                    <CardContent className="p-8">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900">Purchase Order (PO) View</h2>
                            <Button variant="outline" className="flex items-center gap-2">
                                <img src="/material-symbols-add-rounded0.svg" alt="edit" className="w-4 h-4" />
                                Edit
                            </Button>
                        </div>

                        {/* PO Detail Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-sm font-medium text-gray-600">PO Number:</span>
                                    <span className="text-sm font-semibold text-gray-900">{po.po_number}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-sm font-medium text-gray-600">Linked Requisition:</span>
                                    <span className="text-sm font-semibold text-gray-900">{po.requisition_id || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-sm font-medium text-gray-600">Vendor:</span>
                                    <span className="text-sm font-semibold text-gray-900">{po.vendor?.full_name || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-sm font-medium text-gray-600">PO Date:</span>
                                    <span className="text-sm font-semibold text-gray-900">{formatDate(po.po_date)}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-sm font-medium text-gray-600">Expected Delivery:</span>
                                    <span className="text-sm font-semibold text-gray-900">{po.expected_delivery_date ? formatDate(po.expected_delivery_date) : 'N/A'}</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-sm font-medium text-gray-600">Terms & Conditions:</span>
                                    <span className="text-sm font-semibold text-gray-900">{po.terms_and_conditions || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-sm font-medium text-gray-600">Currency:</span>
                                    <span className="text-sm font-semibold text-gray-900">{po.currency}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-sm font-medium text-gray-600">Status:</span>
                                    <Badge className={`${getStatusColor(po.status)} px-2 py-1 rounded-full text-xs font-medium`}>
                                        {po.status.charAt(0).toUpperCase() + po.status.slice(1).replace('_', ' ')}
                                    </Badge>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-sm font-medium text-gray-600">Notes:</span>
                                    <span className="text-sm text-gray-500">{po.notes || 'No notes'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Approval Workflow Section */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Approval Workflow</h3>
                            <div className="flex items-center justify-between">
                                {[
                                    { type: 'created', label: 'Created', icon: 'nrk-check-active0.svg' },
                                    { type: 'manager_approval', label: 'Manager approval', icon: 'material-symbols-order-approve-outline-sharp0.svg' },
                                    { type: 'finance_approval', label: 'Finance approval', icon: 'carbon-cost-total0.svg' },
                                    { type: 'procurement_head', label: 'Procurement head', icon: 'material-symbols-light-pending0.svg' }
                                ].map((step, index) => {
                                    const isCompleted = false; // Simplified - approval tracking removed

                                    return (
                                        <div key={step.type} className="flex flex-col items-center">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${isCompleted ? 'bg-purple-100' : 'bg-gray-100'
                                                }`}>
                                                <img src={`/${step.icon}`} alt={step.label} className="w-6 h-6" />
                                            </div>
                                             <span className="text-sm font-medium text-gray-900">{step.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Items Section */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Item list</h3>
                            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Item</th>
                                            <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Description</th>
                                            <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Quantity</th>
                                            <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Unit price</th>
                                            <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Total</th>
                                            <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Budget source</th>
                                            <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {po.items.map((item) => (
                                            <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-4 px-6 text-sm font-medium text-gray-900">{item.item_description}</td>
                                                <td className="py-4 px-6 text-sm text-gray-700">{item.specifications || 'N/A'}</td>
                                                <td className="py-4 px-6 text-sm text-gray-700">{item.quantity.toLocaleString()}</td>
                                                <td className="py-4 px-6 text-sm text-gray-700">{formatCurrency(item.unit_price, po.currency)}</td>
                                                <td className="py-4 px-6 text-sm font-medium text-gray-900">{formatCurrency(item.total_price, po.currency)}</td>
                                                <td className="py-4 px-6 text-sm text-gray-700">{item.unit_of_measure || 'N/A'}</td>
                                                <td className="py-4 px-6">
                                                    <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                                                        <img src="/material-symbols-delete-outline-rounded0.svg" alt="delete" className="w-4 h-4 mr-1" />
                                                        Delete
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Cost Summary Section */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Cost Summary</h3>
                            <div className="bg-gray-50 rounded-lg p-6">
                                <div className="space-y-3">
                                    <div className="border-t border-gray-300 pt-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                                            <span className="text-lg font-bold text-gray-900">{formatCurrency(po.total_amount, po.currency)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Navigation */}
                        <div className="flex items-center justify-end gap-4">
                            <Button variant="outline" onClick={() => navigate(-1)}>
                                Cancel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PurchaseOrderDetailPage;
