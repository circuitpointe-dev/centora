import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, X, FileText, Upload, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDonorDocuments, useUploadDonorDocument, useDeleteDonorDocument, useDownloadDonorDocument } from "@/hooks/useDonorDocuments";
import { useAuth } from "@/contexts/AuthContext";
import { validateFiles, formatFileSize } from "@/utils/fileValidation";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface FilesSectionProps {
  donorId: string;
}

export const FilesSection: React.FC<FilesSectionProps> = ({ donorId }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { data: documents = [], isLoading } = useDonorDocuments(donorId);
  const uploadMutation = useUploadDonorDocument();
  const deleteMutation = useDeleteDonorDocument();
  const downloadMutation = useDownloadDonorDocument();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileUpload(droppedFiles);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    handleFileUpload(selectedFiles);
  };

  const handleFileUpload = (files: File[]) => {
    if (files.length === 0 || !user?.org_id) return;

    const validationResult = validateFiles(files);
    
    if (validationResult.errors.length > 0) {
      // Handle validation errors - could show toast or error state
      console.error('File validation errors:', validationResult.errors);
      return;
    }

    // Upload each valid file
    validationResult.validFiles.forEach((file) => {
      uploadMutation.mutate({
        donorId,
        file,
        orgId: user.org_id!,
      });
    });
  };

  const handleDownload = (documentId: string, fileName: string) => {
    downloadMutation.mutate({ filePath: documentId, fileName });
  };

  const handleDeleteClick = (documentId: string) => {
    setFileToDelete(documentId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (fileToDelete) {
      deleteMutation.mutate({ documentId: fileToDelete, filePath: fileToDelete });
      setDeleteDialogOpen(false);
      setFileToDelete(null);
    }
  };

  const canDeleteFile = (uploadedBy: string) => {
    // Check if user uploaded the file or is org admin by checking role through subscribedModules
    return user?.id === uploadedBy || user?.subscribedModules?.includes('admin');
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType?.includes('pdf')) return '📄';
    if (mimeType?.includes('image')) return '🖼️';
    if (mimeType?.includes('excel') || mimeType?.includes('spreadsheet')) return '📊';
    if (mimeType?.includes('word') || mimeType?.includes('document')) return '📝';
    return '📎';
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 h-full">
        <h2 className="font-medium text-base text-gray-900">Files</h2>
        <Card className="h-full">
          <CardContent className="p-4 h-full flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4 h-full">
        <h2 className="font-medium text-base text-gray-900">Files</h2>

        <Card className="h-full">
          <CardContent className="p-4 h-full flex flex-col">
            {documents.length > 0 && (
              <div className="space-y-2 mb-4">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      <span className="text-lg mr-2">{getFileIcon(doc.mime_type || '')}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {doc.file_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {doc.file_size ? formatFileSize(doc.file_size) : 'Unknown size'} • 
                          Uploaded {format(new Date(doc.uploaded_at), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 p-2"
                        title="Download"
                        onClick={() => handleDownload(doc.file_path, doc.file_name)}
                        disabled={downloadMutation.isPending}
                      >
                        {downloadMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                      </Button>
                      {canDeleteFile(doc.uploaded_by) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 p-2"
                          onClick={() => handleDeleteClick(doc.id)}
                          title="Delete"
                          disabled={deleteMutation.isPending}
                        >
                          {deleteMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div 
              className={cn(
                "border-2 border-dashed rounded-md p-8 flex-1 flex items-center justify-center transition-colors",
                isDragOver 
                  ? "border-violet-300 bg-violet-50" 
                  : "border-gray-300 bg-gray-50/50"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {documents.length === 0 ? (
                <div className="text-center text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="font-medium mb-2">No files uploaded yet</p>
                  <p className="text-sm mb-4">Upload documents related to this donor</p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.txt,.xlsx,.pptx,.jpg,.jpeg,.png"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById("file-upload")?.click()}
                    disabled={uploadMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    {uploadMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    Upload Files
                  </Button>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <span className="font-medium">Drag and drop files here or </span>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.txt,.xlsx,.pptx,.jpg,.jpeg,.png"
                  />
                  <Button
                    variant="link"
                    className="font-medium p-0 h-auto text-base text-gray-700 hover:no-underline"
                    onClick={() => document.getElementById("file-upload")?.click()}
                    disabled={uploadMutation.isPending}
                  >
                    Browse
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete File</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this file? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
