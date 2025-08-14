import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Clock, Send, Trophy, X } from 'lucide-react';

interface EmptyOpportunityColumnProps {
  status: string;
  onCreateOpportunity?: () => void;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'To Review':
      return {
        icon: FileText,
        title: 'No Opportunities to Review',
        description: 'New opportunities will appear here for initial review and assessment.',
        showButton: true,
      };
    case 'In Progress':
      return {
        icon: Clock,
        title: 'No Active Opportunities',
        description: 'Opportunities currently being worked on will appear here.',
        showButton: true,
      };
    case 'Submitted':
      return {
        icon: Send,
        title: 'No Submitted Proposals',
        description: 'Proposals that have been submitted and are awaiting response will appear here.',
        showButton: false,
      };
    case 'Awarded':
      return {
        icon: Trophy,
        title: 'No Awarded Opportunities',
        description: 'Congratulations on future wins! Successful opportunities will appear here.',
        showButton: false,
      };
    case 'Declined':
      return {
        icon: X,
        title: 'No Declined Opportunities',
        description: 'Opportunities that were not successful will appear here for learning.',
        showButton: false,
      };
    default:
      return {
        icon: FileText,
        title: 'No Opportunities',
        description: 'Opportunities will appear here.',
        showButton: true,
      };
  }
};

export const EmptyOpportunityColumn: React.FC<EmptyOpportunityColumnProps> = ({
  status,
  onCreateOpportunity,
}) => {
  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center min-h-[200px]">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-muted-foreground" />
      </div>
      <h3 className="text-sm font-medium text-foreground mb-2">{config.title}</h3>
      <p className="text-xs text-muted-foreground mb-4 max-w-[200px] leading-relaxed">
        {config.description}
      </p>
      {config.showButton && onCreateOpportunity && (
        <Button
          onClick={onCreateOpportunity}
          variant="outline"
          size="sm"
          className="text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Opportunity
        </Button>
      )}
    </div>
  );
};