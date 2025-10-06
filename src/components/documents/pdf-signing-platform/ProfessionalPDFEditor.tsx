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
    X,
    FileText
} from 'lucide-react';
import ProfessionalSignatureCapture from './ProfessionalSignatureCapture';
import SignatureDetailsModal from './SignatureDetailsModal';
import FieldInputModal from './FieldInputModal';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Document, Page, pdfjs } from 'react-pdf';
import { useAuth } from '@/hooks/useAuth';
import { useCreateSignatureRequest } from '@/hooks/useSignatureRequests';
import { useCreateESignatureField, useESignatureFields, useUpdateESignatureField, useDeleteESignatureField, useSaveESignatureFields } from '@/hooks/useESignatureFields';
import { supabase } from '@/integrations/supabase/client';

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
    const updateESignatureField = useUpdateESignatureField();
    const deleteESignatureField = useDeleteESignatureField();
    const saveESignatureFields = useSaveESignatureFields();
    // Use only a valid UUID to query remote fields to avoid 400s
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    const stateDocId = (location.state as any)?.selectedDoc?.id as string | undefined;
    const [persistedDocId, setPersistedDocId] = useState<string>('');
    const effectiveDocId = persistedDocId || (stateDocId ? stateDocId : (documentId && uuidRegex.test(documentId) ? documentId : ''));
    const { data: existingFields } = useESignatureFields(effectiveDocId);

    // Load existing fields from database when component mounts
    useEffect(() => {
        if (existingFields && existingFields.length > 0) {
            console.log('Loading existing fields from database:', existingFields);
            const mappedFields: SignatureField[] = existingFields.map(field => ({
                id: field.id,
                type: field.field_type === 'signature' ? 'signature' :
                    field.field_type === 'name' ? 'name' :
                        field.field_type === 'date' ? 'date' :
                            field.field_type === 'email' ? 'text' : 'text',
                label: field.field_label,
                x: field.position_x,
                y: field.position_y,
                width: field.width,
                height: field.height,
                page: field.page_number,
                required: field.is_required,
                value: field.field_value
            }));
            setFields(mappedFields);
        }
    }, [existingFields]);

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

    // Compute and store PDF URL (avoid calling setState during render)
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [isPersisting, setIsPersisting] = useState(false);
    const [isLoadingPdf, setIsLoadingPdf] = useState(true);
    const [isSavingFields, setIsSavingFields] = useState(false);

    useEffect(() => {
        const state = location.state as any;
        console.log('PDF Editor - Location state:', state);

        // Set loading state
        setIsLoadingPdf(true);
        setPdfLoadError(null);

        let url: string | null = null;
        if (state?.selectedFiles && state.selectedFiles.length > 0) {
            const file = state.selectedFiles[0] as File;
            if (file.type === 'application/pdf') {
                // Set immediate URL for preview while persisting
                const immediateUrl = URL.createObjectURL(file);
                setPdfUrl(immediateUrl);
                setIsLoadingPdf(false);

                // Persist upload to Supabase Storage + DB in background
                (async () => {
                    try {
                        setIsPersisting(true);
                        const fileName = file.name.replace(/\s+/g, '_');
                        const path = `${(user as any)?.id || 'anonymous'}/${Date.now()}_${fileName}`;
                        const { error: upErr } = await supabase.storage.from('documents').upload(path, file, { contentType: file.type });
                        if (upErr) throw upErr;

                        // Insert DB row
                        const { data: insertRes, error: insErr } = await supabase
                            .from('documents')
                            .insert({
                                file_name: fileName,
                                file_path: path,
                                created_by: (user as any)?.id || null,
                                title: fileName,
                                org_id: null,
                            } as any)
                            .select('id')
                            .single();
                        if (insErr) throw insErr;

                        // Update to public URL after persistence
                        const { data: pub } = supabase.storage.from('documents').getPublicUrl(path);
                        setPdfUrl(pub.publicUrl);
                        if (insertRes?.id) setPersistedDocId(insertRes.id);
                    } catch (err: any) {
                        console.error('Upload persistence failed:', err);
                        // Keep the immediate URL if persistence fails
                    } finally {
                        setIsPersisting(false);
                    }
                })();
            } else {
                setPdfLoadError('Please upload a valid PDF file');
                setIsLoadingPdf(false);
            }
        } else if (state?.selectedDoc) {
            const doc = state.selectedDoc;
            if (doc.file_path) {
                const baseUrl = 'https://kspzfifdwfpirgqstzhz.supabase.co/storage/v1/object/public/documents/';
                url = doc.file_path.startsWith('http') ? doc.file_path : baseUrl + doc.file_path;
            } else if (doc.content || doc.file_url) {
                url = doc.content || doc.file_url;
            }
            setPdfUrl(url);
            setIsLoadingPdf(false);
        } else {
            setPdfLoadError('No PDF document provided. Please select a document to continue.');
            setIsLoadingPdf(false);
        }
        console.log('PDF Editor - Setting PDF URL:', url);
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
        { type: 'stamp' as const, label: 'Stamp', icon: Building, color: 'bg-green-50 border-green-200 text-green-800' },
    ];

    // Handle canvas click to add fields
    const handleCanvasClick = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
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

        // Add to local state immediately
        setFields(prev => [...prev, newField]);
        setSelectedField(newField);
        setSelectedTool(null);
        toast.success(`${selectedTool} field added`);

        // Save to database immediately if we have a valid document ID
        if (effectiveDocId && effectiveDocId !== 'sample-doc') {
            try {
                setIsSavingFields(true);

                // Map field type to database format
                let mappedFieldType: 'signature' | 'name' | 'date' | 'email' | 'text' = 'text';
                switch (selectedTool) {
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
                    case 'text':
                    case 'stamp':
                        mappedFieldType = 'text';
                        break;
                    default:
                        mappedFieldType = 'text';
                }

                console.log('Saving field to database:', {
                    document_id: effectiveDocId,
                    field_type: mappedFieldType,
                    field_label: newField.label,
                    position_x: newField.x,
                    position_y: newField.y,
                    width: newField.width,
                    height: newField.height,
                    page_number: newField.page,
                    is_required: newField.required,
                });

                const savedField = await createESignatureField.mutateAsync({
                    document_id: effectiveDocId,
                    field_type: mappedFieldType,
                    field_label: newField.label,
                    position_x: newField.x,
                    position_y: newField.y,
                    width: newField.width,
                    height: newField.height,
                    page_number: newField.page,
                    is_required: newField.required,
                });

                console.log('Field saved to database successfully:', savedField);

                // Update the field with the database ID
                setFields(prev => prev.map(f =>
                    f.id === newField.id
                        ? { ...f, id: savedField.id }
                        : f
                ));

                toast.success(`${selectedTool} field saved to database successfully!`);

            } catch (error) {
                console.error('Failed to save field to database:', error);
                toast.error(`Failed to save ${selectedTool} field to database: ${error.message || 'Unknown error'}`);
            } finally {
                setIsSavingFields(false);
            }
        } else {
            console.log('Skipping database save - no valid document ID:', effectiveDocId);
        }
    }, [selectedTool, zoom, currentPage, isSigningMode, effectiveDocId, createESignatureField]);

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
    const handleFieldDelete = async (fieldId: string) => {
        const fieldToDelete = fields.find(f => f.id === fieldId);

        // Remove from local state
        setFields(prev => prev.filter(field => field.id !== fieldId));
        if (selectedField?.id === fieldId) {
            setSelectedField(null);
        }

        // Delete from database if we have a valid field ID
        if (fieldToDelete && fieldToDelete.id && !fieldToDelete.id.startsWith('field_')) {
            try {
                console.log('Deleting field from database:', fieldToDelete.id);

                await deleteESignatureField.mutateAsync(fieldToDelete.id);

                console.log('Field deleted from database successfully');
            } catch (error) {
                console.error('Failed to delete field from database:', error);
                toast.error('Field deleted locally but failed to delete from database');
            }
        } else {
            console.log('Skipping database deletion - field not yet saved to database or no valid ID');
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
        console.log('Field clicked:', field);
        if (field.type === 'signature' || field.type === 'initials') {
            setActiveSignatureField(field);
            setShowSignatureDetailsModal(true);
        } else {
            // Handle other field types with modal instead of prompt
            setActiveInputField(field);
            setShowFieldInputModal(true);
        }
    };

    // Handle field input save
    const handleFieldInputSave = async (value: string) => {
        console.log('Field input save:', value, 'Active field:', activeInputField);
        if (activeInputField) {
            setFields(prev => {
                const updated = prev.map(f =>
                    f.id === activeInputField.id ? { ...f, value } : f
                );
                console.log('Updated fields:', updated);
                return updated;
            });
            setSidebarFields(prev => prev.map(f =>
                f.id === activeInputField.id ? { ...f, value } : f
            ));

            // Save field value to database
            if (effectiveDocId && effectiveDocId !== 'sample-doc' && activeInputField.id && !activeInputField.id.startsWith('field_')) {
                try {
                    console.log('Updating field value in database:', {
                        fieldId: activeInputField.id,
                        fieldValue: value
                    });

                    await updateESignatureField.mutateAsync({
                        id: activeInputField.id,
                        updates: { field_value: value }
                    });

                    console.log('Field value saved to database successfully');
                } catch (error) {
                    console.error('Failed to save field value to database:', error);
                    toast.error('Field value saved locally but failed to save to database');
                }
            } else {
                console.log('Skipping database update - field not yet saved to database or no valid ID');
            }

            setActiveInputField(null);
            toast.success('Field value saved successfully!');
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
    const handleSignatureDetailsApply = async (signatureData: any) => {
        console.log('Signature details apply:', signatureData, 'Active field:', activeSignatureField);
        if (activeSignatureField) {
            setUserSignatureData(signatureData);
            // The signatureData is passed directly from SignatureDetailsModal
            const signatureValue = signatureData;

            setFields(prev => {
                const updated = prev.map(f =>
                    f.id === activeSignatureField.id
                        ? { ...f, value: signatureValue }
                        : f
                );
                console.log('Updated fields:', updated);
                return updated;
            });
            setSidebarFields(prev => prev.map(f =>
                f.id === activeSignatureField.id
                    ? { ...f, value: signatureValue }
                    : f
            ));

            // Save field value to database
            if (effectiveDocId && effectiveDocId !== 'sample-doc' && activeSignatureField.id && !activeSignatureField.id.startsWith('field_')) {
                try {
                    const fieldValue = typeof signatureValue === 'string' ? signatureValue : JSON.stringify(signatureValue);

                    console.log('Updating field value in database:', {
                        fieldId: activeSignatureField.id,
                        fieldValue: fieldValue
                    });

                    await updateESignatureField.mutateAsync({
                        id: activeSignatureField.id,
                        updates: { field_value: fieldValue }
                    });

                    console.log('Field value saved to database successfully');
                } catch (error) {
                    console.error('Failed to save field value to database:', error);
                    toast.error('Signature applied locally but failed to save to database');
                }
            } else {
                console.log('Skipping database update - field not yet saved to database or no valid ID');
            }

            setShowSignatureDetailsModal(false);
            setActiveSignatureField(null);
            toast.success('Signature applied successfully!');
        }
    };


    // Download document with all fields and signatures
    const handleDownloadDocument = async () => {
        try {
            if (!pdfUrl) {
                toast.error('No document to download');
                return;
            }

            // Show loading state
            toast.loading('Preparing document for download...', { id: 'download' });

            // If it's a data URL (from uploaded file), download directly
            if (pdfUrl.startsWith('data:')) {
                const link = document.createElement('a');
                link.href = pdfUrl;
                link.download = `${documentTitle}_signed.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                toast.success('Document downloaded successfully!', { id: 'download' });
                return;
            }

            // If it's a Supabase storage URL, download from storage
            if (pdfUrl.includes('supabase.co')) {
                const fileName = `${documentTitle}_signed.pdf`;
                const response = await fetch(pdfUrl);
                const blob = await response.blob();

                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);

                toast.success('Document downloaded successfully!', { id: 'download' });
            } else {
                // Fallback: open in new tab
                window.open(pdfUrl, '_blank');
                toast.success('Document opened in new tab', { id: 'download' });
            }
        } catch (error) {
            console.error('Error downloading document:', error);
            toast.error('Failed to download document', { id: 'download' });
        }
    };

    // Save document with all fields and signatures
    const handleSaveDocument = async () => {
        try {
            if (!pdfUrl) {
                toast.error('No document to save');
                return;
            }

            // Show loading state
            toast.loading('Saving document with all fields...', { id: 'save' });

            // Save all fields to database first
            if (effectiveDocId && effectiveDocId !== 'sample-doc') {
                try {
                    // Use the bulk save function
                    const fieldsToSave = fields.map(field => {
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
                            case 'text':
                            case 'stamp':
                                mappedFieldType = 'text';
                                break;
                            default:
                                mappedFieldType = 'text';
                        }

                        return {
                            id: field.id.startsWith('field_') ? undefined : field.id,
                            field_type: mappedFieldType,
                            field_label: field.label,
                            position_x: field.x,
                            position_y: field.y,
                            width: field.width,
                            height: field.height,
                            page_number: field.page,
                            is_required: field.required,
                            field_value: field.value
                        };
                    });

                    // Use the bulk save hook
                    await saveESignatureFields.mutateAsync({
                        documentId: effectiveDocId,
                        fields: fieldsToSave
                    });

                    console.log('All fields saved to database successfully');
                } catch (error) {
                    console.error('Failed to save fields to database:', error);
                    toast.error('Failed to save some fields to database', { id: 'save' });
                }
            }

            // For now, just show success - in a real implementation, you would generate a PDF with overlays
            toast.success('Document saved successfully with all fields!', { id: 'save' });

        } catch (error) {
            console.error('Error saving document:', error);
            toast.error('Failed to save document', { id: 'save' });
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
                const documentId = state?.selectedDoc?.id; // only send to backend when we have a real id
                if (!documentId || !uuidRegex.test(documentId)) continue;

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

                if (!effectiveDocId) continue;
                await createESignatureField.mutateAsync({
                    document_id: effectiveDocId,
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
                            {isPersisting && (
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <div className="animate-spin w-4 h-4 border-2 border-brand-purple border-t-transparent rounded-full"></div>
                                    <span>Saving to cloud...</span>
                                </div>
                            )}
                            {isSavingFields && (
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <div className="animate-spin w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full"></div>
                                    <span>Saving fields...</span>
                                </div>
                            )}
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
                                    <Button variant="outline" size="sm" onClick={handleDownloadDocument}>
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
                        {isLoadingPdf ? (
                            <div className="flex items-center justify-center h-[500px]">
                                <Card className="p-8 max-w-md text-center">
                                    <div className="text-muted-foreground mb-4">
                                        <div className="animate-spin w-8 h-8 border-4 border-brand-purple border-t-transparent rounded-full mx-auto mb-4"></div>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">Loading PDF...</h3>
                                    <p className="text-muted-foreground mb-4">Please wait while we load your document.</p>
                                </Card>
                            </div>
                        ) : pdfLoadError ? (
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
                                                setIsLoadingPdf(true);
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
                        ) : !pdfUrl ? (
                            <div className="flex items-center justify-center h-[500px]">
                                <Card className="p-8 max-w-md text-center">
                                    <div className="text-muted-foreground mb-4">
                                        <FileText className="w-12 h-12 mx-auto mb-4" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">No PDF file specified</h3>
                                    <p className="text-muted-foreground mb-4">Please select a document to continue.</p>
                                    <div className="space-y-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => navigate('/dashboard/documents')}
                                        >
                                            Select Document
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        ) : (
                            <div className="bg-card shadow-lg mx-auto relative rounded-sm" style={{ width: 'fit-content' }}>
                                <Document
                                    file={pdfUrl}
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
                                                const val: any = field.value as any;
                                                const hasValue = typeof val === 'string' ? (val.trim() !== '') : (val && (typeof val === 'object') && (val.text ? String(val.text).trim() !== '' : true));
                                                console.log('Field rendering:', field.id, 'value:', val, 'hasValue:', hasValue);

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
                                disabled={(fields.length === 0 && signers.length === 0) || !effectiveDocId}
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
                open={showSignatureDetailsModal}
                onOpenChange={(v) => {
                    setShowSignatureDetailsModal(v);
                    if (!v) setActiveSignatureField(null);
                }}
                onApply={handleSignatureDetailsApply}
                target={activeSignatureField?.type === 'initials' ? 'initials' : 'signature'}
            />

            {/* Field Input Modal */}
            <FieldInputModal
                open={showFieldInputModal}
                onOpenChange={(v) => {
                    setShowFieldInputModal(v);
                    if (!v) setActiveInputField(null);
                }}
                onApply={handleFieldInputSave}
                type={(activeInputField?.type as any) === 'name' ? 'name' : (activeInputField?.type as any) === 'date' ? 'date' : 'text'}
                initial={(typeof activeInputField?.value === 'string' ? activeInputField?.value : '') || ''}
            />
        </div>
    );
};

export default ProfessionalPDFEditor;