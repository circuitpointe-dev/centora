import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateMobileApproval } from '@/hooks/procurement/useMobileApprovals';
import { toast } from 'sonner';

const MobileApprovalsTestPage: React.FC = () => {
    const [formData, setFormData] = useState({
        type: 'purchase_order' as 'requisition' | 'purchase_order' | 'payment',
        amount: '',
        currency: 'USD',
        description: '',
        vendor_name: '',
        priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
        due_date: ''
    });

    const createApproval = useCreateMobileApproval();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.amount || !formData.description) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            await createApproval.mutateAsync({
                type: formData.type,
                amount: parseFloat(formData.amount),
                currency: formData.currency,
                description: formData.description,
                vendor_name: formData.vendor_name || undefined,
                priority: formData.priority,
                due_date: formData.due_date || undefined
            });

            toast.success('Mobile approval created successfully!');

            // Reset form
            setFormData({
                type: 'purchase_order',
                amount: '',
                currency: 'USD',
                description: '',
                vendor_name: '',
                priority: 'medium',
                due_date: ''
            });
        } catch (error) {
            toast.error('Failed to create mobile approval');
            console.error('Error creating approval:', error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <Card>
                <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Create Test Mobile Approval</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="type">Type</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="requisition">Requisition</SelectItem>
                                        <SelectItem value="purchase_order">Purchase Order</SelectItem>
                                        <SelectItem value="payment">Payment</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="priority">Priority</Label>
                                <Select
                                    value={formData.priority}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as any }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="urgent">Urgent</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="amount">Amount *</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                                    placeholder="0.00"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="currency">Currency</Label>
                                <Select
                                    value={formData.currency}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                                >
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
                        </div>

                        <div>
                            <Label htmlFor="vendor_name">Vendor Name</Label>
                            <Input
                                id="vendor_name"
                                value={formData.vendor_name}
                                onChange={(e) => setFormData(prev => ({ ...prev, vendor_name: e.target.value }))}
                                placeholder="Enter vendor name"
                            />
                        </div>

                        <div>
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Enter description"
                                rows={3}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="due_date">Due Date</Label>
                            <Input
                                id="due_date"
                                type="date"
                                value={formData.due_date}
                                onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={createApproval.isPending}
                        >
                            {createApproval.isPending ? 'Creating...' : 'Create Mobile Approval'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default MobileApprovalsTestPage;

