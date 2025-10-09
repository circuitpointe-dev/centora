import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Download,
  Share2,
  Edit,
  Trash2,
  X,
  Eye,
  FileText,
  Calendar,
  User,
  Tag,
  Loader2,
  File,
  FileImage,
  FileVideo,
  FileAudio,
  FileSpreadsheet,
  Presentation
} from 'lucide-react';
import { Document } from '@/hooks/useDocuments';
import { useDocumentDownload, useDocumentDelete, useDocumentPreview } from '@/hooks/useDocumentOperations';

interface DocumentPreviewCardProps {
  document: Document;
  onClose: () => void;
}

const DocumentPreviewCard: React.FC<DocumentPreviewCardProps> = ({ document, onClose }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const downloadMutation = useDocumentDownload();
  const deleteMutation = useDocumentDelete();
  const previewMutation = useDocumentPreview();

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDownload = () => {
    downloadMutation.mutate(document.id);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this document?')) {
      deleteMutation.mutate(document.id);
    }
  };

  const handlePreview = async () => {
    try {
      const result = await previewMutation.mutateAsync(document.id);
      setPreviewUrl(result.url);
    } catch (error) {
      console.error('Preview failed:', error);
    }
  };

  const canPreview = document.mime_type?.includes('pdf') || document.mime_type?.includes('image');

  const getFileIcon = (mimeType?: string) => {
    if (!mimeType) return <File className="w-10 h-10 text-gray-400" />;

    if (mimeType.includes('pdf')) return <FileText className="w-10 h-10 text-red-500" />;
    if (mimeType.includes('image')) return <FileImage className="w-10 h-10 text-blue-500" />;
    if (mimeType.includes('video')) return <FileVideo className="w-10 h-10 text-purple-500" />;
    if (mimeType.includes('audio')) return <FileAudio className="w-10 h-10 text-green-500" />;
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return <FileSpreadsheet className="w-10 h-10 text-green-600" />;
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return <Presentation className="w-10 h-10 text-orange-500" />;
    if (mimeType.includes('text') || mimeType.includes('document')) return <FileText className="w-10 h-10 text-blue-600" />;

    return <File className="w-10 h-10 text-gray-400" />;
  };

  return (
    <Card className="h-full flex flex-col border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-white shadow-lg">
      {/* Header */}
      <CardHeader className="bg-violet-100 border-b border-violet-200 p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-200 rounded-lg">
              <FileText className="w-5 h-5 text-violet-700" />
            </div>
            <div>
              <CardTitle className="font-semibold text-violet-900 text-base">
                Document Preview
              </CardTitle>
              <div className="text-sm text-violet-700">
                Selected Document
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-violet-700 hover:text-violet-900"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {/* Document thumbnail */}
      <div className="flex h-[120px] items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 border-b border-gray-200 shrink-0">
        <FileText className="w-10 h-10 text-gray-400" />
      </div>

      <CardContent className="flex-grow bg-white overflow-y-auto p-4">
        <div className="flex flex-col h-full">
          {/* Document Info */}
          <div className="flex flex-col gap-4 mb-6">
            <h3 className="font-semibold text-gray-900 text-lg truncate" title={document.title}>
              {document.title}
            </h3>

            {/* File Details */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">{document.category}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Created:</span>
                <span className="font-medium">{formatDate(document.created_at)}</span>
              </div>

              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Owner:</span>
                <span className="font-medium">{document.creator?.full_name || 'Unknown'}</span>
              </div>

              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Size:</span>
                <span className="font-medium">{formatFileSize(document.file_size)}</span>
              </div>
            </div>

            {/* Description */}
            {document.description && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-sm text-gray-600">{document.description}</p>
              </div>
            )}

            {/* Tags */}
            {document.tags && document.tags.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-gray-900">Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {document.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs"
                      style={{
                        backgroundColor: tag.bg_color || '#f3f4f6',
                        color: tag.text_color || '#374151'
                      }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-3 mt-auto">
            <div className="flex gap-2">
              {canPreview && (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={handlePreview}
                  disabled={previewMutation.isPending}
                >
                  {previewMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Eye className="h-4 w-4 mr-2" />
                  )}
                  Preview
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={handleDownload}
                disabled={downloadMutation.isPending}
              >
                {downloadMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Download
              </Button>
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-red-600 hover:text-red-700"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Delete
              </Button>
            </div>

            {/* Preview Section */}
            {previewUrl && (
              <div className="mt-4 border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Document Preview</h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (previewUrl) {
                        URL.revokeObjectURL(previewUrl);
                        setPreviewUrl(null);
                      }
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="bg-gray-50 rounded p-2 max-h-64 overflow-auto">
                  {document.mime_type?.includes('pdf') ? (
                    <iframe
                      src={previewUrl}
                      className="w-full h-48 border-0 rounded"
                      title="Document Preview"
                      onError={() => {
                        console.error('Failed to load PDF preview');
                        setPreviewUrl(null);
                      }}
                    />
                  ) : document.mime_type?.includes('image') ? (
                    <img
                      src={previewUrl}
                      alt="Document Preview"
                      className="max-w-full h-auto rounded"
                      onError={() => {
                        console.error('Failed to load image preview');
                        setPreviewUrl(null);
                      }}
                    />
                  ) : document.mime_type?.includes('text') ? (
                    <div className="bg-white p-3 rounded border">
                      <p className="text-sm text-gray-600">Text document preview not available</p>
                      <p className="text-xs text-gray-500 mt-1">Click Download to view the full document</p>
                    </div>
                  ) : (
                    <div className="bg-white p-3 rounded border">
                      <p className="text-sm text-gray-600">Preview not available for this file type</p>
                      <p className="text-xs text-gray-500 mt-1">File type: {document.mime_type || 'Unknown'}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentPreviewCard;