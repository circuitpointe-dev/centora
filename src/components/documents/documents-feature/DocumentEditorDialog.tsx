
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Save, X, AlertCircle } from 'lucide-react';
import { Document } from '@/hooks/useDocuments';
import { useToast } from '@/hooks/use-toast';
import PDFEditor from './editors/PDFEditor';
import WordEditor from './editors/WordEditor';
import ExcelEditor from './editors/ExcelEditor';
import PowerPointEditor from './editors/PowerPointEditor';
import TextEditor from './editors/TextEditor';

interface DocumentEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document;
  userPermissions: string;
}

const getFileType = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  return extension || 'unknown';
};

const checkEditPermissions = (userPermissions: string) => {
  return userPermissions === 'Edit' || userPermissions === 'Admin';
};

const DocumentEditorDialog = ({ 
  open, 
  onOpenChange, 
  document, 
  userPermissions 
}: DocumentEditorDialogProps) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const { toast } = useToast();

  const fileType = getFileType(document.file_name);
  const canEdit = checkEditPermissions(userPermissions);

  useEffect(() => {
    // Load document content
    setEditorContent(`Content of ${document.file_name}`);
  }, [document]);

  const handleSave = async () => {
    if (!canEdit) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to edit this document.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Document Saved",
        description: `"${document.file_name}" has been saved successfully.`,
      });
      
      setHasUnsavedChanges(false);
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save the document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      const confirmClose = window.confirm(
        "You have unsaved changes. Are you sure you want to close the editor?"
      );
      if (!confirmClose) return;
    }
    onOpenChange(false);
  };

  const renderEditor = () => {
    const commonProps = {
      content: editorContent,
      onChange: (content: string) => {
        setEditorContent(content);
        setHasUnsavedChanges(true);
      },
      readOnly: !canEdit,
    };

    switch (fileType) {
      case 'pdf':
        return <PDFEditor {...commonProps} />;
      case 'docx':
      case 'doc':
        return <WordEditor {...commonProps} />;
      case 'xlsx':
      case 'xls':
        return <ExcelEditor {...commonProps} />;
      case 'pptx':
      case 'ppt':
        return <PowerPointEditor {...commonProps} />;
      default:
        return <TextEditor {...commonProps} />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl h-[90vh] bg-white border border-gray-200 p-0 flex flex-col">
        <DialogHeader className="border-b border-gray-100 p-4 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              {canEdit ? 'Edit Document' : 'View Document'}
            </DialogTitle>
            <div className="text-sm text-gray-600">
              {document.file_name}
            </div>
            {hasUnsavedChanges && (
              <div className="flex items-center gap-1 text-orange-600">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs">Unsaved changes</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {canEdit && (
              <Button
                onClick={handleSave}
                disabled={!hasUnsavedChanges || isSaving}
                className="bg-violet-600 hover:bg-violet-700"
                size="sm"
              >
                <Save className="w-4 h-4 mr-1" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {!canEdit && (
            <div className="bg-yellow-50 border-b border-yellow-200 p-3">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">You're viewing this document in read-only mode.</span>
              </div>
            </div>
          )}
          {renderEditor()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentEditorDialog;
