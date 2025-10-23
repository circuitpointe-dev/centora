import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePurchaseOrders } from '@/hooks/procurement/usePurchaseOrders';
import { useVendors } from '@/hooks/procurement/useVendors';

interface CreateGRNDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: any) => void;
}

const CreateGRNDialog: React.FC<CreateGRNDialogProps> = ({ open, onOpenChange, onSubmit }) => {
    const [formData, setFormData] = useState({
        po_id: '',
        vendor_id: '',
        item_name: '',
        item_description: '',
        quantity_ordered: 0,
        quantity_received: 0,
        unit_price: 0,
        currency: 'USD',
        delivery_date: '',
        notes: ''
    });

    const { data: purchaseOrdersData } = usePurchaseOrders();
    const { data: vendorsData } = useVendors({ page: 1, limit: 100 });

    const purchaseOrders = purchaseOrdersData?.data || [];
    const vendors = vendorsData?.data || [];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Create New GRN</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="po_id">Purchase Order</Label>
                            <Select value={formData.po_id} onValueChange={(value) => handleChange('po_id', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select PO" />
                                </SelectTrigger>
                                <SelectContent>
                                    {purchaseOrders.map((po) => (
                                        <SelectItem key={po.id} value={po.id}>
                                            {po.po_number} - {(po as any).vendor?.full_name || 'Unknown Vendor'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="vendor_id">Vendor</Label>
                            <Select value={formData.vendor_id} onValueChange={(value) => handleChange('vendor_id', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Vendor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {vendors.map((vendor) => (
                                        <SelectItem key={vendor.id} value={vendor.id}>
                                            {vendor.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="item_name">Item Name</Label>
                        <Input
                            id="item_name"
                            value={formData.item_name}
                            onChange={(e) => handleChange('item_name', e.target.value)}
                            placeholder="Enter item name"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="item_description">Item Description</Label>
                        <Textarea
                            id="item_description"
                            value={formData.item_description}
                            onChange={(e) => handleChange('item_description', e.target.value)}
                            placeholder="Enter item description"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="quantity_ordered">Quantity Ordered</Label>
                            <Input
                                id="quantity_ordered"
                                type="number"
                                value={formData.quantity_ordered}
                                onChange={(e) => handleChange('quantity_ordered', parseInt(e.target.value) || 0)}
                                placeholder="0"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="quantity_received">Quantity Received</Label>
                            <Input
                                id="quantity_received"
                                type="number"
                                value={formData.quantity_received}
                                onChange={(e) => handleChange('quantity_received', parseInt(e.target.value) || 0)}
                                placeholder="0"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="unit_price">Unit Price</Label>
                            <Input
                                id="unit_price"
                                type="number"
                                step="0.01"
                                value={formData.unit_price}
                                onChange={(e) => handleChange('unit_price', parseFloat(e.target.value) || 0)}
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="currency">Currency</Label>
                            <Select value={formData.currency} onValueChange={(value) => handleChange('currency', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USD">USD</SelectItem>
                                    <SelectItem value="EUR">EUR</SelectItem>
                                    <SelectItem value="GBP">GBP</SelectItem>
                                    <SelectItem value="NGN">NGN</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="delivery_date">Delivery Date</Label>
                            <Input
                                id="delivery_date"
                                type="date"
                                value={formData.delivery_date}
                                onChange={(e) => handleChange('delivery_date', e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => handleChange('notes', e.target.value)}
                            placeholder="Enter any additional notes"
                            rows={3}
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-[#7c3aed] hover:bg-[#6d28d9]">
                            Create GRN
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateGRNDialog;
