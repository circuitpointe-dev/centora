import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ComplianceDocumentCardProps {
  document: {
    id: string;
    title: string;
    description: string;
    department: string;
    effective_date: string;
    expires_date: string;
    status: 'Active' | 'Pending' | 'Retired';
  };
  onViewDocument: (document: any) => void;
}

export const ComplianceDocumentCard = ({ document, onViewDocument }: ComplianceDocumentCardProps) => {
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
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onViewDocument(document)}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">{document.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{document.description}</p>
            </div>
            <Badge className={getStatusColor(document.status)}>
              {document.status}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>
                Effective: {new Date(document.effective_date).toLocaleDateString()}
              </span>
            </div>
            {document.expires_date && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>
                  Expires: {new Date(document.expires_date).toLocaleDateString()}
                </span>
              </div>
            )}
            <div className="text-sm text-gray-500">
              Department: {document.department}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-gray-500">
              Last updated {formatDistanceToNow(new Date(document.effective_date), { addSuffix: true })}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={(e) => {
                e.stopPropagation();
                onViewDocument(document);
              }}
            >
              <Eye className="h-4 w-4" />
              View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};