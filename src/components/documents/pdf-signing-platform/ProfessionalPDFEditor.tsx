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
    Download,
    Save,
    Check,
    X
} from 'lucide-react';
import ProfessionalSignatureCapture from './ProfessionalSignatureCapture';
import SignatureDetailsModal from './SignatureDetailsModal';
import FieldInputModal from './FieldInputModal';
import ProfessionalFieldsSidebar from './ProfessionalFieldsSidebar';
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
    type: 'signature' | 'initials' | 'name' | 'date' | 'text' | 'stamp';
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
    const [selectedTool, setSelectedTool] = useState<'signature' | 'initials' | 'name' | 'date' | 'text' | 'stamp' | null>(null);
    const [fields, setFields] = useState<SignatureField[]>([]);
    const [selectedField, setSelectedField] = useState<SignatureField | null>(null);
    const [signatureType, setSignatureType] = useState<'simple' | 'digital'>('simple');
    const [showAssignDialog, setShowAssignDialog] = useState(false);
    const [signers, setSigners] = useState<Signer[]>([]);
    const [newSigner, setNewSigner] = useState<Signer>({ name: '', email: '' });
    const [documentTitle, setDocumentTitle] = useState('Untitled Document');
    const [showSignatureDetailsModal, setShowSignatureDetailsModal] = useState(false);
    const [activeSignatureField, setActiveSignatureField] = useState<SignatureField | null>(null);
    const [isSigningMode, setIsSigningMode] = useState(false);
    const [currentUserSignature, setCurrentUserSignature] = useState<any>(null);
    const [userSignatureData, setUserSignatureData] = useState<any>(null);
    const [showFieldInputModal, setShowFieldInputModal] = useState(false);
    const [activeInputField, setActiveInputField] = useState<SignatureField | null>(null);
    const [pdfLoadError, setPdfLoadError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [draggedField, setDraggedField] = useState<SignatureField | null>(null);

    // Hooks
    const createSignatureRequest = useCreateSignatureRequest();
    const createESignatureField = useCreateESignatureField();
    const { data: existingFields } = useESignatureFields(documentId || '');

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

    // Get PDF URL with better error handling
    const getPDFUrl = useCallback(() => {
        const state = location.state as any;
        
        // Handle uploaded files
        if (state?.selectedFiles && state.selectedFiles.length > 0) {
            const file = state.selectedFiles[0] as File;
            if (file.type === 'application/pdf') {
                return URL.createObjectURL(file);
            } else {
                setPdfLoadError('Please upload a valid PDF file');
                return null;
            }
        }
        
        // Handle database documents
        if (state?.selectedDoc) {
            const doc = state.selectedDoc;
            if (doc.file_path) {
                // Construct proper Supabase URL
                const baseUrl = 'https://kspzfifdwfpirgqstzhz.supabase.co/storage/v1/object/public/documents/';
                const fullUrl = doc.file_path.startsWith('http') ? doc.file_path : baseUrl + doc.file_path;
                return fullUrl;
            } else if (doc.content || doc.file_url) {
                return doc.content || doc.file_url;
            }
        }
        
        // If no document is provided, show error
        setPdfLoadError('No PDF document provided. Please select a document to continue.');
        return null;
    }, [location.state]);

    // Initialize sidebar fields
    const [sidebarFields, setSidebarFields] = useState<SignatureField[]>([
        { id: 'req-sig-1', type: 'signature', label: 'Signature', x: 0, y: 0, width: 200, height: 60, page: 1, required: true },
        { id: 'opt-init-1', type: 'initials', label: 'Initials', x: 0, y: 0, width: 100, height: 40, page: 1, required: false },
        { id: 'opt-name-1', type: 'name', label: 'Name', x: 0, y: 0, width: 150, height: 32, page: 1, required: false },
        { id: 'opt-date-1', type: 'date', label: 'Date', x: 0, y: 0, width: 120, height: 32, page: 1, required: false },
        { id: 'opt-text-1', type: 'text', label: 'Text', x: 0, y: 0, width: 150, height: 32, page: 1, required: false },
        { id: 'opt-stamp-1', type: 'stamp', label: 'Company Stamp', x: 0, y: 0, width: 120, height: 80, page: 1, required: false }
    ]);

    // Field types configuration
    const fieldTypes = [
        { type: 'signature' as const, label: 'Signature', icon: PenTool, color: 'bg-red-50 border-red-200 text-red-800' },
        { type: 'initials' as const, label: 'Initials', icon: Type, color: 'bg-blue-50 border-blue-200 text-blue-800' },
        { type: 'name' as const, label: 'Name', icon: User, color: 'bg-orange-50 border-orange-200 text-orange-800' },
        { type: 'date' as const, label: 'Date', icon: Calendar, color: 'bg-blue-50 border-blue-200 text-blue-800' },
        { type: 'text' as const, label: 'Text', icon: Building, color: 'bg-purple-50 border-purple-200 text-purple-800' },
    ];

    // Handle canvas click to add fields
    const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!selectedTool || isSigningMode) return;

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
            width: selectedTool === 'signature' ? 200 : selectedTool === 'stamp' ? 120 : selectedTool === 'name' ? 100 : 150,
            height: selectedTool === 'signature' ? 60 : selectedTool === 'stamp' ? 80 : selectedTool === 'name' ? 30 : 40,
            page: currentPage,
            required: selectedTool === 'signature',
        };

        setFields(prev => [...prev, newField]);
        setSelectedField(newField);
        setSelectedTool(null);
        toast.success(`${selectedTool} field added`);
    }, [selectedTool, zoom, currentPage, isSigningMode]);

    // Handle field drag start
    const handleFieldDragStart = (field: SignatureField) => {
        setDraggedField(field);
    };

    // Handle field drag
    const handleFieldDrag = useCallback((fieldId: string, deltaX: number, deltaY: number) => {
        setFields(prev => prev.map(field => 
            field.id === fieldId 
                ? { 
                    ...field, 
                    x: Math.max(0, field.x + deltaX / zoom), 
                    y: Math.max(0, field.y + deltaY / zoom) 
                }
                : field
        ));
    }, [zoom]);

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

    // Handle field click for signing
    const handleFieldClick = (field: SignatureField) => {
        if (field.type === 'signature') {
            setActiveSignatureField(field);
            setShowSignatureDetailsModal(true);
        } else {
            // Handle other field types with modal instead of prompt
            setActiveInputField(field);
            setShowFieldInputModal(true);
        }
    };

    // Handle field input save
    const handleFieldInputSave = (value: string) => {
        if (activeInputField) {
            setFields(prev => prev.map(f => 
                f.id === activeInputField.id ? { ...f, value } : f
            ));
            setSidebarFields(prev => prev.map(f => 
                f.id === activeInputField.id ? { ...f, value } : f
            ));
            setActiveInputField(null);
        }
    };

    // Handle sidebar field edit
    const handleSidebarFieldEdit = (field: SignatureField) => {
        if (field.type === 'signature' || field.type === 'initials') {
            setActiveSignatureField(field);
            setShowSignatureDetailsModal(true);
        } else {
            setActiveInputField(field);
            setShowFieldInputModal(true);
        }
    };

    // Handle sidebar field drag start
    const handleSidebarFieldDragStart = (field: SignatureField) => {
        setSelectedTool(field.type);
    };

    // Handle sidebar sign action
    const handleSidebarSign = () => {
        if (sidebarFields.every(f => !f.required || f.value)) {
            handleSaveDocument();
        } else {
            toast.error('Please complete all required fields before signing');
        }
    };

    // Handle signature details apply
    const handleSignatureDetailsApply = (signatureData: any) => {
        if (activeSignatureField) {
            setUserSignatureData(signatureData);
            const signatureValue = signatureData.selectedSignature;
            
            setFields(prev => prev.map(f => 
                f.id === activeSignatureField.id 
                    ? { ...f, value: signatureValue } 
                    : f
            ));
            setSidebarFields(prev => prev.map(f => 
                f.id === activeSignatureField.id 
                    ? { ...f, value: signatureValue } 
                    : f
            ));
            setShowSignatureDetailsModal(false);
            setActiveSignatureField(null);
            toast.success('Signature applied successfully!');
        }
    };

    // Save document with signatures
    const handleSaveDocument = async () => {
        try {
            // Here you would implement saving the signed document
            // This could involve generating a new PDF with the signatures
            toast.success('Document saved successfully!');
        } catch (error) {
            console.error('Error saving document:', error);
            toast.error('Failed to save document');
        }
    };

    // Toggle signing mode
    const toggleSigningMode = () => {
        setIsSigningMode(!isSigningMode);
        setSelectedTool(null);
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
                // Map new field types to existing ones for backend compatibility
                let mappedFieldType: 'signature' | 'name' | 'date' | 'email' | 'text' = 'text';
                switch (field.type) {
                    case 'signature':
                        mappedFieldType = 'signature';
                        break;
                    case 'name':
                        mappedFieldType = 'name';
                        break;
                    case 'date':
                        mappedFieldType = 'date';
                        break;
                    case 'initials':
                        mappedFieldType = 'text'; // Map initials to text type
                        break;
                    case 'text':
                        mappedFieldType = 'text';
                        break;
                    case 'stamp':
                        mappedFieldType = 'text'; // Map stamp to text type
                        break;
                    default:
                        mappedFieldType = 'text';
                }
                
                await createESignatureField.mutateAsync({
                    document_id: location.state?.selectedDoc?.id || `temp_${Date.now()}`,
                    field_type: mappedFieldType,
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
                        <div className="flex items-center space-x-3">
                            <Button 
                                variant={isSigningMode ? "default" : "outline"}
                                size="sm"
                                onClick={toggleSigningMode}
                                className={cn(
                                    isSigningMode 
                                        ? "bg-green-600 hover:bg-green-700 text-white" 
                                        : "border-green-600 text-green-600 hover:bg-green-50"
                                )}
                            >
                                <PenTool className="w-4 h-4 mr-2" />
                                {isSigningMode ? 'Sign Mode' : 'Edit Mode'}
                            </Button>
                            {isSigningMode && (
                                <div className="flex items-center space-x-2">
                                    <Button variant="outline" size="sm" onClick={handleSaveDocument}>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Download className="w-4 h-4 mr-2" />
                                        Download
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex h-[calc(100vh-80px)]">
                {/* Professional Fields Sidebar */}
                <ProfessionalFieldsSidebar
                    fields={sidebarFields}
                    onFieldEdit={handleSidebarFieldEdit}
                    onFieldDragStart={handleSidebarFieldDragStart}
                    onSign={handleSidebarSign}
                    isSigningMode={isSigningMode}
                />

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
                        {pdfLoadError ? (
                            <div className="flex items-center justify-center h-[500px]">
                                <Card className="p-8 max-w-md text-center">
                                    <div className="text-destructive mb-4">
                                        <X className="w-12 h-12 mx-auto mb-4" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">Failed to load PDF</h3>
                                    <p className="text-muted-foreground mb-4">{pdfLoadError}</p>
                                    <div className="space-y-2">
                                        <Button 
                                            variant="outline" 
                                            onClick={() => {
                                                setPdfLoadError(null);
                                                setIsLoading(true);
                                            }}
                                        >
                                            Try Again
                                        </Button>
                                        <Button 
                                            variant="secondary" 
                                            onClick={() => navigate('/dashboard/documents')}
                                        >
                                            Select Another Document
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        ) : (
                            <div className="bg-card shadow-lg mx-auto relative rounded-sm" style={{ width: 'fit-content' }}>
                                <Document
                                    file={getPDFUrl()}
                                    onLoadSuccess={({ numPages }) => {
                                        setTotalPages(numPages);
                                        setIsLoading(false);
                                        setPdfLoadError(null);
                                    }}
                                    onLoadError={(error) => {
                                        console.error('PDF load error:', error);
                                        setIsLoading(false);
                                        setPdfLoadError(error.message || 'Failed to load PDF. Please check if the file is valid and try again.');
                                    }}
                                    loading={
                                        <div className="flex items-center justify-center h-[500px]">
                                            <div className="text-center">
                                                <div className="animate-spin w-8 h-8 border-4 border-brand-purple border-t-transparent rounded-full mx-auto mb-4"></div>
                                                <p className="text-muted-foreground">Loading PDF...</p>
                                            </div>
                                        </div>
                                    }
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
                                            const hasValue = field.value && field.value.trim() !== '';
                                            
                                            return (
                                    <div
                                        key={field.id}
                                        className={cn(
                                            "absolute border-2 rounded group transition-all duration-200 select-none",
                                            selectedField?.id === field.id 
                                                ? "border-brand-purple bg-brand-purple/10 shadow-lg" 
                                                : hasValue 
                                                    ? "border-green-500 bg-green-50 shadow-md"
                                                    : isSigningMode
                                                        ? "border-dashed border-blue-400 bg-blue-50 hover:border-blue-500 hover:bg-blue-100 animate-pulse cursor-pointer"
                                                        : "border-dashed border-gray-300 bg-gray-50 cursor-move",
                                            "hover:border-brand-purple hover:shadow-lg",
                                            isSigningMode && !hasValue && "ring-2 ring-blue-200",
                                            !isSigningMode && "draggable"
                                        )}
                                        style={{
                                            left: field.x * zoom,
                                            top: field.y * zoom,
                                            width: field.width * zoom,
                                            height: field.height * zoom,
                                        }}
                                        draggable={!isSigningMode}
                                        onDragStart={(e) => {
                                            if (!isSigningMode) {
                                                e.dataTransfer.effectAllowed = 'move';
                                                handleFieldDragStart(field);
                                            } else {
                                                e.preventDefault();
                                            }
                                        }}
                                        onDrag={(e) => {
                                            if (!isSigningMode && draggedField?.id === field.id) {
                                                e.preventDefault();
                                            }
                                        }}
                                        onDragEnd={(e) => {
                                            if (!isSigningMode && draggedField?.id === field.id) {
                                                const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                                                if (rect) {
                                                    const newX = (e.clientX - rect.left) / zoom - field.width / 2;
                                                    const newY = (e.clientY - rect.top) / zoom - field.height / 2;
                                                    handleFieldDrag(field.id, newX - field.x, newY - field.y);
                                                }
                                                setDraggedField(null);
                                            }
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (isSigningMode) {
                                                handleFieldClick(field);
                                            } else {
                                                handleFieldSelect(field);
                                            }
                                        }}
                                    >
                                    <div className="flex items-center justify-center h-full text-xs font-medium relative p-1">
                                                        {hasValue ? (
                                                            field.type === 'signature' ? (
                                                                // Show signature preview
                                                                typeof field.value === 'string' && field.value.startsWith('data:') ? (
                                                                    <img 
                                                                        src={field.value} 
                                                                        alt="Signature" 
                                                                        className="max-w-full max-h-full object-contain"
                                                                    />
                                                                ) : typeof field.value === 'object' && field.value && 'font' in field.value && 'text' in field.value ? (
                                                                    <div 
                                                                        className="text-lg"
                                                                        style={{ fontFamily: (field.value as any).font }}
                                                                    >
                                                                        {(field.value as any).text}
                                                                    </div>
                                                                ) : (
                                                                    <div className="text-center">
                                                                        <Check className="w-4 h-4 text-green-600 mx-auto mb-1" />
                                                                        <div className="text-green-600">Signed</div>
                                                                    </div>
                                                                )
                                                            ) : (
                                                                // Show other field values
                                                                <div className="text-center text-green-800 font-medium truncate px-1">
                                                                    {field.value}
                                                                </div>
                                                            )
                                                        ) : (
                                                            // Show empty field
                                                            <div className="text-center">
                                                                <Icon className="w-3 h-3 mx-auto mb-1 text-gray-600" />
                                                                <div className="text-gray-600 truncate">{field.label}</div>
                                                                {isSigningMode && (
                                                                    <div className="text-xs text-blue-600 mt-1">Click to {field.type}</div>
                                                                )}
                                                            </div>
                                                        )}
                                                        
                                                        {selectedField?.id === field.id && !isSigningMode && (
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
                        )}
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

                        {/* Action Buttons - Fixed at bottom like ilovePDF */}
                        <div className="p-6 border-t border-border space-y-3">
                            {isSigningMode ? (
                                <div className="space-y-2">
                                    <Button
                                        onClick={handleSaveDocument}
                                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium py-3 rounded-lg"
                                        disabled={fields.some(f => f.required && !f.value)}
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Signed Document
                                    </Button>
                                    <div className="text-xs text-muted-foreground text-center">
                                        {fields.filter(f => f.value).length} of {fields.length} fields completed
                                    </div>
                                </div>
                            ) : (
                                <Button
                                    onClick={handleSendForSigning}
                                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium py-3 rounded-lg"
                                    disabled={fields.length === 0 && signers.length === 0}
                                >
                                    <Send className="w-4 h-4 mr-2" />
                                    {signers.length > 0 ? 'Send for Signing' : 'Sign Document'}
                                </Button>
                            )}
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

            {/* Signature Details Modal */}
            <SignatureDetailsModal
                isOpen={showSignatureDetailsModal}
                onClose={() => {
                    setShowSignatureDetailsModal(false);
                    setActiveSignatureField(null);
                }}
                onApply={handleSignatureDetailsApply}
                initialData={{
                    fullName: user?.user_metadata?.full_name || '',
                    initials: user?.user_metadata?.initials || ''
                }}
            />

            {/* Field Input Modal */}
            <FieldInputModal
                isOpen={showFieldInputModal}
                onClose={() => {
                    setShowFieldInputModal(false);
                    setActiveInputField(null);
                }}
                onSave={handleFieldInputSave}
                fieldType={activeInputField?.type as any || 'text'}
                fieldLabel={activeInputField?.label || 'Field'}
                initialValue={activeInputField?.value || ''}
            />
        </div>
    );
};

export default ProfessionalPDFEditor;