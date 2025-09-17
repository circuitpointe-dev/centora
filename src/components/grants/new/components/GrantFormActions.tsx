import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Save, FileText } from 'lucide-react';

interface GrantFormActionsProps {
  isFirstTab: boolean;
  isLastTab: boolean;
  onBack: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
  onSave: () => void;
}

export const GrantFormActions: React.FC<GrantFormActionsProps> = ({
  isFirstTab,
  isLastTab,
  onBack,
  onNext,
  onSaveDraft,
  onSave,
}) => {
  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t">
      <div className="flex gap-2">
        <Button variant="outline" onClick={onSaveDraft}>
          <Save className="h-4 w-4 mr-2" />
          Save Draft
        </Button>
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isFirstTab}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        
        {isLastTab ? (
          <Button
            onClick={onSave}
            className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Review & Submit
          </Button>
        ) : (
          <Button
            onClick={onNext}
            className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};