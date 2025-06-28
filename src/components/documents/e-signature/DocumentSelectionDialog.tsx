
import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FileText, Check } from 'lucide-react';
import { documentsData } from '../documents-feature/data';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface Document {
  id: string;
  fileName: string;
  category: string;
  fileSize: string;
  addedTime: string;
  owner: {
    name: string;
    avatar: string;
  };
  tags: Array<{
    name: string;
    bgColor: string;
    textColor: string;
  }>;
}

interface DocumentSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDocumentSelect: (document: Document) => void;
  selectedDocument?: Document | null;
}

const DocumentSelectionDialog = ({ 
  open, 
  onOpenChange, 
  onDocumentSelect,
  selectedDocument 
}: DocumentSelectionDialogProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tempSelectedDoc, setTempSelectedDoc] = useState<Document | null>(selectedDocument || null);

  const filteredDocuments = useMemo(() => {
    let filtered = documentsData.map(doc => ({
      id: doc.id,
      fileName: doc.fileName,
      category: doc.category,
      fileSize: '2.5 MB', // Default file size since it's not in the original data
      addedTime: doc.addedTime,
      owner: doc.owner,
      tags: doc.tags
    }));

    if (searchQuery.trim()) {
      filtered = filtered.filter((doc) =>
        doc.fileName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [searchQuery]);

  const handleConfirm = () => {
    if (tempSelectedDoc) {
      onDocumentSelect(tempSelectedDoc);
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setTempSelectedDoc(selectedDocument || null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white border border-gray-200">
        <DialogHeader className="border-b border-gray-100 pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Select Document
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Document List */}
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setTempSelectedDoc(doc)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    tempSelectedDoc?.id === doc.id
                      ? 'border-violet-600 bg-violet-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <FileText className="w-5 h-5 text-gray-600" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {doc.fileName}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-500">
                            {doc.fileSize} • {doc.addedTime}
                          </span>
                          <span className="text-sm text-gray-500">
                            by {doc.owner.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                          {doc.tags.slice(0, 2).map((tag, index) => (
                            <Badge
                              key={index}
                              className={`h-5 px-2 py-0 ${tag.bgColor} ${tag.textColor} font-medium text-xs rounded border-0`}
                            >
                              {tag.name}
                            </Badge>
                          ))}
                          {doc.tags.length > 2 && (
                            <Badge className="h-5 px-2 py-0 bg-gray-200 text-gray-800 font-medium text-xs rounded border-0">
                              +{doc.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    {tempSelectedDoc?.id === doc.id && (
                      <Check className="w-5 h-5 text-violet-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="border-gray-300 text-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!tempSelectedDoc}
              className="bg-violet-600 hover:bg-violet-700"
            >
              Select Document
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentSelectionDialog;
