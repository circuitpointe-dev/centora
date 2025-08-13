import React from 'react';
import { EmptyState } from '@/components/ui/empty-state';
import { Users } from 'lucide-react';

interface EmptyDonorListProps {
  onAddDonor?: () => void;
}

export const EmptyDonorList: React.FC<EmptyDonorListProps> = ({ onAddDonor }) => {
  return (
    <EmptyState
      icon={Users}
      title="No Donors Yet"
      description="Start building your donor network by adding your first donor. Track their information, donation history, and engagement."
      action={onAddDonor ? {
        label: "Add First Donor",
        onClick: onAddDonor
      } : undefined}
      className="min-h-[400px]"
    />
  );
};