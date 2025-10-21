import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useCreateVendorContract } from '@/hooks/procurement/useVendors';
import { toast } from 'sonner';

interface AddContractModalProps {
    isOpen: boolean;
    onClose: () => void;
    vendorId: string;
    onSuccess: () => void;
}

const AddContractModal: React.FC<AddContractModalProps> = ({ isOpen, onClose, vendorId, onSuccess }) => {
    // Generate contract code automatically
    const generateContractCode = () => {
        const now = new Date();
        const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `CON-${ymd}-${random}`;
    };

    const [formData, setFormData] = useState({
        contract_code: generateContractCode(),
        title: '',
        start_date: '',
        end_date: '',
        value: '',
        currency: 'USD',
        status: 'Active'
    });

    const createContract = useCreateVendorContract();

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title) {
            toast.error('Title is required');
            return;
        }

        try {
            await createContract.mutateAsync({
                vendor_id: vendorId,
                contract_code: formData.contract_code,
                title: formData.title,
                start_date: formData.start_date || undefined,
                end_date: formData.end_date || undefined,
                value: formData.value ? parseFloat(formData.value) : undefined,
                currency: formData.currency,
                status: formData.status
            });

            toast.success('Contract created successfully');
            onSuccess();
            onClose();
            setFormData({
                contract_code: generateContractCode(),
                title: '',
                start_date: '',
                end_date: '',
                value: '',
                currency: 'USD',
                status: 'Active'
            });
        } catch (error) {
            console.error('Error creating contract:', error);
            toast.error('Failed to create contract');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <div className="w-6 h-6 bg-purple-600 rounded-full"></div>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Add Contract</h2>
                            <p className="text-sm text-gray-500">Create a new contract for this vendor</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contract Code
                                </label>
                                <Input
                                    value={formData.contract_code}
                                    disabled
                                    className="bg-gray-50"
                                />
                                <p className="text-xs text-gray-500 mt-1">Auto-generated</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Title *
                                </label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    placeholder="e.g., IT Support Services"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Date
                                </label>
                                <Input
                                    type="date"
                                    value={formData.start_date}
                                    onChange={(e) => handleInputChange('start_date', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    End Date
                                </label>
                                <Input
                                    type="date"
                                    value={formData.end_date}
                                    onChange={(e) => handleInputChange('end_date', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Value
                                </label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={formData.value}
                                    onChange={(e) => handleInputChange('value', e.target.value)}
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Currency
                                </label>
                                <select
                                    value={formData.currency}
                                    onChange={(e) => handleInputChange('currency', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="GBP">GBP</option>
                                    <option value="CAD">CAD</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => handleInputChange('status', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="Active">Active</option>
                                <option value="Expired">Expired</option>
                                <option value="Overdue">Overdue</option>
                                <option value="Terminated">Terminated</option>
                            </select>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200 bg-gray-50">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="px-8 py-3 text-gray-700 border-gray-300 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={createContract.isPending}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 font-medium shadow-sm"
                        >
                            {createContract.isPending ? 'Creating...' : 'Create Contract'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddContractModal;

