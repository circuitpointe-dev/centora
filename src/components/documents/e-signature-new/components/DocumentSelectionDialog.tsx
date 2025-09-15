import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FileText, Calendar, User, Loader2 } from 'lucide-react';
import { useDocuments } from '@/hooks/useDocuments';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface DocumentSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DocumentSelectionDialog: React.FC<DocumentSelectionDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const { data: documents, isLoading } = useDocuments({
    search: searchQuery,
  });

  const handleSelectDocument = (document: any) => {
    navigate('/dashboard/documents/editor-new', {
      state: { selectedDoc: document }
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-white border-none shadow-lg">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Select Document for E-Signature
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Documents List */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : documents && documents.length > 0 ? (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSelectDocument(doc)}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-gray-400" />
                    <div>
                      <h3 className="font-medium text-gray-900">{doc.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {doc.creator?.full_name || 'Unknown'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDistanceToNow(new Date(doc.updated_at), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Select
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No documents found</p>
                <p className="text-sm text-gray-400">Upload some documents first to use E-Signature</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};