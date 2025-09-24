import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    ArrowLeft,
    Save,
    Eye,
    Send,
    Settings,
    Users,
    Lock,
    Clock,
    Plus,
    Trash2,
    Copy,
    Move,
    RotateCw,
    ZoomIn,
    ZoomOut,
    Download,
    Upload,
    FileText,
    PenTool,
    Type,
    Calendar,
    Mail,
    User,
    Building,
    Image,
    CheckSquare,
    MessageSquare,
    Shield,
    Bell,
    Globe,
    Smartphone,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Document, Page, pdfjs } from 'react-pdf';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.3.31/build/pdf.worker.min.mjs`;

interface FieldType {
    id: string;
    type: 'signature' | 'initial' | 'name' | 'date' | 'email' | 'text' | 'checkbox' | 'company' | 'image' | 'comment';
    label: string;
    required: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
    page: number;
    assignedTo?: string;
    value?: any;
    isConfigured: boolean;
}

interface Signer {
    id: string;
    name: string;
    email: string;
    role: 'signer' | 'approver' | 'viewer' | 'witness';
    order: number;
    status: 'pending' | 'signed' | 'declined';
    signedAt?: string;
}

interface DocumentSettings {
    title: string;
    description: string;
    expiresIn: number;
    passwordProtected: boolean;
    password?: string;
    allowReassign: boolean;
    allowDecline: boolean;
    reminderFrequency: number;
    requireSMS: boolean;
    requireEmailVerification: boolean;
    allowDownload: boolean;
    allowPrint: boolean;
    watermark: boolean;
    auditTrail: boolean;
    digitalSignature: boolean;
    language: string;
}

const AdvancedPDFEditor: React.FC = () => {
    const { documentId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [activeTab, setActiveTab] = useState('editor');
    const [selectedTool, setSelectedTool] = useState<FieldType['type'] | null>(null);
    const [fields, setFields] = useState<FieldType[]>([]);
    const [signers, setSigners] = useState<Signer[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [zoom, setZoom] = useState(1);
    const [selectedField, setSelectedField] = useState<FieldType | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [documentSettings, setDocumentSettings] = useState<DocumentSettings>({
        title: 'Untitled Document',
        description: '',
        expiresIn: 30,
        passwordProtected: false,
        allowReassign: true,
        allowDecline: true,
        reminderFrequency: 3,
        requireSMS: false,
        requireEmailVerification: true,
        allowDownload: true,
        allowPrint: false,
        watermark: false,
        auditTrail: true,
        digitalSignature: false,
        language: 'en'
    });

    // Handle uploaded document from wizard
    useEffect(() => {
        const state = location.state as any;
        if (state?.selectedFiles || state?.selectedDoc) {
            const document = state.selectedDoc || state.selectedFiles?.[0];
            if (document) {
                const title = document.title || document.fileName || document.name || 'Untitled Document';
                setDocumentSettings(prev => ({
                    ...prev,
                    title: title.replace(/\.[^/.]+$/, "") // Remove file extension
                }));
            }
        }
    }, [location.state]);

    // Get PDF URL from uploaded document
    const getPDFUrl = useCallback(() => {
        const state = location.state as any;
        if (state?.selectedFiles && state.selectedFiles.length > 0) {
            const file = state.selectedFiles[0] as File;
            return URL.createObjectURL(file);
        }
        if (state?.selectedDoc && state.selectedDoc.file_path) {
            return `https://kspzfifdwfpirgqstzhz.supabase.co/storage/v1/object/public/documents/${state.selectedDoc.file_path}`;
        }
        // Fallback to a sample PDF for demo
        return "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
    }, [location.state]);

    const fieldTypes = [
        { type: 'signature', label: 'Signature', icon: PenTool, color: 'bg-blue-100 text-blue-800' },
        { type: 'initial', label: 'Initial', icon: PenTool, color: 'bg-purple-100 text-purple-800' },
        { type: 'name', label: 'Name', icon: User, color: 'bg-green-100 text-green-800' },
        { type: 'date', label: 'Date', icon: Calendar, color: 'bg-orange-100 text-orange-800' },
        { type: 'email', label: 'Email', icon: Mail, color: 'bg-red-100 text-red-800' },
        { type: 'text', label: 'Text', icon: Type, color: 'bg-yellow-100 text-yellow-800' },
        { type: 'checkbox', label: 'Checkbox', icon: CheckSquare, color: 'bg-indigo-100 text-indigo-800' },
        { type: 'company', label: 'Company', icon: Building, color: 'bg-pink-100 text-pink-800' },
        { type: 'image', label: 'Image', icon: Image, color: 'bg-teal-100 text-teal-800' },
        { type: 'comment', label: 'Comment', icon: MessageSquare, color: 'bg-gray-100 text-gray-800' }
    ];

    const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!selectedTool) return;

        const target = e.currentTarget;
        const rect = target.getBoundingClientRect();
        const x = (e.clientX - rect.left) / zoom;
        const y = (e.clientY - rect.top) / zoom;

        const newField: FieldType = {
            id: `field_${Date.now()}`,
            type: selectedTool,
            label: selectedTool.charAt(0).toUpperCase() + selectedTool.slice(1),
            required: true,
            x,
            y,
            width: selectedTool === 'signature' ? 200 : selectedTool === 'initial' ? 100 : 150,
            height: selectedTool === 'signature' ? 60 : selectedTool === 'initial' ? 30 : 40,
            page: currentPage,
            isConfigured: false
        };

        setFields(prev => [...prev, newField]);
        setSelectedField(newField);
        setSelectedTool(null);
        toast.success(`${selectedTool} field added`);
    }, [selectedTool, zoom, currentPage]);

    const handleFieldSelect = (field: FieldType) => {
        setSelectedField(field);
    };

    const handleFieldUpdate = (fieldId: string, updates: Partial<FieldType>) => {
        setFields(prev => prev.map(field =>
            field.id === fieldId ? { ...field, ...updates } : field
        ));
        if (selectedField?.id === fieldId) {
            setSelectedField(prev => prev ? { ...prev, ...updates } : null);
        }
    };

    const handleFieldDelete = (fieldId: string) => {
        setFields(prev => prev.filter(field => field.id !== fieldId));
        if (selectedField?.id === fieldId) {
            setSelectedField(null);
        }
        toast.success('Field deleted');
    };

    const handleAddSigner = () => {
        const newSigner: Signer = {
            id: `signer_${Date.now()}`,
            name: '',
            email: '',
            role: 'signer',
            order: signers.length + 1,
            status: 'pending'
        };
        setSigners(prev => [...prev, newSigner]);
    };

    const handleSignerUpdate = (signerId: string, updates: Partial<Signer>) => {
        setSigners(prev => prev.map(signer =>
            signer.id === signerId ? { ...signer, ...updates } : signer
        ));
    };

    const handleSignerDelete = (signerId: string) => {
        setSigners(prev => prev.filter(signer => signer.id !== signerId));
    };

    const handleSave = () => {
        // Save document and fields to backend
        toast.success('Document saved successfully');
    };

    const handlePreview = () => {
        setActiveTab('preview');
    };

    const handleSend = () => {
        if (signers.length === 0) {
            toast.error('Please add at least one signer');
            return;
        }
        if (fields.length === 0) {
            toast.error('Please add at least one field');
            return;
        }
        // Send document for signing
        toast.success('Document sent for signing');
    };

    const getFieldIcon = (type: FieldType['type']) => {
        const fieldType = fieldTypes.find(ft => ft.type === type);
        return fieldType ? fieldType.icon : FileText;
    };

    const getFieldColor = (type: FieldType['type']) => {
        const fieldType = fieldTypes.find(ft => ft.type === type);
        return fieldType ? fieldType.color : 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-50">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <div>
                                <h1 className="text-lg font-semibold">{documentSettings.title}</h1>
                                <p className="text-sm text-gray-500">Advanced PDF Editor</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={handlePreview}>
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleSave}>
                                <Save className="w-4 h-4 mr-2" />
                                Save
                            </Button>
                            <Button size="sm" onClick={handleSend} className="bg-violet-600 hover:bg-violet-700">
                                <Send className="w-4 h-4 mr-2" />
                                Send for Signing
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex h-[calc(100vh-80px)]">
                {/* PDF Viewer - Left Side (Like iLovePDF) */}
                <div className="flex-1 bg-gray-50 flex flex-col">
                    {/* PDF Controls */}
                    <div className="bg-white border-b px-6 py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}>
                                        ↑
                                    </Button>
                                    <span className="text-sm font-medium">{currentPage} / {totalPages}</span>
                                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}>
                                        ↓
                                    </Button>
                                </div>
                                <select className="text-sm border-none bg-transparent font-medium">
                                    <option>{documentSettings.title}</option>
                                </select>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}>
                                    <ZoomOut className="w-4 h-4" />
                                </Button>
                                <span className="text-sm font-medium">{Math.round(zoom * 100)}%</span>
                                <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(2, zoom + 0.1))}>
                                    <ZoomIn className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* PDF Display */}
                    <div className="flex-1 p-6 overflow-auto">
                        <div className="bg-white shadow-lg mx-auto relative" style={{ width: 'fit-content' }}>
                            <Document
                                file={getPDFUrl()}
                                onLoadSuccess={({ numPages }) => setTotalPages(numPages)}
                                onLoadError={(error) => console.error('PDF load error:', error)}
                                loading={<div className="p-8 text-center">Loading PDF...</div>}
                            >
                                <Page
                                    pageNumber={currentPage}
                                    scale={zoom}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                    onClick={handleCanvasClick}
                                    className={cn("cursor-pointer", selectedTool && "cursor-crosshair")}
                                />
                            </Document>

                            {/* Render fields overlay */}
                            {fields
                                .filter(field => field.page === currentPage)
                                .map((field) => (
                                    <div
                                        key={field.id}
                                        className={cn(
                                            "absolute border-2 border-dashed rounded cursor-pointer z-10 group",
                                            selectedField?.id === field.id ? "border-blue-500 bg-blue-50" : "border-gray-400 bg-white/80",
                                            getFieldColor(field.type)
                                        )}
                                        style={{
                                            left: field.x * zoom,
                                            top: field.y * zoom,
                                            width: field.width * zoom,
                                            height: field.height * zoom,
                                        }}
                                        onClick={() => handleFieldSelect(field)}
                                    >
                                        <div className="flex items-center justify-center h-full text-xs font-medium relative">
                                            {field.label}
                                            {selectedField?.id === field.id && (
                                                <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <X className="w-2 h-2 text-white" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>

                {/* Signing Options Sidebar - Right Side (Professional iLovePDF Style) */}
                <div className="w-96 bg-white border-l flex flex-col">
                    <div className="p-6 border-b">
                        <h2 className="text-lg font-semibold text-gray-900">Signing options</h2>
                    </div>

                    <div className="flex-1 p-6 space-y-6">
                        {/* Signature Type Selection */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Type</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button className="relative p-4 border-2 border-red-500 bg-red-50 rounded-lg text-left hover:bg-red-100 transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                            <PenTool className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">Simple Signature</div>
                                            <div className="text-xs text-gray-500">Quick and easy</div>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-red-600 text-sm">✓ Selected</div>
                                </button>

                                <button className="relative p-4 border-2 border-gray-200 bg-gray-50 rounded-lg text-left hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                                            <Shield className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">Digital Signature</div>
                                            <div className="text-xs text-gray-500">Advanced security</div>
                                        </div>
                                    </div>
                                    <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                        <span className="text-xs text-white font-bold">8</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Required Fields */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Required fields</h3>
                            <div className="space-y-3">
                                {fields.filter(field => field.required).map((field) => (
                                    <div key={field.id} className="bg-white border-2 border-dashed border-blue-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                    {React.createElement(getFieldIcon(field.type), { className: "w-4 h-4 text-blue-600" })}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{field.label}</div>
                                                    <div className="text-sm text-gray-500">
                                                        {field.type === 'signature' ? 'Click to sign' :
                                                            field.type === 'initial' ? 'Add initials' :
                                                                field.type === 'name' ? 'Enter name' :
                                                                    field.type === 'date' ? 'Select date' :
                                                                        field.type === 'email' ? 'Enter email' :
                                                                            'Enter text'}
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="p-1 hover:bg-gray-100 rounded">
                                                <Settings className="w-4 h-4 text-gray-400" />
                                            </button>
                                        </div>
                                        {field.value && (
                                            <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-700">
                                                {field.value}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Optional Fields */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Optional fields</h3>
                            <div className="space-y-3">
                                {fieldTypes.map((fieldType) => {
                                    const Icon = fieldType.icon;
                                    return (
                                        <div key={fieldType.type} className="bg-white border-2 border-dashed border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                                        <Icon className="w-4 h-4 text-gray-600" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{fieldType.label}</div>
                                                        <div className="text-sm text-gray-500">
                                                            {fieldType.type === 'signature' ? 'Click to sign' :
                                                                fieldType.type === 'initial' ? 'Add initials' :
                                                                    fieldType.type === 'name' ? 'Enter name' :
                                                                        fieldType.type === 'date' ? 'Select date' :
                                                                            fieldType.type === 'email' ? 'Enter email' :
                                                                                'Enter text'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    className="p-1 hover:bg-gray-100 rounded"
                                                    onClick={() => {
                                                        // Add a default field to the current page
                                                        const newField: FieldType = {
                                                            id: `field_${Date.now()}`,
                                                            type: fieldType.type as FieldType['type'],
                                                            label: fieldType.label,
                                                            required: false,
                                                            x: 100,
                                                            y: 100,
                                                            width: fieldType.type === 'signature' ? 200 : fieldType.type === 'initial' ? 100 : 150,
                                                            height: fieldType.type === 'signature' ? 60 : fieldType.type === 'initial' ? 30 : 40,
                                                            page: currentPage,
                                                            isConfigured: false
                                                        };
                                                        setFields(prev => [...prev, newField]);
                                                        setSelectedField(newField);
                                                        toast.success(`${fieldType.label} field added`);
                                                    }}
                                                >
                                                    <Plus className="w-4 h-4 text-gray-400" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Professional Signer Assignment */}
                    <div className="p-6 border-t bg-gray-50">
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-gray-700">Assign Signers</h3>

                            {/* Organization Members */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">From Organization</label>
                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                    {[
                                        { name: "John Doe", email: "john@company.com", role: "Manager" },
                                        { name: "Jane Smith", email: "jane@company.com", role: "Director" },
                                        { name: "Mike Johnson", email: "mike@company.com", role: "Employee" }
                                    ].map((member, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                                            <div>
                                                <div className="text-sm font-medium">{member.name}</div>
                                                <div className="text-xs text-gray-500">{member.email} • {member.role}</div>
                                            </div>
                                            <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                                                Assign
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* External Signers */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">External Signers</label>
                                <div className="flex space-x-2">
                                    <input
                                        type="email"
                                        placeholder="Enter email address"
                                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                                        Add
                                    </button>
                                </div>
                            </div>

                            {/* Send for Signing Button */}
                            <button
                                onClick={handleSend}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                            >
                                <Send className="w-4 h-4" />
                                <span>Send for Signing</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Field Properties Panel - Appears when field is selected */}
                {selectedField && (
                    <div className="w-80 bg-white border-l p-4">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Field Properties</h3>
                            <p className="text-sm text-gray-500">Configure the selected field</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                                <input
                                    type="text"
                                    value={selectedField.label}
                                    onChange={(e) => handleFieldUpdate(selectedField.id, { label: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="required"
                                    checked={selectedField.required}
                                    onChange={(e) => handleFieldUpdate(selectedField.id, { required: e.target.checked })}
                                    className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                                />
                                <label htmlFor="required" className="text-sm font-medium text-gray-700">
                                    Required field
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Signer</label>
                                <select
                                    value={selectedField.assignedTo || ''}
                                    onChange={(e) => handleFieldUpdate(selectedField.id, { assignedTo: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                >
                                    <option value="">Any signer</option>
                                    {signers.map(signer => (
                                        <option key={signer.id} value={signer.id}>
                                            {signer.name || signer.email}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">X Position</label>
                                    <input
                                        type="number"
                                        value={Math.round(selectedField.x)}
                                        onChange={(e) => handleFieldUpdate(selectedField.id, { x: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Y Position</label>
                                    <input
                                        type="number"
                                        value={Math.round(selectedField.y)}
                                        onChange={(e) => handleFieldUpdate(selectedField.id, { y: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
                                    <input
                                        type="number"
                                        value={Math.round(selectedField.width)}
                                        onChange={(e) => handleFieldUpdate(selectedField.id, { width: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                                    <input
                                        type="number"
                                        value={Math.round(selectedField.height)}
                                        onChange={(e) => handleFieldUpdate(selectedField.id, { height: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <button
                                    onClick={() => handleFieldDelete(selectedField.id)}
                                    className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                                >
                                    Delete Field
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdvancedPDFEditor;
