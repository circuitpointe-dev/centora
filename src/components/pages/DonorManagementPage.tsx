
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { SideDialog, SideDialogContent, SideDialogHeader, SideDialogTitle, SideDialogTrigger } from '@/components/ui/side-dialog';
import { useToast } from '@/hooks/use-toast';
import { NewDonorForm } from '@/components/fundraising/NewDonorForm';
import FundingCycles from '@/components/fundraising/FundingCycles';
import DonorList from '@/components/fundraising/DonorList';

const DonorManagementPage = () => {
  const [searchParams] = useSearchParams();
  const donorId = searchParams.get('donor');
  const [newDonorOpen, setNewDonorOpen] = useState(false);
  const { toast } = useToast();

  const handleNewDonorSubmit = () => {
    // Form submission is now handled internally by NewDonorForm
    setNewDonorOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-medium text-gray-900">Donor Management</h1>
      </div>

      {/* Funding Cycles Section - Full Width */}
      <div className="w-full">
        <FundingCycles />
      </div>

      {/* Donor List Section */}
      <DonorList initialDonorId={donorId || undefined} />
    </div>
  );
};

export default DonorManagementPage;
