import React from 'react';
import { EmptyState } from '@/components/ui/empty-state';
import { BarChart3 } from 'lucide-react';

interface EmptyDonorSnapshotProps {
  onAddDonor?: () => void;
}

export const EmptyDonorSnapshot: React.FC<EmptyDonorSnapshotProps> = ({ onAddDonor }) => {
  return (
    <EmptyState
      icon={BarChart3}
      title="No Donor Data Available"
      description="Add donors to your database to see analytics and insights about your donor base and their giving patterns."
      action={onAddDonor ? {
        label: "Add Donors",
        onClick: onAddDonor
      } : undefined}
      className="min-h-[250px]"
    />
  );
};