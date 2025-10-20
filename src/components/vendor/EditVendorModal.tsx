import React, { useState, useEffect } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useUpdateVendor } from '@/hooks/procurement/useVendors';
import { useUpsertVendorCategory as useUpsertCategory } from '@/hooks/procurement/useVendorClassifications';
import { toast } from 'sonner';

interface EditVendorModalProps {
    isOpen: boolean;
    onClose: () => void;
    vendor: any;
    onSave: () => void;
}

const EditVendorModal: React.FC<EditVendorModalProps> = ({ isOpen, onClose, vendor, onSave }) => {
    const [formData, setFormData] = useState({
        vendor_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        contact_person: '',
        category: '',
        rating: 0
    });

    const [assignedCategories, setAssignedCategories] = useState<string[]>([]);
    const [newCategory, setNewCategory] = useState('');
    const [tags, setTags] = useState({
        preferred: false,
        strategic: false,
        highRisk: false
    });
    const [vendorTier, setVendorTier] = useState('Standard Vendor');
    const [analytics, setAnalytics] = useState({
        spendPercentage: 15,
        vendorCount: 106,
        performanceScore: 78
    });

    const updateVendor = useUpdateVendor();
    const upsertCategory = useUpsertCategory();

    useEffect(() => {
        if (vendor && isOpen) {
            setFormData({
                vendor_name: vendor.vendor_name || '',
                email: vendor.email || '',
                phone: vendor.phone || '',
                address: vendor.address || '',
                city: vendor.city || '',
                country: vendor.country || '',
                contact_person: vendor.contact_person || '',
                category: vendor.category || '',
                rating: vendor.rating || 0
            });
        }
    }, [vendor, isOpen]);

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddCategory = () => {
        if (newCategory.trim() && !assignedCategories.includes(newCategory.trim())) {
            setAssignedCategories(prev => [...prev, newCategory.trim()]);
            setNewCategory('');
        }
    };

    const handleRemoveCategory = (category: string) => {
        setAssignedCategories(prev => prev.filter(c => c !== category));
    };

    const handleTagToggle = (tag: string) => {
        setTags(prev => ({
            ...prev,
            [tag]: !prev[tag as keyof typeof prev]
        }));
    };

    const handleSave = async () => {
        try {
            await updateVendor.mutateAsync({
                id: vendor.id,
                updates: formData
            });

            // Save categories
            for (const category of assignedCategories) {
                await upsertCategory.mutateAsync({
                    vendor_id: vendor.id,
                    data: {
                        category_name: category,
                        category_type: 'Assigned',
                        assigned_date: new Date().toISOString().split('T')[0]
                    }
                });
            }

            toast.success('Vendor updated successfully');
            onSave();
            onClose();
        } catch (error) {
            console.error('Error updating vendor:', error);
            toast.error('Failed to update vendor');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                                <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Edit Vendor</h2>
                            <p className="text-sm text-gray-500">Update vendor information and classifications</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left Column */}
                        <div className="space-y-8">
                            {/* Assigned Categories */}
                            <div>
                                <h3 className="text-base font-semibold text-gray-900 mb-4">Assigned Categories</h3>
                                <div className="space-y-4">
                                    <div className="flex flex-wrap gap-2">
                                        {assignedCategories.map((category, index) => (
                                            <Badge
                                                key={index}
                                                variant="secondary"
                                                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium border border-gray-200"
                                            >
                                                {category}
                                                <button
                                                    onClick={() => handleRemoveCategory(category)}
                                                    className="ml-2 hover:text-red-600 transition-colors"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                        {assignedCategories.length === 0 && (
                                            <div className="text-gray-500 text-sm italic">No categories assigned</div>
                                        )}
                                    </div>
                                    <div className="flex gap-3">
                                        <Input
                                            value={newCategory}
                                            onChange={(e) => setNewCategory(e.target.value)}
                                            placeholder="Enter category name"
                                            className="flex-1 h-10"
                                            onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                                        />
                                        <Button
                                            onClick={handleAddCategory}
                                            size="sm"
                                            className="bg-purple-600 hover:bg-purple-700 text-white h-10 px-4"
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Category
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Tags & Labels */}
                            <div>
                                <h3 className="text-base font-semibold text-gray-900 mb-4">Tags & Labels</h3>
                                <div className="space-y-4">
                                    <label className="flex items-center space-x-4 cursor-pointer group">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={tags.preferred}
                                                onChange={() => handleTagToggle('preferred')}
                                                className="sr-only"
                                            />
                                            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${tags.preferred
                                                ? 'bg-purple-600 border-purple-600 shadow-sm'
                                                : 'border-gray-300 group-hover:border-purple-400'
                                                }`}>
                                                {tags.preferred && <Check className="w-4 h-4 text-white" />}
                                            </div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Preferred Vendor</span>
                                    </label>

                                    <label className="flex items-center space-x-4 cursor-pointer group">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={tags.strategic}
                                                onChange={() => handleTagToggle('strategic')}
                                                className="sr-only"
                                            />
                                            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${tags.strategic
                                                ? 'bg-purple-600 border-purple-600 shadow-sm'
                                                : 'border-gray-300 group-hover:border-purple-400'
                                                }`}>
                                                {tags.strategic && <Check className="w-4 h-4 text-white" />}
                                            </div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Strategic Partner</span>
                                    </label>

                                    <label className="flex items-center space-x-4 cursor-pointer group">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={tags.highRisk}
                                                onChange={() => handleTagToggle('highRisk')}
                                                className="sr-only"
                                            />
                                            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${tags.highRisk
                                                ? 'bg-purple-600 border-purple-600 shadow-sm'
                                                : 'border-gray-300 group-hover:border-purple-400'
                                                }`}>
                                                {tags.highRisk && <Check className="w-4 h-4 text-white" />}
                                            </div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">High Risk</span>
                                    </label>
                                </div>
                            </div>

                            {/* Vendor Tier / Level */}
                            <div>
                                <h3 className="text-base font-semibold text-gray-900 mb-4">Vendor Tier / Level</h3>
                                <div className="relative">
                                    <select
                                        value={vendorTier}
                                        onChange={(e) => setVendorTier(e.target.value)}
                                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white pr-10"
                                    >
                                        <option value="Standard Vendor">Standard Vendor</option>
                                        <option value="Preferred Vendor">Preferred Vendor</option>
                                        <option value="Strategic Partner">Strategic Partner</option>
                                        <option value="Tier 1">Tier 1</option>
                                        <option value="Tier 2">Tier 2</option>
                                        <option value="Tier 3">Tier 3</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Quick Analytics */}
                        <div>
                            <h3 className="text-base font-semibold text-gray-900 mb-6">Quick Analytics</h3>
                            <div className="space-y-6">
                                <Card className="border border-gray-200 shadow-sm">
                                    <CardContent className="p-6">
                                        <div className="text-sm text-gray-600 mb-2">% of Spend in Assigned Categories</div>
                                        <div className="text-3xl font-bold text-gray-900">{analytics.spendPercentage}%</div>
                                    </CardContent>
                                </Card>

                                <Card className="border border-gray-200 shadow-sm">
                                    <CardContent className="p-6">
                                        <div className="text-sm text-gray-600 mb-2">Vendor Count in Assigned Categories</div>
                                        <div className="text-3xl font-bold text-gray-900">{analytics.vendorCount}</div>
                                    </CardContent>
                                </Card>

                                <Card className="border border-gray-200 shadow-sm">
                                    <CardContent className="p-6">
                                        <div className="text-sm text-gray-600 mb-2">Vs. Category Avg. Performance Score</div>
                                        <div className="text-3xl font-bold text-gray-900">{analytics.performanceScore}%</div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200 bg-gray-50">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="px-8 py-3 text-gray-700 border-gray-300 hover:bg-gray-50"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={updateVendor.isPending}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 font-medium shadow-sm"
                    >
                        {updateVendor.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EditVendorModal;
