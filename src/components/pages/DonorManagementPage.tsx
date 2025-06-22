
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
        
        {/* Quick Actions at top right */}
        <div className="flex items-center gap-2">
          {/* New Donor Quick Action */}
          <SideDialog open={newDonorOpen} onOpenChange={setNewDonorOpen}>
            <SideDialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white">
                <UserPlus className="h-4 w-4" />
                New Donor
              </Button>
            </SideDialogTrigger>
            <SideDialogContent className="w-full sm:w-[600px]">
              <SideDialogHeader>
                <SideDialogTitle>Add New Donor</SideDialogTitle>
              </SideDialogHeader>
              <NewDonorForm 
                onSubmit={handleNewDonorSubmit} 
                onCancel={() => setNewDonorOpen(false)} 
              />
            </SideDialogContent>
          </SideDialog>
        </div>
      </div>

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
