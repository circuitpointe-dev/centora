import React from 'react';
import { Download } from 'lucide-react';
import {
  SideDialog,
  SideDialogContent,
  SideDialogHeader,
  SideDialogTitle,
  SideDialogDescription,
} from '@/components/ui/side-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ComplianceDocument {
  id: string;
  title: string;
  description: string;
  effectiveDate: string;
  expiresDate: string;
  status: 'Active' | 'Pending' | 'Retired';
}

interface DocumentDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: ComplianceDocument | null;
}

export const DocumentDetailDialog: React.FC<DocumentDetailDialogProps> = ({
  open,
  onOpenChange,
  document,
}) => {
  if (!document) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Retired':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <SideDialog open={open} onOpenChange={onOpenChange}>
      <SideDialogContent className="sm:w-[600px]">
        <SideDialogHeader className="border-b border-gray-200">
          <div className="flex items-center gap-4">
            <SideDialogTitle className="text-xl font-semibold text-gray-900 flex-1">
              {document.title}
            </SideDialogTitle>
            <Button
              size="sm" 
              className="gap-2 border-violet-600 text-violet-600 mr-5 hover:bg-violet-50 bg-white"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </SideDialogHeader>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Document Info */}
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Effective Date:</span> {formatDate(document.effectiveDate)}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Expires:</span> {formatDate(document.expiresDate)}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Status:</span>
                <Badge className={getStatusColor(document.status)}>
                  {document.status}
                </Badge>
              </div>
            </div>

            {/* Overview */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Overview</h3>
              <p className="text-gray-700 leading-relaxed">
                Lorem ipsum dolor sit amet consectetur. Adipiscing molestie venenatis 
                nulla nec varius posuere vitae tincidunt ipsum. Egestas convallis 
                turpis vitae at tellus in fringilla enim. Euismod quam pellentesque dolor 
                pharetra arcu ac quam. Sed velit ipsum.
              </p>
            </div>

            {/* Scope */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Scope</h3>
              <p className="text-gray-700 leading-relaxed">
                Lorem ipsum dolor sit amet consectetur. Adipiscing molestie venenatis 
                nulla nec varius posuere vitae tincidunt ipsum.
              </p>
            </div>

            {/* Key Guidelines */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Key Guidelines</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Lorem ipsum dolor sit amet consectetur adipiscing
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Lorem ipsum dolor sit amet consectetur adipiscing
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Lorem ipsum dolor sit amet consectetur adipiscing
                </li>
              </ul>
            </div>

            {/* Conflicts of Interest */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Conflicts of Interest</h3>
              <p className="text-gray-700 leading-relaxed">
                Lorem ipsum dolor sit amet consectetur. Adipiscing molestie venenatis 
                nulla nec varius posuere vitae tincidunt ipsum.
              </p>
            </div>

            {/* Consequences */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Consequences</h3>
              <p className="text-gray-700 leading-relaxed">
                Lorem ipsum dolor sit amet consectetur. Adipiscing molestie venenatis 
                nulla nec varius posuere vitae tincidunt ipsum.
              </p>
            </div>
          </div>
        </div>
      </SideDialogContent>
    </SideDialog>
  );
};