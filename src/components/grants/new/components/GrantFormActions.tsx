
import React from 'react';
import { Button } from '@/components/ui/button';

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
    <div className="flex justify-between items-center pt-6 mt-8 max-w-2xl mx-auto">
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isFirstTab}
        >
          Back
        </Button>
        <Button
          variant="outline"
          onClick={onSaveDraft}
        >
          Save Draft
        </Button>
      </div>
      
      <div className="flex gap-3">
        {isLastTab ? (
          <Button 
            onClick={onSave}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Preview
          </Button>
        ) : (
          <Button 
            onClick={onNext}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};
