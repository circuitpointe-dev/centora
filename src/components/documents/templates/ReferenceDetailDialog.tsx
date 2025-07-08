import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';

interface ReferenceDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: any;
  onDownload?: (id: string) => void;
}

export const ReferenceDetailDialog: React.FC<ReferenceDetailDialogProps> = ({
  open,
  onOpenChange,
  document,
  onDownload
}) => {
  if (!document) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-gray-900">
            <FileText className="h-5 w-5 text-violet-600" />
            Document Preview
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Document Image */}
          <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={document.image}
              alt={`${document.name} Preview`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Document Details */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {document.name}
              </h3>
              <div className="flex items-center gap-4 mb-3">
                <Badge variant="secondary" className="bg-violet-100 text-violet-800 border-gray-200">
                  {document.category}
                </Badge>
                <span className="text-sm text-gray-600">{document.size}</span>
              </div>
              <p className="text-sm text-gray-600">
                Last updated {document.lastUpdated}
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-sm text-gray-600">
                This is a reference document in the {document.category.toLowerCase()} category. 
                It provides important information and guidelines for organizational use.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Usage Guidelines</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Reference document for internal use</li>
                <li>• Contains current organizational standards</li>
                <li>• Updated regularly to ensure accuracy</li>
                <li>• Available for download and offline access</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <Button
              onClick={() => {
                onDownload?.(document.id);
                onOpenChange(false);
              }}
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};