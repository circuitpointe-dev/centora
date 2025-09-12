import React from 'react';
import { SideDialog } from '@/components/ui/side-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, User, Tag, Clock } from 'lucide-react';

interface DocumentDetailsDialogProps {
  document: any;
  onClose: () => void;
}

export function DocumentDetailsDialog({ document, onClose }: DocumentDetailsDialogProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <SideDialog open={true} onOpenChange={onClose}>
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{document.title}</h2>
              <p className="text-sm text-gray-500">Document Details</p>
            </div>
          </div>
          <Badge className={`${getStatusColor(document.status)} rounded border`}>
            {document.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <User className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Requester</p>
              <p className="text-sm text-gray-600">{document.requester}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Requested Date</p>
              <p className="text-sm text-gray-600">{document.requestedDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Clock className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Due Date</p>
              <p className="text-sm text-gray-600">{document.dueDate}</p>
            </div>
          </div>

          {document.tags && document.tags.length > 0 && (
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Tag className="w-5 h-5 text-gray-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-2">Tags</p>
                <div className="flex flex-wrap gap-1">
                  {document.tags.map((tag: string, index: number) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="text-xs bg-white"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button 
            onClick={onClose}
            variant="outline" 
            className="flex-1 rounded bg-white border-gray-300 text-black hover:bg-gray-50"
          >
            Close
          </Button>
          <Button 
            className="flex-1 rounded bg-black text-white hover:bg-gray-800"
          >
            View Document
          </Button>
        </div>
      </div>
    </SideDialog>
  );
}