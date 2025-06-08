
import React, { useState } from 'react';
import FundingCycles from '@/components/fundraising/FundingCycles';
import DonorList from '@/components/fundraising/DonorList';
import FocusAreasCard from '@/components/fundraising/FocusAreasCard';
import NewDonorDialog from '@/components/fundraising/NewDonorDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { SideDialog, SideDialogContent, SideDialogHeader, SideDialogTitle, SideDialogTrigger } from '@/components/ui/side-dialog';
import { FocusAreaForm } from '@/components/fundraising/FocusAreaForm';

const DonorManagementPage = () => {
  const [isCreateFocusAreaOpen, setIsCreateFocusAreaOpen] = useState(false);

  const handleCreateFocusArea = (focusAreaData: any) => {
    console.log("New focus area data:", focusAreaData);
    // Here you would typically send the data to your backend
    setIsCreateFocusAreaOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Donor Management</h1>
        
        {/* Quick Action Buttons */}
        <div className="flex gap-3">
          <SideDialog open={isCreateFocusAreaOpen} onOpenChange={setIsCreateFocusAreaOpen}>
            <SideDialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent text-black hover:bg-gray-50 border border-gray-300">
                <Plus className="h-4 w-4" />
                Create Focus Area
              </Button>
            </SideDialogTrigger>
            <SideDialogContent className="overflow-hidden">
              <SideDialogHeader>
                <SideDialogTitle>Create Focus Area</SideDialogTitle>
              </SideDialogHeader>
              <div className="flex-1 overflow-y-auto p-6">
                <FocusAreaForm
                  onSave={handleCreateFocusArea}
                  onCancel={() => setIsCreateFocusAreaOpen(false)}
                />
              </div>
            </SideDialogContent>
          </SideDialog>
          
          <NewDonorDialog />
        </div>
      </div>

      {/* Funding Cycles and Focus Areas Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <FundingCycles />
        </div>
        <div className="lg:col-span-2">
          <FocusAreasCard />
        </div>
      </div>

      {/* Donor List Section */}
      <DonorList />
    </div>
  );
};

export default DonorManagementPage;
