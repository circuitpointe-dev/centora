import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useUploadDocument } from '@/hooks/procurement/useProcurementReports';
import { toast } from 'sonner';

const ProcurementReportsTestPage: React.FC = () => {
    const [formData, setFormData] = useState({
        document_type: 'Contract' as 'Contract' | 'Invoice' | 'GRN' | 'PO' | 'Tender' | 'Quote' | 'Compliance',
        title: '',
        file_name: '',
        vendor_name: '',
        project_name: '',
        amount: '',
        currency: 'USD',
        description: '',
        fiscal_year: ''
    });

    const uploadDocument = useUploadDocument();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.file_name) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            await uploadDocument.mutateAsync({
                document_type: formData.document_type,
                title: formData.title,
                file_name: formData.file_name,
                file_path: `/documents/${formData.document_type.toLowerCase()}s/${formData.file_name}`,
                file_size: Math.floor(Math.random() * 1000000) + 100000, // Random file size
                mime_type: 'application/pdf',
                vendor_name: formData.vendor_name || undefined,
                project_name: formData.project_name || undefined,
                amount: formData.amount ? parseFloat(formData.amount) : undefined,
                currency: formData.currency,
                description: formData.description || undefined,
                fiscal_year: formData.fiscal_year || undefined
            });

            toast.success('Document uploaded successfully!');

            // Reset form
            setFormData({
                document_type: 'Contract',
                title: '',
                file_name: '',
                vendor_name: '',
                project_name: '',
                amount: '',
                currency: 'USD',
                description: '',
                fiscal_year: ''
            });
        } catch (error) {
            toast.error('Failed to upload document');
            console.error('Error uploading document:', error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <Card>
                <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Upload Test Document</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="document_type">Document Type</Label>
                                <Select
                                    value={formData.document_type}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, document_type: value as any }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Contract">Contract</SelectItem>
                                        <SelectItem value="Invoice">Invoice</SelectItem>
                                        <SelectItem value="GRN">Goods Received Note</SelectItem>
                                        <SelectItem value="PO">Purchase Order</SelectItem>
                                        <SelectItem value="Tender">Tender</SelectItem>
                                        <SelectItem value="Quote">Quote</SelectItem>
                                        <SelectItem value="Compliance">Compliance</SelectItem>
                                    </SelectContent>
                                </Select>
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
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Enter document title"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="file_name">File Name *</Label>
                            <Input
                                id="file_name"
                                value={formData.file_name}
                                onChange={(e) => setFormData(prev => ({ ...prev, file_name: e.target.value }))}
                                placeholder="Enter file name"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
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
                                <Label htmlFor="project_name">Project Name</Label>
                                <Input
                                    id="project_name"
                                    value={formData.project_name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, project_name: e.target.value }))}
                                    placeholder="Enter project name"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="amount">Amount</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <Label htmlFor="fiscal_year">Fiscal Year</Label>
                                <Input
                                    id="fiscal_year"
                                    value={formData.fiscal_year}
                                    onChange={(e) => setFormData(prev => ({ ...prev, fiscal_year: e.target.value }))}
                                    placeholder="2024"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Enter description"
                                rows={3}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={uploadDocument.isPending}
                        >
                            {uploadDocument.isPending ? 'Uploading...' : 'Upload Document'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProcurementReportsTestPage;
