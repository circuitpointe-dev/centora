
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { SideDialog, SideDialogContent, SideDialogHeader, SideDialogTitle, SideDialogTrigger } from '@/components/ui/side-dialog';
import { useToast } from '@/hooks/use-toast';
import { NewDonorForm } from '@/components/fundraising/NewDonorForm';
import FundingCycles from '@/components/fundraising/FundingCycles';
import DonorList from '@/components/fundraising/DonorList';

const DonorManagementPage = () => {
  const [newDonorOpen, setNewDonorOpen] = useState(false);
  const { toast } = useToast();

  const handleNewDonorSubmit = (donorData: any) => {
    console.log("New donor data:", donorData);
    setNewDonorOpen(false);
    toast({
      title: "New Donor Created",
      description: `${donorData.organization} has been successfully added to your donor list.`,
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-medium text-gray-900">Donor Management</h1>
        

      {/* Funding Cycles Section - Full Width */}
      <div className="w-full">
        <FundingCycles />
      </div>

      {/* Donor List Section */}
      <DonorList />
    </div>
  );
};

export default DonorManagementPage;
