
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { useGrantFormData } from './hooks/useGrantFormData';
import { GrantFormTabNavigation } from './components/GrantFormTabNavigation';
import { GrantFormTabContent } from './components/GrantFormTabContent';
import { GrantFormActions } from './components/GrantFormActions';
import { SuccessDialog } from './SuccessDialog';

const NewGrantPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const { formData, updateFormData } = useGrantFormData();

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'grantee-details', label: 'Grantee Details' },
    { id: 'grantee-submission', label: 'Submissions Setup' },
    { id: 'disbursement-schedule', label: 'Disbursement Schedule' },
    { id: 'compliance-checklist', label: 'Compliance Checklist' },
  ];

  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
  const isFirstTab = currentTabIndex === 0;
  const isLastTab = currentTabIndex === tabs.length - 1;

  const handleBack = () => {
    if (!isFirstTab) {
      setActiveTab(tabs[currentTabIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (!isLastTab) {
      setActiveTab(tabs[currentTabIndex + 1].id);
    }
  };

  const handleSaveDraft = () => {
    console.log('Saving draft:', formData);
    toast({
      title: "Draft saved",
      description: "Your grant draft has been saved successfully.",
    });
  };

  const handleSave = () => {
    console.log('Saving grant:', formData);
    setShowSuccessDialog(true);
  };

  const handleSuccessConfirm = () => {
    setShowSuccessDialog(false);
    navigate('/dashboard/grants/active-grants');
  };

  return (
    <div className="w-full p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold">Create New Grant</h1>
          <p className="text-sm text-gray-600 mt-1">Create a new grant with all required details</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <GrantFormTabNavigation tabs={tabs} />
        <GrantFormTabContent formData={formData} updateFormData={updateFormData} />
      </Tabs>

      <GrantFormActions
        isFirstTab={isFirstTab}
        isLastTab={isLastTab}
        onBack={handleBack}
        onNext={handleNext}
        onSaveDraft={handleSaveDraft}
        onSave={handleSave}
      />

      <SuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        onConfirm={handleSuccessConfirm}
      />
    </div>
  );
};

export default NewGrantPage;
