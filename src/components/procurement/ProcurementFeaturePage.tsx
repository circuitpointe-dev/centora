import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Target,
    Users,
    ShoppingCart,
    FileText,
    Plus,
    ArrowRight
} from 'lucide-react';

const ProcurementFeaturePage = () => {
    const { feature } = useParams();

    const getFeatureContent = () => {
        switch (feature) {
            case 'procurement-planning':
                return {
                    title: 'Procurement Planning',
                    description: 'Plan and strategize your procurement activities',
                    icon: Target,
                    color: 'text-blue-600',
                    bgColor: 'bg-blue-100',
                    features: [
                        'Demand Forecasting',
                        'Budget Planning',
                        'Supplier Evaluation',
                        'Risk Assessment'
                    ]
                };
            case 'vendor-management':
                return {
                    title: 'Vendor Management',
                    description: 'Manage your suppliers and vendor relationships',
                    icon: Users,
                    color: 'text-green-600',
                    bgColor: 'bg-green-100',
                    features: [
                        'Vendor Registration',
                        'Performance Tracking',
                        'Contract Management',
                        'Compliance Monitoring'
                    ]
                };
            case 'procurement-execution':
                return {
                    title: 'Procurement Execution',
                    description: 'Execute purchase orders and manage procurement processes',
                    icon: ShoppingCart,
                    color: 'text-purple-600',
                    bgColor: 'bg-purple-100',
                    features: [
                        'Purchase Orders',
                        'Requisitions',
                        'Approval Workflows',
                        'Delivery Tracking'
                    ]
                };
            case 'procurement-reports':
                return {
                    title: 'Procurement Reports',
                    description: 'Generate comprehensive procurement analytics and reports',
                    icon: FileText,
                    color: 'text-orange-600',
                    bgColor: 'bg-orange-100',
                    features: [
                        'Spend Analysis',
                        'Vendor Performance',
                        'Compliance Reports',
                        'Cost Savings'
                    ]
                };
            default:
                return {
                    title: 'Procurement Feature',
                    description: 'Manage your procurement processes',
                    icon: ShoppingCart,
                    color: 'text-gray-600',
                    bgColor: 'bg-gray-100',
                    features: ['Feature coming soon']
                };
        }
    };

    const content = getFeatureContent();
    const IconComponent = content.icon;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{content.title}</h1>
                    <p className="text-gray-600 mt-1">{content.description}</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add New
                </Button>
            </div>

            {/* Feature Overview */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 ${content.bgColor} rounded-lg flex items-center justify-center`}>
                            <IconComponent className={`h-6 w-6 ${content.color}`} />
                        </div>
                        <div>
                            <CardTitle className="text-xl">{content.title}</CardTitle>
                            <p className="text-gray-600">{content.description}</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {content.features.map((feature, index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                                <h3 className="font-medium text-gray-900 mb-2">{feature}</h3>
                                <p className="text-sm text-gray-600">Feature description coming soon</p>
                                <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto">
                                    Learn more <ArrowRight className="h-3 w-3 ml-1" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Coming Soon Notice */}
            <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="text-center py-12">
                    <div className={`w-16 h-16 ${content.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <IconComponent className={`h-8 w-8 ${content.color}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {content.title} Coming Soon
                    </h3>
                    <p className="text-gray-600 mb-4">
                        This feature is currently under development. We're working hard to bring you the best procurement management experience.
                    </p>
                    <Button variant="outline">
                        Get Notified When Available
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProcurementFeaturePage;
