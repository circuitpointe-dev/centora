import React from 'react';
import { EmptyState } from '@/components/ui/empty-state';
import { Calendar } from 'lucide-react';

interface EmptyFundingCyclesProps {
  onAddCycle?: () => void;
}

export const EmptyFundingCycles: React.FC<EmptyFundingCyclesProps> = ({ onAddCycle }) => {
  return (
    <EmptyState
      icon={Calendar}
      title="No Funding Cycles Found"
      description="You haven't created any funding cycles yet. Add your first funding cycle to start tracking donor opportunities and timelines."
      action={onAddCycle ? {
        label: "Add Funding Cycle",
        onClick: onAddCycle
      } : undefined}
      className="min-h-[300px]"
    />
  );
};