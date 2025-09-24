import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
    Upload,
    FileText,
    Users,
    Shield,
    Clock,
    CheckCircle,
    AlertCircle,
    Plus,
    Settings,
    Download,
    Eye,
    Edit,
    Trash2,
    Share2,
    Lock,
    Unlock,
    Star,
    History,
    BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Document {
    id: string;
    title: string;
    status: 'draft' | 'pending' | 'in_progress' | 'completed' | 'expired';
    signers: number;
    totalSigners: number;
    createdAt: string;
    updatedAt: string;
    priority: 'low' | 'medium' | 'high';
    isTemplate: boolean;
    isSecure: boolean;
    expiresAt?: string;
}

interface RecentActivity {
    id: string;
    type: 'signed' | 'viewed' | 'commented' | 'uploaded';
    document: string;
    user: string;
    timestamp: string;
    avatar?: string;
}

const PDFSigningPlatform: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [uploadedDocument, setUploadedDocument] = useState<any>(null);

    // Check if user came from upload wizard with a document
    useEffect(() => {
        const state = location.state as any;
        if (state?.selectedFiles || state?.selectedDoc) {
            setUploadedDocument(state);
            // Auto-redirect to editor with the uploaded document
            const documentId = state?.selectedDoc?.id || `temp_${Date.now()}`;
            navigate(`/dashboard/documents/pdf-signing-platform/editor/${documentId}`, {
                state: state,
                replace: true
            });
        }
    }, [location.state, navigate]);

    // Mock data - replace with real data from your backend
    const documents: Document[] = [
        {
            id: '1',
            title: 'Employment Contract - John Doe',
            status: 'in_progress',
            signers: 2,
            totalSigners: 3,
            createdAt: '2024-01-15',
            updatedAt: '2024-01-16',
            priority: 'high',
            isTemplate: false,
            isSecure: true,
            expiresAt: '2024-02-15'
        },
        {
            id: '2',
            title: 'NDA Template',
            status: 'completed',
            signers: 1,
            totalSigners: 1,
            createdAt: '2024-01-10',
            updatedAt: '2024-01-12',
            priority: 'medium',
            isTemplate: true,
            isSecure: false
        },
        {
            id: '3',
            title: 'Service Agreement - ABC Corp',
            status: 'pending',
            signers: 0,
            totalSigners: 2,
            createdAt: '2024-01-14',
            updatedAt: '2024-01-14',
            priority: 'low',
            isTemplate: false,
            isSecure: true,
            expiresAt: '2024-02-14'
        }
    ];

    const recentActivity: RecentActivity[] = [
        {
            id: '1',
            type: 'signed',
            document: 'Employment Contract - John Doe',
            user: 'John Doe',
            timestamp: '2 hours ago'
        },
        {
            id: '2',
            type: 'viewed',
            document: 'Service Agreement - ABC Corp',
            user: 'Jane Smith',
            timestamp: '4 hours ago'
        },
        {
            id: '3',
            type: 'uploaded',
            document: 'New Contract Template',
            user: 'You',
            timestamp: '1 day ago'
        }
    ];

    const getStatusColor = (status: Document['status']) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'in_progress': return 'bg-blue-100 text-blue-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'expired': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority: Document['priority']) => {
        switch (priority) {
            case 'high': return 'text-red-600';
            case 'medium': return 'text-yellow-600';
            case 'low': return 'text-green-600';
            default: return 'text-gray-600';
        }
    };

    const getActivityIcon = (type: RecentActivity['type']) => {
        switch (type) {
            case 'signed': return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'viewed': return <Eye className="w-4 h-4 text-blue-600" />;
            case 'commented': return <Edit className="w-4 h-4 text-purple-600" />;
            case 'uploaded': return <Upload className="w-4 h-4 text-orange-600" />;
            default: return <FileText className="w-4 h-4 text-gray-600" />;
        }
    };

    const handleCreateNew = () => {
        navigate('/dashboard/documents/request-signature');
    };

    const handleCreateTemplate = () => {
        navigate('/dashboard/documents/pdf-signing-platform/template-builder');
    };

    const handleDocumentAction = (documentId: string, action: string) => {
        switch (action) {
            case 'edit':
                navigate(`/dashboard/documents/pdf-signing-platform/editor/${documentId}`);
                break;
            case 'view':
                navigate(`/dashboard/documents/pdf-signing-platform/viewer/${documentId}`);
                break;
            case 'share':
                navigate(`/dashboard/documents/pdf-signing-platform/share/${documentId}`);
                break;
            case 'delete':
                // Implement delete logic
                break;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-bold text-gray-900">PDF Signing Platform</h1>
                            <Badge variant="secondary" className="bg-violet-100 text-violet-800">
                                Professional Edition
                            </Badge>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Button variant="outline" size="sm">
                                <Settings className="w-4 h-4 mr-2" />
                                Settings
                            </Button>
                            <Button onClick={handleCreateNew} className="bg-violet-600 hover:bg-violet-700">
                                <Plus className="w-4 h-4 mr-2" />
                                New Document
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-6">
                        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                        <TabsTrigger value="documents">Documents</TabsTrigger>
                        <TabsTrigger value="templates">Templates</TabsTrigger>
                        <TabsTrigger value="signatures">My Signatures</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    {/* Dashboard Tab */}
                    <TabsContent value="dashboard" className="space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">24</div>
                                    <p className="text-xs text-muted-foreground">+2 from last month</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Pending Signatures</CardTitle>
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">8</div>
                                    <p className="text-xs text-muted-foreground">3 urgent</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Completed</CardTitle>
                                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">156</div>
                                    <p className="text-xs text-muted-foreground">+12 this week</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Templates</CardTitle>
                                    <Star className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">12</div>
                                    <p className="text-xs text-muted-foreground">3 shared</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                                <CardDescription>Get started with common tasks</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Button
                                        variant="outline"
                                        className="h-20 flex flex-col items-center justify-center space-y-2"
                                        onClick={handleCreateNew}
                                    >
                                        <Upload className="w-6 h-6" />
                                        <span>Upload & Sign</span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="h-20 flex flex-col items-center justify-center space-y-2"
                                        onClick={handleCreateTemplate}
                                    >
                                        <FileText className="w-6 h-6" />
                                        <span>Create Template</span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="h-20 flex flex-col items-center justify-center space-y-2"
                                        onClick={() => navigate('/dashboard/documents/pdf-signing-platform/signatures')}
                                    >
                                        <Edit className="w-6 h-6" />
                                        <span>Manage Signatures</span>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Activity</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {recentActivity.map((activity) => (
                                            <div key={activity.id} className="flex items-center space-x-3">
                                                {getActivityIcon(activity.type)}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {activity.user} {activity.type} {activity.document}
                                                    </p>
                                                    <p className="text-sm text-gray-500">{activity.timestamp}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Pending Actions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <AlertCircle className="w-5 h-5 text-yellow-600" />
                                                <div>
                                                    <p className="text-sm font-medium">Employment Contract</p>
                                                    <p className="text-xs text-gray-500">Waiting for your signature</p>
                                                </div>
                                            </div>
                                            <Button size="sm" variant="outline">Sign Now</Button>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <Clock className="w-5 h-5 text-blue-600" />
                                                <div>
                                                    <p className="text-sm font-medium">Service Agreement</p>
                                                    <p className="text-xs text-gray-500">2 signers pending</p>
                                                </div>
                                            </div>
                                            <Button size="sm" variant="outline">View</Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Documents Tab */}
                    <TabsContent value="documents" className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">All Documents</h2>
                            <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm">
                                    <Download className="w-4 h-4 mr-2" />
                                    Export
                                </Button>
                                <Button onClick={handleCreateNew} size="sm">
                                    <Plus className="w-4 h-4 mr-2" />
                                    New Document
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            {documents.map((doc) => (
                                <Card key={doc.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-shrink-0">
                                                    <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                                                        <FileText className="w-5 h-5 text-violet-600" />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-2">
                                                        <h3 className="text-sm font-medium text-gray-900 truncate">
                                                            {doc.title}
                                                        </h3>
                                                        {doc.isTemplate && (
                                                            <Badge variant="secondary" className="text-xs">Template</Badge>
                                                        )}
                                                        {doc.isSecure && (
                                                            <Lock className="w-4 h-4 text-green-600" />
                                                        )}
                                                    </div>
                                                    <div className="flex items-center space-x-4 mt-1">
                                                        <Badge className={cn("text-xs", getStatusColor(doc.status))}>
                                                            {doc.status.replace('_', ' ')}
                                                        </Badge>
                                                        <span className="text-xs text-gray-500">
                                                            {doc.signers}/{doc.totalSigners} signers
                                                        </span>
                                                        <span className={cn("text-xs", getPriorityColor(doc.priority))}>
                                                            {doc.priority} priority
                                                        </span>
                                                        {doc.expiresAt && (
                                                            <span className="text-xs text-orange-600">
                                                                Expires {new Date(doc.expiresAt).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDocumentAction(doc.id, 'view')}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDocumentAction(doc.id, 'edit')}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDocumentAction(doc.id, 'share')}
                                                >
                                                    <Share2 className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDocumentAction(doc.id, 'delete')}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Other tabs content would go here */}
                    <TabsContent value="templates">
                        <Card>
                            <CardHeader>
                                <CardTitle>Templates</CardTitle>
                                <CardDescription>Manage your document templates</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-500">Template management coming soon...</p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="signatures">
                        <Card>
                            <CardHeader>
                                <CardTitle>My Signatures</CardTitle>
                                <CardDescription>Manage your signature styles</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-500">Signature management coming soon...</p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="analytics">
                        <Card>
                            <CardHeader>
                                <CardTitle>Analytics</CardTitle>
                                <CardDescription>View your signing activity and performance</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-500">Analytics dashboard coming soon...</p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="settings">
                        <Card>
                            <CardHeader>
                                <CardTitle>Settings</CardTitle>
                                <CardDescription>Configure your PDF signing preferences</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-500">Settings panel coming soon...</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default PDFSigningPlatform;
