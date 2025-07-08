import React from 'react';
import { Calendar, Eye, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PolicyDocument } from './data/policyLibraryData';

interface PolicyCardProps {
  policy: PolicyDocument;
  onViewPolicy: (policy: PolicyDocument) => void;
}

export const PolicyCard: React.FC<PolicyCardProps> = ({ policy, onViewPolicy }) => {
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Acknowledged':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Expired':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer group h-full flex flex-col">
      <CardContent className="p-6 flex flex-col h-full">
        {/* Header with Status Badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-violet-700 transition-colors truncate">
              {policy.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">Version {policy.version}</p>
          </div>
          <Badge className={cn('ml-3 flex-shrink-0', getStatusBadgeStyle(policy.status))}>
            {policy.status}
          </Badge>
        </div>

        {/* Description - This will grow but be constrained */}
        <div className="flex-1 min-h-[60px] mb-4 overflow-hidden">
          <p className="text-gray-600 text-sm line-clamp-3">
            {policy.description}
          </p>
        </div>

        {/* Footer - Pushed to bottom */}
        <div className="mt-auto">
          {/* Meta Information */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 flex-shrink-0" />
              <span>Updated {new Date(policy.lastUpdated).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <span className="truncate">{policy.department}</span>
          </div>

          {/* Action Button - Always at bottom */}
          <Button
            onClick={() => onViewPolicy(policy)}
            variant="outline"
            size="sm"
            className="w-full group-hover:border-violet-300 group-hover:text-violet-700 transition-colors"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Policy
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};