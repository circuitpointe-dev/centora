import React from 'react';
import { EmptyState } from '@/components/ui/empty-state';
import { Calendar } from 'lucide-react';

export const EmptyFundingCycles: React.FC = () => {
  return (
    <EmptyState
      icon={Calendar}
      title="No Funding Cycles Found"
      description="Funding cycles will be automatically created based on your donor activities and funding opportunities. Check back once you start adding donors and tracking opportunities."
      className="min-h-[300px]"
    />
  );
};