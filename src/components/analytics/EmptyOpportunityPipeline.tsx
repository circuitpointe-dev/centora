import React from 'react';
import { EmptyState } from '@/components/ui/empty-state';
import { TrendingUp } from 'lucide-react';

interface EmptyOpportunityPipelineProps {
  onCreateOpportunity?: () => void;
}

export const EmptyOpportunityPipeline: React.FC<EmptyOpportunityPipelineProps> = ({ onCreateOpportunity }) => {
  return (
    <EmptyState
      icon={TrendingUp}
      title="No Opportunities Tracked"
      description="Start tracking funding opportunities to visualize your pipeline and forecast potential revenue."
      action={onCreateOpportunity ? {
        label: "Create Opportunity",
        onClick: onCreateOpportunity
      } : undefined}
      className="min-h-[250px]"
    />
  );
};