import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useGRNDetail, useUpdateGRN, useApproveGRN, useRejectGRN, useDeleteGRN } from '@/hooks/procurement/useGoodsReceivedNotes';

const GRNDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        item_name: '',
        delivery_date: '',
        quantity_received: 0,
        quantity_ordered: 0,
        notes: ''
    });

    const { data: grn, isLoading, error } = useGRNDetail(id || '');
    const updateGRN = useUpdateGRN();
    const approveGRN = useApproveGRN();
    const rejectGRN = useRejectGRN();
    const deleteGRN = useDeleteGRN();

    React.useEffect(() => {
        if (grn) {
            setEditData({
                item_name: grn.item_name,
                delivery_date: grn.delivery_date,
                quantity_received: grn.quantity_received,
                quantity_ordered: grn.quantity_ordered,
                notes: grn.notes || ''
            });
        }
    }, [grn]);

    const handleSave = async () => {
        if (!id) return;
        try {
            await updateGRN.mutateAsync({
                id,
                updates: editData
            });
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating GRN:', error);
        }
    };

    const handleApprove = async () => {
        if (!id) return;
        try {
            await approveGRN.mutateAsync(id);
        } catch (error) {
            console.error('Error approving GRN:', error);
        }
    };

    const handleReject = async () => {
        if (!id) return;
        try {
            await rejectGRN.mutateAsync(id);
        } catch (error) {
            console.error('Error rejecting GRN:', error);
        }
    };

    const handleDelete = async () => {
        if (!id) return;
        if (window.confirm('Are you sure you want to delete this GRN?')) {
            try {
                await deleteGRN.mutateAsync(id);
                navigate('/dashboard/procurement/grn');
            } catch (error) {
                console.error('Error deleting GRN:', error);
            }
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            approved: { color: 'bg-green-100 text-green-800', label: 'Approved' },
            pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
            partial: { color: 'bg-red-100 text-red-800', label: 'Partial' },
            rejected: { color: 'bg-gray-100 text-gray-800', label: 'Rejected' }
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
        return (
            <Badge className={`${config.color} px-3 py-1 rounded-full text-sm font-medium`}>
                {config.label}
            </Badge>
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading GRN details...</p>
                </div>
            </div>
        );
    }

    if (error || !grn) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="text-destructive">{(error as any)?.message || 'GRN not found'}</div>
                            <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f5f7fa]">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <img src="/arrow-left0.svg" alt="back" className="w-4 h-4" />
                            <span className="text-sm font-medium">Back</span>
                        </button>
                        <div>
                            <h1 className="text-2xl font-semibold text-[#383839]">GRN Details</h1>
                            <p className="text-sm text-gray-600">Goods Received Note: {grn.grn_number}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            <img src="/material-symbols-add-rounded0.svg" alt="edit" className="w-4 h-4 mr-2" />
                            {isEditing ? 'Cancel' : 'Edit'}
                        </Button>
                        {grn.status === 'pending' && (
                            <>
                                <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    onClick={handleApprove}
                                    disabled={approveGRN.isPending}
                                >
                                    <img src="/nrk-check-active0.svg" alt="approve" className="w-4 h-4 mr-2" />
                                    Approve
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 border-red-300 hover:bg-red-50"
                                    onClick={handleReject}
                                    disabled={rejectGRN.isPending}
                                >
                                    <img src="/material-symbols-delete-outline-rounded0.svg" alt="reject" className="w-4 h-4 mr-2" />
                                    Reject
                                </Button>
                            </>
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-300 hover:bg-red-50"
                            onClick={handleDelete}
                            disabled={deleteGRN.isPending}
                        >
                            <img src="/material-symbols-delete-outline-rounded1.svg" alt="delete" className="w-4 h-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>
            </div>

            <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* GRN Information */}
                        <Card className="border border-gray-200 shadow-sm">
                            <CardContent className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">GRN Information</h3>
                                        <p className="text-sm text-gray-600 mt-1">Basic details and status information</p>
                                    </div>
                                    {getStatusBadge(grn.status)}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">GRN Number</label>
                                        {isEditing ? (
                                            <Input
                                                value={grn.grn_number}
                                                disabled
                                                className="bg-gray-50"
                                            />
                                        ) : (
                                            <div className="text-sm text-gray-900 font-medium">{grn.grn_number}</div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">PO Number</label>
                                        {isEditing ? (
                                            <Input
                                                value={grn.po_number || ''}
                                                onChange={(e) => setEditData(prev => ({ ...prev, po_number: e.target.value }))}
                                            />
                                        ) : (
                                            <div className="text-sm text-gray-900 font-medium">{grn.po_number || 'N/A'}</div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Vendor Name</label>
                                        {isEditing ? (
                                            <Input
                                                value={grn.vendor_name}
                                                onChange={(e) => setEditData(prev => ({ ...prev, vendor_name: e.target.value }))}
                                            />
                                        ) : (
                                            <div className="text-sm text-gray-900 font-medium">{grn.vendor_name}</div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
                                        {isEditing ? (
                                            <Input
                                                value={editData.item_name}
                                                onChange={(e) => setEditData(prev => ({ ...prev, item_name: e.target.value }))}
                                            />
                                        ) : (
                                            <div className="text-sm text-gray-900 font-medium">{grn.item_name}</div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Date</label>
                                        {isEditing ? (
                                            <Input
                                                type="date"
                                                value={editData.delivery_date}
                                                onChange={(e) => setEditData(prev => ({ ...prev, delivery_date: e.target.value }))}
                                            />
                                        ) : (
                                            <div className="text-sm text-gray-900 font-medium">
                                                {new Date(grn.delivery_date).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Received By</label>
                                        <div className="text-sm text-gray-900 font-medium">{grn.received_by_name || 'N/A'}</div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                                    {isEditing ? (
                                        <textarea
                                            value={editData.notes}
                                            onChange={(e) => setEditData(prev => ({ ...prev, notes: e.target.value }))}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            rows={3}
                                        />
                                    ) : (
                                        <div className="text-sm text-gray-900 font-medium">{grn.notes || 'No notes'}</div>
                                    )}
                                </div>

                                {isEditing && (
                                    <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsEditing(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleSave}
                                            disabled={updateGRN.isPending}
                                            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white"
                                        >
                                            {updateGRN.isPending ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Quantity Information */}
                        <Card className="border border-gray-200 shadow-sm">
                            <CardContent className="p-8">
                                <div className="mb-8">
                                    <h3 className="text-xl font-semibold text-gray-900">Quantity Information</h3>
                                    <p className="text-sm text-gray-600 mt-1">Track delivery progress and completion rates</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Quantity Received</label>
                                        {isEditing ? (
                                            <Input
                                                type="number"
                                                value={editData.quantity_received}
                                                onChange={(e) => setEditData(prev => ({ ...prev, quantity_received: parseInt(e.target.value) || 0 }))}
                                            />
                                        ) : (
                                            <div className="text-2xl font-bold text-gray-900">{grn.quantity_received}</div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Quantity Ordered</label>
                                        {isEditing ? (
                                            <Input
                                                type="number"
                                                value={editData.quantity_ordered}
                                                onChange={(e) => setEditData(prev => ({ ...prev, quantity_ordered: parseInt(e.target.value) || 0 }))}
                                            />
                                        ) : (
                                            <div className="text-2xl font-bold text-gray-900">{grn.quantity_ordered}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">Completion Rate</span>
                                        <span className="text-sm font-bold text-gray-900">
                                            {Math.round((grn.quantity_received / grn.quantity_ordered) * 100)}%
                                        </span>
                                    </div>
                                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-[#7c3aed] h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${Math.min((grn.quantity_received / grn.quantity_ordered) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status Card */}
                        <Card className="border border-gray-200 shadow-sm">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">Status</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Current Status</span>
                                        {getStatusBadge(grn.status)}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Created</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {new Date(grn.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Last Updated</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {new Date(grn.updated_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions Card */}
                        <Card className="border border-gray-200 shadow-sm">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">Actions</h3>
                                <div className="space-y-3">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                        onClick={() => window.print()}
                                    >
                                        <img src="/material-symbols-download0.svg" alt="print" className="w-4 h-4 mr-2" />
                                        Print GRN
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                        onClick={() => {/* TODO: Implement email functionality */ }}
                                    >
                                        <img src="/material-symbols-download0.svg" alt="email" className="w-4 h-4 mr-2" />
                                        Email GRN
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                        onClick={() => {/* TODO: Implement download functionality */ }}
                                    >
                                        <img src="/material-symbols-download0.svg" alt="download" className="w-4 h-4 mr-2" />
                                        Download PDF
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GRNDetailPage;
