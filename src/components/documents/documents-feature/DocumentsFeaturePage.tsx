
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter } from 'lucide-react';

const DocumentsFeaturePage = () => {
    const [searchParams] = useSearchParams();
    const docType = searchParams.get('type');

    const getTitle = () => {
        if (!docType || docType === 'all') return 'All Documents';
        return docType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + ' Documents';
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{getTitle()}</h1>
                    <p className="text-gray-600 mt-2">Manage your documents efficiently.</p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline" className="flex items-center space-x-2">
                        <Search className="h-4 w-4" />
                        <span>Search</span>
                    </Button>
                    <Button variant="outline" className="flex items-center space-x-2">
                        <Filter className="h-4 w-4" />
                        <span>Filter</span>
                    </Button>
                    <Button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        <Plus className="h-4 w-4" />
                        <span>Add New Document</span>
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Documents List</CardTitle>
                    <CardDescription>
                        Displaying: {getTitle()}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-lg">
                        <p className="text-gray-500">Document list will appear here.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DocumentsFeaturePage;
