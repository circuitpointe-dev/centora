import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
    ArrowLeft,
    ZoomIn,
    ZoomOut,
    PenTool,
    Settings,
    Calendar,
    Mail,
    Building,
    Type,
    User,
    ArrowUp,
    ArrowDown,
    Upload,
    Users,
    Send,
    Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Document, Page, pdfjs } from 'react-pdf';
import { useAuth } from '@/hooks/useAuth';
import { useCreateSignatureRequest } from '@/hooks/useSignatureRequests';
import { useCreateESignatureField, useESignatureFields } from '@/hooks/useESignatureFields';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.3.31/build/pdf.worker.min.mjs`;

interface SignatureField {
    id: string;
    type: 'signature' | 'date' | 'email' | 'text' | 'name';
    label: string;
    x: number;
    y: number;
    width: number;
    height: number;
    page: number;
    required: boolean;
    value?: string;
}

interface Signer {
    name: string;
    email: string;
}

const ProfessionalPDFEditor: React.FC = () => {
    const { documentId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    
    // State management
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [zoom, setZoom] = useState(1.2);
    const [selectedTool, setSelectedTool] = useState<SignatureField['type'] | null>(null);
    const [fields, setFields] = useState<SignatureField[]>([]);
    const [selectedField, setSelectedField] = useState<SignatureField | null>(null);
    const [signatureType, setSignatureType] = useState<'simple' | 'digital'>('simple');
    const [showAssignDialog, setShowAssignDialog] = useState(false);
    const [signers, setSigners] = useState<Signer[]>([]);
    const [newSigner, setNewSigner] = useState<Signer>({ name: '', email: '' });
    const [documentTitle, setDocumentTitle] = useState('Untitled Document');

    // Hooks
    const createSignatureRequest = useCreateSignatureRequest();
    const createESignatureField = useCreateESignatureField();

    // Initialize document from location state
    useEffect(() => {
        const state = location.state as any;
        if (state?.selectedFiles?.[0] || state?.selectedDoc) {
            const document = state.selectedDoc || state.selectedFiles?.[0];
            if (document) {
                const title = document.title || document.fileName || document.name || 'Untitled Document';
                setDocumentTitle(title.replace(/\.[^/.]+$/, ""));
            }
        }
    }, [location.state]);

    // Get PDF URL
    const getPDFUrl = useCallback(() => {
        const state = location.state as any;
        if (state?.selectedFiles && state.selectedFiles.length > 0) {
            const file = state.selectedFiles[0] as File;
            return URL.createObjectURL(file);
        }
        if (state?.selectedDoc?.file_path) {
            return `https://kspzfifdwfpirgqstzhz.supabase.co/storage/v1/object/public/documents/${state.selectedDoc.file_path}`;
        }
        return "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
    }, [location.state]);

    // Field types configuration
    const fieldTypes = [
        { type: 'signature' as const, label: 'Signature', icon: PenTool, color: 'bg-red-50 border-red-200 text-red-800' },
        { type: 'date' as const, label: 'Date', icon: Calendar, color: 'bg-blue-50 border-blue-200 text-blue-800' },
        { type: 'email' as const, label: 'Email', icon: Mail, color: 'bg-green-50 border-green-200 text-green-800' },
        { type: 'text' as const, label: 'Company', icon: Building, color: 'bg-purple-50 border-purple-200 text-purple-800' },
        { type: 'name' as const, label: 'Name', icon: User, color: 'bg-orange-50 border-orange-200 text-orange-800' },
    ];

    // Handle canvas click to add fields
    const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!selectedTool) return;

        const target = e.currentTarget;
        const rect = target.getBoundingClientRect();
        const x = (e.clientX - rect.left) / zoom;
        const y = (e.clientY - rect.top) / zoom;

        const newField: SignatureField = {
            id: `field_${Date.now()}`,
            type: selectedTool,
            label: selectedTool.charAt(0).toUpperCase() + selectedTool.slice(1),
            x,
            y,
            width: selectedTool === 'signature' ? 200 : selectedTool === 'name' ? 100 : 150,
            height: selectedTool === 'signature' ? 60 : selectedTool === 'name' ? 30 : 40,
            page: currentPage,
            required: selectedTool === 'signature',
        };

        setFields(prev => [...prev, newField]);
        setSelectedField(newField);
        setSelectedTool(null);
        toast.success(`${selectedTool} field added`);
    }, [selectedTool, zoom, currentPage]);

    // Handle field selection
    const handleFieldSelect = (field: SignatureField) => {
        setSelectedField(field);
    };

    // Handle field deletion
    const handleFieldDelete = (fieldId: string) => {
        setFields(prev => prev.filter(field => field.id !== fieldId));
        if (selectedField?.id === fieldId) {
            setSelectedField(null);
        }
        toast.success('Field deleted');
    };

    // Add signer
    const handleAddSigner = () => {
        if (!newSigner.name || !newSigner.email) {
            toast.error('Please enter both name and email');
            return;
        }
        setSigners(prev => [...prev, newSigner]);
        setNewSigner({ name: '', email: '' });
        toast.success('Signer added');
    };

    // Remove signer
    const handleRemoveSigner = (index: number) => {
        setSigners(prev => prev.filter((_, i) => i !== index));
    };

    // Send for signing
    const handleSendForSigning = async () => {
        if (fields.length === 0) {
            toast.error('Please add at least one signature field');
            return;
        }
        if (signers.length === 0) {
            toast.error('Please add at least one signer');
            return;
        }

        try {
            // For each signer, create a signature request
            for (const signer of signers) {
                const state = location.state as any;
                const documentId = state?.selectedDoc?.id || `temp_${Date.now()}`;
                
                await createSignatureRequest.mutateAsync({
                    document_id: documentId,
                    signer_name: signer.name,
                    signer_email: signer.email,
                    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
                });
            }

            // Save e-signature fields
            for (const field of fields) {
                await createESignatureField.mutateAsync({
                    document_id: location.state?.selectedDoc?.id || `temp_${Date.now()}`,
                    field_type: field.type,
                    field_label: field.label,
                    position_x: field.x,
                    position_y: field.y,
                    width: field.width,
                    height: field.height,
                    page_number: field.page,
                    is_required: field.required,
                });
            }

            toast.success('Document sent for signing successfully!');
            navigate('/dashboard/documents/pdf-signing-platform');
        } catch (error) {
            console.error('Failed to send document:', error);
            toast.error('Failed to send document for signing');
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header - Simplified like ilovePDF */}
            <div className="bg-card border-b border-border">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <div className="flex items-center space-x-2">
                                <ArrowUp className="w-4 h-4 text-muted-foreground" />
                                <ArrowDown className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm font-medium">{currentPage} / {totalPages}</span>
                            </div>
                            <select 
                                className="text-sm bg-transparent border-none font-medium focus:outline-none"
                                value={documentTitle}
                                onChange={(e) => setDocumentTitle(e.target.value)}
                            >
                                <option>{documentTitle}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex h-[calc(100vh-80px)]">
                {/* Left Sidebar - PDF Thumbnails (ilovePDF Style) */}
                <div className="w-60 bg-card border-r border-border">
                    <div className="p-4">
                        <h3 className="text-sm font-medium text-foreground mb-3">Pages</h3>
                        <div className="space-y-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <div
                                    key={pageNum}
                                    className={cn(
                                        "relative border-2 rounded cursor-pointer transition-colors p-2",
                                        currentPage === pageNum 
                                            ? "border-brand-purple bg-brand-purple/10" 
                                            : "border-border hover:border-brand-purple/50"
                                    )}
                                    onClick={() => setCurrentPage(pageNum)}
                                >
                                    <div className="aspect-[3/4] bg-muted rounded flex items-center justify-center">
                                        <span className="text-xs text-muted-foreground">{pageNum}</span>
                                    </div>
                                    <div className="text-center mt-1">
                                        <span className="text-xs font-medium">{pageNum}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main PDF Viewer */}
                <div className="flex-1 bg-muted/30 flex flex-col">
                    {/* PDF Controls */}
                    <div className="bg-card border-b border-border px-6 py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        <ArrowUp className="w-4 h-4" />
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        <ArrowDown className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                                >
                                    <ZoomOut className="w-4 h-4" />
                                </Button>
                                <span className="text-sm font-medium min-w-[60px] text-center">
                                    {Math.round(zoom * 100)}%
                                </span>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                                >
                                    <ZoomIn className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* PDF Display */}
                    <div className="flex-1 p-6 overflow-auto">
                        <div className="bg-card shadow-lg mx-auto relative rounded-sm" style={{ width: 'fit-content' }}>
                            <Document
                                file={getPDFUrl()}
                                onLoadSuccess={({ numPages }) => setTotalPages(numPages)}
                                onLoadError={(error) => console.error('PDF load error:', error)}
                                loading={<div className="p-8 text-center text-muted-foreground">Loading PDF...</div>}
                            >
                                <div 
                                    className={cn(
                                        "relative",
                                        selectedTool && "cursor-crosshair"
                                    )}
                                    onClick={handleCanvasClick}
                                >
                                    <Page
                                        pageNumber={currentPage}
                                        scale={zoom}
                                        renderTextLayer={false}
                                        renderAnnotationLayer={false}
                                    />

                                    {/* Render signature fields overlay */}
                                    {fields
                                        .filter(field => field.page === currentPage)
                                        .map((field) => {
                                            const fieldType = fieldTypes.find(ft => ft.type === field.type);
                                            const Icon = fieldType?.icon || PenTool;
                                            
                                            return (
                                                <div
                                                    key={field.id}
                                                    className={cn(
                                                        "absolute border-2 border-dashed rounded cursor-pointer group transition-colors",
                                                        selectedField?.id === field.id 
                                                            ? "border-brand-purple bg-brand-purple/10" 
                                                            : fieldType?.color || "bg-gray-50 border-gray-300",
                                                        "hover:border-brand-purple"
                                                    )}
                                                    style={{
                                                        left: field.x * zoom,
                                                        top: field.y * zoom,
                                                        width: field.width * zoom,
                                                        height: field.height * zoom,
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleFieldSelect(field);
                                                    }}
                                                >
                                                    <div className="flex items-center justify-center h-full text-xs font-medium relative">
                                                        <Icon className="w-3 h-3 mr-1" />
                                                        {field.label}
                                                        {selectedField?.id === field.id && (
                                                            <button
                                                                className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleFieldDelete(field.id);
                                                                }}
                                                            >
                                                                ×
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </Document>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Signing Options (ilovePDF Style) */}
                <div className="w-80 bg-card border-l border-border flex flex-col">
                    <div className="p-6 border-b border-border">
                        <h2 className="text-lg font-semibold text-foreground">Signing options</h2>
                    </div>

                    <div className="flex-1 p-6 space-y-6 overflow-auto">
                        {/* Signature Type Selection */}
                        <div>
                            <h3 className="text-sm font-medium text-foreground mb-3">Type</h3>
                            <div className="grid grid-cols-1 gap-3">
                                <button 
                                    className={cn(
                                        "relative p-4 border-2 rounded-lg text-left transition-colors",
                                        signatureType === 'simple' 
                                            ? "border-red-500 bg-red-50" 
                                            : "border-border bg-muted hover:border-red-300"
                                    )}
                                    onClick={() => setSignatureType('simple')}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center",
                                            signatureType === 'simple' ? "bg-red-500" : "bg-muted-foreground"
                                        )}>
                                            <PenTool className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-foreground">Simple Signature</div>
                                            <div className="text-xs text-muted-foreground">Quick and easy</div>
                                        </div>
                                    </div>
                                    {signatureType === 'simple' && (
                                        <div className="mt-2 text-red-600 text-sm font-medium">✓ Selected</div>
                                    )}
                                </button>

                                <button 
                                    className={cn(
                                        "relative p-4 border-2 rounded-lg text-left transition-colors",
                                        signatureType === 'digital' 
                                            ? "border-blue-500 bg-blue-50" 
                                            : "border-border bg-muted hover:border-blue-300"
                                    )}
                                    onClick={() => setSignatureType('digital')}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center",
                                            signatureType === 'digital' ? "bg-blue-500" : "bg-muted-foreground"
                                        )}>
                                            <Settings className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-foreground">Digital Signature</div>
                                            <div className="text-xs text-muted-foreground">Secure & certified</div>
                                        </div>
                                    </div>
                                    {signatureType === 'digital' && (
                                        <div className="mt-2 text-blue-600 text-sm font-medium">✓ Selected</div>
                                    )}
                                </button>
                            </div>
                        </div>

                        <Separator />

                        {/* Field Tools */}
                        <div>
                            <h3 className="text-sm font-medium text-foreground mb-3">Add Fields</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {fieldTypes.map((fieldType) => {
                                    const Icon = fieldType.icon;
                                    return (
                                        <button
                                            key={fieldType.type}
                                            className={cn(
                                                "flex items-center space-x-2 p-3 rounded-lg border-2 transition-colors",
                                                selectedTool === fieldType.type
                                                    ? "border-brand-purple bg-brand-purple/10"
                                                    : "border-border bg-muted hover:border-brand-purple/50"
                                            )}
                                            onClick={() => setSelectedTool(fieldType.type === selectedTool ? null : fieldType.type)}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span className="text-xs font-medium">{fieldType.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                            {selectedTool && (
                                <p className="text-xs text-muted-foreground mt-2">
                                    Click on the PDF to place a {selectedTool} field
                                </p>
                            )}
                        </div>

                        <Separator />

                        {/* Signers Management */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-medium text-foreground">Signers</h3>
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setShowAssignDialog(true)}
                                >
                                    <Users className="w-4 h-4 mr-1" />
                                    Assign
                                </Button>
                            </div>
                            
                            {signers.length > 0 && (
                                <div className="space-y-2 mb-3">
                                    {signers.map((signer, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                                            <div>
                                                <div className="text-sm font-medium">{signer.name}</div>
                                                <div className="text-xs text-muted-foreground">{signer.email}</div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveSigner(index)}
                                            >
                                                ×
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Input
                                    placeholder="Signer name"
                                    value={newSigner.name}
                                    onChange={(e) => setNewSigner(prev => ({ ...prev, name: e.target.value }))}
                                />
                                <Input
                                    type="email"
                                    placeholder="Signer email"
                                    value={newSigner.email}
                                    onChange={(e) => setNewSigner(prev => ({ ...prev, email: e.target.value }))}
                                />
                                <Button 
                                    onClick={handleAddSigner}
                                    className="w-full"
                                    variant="outline"
                                    size="sm"
                                >
                                    Add Signer
                                </Button>
                            </div>
                        </div>

                        <Separator />

                        {/* Fields List */}
                        {fields.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-foreground mb-3">Added Fields</h3>
                                <div className="space-y-2">
                                    {fields.map((field) => {
                                        const fieldType = fieldTypes.find(ft => ft.type === field.type);
                                        const Icon = fieldType?.icon || PenTool;
                                        
                                        return (
                                            <div 
                                                key={field.id}
                                                className={cn(
                                                    "flex items-center justify-between p-2 rounded cursor-pointer transition-colors",
                                                    selectedField?.id === field.id 
                                                        ? "bg-brand-purple/10 border border-brand-purple" 
                                                        : "bg-muted hover:bg-muted/80"
                                                )}
                                                onClick={() => handleFieldSelect(field)}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <Icon className="w-4 h-4" />
                                                    <span className="text-sm">{field.label}</span>
                                                    {field.required && (
                                                        <Badge variant="secondary" className="text-xs">Required</Badge>
                                                    )}
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleFieldDelete(field.id);
                                                    }}
                                                >
                                                    ×
                                                </Button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sign Button - Fixed at bottom like ilovePDF */}
                    <div className="p-6 border-t border-border">
                        <Button
                            onClick={handleSendForSigning}
                            className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium py-3 rounded-lg"
                            disabled={fields.length === 0 || signers.length === 0}
                        >
                            <Send className="w-4 h-4 mr-2" />
                            Send for Signing
                        </Button>
                    </div>
                </div>
            </div>

            {/* Assign Dialog */}
            <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Assign Signers</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="signer-name">Full Name</Label>
                            <Input
                                id="signer-name"
                                placeholder="Enter signer's full name"
                                value={newSigner.name}
                                onChange={(e) => setNewSigner(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>
                        <div>
                            <Label htmlFor="signer-email">Email Address</Label>
                            <Input
                                id="signer-email"
                                type="email"
                                placeholder="Enter signer's email"
                                value={newSigner.email}
                                onChange={(e) => setNewSigner(prev => ({ ...prev, email: e.target.value }))}
                            />
                        </div>
                        <Button 
                            onClick={() => {
                                handleAddSigner();
                                setShowAssignDialog(false);
                            }}
                            className="w-full"
                        >
                            Add Signer
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProfessionalPDFEditor;