import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, Building2, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PolicyCardProps {
  policy: {
    id: string;
    title: string;
    version: string;
    last_updated: string;
    status: string;
    description: string;
    department: string;
  };
  onViewPolicy: (policy: any) => void;
}

export const PolicyCard = ({ policy, onViewPolicy }: PolicyCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'acknowledged':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-gray-900 text-lg leading-tight">
              {policy.title}
            </h3>
            <Badge className={cn(getStatusColor(policy.status))}>
              {policy.status}
            </Badge>
          </div>
          
          {policy.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {policy.description}
            </p>
          )}
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Building2 className="h-3 w-3" />
              <span>{policy.department}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <CalendarDays className="h-3 w-3" />
              <span>
                Updated {new Date(policy.last_updated).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Version {policy.version}</span>
            </div>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewPolicy(policy)}
          className="w-full"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Policy
        </Button>
      </CardContent>
    </Card>
  );
};