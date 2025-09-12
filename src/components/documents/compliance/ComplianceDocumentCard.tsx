import React from 'react';
import { FileText, Calendar, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ComplianceDocument {
  id: string;
  title: string;
  description: string;
  department: string;
  effective_date: string;
  expires_date: string;
  status: 'Active' | 'Pending' | 'Retired';
}

interface ComplianceDocumentCardProps {
  document: ComplianceDocument;
  onViewDocument: (document: ComplianceDocument) => void;
}

export const ComplianceDocumentCard: React.FC<ComplianceDocumentCardProps> = ({ document, onViewDocument }) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow h-full">
      <CardContent className="p-6 flex flex-col h-full">
        {/* Header with Title and Icon */}
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2 bg-violet-100 rounded-lg flex-shrink-0">
            <FileText className="h-5 w-5 text-violet-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 mb-1 leading-tight">
              {document.title}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2">
              {document.description}
            </p>
          </div>
        </div>

        {/* Dates */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="font-medium">Effective:</span>
            <span className="ml-1">{formatDate(document.effective_date)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="font-medium">Expires:</span>
            <span className="ml-1">{document.expires_date ? formatDate(document.expires_date) : 'N/A'}</span>
            <Badge 
              variant="secondary" 
              className={cn("ml-2 text-xs", getStatusColor(document.status))}
            >
              {document.status}
            </Badge>
          </div>
        </div>

        {/* View Document Button */}
        <div className="mt-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full gap-2 border-violet-600 text-violet-600 hover:bg-violet-50"
            onClick={() => onViewDocument(document)}
          >
            <Eye className="h-4 w-4" />
            View Document
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};